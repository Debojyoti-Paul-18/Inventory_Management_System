# Stockroom – inventory app (React + Vite)

## Run it
```bash
npm install
npm run dev      # development
npm run build    # production build in /dist
```
Needs Node.js 18 or newer.

## Connect Google Sheets
1. Create a new Google Sheet.
2. Extensions → Apps Script → delete the default code → paste `google-apps-script/Code.gs`.
3. Deploy → New deployment → Web app. Execute as: **Me**. Who has access: **Anyone**. Authorise it.
4. Copy the Web app URL, open the app, click **Google Sheet**, paste it and save.

An `Inventory` tab is created automatically. Anyone with the URL can read and edit the data, so keep it private.
After editing Code.gs, redeploy with a new version.

## Project layout
- `src/hooks/useInventory.js` – state, local storage and sync status
- `src/services/sheets.js` – the only file that talks to Google Sheets (swap it for your backend later)
- `src/components/` – Stats, Toolbar, ItemTable, ItemDialog, SettingsDialog, Modal
