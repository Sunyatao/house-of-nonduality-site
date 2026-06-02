export type Lang = "nl" | "en";
export type EventKind = "open-table" | "words-from-silence";

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

const TIME_ZONE = "Europe/Brussels" as const;

const pad = (value: number) => String(value).padStart(2, "0");

const toDateString = (year: number, month: number, day: number) => {
  return `${year}-${pad(month)}-${pad(day)}`;
};

const nthWeekdayOfMonth = (
  year: number,
  month: number,
  weekday: number,
  nth: number,
) => {
  // weekday: Sunday = 0, Monday = 1, Tuesday = 2, ...
  const firstDay = new Date(Date.UTC(year, month - 1, 1)).getUTCDay();
  const offset = (weekday - firstDay + 7) % 7;
  const day = 1 + offset + (nth - 1) * 7;

  return toDateString(year, month, day);
};

const firstSundayOfMonth = (year: number, month: number) => {
  return nthWeekdayOfMonth(year, month, 0, 1);
};

const thirdTuesdayOfMonth = (year: number, month: number) => {
  return nthWeekdayOfMonth(year, month, 2, 3);
};

const createOpenTableEvent = (date: string): CalendarEvent => ({
  slug: `open-table-${date}`,
  kind: "open-table",
  date,
  startTime: "12:00",
  endTime: "16:00",
  timeZone: TIME_ZONE,
  title: {
    nl: "Open Tafel",
    en: "Open Table",
  },
  location: {
    nl: "Leuven — adres na inschrijving",
    en: "Leuven — address after registration",
  },
  description: {
    nl: "Een eenvoudige ontmoeting rond plantaardig eten, stilte, gesprek en samen-zijn.",
    en: "A simple gathering around plant-based food, silence, conversation and presence.",
  },
  pagePath: {
    nl: "/nl/open-tafel/",
    en: "/en/open-table/",
  },
});

const createWordsFromSilenceEvent = (date: string): CalendarEvent => ({
  slug: `words-from-silence-${date}`,
  kind: "words-from-silence",
  date,
  startTime: "19:30",
  endTime: "21:00",
  timeZone: TIME_ZONE,
  title: {
    nl: "Woorden uit de Stilte",
    en: "Words from Silence",
  },
  location: {
    nl: "Leuven — adres na inschrijving",
    en: "Leuven — address after registration",
  },
  description: {
    nl: "Een rustige avond met poëzie, korte teksten, stilte en reflectie rond mystiek, contemplatie en nondualiteit.",
    en: "A quiet evening with poetry, short texts, silence and reflection around mysticism, contemplation and nonduality.",
  },
  pagePath: {
    nl: "/nl/woorden-uit-de-stilte/",
    en: "/en/words-from-silence/",
  },
});

const currentYear = new Date().getFullYear();
const yearsToGenerate = [currentYear, currentYear + 1];
const months = Array.from({ length: 12 }, (_, index) => index + 1);

const today = new Date().toISOString().slice(0, 10);

export const allEvents: CalendarEvent[] = yearsToGenerate
  .flatMap((year) =>
    months.flatMap((month) => [
      createOpenTableEvent(firstSundayOfMonth(year, month)),
      createWordsFromSilenceEvent(thirdTuesdayOfMonth(year, month)),
    ]),
  )
  .filter((event) => event.date >= today)
  .sort((a, b) => {
    const aDate = `${a.date}T${a.startTime}`;
    const bDate = `${b.date}T${b.startTime}`;

    return aDate.localeCompare(bDate);
  });

export const openTableEvents = allEvents.filter(
  (event) => event.kind === "open-table",
);

export const wordsFromSilenceEvents = allEvents.filter(
  (event) => event.kind === "words-from-silence",
);

export const visibleOpenTableEvents = openTableEvents.slice(0, 8);

export const visibleWordsFromSilenceEvents = wordsFromSilenceEvents.slice(0, 8);