"""Stock storage safeguards using fictional records, without workflow endpoints."""
import concurrent.futures
import json
from pathlib import Path
import sqlite3
import tempfile
import unittest
from unittest.mock import patch
import uuid

from backend import schema
from backend.role_policy import assign_staff_member
from backend.sessions import _digest

STOCK_TABLES = (
    "it_asset_stock_items", "it_asset_stock_units",
    "it_asset_stock_movements", "it_asset_stock_entries",
)


def database(*, version=16):
    connection = sqlite3.connect(":memory:")
    connection.execute("PRAGMA foreign_keys=ON")
    with patch.object(schema, "SCHEMA_VERSION", version):
        schema.initialise_database(connection)
    return connection


def seed_people(connection):
    connection.execute(
        "INSERT INTO accounts(id,username,password_hash,is_admin,mfa_secret,mfa_confirmed) "
        "VALUES(1,'Fictional Owner','fixture hash',1,'fixture secret',1)")
    assign_staff_member(connection, 1)
    connection.execute(
        "INSERT INTO accounts(id,username,password_hash,mfa_secret,mfa_confirmed) "
        "VALUES(2,'Fictional Reader','retained hash','retained secret',1)")
    assign_staff_member(connection, 2)
    connection.execute("INSERT INTO account_permission_overrides VALUES(2,'IT Assets','read')")
    connection.execute("INSERT INTO departments(id,name) VALUES('department','Fictional Department')")
    connection.execute(
        "INSERT INTO staff_members(id,first_name,department_id,account_id) "
        "VALUES('person','Fictional Staff','department',2)")
    connection.execute("INSERT INTO staff_members(id,first_name) VALUES('other','Other Staff')")
    connection.execute("INSERT INTO account_sessions VALUES(?,2,9999999999,1)", (_digest("a" * 64),))
    connection.execute(
        "INSERT INTO account_profiles(account_id,first_name,email) "
        "VALUES(2,'Fictional Reader','reader@example.invalid')")
    connection.commit()


def device(connection, key="device"):
    connection.execute(
        "INSERT INTO inventory_devices(id,name,record_json,ordinal) VALUES(?,?,?,?)",
        (key, "Fictional " + key, json.dumps({"id": key, "type": "Laptop"}),
         connection.execute("SELECT count(*) FROM inventory_devices").fetchone()[0]))
    connection.commit()


def item(connection, mode="quantity", **values):
    values = dict(id=uuid.uuid4().hex, name="Fictional Equipment", tracking_mode=mode, **values)
    keys = list(values)
    connection.execute(
        "INSERT INTO it_asset_stock_items(" + ",".join(keys) + ") VALUES(" +
        ",".join("?" for _ in keys) + ")", [values[key] for key in keys])
    connection.commit()
    return values["id"]


def post_fixture(connection, kind, entries, **header):
    """Publish synthetic journal facts solely to exercise database constraints."""
    connection.execute("BEGIN IMMEDIATE")
    try:
        movement = connection.execute(
            "SELECT coalesce(max(id),0)+1 FROM it_asset_stock_movements").fetchone()[0]
        identities = []
        for entry in entries:
            values = dict(entry, movement_id=movement)
            keys = list(values)
            identities.append(connection.execute(
                "INSERT INTO it_asset_stock_entries(" + ",".join(keys) + ") VALUES(" +
                ",".join("?" for _ in keys) + ")", [values[key] for key in keys]).lastrowid)
        values = dict(id=movement, operation_key="fixture-" + str(movement), kind=kind,
                      event_date="2026-11-15", actor_id=1, actor_label="Fictional Owner", **header)
        keys = list(values)
        connection.execute(
            "INSERT INTO it_asset_stock_movements(" + ",".join(keys) + ") VALUES(" +
            ",".join("?" for _ in keys) + ")", [values[key] for key in keys])
        connection.commit()
        return movement, identities
    except BaseException:
        connection.rollback()
        raise


def specification(connection, manufacturer="", model="", shared=None):
    return connection.execute(
        "SELECT json_object('manufacturer',?,'model',?,'sharedSpecifications',json(?))",
        (manufacturer, model, json.dumps(shared or {}))).fetchone()[0]


class StockMigrationTests(unittest.TestCase):
    def connection(self, version=15):
        connection = database(version=version)
        self.addCleanup(connection.close)
        return connection

    def upgrade_stock_foundation(self, db):
        # Keep this historical migration's exact preservation checks. The later
        # assignment-closure migration has its own current-schema coverage.
        with patch.object(schema, "SCHEMA_VERSION", 16):
            schema.initialise_database(db)

    def test_every_existing_feature_choice_and_security_record_survives(self):
        for flags in range(8):
            with self.subTest(flags=flags):
                db = self.connection()
                seed_people(db)
                device(db)
                db.execute(
                    "INSERT INTO device_assignments(device_id,staff_id,recipient_label,"
                    "assigned_at,actor_id,actor_label) VALUES"
                    "('device','person','Fictional Staff','2026-11-15',1,'Fictional Owner')")
                for offset, name in enumerate(("devices", "ipam", "racks")):
                    db.execute("UPDATE organisation_features SET enabled=? WHERE feature=?",
                               ((flags >> offset) & 1, name))
                db.commit()
                tables = [row[0] for row in db.execute(
                    "SELECT name FROM sqlite_master WHERE type='table' "
                    "AND name NOT IN ('sqlite_sequence','schema_migrations','organisation_features')")]
                before = {name: db.execute("SELECT * FROM " + name).fetchall() for name in tables}
                guards = db.execute("SELECT name,sql FROM sqlite_master WHERE type='trigger'").fetchall()
                features = dict(db.execute("SELECT * FROM organisation_features"))
                self.upgrade_stock_foundation(db)
                self.assertEqual(
                    {name: db.execute("SELECT * FROM " + name).fetchall() for name in tables}, before)
                self.assertEqual(dict(db.execute("SELECT * FROM organisation_features")),
                                 dict(features, it_assets=0))
                for name in STOCK_TABLES:
                    self.assertEqual(db.execute("SELECT count(*) FROM " + name).fetchone(), (0,))
                for name, definition in guards:
                    self.assertEqual(db.execute(
                        "SELECT sql FROM sqlite_master WHERE name=?", (name,)).fetchone(), (definition,))
                self.assertEqual(db.execute("PRAGMA foreign_key_check").fetchall(), [])

    def test_fresh_defaults_repeat_and_enabled_choice_are_preserved(self):
        db = self.connection(16)
        self.assertEqual(list(db.execute("SELECT DISTINCT enabled FROM organisation_features")), [(0,)])
        db.execute("UPDATE organisation_features SET enabled=1 WHERE feature='it_assets'")
        db.commit()
        before = tuple(db.iterdump())
        self.upgrade_stock_foundation(db)
        self.assertEqual(tuple(db.iterdump()), before)

    def test_last_trigger_and_migration_marker_failures_roll_back_everything(self):
        for action, name in ((sqlite3.SQLITE_CREATE_TRIGGER, "it_asset_specifications_apply"),
                             (sqlite3.SQLITE_INSERT, "schema_migrations")):
            with self.subTest(name=name):
                db = self.connection()
                seed_people(db)
                before = tuple(db.iterdump())
                db.set_authorizer(lambda operation, target, *args:
                                  sqlite3.SQLITE_DENY if (operation, target) == (action, name)
                                  else sqlite3.SQLITE_OK)
                with self.assertRaises(sqlite3.DatabaseError):
                    self.upgrade_stock_foundation(db)
                db.set_authorizer(None)
                self.assertEqual(tuple(db.iterdump()), before)

    def test_unexpected_objects_and_feature_dependencies_fail_without_adoption(self):
        definitions = (
            "CREATE TABLE it_asset_stock_items(unexpected TEXT)",
            "CREATE VIEW IT_ASSET_unexpected AS SELECT 1",
            "CREATE TABLE organisation_features_next(unexpected TEXT)",
            "CREATE INDEX custom_features ON organisation_features(enabled)",
            "CREATE VIEW custom_feature_view AS SELECT * FROM organisation_features",
            "CREATE TABLE custom_link(feature TEXT REFERENCES organisation_features(feature))",
        )
        for definition in definitions:
            with self.subTest(definition=definition):
                db = self.connection()
                db.execute(definition)
                db.commit()
                before = tuple(db.iterdump())
                with self.assertRaises(RuntimeError):
                    self.upgrade_stock_foundation(db)
                self.assertEqual(tuple(db.iterdump()), before)

    def test_completed_schema_rejects_missing_guards_and_unexpected_dependencies(self):
        for definition in (
                "DROP TRIGGER it_asset_entries_no_update",
                "CREATE INDEX unexpected_stock_index ON it_asset_stock_items(name)",
                "CREATE VIEW IT_ASSET_unexpected AS SELECT 1"):
            with self.subTest(definition=definition):
                db = self.connection(16)
                db.execute(definition)
                db.commit()
                before = tuple(db.iterdump())
                with self.assertRaises(RuntimeError):
                    self.upgrade_stock_foundation(db)
                self.assertEqual(tuple(db.iterdump()), before)

    def test_existing_broken_relationships_are_not_silently_repaired(self):
        db = self.connection()
        db.execute("PRAGMA foreign_keys=OFF")
        db.execute("INSERT INTO staff_members(first_name,department_id) VALUES('Fixture','missing')")
        db.commit()
        db.execute("PRAGMA foreign_keys=ON")
        before = tuple(db.iterdump())
        with self.assertRaisesRegex(RuntimeError, "relationships"):
            self.upgrade_stock_foundation(db)
        self.assertEqual(tuple(db.iterdump()), before)


class StockConstraintTests(unittest.TestCase):
    def setUp(self):
        self.db = database()
        self.addCleanup(self.db.close)
        seed_people(self.db)

    def rejects(self, action):
        before = tuple(self.db.iterdump())
        with self.assertRaises(sqlite3.DatabaseError):
            try:
                action()
            finally:
                self.db.rollback()
        self.assertEqual(tuple(self.db.iterdump()), before)

    def post(self, kind, entries, **header):
        return post_fixture(self.db, kind, entries, **header)

    def receipt(self, stock_item, quantity=10):
        return self.post("received", [
            dict(stock_item_id=stock_item, quantity=quantity, to_state="awaiting_checks")],
            supplier_name="Fictional Purchasing Supplier")

    def ready(self, stock_item, quantity=10):
        self.post("readiness_changed", [
            dict(stock_item_id=stock_item, quantity=quantity,
                 from_state="awaiting_checks", to_state="ready")])

    def test_minimum_level_is_optional_whole_nonnegative_and_quantity_only(self):
        for threshold in (None, 0, 1, 9007199254740991):
            key = item(self.db, minimum_stock_level=threshold)
            self.assertEqual(self.db.execute(
                "SELECT minimum_stock_level FROM it_asset_stock_items WHERE id=?", (key,)
            ).fetchone(), (threshold,))
        for threshold in (-1, 0.5, "invalid", 9007199254740992):
            self.rejects(lambda: item(self.db, minimum_stock_level=threshold))
        for threshold in (0, 1):
            self.rejects(lambda: item(self.db, "individual", minimum_stock_level=threshold))

    def test_tracking_mode_changes_only_before_history_and_preserves_unit_consistency(self):
        key = item(self.db)
        self.db.execute(
            "UPDATE it_asset_stock_items SET tracking_mode='individual' WHERE id=?", (key,))
        self.db.execute(
            "INSERT INTO it_asset_stock_units(stock_item_id) VALUES(?)", (key,))
        self.db.commit()
        self.rejects(lambda: self.db.execute(
            "UPDATE it_asset_stock_items SET tracking_mode='quantity' WHERE id=?", (key,)))
        quantity = item(self.db)
        self.receipt(quantity)
        self.rejects(lambda: self.db.execute(
            "UPDATE it_asset_stock_items SET tracking_mode='individual' WHERE id=?", (quantity,)))
        self.rejects(lambda: self.post("received", [
            dict(stock_item_id=key, quantity=1, to_state="awaiting_checks")]))
        self.rejects(lambda: self.db.execute(
            "INSERT INTO it_asset_stock_units(stock_item_id) VALUES(?)", (quantity,)))

    def test_assignment_history_also_locks_tracking_without_inferred_stock(self):
        key = item(self.db)
        device(self.db)
        self.db.execute(
            "INSERT INTO it_asset_stock_units(stock_item_id,device_id) VALUES(?,'device')", (key,))
        self.db.execute(
            "INSERT INTO device_assignments(device_id,staff_id,recipient_label,assigned_at,"
            "actor_id,actor_label) VALUES('device','person','Fixture','2026-11-15',1,'Owner')")
        self.db.commit()
        self.rejects(lambda: self.db.execute(
            "UPDATE it_asset_stock_items SET tracking_mode='individual' WHERE id=?", (key,)))
        self.assertEqual(self.db.execute("SELECT count(*) FROM it_asset_stock_entries").fetchone(), (0,))

    def test_optional_serials_allow_distinct_individual_units(self):
        key = item(self.db, "individual")
        units = [uuid.uuid4().hex for _ in range(2)]
        for identity in units:
            self.db.execute(
                "INSERT INTO it_asset_stock_units(id,stock_item_id) VALUES(?,?)", (identity, key))
        self.db.commit()
        self.post("received", [
            dict(stock_unit_id=identity, quantity=1, to_state="awaiting_checks") for identity in units])
        self.rejects(lambda: self.post("received", [
            dict(stock_unit_id=units[0], quantity=1, to_state="awaiting_checks")]))
        self.rejects(lambda: self.post("received", [
            dict(stock_unit_id=units[1], quantity=2, to_state="awaiting_checks")]))

    def test_shared_specifications_reject_incompatible_or_ambiguous_values(self):
        valid = dict(processor="Fictional CPU", memory=16, memoryUnit="GB",
                     storage=512, storageUnit="GB", storageMedium="NVMe SSD")
        item(self.db, device_type="Laptop", shared_spec_json=json.dumps(valid))
        for value in (
                '{"memory":true,"memoryUnit":"GB"}',
                '{"memory":16}', '{"storage":0,"storageUnit":"GB"}',
                '{"memory":16,"memory":32,"memoryUnit":"GB"}',
                '{"storage":1e999,"storageUnit":"GB"}',
                '{"hostname":"not shared"}', '{"storageMedium":null}', '[]', 'invalid'):
            self.rejects(lambda: item(self.db, device_type="Laptop", shared_spec_json=value))
        self.rejects(lambda: item(self.db, shared_spec_json=json.dumps(valid)))
        self.rejects(lambda: item(self.db, device_type="Monitor", shared_spec_json=json.dumps(valid)))

    def test_entries_require_valid_references_recipients_and_transitions(self):
        key = item(self.db)
        self.rejects(lambda: self.post("received", [
            dict(stock_item_id="missing", quantity=1, to_state="awaiting_checks")]))
        self.rejects(lambda: self.post("readiness_changed", [
            dict(stock_item_id=key, quantity=1, to_state="ready")]))
        self.receipt(key)
        self.ready(key)
        for overrides in (
                dict(staff_id=None, recipient_label=None),
                dict(staff_id="missing"),
                dict(department_id="department"),
                dict(quantity=0), dict(quantity=-1), dict(quantity=0.5),
                dict(from_state="written_off")):
            entry = dict(stock_item_id=key, quantity=1, from_state="ready", to_state="issued",
                         staff_id="person", recipient_label="Fictional Staff")
            entry.update(overrides)
            self.rejects(lambda: self.post("issued", [entry]))

    def test_history_is_append_only_and_closed_movements_cannot_gain_entries(self):
        key = item(self.db)
        movement, entries = self.receipt(key)
        for table, identity in (("it_asset_stock_movements", movement),
                                ("it_asset_stock_entries", entries[0])):
            self.rejects(lambda: self.db.execute("DELETE FROM " + table + " WHERE id=?", (identity,)))
            self.rejects(lambda: self.db.execute("UPDATE " + table + " SET id=id WHERE id=?", (identity,)))
            self.rejects(lambda: self.db.execute(
                "INSERT OR REPLACE INTO " + table + " SELECT * FROM " + table + " WHERE id=?", (identity,)))
        self.rejects(lambda: self.db.execute(
            "INSERT INTO it_asset_stock_entries(movement_id,stock_item_id,quantity,to_state) "
            "VALUES(?,?,1,'awaiting_checks')", (movement, key)))
        def orphan():
            self.db.execute(
                "INSERT INTO it_asset_stock_entries(movement_id,stock_item_id,quantity,to_state) "
                "VALUES(999,?,1,'awaiting_checks')", (key,))
            self.db.commit()
        self.rejects(orphan)

    def test_corrections_preserve_original_quantity_supplier_actor_and_dates(self):
        key = item(self.db)
        movement, entries = self.receipt(key)
        original = entries[0]
        self.post("corrected", [
            dict(stock_item_id=key, quantity=2, from_state="awaiting_checks")],
            corrects_entry_id=original, previous_quantity=10, corrected_quantity=8,
            reason="Correct a fictional count")
        self.post("corrected", [
            dict(stock_item_id=key, quantity=1, to_state="awaiting_checks")],
            corrects_entry_id=original, previous_quantity=8, corrected_quantity=9,
            reason="Correct the fixture again")
        self.rejects(lambda: self.post("corrected", [
            dict(stock_item_id=key, quantity=1, to_state="awaiting_checks")],
            corrects_entry_id=original, previous_quantity=8, corrected_quantity=9,
            reason="Stale fixture"))
        self.assertEqual(self.db.execute(
            "SELECT quantity FROM it_asset_stock_entries WHERE id=?", (original,)).fetchone(), (10,))
        self.assertEqual(self.db.execute(
            "SELECT supplier_name,event_date FROM it_asset_stock_movements WHERE id=?",
            (movement,)).fetchone(), ("Fictional Purchasing Supplier", "2026-11-15"))
        self.db.execute("DELETE FROM accounts WHERE id=1")
        self.db.commit()
        self.assertEqual(self.db.execute(
            "SELECT actor_id,actor_label FROM it_asset_stock_movements WHERE id=?",
            (movement,)).fetchone(), (1, "Fictional Owner"))

    def test_later_receipts_cannot_hide_impossible_historical_corrections(self):
        key = item(self.db)
        _, original = self.receipt(key, 20)
        self.ready(key, 20)
        self.receipt(key, 10)
        self.rejects(lambda: self.post("corrected", [
            dict(stock_item_id=key, quantity=10, from_state="awaiting_checks")],
            corrects_entry_id=original[0], previous_quantity=20, corrected_quantity=10,
            reason="Would invalidate earlier preparation"))

    def test_partial_returns_cannot_exceed_or_change_original_recipient(self):
        key = item(self.db)
        self.receipt(key)
        self.ready(key)
        _, entries = self.post("issued", [
            dict(stock_item_id=key, quantity=3, from_state="ready", to_state="issued",
                 staff_id="person", recipient_label="Fictional Staff")])
        returned = dict(stock_item_id=key, quantity=2, from_state="issued",
                        to_state="awaiting_checks", staff_id="person",
                        recipient_label="Fictional Staff", source_issue_entry_id=entries[0])
        self.post("returned", [returned])
        self.rejects(lambda: self.post("returned", [returned]))
        self.rejects(lambda: self.post("returned", [dict(returned, quantity=1, staff_id="other")]))

    def test_device_registration_preserves_held_total_and_assignment_safeguards(self):
        key = item(self.db, device_type="Laptop")
        self.receipt(key)
        self.ready(key)
        device(self.db)
        unit = uuid.uuid4().hex
        self.db.execute(
            "INSERT INTO it_asset_stock_units(id,stock_item_id,device_id) VALUES(?,?,'device')",
            (unit, key))
        self.db.commit()
        self.rejects(lambda: self.db.execute(
            "INSERT OR REPLACE INTO it_asset_stock_units(id,stock_item_id,device_id) "
            "VALUES(?,?,'device')", (uuid.uuid4().hex, key)))
        self.post("registered", [
            dict(stock_item_id=key, quantity=1, from_state="ready"),
            dict(stock_unit_id=unit, quantity=1, to_state="ready")])
        held = self.db.execute(
            "SELECT sum(quantity*((to_state IS 'ready')-(from_state IS 'ready'))) "
            "FROM it_asset_stock_entries").fetchone()[0]
        self.assertEqual(held, 10)
        issued = dict(stock_unit_id=unit, quantity=1, from_state="ready", to_state="issued",
                      staff_id="person", recipient_label="Fictional Staff")
        self.rejects(lambda: self.post("issued", [issued]))
        self.db.execute(
            "INSERT INTO device_assignments(device_id,staff_id,recipient_label,assigned_at,"
            "actor_id,actor_label) VALUES('device','person','Fixture','2026-11-15',1,'Owner')")
        assignment = self.db.execute("SELECT id FROM device_assignments").fetchone()[0]
        self.db.commit()
        self.rejects(lambda: self.post("readiness_changed", [
            dict(stock_unit_id=unit, quantity=1, from_state="ready", to_state="awaiting_preparation")],
            reason="An active allocation cannot become held stock"))
        _, entries = self.post("issued", [dict(issued, device_assignment_id=assignment)])
        self.rejects(lambda: self.post("returned", [
            dict(issued, from_state="issued", to_state="ready",
                 device_assignment_id=assignment, source_issue_entry_id=entries[0])]))
        self.rejects(lambda: self.db.execute(
            "UPDATE device_assignments SET ended_at='2026-11-16' WHERE id=?", (assignment,)))

    def test_specification_corrections_preserve_values_without_stock_entries(self):
        key = item(self.db, device_type="Laptop", manufacturer="Original Manufacturer",
                   model="Original Model", shared_spec_json='{"memory":8,"memoryUnit":"GB"}')
        self.receipt(key)
        self.rejects(lambda: self.db.execute(
            "UPDATE it_asset_stock_items SET model='Unaudited' WHERE id=?", (key,)))
        before = specification(self.db, "Original Manufacturer", "Original Model",
                               dict(memory=8, memoryUnit="GB"))
        after = specification(self.db, "Corrected Manufacturer", "Corrected Model",
                              dict(memory=16, memoryUnit="GB"))
        counts = self.db.execute(
            "SELECT count(*),sum(quantity) FROM it_asset_stock_entries").fetchone()
        movement, _ = self.post(
            "specification_corrected", [], specification_item_id=key,
            specification_before_json=before, specification_after_json=after,
            reason="Correct a fictional transcription error")
        self.assertEqual(self.db.execute(
            "SELECT manufacturer,model,specification_movement_id FROM it_asset_stock_items "
            "WHERE id=?", (key,)).fetchone(),
            ("Corrected Manufacturer", "Corrected Model", movement))
        self.assertEqual(self.db.execute(
            "SELECT specification_before_json,specification_after_json "
            "FROM it_asset_stock_movements WHERE id=?", (movement,)).fetchone(), (before, after))
        self.assertEqual(self.db.execute(
            "SELECT count(*),sum(quantity) FROM it_asset_stock_entries").fetchone(), counts)
        self.rejects(lambda: self.db.execute(
            "UPDATE it_asset_stock_items SET model='Unaudited' WHERE id=?", (key,)))
        self.rejects(lambda: self.post(
            "specification_corrected", [], specification_item_id=key,
            specification_before_json=before, specification_after_json=after,
            reason="Stale correction"))
        newer = specification(self.db, "Corrected Manufacturer", "Final Model",
                              dict(memory=16, memoryUnit="GB"))
        self.post("specification_corrected", [], specification_item_id=key,
                  specification_before_json=after, specification_after_json=newer,
                  reason="A second attributed correction")
        schema.initialise_database(self.db)

    def test_invalid_specification_corrections_roll_back_header_and_current_values(self):
        key = item(self.db, device_type="Laptop")
        self.receipt(key)
        before = specification(self.db)
        after = specification(self.db, model="Corrected")
        common = dict(specification_item_id=key, specification_before_json=before,
                      specification_after_json=after, reason="Fixture correction")
        for overrides, entries in (
                (dict(reason=""), []),
                (dict(specification_item_id="missing"), []),
                (dict(specification_after_json=before), []),
                (dict(specification_after_json=specification(
                    self.db, shared={"hostname": "not a shared specification"})), []),
                ({}, [dict(stock_item_id=key, quantity=1, to_state="awaiting_checks")])):
            self.rejects(lambda: self.post(
                "specification_corrected", entries, **dict(common, **overrides)))
        self.rejects(lambda: self.post("corrected", [], **common))

    def test_simultaneous_quantity_writers_cannot_oversubscribe_ready_stock(self):
        key = item(self.db)
        self.receipt(key)
        self.ready(key)
        with tempfile.TemporaryDirectory() as directory:
            filename = Path(directory) / "fixture.sqlite3"
            with sqlite3.connect(filename) as target:
                self.db.backup(target)
            def issue():
                with sqlite3.connect(filename, timeout=5) as connection:
                    connection.execute("PRAGMA foreign_keys=ON")
                    try:
                        post_fixture(connection, "issued", [
                            dict(stock_item_id=key, quantity=7, from_state="ready",
                                 to_state="issued", staff_id="person", recipient_label="Fixture")])
                        return True
                    except sqlite3.IntegrityError:
                        return False
            with concurrent.futures.ThreadPoolExecutor(max_workers=2) as pool:
                results = list(pool.map(lambda _: issue(), range(2)))
            self.assertEqual(sorted(results), [False, True])
