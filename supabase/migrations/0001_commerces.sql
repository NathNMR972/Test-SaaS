-- Commerces : chaque ligne est un client de 5 Stars Review.
-- Colonnes prévues pour plus tard (non créées ici, voir CLAUDE.md) :
-- commercants_utilisateurs (Phase 2), abonnements (Phase 3).

create type secteur_commerce as enum (
  'restaurant',
  'salon',
  'garage',
  'hotel',
  'cabinet',
  'boutique'
);

create type statut_commerce as enum ('actif', 'archive');

create table commerces (
  id uuid primary key default gen_random_uuid(),
  nom text not null check (char_length(nom) between 1 and 80),
  -- Identifiant d'URL, imprimé sur le QR code : voir le déclencheur plus bas,
  -- il ne doit jamais changer après création.
  slug text not null unique check (slug ~ '^[a-z0-9]+(-[a-z0-9]+)*$'),
  secteur secteur_commerce not null,
  logo_url text,
  couleur_principale text not null check (couleur_principale ~ '^#[0-9a-fA-F]{6}$'),
  adresse text,
  google_avis_url text,
  statut statut_commerce not null default 'actif',
  created_at timestamptz not null default now()
);

-- Le slug est imprimé sur du matériel physique (QR code) : impossible à
-- modifier après création, même par erreur ou requête directe en base.
-- L'interface le verrouille aussi, mais cette contrainte est la garantie
-- ultime.
create function empecher_modification_slug()
returns trigger
language plpgsql
as $$
begin
  if new.slug <> old.slug then
    raise exception
      'Le slug ne peut pas être modifié après la création du commerce (%).',
      old.slug;
  end if;
  return new;
end;
$$;

create trigger verrou_slug
  before update on commerces
  for each row
  execute function empecher_modification_slug();

alter table commerces enable row level security;

-- Le public (page /avis/[slug]) ne lit que les commerces actifs, rien d'autre.
create policy "public lit les commerces actifs"
  on commerces for select
  to anon
  using (statut = 'actif');

-- L'admin authentifié (un seul compte) a accès complet.
create policy "admin gere tous les commerces"
  on commerces for all
  to authenticated
  using (true)
  with check (true);
