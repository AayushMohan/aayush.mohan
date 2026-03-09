type OpenAIChatMessage = {
  role: "system" | "user" | "assistant";
  content: string;
};

type OpenAIChatCompletionRequest = {
  model: string;
  messages: OpenAIChatMessage[];
  temperature?: number;
  max_tokens?: number;
};

type OpenAIChatCompletionResponse = {
  choices?: Array<{ message?: { content?: string } }>;
};

type GeminiGenerateContentResponse = {
  candidates?: Array<{
    content?: {
      parts?: Array<{ text?: string }>;
    };
  }>;
};

function withTimeout(ms: number): { signal: AbortSignal; cancel: () => void } {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), ms);
  return {
    signal: controller.signal,
    cancel: () => clearTimeout(timer),
  };
}

export type SummaryResult = {
  provider: "gemini" | "groq";
  summary: string;
};

function normalizeSummaryText(input: string): string {
  return input
    .replace(/\s+/g, " ")
    .replace(/^Summary:\s*/i, "")
    .trim();
}

function countSentences(text: string): number {
  const trimmed = text.trim();
  if (!trimmed) return 0;
  // Rough heuristic; good enough for gating.
  const matches = trimmed.match(/[.!?](\s|$)/g);
  return matches?.length ?? 0;
}

function splitSentences(text: string): string[] {
  const cleaned = text.replace(/\s+/g, " ").trim();
  if (!cleaned) return [];
  return cleaned
    .split(/(?<=[.!?])\s+/)
    .map((s) => s.trim())
    .filter(Boolean);
}

function toTwoSentences(text: string): string {
  const parts = splitSentences(text);
  if (parts.length <= 2) return text.trim();
  return `${parts[0]} ${parts[1]}`.trim();
}

function extractKeywords(source: string, limit = 40): string[] {
  const stop = new Set([
    "about",
    "after",
    "again",
    "also",
    "another",
    "because",
    "before",
    "being",
    "between",
    "could",
    "does",
    "doing",
    "during",
    "each",
    "either",
    "from",
    "have",
    "into",
    "just",
    "like",
    "more",
    "most",
    "much",
    "only",
    "other",
    "over",
    "post",
    "should",
    "some",
    "such",
    "that",
    "their",
    "them",
    "then",
    "there",
    "these",
    "this",
    "those",
    "through",
    "under",
    "very",
    "what",
    "when",
    "where",
    "which",
    "will",
    "with",
    "your",
  ]);

  const words = source
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, " ")
    .split(/\s+/)
    .map((w) => w.trim())
    .filter(Boolean)
    .filter((w) => w.length >= 6)
    .filter((w) => !stop.has(w))
    .filter((w) => !/^\d+$/.test(w));

  const seen = new Set<string>();
  const out: string[] = [];
  for (const w of words) {
    if (seen.has(w)) continue;
    seen.add(w);
    out.push(w);
    if (out.length >= limit) break;
  }
  return out;
}

function keywordOverlapCount(summary: string, source: string): number {
  const keys = extractKeywords(source, 40);
  if (keys.length === 0) return 0;
  const s = summary.toLowerCase();
  let count = 0;
  for (const k of keys) {
    // word boundary-ish match
    const re = new RegExp(`(^|[^a-z0-9])${k}([^a-z0-9]|$)`, "i");
    if (re.test(s)) count += 1;
  }
  return count;
}

function looksTooGeneric(text: string): boolean {
  const t = text.toLowerCase();
  // Common low-signal openers that often precede generic summaries.
  if (t.startsWith("this guide explains") || t.startsWith("this post explains")) {
    // Allow if it also contains technical anchors.
    const hasAnchors =
      /(rag|retriev|embed|chunk|rerank|vector|prompt|hallucin|ground|eval|latency|cache)/i.test(
        text,
      );
    return !hasAnchors;
  }
  return false;
}

function looksTooDramatic(text: string): boolean {
  const t = text.toLowerCase();
  // Avoid contrarian / hype framing.
  if (t.includes("not because")) return true;
  if (t.includes("at its core")) return true;
  if (t.includes("buzzword")) return true;
  if (t.includes("trendy")) return true;
  if (t.includes("the biggest misconception")) return true;
  if (t.includes("the real problem")) return true;
  if (t.includes("game-changer")) return true;
  return false;
}

function isAcceptableSummary(text: string, sourceText?: string): boolean {
  const trimmed = text.trim();
  const two = toTwoSentences(trimmed);
  if (two.length < 180) return false;
  if (two.length > 520) return false;
  if (countSentences(two) !== 2) return false;
  if (!/[.!?]$/.test(two)) return false;
  if (looksTooGeneric(two)) return false;
  if (looksTooDramatic(two)) return false;
  if (sourceText) {
    // Ensure it's grounded and not generic: require some lexical overlap.
    if (keywordOverlapCount(two, sourceText) < 3) return false;
  }
  return true;
}

async function geminiGenerate(opts: {
  url: string;
  prompt: string;
  temperature: number;
  maxOutputTokens: number;
}): Promise<{ ok: boolean; status: number; text: string | null }> {
  const timeout = withTimeout(8000);
  try {
    const res = await fetch(opts.url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      signal: timeout.signal,
      body: JSON.stringify({
        contents: [{ role: "user", parts: [{ text: opts.prompt }] }],
        generationConfig: {
          temperature: opts.temperature,
          maxOutputTokens: opts.maxOutputTokens,
        },
      }),
    });

    if (!res.ok) return { ok: false, status: res.status, text: null };
    const json = (await res.json()) as GeminiGenerateContentResponse;
    const raw = json.candidates?.[0]?.content?.parts?.[0]?.text?.trim();
    return {
      ok: true,
      status: res.status,
      text: raw ? normalizeSummaryText(raw) : null,
    };
  } finally {
    timeout.cancel();
  }
}

async function summarizeWithGemini(text: string): Promise<string | null> {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    if (process.env.AI_SUMMARY_DEBUG === "1") {
      console.info("[ai-summary] gemini: no GEMINI_API_KEY");
    }
    return null;
  }

  const model = process.env.GEMINI_MODEL || "gemini-1.5-flash";
  const url = `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${encodeURIComponent(
    apiKey,
  )}`;

  const prompt =
    "Write a clean synopsis for an engineering blog post.\n" +
    "Output EXACTLY 2 sentences, plain text.\n" +
    "Sentence 1: topic + scope (what the post covers).\n" +
    "Sentence 2: 3–5 concrete key ideas/techniques actually covered (use terms present in the text).\n" +
    "Rules: grounded ONLY in the provided text; avoid hype and contrarian/dramatic phrasing (no 'not because', no 'at its core', no 'buzzword'); no bullets; no title; no prefix.\n\n" +
    "TEXT:\n" +
    text;

  let first: { ok: boolean; status: number; text: string | null };
  try {
    first = await geminiGenerate({
      url,
      prompt,
      temperature: 0.15,
      maxOutputTokens: 220,
    });
  } catch (e) {
    if (process.env.AI_SUMMARY_DEBUG === "1") {
      const msg = e instanceof Error ? e.message : String(e);
      console.info(`[ai-summary] gemini: fetch failed (${msg})`);
    }
    return null;
  }

  if (process.env.AI_SUMMARY_DEBUG === "1") {
    console.info(`[ai-summary] gemini: http=${first.status}`);
  }

  const candidate = first.text;
  if (candidate) {
    const normalized = toTwoSentences(candidate);
    if (isAcceptableSummary(normalized, text)) return normalized;
  }

  // Retry once with stricter formatting if we got a low-quality/partial response.
  const retryPrompt =
    "Write EXACTLY 2 complete sentences (end both with a period). " +
    "Target length: 220–420 characters total. " +
    "Sentence 1: topic + scope. Sentence 2: 3–5 key ideas/techniques from the text. " +
    "Avoid hype and dramatic phrasing. Ground every claim in the provided text.\n\n" +
    "TEXT:\n" +
    text;

  try {
    const retry = await geminiGenerate({
      url,
      prompt: retryPrompt,
      temperature: 0.05,
      maxOutputTokens: 260,
    });
    const retryText = retry.text;
    if (retryText) {
      const normalized = toTwoSentences(retryText);
      if (isAcceptableSummary(normalized, text)) return normalized;
    }
  } catch {
    // ignore
  }

  return null;
}

export async function summarizeTextWithProviderCached(opts: {
  cacheKeyParts: string[];
  text: string;
  revalidateSeconds?: number;
}): Promise<SummaryResult | null> {
  // Lazy import so this module can still be type-checked in non-Next contexts.
  const { unstable_cache } = await import("next/cache");
  const revalidateSeconds = opts.revalidateSeconds ?? 60 * 60 * 24 * 7;

  const cleaned = compactWhitespace(opts.text);
  if (cleaned.length < 200) return null;

  // Guardrails for cost/latency.
  const clipped = cleaned.slice(0, 5000);

  const cached = unstable_cache(
    async () => {
      const result = await summarizeTextWithProvider(clipped);
      // Avoid caching "null" for long periods; treat as a cacheable miss.
      if (!result) {
        throw new Error("AI summary unavailable");
      }
      return result;
    },
    opts.cacheKeyParts,
    { revalidate: revalidateSeconds },
  );

  return cached();
}

async function summarizeWithGroq(text: string): Promise<string | null> {
  const apiKey = process.env.GROQ_API_KEY;
  if (!apiKey) return null;

  const body: OpenAIChatCompletionRequest = {
    model: process.env.GROQ_MODEL || "llama-3.1-8b-instant",
    temperature: 0.2,
    max_tokens: 140,
    messages: [
      {
        role: "system",
        content:
          "You write concise, accurate summaries for a personal engineering blog.",
      },
      {
        role: "user",
        content:
          "Summarize the post below in 2-3 sentences. Focus on what a full-stack developer / ML builder will learn. Avoid hype; be specific and factual.\n\nPOST:\n" +
          text,
      },
    ],
  };

  const res = await fetch("https://api.groq.com/openai/v1/chat/completions", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${apiKey}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify(body),
  });

  if (!res.ok) return null;

  const json = (await res.json()) as OpenAIChatCompletionResponse;
  const content = json.choices?.[0]?.message?.content?.trim();
  return content || null;
}

function compactWhitespace(input: string): string {
  return input.replace(/\s+/g, " ").trim();
}

export async function summarizeText(text: string): Promise<string | null> {
  const cleaned = compactWhitespace(text);
  if (cleaned.length < 200) return null;

  // Guardrails for cost/latency.
  const clipped = cleaned.slice(0, 5000);

  // Prefer Gemini if configured; fallback to Groq; else null.
  const gemini = await summarizeWithGemini(clipped);
  if (gemini) return gemini;
  return await summarizeWithGroq(clipped);
}

export async function summarizeTextWithProvider(
  text: string,
): Promise<SummaryResult | null> {
  const cleaned = compactWhitespace(text);
  if (cleaned.length < 200) return null;

  const clipped = cleaned.slice(0, 5000);

  const gemini = await summarizeWithGemini(clipped);
  if (gemini) return { provider: "gemini", summary: gemini };

  const groq = await summarizeWithGroq(clipped);
  if (groq) return { provider: "groq", summary: groq };

  return null;
}
