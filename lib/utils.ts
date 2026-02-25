import { format, isToday, isTomorrow, isThisWeek, isWeekend, parseISO } from "date-fns";
import { de } from "date-fns/locale";
import type { DateFilter, EventSourceType } from "@/types";

export function formatEventDate(dateStr: string): string {
  try {
    const date = parseISO(dateStr);
    if (isNaN(date.getTime())) return dateStr;
    if (isToday(date)) return "Heute";
    if (isTomorrow(date)) return "Morgen";
    return format(date, "EEE, d. MMM", { locale: de });
  } catch {
    return dateStr;
  }
}

export function formatTime(timeStr: string): string {
  if (!timeStr || timeStr.length < 5) return timeStr ?? "";
  return timeStr.substring(0, 5);
}

export function matchesDateFilter(dateStr: string, filter: DateFilter): boolean {
  if (filter === "alle") return true;
  try {
    const date = parseISO(dateStr);
    if (isNaN(date.getTime())) return true;
    switch (filter) {
      case "heute":
        return isToday(date);
      case "morgen":
        return isTomorrow(date);
      case "wochenende":
        return isWeekend(date) && isThisWeek(date);
      case "woche":
        return isThisWeek(date);
      default:
        return true;
    }
  } catch {
    return true;
  }
}

export function getSourceLabel(source: EventSourceType): string {
  const labels: Record<string, string> = {
    api_ticketmaster: "Ticketmaster",
    ai_discovered: "KI-erkannt",
    ai_scraped: "KI-erkannt",
    platform: "LNUP",
    verified_organizer: "Veranstalter",
    verified_user: "Verifiziert",
    community: "Community",
  };
  return labels[source] ?? source;
}

export function truncate(str: string, maxLength: number): string {
  if (!str || str.length <= maxLength) return str ?? "";
  return str.substring(0, maxLength - 3) + "...";
}
