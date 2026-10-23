const Anthropic = require("@anthropic-ai/sdk");

// AgroBot's conversational brain. Enabled only when ANTHROPIC_API_KEY is set;
// otherwise the controller's built-in rule engine answers on its own.
const MODEL = process.env.AGROBOT_MODEL || "claude-opus-5-5";
const MAX_HISTORY = 12;

let client = null;
const getClient = () => {
  if (!process.env.ANTHROPIC_API_KEY) return null;
  if (!client) client = new Anthropic.default();
  return client;
};

const SYSTEM_PROMPT = `You are AgroBot, the assistant inside AgroVerse, an Indian organic-farming traceability platform that connects farmers, buyers, transporters and admins. Every crop batch gets a QR code and a blockchain-anchored traceability record (farm -> transport -> buyer).

You help with:
- organic farming practice for Indian conditions: soil health, Jeevamrutha, vermicompost, green manure, neem/Panchagavya and other bio-pesticides, crop rotation, irrigation, seasonal (kharif/rabi/zaid) planning
- organic certification in India: NPOP/APEDA third-party certification, PGS-India, the Jaivik Bharat logo
- using AgroVerse: listing a batch, generating QR labels, verifying a QR, orders, shipments, cold-chain temperature logs, payments
- market questions for organic produce

Style: warm, practical, and short - like a knowledgeable Krishi Vigyan Kendra officer talking to a farmer. Use simple words, short paragraphs or "•" bullets, and **bold** for key terms. Keep most answers under 150 words unless the user asks for detail. Do not use markdown headings or tables.

Photos: when the user sends a crop or leaf photo, describe what you can actually see (spots, discolouration, pests, wilting), give the most likely causes ranked, organic-friendly treatments, and say clearly that a photo diagnosis is a best guess - confirm with the local KVK if it spreads. If the image is not a plant, say so.

Accuracy: you have no live market feed of your own. When you quote prices, say they are indicative and suggest checking Agmarknet / eNAM or the local mandi. For chemicals, doses or animal/human health, give safe general guidance and recommend the local KVK or agriculture officer for anything risky. Never invent batch records - only describe a batch from the platform data you are given. If something is outside farming and AgroVerse, answer briefly and steer back.`;

const formatHistory = (history) =>
  (Array.isArray(history) ? history : [])
    .filter((m) => m && typeof m.text === "string" && m.text.trim() && (m.sender === "user" || m.sender === "bot"))
    .slice(-MAX_HISTORY)
    .map((m) => ({ role: m.sender === "user" ? "user" : "assistant", content: m.text.slice(0, 4000) }));

// The conversation must open with a user turn (the stored history starts with the
// bot's greeting). Consecutive same-role turns are fine; the API merges them.
const normaliseTurns = (turns) => {
  const firstUser = turns.findIndex((t) => t.role === "user");
  return firstUser === -1 ? [] : turns.slice(firstUser);
};

async function generateAiReply({ message, role, user, language, history, platformNotes, image }) {
  const anthropic = getClient();
  if (!anthropic) return null;

  const context = [
    `User role: ${role || "guest"}${user?.name ? ` (name: ${user.name})` : ""}.`,
    `Reply language: ${language || "English"}. Write the whole reply in this language and its native script, even if the user typed in English or Hinglish; keep batch IDs, numbers and units as they are.`,
    platformNotes ? `Platform data for this question (authoritative - use it, do not contradict it):\n${platformNotes}` : null,
  ].filter(Boolean).join("\n\n");

  const text = `<context>\n${context}\n</context>\n\n${message}`;
  const latest = image
    ? {
        role: "user",
        content: [
          { type: "image", source: { type: "base64", media_type: image.mediaType, data: image.data } },
          { type: "text", text },
        ],
      }
    : { role: "user", content: text };
  const turns = normaliseTurns([...formatHistory(history), latest]);

  try {
    const response = await anthropic.beta.messages.create({
      model: MODEL,
      max_tokens: 4000,
      system: SYSTEM_PROMPT,
      output_config: { effort: "low" },
      betas: ["server-side-fallback-2026-07-01"],
      fallbacks: "default",
      messages: turns,
    });

    if (response.stop_reason === "refusal") return null;
    const text = response.content
      .filter((block) => block.type === "text")
      .map((block) => block.text)
      .join("")
      .trim();
    return text || null;
  } catch (error) {
    if (error instanceof Anthropic.AuthenticationError) {
      console.error("[AgroBot] Invalid ANTHROPIC_API_KEY - using rule engine.");
    } else if (error instanceof Anthropic.RateLimitError) {
      console.warn("[AgroBot] Rate limited - using rule engine for this reply.");
    } else if (error instanceof Anthropic.APIError) {
      console.warn(`[AgroBot] API error ${error.status}: ${error.message}`);
    } else {
      console.warn("[AgroBot] AI reply failed:", error?.message);
    }
    return null;
  }
}

module.exports = { generateAiReply, isAiEnabled: () => Boolean(process.env.ANTHROPIC_API_KEY) };
