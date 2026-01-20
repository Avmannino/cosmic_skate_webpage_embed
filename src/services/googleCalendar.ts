// src/services/googleCalendar.ts

const CALENDAR_ID = import.meta.env.VITE_GOOGLE_CALENDAR_ID as string | undefined;

// ✅ Support BOTH env var names (yours + the older one)
const API_KEY =
  (import.meta.env.VITE_GOOGLE_API_KEY as string | undefined) ||
  (import.meta.env.VITE_GOOGLE_CALENDAR_API_KEY as string | undefined);

const TZ = "America/New_York";

export type CalendarFilter = "all" | "publicSkate" | "cosmicSkate";

export interface CalendarEvent {
  day: string;
  date: string;
  start: string;
  end: string;
  summary?: string;
}

type GoogleCalendarItem = {
  status?: string;
  summary?: string;
  start?: { dateTime?: string; date?: string; timeZone?: string };
  end?: { dateTime?: string; date?: string; timeZone?: string };
};

function isAllDay(item: GoogleCalendarItem): boolean {
  return !!item.start?.date && !item.start?.dateTime;
}

/**
 * If Google gives a date-only string (YYYY-MM-DD), creating Date(date) can shift the day
 * depending on timezone. To stabilize weekday/date display, interpret date-only as midday.
 */
function normalizeForDisplay(dateString: string): string {
  const isDateOnly = /^\d{4}-\d{2}-\d{2}$/.test(dateString);
  return isDateOnly ? `${dateString}T12:00:00` : dateString;
}

function formatTime(dateString: string): string {
  const date = new Date(dateString);
  return date.toLocaleTimeString("en-US", {
    hour: "numeric",
    minute: "2-digit",
    hour12: true,
    timeZone: TZ,
  });
}

function formatDate(dateString: string): string {
  const date = new Date(dateString);
  return date.toLocaleDateString("en-US", {
    month: "short",
    day: "2-digit",
    year: "numeric",
    timeZone: TZ,
  });
}

function getDayOfWeek(dateString: string): string {
  const date = new Date(dateString);
  return date.toLocaleDateString("en-US", {
    weekday: "short",
    timeZone: TZ,
  });
}

function matchesPublicSkate(summary?: string) {
  const t = (summary ?? "").toLowerCase();
  return t.includes("public") && t.includes("skate");
}

function matchesCosmicSkate(summary?: string) {
  const t = (summary ?? "").toLowerCase();
  return t.includes("cosmic") && t.includes("skate");
}

function passesFilter(item: GoogleCalendarItem, filter: CalendarFilter) {
  if (filter === "all") return true;

  const s = item.summary ?? "";

  if (filter === "publicSkate") return matchesPublicSkate(s);
  if (filter === "cosmicSkate") return matchesCosmicSkate(s);

  return true;
}

export async function fetchCalendarEvents(
  filter: CalendarFilter = "all"
): Promise<CalendarEvent[]> {
  if (!CALENDAR_ID || !API_KEY) {
    console.error(
      "[Calendar] Missing env vars. Set VITE_GOOGLE_CALENDAR_ID and VITE_GOOGLE_API_KEY."
    );
    return [];
  }

  try {
    const now = new Date();
    const rangeEnd = new Date(now);
    rangeEnd.setDate(now.getDate() + 60);

    const timeMin = now.toISOString();
    const timeMax = rangeEnd.toISOString();

    const params = new URLSearchParams({
      key: API_KEY,
      timeMin,
      timeMax,
      singleEvents: "true",
      orderBy: "startTime",
      maxResults: "250",
      timeZone: TZ,
      fields: "items(status,summary,start(dateTime,date),end(dateTime,date))",
    });

    const url = `https://www.googleapis.com/calendar/v3/calendars/${encodeURIComponent(
      CALENDAR_ID
    )}/events?${params.toString()}`;

    const response = await fetch(url, { method: "GET" });

    if (!response.ok) {
      const text = await response.text();
      let message = text;

      try {
        const json = JSON.parse(text);
        message = json?.error?.message || text;
      } catch {
        // ignore
      }

      console.error(
        "[Calendar] Google Calendar API failed:",
        response.status,
        response.statusText
      );
      console.error("[Calendar] Error message:", message);
      return [];
    }

    const data: { items?: GoogleCalendarItem[] } = await response.json();
    const items = Array.isArray(data.items) ? data.items : [];
    if (items.length === 0) return [];

    return items
      .filter((item) => item.status !== "cancelled")
      .filter((item) => passesFilter(item, filter))
      .map((item) => {
        const allDay = isAllDay(item);

        const rawStart = item.start?.dateTime || item.start?.date;
        const rawEnd = item.end?.dateTime || item.end?.date;
        if (!rawStart || !rawEnd) return null;

        const startForDisplay = normalizeForDisplay(rawStart);
        const endForDisplay = normalizeForDisplay(rawEnd);

        return {
          day: getDayOfWeek(startForDisplay),
          date: formatDate(startForDisplay),
          start: allDay ? "All Day" : formatTime(startForDisplay),
          end: allDay ? "" : formatTime(endForDisplay),
          summary: item.summary,
        } as CalendarEvent;
      })
      .filter(Boolean) as CalendarEvent[];
  } catch (error) {
    console.error("[Calendar] Error fetching calendar events:", error);
    return [];
  }
}
