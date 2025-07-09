import express from 'express';
import bodyParser from 'body-parser';
import { ConfidentialClientApplication } from '@azure/msal-node';
import { Client } from '@microsoft/microsoft-graph-client';
import 'isomorphic-fetch';

const app = express();
app.use(bodyParser.json());

const tenantId = process.env.AZURE_TENANT_ID;
const clientId = process.env.AZURE_CLIENT_ID;
const clientSecret = process.env.AZURE_CLIENT_SECRET;
const sharepointSiteId = process.env.SHAREPOINT_SITE_ID;
const excelFileId = process.env.EXCEL_FILE_ID; // Drive item id
const excelTable = process.env.EXCEL_TABLE_NAME || 'Table1';

if (!tenantId || !clientId || !clientSecret || !sharepointSiteId || !excelFileId) {
  console.warn('Missing required environment variables for Microsoft Graph');
}

const cca = new ConfidentialClientApplication({
  auth: {
    clientId,
    authority: `https://login.microsoftonline.com/${tenantId}`,
    clientSecret
  }
});

async function getClient() {
  const { accessToken } = await cca.acquireTokenByClientCredential({
    scopes: ['https://graph.microsoft.com/.default']
  });
  return Client.init({
    authProvider: done => done(null, accessToken)
  });
}

app.post('/submit', async (req, res) => {
  const entries = Array.isArray(req.body) ? req.body : [];
  if (entries.length === 0) {
    return res.status(400).json({ status: 'error', message: 'No entries provided' });
  }

  try {
    const client = await getClient();
    const values = entries.map(e => [e.week, e.channel, e.salesman, e.customer, e.product, e.qty]);

    await client
      .api(`/sites/${sharepointSiteId}/drive/items/${excelFileId}/workbook/tables/${excelTable}/rows/add`)
      .post({ values });

    res.json({ status: 'success' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ status: 'error', message: err.message });
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
