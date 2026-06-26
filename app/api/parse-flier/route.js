// Parses a property flier/poster image into structured listing data using the
// Google Gemini API (free tier). The API key never reaches the browser — the
// image is sent here, parsed server-side, and only clean JSON is returned.

export const runtime = "nodejs";

// Must match the checkbox list in app/admin/properties/page.jsx so returned
// facilities map directly onto the form's checkboxes.
const STANDARD_FACILITIES = [
  "Water (Bore Holes)",
  "Electricity (PHCN)",
  "Access Road / Police Post",
  "Clinic / School",
  "Religious Centres",
  "Corner Shops / Malls",
  "Sport Facilities",
  "Administrative Office",
  "Gas Station",
  "ATM Galaxy",
  "Estate Transports",
];

// Gemini responseSchema (OpenAPI subset) — mirrors the `properties` table columns.
const responseSchema = {
  type: "OBJECT",
  properties: {
    title: { type: "STRING" },
    location: { type: "STRING" },
    price: { type: "STRING" },
    type: { type: "STRING" },
    beds: { type: "STRING" },
    status: { type: "STRING" },
    property_type: {
      type: "STRING",
      enum: ["Buy & Build", "Move-In Ready", "Investment / Residential"],
    },
    size: { type: "STRING" },
    description: { type: "STRING" },
    features: { type: "ARRAY", items: { type: "STRING" } },
    developer: { type: "STRING" },
    supported_by: { type: "STRING" },
    registration_fee: { type: "STRING" },
    payment_options: { type: "ARRAY", items: { type: "STRING" } },
    facilities: {
      type: "ARRAY",
      items: { type: "STRING", enum: STANDARD_FACILITIES },
    },
    plot_types: {
      type: "ARRAY",
      items: {
        type: "OBJECT",
        properties: {
          type: { type: "STRING" },
          size: { type: "STRING" },
          units: { type: "STRING" },
          price: { type: "STRING" },
        },
      },
    },
    service_plots: {
      type: "ARRAY",
      items: {
        type: "OBJECT",
        properties: {
          size: { type: "STRING" },
          house_type: { type: "STRING" },
          price: { type: "STRING" },
        },
      },
    },
    bank_details: {
      type: "ARRAY",
      items: {
        type: "OBJECT",
        properties: {
          bank: { type: "STRING" },
          account_name: { type: "STRING" },
          account_no: { type: "STRING" },
        },
      },
    },
  },
};

const PROMPT = `You are a data extraction assistant for a Nigerian real estate company (Andreams Homes). Extract structured property-listing data from this flier / poster image.

Strict rules:
- Only extract information that is clearly visible in the image. If a field is not shown, return an empty string "" (or empty array []). Never invent, assume, or guess values.
- price: the main headline price. If several tiered prices are shown (e.g. different plot sizes), put the lowest / starting price here and capture EVERY tier in plot_types.
- plot_types: for land / plot offerings, set "size" (e.g. "500 sqm") and "price" for each tier shown on the flier. Leave "type" and "units" empty if not shown.
- service_plots: only if the flier explicitly lists serviced plots with a house type.
- All monetary values must use the Naira symbol "₦" with thousands separators. Convert shorthand like "N5.5M" to "₦5,500,000" and "N3.5M" to "₦3,500,000".
- title: a concise listing title, typically the estate / project name plus its location.
- location: the property location or address shown on the flier.
- features: amenities and selling points listed on the flier (e.g. "Fencing", "Running Water", "Internal Roads and Drainages", "Security Outpost").
- facilities: ONLY values from the allowed enum list. Map synonyms: Electricity → "Electricity (PHCN)"; Water / Running Water → "Water (Bore Holes)"; Security Outpost / Police Post → "Access Road / Police Post". Omit anything with no clear match.
- developer: the company / brand name on the flier if shown.
- payment_options: each payment plan / term shown on the flier as a separate string (e.g. "Outright Full Payment (5% discount)", "Down Payment: 40%", "Installmental over 12 months").
- bank_details: for every bank account shown, set "bank" (bank name), "account_name", and "account_no". Only include accounts actually printed on the flier.
- Do not include phone numbers, websites, or "PROMO" badges in any text field.`;

export async function POST(request) {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    return Response.json(
      { error: "GEMINI_API_KEY is not configured on the server." },
      { status: 500 }
    );
  }

  let body;
  try {
    body = await request.json();
  } catch {
    return Response.json({ error: "Invalid request body." }, { status: 400 });
  }

  const { image, mimeType } = body || {};
  if (!image) {
    return Response.json({ error: "No image provided." }, { status: 400 });
  }

  const model = "gemini-2.5-flash";
  const url = `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${apiKey}`;

  const payload = {
    contents: [
      {
        parts: [
          { text: PROMPT },
          { inline_data: { mime_type: mimeType || "image/jpeg", data: image } },
        ],
      },
    ],
    generationConfig: {
      responseMimeType: "application/json",
      responseSchema,
      temperature: 0,
      // Extraction doesn't need deep reasoning — skip thinking for speed + lower token use.
      thinkingConfig: { thinkingBudget: 0 },
    },
  };

  let geminiRes;
  try {
    geminiRes = await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });
  } catch (err) {
    return Response.json(
      { error: `Could not reach Gemini: ${err.message}` },
      { status: 502 }
    );
  }

  const result = await geminiRes.json();

  if (!geminiRes.ok) {
    const msg = result?.error?.message || "Gemini request failed.";
    return Response.json({ error: msg }, { status: geminiRes.status });
  }

  // Surface safety blocks / empty candidates clearly instead of a vague crash.
  const blockReason = result?.promptFeedback?.blockReason;
  if (blockReason) {
    return Response.json(
      { error: `Image was blocked by Gemini (${blockReason}).` },
      { status: 422 }
    );
  }

  const text = result?.candidates?.[0]?.content?.parts?.[0]?.text;
  if (!text) {
    return Response.json(
      { error: "Gemini returned no readable data from this image." },
      { status: 422 }
    );
  }

  let data;
  try {
    data = JSON.parse(text);
  } catch {
    return Response.json(
      { error: "Could not parse the data Gemini returned." },
      { status: 502 }
    );
  }

  return Response.json({ data });
}
