const CONTACT_EMAIL = "info@controlpointfinance.com";

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
    status.textContent = "Παρακαλώ συμπληρώστε σωστά τα υποχρεωτικά πεδία.";
    status.classList.add("error");
    return;
  }

  const data = Object.fromEntries(new FormData(form));
  const subject = `Αίτημα συνάντησης - ${data.company}`;
  const body = [
    `Ονοματεπώνυμο: ${data.name}`,
    `Εταιρεία: ${data.company}`,
    `Email: ${data.email}`,
    `Τηλέφωνο: ${data.phone || "-"}`,
    `Ετήσιος τζίρος: ${data.revenue || "-"}`,
    `Πακέτο: ${data.plan || "Δεν είμαι σίγουρος/η"}`,
    "",
    data.message,
  ].join("\n");

  window.location.href = `mailto:${CONTACT_EMAIL}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;

  status.textContent = "Ανοίγει το πρόγραμμα email σας για να ολοκληρωθεί η αποστολή. Ευχαριστώ!";
  status.classList.add("success");
  form.reset();
});
