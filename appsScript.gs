/**
 * Google Apps Script Web App
 * Exposes a POST endpoint to append form data to a spreadsheet.
 * Deploy as Web App and allow access to anyone with the link.
 */
function doPost(e) {
  var ss = SpreadsheetApp.getActiveSpreadsheet();
  var sheet = ss.getSheetByName('Sheet1');
  var data = JSON.parse(e.postData.contents);

  data.entries.forEach(function(entry) {
    sheet.appendRow([
      data.address,
      data.date,
      data.salesRep,
      entry.classification,
      entry.supplier,
      entry.brand,
      entry.compBrand,
      entry.productName,
      entry.productSize,
      entry.actCat,
      entry.activity,
      entry.price,
      entry.promo,
      entry.visibility,
      entry.facing,
      entry.compFacing,
      entry.images.join(', ')
    ]);
  });

  return ContentService
    .createTextOutput(JSON.stringify({status: 'ok'}))
    .setMimeType(ContentService.MimeType.JSON);
}
