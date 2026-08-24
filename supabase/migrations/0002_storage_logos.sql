-- Bucket public pour les logos des commerces. Public en lecture (affiché
-- sur la page publique et dans le tableau de bord), écriture réservée à
-- l'admin authentifié. Le type et la taille des fichiers sont vérifiés côté
-- application (voir src/lib/logo.ts), pas ici.

insert into storage.buckets (id, name, public)
values ('logos', 'logos', true)
on conflict (id) do nothing;

create policy "public lit les logos"
  on storage.objects for select
  to anon
  using (bucket_id = 'logos');

create policy "admin gere les logos"
  on storage.objects for all
  to authenticated
  using (bucket_id = 'logos')
  with check (bucket_id = 'logos');
