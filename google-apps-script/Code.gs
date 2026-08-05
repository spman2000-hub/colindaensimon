const RSVP_SETTINGS = Object.freeze({
  spreadsheetIdProperty: "RSVP_SPREADSHEET_ID",
  sheetName: "RSVP",
  recipients: [
    "colinda1994@hotmail.com",
    "simonpolman14@gmail.com",
  ],
});

const RSVP_HEADERS = Object.freeze([
  "Ontvangen op",
  "Naam / namen",
  "Gasttype",
  "Aanwezigheid",
  "Aantal gasten",
  "E-mailadres",
  "Mobiel nummer",
  "Dieetwensen / allergieën",
  "Overnachting",
  "Muziektip",
  "Bericht",
  "Privacy akkoord",
  "Bron",
  "E-mailstatus",
]);

function setupRsvpSheet() {
  const spreadsheet = SpreadsheetApp.getActiveSpreadsheet();
  if (!spreadsheet) {
    throw new Error("Open dit script vanuit de Google Sheet en voer setupRsvpSheet opnieuw uit.");
  }

  PropertiesService.getScriptProperties().setProperty(
    RSVP_SETTINGS.spreadsheetIdProperty,
    spreadsheet.getId(),
  );

  const sheet = getOrCreateSheet_(spreadsheet);
  formatSheet_(sheet);
  return `RSVP-koppeling ingesteld voor ${spreadsheet.getName()}`;
}

function doGet() {
  return jsonResponse_({
    ok: true,
    service: "RSVP Colinda & Simon",
  });
}

function doPost(event) {
  let rowInfo;

  try {
    const data = parsePayload_(event);
    if (data.company) return jsonResponse_({ ok: true });

    validatePayload_(data);
    rowInfo = appendRsvp_(data);

    try {
      sendNotification_(data);
      rowInfo.sheet.getRange(rowInfo.row, 14).setValue("Verzonden");
    } catch (mailError) {
      rowInfo.sheet.getRange(rowInfo.row, 14).setValue(`Mislukt: ${mailError.message}`);
      console.error(mailError);
    }

    return jsonResponse_({ ok: true });
  } catch (error) {
    console.error(error);
    return jsonResponse_({
      ok: false,
      error: error.message,
    });
  }
}

function parsePayload_(event) {
  const contents = event?.postData?.contents || "";
  if (!contents) return event?.parameter || {};

  try {
    return JSON.parse(contents);
  } catch (error) {
    throw new Error("De RSVP kon niet worden gelezen.");
  }
}

function validatePayload_(data) {
  const required = ["namen", "gasttype", "aanwezigheid", "email", "telefoon", "privacy_akkoord"];
  required.forEach((field) => {
    if (!data[field]) throw new Error(`Verplicht veld ontbreekt: ${field}`);
  });

  const allowedAttendance = ["Ja, wij zijn erbij", "Helaas verhinderd"];
  if (!allowedAttendance.includes(data.aanwezigheid)) {
    throw new Error("Ongeldige aanwezigheidskeuze.");
  }

  if (!["Daggast", "Avondgast"].includes(data.gasttype)) {
    throw new Error("Ongeldig gasttype.");
  }

  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(String(data.email))) {
    throw new Error("Ongeldig e-mailadres.");
  }

  if (!/^[+\d][\d\s().-]{7,}$/.test(String(data.telefoon))) {
    throw new Error("Ongeldig mobiel nummer.");
  }
}

function appendRsvp_(data) {
  const spreadsheetId = PropertiesService.getScriptProperties().getProperty(
    RSVP_SETTINGS.spreadsheetIdProperty,
  );
  if (!spreadsheetId) {
    throw new Error("Voer setupRsvpSheet eenmalig uit voordat je de webapp gebruikt.");
  }

  const lock = LockService.getScriptLock();
  lock.waitLock(10000);

  try {
    const spreadsheet = SpreadsheetApp.openById(spreadsheetId);
    const sheet = getOrCreateSheet_(spreadsheet);
    const row = sheet.getLastRow() + 1;
    const values = [[
      new Date(),
      sheetValue_(data.namen),
      sheetValue_(data.gasttype),
      sheetValue_(data.aanwezigheid),
      sheetValue_(data.aantal_gasten),
      sheetValue_(data.email),
      sheetValue_(data.telefoon),
      sheetValue_(data.dieetwensen),
      sheetValue_(data.overnachting),
      sheetValue_(data.muziektip),
      sheetValue_(data.bericht, 3000),
      data.privacy_akkoord ? "Akkoord" : "",
      sheetValue_(data.bron),
      "Wordt verzonden",
    ]];

    sheet.getRange(row, 1, 1, RSVP_HEADERS.length).setValues(values);
    return { sheet, row };
  } finally {
    lock.releaseLock();
  }
}

function getOrCreateSheet_(spreadsheet) {
  let sheet = spreadsheet.getSheetByName(RSVP_SETTINGS.sheetName);
  if (!sheet) sheet = spreadsheet.insertSheet(RSVP_SETTINGS.sheetName);

  if (sheet.getLastRow() === 0) {
    sheet.getRange(1, 1, 1, RSVP_HEADERS.length).setValues([RSVP_HEADERS]);
    formatSheet_(sheet);
  }

  return sheet;
}

function formatSheet_(sheet) {
  const header = sheet.getRange(1, 1, 1, RSVP_HEADERS.length);
  header
    .setBackground("#4a1825")
    .setFontColor("#fffdf7")
    .setFontWeight("bold");
  sheet.setFrozenRows(1);
  sheet.getRange("A:A").setNumberFormat("dd-mm-yyyy hh:mm");
  sheet.setColumnWidth(1, 145);
  sheet.setColumnWidth(2, 190);
  sheet.setColumnWidth(3, 105);
  sheet.setColumnWidth(4, 155);
  sheet.setColumnWidth(6, 220);
  sheet.setColumnWidth(7, 150);
  sheet.setColumnWidth(8, 230);
  sheet.setColumnWidth(9, 210);
  sheet.setColumnWidth(10, 210);
  sheet.setColumnWidth(11, 320);
  sheet.setColumnWidth(13, 260);
  sheet.setColumnWidth(14, 150);
}

function sendNotification_(data) {
  const subject = `Nieuwe RSVP ${textValue_(data.gasttype)}: ${textValue_(data.namen)} · ${textValue_(data.aanwezigheid)}`;
  const fields = [
    ["Naam / namen", data.namen],
    ["Gasttype", data.gasttype],
    ["Aanwezigheid", data.aanwezigheid],
    ["Aantal gasten", data.aantal_gasten],
    ["E-mailadres", data.email],
    ["Mobiel nummer", data.telefoon],
    ["Dieetwensen / allergieën", data.dieetwensen],
    ["Overnachting", data.overnachting],
    ["Muziektip", data.muziektip],
    ["Bericht", data.bericht],
  ];

  const body = [
    "Nieuwe RSVP voor de bruiloft van Colinda & Simon",
    "",
    ...fields.map(([label, value]) => `${label}: ${textValue_(value) || "-"}`),
  ].join("\n");

  const rows = fields
    .map(([label, value]) => `<tr><th style="padding:8px 14px 8px 0;text-align:left;vertical-align:top;color:#4a1825">${escapeHtml_(label)}</th><td style="padding:8px 0">${escapeHtml_(textValue_(value) || "-")}</td></tr>`)
    .join("");

  MailApp.sendEmail({
    to: RSVP_SETTINGS.recipients.join(","),
    replyTo: textValue_(data.email),
    subject,
    body,
    htmlBody: `<div style="font-family:Arial,sans-serif;color:#2f2522"><h2 style="color:#4a1825">Nieuwe RSVP</h2><table style="border-collapse:collapse">${rows}</table></div>`,
    name: "RSVP Colinda & Simon",
  });
}

function sheetValue_(value, maxLength = 500) {
  const text = textValue_(value).slice(0, maxLength);
  return /^[=+\-@]/.test(text) ? `'${text}` : text;
}

function textValue_(value) {
  return value === undefined || value === null ? "" : String(value).trim();
}

function escapeHtml_(value) {
  return String(value)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;")
    .replace(/\n/g, "<br>");
}

function jsonResponse_(payload) {
  return ContentService
    .createTextOutput(JSON.stringify(payload))
    .setMimeType(ContentService.MimeType.JSON);
}
