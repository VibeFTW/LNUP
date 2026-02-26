import { GEMINI_API_KEY } from "./constants";
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

const GEMINI_URL = "https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent";

const EXTRACTION_PROMPT = `Du bist ein Event-Daten-Extraktor. Rufe die folgende URL auf und extrahiere Event-Informationen daraus.

WICHTIG: Erfinde KEINE Daten. Nur was tatsächlich auf der Seite steht.

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

Wenn keine Events gefunden werden, gib ein leeres Array zurück: []
Antworte NUR mit dem JSON-Array, kein anderer Text.`;

export async function extractEventsFromUrl(url: string): Promise<ExtractedEvent[]> {
  if (!GEMINI_API_KEY) {
    throw new Error("Gemini API Key nicht konfiguriert. Bitte EXPO_GEMINI_API_KEY in .env setzen.");
  }

  const geminiResponse = await fetch(`${GEMINI_URL}?key=${GEMINI_API_KEY}`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      contents: [
        {
          parts: [
            { text: EXTRACTION_PROMPT },
            { text: `URL: ${url}` },
          ],
        },
      ],
      tools: [{ google_search: {} }],
      generationConfig: {
        temperature: 0.1,
        maxOutputTokens: 4096,
      },
    }),
  });

  if (!geminiResponse.ok) {
    const errorText = await geminiResponse.text();
    throw new Error(`Gemini API Fehler: ${geminiResponse.status} - ${errorText.substring(0, 200)}`);
  }

  const result = await geminiResponse.json();
  const text = result?.candidates?.[0]?.content?.parts?.[0]?.text ?? "";

  const jsonMatch = text.match(/\[[\s\S]*\]/);
  if (!jsonMatch) return [];

  try {
    const parsed = JSON.parse(jsonMatch[0]) as ExtractedEvent[];
    return parsed.filter(
      (e) => e.title && e.date && e.time_start && e.venue_name
    );
  } catch {
    throw new Error("KI-Antwort konnte nicht als JSON geparst werden.");
  }
}

export async function extractEventsFromText(text: string, sourceUrl?: string): Promise<ExtractedEvent[]> {
  if (!GEMINI_API_KEY) {
    throw new Error("Gemini API Key nicht konfiguriert.");
  }

  const geminiResponse = await fetch(`${GEMINI_URL}?key=${GEMINI_API_KEY}`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      contents: [
        {
          parts: [
            { text: EXTRACTION_PROMPT },
            { text: `${sourceUrl ? `Quelle: ${sourceUrl}\n\n` : ""}Inhalt:\n${text.substring(0, 15000)}` },
          ],
        },
      ],
      tools: [{ google_search: {} }],
      generationConfig: {
        temperature: 0.1,
        maxOutputTokens: 4096,
      },
    }),
  });

  if (!geminiResponse.ok) {
    throw new Error(`Gemini API Fehler: ${geminiResponse.status}`);
  }

  const result = await geminiResponse.json();
  const responseText = result?.candidates?.[0]?.content?.parts?.[0]?.text ?? "";

  const jsonMatch = responseText.match(/\[[\s\S]*\]/);
  if (!jsonMatch) return [];

  try {
    const parsed = JSON.parse(jsonMatch[0]) as ExtractedEvent[];
    return parsed.filter(
      (e) => e.title && e.date && e.time_start && e.venue_name
    );
  } catch {
    throw new Error("KI-Antwort konnte nicht als JSON geparst werden.");
  }
}
