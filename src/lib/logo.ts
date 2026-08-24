import type { SupabaseClient } from "@supabase/supabase-js";

const TYPES_ACCEPTES: Record<string, string> = {
  "image/png": "png",
  "image/jpeg": "jpg",
  "image/webp": "webp",
};

const TAILLE_MAX_OCTETS = 2 * 1024 * 1024; // 2 Mo

export class ErreurLogo extends Error {}

// Téléverse le logo dans le bucket "logos" et renvoie son URL publique.
// Type et taille revérifiés ici (jamais faire confiance au seul contrôle
// côté navigateur) — voir CLAUDE.md, règle "logos".
export async function televerserLogo(
  supabase: SupabaseClient,
  slug: string,
  fichier: File,
): Promise<string> {
  const extension = TYPES_ACCEPTES[fichier.type];
  if (!extension) {
    throw new ErreurLogo(
      "Format de logo non accepté. Utilise un PNG, JPEG ou WebP.",
    );
  }
  if (fichier.size > TAILLE_MAX_OCTETS) {
    throw new ErreurLogo("Le logo dépasse 2 Mo.");
  }

  const chemin = `${slug}/${Date.now()}.${extension}`;
  const { error } = await supabase.storage
    .from("logos")
    .upload(chemin, fichier, { contentType: fichier.type, upsert: true });

  if (error) {
    throw new ErreurLogo("Le téléversement du logo a échoué.");
  }

  return supabase.storage.from("logos").getPublicUrl(chemin).data.publicUrl;
}
