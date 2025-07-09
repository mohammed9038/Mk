# Mk

This repository contains a simple web form for recording stock in trade.
Submitted data is stored in an Excel workbook on SharePoint using
Microsoft Graph.

## Setup

1. Install Node dependencies:

   ```bash
   npm install
   ```

2. Configure the following environment variables so the server can
   authenticate with Microsoft Graph and locate your workbook:

   - `AZURE_TENANT_ID`
   - `AZURE_CLIENT_ID`
   - `AZURE_CLIENT_SECRET`
   - `SHAREPOINT_SITE_ID`
   - `EXCEL_FILE_ID` – the drive item id of the Excel file
   - `EXCEL_TABLE_NAME` – the table within the workbook (defaults to
     `Table1`)
   - `PORT` – optional HTTP port (defaults to `3000`)

3. Run the server with:

   ```bash
   npm start
   ```

Open `index.html` in your browser and submit the form. Entries will be
appended as rows to the specified Excel table.
