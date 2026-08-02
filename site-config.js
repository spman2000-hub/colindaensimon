/*
  RSVP-configuratie

  De live website gebruikt Netlify Forms. Netlify bewaart de reacties onder
  Forms en verstuurt meldingen via de ingestelde Form submission notifications.

  Kies desgewenst een andere route:

  1. Netlify Forms
     rsvpProvider: "netlify"

  2. Google Sheets + e-mail
     rsvpProvider: "google-sheets"
     rsvpEndpoint: "https://script.google.com/macros/s/.../exec"

  3. Eigen formulierdienst of serverless endpoint
     rsvpProvider: "endpoint"
     rsvpEndpoint: "https://jouw-endpoint.example/rsvp"

  4. Vooraf ingevulde e-mail
     rsvpProvider: "email"
     rsvpEmail: "jullie-rsvp-adres@example.nl"
*/

window.WEDDING_CONFIG = {
  rsvpProvider: "netlify",
  rsvpEndpoint: "",
  rsvpEmail: "colinda1994@hotmail.com,simonpolman14@gmail.com",
};
