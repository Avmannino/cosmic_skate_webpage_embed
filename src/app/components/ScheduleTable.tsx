import { useEffect, useState } from "react";
import { fetchCalendarEvents, type CalendarEvent } from "@/services/googleCalendar";

interface ScheduleItem {
  day: string;
  date: string;
  start: string;
  end: string;
}

export function ScheduleTable() {
  const [scheduleData, setScheduleData] = useState<ScheduleItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;

    const loadEvents = async () => {
      try {
        setLoading(true);

        // ✅ Cosmic-only
        const events: CalendarEvent[] = await fetchCalendarEvents("cosmicSkate");

        const mapped: ScheduleItem[] = events.map((ev) => ({
          day: ev.day,
          date: ev.date,
          start: ev.start,
          end: ev.end,
        }));

        if (!cancelled) {
          setScheduleData(mapped);
          setError(null);
        }
      } catch (err) {
        console.error("Failed to load calendar events:", err);

        if (!cancelled) {
          setScheduleData([]);
          setError("Failed to load schedule.");
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    };

    loadEvents();

    return () => {
      cancelled = true;
    };
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center py-8">
        <div className="text-gray-300">Loading schedule...</div>
      </div>
    );
  }

  return (
    <div>
      {error ? (
        <div className="mb-4 rounded-md border border-red-500/30 bg-red-500/10 px-4 py-3 text-sm text-red-200">
          {error}
        </div>
      ) : null}

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
