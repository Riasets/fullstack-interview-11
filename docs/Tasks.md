# Tasks

## Frontend

At Pitchbox we use Material UI. You can use any other UI library if you like, or if you don't use one.

Minimum

- Improve UI to match the mockups in docs.
- Correctly show loading, success and failed states of email verification.

Advanced

- Validate new entered emails.
- Implement pagination for verification history. The backend is on you.

Superb

- Implement bulk email verification.

## Backend

Minimum

1. Save email verification results to database.
2. Implement server-side validation for request `POST /verify`.
3. Verify only new emails. Already verified emails return from DB.

Advanced

1. Filter trash emails like `test@*`, `*@example.com`, `*@2x.png`.
2. Re-verify existing emails every 30 days.

Superb

1. Fix race condition for `POST /verify`.
2. Implement async bulk processing for `POST /verify`. 
