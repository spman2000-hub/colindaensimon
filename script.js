(() => {
  "use strict";

  const config = window.WEDDING_CONFIG || {
    rsvpProvider: "preview",
    rsvpEndpoint: "",
    rsvpEmail: "",
  };

  const weddingDate = new Date("2026-10-03T13:00:00+02:00");
  const header = document.querySelector(".site-header");
  const menuToggle = document.querySelector(".menu-toggle");
  const navigation = document.querySelector(".primary-navigation");
  const navLinks = [...document.querySelectorAll('.primary-navigation a[href^="#"]')];
  const form = document.querySelector("#rsvp-form");
  const formStatus = document.querySelector("#form-status");
  const dialog = document.querySelector("#rsvp-dialog");
  const dialogMessage = document.querySelector("#dialog-message");
  const dialogActions = document.querySelector("#dialog-actions");
  const copyButton = document.querySelector("#copy-rsvp");
  const downloadButton = document.querySelector("#download-rsvp");
  const attendanceInputs = [...document.querySelectorAll('input[name="aanwezigheid"]')];
  const attendeeControls = [...document.querySelectorAll(".attendee-only input, .attendee-only select")];
  const guestCount = document.querySelector("#guest-count");
  const draftKey = "colinda-simon-rsvp-draft";
  const isLocalPreview =
    window.location.protocol === "file:" ||
    ["localhost", "127.0.0.1"].includes(window.location.hostname);
  const activeRsvpProvider =
    isLocalPreview && config.rsvpProvider === "netlify" ? "preview" : config.rsvpProvider;
  let latestSummary = "";

  function updateHeader() {
    header?.classList.toggle("scrolled", window.scrollY > 24);
  }

  function closeMenu() {
    document.body.classList.remove("menu-open");
    menuToggle?.setAttribute("aria-expanded", "false");
    menuToggle?.setAttribute("aria-label", "Menu openen");
  }

  menuToggle?.addEventListener("click", () => {
    const willOpen = !document.body.classList.contains("menu-open");
    document.body.classList.toggle("menu-open", willOpen);
    menuToggle.setAttribute("aria-expanded", String(willOpen));
    menuToggle.setAttribute("aria-label", willOpen ? "Menu sluiten" : "Menu openen");
  });

  navigation?.addEventListener("click", (event) => {
    if (event.target.closest("a")) closeMenu();
  });

  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape") closeMenu();
  });

  window.addEventListener("scroll", updateHeader, { passive: true });
  updateHeader();

  function setCountdownValue(id, value) {
    const element = document.getElementById(id);
    if (element) element.textContent = String(value).padStart(2, "0");
  }

  function updateCountdown() {
    const difference = weddingDate.getTime() - Date.now();
    const countdown = document.querySelector("#countdown");

    if (difference <= 0) {
      if (countdown) {
        countdown.innerHTML = '<p class="countdown-finished">Vandaag vieren we de liefde!</p>';
      }
      return;
    }

    const days = Math.floor(difference / 86_400_000);
    const hours = Math.floor((difference % 86_400_000) / 3_600_000);
    const minutes = Math.floor((difference % 3_600_000) / 60_000);
    const seconds = Math.floor((difference % 60_000) / 1_000);

    setCountdownValue("days", days);
    setCountdownValue("hours", hours);
    setCountdownValue("minutes", minutes);
    setCountdownValue("seconds", seconds);
  }

  updateCountdown();
  window.setInterval(updateCountdown, 1000);

  const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const revealElements = document.querySelectorAll(".reveal");

  if (prefersReducedMotion || !("IntersectionObserver" in window)) {
    revealElements.forEach((element) => element.classList.add("visible"));
  } else {
    const revealObserver = new IntersectionObserver(
      (entries, observer) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("visible");
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.12, rootMargin: "0px 0px -40px" },
    );

    revealElements.forEach((element, index) => {
      element.style.transitionDelay = `${Math.min(index % 4, 3) * 70}ms`;
      revealObserver.observe(element);
    });
  }

  const pageSections = navLinks
    .map((link) => document.querySelector(link.getAttribute("href")))
    .filter(Boolean);

  if ("IntersectionObserver" in window) {
    const sectionObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;
          const currentLink = navLinks.find(
            (link) => link.getAttribute("href") === `#${entry.target.id}`,
          );
          navLinks.forEach((link) => link.removeAttribute("aria-current"));
          currentLink?.setAttribute("aria-current", "location");
        });
      },
      { rootMargin: "-35% 0px -55% 0px", threshold: 0 },
    );

    pageSections.forEach((section) => sectionObserver.observe(section));
  }

  function formToObject(formElement) {
    const rawData = new FormData(formElement);
    const output = {};
    for (const [key, value] of rawData.entries()) {
      if (key === "company" || key === "form-name") continue;
      output[key] = typeof value === "string" ? value.trim() : value;
    }
    return output;
  }

  function updateAttendanceState() {
    if (!form) return;
    const selectedAttendance = form.querySelector('input[name="aanwezigheid"]:checked');
    const isAbsent = selectedAttendance?.value === "Helaas verhinderd";

    form.classList.toggle("is-absent", isAbsent);
    attendeeControls.forEach((control) => {
      control.disabled = isAbsent;
    });
    if (guestCount) guestCount.required = !isAbsent;
  }

  function createSummary(data) {
    const labels = {
      namen: "Naam / namen",
      aanwezigheid: "Aanwezigheid",
      aantal_gasten: "Aantal gasten",
      email: "E-mailadres",
      dieetwensen: "Dieetwensen / allergieën",
      overnachting: "Overnachting",
      muziektip: "Muziektip",
      bericht: "Bericht",
      privacy_akkoord: "Toestemming",
    };

    const lines = [
      "RSVP bruiloft Colinda & Simon",
      "3 oktober 2026",
      "",
    ];

    Object.entries(labels).forEach(([key, label]) => {
      if (!data[key]) return;
      const value = key === "privacy_akkoord" ? "Akkoord" : data[key];
      lines.push(`${label}: ${value}`);
    });

    lines.push("", `Ingevuld op: ${new Intl.DateTimeFormat("nl-NL", {
      dateStyle: "long",
      timeStyle: "short",
    }).format(new Date())}`);

    return lines.join("\n");
  }

  function saveDraft() {
    if (!form) return;
    try {
      localStorage.setItem(draftKey, JSON.stringify(formToObject(form)));
    } catch {
      // De browser kan opslag blokkeren. Het formulier blijft bruikbaar.
    }
  }

  function restoreDraft() {
    if (!form) return;

    let draft;
    try {
      draft = JSON.parse(localStorage.getItem(draftKey));
    } catch {
      return;
    }
    if (!draft) return;

    Object.entries(draft).forEach(([name, value]) => {
      const fields = form.querySelectorAll(`[name="${CSS.escape(name)}"]`);
      fields.forEach((field) => {
        if (field.type === "radio") {
          field.checked = field.value === value;
        } else if (field.type === "checkbox") {
          field.checked = Boolean(value);
        } else {
          field.value = value;
        }
      });
    });
  }

  restoreDraft();
  updateAttendanceState();
  attendanceInputs.forEach((input) => input.addEventListener("change", updateAttendanceState));
  form?.addEventListener("input", saveDraft);
  form?.addEventListener("change", saveDraft);

  function openDialog(message, showActions = false) {
    if (!dialog) return;
    dialogMessage.textContent = message;
    dialogActions.hidden = !showActions;

    if (typeof dialog.showModal === "function") {
      dialog.showModal();
    } else {
      dialog.setAttribute("open", "");
    }
  }

  function closeDialog() {
    if (!dialog) return;
    if (typeof dialog.close === "function") dialog.close();
    else dialog.removeAttribute("open");
  }

  dialog?.querySelector(".dialog-close")?.addEventListener("click", closeDialog);
  dialog?.addEventListener("click", (event) => {
    const bounds = dialog.getBoundingClientRect();
    const clickedBackdrop =
      event.clientX < bounds.left ||
      event.clientX > bounds.right ||
      event.clientY < bounds.top ||
      event.clientY > bounds.bottom;
    if (clickedBackdrop) closeDialog();
  });

  async function submitToEndpoint(data) {
    const response = await fetch(config.rsvpEndpoint, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });
    if (!response.ok) throw new Error(`RSVP endpoint gaf status ${response.status}`);
  }

  async function submitToGoogleSheets(data) {
    const endpoint = config.rsvpEndpoint?.trim();
    if (!endpoint || !endpoint.startsWith("https://script.google.com/macros/s/")) {
      throw new Error("Vul de Google Apps Script-webapp-URL in site-config.js in.");
    }

    await fetch(endpoint, {
      method: "POST",
      mode: "no-cors",
      headers: { "Content-Type": "text/plain;charset=utf-8" },
      body: JSON.stringify({
        ...data,
        bron: window.location.href,
      }),
    });
  }

  async function submitToNetlify(data) {
    const body = new URLSearchParams({
      "form-name": "bruiloft-rsvp",
      ...data,
    });
    const response = await fetch("/", {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: body.toString(),
    });
    if (!response.ok) throw new Error(`Netlify Forms gaf status ${response.status}`);
  }

  function submitByEmail(data) {
    const subject = encodeURIComponent(`RSVP bruiloft Colinda & Simon · ${data.namen}`);
    const body = encodeURIComponent(latestSummary);
    window.location.href = `mailto:${encodeURIComponent(config.rsvpEmail)}?subject=${subject}&body=${body}`;
  }

  function clearDraftAfterSuccess() {
    try {
      localStorage.removeItem(draftKey);
    } catch {
      // Lokale opslag staat los van de bevestiging.
    }
    form?.reset();
    updateAttendanceState();
  }

  form?.addEventListener("submit", async (event) => {
    event.preventDefault();

    if (!form.reportValidity()) return;
    const submitButton = form.querySelector('button[type="submit"]');
    const originalButtonText = submitButton.innerHTML;
    const data = formToObject(form);

    if (form.elements.company?.value) return;

    latestSummary = createSummary(data);
    formStatus.textContent = "Je RSVP wordt verwerkt…";
    submitButton.disabled = true;
    submitButton.textContent = "Even geduld…";

    try {
      switch (activeRsvpProvider) {
        case "google-sheets":
          await submitToGoogleSheets(data);
          clearDraftAfterSuccess();
          openDialog("Jullie antwoord is ontvangen. We kijken ernaar uit om samen te vieren.");
          break;
        case "netlify":
          await submitToNetlify(data);
          clearDraftAfterSuccess();
          openDialog("Jullie antwoord is ontvangen. We kijken ernaar uit om samen te vieren.");
          break;
        case "endpoint":
          if (!config.rsvpEndpoint) throw new Error("Vul rsvpEndpoint in site-config.js in.");
          await submitToEndpoint(data);
          clearDraftAfterSuccess();
          openDialog("Jullie antwoord is ontvangen. We kijken ernaar uit om samen te vieren.");
          break;
        case "email":
          if (!config.rsvpEmail) throw new Error("Vul rsvpEmail in site-config.js in.");
          submitByEmail(data);
          openDialog("Je e-mailprogramma opent met de ingevulde RSVP. Verstuur het bericht daar om je reactie te bevestigen.");
          break;
        default:
          saveDraft();
          openDialog(
            "Je RSVP is lokaal bewaard. Kopieer of download de reactie vanuit deze preview.",
            true,
          );
      }
      formStatus.textContent = "";
    } catch (error) {
      console.error(error);
      saveDraft();
      formStatus.textContent = "De verbinding haperde. Je invoer staat veilig als concept klaar.";
      openDialog(
        "Je invoer staat lokaal klaar. Kopieer of download de RSVP en probeer de verzending later opnieuw.",
        true,
      );
    } finally {
      submitButton.disabled = false;
      submitButton.innerHTML = originalButtonText;
    }
  });

  copyButton?.addEventListener("click", async () => {
    try {
      await navigator.clipboard.writeText(latestSummary);
      copyButton.textContent = "Gekopieerd";
      window.setTimeout(() => {
        copyButton.textContent = "Kopieer RSVP";
      }, 1800);
    } catch {
      const textArea = document.createElement("textarea");
      textArea.value = latestSummary;
      document.body.appendChild(textArea);
      textArea.select();
      document.execCommand("copy");
      textArea.remove();
      copyButton.textContent = "Gekopieerd";
    }
  });

  downloadButton?.addEventListener("click", () => {
    const blob = new Blob([latestSummary], { type: "text/plain;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = "rsvp-colinda-simon.txt";
    link.click();
    URL.revokeObjectURL(url);
  });
})();
