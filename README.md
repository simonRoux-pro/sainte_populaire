# sv

Everything you need to build a Svelte project, powered by [`sv`](https://github.com/sveltejs/cli).

## Creating a project

If you're seeing this, you've probably already done this step. Congrats!

```bash
# create a new project in the current directory
npx sv create

# create a new project in my-app
npx sv create my-app
```

## Developing

Once you've created a project and installed dependencies with `npm install` (or `pnpm install` or `yarn`), start a development server:

```bash
npm run dev

# or start the server and open the app in a new browser tab
npm run dev -- --open
```

## Building

To create a production version of your app:

```bash
npm run build
```

You can preview the production build with `npm run preview`.

> To deploy your app, you may need to install an [adapter](https://svelte.dev/docs/kit/adapters) for your target environment.
# Sainte Populaire

Site web de Sainte Populaire - Site SvelteKit

## Configuration

### Variables d'environnement

1. Copie le fichier `.env.example` en `.env` :
   ```bash
   cp .env.example .env
   ```

2. Ouvre le fichier `.env` et configure les variables :
   - `ADMIN_USERNAME` : Nom d'utilisateur admin (optionnel, par défaut: 'admin')
   - `ADMIN_PASSWORD` : **OBLIGATOIRE** - Mot de passe admin (choisis un mot de passe fort !)
   - `BLOB_READ_WRITE_TOKEN` : Token Vercel Blob pour le stockage des fichiers

3. **Important** : Ne commite JAMAIS le fichier `.env` dans Git ! Il est déjà dans `.gitignore`.

### Développement local

```bash
npm install
npm run dev
```

Le site sera accessible sur `http://localhost:5173`

### Déploiement

Le site est déployé automatiquement sur Vercel lors d'un push sur la branche `main`.

N'oublie pas de configurer les variables d'environnement dans le dashboard Vercel !
