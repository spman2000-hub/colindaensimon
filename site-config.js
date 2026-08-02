/*
  RSVP-configuratie

  De website gebruikt standaard Netlify Forms. Tijdens een lokale preview
  schakelt het formulier automatisch over op veilige conceptopslag.

  Kies desgewenst een andere route:

  1. Netlify Forms
     rsvpProvider: "netlify"

  2. Eigen formulierdienst of serverless endpoint
     rsvpProvider: "endpoint"
     rsvpEndpoint: "https://jouw-endpoint.example/rsvp"

  3. Vooraf ingevulde e-mail
     rsvpProvider: "email"
     rsvpEmail: "jullie-rsvp-adres@example.nl"
*/

window.WEDDING_CONFIG = {
  rsvpProvider: "netlify",
  rsvpEndpoint: "",
  rsvpEmail: "",
};
