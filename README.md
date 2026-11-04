# Sainte Populaire

Site du mouvement Sainte Populaire (Saint-Étienne) : [saintepopulaire.fr](https://saintepopulaire.fr).

SvelteKit 2, Svelte 5, déployé sur Vercel. Les articles PDF et les événements sont stockés dans Vercel Blob.

## Lancer en local

```bash
npm install
cp .env.example .env   # puis remplir les valeurs
npm run dev
```

Les infos générales (domaine, email, réseaux sociaux, lien du comité de soutien) sont dans `src/lib/site.ts`.

Sans `BLOB_READ_WRITE_TOKEN`, le site s'affiche mais les listes sont vides et l'ajout de contenu renvoie une erreur 503.

## Variables d'environnement

| Variable                | Rôle                                                                         |
| ----------------------- | ---------------------------------------------------------------------------- |
| `ADMIN_USERNAME`        | Identifiant de l'espace militant (`admin` par défaut)                        |
| `ADMIN_PASSWORD`        | Mot de passe de l'espace militant (obligatoire)                              |
| `SESSION_SECRET`        | Clé de signature des sessions. La changer déconnecte tout le monde           |
| `BLOB_READ_WRITE_TOKEN` | Jeton Vercel Blob, ajouté automatiquement quand un store est relié au projet |

## Mise en ligne sur Vercel

1. Importer le dépôt GitHub dans Vercel (le framework SvelteKit est détecté).
2. Onglet **Storage** : créer un store **Blob** et le relier au projet.
3. **Settings > Environment Variables** : ajouter `ADMIN_PASSWORD` et `SESSION_SECRET`.
4. **Settings > Domains** : brancher `saintepopulaire.fr`, voir le guide pas à pas [docs/NOM-DE-DOMAINE.md](docs/NOM-DE-DOMAINE.md).
5. Chaque push sur `main` redéploie le site. Chaque branche a sa propre URL de prévisualisation.

## Demandes d'ajout WhatsApp / Signal

Le formulaire public `/rejoindre` enregistre les demandes dans Vercel Blob, chiffrées (AES-256-GCM, clé dérivée de `SESSION_SECRET`).
Les admins les traitent sur `/admin/demandes` : lien direct vers WhatsApp ou Signal, « Marquer comme ajouté », « Supprimer ».
Protection anti-spam : champ caché pour les robots et 5 demandes maximum par adresse IP toutes les 10 minutes.

## Tests

```bash
npm run check      # types et Svelte
npm run lint       # formatage et ESLint
npm test           # tests unitaires (Vitest)
npm run test:e2e   # tests navigateur (Playwright), desktop et mobile
```

Les tests e2e construisent le site et le lancent avec un faux serveur Vercel Blob (`tests/e2e/mock-blob-server.mjs`). Ils ne touchent jamais aux données réelles.

## Limites connues

- Les fichiers envoyés depuis l'espace militant sont limités à 4 Mo au total (limite des fonctions Vercel).
- Les pages des pôles Garanties et Action vie militante ainsi que la page programme sont encore provisoires.
