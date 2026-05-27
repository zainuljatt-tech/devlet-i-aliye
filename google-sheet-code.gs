function doPost(e) {
  const sheet = SpreadsheetApp.getActiveSpreadsheet().getActiveSheet();
  const ADMIN_PASS = 'osmanli2026';

  // Handle delete
  if (e.parameter.action === 'delete') {
    if (e.parameter.secret !== ADMIN_PASS) {
      return ContentService.createTextOutput(JSON.stringify({success: false})).setMimeType(ContentService.MimeType.JSON);
    }
    const rowNum = parseInt(e.parameter.row);
    if (rowNum > 1 && rowNum <= sheet.getLastRow()) {
      sheet.deleteRow(rowNum);
    }
    return ContentService.createTextOutput(JSON.stringify({success: true})).setMimeType(ContentService.MimeType.JSON);
  }

  let ad, soyad, email, telefon;
  if (e.postData && e.postData.contents) {
    try {
      const json = JSON.parse(e.postData.contents);
      ad = json.ad; soyad = json.soyad; email = json.email; telefon = json.telefon;
    } catch(f) {
      ad = e.parameter.ad; soyad = e.parameter.soyad; email = e.parameter.email; telefon = e.parameter.telefon;
    }
  } else if (e.parameter) {
    ad = e.parameter.ad; soyad = e.parameter.soyad; email = e.parameter.email; telefon = e.parameter.telefon;
  }
  if (sheet.getLastRow() === 0) {
    sheet.appendRow(['Tarih', 'Ad', 'Soyad', 'E-posta', 'Telefon']);
  }
  sheet.appendRow([new Date(), ad || '', soyad || '', email || '', telefon || '']);
  return ContentService
    .createTextOutput(JSON.stringify({ success: true }))
    .setMimeType(ContentService.MimeType.JSON);
}

function doGet(e) {
  var html = '<html><body><h2>Sheet connected ✅</h2></body></html>';
  return HtmlService.createHtmlOutput(html);
}
