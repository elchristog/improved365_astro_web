/**
 * Improved365 demo lead handler
 *
 * SETUP (one time, ~3 minutes):
 * 1. Open the leads sheet:
 *    https://docs.google.com/spreadsheets/d/1lPR2F0YBatWmdpWl-Pme2cYkk4sATHEw4EPMm7rieKI/edit
 * 2. Extensions → Apps Script
 * 3. Delete any default code, paste THIS entire file, Save
 * 4. Deploy → New deployment → Type: Web app
 *      - Description: Improved365 demo form
 *      - Execute as: Me
 *      - Who has access: Anyone
 * 5. Authorize when prompted
 * 6. Copy the Web app URL and paste it into:
 *      src/config/demoForm.ts  →  DEMO_FORM_ENDPOINT
 * 7. Commit / push so the site redeploys
 *
 * Test: submit the homepage form once. You should get a row in the sheet
 * and an email at contact@improved365.com.
 */

var SHEET_ID = '1lPR2F0YBatWmdpWl-Pme2cYkk4sATHEw4EPMm7rieKI';
var NOTIFY_TO = 'contact@improved365.com';
var SHEET_NAME = 'Sheet1';

function doPost(e) {
  try {
    var raw = (e && e.postData && e.postData.contents) ? e.postData.contents : '{}';
    var data = JSON.parse(raw);

    var firstName = String(data.firstName || '').trim();
    var lastName = String(data.lastName || '').trim();
    var email = String(data.email || '').trim();
    var company = String(data.company || '').trim();
    var jobTitle = String(data.jobTitle || '').trim();
    var source = String(data.source || 'https://improved365.com/').trim();

    if (!firstName || !lastName || !email || !company || !jobTitle) {
      return json_({ ok: false, error: 'Missing required fields' });
    }

    var ss = SpreadsheetApp.openById(SHEET_ID);
    var sheet = ss.getSheetByName(SHEET_NAME) || ss.getSheets()[0];
    sheet.appendRow([
      new Date(),
      firstName,
      lastName,
      email,
      company,
      jobTitle,
      source
    ]);

    var subject = 'New Improved365 demo request — ' + company;
    var body =
      'New demo request from improved365.com\n\n' +
      'Name: ' + firstName + ' ' + lastName + '\n' +
      'Email: ' + email + '\n' +
      'Company: ' + company + '\n' +
      'Job title: ' + jobTitle + '\n' +
      'Page: ' + source + '\n' +
      'Time: ' + new Date().toISOString() + '\n\n' +
      'Sheet: https://docs.google.com/spreadsheets/d/' + SHEET_ID + '/edit\n';

    MailApp.sendEmail({
      to: NOTIFY_TO,
      subject: subject,
      body: body,
      replyTo: email
    });

    return json_({ ok: true });
  } catch (err) {
    return json_({ ok: false, error: String(err) });
  }
}

function doGet() {
  return json_({ ok: true, service: 'Improved365 demo form' });
}

function json_(obj) {
  return ContentService
    .createTextOutput(JSON.stringify(obj))
    .setMimeType(ContentService.MimeType.JSON);
}
