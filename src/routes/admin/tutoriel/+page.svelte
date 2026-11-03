<svelte:head>
	<title>Tutoriel | Sainte Populaire</title>
	<meta name="robots" content="noindex, nofollow" />
</svelte:head>

<div class="tutoriel-container">
	<div class="tutoriel-header">
		<h1>📚 Guide du Site Sainte Populaire</h1>
		<p>Un tutoriel simple pour comprendre et modifier le site</p>
	</div>

	<div class="section">
		<h2>Comment fonctionne le site ?</h2>

		<h3>La structure de base</h3>
		<p>
			Le site utilise <strong>SvelteKit</strong> (un framework moderne pour créer des sites web).
		</p>

		<div class="file-tree">
			<span class="folder">sainte-populaire/</span>
			<span class="folder">src/</span>
			<span class="folder">routes/</span> ← Les pages du site
			<span class="folder">lib/</span> ← Les outils réutilisables
			<span class="folder">content/</span> ← Le contenu (articles, événements)
			<span class="folder">static/</span> ← Images, fichiers statiques
		</div>

		<h3>Où est stocké le contenu ?</h3>
		<p>
			Le contenu (articles, événements) est stocké dans <strong>Vercel Blob</strong> (un service de stockage
			en ligne). C'est comme un grand placard dans le cloud où on range tous les fichiers.
		</p>

		<div class="info-box">
			<strong>💡 Pourquoi Vercel Blob ?</strong><br />
			Parce que c'est rapide, sécurisé et accessible depuis n'importe où. Les fichiers ne sont pas dans
			le code Git, mais dans un stockage dédié.
		</div>
	</div>

	<div class="section">
		<h2><span class="emoji">✏️</span> Comment modifier le contenu ?</h2>

		<p>Il y a <strong>deux façons</strong> de modifier le contenu :</p>

		<h3>Méthode 1 : Via l'interface admin (la plus simple !)</h3>
		<ol>
			<li><strong>Se connecter</strong> : Va sur <code>/admin/login</code> et connecte-toi</li>
			<li><strong>Ajouter un article PDF</strong> : Va sur <code>/admin/ajouter-pdf</code></li>
			<li>
				<strong>Ajouter un événement</strong> : Va sur <code>/calendrier</code> et clique sur « Ajouter
				un événement »
			</li>
		</ol>

		<div class="success-box">
			<strong>✅ Avantage :</strong> Pas besoin de toucher au code ! Tu remplis un formulaire et c'est
			fait.
		</div>

		<h3>Méthode 2 : Via Git (pour les modifications de code)</h3>
		<p>Si tu veux modifier le design, ajouter une page, ou changer le code :</p>

		<div class="code-block">
			<code
				># 1. Récupérer les dernières modifications git pull origin main # 2. Créer une nouvelle
				branche pour tes modifications git checkout -b ma-modification # 3. Faire tes modifications
				dans les fichiers # 4. Voir ce qui a changé git status git diff # 5. Enregistrer tes
				modifications git add . git commit -m "Description de ce que j'ai modifié" # 6. Envoyer sur
				GitHub git push origin ma-modification</code
			>
		</div>

		<div class="warning-box">
			<strong>⚠️ Important :</strong> Ne modifie jamais directement la branche <code>main</code> ! Crée
			toujours une nouvelle branche pour tester tes modifications.
		</div>
	</div>

	<div class="section">
		<h2><span class="emoji">🧪</span> Comment tester le site en local ?</h2>

		<p>Avant de mettre en ligne, tu peux tester le site sur ton ordinateur :</p>

		<div class="step-number">1</div>
		<strong>Installer les dépendances</strong>
		<div class="code-block">
			<code>cd sainte-populaire npm install</code>
		</div>

		<div class="step-number">2</div>
		<strong>Lancer le serveur de développement</strong>
		<div class="code-block">
			<code>npm run dev</code>
		</div>

		<div class="step-number">3</div>
		<strong>Ouvrir dans le navigateur</strong>
		<p>
			Le site sera accessible sur <code>http://localhost:5173</code> (ou un autre port si celui-ci est
			occupé)
		</p>

		<div class="info-box">
			<strong>💡 Astuce :</strong> Quand tu modifies un fichier, la page se recharge automatiquement
			! C'est magique ✨
		</div>

		<h3>Vérifier que tout fonctionne</h3>
		<div class="code-block">
			<code># Vérifier la syntaxe du code npm run check # Lancer les tests npm test</code>
		</div>
	</div>

	<div class="section">
		<h2><span class="emoji">🚀</span> Comment mettre en ligne (déployer) ?</h2>

		<p>Le site est déployé sur <strong>Vercel</strong>. Voici comment ça marche :</p>

		<h3>Déploiement automatique</h3>
		<p>
			Quand tu pousses du code sur la branche <code>main</code> de GitHub, le site se met à jour automatiquement
			!
		</p>

		<ol>
			<li>Tu fais tes modifications</li>
			<li>Tu commits et tu pushes sur <code>main</code></li>
			<li>Vercel détecte le changement</li>
			<li>Le site se reconstruit automatiquement</li>
			<li>En 2-3 minutes, c'est en ligne ! 🎉</li>
		</ol>

		<h3>Déploiement manuel (si besoin)</h3>
		<div class="code-block">
			<code
				># Construire le site pour la production npm run build # Prévisualiser la version de
				production npm run preview</code
			>
		</div>

		<div class="warning-box">
			<strong>⚠️ Attention :</strong> Avant de pousser sur <code>main</code>, teste toujours en
			local avec <code>npm run dev</code> !
		</div>
	</div>

	<div class="section">
		<h2><span class="emoji">📁</span> Structure des fichiers importants</h2>

		<h3>Les routes (les pages du site)</h3>
		<div class="file-tree">
			<span class="folder">src/routes/</span>
			<span class="file">+page.server.ts</span> ← Accueil (redirige vers les actualités)
			<span class="file">+layout.svelte</span> ← Layout commun (header, footer)
			<span class="folder">actualites/</span> ← Page des actualités
			<span class="folder">calendrier/</span> ← Page du calendrier
			<span class="folder">admin/</span> ← Pages admin (protégées)
			<span class="folder">api/</span> ← API pour créer/modifier du contenu
		</div>

		<h3>Les composants réutilisables</h3>
		<div class="file-tree">
			<span class="folder">src/lib/components/</span>
			<span class="file">Header.svelte</span> ← En-tête du site
			<span class="file">*.svelte</span> ← Autres composants
		</div>

		<h3>La logique serveur</h3>
		<div class="file-tree">
			<span class="folder">src/lib/server/</span>
			<span class="file">db.ts</span> ← Gestion du stockage (Vercel Blob)
			<span class="file">auth.ts</span> ← Connexion et session admin signée
			<span class="file">validation.ts</span> ← Contrôle des formulaires et fichiers
		</div>
	</div>

	<div class="section">
		<h2><span class="emoji">🔐</span> Système d'authentification</h2>

		<p>Pour accéder aux pages admin, il faut être connecté :</p>

		<ul>
			<li>
				Les identifiants sont définis dans les variables d'environnement Vercel (<code
					>ADMIN_USERNAME</code
				>, <code>ADMIN_PASSWORD</code>), jamais dans le code
			</li>
			<li>Une fois connecté, un cookie signé est créé pour 8 heures</li>
			<li>Les pages et l'API admin vérifient la signature de ce cookie avant toute action</li>
			<li>Changer <code>SESSION_SECRET</code> sur Vercel déconnecte tout le monde</li>
		</ul>
	</div>

	<div class="section">
		<h2><span class="emoji">📝</span> Exemples concrets</h2>

		<h3>Ajouter un nouvel événement</h3>
		<ol>
			<li>Va sur <code>/admin/login</code> et connecte-toi</li>
			<li>Va sur <code>/calendrier</code> et clique sur « Ajouter un événement »</li>
			<li>Remplis le formulaire (image de 4 Mo maximum)</li>
		</ol>

		<h3>Modifier le design d'une page</h3>
		<ol>
			<li>Ouvre le fichier <code>.svelte</code> correspondant dans <code>src/routes/</code></li>
			<li>Modifie le HTML/CSS dans le fichier</li>
			<li>Teste avec <code>npm run dev</code></li>
			<li>Si ça te plaît, commit et push !</li>
		</ol>

		<h3>Ajouter une nouvelle page</h3>
		<ol>
			<li>
				Crée un nouveau dossier dans <code>src/routes/</code> (ex: <code>ma-nouvelle-page/</code>)
			</li>
			<li>Crée un fichier <code>+page.svelte</code> dedans</li>
			<li>La page sera accessible sur <code>/ma-nouvelle-page</code></li>
		</ol>
	</div>

	<div class="section">
		<h2><span class="emoji">🆘</span> En cas de problème</h2>

		<h3>Le site ne démarre pas</h3>
		<ul>
			<li>Vérifie que tu as bien fait <code>npm install</code></li>
			<li>Vérifie que Node.js est installé (<code>node --version</code>)</li>
			<li>Regarde les erreurs dans le terminal</li>
		</ul>

		<h3>Les modifications ne s'affichent pas</h3>
		<ul>
			<li>Vide le cache du navigateur (Ctrl+Shift+R)</li>
			<li>Vérifie que le serveur de dev tourne toujours</li>
			<li>Regarde la console du navigateur (F12) pour les erreurs</li>
		</ul>

		<h3>Git me dit qu'il y a des conflits</h3>
		<ul>
			<li>Fais <code>git pull</code> pour récupérer les dernières modifications</li>
			<li>Résous les conflits manuellement dans les fichiers</li>
			<li>Ou demande de l'aide si tu n'es pas sûr !</li>
		</ul>
	</div>

	<div class="section">
		<h2><span class="emoji">📚</span> Ressources utiles</h2>

		<ul>
			<li>
				<strong>SvelteKit</strong> :
				<a href="https://kit.svelte.dev/docs" target="_blank" rel="noopener noreferrer"
					>Documentation officielle</a
				>
			</li>
			<li>
				<strong>Git</strong> :
				<a href="https://git-scm.com/doc" target="_blank" rel="noopener noreferrer">Guide Git</a>
			</li>
			<li>
				<strong>Vercel Blob</strong> :
				<a
					href="https://vercel.com/docs/storage/vercel-blob"
					target="_blank"
					rel="noopener noreferrer">Documentation Vercel Blob</a
				>
			</li>
		</ul>
	</div>

	<div class="section" style="text-align: center; background: var(--vert-fond);">
		<h2 style="border: none; margin-bottom: 1rem;">🎉 Tu es prêt(e) !</h2>
		<p>
			N'hésite pas à expérimenter. Le pire qui puisse arriver, c'est de devoir revenir en arrière
			avec Git !
		</p>
		<a href="/" class="link-button">Retour à l'accueil</a>
	</div>
</div>

<style>
	.tutoriel-container {
		max-width: 900px;
		margin: 2rem auto;
		padding: 0 1.5rem;
	}

	.tutoriel-header {
		text-align: center;
		margin-bottom: 3rem;
		padding-bottom: 2rem;
		border-bottom: 3px solid var(--vert);
	}

	.tutoriel-header h1 {
		color: var(--vert);
		font-size: 2.5rem;
		margin-bottom: 0.5rem;
	}

	.tutoriel-header p {
		color: var(--gris-acier);
		font-size: 1.1rem;
	}

	.section {
		background: white;
		border-radius: 12px;
		padding: 2rem;
		margin-bottom: 2rem;
		box-shadow: var(--shadow);
	}

	.section h2 {
		color: var(--vert);
		font-size: 1.8rem;
		margin-bottom: 1rem;
		padding-bottom: 0.5rem;
		border-bottom: 2px solid var(--vert-fond);
	}

	.section h3 {
		color: var(--vert-hover);
		font-size: 1.4rem;
		margin-top: 1.5rem;
		margin-bottom: 0.8rem;
	}

	.section p {
		line-height: 1.8;
		margin-bottom: 1rem;
		color: var(--noir-charbon);
	}

	.section ul,
	.section ol {
		margin-left: 1.5rem;
		margin-bottom: 1rem;
		line-height: 1.8;
	}

	.section li {
		margin-bottom: 0.5rem;
	}

	.code-block {
		background: #f5f5f5;
		border-left: 4px solid var(--vert);
		padding: 1rem;
		margin: 1rem 0;
		border-radius: 4px;
		font-family: 'Courier New', monospace;
		font-size: 0.9rem;
		overflow-x: auto;
	}

	.code-block code {
		color: #333;
	}

	.warning-box {
		background: #fff3cd;
		border-left: 4px solid #ffc107;
		padding: 1rem;
		margin: 1rem 0;
		border-radius: 4px;
	}

	.info-box {
		background: #d1ecf1;
		border-left: 4px solid #17a2b8;
		padding: 1rem;
		margin: 1rem 0;
		border-radius: 4px;
	}

	.success-box {
		background: #d4edda;
		border-left: 4px solid #28a745;
		padding: 1rem;
		margin: 1rem 0;
		border-radius: 4px;
	}

	.emoji {
		font-size: 1.5rem;
		margin-right: 0.5rem;
	}

	.step-number {
		display: inline-block;
		background: var(--vert);
		color: white;
		width: 30px;
		height: 30px;
		border-radius: 50%;
		text-align: center;
		line-height: 30px;
		font-weight: bold;
		margin-right: 0.5rem;
	}

	.file-tree {
		background: #2d2d2d;
		color: #f8f8f2;
		padding: 1rem;
		border-radius: 4px;
		font-family: 'Courier New', monospace;
		font-size: 0.85rem;
		margin: 1rem 0;
		overflow-x: auto;
	}

	.file-tree .folder {
		color: #ffd700;
	}

	.file-tree .file {
		color: #a8e6cf;
	}

	.link-button {
		display: inline-block;
		background: var(--vert);
		color: white;
		padding: 0.8rem 1.5rem;
		border-radius: 8px;
		text-decoration: none;
		margin-top: 1rem;
		transition: background 0.3s;
	}

	.link-button:hover {
		background: var(--vert-hover);
	}
</style>
