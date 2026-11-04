export type CalendarEvent = {
	id: number;
	title: string;
	date: string;
	time: string;
	duration: string;
	location: string;
	description: string;
};

const pad = (n: number) => String(n).padStart(2, '0');

/** Début et fin en heure locale "flottante" (AAAAMMJJTHHMMSS), sans conversion de fuseau. */
export const eventRange = (event: CalendarEvent) => {
	const [y, m, d] = event.date.split('-').map(Number);
	const [hh, mm] = event.time.split(':').map(Number);
	const hours = Number(String(event.duration).replace(',', '.')) || 1;
	// Date.UTC sert uniquement de calculatrice pour ajouter la durée sans effet de fuseau.
	const start = new Date(Date.UTC(y, m - 1, d, hh, mm));
	const end = new Date(start.getTime() + hours * 3_600_000);
	const fmt = (dt: Date) =>
		`${dt.getUTCFullYear()}${pad(dt.getUTCMonth() + 1)}${pad(dt.getUTCDate())}T${pad(dt.getUTCHours())}${pad(dt.getUTCMinutes())}00`;
	return { start: fmt(start), end: fmt(end) };
};

export const googleCalendarUrl = (event: CalendarEvent) => {
	const { start, end } = eventRange(event);
	const params = new URLSearchParams({
		action: 'TEMPLATE',
		text: event.title,
		dates: `${start}/${end}`,
		ctz: 'Europe/Paris',
		details: event.description,
		location: event.location
	});
	return `https://calendar.google.com/calendar/render?${params}`;
};

export const outlookCalendarUrl = (event: CalendarEvent) => {
	const { start, end } = eventRange(event);
	const iso = (v: string) =>
		`${v.slice(0, 4)}-${v.slice(4, 6)}-${v.slice(6, 8)}T${v.slice(9, 11)}:${v.slice(11, 13)}:00`;
	const params = new URLSearchParams({
		path: '/calendar/action/compose',
		rru: 'addevent',
		subject: event.title,
		startdt: iso(start),
		enddt: iso(end),
		body: event.description,
		location: event.location
	});
	return `https://outlook.live.com/calendar/0/deeplink/compose?${params}`;
};

/** Échappement imposé par la RFC 5545 pour les champs texte. */
export const icsEscape = (value: string) =>
	value
		.replace(/\\/g, '\\\\')
		.replace(/;/g, String.raw`\;`)
		.replace(/,/g, '\\,')
		.replace(/\r?\n/g, '\\n');

export const buildIcs = (event: CalendarEvent, now = new Date()) => {
	const { start, end } = eventRange(event);
	const stamp = now.toISOString().replace(/[-:]/g, '').split('.')[0] + 'Z';
	return [
		'BEGIN:VCALENDAR',
		'VERSION:2.0',
		'PRODID:-//Sainte Populaire//Calendrier//FR',
		'CALSCALE:GREGORIAN',
		'BEGIN:VEVENT',
		`UID:${event.id}@saintepopulaire.fr`,
		`DTSTAMP:${stamp}`,
		`DTSTART;TZID=Europe/Paris:${start}`,
		`DTEND;TZID=Europe/Paris:${end}`,
		`SUMMARY:${icsEscape(event.title)}`,
		`DESCRIPTION:${icsEscape(event.description)}`,
		`LOCATION:${icsEscape(event.location)}`,
		'END:VEVENT',
		'END:VCALENDAR'
	].join('\r\n');
};
