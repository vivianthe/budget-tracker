# Budget Tracker

A small expense tracker that stores your data in a Google Sheet. Add expenses through a form, view them in a sortable/filterable table, and see spend summarized by category and month.

## One-time setup (Google Cloud + Sheets)

1. Go to the [Google Cloud Console](https://console.cloud.google.com/) and create (or select) a project.
2. Enable the **Google Sheets API** for that project (APIs & Services → Enable APIs and Services → search "Google Sheets API" → Enable).
3. Configure the **OAuth consent screen** (APIs & Services → OAuth consent screen). Choose "External," fill in the required fields, and add your own Google account as a test user. Testing mode is fine for personal use.
4. Create an **OAuth Client ID** (APIs & Services → Credentials → Create Credentials → OAuth client ID):
   - Application type: **Web application**
   - Authorized JavaScript origins: `http://localhost:5173`
   - Copy the generated Client ID.
5. Create a new Google Sheet. Rename one tab to exactly `Expenses`, and add this header row:

   | Date | Category | Amount | Description |
   |------|----------|--------|-------------|

6. Copy the spreadsheet ID from its URL: `https://docs.google.com/spreadsheets/d/SPREADSHEET_ID/edit`.

## Local setup

```bash
cp .env.example .env
```

Edit `.env` and fill in:

```
VITE_GOOGLE_CLIENT_ID=your-client-id.apps.googleusercontent.com
VITE_SPREADSHEET_ID=your-spreadsheet-id
```

Then install and run:

```bash
npm install
npm run dev
```

Open `http://localhost:5173`, sign in with the Google account you added as a test user, and start adding expenses. Each expense is written directly to your spreadsheet, and the app reads from it to render the table and charts.

## Deployment (GitHub Pages)

The app is deployed at **https://vivianthe.github.io/budget-tracker/** via a GitHub Actions workflow (`.github/workflows/deploy.yml`) that builds and publishes on every push to `main`.

To let someone else use the deployed app:

1. **Add them as a test user** on the OAuth consent screen (Google Cloud Console → APIs & Services → OAuth consent screen → Test users). Without this, they'll be blocked at sign-in since the app is in "Testing" publishing status.
2. **Share the Google Sheet with them** (Editor access) — the app writes as whichever Google account is signed in, so they need direct permission on the sheet itself.

To redeploy after code changes: push to `main`; the workflow runs automatically. Env vars (`VITE_GOOGLE_CLIENT_ID`, `VITE_SPREADSHEET_ID`) are pulled from the repo's Actions secrets (Settings → Secrets and variables → Actions) at build time, not committed to the repo.

If the OAuth Client ID's authorized origins ever need updating (e.g. redeploying under a different URL), add it under Google Cloud Console → Credentials → your OAuth Client ID → Authorized JavaScript origins. Both `http://localhost:5173` and `https://vivianthe.github.io` should be listed.

## Notes

- All data stays in your own Google Sheet — there is no separate backend or database.
- The OAuth token is requested client-side and kept only in memory; you'll need to sign in again each time you reload the page.
