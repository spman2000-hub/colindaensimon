# Bruiloftssite Colinda & Simon · daggasten

De complete, responsive daggastenwebsite voor de bruiloft op zaterdag 3 oktober 2026 bij Oranjerie Hydepark in Doorn. Deze versie verwelkomt gasten vanaf 13:00 uur en staat los van de later te maken avondgastenwebsite.

## Inhoud

- Persoonlijke aquarel van het aanzoek bij Mount Fuji als openingsbeeld
- Originele aanzoekfoto en een fotogestuurd verhaalblok
- Subtiel sfeerbeeld van de Japanse herfsttafel en afwisselende aquareldecoraties met Japanse esdoorn, sakura en orchidee, waarbij de takken vanuit de paginaranden naar binnen hangen
- Groot locatiebeeld van de Oranjerie door de begroeide boogentunnel
- Geïllustreerde dagplanning van 13:00 tot 23:30 uur, met ontvangst van avondgasten om 19:00 uur en een toegankelijke tekstversie
- Locatie, gratis parkeerinformatie, routeknoppen, dresscode en praktische afspraken
- Contactpassage voor weddingplanner Els Vlieger bij verzoekjes en stukjes, met deadline 01 september 2026
- Accommodatie-informatie voor Landgoed de Horst
- Cadeautip voor de geplande huwelijksreis door Zuid-Afrika, Madagaskar en de Seychellen, met een eigen sfeerbeeld per bestemming
- Responsive RSVP-formulier met verplicht e-mailadres en mobiel nummer, Netlify Forms-opslag en conceptopslag
- RSVP vraagt alleen aanwezigheid en registreert iedere reactie automatisch als daggast
- Agenda-download in iCalendar-formaat
- Brede tafelfoto als afsluitend sfeerbeeld
- Mobiele navigatie, toegankelijke formulieren en subtiele scrollanimaties
- Printvriendelijke basisopmaak

## Bestanden

| Bestand | Functie |
| --- | --- |
| `index.html` | Alle website-inhoud en semantische structuur |
| `styles.css` | Volledig visueel ontwerp en responsive gedrag |
| `script.js` | Countdown, menu, animaties en formulierlogica |
| `site-config.js` | Korte RSVP-configuratie voor publicatie |
| `RSVP-INSTALLATIE.md` | Stappen om Google Sheets en e-mailmeldingen te activeren |
| `google-apps-script/Code.gs` | Backendcode voor opslag en e-mailmeldingen |
| `bedankt.html` | Bedankpagina voor formulierdiensten |
| `favicon.svg` | Website-icoon in dezelfde stijl |
| `colinda-simon-3-oktober-2026.ics` | Downloadbaar agenda-item |
| `assets/photos/` | Geoptimaliseerde aanzoek-, sfeer- en locatiefoto's |

## Lokaal bekijken

Open `index.html` direct in een moderne browser. Voor een lokale webserver:

```bash
python3 -m http.server 8080
```

Open daarna `http://localhost:8080`.

## RSVP live zetten

De live website gebruikt Netlify Forms. Reacties verschijnen onder **Forms**, kunnen daar als CSV worden gedownload en kunnen via **Project configuration > Notifications > Form submission notifications** naar beide e-mailadressen worden gestuurd.

De lokale conceptopslag en de knoppen voor kopiëren en downloaden blijven beschikbaar als vangnet. De meegeleverde Google Sheets-koppeling is beschikbaar als aanvullende automatisering.

### Netlify Forms

De standaardinstelling is:

```js
rsvpProvider: "netlify"
```

Sleep de volledige map naar Netlify of koppel de map aan een repository. Het bestaande HTML-formulier bevat de benodigde Netlify-attributen. Nieuwe inzendingen verschijnen onder **Forms** in het Netlify-dashboard.

### Google Sheets en e-mail

Volg [RSVP-INSTALLATIE.md](RSVP-INSTALLATIE.md), publiceer het meegeleverde Google Apps Script en zet daarna:

```js
rsvpProvider: "google-sheets",
rsvpEndpoint: "https://script.google.com/macros/s/JOUW_IMPLEMENTATIE_ID/exec"
```

### Eigen formulierendpoint

Zet:

```js
rsvpProvider: "endpoint",
rsvpEndpoint: "https://jouw-endpoint.example/rsvp"
```

Het formulier verstuurt JSON via een `POST`-request.

### RSVP via e-mail

Zet:

```js
rsvpProvider: "email",
rsvpEmail: "jullie-rsvp-adres@example.nl"
```

Na het invullen opent het e-mailprogramma van de gast met een volledig ingevuld RSVP-bericht.

## Publiceren

De website gebruikt zuivere HTML, CSS en JavaScript. Iedere statische host werkt, waaronder Netlify, Vercel, GitHub Pages en een gewone webhostingomgeving. Voor Netlify Forms biedt Netlify de kortste publicatieroute.

## Snel aanpassen

- Kleuren staan bovenaan `styles.css` als CSS-variabelen.
- Teksten, tijden en adressen staan in `index.html`.
- De trouwdatum voor de countdown staat bovenaan `script.js`.
- De RSVP-koppeling staat in `site-config.js`.
- De agenda-informatie staat in het `.ics`-bestand.
