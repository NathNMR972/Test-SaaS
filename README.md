# 5 Stars Review — application

Application interne (panneau d'administration + pages publiques) pour
5 Stars Review : gestion des commerces clients, génération de leur page
publique et de leur QR code, statistiques de scans/clics.

Pour la mise en route sans rien connaître au développement, voir
**[docs/guide-demarrage.md](docs/guide-demarrage.md)**. Pour le contexte
produit, les décisions techniques et les règles à ne pas enfreindre, voir
**[CLAUDE.md](CLAUDE.md)**.

## Stack

- [Next.js](https://nextjs.org) 16 (App Router, TypeScript)
- [Tailwind CSS](https://tailwindcss.com) v4
- [Supabase](https://supabase.com) (PostgreSQL + Auth), avec Row Level
  Security activé sur toutes les tables
- [Vercel](https://vercel.com) pour l'hébergement et le déploiement continu
- `qrcode` (npm) pour la génération des QR codes en SVG/PNG côté serveur

Aucune de ces briques ne nécessite d'installation locale, de serveur à
administrer ou de Docker : tout se pilote depuis un navigateur.

## Développement local (optionnel)

Le déploiement se fait automatiquement via Vercel à chaque envoi sur la
branche principale — travailler en local n'est nécessaire que pour du
développement actif.

```bash
npm install
cp .env.example .env.local   # puis compléter avec les valeurs Supabase
npm run dev
```

Ouvrir [http://localhost:3000](http://localhost:3000).

## Variables d'environnement

Voir `.env.example` pour la liste complète. Toutes se règlent dans
Vercel (Project Settings → Environment Variables) — jamais commitées.

## Structure du projet

```
src/app/              Routes (App Router)
  login/                Connexion admin (lien magique)
  dashboard/            Panneau d'administration (protégé)
  avis/[slug]/          Page publique consultée par les clients
  go/[slug]/            Redirection trackée vers la fiche Google
  api/commerces/[id]/   Téléchargement des QR codes (SVG/PNG)
src/components/       Composants React réutilisables
src/lib/               Logique métier partagée (slug, contraste, QR, Supabase…)
src/types/             Types TypeScript partagés
supabase/migrations/   Schéma SQL (tables, RLS, contraintes)
docs/                  Guide de démarrage pour le fondateur
```

## État du projet

Les six jalons prévus sont terminés : connexion admin, gestion des
commerces, page publique, QR code, statistiques. Voir `CLAUDE.md` pour le
détail et les décisions techniques.
