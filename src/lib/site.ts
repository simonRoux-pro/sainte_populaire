/** Informations générales du site, modifiables à un seul endroit. */
export const SITE = {
	name: 'Sainte Populaire',
	/** Domaine principal. Sert aux liens canoniques, au sitemap et aux aperçus de partage. */
	url: 'https://saintepopulaire.fr',
	email: 'contact@saintepopulaire.fr',
	description:
		'Sainte Populaire, mouvement citoyen à Saint-Étienne pour la justice sociale, la solidarité et la démocratie locale.',
	supportFormUrl:
		'https://framaforms.org/comite-de-soutien-de-sainte-populaire-municipales-2026-a-saint-etienne-1746463242',
	social: {
		instagram: 'https://www.instagram.com/saintetiennepopulaire42/',
		facebook: 'https://www.facebook.com/p/Saint%C3%A9-Populaire-61563283078508/',
		x: 'https://x.com/saintepopulaire'
	}
} as const;

/** Pages publiques listées dans le sitemap. */
export const PUBLIC_PAGES = [
	'/actualites',
	'/calendrier',
	'/rejoindre',
	'/contact',
	'/sainte-pop',
	'/sainte-pop/poles/communication',
	'/sainte-pop/poles/coordination',
	'/sainte-pop/poles/garanties',
	'/sainte-pop/poles/action-vie-militante',
	'/programme/grandes-thematiques',
	'/mentions-legales'
] as const;
