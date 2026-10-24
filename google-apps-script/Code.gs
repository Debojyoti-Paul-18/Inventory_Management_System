/**
 * Stockroom – Google Sheets connector
 * Paste this into Extensions > Apps Script inside your Google Sheet,
 * then Deploy > New deployment > Web app
 *   Execute as: Me | Who has access: Anyone
 */
const SHEET_NAME = 'Inventory';
const HEADERS = ['id','name','category','sku','qty','unit','cost','price','reorder','updated'];

function sheet_() {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  let sh = ss.getSheetByName(SHEET_NAME);
  if (!sh) {
    sh = ss.insertSheet(SHEET_NAME);
    sh.appendRow(HEADERS);
    sh.setFrozenRows(1);
  }
  return sh;
}

function out_(obj) {
  return ContentService.createTextOutput(JSON.stringify(obj))
    .setMimeType(ContentService.MimeType.JSON);
}

function doGet() {
  try {
    const rows = sheet_().getDataRange().getValues();
    const head = rows.shift();
    const items = rows.filter(r => r[0] !== '').map(r => {
      const o = {};
      head.forEach((h, i) => o[h] = r[i]);
      return o;
    });
    return out_({ ok: true, items });
  } catch (err) {
    return out_({ ok: false, error: String(err) });
  }
}

function doPost(e) {
  const lock = LockService.getScriptLock();
  lock.waitLock(10000);
  try {
    const body = JSON.parse(e.postData.contents);
    const sh = sheet_();
    const ids = sh.getRange(1, 1, sh.getLastRow(), 1).getValues().map(r => String(r[0]));

    if (body.action === 'upsert') {
      const it = body.item;
      const row = HEADERS.map(h => h === 'updated' ? new Date() : (it[h] ?? ''));
      const at = ids.indexOf(String(it.id));
      if (at > 0) sh.getRange(at + 1, 1, 1, HEADERS.length).setValues([row]);
      else sh.appendRow(row);
    } else if (body.action === 'delete') {
      const at = ids.indexOf(String(body.id));
      if (at > 0) sh.deleteRow(at + 1);
    } else if (body.action === 'replaceAll') {
      if (sh.getLastRow() > 1) sh.getRange(2, 1, sh.getLastRow() - 1, HEADERS.length).clearContent();
      const rows = body.items.map(it => HEADERS.map(h => h === 'updated' ? new Date() : (it[h] ?? '')));
      if (rows.length) sh.getRange(2, 1, rows.length, HEADERS.length).setValues(rows);
    }
    return out_({ ok: true });
  } catch (err) {
    return out_({ ok: false, error: String(err) });
  } finally {
    lock.releaseLock();
  }
}
