# SiOMC Login V2 — UI starter

Open `login-v2-preview.html` in a browser to preview the responsive patient/staff login screen. The buttons deliberately do NOT authenticate users or transmit credentials.

## Production architecture requirements
- Obtain hospital approval for hosting, identity provider, database, data flows, privacy notice/consent where applicable, retention, incident response and vendor terms.
- Patient identity: hospital-approved identity proofing and account-linking to the medical record. LINE LIFF is an entry point, not proof of HN ownership.
- Staff identity: hospital-managed SSO/identity provider where available, with MFA. No public staff self-registration.
- Roles: admin, physician, nurse, dietitian, care_coordinator. Assign roles server-side; never trust a role selected in the browser.
- Enforce least privilege and row-level/database authorization server-side. Patient can access only their own permitted data.
- Keep audit logs for sign-in, record access, edits, exports and permission changes.
- Keep service keys, LINE secrets/tokens and database service-role keys server-side only. Never commit `.env`.
- Test authorization per role, session expiry/revocation, account recovery, audit logs, backup/restore and incident response.
- Admin does not automatically receive clinical-record access merely by being an admin.

Do not use real patient data in this preview. This is not production authentication and is not approved for clinical use.
