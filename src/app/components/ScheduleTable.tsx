import { useEffect, useMemo, useState } from "react";

interface ScheduleItem {
  day: string;
  date: string;
  start: string;
  end: string;
}

type GoogleCalEvent = {
  id?: string;
  start?: { dateTime?: string; date?: string };
  end?: { dateTime?: string; date?: string };
};

function getEnv(name: "VITE_GOOGLE_CALENDAR_ID" | "VITE_GOOGLE_API_KEY") {
  const v = import.meta.env[name] as string | undefined;
  return v && v.trim().length ? v.trim() : undefined;
}

function toDate(d: { dateTime?: string; date?: string } | undefined) {
  if (!d) return null;
  // timed event
  if (d.dateTime) return new Date(d.dateTime);
  // all-day event -> treat as local midnight
  if (d.date) return new Date(`${d.date}T00:00:00`);
  return null;
}

function formatDay(dt: Date) {
  return new Intl.DateTimeFormat(undefined, { weekday: "short" }).format(dt);
}

function formatDate(dt: Date) {
  return new Intl.DateTimeFormat(undefined, {
    month: "short",
    day: "numeric",
    year: "numeric",
  }).format(dt);
}

function formatTime(dt: Date) {
  return new Intl.DateTimeFormat(undefined, {
    hour: "numeric",
    minute: "2-digit",
  }).format(dt);
}

async function fetchCalendarScheduleItems(
  calendarId: string,
  apiKey: string
): Promise<ScheduleItem[]> {
  const timeMin = new Date().toISOString();

  const url =
    `https://www.googleapis.com/calendar/v3/calendars/` +
    `${encodeURIComponent(calendarId)}` +
    `/events?` +
    new URLSearchParams({
      key: apiKey,
      timeMin,
      singleEvents: "true",
      orderBy: "startTime",
      maxResults: "50",
    }).toString();

  const res = await fetch(url);
  if (!res.ok) {
    const body = await res.text().catch(() => "");
    throw new Error(`Google Calendar API error (${res.status}): ${body}`);
  }

  const data = (await res.json()) as { items?: GoogleCalEvent[] };
  const items = data.items ?? [];

  const mapped: ScheduleItem[] = items
    .map((ev) => {
      const startDt = toDate(ev.start);
      const endDt = toDate(ev.end);
      if (!startDt || !endDt) return null;

      return {
        day: formatDay(startDt),
        date: formatDate(startDt),
        start: formatTime(startDt),
        end: formatTime(endDt),
      };
    })
    .filter((x): x is ScheduleItem => Boolean(x));

  return mapped;
}

export function ScheduleTable() {
  const [scheduleData, setScheduleData] = useState<ScheduleItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const calendarId = useMemo(() => getEnv("VITE_GOOGLE_CALENDAR_ID"), []);
  const apiKey = useMemo(() => getEnv("VITE_GOOGLE_API_KEY"), []);

  useEffect(() => {
    let cancelled = false;

    const loadEvents = async () => {
      try {
        setLoading(true);

        if (!calendarId || !apiKey) {
          throw new Error(
            "Missing VITE_GOOGLE_CALENDAR_ID or VITE_GOOGLE_API_KEY in .env"
          );
        }

        const events = await fetchCalendarScheduleItems(calendarId, apiKey);

        if (!cancelled) {
          setScheduleData(events);
          setError(null);
        }
      } catch (err) {
        console.error("Failed to load calendar events:", err);

        if (!cancelled) {
          setScheduleData([]);
          setError(
            "Schedule couldn’t load. Check your .env values (Calendar ID + API Key), make sure the Calendar API is enabled, then restart the dev server."
          );
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    };

    loadEvents();

    return () => {
      cancelled = true;
    };
  }, [calendarId, apiKey]);

  if (loading) {
    return (
      <div className="flex items-center justify-center py-8">
        <div className="text-gray-300">Loading schedule...</div>
      </div>
    );
  }

  return (
    <div>
      {error && (
        <div className="mb-4 rounded-md border border-red-500/40 bg-red-500/10 px-4 py-3 text-sm text-red-100">
          {error}
          {!calendarId || !apiKey ? (
            <div className="mt-2 opacity-90">
              Expected in <code className="font-mono">.env</code>:
              <div className="mt-1 font-mono text-xs">
                VITE_GOOGLE_CALENDAR_ID=...
                <br />
                VITE_GOOGLE_API_KEY=...
              </div>
            </div>
          ) : null}
        </div>
      )}

      <div className="overflow-x-auto">
        <table className="w-full border-collapse">
          <thead>
            <tr className="bg-gray-700">
              <th className="text-left p-2 sm:p-3 text-xs sm:text-sm text-gray-200 border-b border-gray-600">
                Day
              </th>
              <th className="text-left p-2 sm:p-3 text-xs sm:text-sm text-gray-200 border-b border-gray-600">
                Date
              </th>
              <th className="text-left p-2 sm:p-3 text-xs sm:text-sm text-gray-200 border-b border-gray-600">
                Start
              </th>
              <th className="text-left p-2 sm:p-3 text-xs sm:text-sm text-gray-200 border-b border-gray-600">
                End
              </th>
            </tr>
          </thead>

          <tbody>
            {scheduleData.length > 0 ? (
              scheduleData.map((item, index) => (
                <tr
                  key={index}
                  className="border-b border-gray-700 hover:bg-gray-700"
                >
                  <td className="p-2 sm:p-3 text-xs sm:text-sm text-white">
                    {item.day}
                  </td>
                  <td className="p-2 sm:p-3 text-xs sm:text-sm text-gray-300">
                    {item.date}
                  </td>
                  <td className="p-2 sm:p-3 text-xs sm:text-sm text-gray-300">
                    {item.start}
                  </td>
                  <td className="p-2 sm:p-3 text-xs sm:text-sm text-gray-300">
                    {item.end}
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={4} className="p-4 text-center text-gray-400">
                  No events scheduled
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
