# Bruiloftssite Colinda & Simon

Een complete, responsive one-page website voor de bruiloft op zaterdag 3 oktober 2026 bij Oranjerie Hydepark in Doorn.

## Inhoud

- Persoonlijke aquarel van het aanzoek bij Mount Fuji als openingsbeeld
- Originele aanzoekfoto en een fotogestuurd verhaalblok
- Sfeerbeeld en afwisselende aquareldecoraties met Japanse esdoorn, sakura en orchidee, waarbij de takken vanuit de paginaranden naar binnen hangen
- Groot locatiebeeld van de Oranjerie door de begroeide boogentunnel
- Geïllustreerde dagplanning van 13:00 tot 23:30 uur, met toegankelijke tekstversie
- Locatie, routeknoppen, dresscode en praktische afspraken
- Contactpassage voor weddingplanner Els Vlieger bij verzoekjes en stukjes
- Accommodatie-informatie voor Landgoed de Horst
- Cadeautip voor de geplande huwelijksreis door Zuid-Afrika, Madagaskar en de Seychellen, met een eigen sfeerbeeld per bestemming
- Responsive RSVP-formulier met conceptopslag
- RSVP vraagt alleen aanwezigheid; de keuze voor daggast of avondgast volgt de save the date
- Agenda-download in iCalendar-formaat
- Mobiele navigatie, toegankelijke formulieren en subtiele scrollanimaties
- Printvriendelijke basisopmaak

## Bestanden

| Bestand | Functie |
| --- | --- |
| `index.html` | Alle website-inhoud en semantische structuur |
| `styles.css` | Volledig visueel ontwerp en responsive gedrag |
| `script.js` | Countdown, menu, animaties en formulierlogica |
| `site-config.js` | Korte RSVP-configuratie voor publicatie |
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

De lokale preview bewaart ingevulde reacties op het apparaat en biedt knoppen voor kopiëren en downloaden. De live configuratie staat standaard op Netlify Forms. Kies desgewenst een andere route in `site-config.js`.

### Netlify Forms

De standaardinstelling is:

```js
rsvpProvider: "netlify"
```

Sleep de volledige map naar Netlify of koppel de map aan een repository. Het bestaande HTML-formulier bevat de benodigde Netlify-attributen. Nieuwe inzendingen verschijnen onder **Forms** in het Netlify-dashboard.

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
