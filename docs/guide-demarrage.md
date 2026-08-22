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

*Sections suivantes ajoutées au fil des prochains jalons : création du
compte Supabase et connexion admin (Jalon 2), enregistrement du premier
commerce (Jalon 3), et la suite.*
