// Admin-entered text is free-form; these only tidy how it reads on the page.

const ACRONYMS = /\b(Bq|Fct|Dpc|Fha|Amac)\b/g;
const isShouting = (s) => s && s === s.toUpperCase() && /[A-Z]/.test(s);
const titleCase = (s) =>
  s
    .toLowerCase()
    .replace(/(^|[\s(\-—/])([a-z])/g, (m, p, c) => p + c.toUpperCase())
    .replace(ACRONYMS, (w) => w.toUpperCase());

// Collapses whitespace and turns ALL-CAPS strings into Title Case.
export const tidy = (s) => {
  const t = (s ?? "").replace(/\s+/g, " ").trim();
  return isShouting(t) ? titleCase(t) : t;
};

// "NOW SELLING" → "Now selling"
export const sentence = (s) => {
  const t = tidy(s).toLowerCase();
  return t ? t[0].toUpperCase() + t.slice(1) : "";
};

// Nigerian phone numbers: 08065688946 → "0806 568 8946" for display, "+2348065688946" for tel: links.
export const displayPhone = (p) => p.replace(/\s/g, "").replace(/^(\d{4})(\d{3})(\d{4})$/, "$1 $2 $3");
export const telPhone = (p) => {
  const d = p.replace(/\s/g, "");
  return d.startsWith("0") ? `+234${d.slice(1)}` : d;
};

// "₦ 15,000,000" → "₦15,000,000"
export const formatPrice = (p) => (p ?? "").replace(/₦\s+/g, "₦").trim();

// "4" → "4 beds"; free text like "4 Bedrooms + BQ" is kept as entered.
export const formatBeds = (b) => {
  const t = tidy(b);
  return /^\d+$/.test(t) ? `${t} ${t === "1" ? "bed" : "beds"}` : t;
};
