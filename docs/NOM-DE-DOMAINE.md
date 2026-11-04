# Mettre le site sur saintepopulaire.fr

Objectif : que saintepopulaire.fr affiche ce site (hébergé gratuitement sur Vercel) à la place de l'ancien WordPress, sans casser l'adresse email contact@saintepopulaire.fr.

Le site est déjà prêt côté code : liens canoniques, sitemap et aperçus de partage pointent vers saintepopulaire.fr, et les adresses en .vercel.app sont exclues de Google. Il n'y a rien à modifier dans le code.

## Ce que ça coûte

- Hébergement du site sur Vercel : gratuit.
- Le nom de domaine lui-même : environ 7 à 15 € par an chez le bureau d'enregistrement. C'est déjà payé par celui ou celle qui a créé le WordPress. Il faut juste continuer à le renouveler.
- L'hébergement WordPress pourra être résilié ensuite (économie), **sauf** s'il sert aussi à l'email contact@ : voir l'étape 5.

À savoir : l'offre gratuite de Vercel est prévue pour des projets personnels non commerciaux. Un collectif militant sans activité commerciale entre en pratique dans ce cadre. Si un jour Vercel le conteste, Cloudflare Pages est une alternative gratuite.

## Étape 1 : trouver où est le domaine

1. Ouvrir https://www.afnic.fr/noms-de-domaine/tout-savoir/whois-trouver-un-nom-de-domaine/
2. Chercher `saintepopulaire.fr`.
3. Noter le **bureau d'enregistrement** (par exemple OVH, IONOS, Hostinger, o2switch, Gandi).
4. Se connecter à ce site avec les identifiants. Ce ne sont pas forcément les identifiants WordPress : il faut le compte chez l'hébergeur.

## Étape 2 : sauvegarder l'ancien WordPress

Dans l'administration WordPress (saintepopulaire.fr/wp-admin) :

1. Outils > Exporter > Tout le contenu > Télécharger le fichier d'export.
2. Garder ce fichier : il contient tous les anciens articles et pages.

## Étape 3 : ajouter le domaine dans Vercel

1. Vercel > projet **sainte_pop** > Settings > Domains.
2. Ajouter `saintepopulaire.fr`.
3. Accepter la proposition d'ajouter aussi `www.saintepopulaire.fr` en redirection.
4. Vercel affiche alors les enregistrements DNS à créer. **Ce sont ces valeurs qui font foi**, celles ci-dessous sont seulement des exemples habituels.

## Étape 4 : modifier la zone DNS chez le bureau d'enregistrement

Dans l'espace client : Domaines > saintepopulaire.fr > Zone DNS (ou « DNS », « Gérer la zone »).

| Type  | Nom (sous-domaine) | Valeur (exemple, prendre celle de Vercel) | Action                                 |
| ----- | ------------------ | ----------------------------------------- | -------------------------------------- |
| A     | vide ou `@`        | `76.76.21.21`                             | Remplacer l'ancienne valeur            |
| AAAA  | vide ou `@`        | (ancienne valeur)                         | Supprimer s'il y en a une              |
| CNAME | `www`              | `cname.vercel-dns.com.`                   | Remplacer l'ancienne valeur (ou créer) |

**Ne surtout pas toucher** aux lignes **MX**, ni aux lignes **TXT** qui contiennent `spf`, `dkim` ou `dmarc`. Ce sont elles qui font marcher l'email contact@saintepopulaire.fr.

Faire une capture d'écran de la zone **avant** de modifier, pour pouvoir revenir en arrière.

## Étape 5 : attendre et vérifier

1. Le changement prend entre 10 minutes et 24 heures.
2. Dans Vercel > Settings > Domains, le domaine passe en « Valid Configuration ». Le HTTPS (cadenas) est ajouté automatiquement.
3. Ouvrir https://saintepopulaire.fr : le nouveau site doit s'afficher.
4. Envoyer un email de test à contact@saintepopulaire.fr pour vérifier qu'il arrive toujours.

## Étape 6 (plus tard) : résilier l'hébergement WordPress

Seulement une fois le nouveau site en ligne depuis quelques jours, et **après avoir vérifié où sont hébergés les emails**. Si l'email contact@ est inclus dans l'offre d'hébergement WordPress, la résilier coupe l'email. Dans ce cas, il faut d'abord déplacer l'email ou garder une petite offre email.

Ne jamais résilier ou laisser expirer le **nom de domaine** lui-même.

## En cas de problème

- Le site affiche toujours WordPress : attendre, ou vider le cache du navigateur.
- Vercel indique « Invalid Configuration » : comparer la zone DNS avec les valeurs affichées par Vercel.
- L'email ne marche plus : remettre les lignes MX et TXT d'origine grâce à la capture d'écran.
- Pour revenir à l'ancien site : remettre l'ancienne valeur de la ligne A.
