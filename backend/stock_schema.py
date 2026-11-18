"""Keep stock identities and their permanent history without inventing stock.

The database upgrade creates empty tables. Stock operations are not exposed by
this module. The journal also reserves attributed specification corrections,
separate from changes to movement quantities.
"""
import re
import sqlite3

FEATURE_UPGRADE_SQL = """
CREATE TABLE organisation_features_next (
 feature TEXT NOT NULL PRIMARY KEY CHECK(feature IN
   ('devices','ipam','racks','suppliers','equipment_lifecycle','it_assets')),
 enabled INTEGER NOT NULL CHECK(typeof(enabled)='integer' AND enabled IN (0,1)),
 CHECK(feature IN ('devices','ipam','racks','it_assets') OR enabled=0)
);
INSERT INTO organisation_features_next(feature,enabled)
 SELECT feature,enabled FROM organisation_features;
INSERT INTO organisation_features_next(feature,enabled) VALUES('it_assets',0);
DROP TABLE organisation_features;
ALTER TABLE organisation_features_next RENAME TO organisation_features;
"""
PREVIOUS_FEATURE_TABLE_SQL = """CREATE TABLE organisation_features (
                    feature TEXT PRIMARY KEY CHECK(feature IN
                        ('devices','ipam','racks','suppliers','equipment_lifecycle')),
                    enabled INTEGER NOT NULL CHECK(typeof(enabled)='integer' AND enabled IN (0,1)),
                    CHECK(feature IN ('devices','ipam','racks') OR enabled=0)
                )"""
STOCK_SCHEMA_SQL = """
CREATE TABLE it_asset_stock_items (
 id TEXT NOT NULL PRIMARY KEY DEFAULT(lower(hex(randomblob(16))))
   CHECK(length(id)=32 AND id NOT GLOB '*[^0-9a-f]*'),
 name TEXT NOT NULL CHECK(length(trim(name)) BETWEEN 1 AND 120),
 category TEXT NOT NULL DEFAULT '',
 tracking_mode TEXT NOT NULL CHECK(tracking_mode IN ('individual','quantity')),
 device_type TEXT CHECK(device_type IS NULL OR length(trim(device_type))>0),
 minimum_stock_level INTEGER CHECK(minimum_stock_level IS NULL OR
   (tracking_mode='quantity' AND typeof(minimum_stock_level)='integer'
    AND minimum_stock_level BETWEEN 0 AND 9007199254740991)),
 specification_movement_id INTEGER REFERENCES it_asset_stock_movements(id) ON DELETE RESTRICT,
 manufacturer TEXT NOT NULL DEFAULT '',
 model TEXT NOT NULL DEFAULT '',
 shared_spec_json TEXT NOT NULL DEFAULT '{}',
 CHECK(CASE WHEN json_valid(shared_spec_json) THEN
   json_type(shared_spec_json)='object'
   AND json_remove(shared_spec_json,'$.processor','$.memory','$.memoryUnit',
                   '$.storage','$.storageUnit','$.storageMedium')='{}'
   AND (json_type(shared_spec_json,'$.processor') IS NULL OR
        (json_type(shared_spec_json,'$.processor')='text'
         AND length(trim(json_extract(shared_spec_json,'$.processor'))) BETWEEN 1 AND 200))
   AND (json_type(shared_spec_json,'$.storageMedium') IS NULL OR
        (json_type(shared_spec_json,'$.storageMedium')='text'
         AND length(trim(json_extract(shared_spec_json,'$.storageMedium'))) BETWEEN 1 AND 100))
   AND (json_type(shared_spec_json,'$.memory') IS NULL OR
        (json_type(shared_spec_json,'$.memory') IN ('integer','real')
         AND json_extract(shared_spec_json,'$.memory')>0
         AND json_extract(shared_spec_json,'$.memory')<=1.7976931348623157e308))
   AND (json_type(shared_spec_json,'$.storage') IS NULL OR
        (json_type(shared_spec_json,'$.storage') IN ('integer','real')
         AND json_extract(shared_spec_json,'$.storage')>0
         AND json_extract(shared_spec_json,'$.storage')<=1.7976931348623157e308))
   AND (json_type(shared_spec_json,'$.memoryUnit') IS NULL OR
        (json_type(shared_spec_json,'$.memoryUnit')='text'
         AND json_extract(shared_spec_json,'$.memoryUnit') IN ('MB','GB','TB')))
   AND (json_type(shared_spec_json,'$.storageUnit') IS NULL OR
        (json_type(shared_spec_json,'$.storageUnit')='text'
         AND json_extract(shared_spec_json,'$.storageUnit') IN ('GB','TB','PB')))
   AND ((json_type(shared_spec_json,'$.memory') IS NULL)=
        (json_type(shared_spec_json,'$.memoryUnit') IS NULL))
   AND ((json_type(shared_spec_json,'$.storage') IS NULL)=
        (json_type(shared_spec_json,'$.storageUnit') IS NULL))
   AND (json(shared_spec_json)='{}' OR
        COALESCE(device_type IN ('Desktop','Laptop','Server - Physical'),0))
 ELSE 0 END)
);
CREATE TABLE it_asset_stock_units (
 id TEXT NOT NULL PRIMARY KEY DEFAULT(lower(hex(randomblob(16))))
   CHECK(length(id)=32 AND id NOT GLOB '*[^0-9a-f]*'),
 stock_item_id TEXT REFERENCES it_asset_stock_items(id) ON DELETE RESTRICT,
 device_id TEXT UNIQUE REFERENCES inventory_devices(id) ON DELETE RESTRICT,
 serial_number TEXT CHECK(serial_number IS NULL OR length(trim(serial_number))>0),
 asset_tag TEXT CHECK(asset_tag IS NULL OR length(trim(asset_tag))>0),
 CHECK(stock_item_id IS NOT NULL OR device_id IS NOT NULL),
 CHECK(device_id IS NULL OR
       (length(trim(device_id))>0 AND serial_number IS NULL AND asset_tag IS NULL))
);
CREATE TABLE it_asset_stock_movements (
 id INTEGER PRIMARY KEY CHECK(id>0),
 operation_key TEXT NOT NULL UNIQUE CHECK(length(trim(operation_key))>0),
 kind TEXT NOT NULL CHECK(kind IN ('received','readiness_changed','issued',
                                  'returned','written_off','registered','corrected',
                                  'specification_corrected')),
 event_date TEXT NOT NULL
   CHECK(length(event_date)=10 AND date(event_date,'+0 days') IS event_date),
 recorded_at TEXT NOT NULL DEFAULT(strftime('%Y-%m-%dT%H:%M:%fZ','now'))
   CHECK(length(recorded_at)=24 AND
         strftime('%Y-%m-%dT%H:%M:%fZ',recorded_at) IS recorded_at),
 actor_id INTEGER NOT NULL CHECK(typeof(actor_id)='integer' AND actor_id>0),
 actor_label TEXT NOT NULL CHECK(length(trim(actor_label))>0),
 reason TEXT NOT NULL DEFAULT '',
 supplier_name TEXT,
 checks_json TEXT NOT NULL DEFAULT '{}'
   CHECK(CASE WHEN json_valid(checks_json) THEN json_type(checks_json)='object' ELSE 0 END),
 specification_item_id TEXT REFERENCES it_asset_stock_items(id) ON DELETE RESTRICT,
 specification_before_json TEXT,
 specification_after_json TEXT,
 corrects_entry_id INTEGER REFERENCES it_asset_stock_entries(id) ON DELETE RESTRICT,
 previous_quantity INTEGER,
 corrected_quantity INTEGER,
 CHECK(CASE WHEN kind='specification_corrected' THEN
   specification_item_id IS NOT NULL
   AND json_valid(specification_before_json)
   AND json_valid(specification_after_json)
   AND json_type(specification_before_json)='object'
   AND json_type(specification_after_json)='object'
   ELSE specification_item_id IS NULL
    AND specification_before_json IS NULL AND specification_after_json IS NULL END),
 CHECK(supplier_name IS NULL OR
       (kind='received' AND length(trim(supplier_name))>0)),
 CHECK(kind NOT IN ('corrected','written_off','specification_corrected') OR length(trim(reason))>0),
 CHECK(
   (kind='corrected' AND corrects_entry_id IS NOT NULL
    AND typeof(previous_quantity)='integer'
    AND previous_quantity BETWEEN 0 AND 9007199254740991
    AND typeof(corrected_quantity)='integer'
    AND corrected_quantity BETWEEN 0 AND 9007199254740991
    AND previous_quantity!=corrected_quantity)
   OR
   (kind!='corrected' AND corrects_entry_id IS NULL
    AND previous_quantity IS NULL AND corrected_quantity IS NULL))
);
CREATE TABLE it_asset_stock_entries (
 id INTEGER PRIMARY KEY AUTOINCREMENT CHECK(id>0),
 movement_id INTEGER NOT NULL REFERENCES it_asset_stock_movements(id)
   ON DELETE RESTRICT DEFERRABLE INITIALLY DEFERRED,
 stock_item_id TEXT REFERENCES it_asset_stock_items(id) ON DELETE RESTRICT,
 stock_unit_id TEXT REFERENCES it_asset_stock_units(id) ON DELETE RESTRICT,
 quantity INTEGER NOT NULL
   CHECK(typeof(quantity)='integer' AND quantity BETWEEN 1 AND 9007199254740991),
 from_state TEXT CHECK(from_state IN
   ('awaiting_checks','awaiting_preparation','ready','issued','written_off')),
 to_state TEXT CHECK(to_state IN
   ('awaiting_checks','awaiting_preparation','ready','issued','written_off')),
 staff_id TEXT REFERENCES staff_members(id) ON DELETE RESTRICT,
 department_id TEXT REFERENCES departments(id) ON DELETE RESTRICT,
 recipient_label TEXT,
 source_issue_entry_id INTEGER REFERENCES it_asset_stock_entries(id) ON DELETE RESTRICT,
 device_assignment_id INTEGER REFERENCES device_assignments(id) ON DELETE RESTRICT,
 snapshot_json TEXT NOT NULL DEFAULT '{}'
   CHECK(CASE WHEN json_valid(snapshot_json) THEN json_type(snapshot_json)='object' ELSE 0 END),
 CHECK((stock_item_id IS NOT NULL)!=(stock_unit_id IS NOT NULL)),
 CHECK(stock_unit_id IS NULL OR quantity=1),
 CHECK(from_state IS NOT to_state),
 CHECK(CASE WHEN from_state IS 'issued' OR to_state IS 'issued'
   THEN ((staff_id IS NOT NULL)!=(department_id IS NOT NULL))
        AND recipient_label IS NOT NULL AND length(trim(recipient_label))>0
   ELSE staff_id IS NULL AND department_id IS NULL AND recipient_label IS NULL END)
);
CREATE INDEX it_asset_specifications_item ON it_asset_stock_movements(specification_item_id,id);
CREATE INDEX it_asset_units_item ON it_asset_stock_units(stock_item_id,id);
CREATE INDEX it_asset_entries_movement ON it_asset_stock_entries(movement_id,id);
CREATE INDEX it_asset_entries_item ON it_asset_stock_entries(stock_item_id,id);
CREATE INDEX it_asset_entries_unit ON it_asset_stock_entries(stock_unit_id,id);
CREATE INDEX it_asset_entries_staff ON it_asset_stock_entries(staff_id,id);
CREATE INDEX it_asset_entries_department ON it_asset_stock_entries(department_id,id);
CREATE INDEX it_asset_entries_issue ON it_asset_stock_entries(source_issue_entry_id,id);
CREATE INDEX it_asset_entries_assignment ON it_asset_stock_entries(device_assignment_id,id);
CREATE INDEX it_asset_corrections_entry ON it_asset_stock_movements(corrects_entry_id,id);

CREATE TRIGGER it_asset_items_insert_guard BEFORE INSERT ON it_asset_stock_items BEGIN
 SELECT RAISE(ABORT,'Duplicate shared specification fields are forbidden')
 WHERE EXISTS(SELECT key FROM json_each(NEW.shared_spec_json) GROUP BY key HAVING COUNT(*)>1);
 SELECT RAISE(ABORT,'New stock items cannot claim a specification correction')
 WHERE NEW.specification_movement_id IS NOT NULL;
 SELECT RAISE(ABORT,'Stock item replacement is forbidden')
 WHERE EXISTS(SELECT 1 FROM it_asset_stock_items WHERE id=NEW.id);
END;
CREATE TRIGGER it_asset_items_update_guard BEFORE UPDATE ON it_asset_stock_items BEGIN
 SELECT RAISE(ABORT,'Duplicate shared specification fields are forbidden')
 WHERE EXISTS(SELECT key FROM json_each(NEW.shared_spec_json) GROUP BY key HAVING COUNT(*)>1);
 SELECT RAISE(ABORT,'Stock item identity cannot change') WHERE NEW.id IS NOT OLD.id;
 SELECT RAISE(ABORT,'Tracking mode with history cannot change')
 WHERE NEW.tracking_mode IS NOT OLD.tracking_mode AND (OLD.specification_movement_id IS NOT NULL
        OR EXISTS(SELECT 1 FROM it_asset_stock_entries e
          LEFT JOIN it_asset_stock_units u ON u.id=e.stock_unit_id
          WHERE e.stock_item_id=OLD.id OR u.stock_item_id=OLD.id)
        OR EXISTS(SELECT 1 FROM it_asset_stock_units u
          JOIN device_assignments a ON a.device_id=u.device_id
          WHERE u.stock_item_id=OLD.id));
 SELECT RAISE(ABORT,'Quantity tracking cannot contain individual stock units')
 WHERE NEW.tracking_mode='quantity' AND EXISTS(
   SELECT 1 FROM it_asset_stock_units
   WHERE stock_item_id=OLD.id AND device_id IS NULL);
 SELECT RAISE(ABORT,'Used Device type cannot change')
 WHERE NEW.device_type IS NOT OLD.device_type
   AND (EXISTS(SELECT 1 FROM it_asset_stock_units WHERE stock_item_id=OLD.id)
        OR EXISTS(SELECT 1 FROM it_asset_stock_entries WHERE stock_item_id=OLD.id));
 SELECT RAISE(ABORT,'Historical specifications require an attributed correction')
 WHERE (NEW.specification_movement_id IS NOT OLD.specification_movement_id
        OR (((OLD.specification_movement_id IS NOT NULL
        OR EXISTS(SELECT 1 FROM it_asset_stock_entries e
          LEFT JOIN it_asset_stock_units u ON u.id=e.stock_unit_id
          WHERE e.stock_item_id=OLD.id OR u.stock_item_id=OLD.id)
        OR EXISTS(SELECT 1 FROM it_asset_stock_units u
          JOIN device_assignments a ON a.device_id=u.device_id
          WHERE u.stock_item_id=OLD.id)))
            AND (NEW.manufacturer IS NOT OLD.manufacturer
                 OR NEW.model IS NOT OLD.model
                 OR NEW.shared_spec_json IS NOT OLD.shared_spec_json)))
   AND NOT EXISTS(
     SELECT 1 FROM it_asset_stock_movements m
     WHERE m.id=NEW.specification_movement_id
       AND m.id>COALESCE(OLD.specification_movement_id,0)
       AND m.kind='specification_corrected' AND m.specification_item_id=OLD.id
       AND m.specification_before_json=json_object(
         'manufacturer',OLD.manufacturer,'model',OLD.model,
         'sharedSpecifications',json(OLD.shared_spec_json))
       AND m.specification_after_json=json_object(
         'manufacturer',NEW.manufacturer,'model',NEW.model,
         'sharedSpecifications',json(NEW.shared_spec_json)));
END;
CREATE TRIGGER it_asset_units_insert_guard BEFORE INSERT ON it_asset_stock_units BEGIN
 SELECT RAISE(ABORT,'Stock unit replacement is forbidden')
 WHERE EXISTS(SELECT 1 FROM it_asset_stock_units
              WHERE id=NEW.id OR (NEW.device_id IS NOT NULL AND device_id=NEW.device_id));
 SELECT RAISE(ABORT,'Individual stock requires individual tracking')
 WHERE NEW.device_id IS NULL AND NOT EXISTS(
   SELECT 1 FROM it_asset_stock_items
   WHERE id=NEW.stock_item_id AND tracking_mode='individual');
END;
CREATE TRIGGER it_asset_units_update_guard BEFORE UPDATE ON it_asset_stock_units BEGIN
 SELECT RAISE(ABORT,'Stock unit identity and source cannot change')
 WHERE NEW.id IS NOT OLD.id OR NEW.stock_item_id IS NOT OLD.stock_item_id
       OR NEW.device_id IS NOT OLD.device_id;
 SELECT RAISE(ABORT,'Recorded identifiers require a separately approved correction')
 WHERE (NEW.serial_number IS NOT OLD.serial_number OR NEW.asset_tag IS NOT OLD.asset_tag)
   AND EXISTS(SELECT 1 FROM it_asset_stock_entries WHERE stock_unit_id=OLD.id);
END;
CREATE TRIGGER it_asset_entries_insert_guard BEFORE INSERT ON it_asset_stock_entries BEGIN
 SELECT RAISE(ABORT,'Stock entry replacement is forbidden')
 WHERE EXISTS(SELECT 1 FROM it_asset_stock_entries WHERE id=NEW.id);
 SELECT RAISE(ABORT,'Movement is already closed or is not new')
 WHERE NEW.movement_id<=COALESCE((SELECT MAX(id) FROM it_asset_stock_movements),0);
 SELECT RAISE(ABORT,'Quantity entries require quantity tracking')
 WHERE NEW.stock_item_id IS NOT NULL AND NOT EXISTS(
   SELECT 1 FROM it_asset_stock_items
   WHERE id=NEW.stock_item_id AND tracking_mode='quantity');
END;
CREATE TRIGGER it_asset_entries_no_update BEFORE UPDATE ON it_asset_stock_entries BEGIN
 SELECT RAISE(ABORT,'Stock entries are permanent');
END;
CREATE TRIGGER it_asset_entries_no_delete BEFORE DELETE ON it_asset_stock_entries BEGIN
 SELECT RAISE(ABORT,'Stock entries are permanent');
END;
CREATE TRIGGER it_asset_movements_no_update BEFORE UPDATE ON it_asset_stock_movements BEGIN
 SELECT RAISE(ABORT,'Stock movements are permanent');
END;
CREATE TRIGGER it_asset_movements_no_delete BEFORE DELETE ON it_asset_stock_movements BEGIN
 SELECT RAISE(ABORT,'Stock movements are permanent');
END;

CREATE TRIGGER it_asset_movements_insert_guard BEFORE INSERT ON it_asset_stock_movements BEGIN
 SELECT RAISE(ABORT,'Movement replacement or out-of-order publication is forbidden')
 WHERE NEW.id<=COALESCE((SELECT MAX(id) FROM it_asset_stock_movements),0)
    OR EXISTS(SELECT 1 FROM it_asset_stock_movements WHERE operation_key=NEW.operation_key);
 SELECT RAISE(ABORT,'Movement requires entries')
 WHERE NEW.kind!='specification_corrected' AND NOT EXISTS(
   SELECT 1 FROM it_asset_stock_entries WHERE movement_id=NEW.id);

 SELECT RAISE(ABORT,'Specification corrections cannot contain stock entries')
 WHERE NEW.kind='specification_corrected' AND EXISTS(
   SELECT 1 FROM it_asset_stock_entries WHERE movement_id=NEW.id);
 SELECT RAISE(ABORT,'Specification correction has stale or invalid values')
 WHERE NEW.kind='specification_corrected' AND NOT EXISTS(
   SELECT 1 FROM it_asset_stock_items i WHERE i.id=NEW.specification_item_id
     AND NEW.specification_before_json=json_object(
       'manufacturer',i.manufacturer,'model',i.model,
       'sharedSpecifications',json(i.shared_spec_json))
     AND NEW.specification_after_json IS NOT NEW.specification_before_json
     AND json_type(NEW.specification_after_json,'$.manufacturer')='text'
     AND json_type(NEW.specification_after_json,'$.model')='text'
     AND json_type(NEW.specification_after_json,'$.sharedSpecifications')='object'
     AND NEW.specification_after_json=json_object(
       'manufacturer',json_extract(NEW.specification_after_json,'$.manufacturer'),
       'model',json_extract(NEW.specification_after_json,'$.model'),
       'sharedSpecifications',json_extract(
         NEW.specification_after_json,'$.sharedSpecifications')));

 SELECT RAISE(ABORT,'Invalid original issue reference')
 WHERE EXISTS(
   SELECT 1 FROM it_asset_stock_entries e WHERE e.movement_id=NEW.id AND (
     (e.from_state IS 'issued' AND e.source_issue_entry_id IS NULL)
     OR (NEW.kind='issued' AND e.source_issue_entry_id IS NOT NULL)
     OR (e.source_issue_entry_id IS NOT NULL AND (
       NOT (e.from_state IS 'issued' OR e.to_state IS 'issued')
       OR NOT EXISTS(
         SELECT 1 FROM it_asset_stock_entries s
         JOIN it_asset_stock_movements m ON m.id=s.movement_id
         WHERE s.id=e.source_issue_entry_id AND m.kind='issued'
           AND s.to_state='issued' AND m.id<NEW.id
           AND s.stock_item_id IS e.stock_item_id AND s.stock_unit_id IS e.stock_unit_id
           AND s.staff_id IS e.staff_id AND s.department_id IS e.department_id
           AND s.device_assignment_id IS e.device_assignment_id)))));

 SELECT RAISE(ABORT,'Invalid canonical Device assignment reference')
 WHERE EXISTS(
   SELECT 1 FROM it_asset_stock_entries e
   LEFT JOIN it_asset_stock_units u ON u.id=e.stock_unit_id
   WHERE e.movement_id=NEW.id AND (
     (u.device_id IS NOT NULL AND (e.from_state IS 'issued' OR e.to_state IS 'issued')
       AND e.device_assignment_id IS NULL)
     OR (e.device_assignment_id IS NOT NULL AND NOT EXISTS(
       SELECT 1 FROM device_assignments a WHERE a.id=e.device_assignment_id
         AND a.device_id=u.device_id
         AND (NOT (e.from_state IS 'issued' OR e.to_state IS 'issued')
              OR (a.staff_id IS e.staff_id AND a.department_id IS e.department_id
                  AND CASE WHEN e.to_state IS 'issued' THEN a.ended_at IS NULL
                           ELSE a.ended_at IS NOT NULL END))))));

 SELECT RAISE(ABORT,'Held or written-off Device cannot have an active assignment')
 WHERE EXISTS(
   SELECT 1 FROM it_asset_stock_entries e
   JOIN it_asset_stock_units u ON u.id=e.stock_unit_id
   JOIN device_assignments a ON a.device_id=u.device_id
   WHERE e.movement_id=NEW.id AND a.ended_at IS NULL
     AND e.to_state IN ('awaiting_checks','awaiting_preparation','ready','written_off'));

 SELECT RAISE(ABORT,'Invalid movement transition')
 WHERE NEW.kind!='corrected' AND EXISTS(
   SELECT 1 FROM it_asset_stock_entries e WHERE e.movement_id=NEW.id AND NOT COALESCE((
     (NEW.kind='received' AND e.from_state IS NULL AND e.to_state='awaiting_checks'
       AND NOT EXISTS(SELECT 1 FROM it_asset_stock_units u
                      WHERE u.id=e.stock_unit_id AND u.device_id IS NOT NULL))
     OR (NEW.kind='readiness_changed' AND (
       (e.from_state IN ('awaiting_checks','awaiting_preparation') AND e.to_state='ready')
       OR (e.from_state='ready' AND e.to_state IN ('awaiting_checks','awaiting_preparation')
           AND length(trim(NEW.reason))>0)))
     OR (NEW.kind='issued' AND e.from_state='ready' AND e.to_state='issued')
     OR (NEW.kind='returned' AND e.from_state='issued'
         AND e.to_state IN ('awaiting_checks','awaiting_preparation','ready','written_off'))
     OR (NEW.kind='written_off' AND
         e.from_state IN ('awaiting_checks','awaiting_preparation','ready','issued')
         AND e.to_state='written_off')
     OR (NEW.kind IN ('returned','written_off') AND e.from_state IS NULL
         AND e.to_state=CASE NEW.kind WHEN 'returned' THEN 'awaiting_preparation'
                                               ELSE 'written_off' END
         AND EXISTS(SELECT 1 FROM it_asset_stock_units u
                    WHERE u.id=e.stock_unit_id AND u.device_id IS NOT NULL)
         AND NOT EXISTS(SELECT 1 FROM it_asset_stock_entries old
                        WHERE old.stock_unit_id=e.stock_unit_id AND old.movement_id!=NEW.id)
         AND NOT EXISTS(SELECT 1 FROM it_asset_stock_units u JOIN device_assignments a
                        ON a.device_id=u.device_id
                        WHERE u.id=e.stock_unit_id AND a.ended_at IS NULL))
     OR (NEW.kind='registered' AND (
       (e.stock_item_id IS NOT NULL AND e.quantity=1 AND e.from_state='ready' AND e.to_state IS NULL)
       OR (e.stock_unit_id IS NOT NULL AND e.quantity=1 AND e.from_state IS NULL AND e.to_state='ready')))
   ),0));
 SELECT RAISE(ABORT,'Write-off requires a reason')
 WHERE length(trim(NEW.reason))=0 AND EXISTS(
   SELECT 1 FROM it_asset_stock_entries WHERE movement_id=NEW.id AND to_state='written_off');

 SELECT RAISE(ABORT,'Registration must transfer one quantity unit to its canonical Device')
 WHERE NEW.kind='registered' AND (
   (SELECT COUNT(*) FROM it_asset_stock_entries WHERE movement_id=NEW.id)!=2
   OR NOT EXISTS(
     SELECT 1 FROM it_asset_stock_entries q
     JOIN it_asset_stock_entries d ON d.movement_id=q.movement_id AND d.stock_unit_id IS NOT NULL
     JOIN it_asset_stock_units u ON u.id=d.stock_unit_id
     JOIN inventory_devices v ON v.id=u.device_id
     JOIN it_asset_stock_items i ON i.id=q.stock_item_id
     WHERE q.movement_id=NEW.id AND q.stock_item_id IS NOT NULL
       AND u.stock_item_id=q.stock_item_id AND i.device_type IS NOT NULL
       AND json_extract(v.record_json,'$.type')=i.device_type
       AND NOT EXISTS(SELECT 1 FROM device_assignments a
                      WHERE a.device_id=u.device_id AND a.ended_at IS NULL)
       AND NOT EXISTS(SELECT 1 FROM it_asset_stock_entries old
                      WHERE old.stock_unit_id=u.id AND old.movement_id!=NEW.id)));

 SELECT RAISE(ABORT,'Correction must reference an original closed entry')
 WHERE NEW.kind='corrected' AND NOT EXISTS(
   SELECT 1 FROM it_asset_stock_entries o
   JOIN it_asset_stock_movements m ON m.id=o.movement_id
   WHERE o.id=NEW.corrects_entry_id AND m.id<NEW.id
     AND m.kind IN ('received','issued','returned','written_off'));
 SELECT RAISE(ABORT,'Correction has a stale previous quantity')
 WHERE NEW.kind='corrected' AND NEW.previous_quantity IS NOT COALESCE(
   (SELECT corrected_quantity FROM it_asset_stock_movements
    WHERE corrects_entry_id=NEW.corrects_entry_id ORDER BY id DESC LIMIT 1),
   (SELECT quantity FROM it_asset_stock_entries WHERE id=NEW.corrects_entry_id));
 SELECT RAISE(ABORT,'Correction requires exactly its compensating entry')
 WHERE NEW.kind='corrected' AND (
   (SELECT COUNT(*) FROM it_asset_stock_entries WHERE movement_id=NEW.id)!=1
   OR NOT EXISTS(
     SELECT 1 FROM it_asset_stock_entries e
     JOIN it_asset_stock_entries o ON o.id=NEW.corrects_entry_id
     WHERE e.movement_id=NEW.id
       AND e.stock_item_id IS o.stock_item_id AND e.stock_unit_id IS o.stock_unit_id
       AND e.quantity=abs(NEW.corrected_quantity-NEW.previous_quantity)
       AND e.from_state IS CASE WHEN NEW.corrected_quantity>NEW.previous_quantity
                                THEN o.from_state ELSE o.to_state END
       AND e.to_state IS CASE WHEN NEW.corrected_quantity>NEW.previous_quantity
                              THEN o.to_state ELSE o.from_state END
       AND e.staff_id IS o.staff_id AND e.department_id IS o.department_id
       AND e.recipient_label IS o.recipient_label
       AND e.device_assignment_id IS o.device_assignment_id
       AND e.snapshot_json IS o.snapshot_json
       AND e.source_issue_entry_id IS CASE WHEN o.to_state='issued'
                                           THEN o.id ELSE o.source_issue_entry_id END));

 SELECT RAISE(ABORT,'Stock balances or original issue quantities would be invalid')
 WHERE EXISTS(
   WITH relevant AS (
     SELECT e.* FROM it_asset_stock_entries e
     WHERE e.movement_id=NEW.id OR EXISTS(
       SELECT 1 FROM it_asset_stock_movements m WHERE m.id=e.movement_id)
   ), deltas AS (
     SELECT CASE WHEN stock_unit_id IS NULL THEN 'i:'||stock_item_id ELSE 'u:'||stock_unit_id END subject,
            from_state bucket,-quantity amount FROM relevant WHERE from_state IS NOT NULL
     UNION ALL
     SELECT CASE WHEN stock_unit_id IS NULL THEN 'i:'||stock_item_id ELSE 'u:'||stock_unit_id END,
            to_state,quantity FROM relevant WHERE to_state IS NOT NULL
     UNION ALL
     SELECT 'u:'||stock_unit_id,'identity',
            quantity*((to_state IS NOT NULL)-(from_state IS NOT NULL))
       FROM relevant WHERE stock_unit_id IS NOT NULL
     UNION ALL
     SELECT 'a:'||COALESCE(source_issue_entry_id,id),'issued',
            quantity*((to_state IS 'issued')-(from_state IS 'issued'))
       FROM relevant WHERE from_state IS 'issued' OR to_state IS 'issued'
   )
   SELECT 1 FROM deltas GROUP BY subject,bucket
   HAVING SUM(amount)<0 OR SUM(amount)>9007199254740991
      OR (subject LIKE 'u:%' AND SUM(amount)>1));

 SELECT RAISE(ABORT,'Correction conflicts with subsequent recorded movements')
 WHERE NEW.kind='corrected' AND EXISTS(
   WITH effective AS (
     SELECT e.*,COALESCE(
       CASE WHEN e.id=NEW.corrects_entry_id THEN NEW.corrected_quantity END,
       (SELECT c.corrected_quantity FROM it_asset_stock_movements c
        WHERE c.corrects_entry_id=e.id ORDER BY c.id DESC LIMIT 1),e.quantity) q
     FROM it_asset_stock_entries e
     JOIN it_asset_stock_movements m ON m.id=e.movement_id
     WHERE m.kind!='corrected'
   ), deltas AS (
     SELECT movement_id,
       CASE WHEN stock_unit_id IS NULL THEN 'i:'||stock_item_id ELSE 'u:'||stock_unit_id END subject,
       from_state bucket,-q amount FROM effective WHERE from_state IS NOT NULL
     UNION ALL
     SELECT movement_id,
       CASE WHEN stock_unit_id IS NULL THEN 'i:'||stock_item_id ELSE 'u:'||stock_unit_id END,
       to_state,q FROM effective WHERE to_state IS NOT NULL
     UNION ALL
     SELECT movement_id,'u:'||stock_unit_id,'identity',
       q*((to_state IS NOT NULL)-(from_state IS NOT NULL))
       FROM effective WHERE stock_unit_id IS NOT NULL
     UNION ALL
     SELECT movement_id,'a:'||COALESCE(source_issue_entry_id,id),'issued',
       q*((to_state IS 'issued')-(from_state IS 'issued'))
       FROM effective WHERE from_state IS 'issued' OR to_state IS 'issued'
   ), steps AS (
     SELECT movement_id,subject,bucket,SUM(amount) amount FROM deltas
     GROUP BY movement_id,subject,bucket
   ), running AS (
     SELECT subject,SUM(amount) OVER (
       PARTITION BY subject,bucket ORDER BY movement_id ROWS UNBOUNDED PRECEDING) balance
     FROM steps
   )
   SELECT 1 FROM running WHERE balance<0 OR balance>9007199254740991
      OR (subject LIKE 'u:%' AND balance>1));
END;

CREATE TRIGGER it_asset_units_no_delete BEFORE DELETE ON it_asset_stock_units BEGIN
 SELECT RAISE(ABORT,'Stock unit identities are permanent');
END;

CREATE TRIGGER it_asset_specifications_apply
AFTER INSERT ON it_asset_stock_movements
WHEN NEW.kind='specification_corrected' BEGIN
 UPDATE it_asset_stock_items SET
   manufacturer=json_extract(NEW.specification_after_json,'$.manufacturer'),
   model=json_extract(NEW.specification_after_json,'$.model'),
   shared_spec_json=json_extract(NEW.specification_after_json,'$.sharedSpecifications'),
   specification_movement_id=NEW.id
 WHERE id=NEW.specification_item_id;
END;
"""


def stock_schema_statements(sql):
    """Keep each complete database instruction inside the caller's transaction."""
    statement = ""
    for line in sql.splitlines(keepends=True):
        statement += line
        if sqlite3.complete_statement(statement):
            yield statement.strip().rstrip(";")
            statement = ""
    if statement.strip():
        raise RuntimeError("Incomplete stock schema instruction")


def normalise_schema_statement(statement):
    """Compare known table definitions without depending on indentation."""
    return " ".join(statement.strip().rstrip(";").split())


def validate_feature_table(connection, *, upgraded, suppliers=None):
    """Stop if feature choices or their existing safeguards are unexpected."""
    expected = PREVIOUS_FEATURE_TABLE_SQL
    if upgraded:
        expected = next(stock_schema_statements(FEATURE_UPGRADE_SQL)).replace(
            "organisation_features_next", '"organisation_features"')
    if suppliers is None:
        suppliers = upgraded and connection.execute(
            "SELECT 1 FROM schema_migrations WHERE version=21"
        ).fetchone() is not None
    if suppliers:
        expected = expected.replace("'racks','it_assets') OR", "'racks','it_assets','suppliers') OR")
    row = connection.execute(
        "SELECT sql FROM sqlite_master WHERE type='table' AND name='organisation_features'"
    ).fetchone()
    if row is None or normalise_schema_statement(row[0]) != normalise_schema_statement(expected):
        raise RuntimeError("Unexpected organisation feature table; review required")
    expected_keys = {"devices", "ipam", "racks", "suppliers", "equipment_lifecycle"}
    if upgraded:
        expected_keys.add("it_assets")
    choices = list(connection.execute("SELECT feature,enabled FROM organisation_features"))
    if (len(choices) != len(expected_keys) or {key for key, _ in choices} != expected_keys
            or any(type(value) is not int or value not in (0, 1) for _, value in choices)
            or any(value for key, value in choices
                   if key == "equipment_lifecycle" or key == "suppliers" and not suppliers)):
        raise RuntimeError("Unexpected organisation feature choices; review required")
    if connection.execute(
        "SELECT 1 FROM sqlite_master WHERE tbl_name='organisation_features' "
        "AND type IN ('index','trigger') AND sql IS NOT NULL"
    ).fetchone():
        raise RuntimeError("Unexpected organisation feature dependencies; review required")
    for name, definition in connection.execute(
            "SELECT name,sql FROM sqlite_master WHERE sql IS NOT NULL"):
        if definition and re.search(r"\borganisation_features\b", definition) and name != "organisation_features":
            raise RuntimeError("Unexpected organisation feature dependency; review required")
        if connection.execute(
                'SELECT 1 FROM pragma_foreign_key_list(?) WHERE "table"=?',
                (name, "organisation_features")).fetchone():
            raise RuntimeError("Unexpected organisation feature relationship; review required")
    return dict(choices)


def validate_it_asset_stock(connection, *, handovers=None):
    """Check a completed upgrade without resetting choices or changing records."""
    validate_feature_table(connection, upgraded=True)
    expected = {}
    for statement in stock_schema_statements(STOCK_SCHEMA_SQL):
        match = re.match(r"CREATE (?:TABLE|INDEX|TRIGGER) (\w+)", statement)
        if match is None:
            raise RuntimeError("Unknown stock schema instruction")
        expected[match[1]] = normalise_schema_statement(statement)
    if handovers is None:
        handovers = connection.execute('SELECT 1 FROM schema_migrations WHERE version=19').fetchone() is not None
    if handovers:
        from backend.handover_schema import handover_stock_guard, HANDOVER_STOCK_SQL
        expected['it_asset_movements_insert_guard'] = normalise_schema_statement(handover_stock_guard())
        expected['device_handover_stock_guard'] = normalise_schema_statement(next(stock_schema_statements(HANDOVER_STOCK_SQL)))
    actual = {name: normalise_schema_statement(definition) for name, definition
              in connection.execute(
                  "SELECT name,sql FROM sqlite_master WHERE sql IS NOT NULL AND "
                  "(lower(name) GLOB 'it_asset_*' OR tbl_name IN "
                  "('it_asset_stock_items','it_asset_stock_units',"
                  "'it_asset_stock_movements','it_asset_stock_entries'))")}
    if actual != expected:
        raise RuntimeError("Unexpected stock schema; review required")
    if connection.execute(
            "SELECT 1 FROM sqlite_master WHERE name='organisation_features_next'").fetchone():
        raise RuntimeError("Unexpected unfinished feature upgrade; review required")
    if connection.execute("PRAGMA foreign_key_check").fetchone():
        raise RuntimeError("Database relationships failed verification")


def migrate_it_asset_stock(connection):
    """Add empty stock tables and an independent, disabled IT Assets choice."""
    if not connection.in_transaction:
        raise RuntimeError("Stock upgrade requires the database upgrade transaction")
    before = validate_feature_table(connection, upgraded=False)
    if connection.execute(
            "SELECT 1 FROM sqlite_master WHERE lower(name) GLOB 'it_asset_*' "
            "OR lower(name)='organisation_features_next'").fetchone():
        raise RuntimeError("Unexpected existing stock schema; review required")
    for statement in stock_schema_statements(FEATURE_UPGRADE_SQL):
        connection.execute(statement)
    for statement in stock_schema_statements(STOCK_SCHEMA_SQL):
        connection.execute(statement)
    validate_it_asset_stock(connection)
    after = dict(connection.execute("SELECT feature,enabled FROM organisation_features"))
    if after != dict(before, it_assets=0):
        raise RuntimeError("Stock upgrade changed existing feature choices")
    for table in ("it_asset_stock_items", "it_asset_stock_units",
                  "it_asset_stock_movements", "it_asset_stock_entries"):
        if connection.execute(f"SELECT 1 FROM {table} LIMIT 1").fetchone():
            raise RuntimeError("Stock upgrade must not infer existing stock")
