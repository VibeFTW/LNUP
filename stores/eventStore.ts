import { create } from "zustand";
import type { Event } from "@/types";
import { MOCK_EVENTS } from "@/lib/mockData";
import { fetchExternalEvents } from "@/lib/eventApis";
import { EVENTBRITE_API_KEY, TICKETMASTER_API_KEY } from "@/lib/constants";

interface EventState {
  events: Event[];
  savedEventIds: Set<string>;
  goingEventIds: Set<string>;
  isLoading: boolean;
  fetchEvents: (city?: string) => Promise<void>;
  toggleSave: (eventId: string) => void;
  toggleGoing: (eventId: string) => void;
  confirmAttended: (eventId: string) => void;
  mergeExternalEvents: (externalEvents: Event[]) => void;
  getEventById: (id: string) => Event | undefined;
  getSavedEvents: () => Event[];
  getEventsByCreator: (userId: string) => Event[];
}

export const useEventStore = create<EventState>((set, get) => ({
  events: MOCK_EVENTS,
  savedEventIds: new Set(["e2"]),
  goingEventIds: new Set(["e2"]),
  isLoading: false,

  fetchEvents: async (city?: string) => {
    set({ isLoading: true });

    // TODO: Replace with Supabase query
    await new Promise((r) => setTimeout(r, 300));

    const hasApiKeys = EVENTBRITE_API_KEY || TICKETMASTER_API_KEY;
    if (hasApiKeys && city) {
      try {
        const externalEvents = await fetchExternalEvents(city);
        get().mergeExternalEvents(externalEvents);
      } catch (error) {
        console.warn("External event fetch failed:", error);
      }
    }

    set({ isLoading: false });
  },

  toggleSave: (eventId) => {
    set((state) => {
      const next = new Set(state.savedEventIds);
      if (next.has(eventId)) {
        next.delete(eventId);
      } else {
        next.add(eventId);
      }
      return {
        savedEventIds: next,
        events: state.events.map((e) =>
          e.id === eventId
            ? {
                ...e,
                is_saved: next.has(eventId),
                saves_count: e.saves_count + (next.has(eventId) ? 1 : -1),
              }
            : e
        ),
      };
    });
  },

  toggleGoing: (eventId) => {
    set((state) => {
      const next = new Set(state.goingEventIds);
      if (next.has(eventId)) {
        next.delete(eventId);
      } else {
        next.add(eventId);
      }
      return {
        goingEventIds: next,
        events: state.events.map((e) =>
          e.id === eventId
            ? {
                ...e,
                is_going: next.has(eventId),
                going_count: e.going_count + (next.has(eventId) ? 1 : -1),
              }
            : e
        ),
      };
    });
  },

  confirmAttended: (eventId) => {
    set((state) => ({
      events: state.events.map((e) =>
        e.id === eventId
          ? { ...e, confirmations_count: e.confirmations_count + 1 }
          : e
      ),
    }));
  },

  mergeExternalEvents: (externalEvents) => {
    set((state) => {
      const existingIds = new Set(state.events.map((e) => e.id));
      const newEvents = externalEvents.filter((e) => !existingIds.has(e.id));
      if (newEvents.length === 0) return state;
      return { events: [...state.events, ...newEvents] };
    });
  },

  getEventById: (id) => get().events.find((e) => e.id === id),

  getSavedEvents: () => {
    const { events, savedEventIds } = get();
    return events.filter((e) => savedEventIds.has(e.id));
  },

  getEventsByCreator: (userId) => {
    return get().events.filter((e) => e.created_by === userId);
  },
}));
