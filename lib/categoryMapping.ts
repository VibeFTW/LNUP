import type { EventCategory } from "@/types";

const TICKETMASTER_SEGMENT_MAP: Record<string, EventCategory> = {
  "Music": "concert",
  "Sports": "sports",
  "Arts & Theatre": "art",
  "Film": "art",
  "Miscellaneous": "other",
  "Undefined": "other",
};

const TICKETMASTER_GENRE_MAP: Record<string, EventCategory> = {
  "Club": "nightlife",
  "Dance/Electronic": "nightlife",
  "DJ": "nightlife",
  "Rock": "concert",
  "Pop": "concert",
  "Hip-Hop/Rap": "concert",
  "R&B": "concert",
  "Jazz": "concert",
  "Classical": "concert",
  "Metal": "concert",
  "Alternative": "concert",
  "Folk": "concert",
  "Country": "concert",
  "Latin": "concert",
  "Reggae": "concert",
  "Blues": "concert",
  "World": "concert",
  "Comedy": "art",
  "Theatre": "art",
  "Opera": "art",
  "Dance": "art",
  "Circus & Specialty Acts": "family",
  "Fairs & Festivals": "festival",
  "Festival": "festival",
  "Food & Drink": "food_drink",
  "Family": "family",
  "Soccer": "sports",
  "Football": "sports",
  "Basketball": "sports",
  "Ice Hockey": "sports",
  "Tennis": "sports",
  "Boxing": "sports",
  "Motorsports/Racing": "sports",
};

export function mapTicketmasterSegment(
  segmentName: string | null | undefined,
  genreName: string | null | undefined
): EventCategory {
  if (genreName && TICKETMASTER_GENRE_MAP[genreName]) {
    return TICKETMASTER_GENRE_MAP[genreName];
  }
  if (segmentName && TICKETMASTER_SEGMENT_MAP[segmentName]) {
    return TICKETMASTER_SEGMENT_MAP[segmentName];
  }
  return "other";
}
