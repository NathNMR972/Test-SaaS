# Guide de démarrage — 5 Stars Review

Ce guide est écrit pour quelqu'un qui n'a jamais utilisé ces outils. Il est
complété au fur et à mesure des jalons — ne lire que la section correspondant
à l'étape en cours.

## Jalon 1 — Mettre le projet en ligne sur Vercel

Objectif : voir le projet fonctionner sur une vraie adresse internet, même
si pour l'instant la page ne contient presque rien. Ça prouve que la chaîne
complète (le code → GitHub → Vercel → une adresse web) fonctionne, avant
d'ajouter la moindre fonctionnalité.

### Étape A — Créer un compte Vercel

1. Ouvrir [vercel.com](https://vercel.com) dans un navigateur.
2. Cliquer sur **Sign Up** (en haut à droite).
3. Choisir **Continue with GitHub**.
4. Se connecter avec le même compte GitHub que celui qui héberge le projet
   (`NathNMR972`). Une page GitHub demandera d'autoriser Vercel : cliquer
   **Authorize Vercel**.

### Étape B — Importer le projet

1. Sur le tableau de bord Vercel, cliquer **Add New…** puis **Project**.
2. Dans la liste des dépôts GitHub, trouver **Test-SaaS** et cliquer
   **Import**.
3. Vercel détecte automatiquement qu'il s'agit d'un projet Next.js — ne rien
   changer dans les réglages proposés.
4. Ne pas ajouter de variable d'environnement à cette étape, ce n'est pas
   encore nécessaire.
5. Cliquer **Deploy**.

Ce premier déploiement part de la branche `main` du dépôt, qui est encore
presque vide à ce stade du projet — il est normal qu'il échoue ou n'affiche
rien d'intéressant. Ce n'est pas un problème : Vercel crée aussi, séparément,
une adresse pour **chaque branche** poussée sur GitHub. Le travail en cours
est sur la branche `claude/5-stars-review-mvp-bqmu0e`, pas sur `main` — c'est
son adresse à elle qu'il faut ouvrir. L'étape suivante explique comment la
trouver.

### Étape C — Ouvrir l'adresse de la branche en cours

1. Sur la page du projet dans Vercel, cliquer l'onglet **Deployments** (en
   haut de la page).
2. Une liste de déploiements apparaît, un par envoi de code. Chercher celui
   dont le nom de branche affiché est `claude/5-stars-review-mvp-bqmu0e` (il
   est visible à côté ou en dessous du message de commit, sur chaque ligne).
3. Cliquer sur cette ligne pour ouvrir le détail du déploiement.
4. Attendre que le statut indique **Ready** (quelques minutes si ce n'est pas
   déjà fait).
5. Cliquer sur le bouton **Visit** (ou sur l'image d'aperçu du site) : ça
   ouvre l'adresse propre à cette branche, du type
   `test-saas-git-claude-5-stars-review-mvp-bqmu0e-<ton-compte>.vercel.app`.

Si l'onglet **Deployments** ne montre qu'une seule ligne grisée en échec :
c'est celle de la branche `main` (normal, voir plus haut) — vérifier qu'une
seconde ligne existe pour l'autre branche. Si elle n'apparaît pas du tout,
prévenir : il faudra vérifier que Vercel a bien accès à toutes les branches
du dépôt, pas seulement `main`.

### Vérification

La page affiche, sur fond crème avec les couleurs de la marque :

> 5 STARS REVIEW — ADMINISTRATION
> Le projet est en ligne.

Si c'est ce qui s'affiche, le Jalon 1 est validé : GitHub, Vercel et le code
communiquent correctement. Tout ce qui suivra (connexion, commerces, QR
codes, statistiques) se déploiera automatiquement de la même façon, à chaque
fois qu'une nouvelle version sera envoyée.

**Ce que ça coûte** : rien pour l'instant. Le plan gratuit de Vercel
("Hobby") est largement suffisant pour un commerce pilote ; le guide
signalera clairement si un jour l'usage approche une limite qui rendrait un
plan payant nécessaire.

---

## Jalon 2 — Connexion admin

Objectif : pouvoir se connecter au panneau d'administration avec ton adresse
email, par lien magique (pas de mot de passe), et être seul à pouvoir le
faire.

### Étape A — Créer le compte et le projet Supabase

1. Va sur **supabase.com**, clique **Start your project**, connecte-toi avec
   **GitHub**.
2. Clique **New Project**, remplis :
   - **Name** : `5-stars-review` (peu importe, n'apparaît nulle part côté
     client).
   - **Database Password** : laisse Supabase la générer, copie-la et garde-la
     de côté (gestionnaire de mots de passe ou note).
   - **Region** : une région Europe (ex. *West EU (Ireland)* ou *Central EU
     (Frankfurt)*).
   - Plan **Free**.
3. Clique **Create new project** et attends 1 à 2 minutes.

### Étape B — Copier les clés

1. **Settings** (icône d'engrenage) → **API** (ou « API Keys »).
2. Copie le **Project URL** et la clé publique (**anon / public key**, parfois
   appelée **publishable key**).

### Étape C — N'autoriser qu'un seul compte

1. Dans le menu de gauche, ouvre **Authentication**.
2. Onglet **Settings** (parfois « Sign In / Providers ») → trouve **Allow new
   users to sign up** → désactive-le. Personne ne pourra créer de compte tout
   seul, y compris via le lien de connexion.
3. Onglet **Users** → **Add user** → **Create new user** :
   - Email : ton adresse (`nathanaelouisor@gmail.com`).
   - Active **Auto Confirm User**.
   - Clique **Create user**.

### Étape D — Autoriser l'adresse du site à recevoir le lien

1. Toujours dans **Authentication**, ouvre **URL Configuration**.
2. Dans **Redirect URLs**, ajoute :
   ```
   https://*-nath-nmr-972.vercel.app/**
   ```
   (le `*` couvre toutes les adresses que Vercel génère pour ton compte —
   pas besoin de la changer à chaque déploiement).
3. Sauvegarde.

### Étape E — Coller les clés dans Vercel

1. Sur Vercel, ouvre le projet → **Settings** → **Environment Variables**.
2. Ajoute deux variables (coche les trois cases d'environnement — Production,
   Preview, Development — pour chacune) :
   - `NEXT_PUBLIC_SUPABASE_URL` → colle le **Project URL** de l'étape B.
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY` → colle la clé publique de l'étape B.
3. Clique **Save** pour chacune.
4. Va dans **Deployments**, ouvre le déploiement le plus récent sur la
   branche `claude/5-stars-review-mvp-bqmu0e`, clique **…** → **Redeploy**
   (les nouvelles variables ne s'appliquent qu'à un déploiement lancé après
   les avoir ajoutées).

### Vérification

Ouvre l'adresse du site : elle doit maintenant rediriger automatiquement vers
une page **Connexion** avec le tampon à l'étoile. Entre ton adresse email,
clique **Envoyer le lien de connexion**, ouvre ta boîte mail, clique sur le
lien reçu : tu dois atterrir sur une page **Commerces** avec ton adresse
affichée en haut et un bouton **Se déconnecter**.

**Ce que ça coûte** : rien pour un seul commerce pilote (plan Supabase Free).

---

## Jalon 3 — Créer et modifier un commerce

Objectif : pouvoir enregistrer un commerce (nom, secteur, couleur, logo,
adresse, lien Google) et le modifier ensuite. Une seule chose à faire de ton
côté : créer la table dans la base de données.

### Étape A — Exécuter le schéma SQL

1. Sur ton projet Supabase, ouvre **SQL Editor** dans le menu de gauche.
2. Clique **New query**.
3. Ouvre le fichier `supabase/migrations/0001_commerces.sql` du dépôt GitHub
   (onglet **Code**, dossier `supabase/migrations`), copie tout son contenu,
   colle-le dans l'éditeur SQL de Supabase, clique **Run**.
4. Répète avec `supabase/migrations/0002_storage_logos.sql` (nouvelle
   requête, coller, **Run**).

Chaque script ne doit être exécuté **qu'une seule fois**. S'il y a un message
vert de succès, c'est fait — pas besoin d'y retoucher.

### Vérification

1. Menu de gauche → **Table Editor** : une table **commerces** doit
   apparaître (vide pour l'instant).
2. Menu de gauche → **Storage** : un bucket **logos** doit apparaître.
3. Sur le site, connecte-toi, clique **Nouveau commerce**, remplis le
   formulaire (le nom suffit pour l'instant, le reste est facultatif) et
   valide. Le commerce doit apparaître dans la liste. Clique **Modifier**
   pour vérifier que l'identifiant d'URL est bien verrouillé (grisé,
   non modifiable).

**Ce que ça coûte** : rien pour un seul commerce pilote (le stockage des
logos reste très en dessous du plan gratuit).

---

## Jalon 4 — La page publique

Objectif : la page que voit un client après avoir scanné le QR code (pas
encore de QR à ce stade — ça arrive au Jalon 5, mais l'adresse fonctionne
déjà). Une seule chose à faire de ton côté : créer la table des événements
(visites et clics), en base.

### Étape A — Exécuter le troisième script SQL

1. Supabase → **SQL Editor** → **New query**.
2. Copie le contenu de `supabase/migrations/0003_evenements.sql` (dépôt
   GitHub, dossier `supabase/migrations`) → colle → **Run**.

### Vérification

1. **Table Editor** doit maintenant montrer une deuxième table :
   **evenements** (vide).
2. Ouvre la fiche d'un commerce déjà créé (**Modifier**) et clique **Voir la
   page publique** : une page plein écran à la couleur du commerce doit
   s'afficher, avec son nom et un gros bouton (si un lien Google a été
   renseigné) ou un message d'attente (sinon).
3. Si un lien Google est renseigné, clique le bouton : tu dois être
   redirigé vers la vraie fiche Google.
4. Teste aussi une adresse qui n'existe pas, du type
   `.../avis/ce-commerce-n-existe-pas` : une page d'erreur soignée doit
   s'afficher, pas un plantage technique.

**Ce que ça coûte** : rien pour ce volume (Supabase Free, Vercel Hobby).

---

## Jalon 5 — Le QR code

Objectif : télécharger le QR code d'un commerce, prêt à imprimer. Rien à
faire côté Supabase pour ce jalon — uniquement du code.

### Vérification

1. Ouvre la fiche d'un commerce (**Modifier**). Un aperçu du QR code doit
   apparaître au-dessus du formulaire.
2. Clique **Télécharger en SVG** puis **Télécharger en PNG** : deux fichiers
   doivent se télécharger.
3. Scanne le QR avec l'appareil photo d'un téléphone : il doit ouvrir la
   page publique du commerce (`/avis/...`), pas directement Google — c'est
   voulu, voir le principe central du projet dans `CLAUDE.md`.

**Important, à retenir avant d'imprimer pour de vrai** : le QR encode
l'adresse du site *telle qu'elle est au moment du téléchargement*. Tant que
le site n'a que son adresse provisoire Vercel (`...vercel.app`), c'est cette
adresse-là qui sera encodée. Si un jour tu passes à une adresse définitive
(nom de domaine personnalisé), il faudra retélécharger et réimprimer les QR
codes une dernière fois à ce moment-là — mais plus jamais ensuite : c'est
justement tout l'intérêt de l'architecture du projet (voir Jalon 4).

**Ce que ça coûte** : rien.

---

## Jalon 6 — Les statistiques

Objectif : voir combien de personnes scannent le QR et cliquent vers Google.
Rien à faire côté Supabase pour ce jalon — uniquement du code.

### Vérification

1. Sur la fiche d'un commerce (**Modifier**), un résumé (Scans, Clics vers
   Google, Taux de clic) doit apparaître.
2. Clique **Voir le détail sur 30 jours** : un graphique en barres sobre
   doit s'afficher (une barre foncée = scans, une barre rouge = clics, par
   jour), avec un encadré qui explique honnêtement ce que ces chiffres
   mesurent — et ce qu'ils ne mesurent pas (on ne sait pas combien de clics
   se transforment en avis réellement publiés, Google ne le communique pas).
3. Si tu as testé la page publique d'un commerce plusieurs fois au fil des
   jalons précédents, les chiffres doivent déjà refléter ces visites.

**Ce que ça coûte** : rien.

---

C'est la fin des six jalons prévus. Il reste les livrables finaux : le
README technique (déjà à jour), ce guide (déjà à jour au fil de l'eau), et
`CLAUDE.md` à la racine du dépôt pour reprendre le projet sans tout
réexpliquer.
