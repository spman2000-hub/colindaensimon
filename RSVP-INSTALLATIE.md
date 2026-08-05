# RSVP koppelen aan Google Sheets en e-mail

De backend is ingesteld voor deze ontvangers:

- `colinda1994@hotmail.com`
- `simonpolman14@gmail.com`

Iedere geldige RSVP, inclusief het gasttype, e-mailadres en mobiel nummer, wordt als nieuwe rij opgeslagen en naar beide adressen gemaild. Deze website verstuurt automatisch het gasttype **Daggast**.

## 1. Google Sheet aanmaken

1. Maak in Google Drive een nieuwe Google Sheet met bijvoorbeeld de naam **RSVP Colinda & Simon**.
2. Open in die Sheet **Extensies > Apps Script**.
3. Vervang de inhoud van `Code.gs` door de inhoud van `google-apps-script/Code.gs` uit dit websitepakket.
4. Open **Projectinstellingen**, activeer de weergave van `appsscript.json` en neem desgewenst ook het meegeleverde manifest over.

## 2. Sheet eenmalig instellen

1. Kies bovenin de functie `setupRsvpSheet`.
2. Klik op **Uitvoeren**.
3. Geef toestemming voor Google Sheets en het verzenden van e-mail.
4. In de Sheet verschijnt het tabblad **RSVP** met de juiste kolommen en opmaak.

## 3. Apps Script publiceren

1. Klik rechtsboven op **Implementeren > Nieuwe implementatie**.
2. Kies als type **Web-app**.
3. Stel **Uitvoeren als** in op **Mij**.
4. Stel toegang in op **Iedereen**.
5. Klik op **Implementeren** en kopieer de URL die eindigt op `/exec`.

## 4. URL in de website plaatsen

Open `site-config.js` en plak de URL tussen de aanhalingstekens:

```js
window.WEDDING_CONFIG = {
  rsvpProvider: "google-sheets",
  rsvpEndpoint: "https://script.google.com/macros/s/JOUW_IMPLEMENTATIE_ID/exec",
  rsvpEmail: "colinda1994@hotmail.com,simonpolman14@gmail.com",
};
```

Publiceer daarna de bijgewerkte websitebestanden.

## 5. Testen

1. Vul op de website een test-RSVP in.
2. Controleer de nieuwe rij in het tabblad **RSVP**.
3. Controleer beide mailboxen.
4. In kolom **E-mailstatus** staat `Verzonden` zodra de melding door Apps Script is verwerkt.

Bij iedere latere wijziging aan `Code.gs` maak je via **Implementeren > Implementaties beheren** een nieuwe versie van dezelfde web-app.
