const CONTACT_EMAIL = "info@controlpointfinance.com";
const isEn = document.documentElement.lang.startsWith("en");

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
    custom: "Προσαρμοσμένο πακέτο",
    customTotal: "Εκτιμώμενο σύνολο",
    meetings: "Συναντήσεις τον μήνα",
    perDay: "/ ημέρα",
    customNote: "Θα ήθελα προσαρμοσμένο πακέτο με τις υπηρεσίες που επέλεξα.",
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
    custom: "Custom package",
    customTotal: "Estimated total",
    meetings: "Meetings per month",
    perDay: "/ day",
    customNote: "I would like a custom package with the services I selected.",
  },
};

const t = TEXT[isEn ? "en" : "el"];
const customPlanName = isEn ? "Custom" : "Προσαρμοσμένο";

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
const form = document.getElementById("contactForm");
const status = document.getElementById("formStatus");

document.querySelectorAll("[data-plan]").forEach((btn) =>
  btn.addEventListener("click", () => {
    planSelect.value = btn.dataset.plan;
  })
);

function formatEuro(n) {
  return "€" + n.toLocaleString(isEn ? "en-GB" : "el-GR");
}

function getCustomSelection() {
  const pack = document.getElementById("customPack");
  if (!pack) return { total: 0, lines: [] };

  const lines = [];
  let total = 0;

  pack.querySelectorAll('input[name="svc"]').forEach((cb) => {
    const row = cb.closest("tr");
    if (row) row.classList.toggle("selected", cb.checked);
    if (!cb.checked) return;
    const price = Number(cb.dataset.price) || 0;
    total += price;
    lines.push(`${cb.value} (${formatEuro(price)})`);
  });

  const meet = document.getElementById("meetings");
  if (meet) {
    const qty = Math.max(0, Math.min(12, Math.round(Number(meet.value) || 0)));
    if (String(qty) !== meet.value) meet.value = String(qty);
    const row = meet.closest("tr");
    if (row) row.classList.toggle("selected", qty > 0);
    if (qty > 0) {
      const unit = Number(meet.dataset.price) || 100;
      total += qty * unit;
      const label = pack.querySelector('label[for="meetings"]')?.textContent.trim() || t.meetings;
      lines.push(`${label} × ${qty} (${formatEuro(unit)} ${t.perDay})`);
    }
  }

  return { total, lines };
}

function syncCustom() {
  const sel = getCustomSelection();
  const totalEl = document.getElementById("customTotal");
  if (totalEl) totalEl.textContent = formatEuro(sel.total);
  const summary = document.getElementById("customSummary");
  const totalField = document.getElementById("customTotalField");
  if (summary) summary.value = sel.lines.join("; ");
  if (totalField) totalField.value = sel.total ? formatEuro(sel.total) : "";
}

function markCustomPlan() {
  if (planSelect) planSelect.value = customPlanName;
}

const customPack = document.getElementById("customPack");
if (customPack) {
  customPack.addEventListener("change", (e) => {
    if (e.target.matches('input[name="svc"], #meetings')) {
      markCustomPlan();
      syncCustom();
    }
  });
  customPack.addEventListener("input", (e) => {
    if (e.target.id === "meetings") {
      markCustomPlan();
      syncCustom();
    }
  });

  customPack.querySelectorAll(".qty").forEach((btn) => {
    btn.addEventListener("click", () => {
      const meet = document.getElementById("meetings");
      if (!meet) return;
      const next = Math.max(0, Math.min(12, (Number(meet.value) || 0) + Number(btn.dataset.qty)));
      meet.value = String(next);
      markCustomPlan();
      syncCustom();
    });
  });

  customPack.querySelectorAll("tbody tr").forEach((row) => {
    const cb = row.querySelector('input[name="svc"]');
    if (!cb) return;
    row.addEventListener("click", (e) => {
      if (e.target === cb || e.target.closest("label")) return;
      cb.checked = !cb.checked;
      markCustomPlan();
      syncCustom();
    });
  });

  const customCta = document.getElementById("customCta");
  if (customCta) {
    customCta.addEventListener("click", () => {
      const message = form.querySelector('[name="message"]');
      if (message && !message.value.trim() && getCustomSelection().lines.length) {
        message.value = t.customNote;
      }
    });
  }

  syncCustom();
}

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

  syncCustom();
  const data = Object.fromEntries(new FormData(form));
  const subject = `${t.subject} - ${data.company}`;
  const bodyLines = [
    `${t.name}: ${data.name}`,
    `${t.company}: ${data.company}`,
    `Email: ${data.email}`,
    `${t.phone}: ${data.phone || "-"}`,
    `${t.revenue}: ${data.revenue || "-"}`,
    `${t.plan}: ${data.plan || t.notSure}`,
  ];
  if (data.custom) bodyLines.push(`${t.custom}: ${data.custom}`);
  if (data.customTotal) bodyLines.push(`${t.customTotal}: ${data.customTotal}`);
  bodyLines.push("", data.message);
  const body = bodyLines.join("\n");

  window.location.href = `mailto:${CONTACT_EMAIL}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;

  status.textContent = t.success;
  status.classList.add("success");
  form.reset();
  if (customPack) {
    customPack.querySelectorAll('input[name="svc"]').forEach((cb) => {
      cb.checked = false;
    });
    const meet = document.getElementById("meetings");
    if (meet) meet.value = "0";
    syncCustom();
  }
});
