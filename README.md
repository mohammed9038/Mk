# Mk

This project provides a simple web form for recording weekly stock in trade. Users select a week, channel, salesman and customer, enter product quantities and submit the data. The form posts to a Google Apps Script which writes each entry to a Google Sheet.

## Deploying the Google Apps Script

1. Create a new Google Apps Script project at <https://script.google.com>.
2. Replace the default contents with the code in the file `Google App Script` from this repo.
3. Edit the `SpreadsheetApp.openById` call to use your own Google Sheet ID and sheet name.
4. Choose **Deploy → New deployment**, select **Web app** and set access to **Anyone**.
5. After deploying, copy the web app URL – it will be needed by the web form.

## Hosting the web form

Serve `index.html`, `script.js` and `styles.css` from any static host (GitHub Pages, Netlify, etc.). Update the following IDs/URLs in `script.js`:

- The CSV links used in `loadDropdowns` and `loadProducts` should point to the published CSV exports of your Sheets.
- The URL passed to `fetch` inside `submitForm` should be the web app URL from your deployed Apps Script.

Once these values are configured the form will send submissions directly to your spreadsheet.

## Google Sheet formatting (optional)

The sheet must have columns in order: `Week`, `Channel`, `Salesman`, `Customer`, `Product`, `Qty`. Ensure the `Qty` column is formatted as **Number** so sums and other calculations work correctly.
