export type Lang = "nl" | "en";
export type EventKind = "gathering" | "open-table" | "words-from-silence";

export interface CalendarEvent {
  slug: string;
  kind: EventKind;
  date: string; // YYYY-MM-DD
  startTime: string; // HH:mm
  endTime: string; // HH:mm
  timeZone: "Europe/Brussels";
  title: Record<Lang, string>;
  location: Record<Lang, string>;
  description: Record<Lang, string>;
  pagePath: Record<Lang, string>;
}

// Only explicitly confirmed gatherings belong here. The House no longer uses
// automatically generated monthly dates.
export const allEvents: CalendarEvent[] = [];

const todayInBrussels = new Intl.DateTimeFormat("en-CA", {
  timeZone: "Europe/Brussels",
  year: "numeric",
  month: "2-digit",
  day: "2-digit",
}).format(new Date());

export const upcomingEvents = allEvents
  .filter((event) => event.date >= todayInBrussels)
  .sort((a, b) => {
    const aDate = `${a.date}T${a.startTime}`;
    const bDate = `${b.date}T${b.startTime}`;

    return aDate.localeCompare(bDate);
  });

export const openTableEvents = upcomingEvents.filter(
  (event) => event.kind === "open-table",
);

export const wordsFromSilenceEvents = upcomingEvents.filter(
  (event) => event.kind === "words-from-silence",
);

export const visibleOpenTableEvents = openTableEvents.slice(0, 8);

export const visibleWordsFromSilenceEvents = wordsFromSilenceEvents.slice(0, 8);
