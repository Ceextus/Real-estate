// Generates a marketing description for a property from the details already
// entered in the form. Uses the Google Gemini API (free tier) server-side so
// the API key never reaches the browser.

export const runtime = "nodejs";

// Build a compact, readable details block from whatever the form has so far.
function buildDetails(p = {}) {
  const lines = [];
  const add = (label, val) => {
    if (Array.isArray(val) ? val.length : val) lines.push(`${label}: ${Array.isArray(val) ? val.join(", ") : val}`);
  };
  add("Title", p.title);
  add("Location", p.location);
  add("Price", p.price);
  add("Type", p.type);
  add("Bedrooms", p.beds);
  add("Status", p.status);
  add("Category", p.property_type);
  add("Plot / land size", p.size);
  add("Developer", p.developer);
  add("Features", p.features);
  add("Estate facilities", p.facilities);
  if (Array.isArray(p.plot_types) && p.plot_types.length) {
    const tiers = p.plot_types
      .filter((t) => t && (t.size || t.price || t.type))
      .map((t) => [t.type, t.size, t.price].filter(Boolean).join(" – "));
    if (tiers.length) lines.push(`Plot options: ${tiers.join("; ")}`);
  }
  add("Payment options", p.payment_options);
  return lines.join("\n");
}

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

  const property = body?.property || {};
  const details = buildDetails(property);

  if (!details.trim()) {
    return Response.json(
      { error: "Add at least a title, location, or some details first." },
      { status: 400 }
    );
  }

  const prompt = `You are a professional real estate copywriter for Andreams Homes, a property company in Nigeria. Write an engaging, credible description for the property below.

Rules:
- 2 short paragraphs, roughly 60–110 words total.
- Use ONLY the details provided. Never invent prices, sizes, features, locations, or amenities that are not listed.
- Warm, aspirational, professional tone. Nigerian English. Address prospective buyers.
- Plain prose only — no markdown, no headings, no bullet points, no emojis.
- Do not include phone numbers, website URLs, or the word "PROMO".
- Do not start with "Introducing" or restate the title verbatim as a heading.

Property details:
${details}`;

  const model = "gemini-2.5-flash";
  const url = `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${apiKey}`;

  const payload = {
    contents: [{ parts: [{ text: prompt }] }],
    generationConfig: {
      temperature: 0.7,
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

  const text = result?.candidates?.[0]?.content?.parts?.[0]?.text;
  if (!text) {
    return Response.json(
      { error: "Gemini did not return a description." },
      { status: 422 }
    );
  }

  return Response.json({ description: text.trim() });
}
