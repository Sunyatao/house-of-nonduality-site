import type { CalendarEvent, Lang } from "../data/events";

const SITE_URL = "https://houseofnonduality.com";

const toCalendarDateTime = (date: string, time: string) => {
  // "2026-06-07" + "12:00" → "20260607T120000"
  return `${date.replaceAll("-", "")}T${time.replace(":", "")}00`;
};

const escapeIcsText = (value: string) => {
  return value
    .replaceAll("\\", "\\\\")
    .replaceAll(";", "\\;")
    .replaceAll(",", "\\,")
    .replaceAll("\n", "\\n");
};

const getEventUrl = (event: CalendarEvent, lang: Lang) => {
  return `${SITE_URL}${event.pagePath[lang]}`;
};

export const createGoogleCalendarUrl = (
  event: CalendarEvent,
  lang: Lang,
) => {
  const start = toCalendarDateTime(event.date, event.startTime);
  const end = toCalendarDateTime(event.date, event.endTime);
  const url = getEventUrl(event, lang);

  const details = `${event.description[lang]}\n\nMore info: ${url}`;

  const params = new URLSearchParams({
    action: "TEMPLATE",
    text: event.title[lang],
    dates: `${start}/${end}`,
    ctz: event.timeZone,
    details,
    location: event.location[lang],
  });

  return `https://calendar.google.com/calendar/render?${params.toString()}`;
};

export const createIcsContent = (
  event: CalendarEvent,
  lang: Lang,
) => {
  const start = toCalendarDateTime(event.date, event.startTime);
  const end = toCalendarDateTime(event.date, event.endTime);
  const url = getEventUrl(event, lang);
  const now = new Date().toISOString().replace(/[-:]/g, "").split(".")[0] + "Z";

  return [
    "BEGIN:VCALENDAR",
    "VERSION:2.0",
    "PRODID:-//House of Nonduality//Events//EN",
    "CALSCALE:GREGORIAN",
    "METHOD:PUBLISH",
    "BEGIN:VEVENT",
    `UID:${event.slug}@houseofnonduality.com`,
    `DTSTAMP:${now}`,
    `DTSTART;TZID=${event.timeZone}:${start}`,
    `DTEND;TZID=${event.timeZone}:${end}`,
    `SUMMARY:${escapeIcsText(event.title[lang])}`,
    `DESCRIPTION:${escapeIcsText(`${event.description[lang]}\n\nMore info: ${url}`)}`,
    `LOCATION:${escapeIcsText(event.location[lang])}`,
    `URL:${url}`,
    "END:VEVENT",
    "END:VCALENDAR",
  ].join("\r\n");
};

export const createIcsDataUri = (
  event: CalendarEvent,
  lang: Lang,
) => {
  const content = createIcsContent(event, lang);

  return `data:text/calendar;charset=utf-8,${encodeURIComponent(content)}`;
};

export const createIcsFilename = (
  event: CalendarEvent,
  lang: Lang,
) => {
  const title = event.title[lang]
    .toLowerCase()
    .replaceAll(" ", "-")
    .replaceAll("'", "")
    .replaceAll("’", "")
    .replaceAll("/", "-");

  return `${title}-${event.date}.ics`;
};