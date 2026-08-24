import type { SupabaseClient } from "@supabase/supabase-js";

type ResultatQr = { slug: string } | { erreur: 401 | 404 };

// Partagé par les deux routes de téléchargement de QR : l'admin doit être
// connecté (le proxy ne couvre pas /api, voir CLAUDE.md), et le commerce
// doit exister.
export async function commercePourQr(
  supabase: SupabaseClient,
  id: string,
): Promise<ResultatQr> {
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return { erreur: 401 };
  }

  const { data: commerce } = await supabase
    .from("commerces")
    .select("slug")
    .eq("id", id)
    .single();

  if (!commerce) {
    return { erreur: 404 };
  }

  return { slug: commerce.slug as string };
}
