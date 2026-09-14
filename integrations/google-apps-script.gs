const SHEET_NAME = 'Лист1';

function doPost(e) {
  const sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName(SHEET_NAME);
  if (!sheet) {
    return jsonResponse({ success: false, message: 'Лист не найден' });
  }

  const data = JSON.parse(e.postData.contents || '{}');

  sheet.appendRow([
    data.submittedAt || '',
    asText(data.phone),
    data.name || '',
    data.vacancy || '',
    data.city || '',
    data.age || '',
    data.status || 'Новая',
    data.operator || ''
  ]);

  return jsonResponse({ success: true });
}

function jsonResponse(payload) {
  return ContentService
    .createTextOutput(JSON.stringify(payload))
    .setMimeType(ContentService.MimeType.JSON);
}

function asText(value) {
  return value ? "'" + String(value) : '';
}
