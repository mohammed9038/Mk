function doPost(e) {
  try {
    const data = JSON.parse(e.postData.contents);
    const sheet = SpreadsheetApp.openById("1zNS074ahvESwNybnbYIvNthoXpRg64msgyNz-t1VSoI").getSheetByName("Sheet1");

    data.forEach(row => {
      sheet.appendRow([
        row.week,
        row.channel,
        row.salesman,
        row.customer,
        row.product,
        row.qty
      ]);
    });

    return ContentService
      .createTextOutput(JSON.stringify({ status: "success" }))
      .setMimeType(ContentService.MimeType.JSON)
      .setHeaders({
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Methods": "POST"
      });

  } catch (error) {
    return ContentService
      .createTextOutput(JSON.stringify({ status: "error", message: error.message }))
      .setMimeType(ContentService.MimeType.JSON)
      .setHeaders({
        "Access-Control-Allow-Origin": "*"
      });
  }
}
