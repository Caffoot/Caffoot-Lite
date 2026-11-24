"""Rehearse Stage 6.4 with the approved stopped-volume procedure."""
import json
import os
import re
import unittest
from unittest.mock import patch

import test_stage_6_3_recovery as recovery


@unittest.skipUnless(os.environ.get('CAFFOOT_STAGE64_RECOVERY') == '1',
                     'set CAFFOOT_STAGE64_RECOVERY=1 to run the disposable rehearsal')
class SharedDeviceRecoveryTests(recovery.CompleteVolumeRecoveryTests):
    __unittest_skip__ = False

    def setUp(self):
        images = (recovery.IMAGES[0], ('CAFFOOT_SCHEMA28_TEST_IMAGE',
                                       '957969ba1b44465472765e47f91117ca7c87d177'))
        with patch.object(recovery, 'IMAGES', images):
            super().setUp()
        revision = os.environ['CAFFOOT_STAGE64_SOURCE_REVISION']
        self.assertIsNotNone(re.fullmatch(r'[a-f0-9]{40}', revision))
        self.current, label, architecture, user = self.docker(
            'image', 'inspect', os.environ['CAFFOOT_SCHEMA29_TEST_IMAGE'], '--format',
            '{{.Id}} {{index .Config.Labels "org.opencontainers.image.revision"}} {{.Architecture}} {{.Config.User}}'
        ).split()
        self.assertEqual(label, revision)
        self.assertEqual(user, '10001:10001')
        print(f'IMAGE {self.current} {architecture} {label}', flush=True)
        self.fixture = self.fixture.replace("    elif action == 'snapshot':", """
    elif action == 'previous-stock-facts':
        with closing(sqlite3.connect('file:/data/caffoot.sqlite3?mode=ro', uri=True)) as db:
            columns = ','.join(row[1] for row in db.execute("PRAGMA table_info(it_asset_stock_entries)")
                               if row[1] != 'custody_recipient_id')
            rows = db.execute(f'SELECT {columns} FROM it_asset_stock_entries ORDER BY id').fetchall()
            print(digest(rows))
    elif action == 'snapshot':""")

    def test_complete_named_volume_recovery_and_matching_rollback(self):
        old = self.volume('source10')
        direct = self.volume('direct29')
        review = self.volume('source28')
        migrated = self.volume('upgrade29')
        rollback = self.volume('restore28')
        self.backups = self.volume('archives')

        source = self.compose('source10', self.published, old)
        container = self.start(source, old, self.published)
        self.trust_published(container)
        self.stop(source, container)
        self.helper(self.published, old, 'seed-published')
        saved10 = self.snapshot(self.published, old)
        self.assertEqual(saved10['version'], 10)
        self.record_archive(self.published, old, saved10)

        self.helper(self.current, direct, 'restore', 'schema10')
        target = self.compose('direct29', self.current, direct)
        container = self.start(target, direct, self.current)
        self.functional()
        self.stop(target, container)
        self.assertEqual(self.snapshot(self.current, direct)['version'], 29)
        self.compare(self.snapshot(self.published, old), saved10)
        print('SCHEMA 10 TO 29 PASS: matching source untouched, trusted HTTPS, MFA and saved inventory', flush=True)

        self.helper(self.review, review, 'restore', 'schema10')
        stage28 = self.compose('source28', self.review, review)
        container = self.start(stage28, review, self.review)
        self.stop(stage28, container)
        review_data = json.loads(self.helper(self.review, review, 'seed-review'))
        saved28 = self.snapshot(self.review, review)
        self.assertEqual(saved28['version'], 28)
        self.assertEqual(saved28['tables']['service_desk_attachments'][0], 2)
        self.record_archive(self.review, review, saved28)
        stock = self.helper(self.review, review, 'previous-stock-facts')

        self.helper(self.current, migrated, 'restore', 'schema28')
        self.compare(self.snapshot(self.current, migrated), saved28)
        target = self.compose('upgrade29', self.current, migrated)
        container = self.start(target, migrated, self.current)
        self.functional(review=review_data)
        self.stop(target, container)
        updated = self.snapshot(self.current, migrated)
        self.assertEqual(updated['version'], 29)
        for name, facts in saved28['tables'].items():
            if name not in {'sqlite_sequence', 'it_asset_stock_entries', 'schema_migrations'}:
                self.assertEqual(updated['tables'][name], facts, name)
        self.assertEqual(self.helper(self.current, migrated, 'previous-stock-facts'), stock)
        print('SCHEMA 28 TO 29 PASS: original rows and stock facts, MFA, private notes and attachments', flush=True)

        self.helper(self.review, rollback, 'restore', 'schema28')
        self.compare(self.snapshot(self.review, rollback), saved28)
        target = self.compose('restore28', self.review, rollback)
        container = self.start(target, rollback, self.review)
        self.functional(review=review_data)
        self.stop(target, container)
        self.compare(self.snapshot(self.review, rollback), saved28, after_start=True)
        self.compare(self.snapshot(self.review, review), saved28)
        print('SCHEMA 28 ROLLBACK PASS: exact stopped-volume restore and matching-image functional checks', flush=True)
