import { describe, expect, it } from 'vitest';
import { buildIcs, eventRange, googleCalendarUrl, icsEscape } from './calendar';

const event = {
	id: 42,
	title: 'Assemblée, populaire; ouverte',
	date: '2026-03-28',
	time: '23:30',
	duration: '1.5',
	location: 'Bourse du travail\nSaint-Étienne',
	description: 'Venez nombreux'
};

describe('calendrier', () => {
	it('calcule la fin en passant au jour suivant si besoin', () => {
		expect(eventRange(event)).toEqual({ start: '20260328T233000', end: '20260329T010000' });
	});

	it('échappe les caractères spéciaux ICS', () => {
		expect(icsEscape('a,b;c\\d\ne')).toBe(String.raw`a\,b\;c\\d\ne`);
	});

	it('produit un fichier ICS valide', () => {
		const ics = buildIcs(event, new Date('2026-01-01T00:00:00Z'));
		expect(ics).toContain('DTSTART;TZID=Europe/Paris:20260328T233000');
		expect(ics).toContain(String.raw`SUMMARY:Assemblée\, populaire\; ouverte`);
		expect(ics).toContain('LOCATION:Bourse du travail\\nSaint-Étienne');
		expect(ics).toContain('DTSTAMP:20260101T000000Z');
		expect(ics.split('\r\n')[0]).toBe('BEGIN:VCALENDAR');
	});

	it('indique le fuseau de Paris à Google Agenda', () => {
		const url = new URL(googleCalendarUrl(event));
		expect(url.searchParams.get('ctz')).toBe('Europe/Paris');
		expect(url.searchParams.get('dates')).toBe('20260328T233000/20260329T010000');
	});
});
