# Staff Members And Departments Foundation

The foundation was accepted in PR #377. The following describes its migration;
[Batch 3.2 APIs](Staff-Directory-APIs.md) extend future account creation and Staff
operations without changing schema 14 or rerunning its upgrade.

Batch 3.1 adds schema 14 on a dedicated branch from `milestone-1` at
`519842b46861c85fde0eebf78298117c2346599d`. Its scope is authorised by
[#368](https://github.com/Caffoot/Caffoot-Lite/issues/368#issuecomment-6877271755).
The published release remains v2.1. Staff screens, operational APIs, navigation,
assignments and the IT Assets feature switch need separate batches.

## Records And Upgrade

`departments` is flat: an independent text ID, a case-insensitive unique non-blank
name and an archive flag. `staff_members` has its own text ID, first name, surname,
email, optional Department, job title, telephone, Location and Active flag.
IDs default to random 128-bit hexadecimal values; names and login IDs are not
Staff identities. Multiple Staff records can have no login. A non-null `account_id`
must refer to an existing account and can belong to only one Staff record.
Department references prevent deletion of a Department still containing Staff.
Future assignment/history safeguards belong to their separately authorised work.

`initialise_database` runs `migrate_staff_directory` under its existing
`BEGIN IMMEDIATE` transaction. The migration creates exactly one linked record
for each account lacking a valid link, including disabled accounts and admins.
It copies only saved `account_profiles.first_name`, `last_name` and `email`.
Missing values stay blank, and Department stays null. Display names, usernames,
photos and email-verification flags are not mapped to directory fields. Job title,
telephone and Location stay blank because account profiles do not contain them.
Staff Active defaults independently to Active; the login's disabled state is retained.

Existing valid Staff records and links are kept verbatim, including deliberately
blank Staff details. Existing tables must match the expected schema; incompatible
tables, invalid links or previously unknown grants for the three new sections stop
the upgrade for review. The migration never guesses, merges identities or activates
an unexpected grant. The transaction rolls back tables, rows and version marker
together on failure. Retry and concurrent startup cannot create duplicate links.
After version 14 is recorded, startup does not repeat the backfill.

The upgrade writes no original account, profile, security, session, role, grant,
override, inventory or history rows. It creates no logins or equipment assignments.
The foundation left account creation unchanged; combined Staff/login creation and
future-account links are added in Batch 3.2. `assign_staff_member` assigns the protected security
role, not a Staff directory record.

## Login Separation

The existing account-delete operation still deletes the login under its existing
administrator and last-administrator safeguards. The optional foreign key uses
`ON DELETE SET NULL`: removing that login retains the Staff identity and profile,
as [already required](https://github.com/Caffoot/Caffoot-Lite/issues/232#issuecomment-6771823411).
Disabling a login does not mark Staff Inactive. Account-profile updates continue
to update only account profiles; no new synchronisation policy or directory edit
flow is introduced. The initial copy is a one-time upgrade operation.

## Permissions

The existing section model now recognises `Staff Members`, `Departments` and
`IT Assets`. No role, membership, grant or override is added. Ordinary users
start with No Access; the protected Staff Member security role remains grant-free.
Highest enabled-role grant, explicit overrides, Inherit, independent administrator
access, MFA and session revocation all use the existing services.

Staff Members and Departments are core: their availability is not an optional
feature choice, but account rights and MFA still apply. IT Assets can have a
configured section grant but effective feature access remains denied, even for
administrators, until the later feature-switch batch. No IT Assets feature row or
UI is added here.

Full legacy inventory import still requires effective Edit on **Devices, IPAM and
Racks**, including all three feature gates. It does not require Staff Members,
Departments or IT Assets, and those grants cannot substitute for inventory rights.
The inventory history filter also retains its original three-section boundary,
so default-off IT Assets cannot hide existing administrator audit details. Directory
permissions alone do not expose inventory or account-security history.

## Verification

Focused tests in `test_staff_directory_migration.py` cover field mapping and blanks,
all-table and security preservation, constraints, existing links, retries/reopen,
rollback after table creation and backfill, conflicts, concurrent upgrades and
existing profile/status/deletion behaviour. Final evidence belongs in the active
[handover](../development-handovers/milestone-01.md) and Batch 3.1 PR.
`test_staff_section_permissions.py` exercises the existing role preview/confirmation
service, inheritance and overrides, MFA, session/proof revocation, administrator
protection, directory privacy and preservation of import/history access.
