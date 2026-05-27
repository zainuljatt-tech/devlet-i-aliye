// Google Apps Script — paste ALL of this in Extensions > Apps Script
// Then Deploy > New Deployment > Web App > Execute as "Me", Access "Anyone"

function doPost(e) {
  const sheet = SpreadsheetApp.getActiveSpreadsheet().getActiveSheet();
  
  // Handle both JSON and form-encoded submissions
  let ad, soyad, email, telefon;
  
  if (e.postData && e.postData.contents) {
    try {
      const json = JSON.parse(e.postData.contents);
      ad = json.ad;
      soyad = json.soyad;
      email = json.email;
      telefon = json.telefon;
    } catch(f) {
      const params = e.parameter;
      ad = params.ad;
      soyad = params.soyad;
      email = params.email;
      telefon = params.telefon;
    }
  } else if (e.parameter) {
    ad = e.parameter.ad;
    soyad = e.parameter.soyad;
    email = e.parameter.email;
    telefon = e.parameter.telefon;
  }
  
  // Add headers if first row
  if (sheet.getLastRow() === 0) {
    sheet.appendRow(['Tarih', 'Ad', 'Soyad', 'E-posta', 'Telefon']);
  }
  
  sheet.appendRow([new Date(), ad || '', soyad || '', email || '', telefon || '']);
  
  return ContentService
    .createTextOutput(JSON.stringify({ success: true }))
    .setMimeType(ContentService.MimeType.JSON);
}

function doGet() {
  var html = '<html><body><h2>Sheet connected ✅</h2><p>Form submissions will appear in your sheet.</p></body></html>';
  return HtmlService.createHtmlOutput(html);
}
