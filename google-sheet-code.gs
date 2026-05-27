function doPost(e) {
  const sheet = SpreadsheetApp.getActiveSpreadsheet().getActiveSheet();
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
  const ADMIN_EMAIL = 'ugur.kaplan@devletialiye.com';
  const ADMIN_PASS = 'osmanli2026';
  const callback = e.parameter.callback || 'callback';

  if (e.parameter.action === 'login') {
    const email = e.parameter.email;
    const password = e.parameter.password;

    if (email !== ADMIN_EMAIL || password !== ADMIN_PASS) {
      return ContentService
        .createTextOutput(callback + '(' + JSON.stringify({success: false, error: 'Geçersiz giriş bilgileri'}) + ')')
        .setMimeType(ContentService.MimeType.JAVASCRIPT);
    }

    const sheet = SpreadsheetApp.getActiveSpreadsheet().getActiveSheet();
    const data = sheet.getDataRange().getValues();

    return ContentService
      .createTextOutput(callback + '(' + JSON.stringify({success: true, data: data}) + ')')
      .setMimeType(ContentService.MimeType.JAVASCRIPT);
  }

  // Default: health check
  var html = '<html><body><h2>Sheet connected ✅</h2></body></html>';
  return HtmlService.createHtmlOutput(html);
}
