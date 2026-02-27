import { GEMINI_API_KEY } from "./constants";
import { geminiRequest, parseJsonArray } from "./geminiClient";
import type { EventCategory } from "@/types";

export interface ExtractedEvent {
  title: string;
  description: string;
  date: string;
  time_start: string;
  time_end: string | null;
  venue_name: string;
  venue_address: string;
  city: string;
  category: EventCategory;
  price_info: string;
  confidence: number;
}

const EXTRACTION_PROMPT = `Du bist ein Event-Daten-Extraktor. Analysiere den gegebenen Inhalt und extrahiere Event-Informationen daraus.

WICHTIG: Erfinde KEINE Daten. Nur was tatsächlich im Inhalt steht.

Gib ein JSON-Array zurück. Jedes Event hat folgende Felder:
- title (string): Name des Events
- description (string): Kurze Beschreibung, max 300 Zeichen
- date (string): Datum im Format YYYY-MM-DD
- time_start (string): Startzeit im Format HH:MM
- time_end (string | null): Endzeit im Format HH:MM oder null
- venue_name (string): Name der Location
- venue_address (string): Adresse
- city (string): Stadt
- category (string): Eine von: nightlife, food_drink, concert, festival, sports, art, family, other
- price_info (string): Preisinformation (z.B. "10€", "Kostenlos", "Ab 15€")
- confidence (number): Wie sicher du dir bist, 0.0 bis 1.0

Wenn keine Events gefunden werden, gib ein leeres Array zurück: []`;

export async function extractEventsFromUrl(url: string): Promise<ExtractedEvent[]> {
  if (!GEMINI_API_KEY) {
    throw new Error("Gemini API Key nicht konfiguriert. Bitte EXPO_GEMINI_API_KEY in .env setzen.");
  }

  const { text } = await geminiRequest({
    apiKey: GEMINI_API_KEY,
    contents: [
      {
        parts: [
          { text: EXTRACTION_PROMPT },
          { text: `URL: ${url}` },
        ],
      },
    ],
    tools: [{ google_search: {} }],
    temperature: 0.1,
    maxOutputTokens: 4096,
  });

  const parsed = parseJsonArray<ExtractedEvent>(text);
  return parsed.filter(
    (e) => e.title && e.date && e.time_start && e.venue_name
  );
}

export async function extractEventsFromText(text: string, sourceUrl?: string): Promise<ExtractedEvent[]> {
  if (!GEMINI_API_KEY) {
    throw new Error("Gemini API Key nicht konfiguriert.");
  }

  const { text: responseText } = await geminiRequest({
    apiKey: GEMINI_API_KEY,
    contents: [
      {
        parts: [
          { text: EXTRACTION_PROMPT },
          { text: `${sourceUrl ? `Quelle: ${sourceUrl}\n\n` : ""}Inhalt:\n${text.substring(0, 15000)}` },
        ],
      },
    ],
    tools: [{ google_search: {} }],
    temperature: 0.1,
    maxOutputTokens: 4096,
  });

  const parsed = parseJsonArray<ExtractedEvent>(responseText);
  return parsed.filter(
    (e) => e.title && e.date && e.time_start && e.venue_name
  );
}
