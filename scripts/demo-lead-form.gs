/**
 * Improved365 demo lead handler
 *
 * SETUP / UPDATE (when this file changes):
 * 1. Open the leads sheet:
 *    https://docs.google.com/spreadsheets/d/1lPR2F0YBatWmdpWl-Pme2cYkk4sATHEw4EPMm7rieKI/edit
 * 2. Extensions → Apps Script
 * 3. Replace ALL code with THIS file, Save
 * 4. Deploy → Manage deployments → Edit (pencil) → New version → Deploy
 *    (first time: Deploy → New deployment → Web app, Execute as Me, Anyone)
 * 5. Email alerts go to contact@improved365.com on every signup
 *
 * Sheet columns: Timestamp | First name | Last name | Email | Phone | Company | Job title | Source page
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
    var phone = String(data.phone || '').trim();
    var company = String(data.company || '').trim();
    var jobTitle = String(data.jobTitle || '').trim();
    var source = String(data.source || 'https://improved365.com/').trim();

    if (!firstName || !lastName || !email || !phone || !company || !jobTitle) {
      return json_({ ok: false, error: 'Missing required fields' });
    }

    var ss = SpreadsheetApp.openById(SHEET_ID);
    var sheet = ss.getSheetByName(SHEET_NAME) || ss.getSheets()[0];
    sheet.appendRow([
      new Date(),
      firstName,
      lastName,
      email,
      phone,
      company,
      jobTitle,
      source
    ]);

    var subject = '🚨 New Improved365 demo request — ' + company;
    var body =
      'NEW DEMO REQUEST — improved365.com\n\n' +
      'Name: ' + firstName + ' ' + lastName + '\n' +
      'Email: ' + email + '\n' +
      'Phone: ' + phone + '\n' +
      'Company: ' + company + '\n' +
      'Job title: ' + jobTitle + '\n' +
      'Page: ' + source + '\n' +
      'Time: ' + new Date().toISOString() + '\n\n' +
      'Reply to this email to contact them, or call ' + phone + '.\n' +
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
