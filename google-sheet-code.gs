// Google Apps Script — paste this in Extensions > Apps Script
// Then Deploy > New Deployment > Web App > Execute as "Me", Access "Anyone"

function doPost(e) {
  const sheet = SpreadsheetApp.getActiveSpreadsheet().getActiveSheet();
  const data = JSON.parse(e.postData.contents);
  
  // If first row is empty, add headers
  if (sheet.getLastRow() === 0) {
    sheet.appendRow(['Tarih', 'Ad', 'Soyad', 'E-posta', 'Telefon']);
  }
  
  sheet.appendRow([
    new Date(),
    data.ad || '',
    data.soyad || '',
    data.email || '',
    data.telefon || ''
  ]);
  
  return ContentService
    .createTextOutput(JSON.stringify({ success: true }))
    .setMimeType(ContentService.MimeType.JSON);
}

function doGet() {
  return ContentService
    .createTextOutput('Sheet is ready.')
    .setMimeType(ContentService.MimeType.TEXT);
}
