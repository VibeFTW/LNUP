const GEMINI_URL =
  "https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent";

const MAX_RETRIES = 3;
const BASE_DELAY_MS = 2000;

export interface GeminiRequestOptions {
  apiKey: string;
  contents: { parts: { text: string }[] }[];
  systemInstruction?: { parts: { text: string }[] };
  tools?: object[];
  temperature?: number;
  maxOutputTokens?: number;
}

export interface GroundingChunk {
  web?: { uri: string; title?: string };
}

export interface GeminiResult {
  text: string;
  groundingUrls: string[];
}

export async function geminiRequest(options: GeminiRequestOptions): Promise<GeminiResult> {
  if (!options.apiKey) {
    throw new Error("Gemini API-Key fehlt. Bitte in .env konfigurieren.");
  }

  const useJsonMode = !options.tools || options.tools.length === 0;

  const generationConfig: Record<string, unknown> = {
    temperature: options.temperature ?? 0.2,
    maxOutputTokens: options.maxOutputTokens ?? 8192,
  };
  if (useJsonMode) {
    generationConfig.response_mime_type = "application/json";
  }

  const body: Record<string, unknown> = {
    contents: options.contents,
    generationConfig,
  };

  if (options.systemInstruction) {
    body.system_instruction = options.systemInstruction;
  }
  if (options.tools) {
    body.tools = options.tools;
  }

  const requestBody = JSON.stringify(body);

  let response: Response | null = null;
  for (let attempt = 0; attempt <= MAX_RETRIES; attempt++) {
    response = await fetch(`${GEMINI_URL}?key=${options.apiKey}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: requestBody,
    });

    if (response.ok) break;

    if (response.status === 429 && attempt < MAX_RETRIES) {
      const delay = BASE_DELAY_MS * Math.pow(2, attempt);
      console.warn(`Gemini 429 rate limit, retry ${attempt + 1}/${MAX_RETRIES} in ${delay}ms`);
      await new Promise((r) => setTimeout(r, delay));
      continue;
    }

    const errorBody = await response.text().catch(() => "");
    console.warn(`Gemini API error ${response.status}:`, errorBody);

    if (response.status === 429) {
      throw new Error("Rate-Limit erreicht. Bitte warte eine Minute und versuche es erneut.");
    }
    throw new Error(`Gemini API Fehler (${response.status})`);
  }

  const result = await (response as Response).json();

  const candidate = result?.candidates?.[0];
  const text = candidate?.content?.parts
    ?.map((p: any) => p.text ?? "")
    .join("") ?? "";

  const groundingUrls = extractGroundingUrls(candidate);

  return { text, groundingUrls };
}

function extractGroundingUrls(candidate: any): string[] {
  const chunks: GroundingChunk[] =
    candidate?.groundingMetadata?.groundingChunks ?? [];
  return chunks
    .map((c) => c.web?.uri)
    .filter((uri): uri is string => !!uri);
}

export function parseJsonArray<T>(text: string): T[] {
  if (!text) return [];

  try {
    const parsed = JSON.parse(text);
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    const cleaned = text.replace(/```json\s*/gi, "").replace(/```\s*/g, "");
    const jsonMatch = cleaned.match(/\[[\s\S]*\]/);
    if (!jsonMatch) return [];

    try {
      const parsed = JSON.parse(jsonMatch[0]);
      return Array.isArray(parsed) ? parsed : [];
    } catch {
      const lastComplete = jsonMatch[0].lastIndexOf("},");
      if (lastComplete > 0) {
        try {
          return JSON.parse(jsonMatch[0].substring(0, lastComplete + 1) + "]");
        } catch {
          return [];
        }
      }
      return [];
    }
  }
}
