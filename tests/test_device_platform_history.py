"""Only saved, bounded OS values belong in the existing device history."""
import unittest
from backend.audit_events import safe_device_differences


class DevicePlatformHistoryTests(unittest.TestCase):
    def test_os_and_location_changes_keep_safe_before_and_after(self):
        before={"location":"Main Office","typeDetails":{"softwarePlatform":"Windows","softwareVersion":"11","windowsLicence":"private","unknown":{"secret":"private"}}}
        after={"location":"Server Room","typeDetails":{"softwarePlatform":"Ubuntu","softwareVersion":"26.10","windowsLicence":"different private","unknown":{"secret":"changed"}}}
        result=safe_device_differences(before,after)
        self.assertEqual(result['before'],{'location':'Main Office','Operating System':'Windows','OS / Platform Version':'11'})
        self.assertEqual(result['after'],{'location':'Server Room','Operating System':'Ubuntu','OS / Platform Version':'26.10'})

    def test_unchanged_and_unsafe_values_do_not_enter_history(self):
        self.assertEqual(safe_device_differences({'typeDetails':{'softwarePlatform':'Custom'}},{'typeDetails':{'softwarePlatform':'Custom'}}),{})
        for value in ['x'*161,'unsafe\nvalue',{'secret':'not a platform'}]:
            with self.subTest(value=type(value)):
                self.assertEqual(safe_device_differences({'typeDetails':{'softwarePlatform':'Windows'}},{'typeDetails':{'softwarePlatform':value}}),{})
        self.assertEqual(safe_device_differences({'typeDetails':None},{'typeDetails':{'softwarePlatform':'Custom'}})['after'],{'Operating System':'Custom'})
