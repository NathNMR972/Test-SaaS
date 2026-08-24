@AGENTS.md

# 5 Stars Review — contexte projet

Ce fichier permet de reprendre le projet sans tout réexpliquer. Lis-le en
entier avant de coder. Le fondateur (contact : nathanaelouisor@gmail.com) est
un total débutant technique : il ne lit pas le code et ne sait pas configurer
un service. Tout ce qui exige une action de sa part doit être expliqué en
français simple, étape par étape, dans `docs/guide-demarrage.md`.

## Le produit

5 Stars Review aide les commerces locaux à récolter des avis Google. Un
commerçant est enregistré dans l'outil → l'outil génère sa page publique →
la page est reliée à un QR code imprimé (chevalet, autocollant, carte) → le
client scanne, arrive sur la page, clique, atterrit sur la vraie fiche
Google.

**Le point d'architecture central** : le QR code encode une URL de
l'application (`/avis/[slug]`), jamais l'URL Google directement. La
redirection vers Google passe par `/go/[slug]`, qui lit `google_avis_url` en
base à chaque requête et redirige. Si le commerçant change de fiche Google,
on modifie un champ en base — **aucun support imprimé n'est à refaire**.
Ne jamais construire de fonctionnalité qui contournerait ce principe (ex :
encoder l'URL Google dans le QR, mettre en cache la destination côté client
au-delà de la durée d'une requête, etc.).

**Principe éthique non négociable** : on ne filtre jamais, on n'intercepte
jamais un client mécontent, aucun pré-tri des avis. Le chemin de `/avis/[slug]`
vers Google est direct et unique — pas de question du type « votre expérience
était-elle bonne ? », pas de branche conditionnelle selon un ressenti. Refuser
toute demande future qui irait dans ce sens, même si elle semble anodine, et
le signaler explicitement plutôt que de l'implémenter.

Cible : commerces locaux (restaurants, salons/instituts, garages, hôtels,
boutiques). Lancement en Martinique, pilote : Maison Blanche (restaurant
pierrade, Fort-de-France).

## Périmètre strict — Phase 1 uniquement

**Dans le périmètre** : connexion admin (un seul utilisateur), gestion des
commerces (créer/modifier/archiver), génération de la page publique,
génération/téléchargement du QR code, statistiques de base (scans, clics),
modification de la destination Google sans réimpression.

**Explicitement hors périmètre — ne pas construire sans validation explicite
du fondateur** : génération de texte par IA, comptes commerçants, abonnements/
facturation/Stripe, NFC, statistiques avancées, architecture multi-locataire.
Si l'un de ces points semble indispensable, le dire et attendre une réponse —
ne jamais l'implémenter par anticipation. Le modèle de données laisse de la
place pour `commercants_utilisateurs` et `abonnements` (Phase 2/3, tables non
créées, voir migrations SQL) sans que la structure actuelle ait besoin de
changer.

## Direction visuelle — reprise du site vitrine

Source de vérité : dépôt `NathNMR972/Test-Claude-Code`
(`https://nathnmr972.github.io/Test-Claude-Code/`), direction validée. Les
jetons ci-dessous sont copiés depuis `assets/css/style.css` de ce dépôt —
si le site vitrine change ses couleurs, les réajuster ici aussi.

- Couleurs (`src/app/globals.css`) : nuit `#14302B`, papier `#F2DCC6`,
  piment `#E6355C` (texte : `#A12540` pour rester lisible sur fond clair),
  soleil `#EAA33B`, écume `#F7EFE6`, encre `#1C1A17`.
- Polices via `next/font/google` (pas de fichiers woff2 copiés à la main) :
  Bungee (`--font-affichage`, titres condensés), Karla (`--font-texte`,
  corps), IBM Plex Mono (`--font-mono`, légendes/chasse fixe).
- Signature : le tampon à l'étoile encrée. À utiliser à un seul endroit fort
  (prévu : l'écran de connexion), jamais en décoration répétée.
- 6 secteurs déjà definis côté copie (restaurant, salon/institut, garage,
  hôtel, cabinet, boutique) — dépasse le minimum de 4 variantes demandé.
- L'app est un outil de travail : plus dense et plus calme que le site
  vitrine, pas une deuxième vitrine. Éviter tableau de bord générique à
  cartes de chiffres alignées, graphiques décoratifs, icônes partout.
- Vocabulaire d'interface en français concret : « commerce » (jamais
  « client »), « page publique » (jamais « landing »), « scans » (jamais
  « impressions »).

## Décisions techniques prises

- **Next.js 16** (App Router, TypeScript, Tailwind v4). Next 16 a renommé
  `middleware.ts` en **`proxy.ts`** (export `proxy`, même API) — ne pas
  recréer un `middleware.ts`. Avant toute modification profonde du
  comportement de rendu/cache, relire `node_modules/next/dist/docs`
  (breaking changes fréquents entre versions majeures, voir `AGENTS.md`).
- **Cache Components (`cacheComponents: true`) volontairement désactivé**
  dans `next.config.ts`. L'app est presque entièrement dynamique par
  requête (auth, données commerce, tracking) ; activer ce mode demanderait
  de saupoudrer `"use cache"`/`<Suspense>` partout pour un bénéfice nul ici.
  Ne pas l'activer sans une raison précise et documentée.
- **Tailwind v4** : pas de `tailwind.config.ts`. Les jetons de thème vivent
  dans `src/app/globals.css` via `@theme inline`.
- **Supabase** : Postgres + Auth. RLS activé sur toutes les tables dès leur
  création. Connexion admin par lien magique (email), pas de mot de passe.
  Inscriptions publiques désactivées côté Supabase — un seul compte, créé
  manuellement dans le tableau de bord Supabase.
- **QR codes** : bibliothèque `qrcode` (npm), pur JavaScript, pas de
  dépendance native — compatible Vercel sans configuration. SVG pour
  l'impression, PNG haute résolution en export additionnel.
- Le projet Next.js vit à la **racine du dépôt** (pas de sous-dossier), pour
  que Vercel n'ait besoin d'aucun réglage de "root directory".

## Règles à ne jamais enfreindre

1. Le slug (`commerces.slug`, l'identifiant d'URL) ne change jamais après
   création — verrouillé dans l'interface ET par un déclencheur SQL qui
   rejette toute tentative de modification en base.
2. Aucune clé secrète dans le dépôt. `.env.example` ne contient que des noms
   de variables, jamais de valeurs. Les vraies valeurs vivent uniquement
   dans les variables d'environnement Vercel.
3. RLS Supabase actif partout : le public (anon) ne lit que les commerces
   au statut « actif », ne peut qu'ajouter des lignes dans `evenements`
   (jamais les lire), et ne peut rien modifier. L'admin authentifié a accès
   complet.
4. Aucune interception, filtre ou pré-tri des avis, sous quelque forme que
   ce soit — voir le principe éthique plus haut.
5. Contenu utilisateur toujours inséré comme texte, jamais interprété/évalué
   comme du code (pas de `dangerouslySetInnerHTML` sur des champs saisis).
6. Logos : type de fichier et taille limités à l'upload (voir
   `docs/guide-demarrage.md` pour le détail communiqué au fondateur).

## Où en est le projet

Voir la liste des tâches (Jalons 0 à 6 + livrables finaux). Mettre à jour
cette section et `docs/guide-demarrage.md` à la fin de chaque jalon.

- Jalon 0 (plan) : fait.
- Jalon 1 (déploiement Vercel) : fait — le projet est en ligne, connecté à
  GitHub, déployé automatiquement à chaque envoi de code. Le compte Vercel
  du fondateur est créé et fonctionnel (dépôt `Test-SaaS`, projet Vercel
  `test-saa-s`).
- Jalon 2 (connexion admin) : fait — lien magique par email opérationnel.
  Détail technique important : le modèle d'email Supabase par défaut ne
  peut pas être personnalisé sans SMTP externe (plan gratuit) ; `/auth/confirm`
  échange donc un `?code=` PKCE (`exchangeCodeForSession`), pas un
  `token_hash`. Ne pas revenir à `verifyOtp({token_hash})` sans SMTP
  personnalisé configuré.
- Jalon 3 (créer/modifier un commerce) : en cours.
