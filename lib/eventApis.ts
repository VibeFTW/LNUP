import type { Event } from "@/types";
import { fetchEventbriteEvents } from "./eventbrite";
import { fetchTicketmasterEvents } from "./ticketmaster";
import { EVENTBRITE_API_KEY, TICKETMASTER_API_KEY } from "./constants";

function normalizeForComparison(str: string): string {
  return str
    .toLowerCase()
    .replace(/[^a-z0-9äöüß]/g, "")
    .trim();
}

function areSimilarEvents(a: Event, b: Event): boolean {
  if (a.event_date !== b.event_date) return false;

  const titleA = normalizeForComparison(a.title);
  const titleB = normalizeForComparison(b.title);

  if (titleA === titleB) return true;
  if (titleA.includes(titleB) || titleB.includes(titleA)) return true;

  const venueA = normalizeForComparison(a.venue?.name ?? "");
  const venueB = normalizeForComparison(b.venue?.name ?? "");
  if (venueA && venueB && venueA === venueB && titleA.substring(0, 10) === titleB.substring(0, 10)) {
    return true;
  }

  return false;
}

function deduplicateEvents(events: Event[]): Event[] {
  const result: Event[] = [];

  for (const event of events) {
    const isDuplicate = result.some((existing) => areSimilarEvents(existing, event));
    if (!isDuplicate) {
      result.push(event);
    }
  }

  return result;
}

export async function fetchExternalEvents(city: string): Promise<Event[]> {
  const [eventbriteEvents, ticketmasterEvents] = await Promise.allSettled([
    fetchEventbriteEvents(city, EVENTBRITE_API_KEY),
    fetchTicketmasterEvents(city, TICKETMASTER_API_KEY),
  ]);

  const allEvents: Event[] = [
    ...(eventbriteEvents.status === "fulfilled" ? eventbriteEvents.value : []),
    ...(ticketmasterEvents.status === "fulfilled" ? ticketmasterEvents.value : []),
  ];

  const deduplicated = deduplicateEvents(allEvents);

  return deduplicated.sort(
    (a, b) => new Date(a.event_date).getTime() - new Date(b.event_date).getTime()
  );
}
