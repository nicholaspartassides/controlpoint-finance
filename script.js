const CONTACT_EMAIL = "info@controlpointfinance.com";

const TEXT = {
  el: {
    invalid: "Παρακαλώ συμπληρώστε σωστά τα υποχρεωτικά πεδία.",
    success: "Ανοίγει το πρόγραμμα email σας για να ολοκληρωθεί η αποστολή. Ευχαριστούμε!",
    subject: "Αίτημα συνάντησης",
    name: "Ονοματεπώνυμο",
    company: "Εταιρεία",
    phone: "Τηλέφωνο",
    revenue: "Ετήσιος τζίρος",
    plan: "Πακέτο",
    notSure: "Δεν είμαι σίγουρος/η",
  },
  en: {
    invalid: "Please fill in all required fields correctly.",
    success: "Your email app is opening to complete the message. Thank you!",
    subject: "Consultation request",
    name: "Name",
    company: "Company",
    phone: "Phone",
    revenue: "Annual revenue",
    plan: "Package",
    notSure: "Not sure yet",
  },
};

const t = TEXT[document.documentElement.lang.startsWith("en") ? "en" : "el"];

document.getElementById("year").textContent = new Date().getFullYear();

const toggle = document.querySelector(".nav-toggle");
const nav = document.querySelector(".nav");

toggle.addEventListener("click", () => {
  const open = nav.classList.toggle("open");
  toggle.setAttribute("aria-expanded", open);
});

nav.querySelectorAll("a").forEach((link) =>
  link.addEventListener("click", () => {
    nav.classList.remove("open");
    toggle.setAttribute("aria-expanded", "false");
  })
);

const planSelect = document.getElementById("planSelect");
document.querySelectorAll("[data-plan]").forEach((btn) =>
  btn.addEventListener("click", () => {
    planSelect.value = btn.dataset.plan;
  })
);

const form = document.getElementById("contactForm");
const status = document.getElementById("formStatus");

form.addEventListener("submit", (e) => {
  e.preventDefault();
  status.className = "form-status";

  let valid = true;
  form.querySelectorAll("[required]").forEach((field) => {
    const ok = field.value.trim() !== "" && field.checkValidity();
    field.classList.toggle("invalid", !ok);
    if (!ok) valid = false;
  });

  if (!valid) {
    status.textContent = t.invalid;
    status.classList.add("error");
    return;
  }

  const data = Object.fromEntries(new FormData(form));
  const subject = `${t.subject} - ${data.company}`;
  const body = [
    `${t.name}: ${data.name}`,
    `${t.company}: ${data.company}`,
    `Email: ${data.email}`,
    `${t.phone}: ${data.phone || "-"}`,
    `${t.revenue}: ${data.revenue || "-"}`,
    `${t.plan}: ${data.plan || t.notSure}`,
    "",
    data.message,
  ].join("\n");

  window.location.href = `mailto:${CONTACT_EMAIL}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;

  status.textContent = t.success;
  status.classList.add("success");
  form.reset();
});
