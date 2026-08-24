-- Événements : chaque visite de la page publique et chaque clic vers Google,
-- horodatés, rattachés à un commerce. Aucune donnée personnelle du visiteur.

create type type_evenement as enum ('visite_page', 'clic_google');

create table evenements (
  id uuid primary key default gen_random_uuid(),
  commerce_id uuid not null references commerces(id) on delete cascade,
  type type_evenement not null,
  created_at timestamptz not null default now()
);

create index evenements_commerce_id_idx on evenements (commerce_id);

alter table evenements enable row level security;

-- Le public ne peut qu'ajouter un événement, sur un commerce actif — jamais
-- les lire ni les modifier.
create policy "public ajoute des evenements sur un commerce actif"
  on evenements for insert
  to anon
  with check (
    exists (
      select 1 from commerces
      where commerces.id = evenements.commerce_id
        and commerces.statut = 'actif'
    )
  );

-- L'admin authentifié consulte les statistiques (Jalon 6).
create policy "admin lit les evenements"
  on evenements for select
  to authenticated
  using (true);
