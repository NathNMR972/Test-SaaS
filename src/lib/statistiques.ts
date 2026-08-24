import type { SupabaseClient } from "@supabase/supabase-js";

export type PointJournalier = { date: string; scans: number; clics: number };

export type Statistiques = {
  totalScans: number;
  totalClics: number;
  tauxClic: number | null; // clics / scans en %, null si aucun scan
  parJour: PointJournalier[]; // 30 derniers jours, ordre chronologique
};

const NB_JOURS = 30;

// On ne sait pas combien de visiteurs laissent réellement un avis après
// avoir cliqué — Google ne le communique pas. Voir l'avertissement affiché
// sur l'écran des statistiques (CLAUDE.md, "Statistiques").
export async function chargerStatistiques(
  supabase: SupabaseClient,
  commerceId: string,
): Promise<Statistiques> {
  const depuis = new Date();
  depuis.setDate(depuis.getDate() - (NB_JOURS - 1));
  depuis.setHours(0, 0, 0, 0);

  const [{ count: totalScans }, { count: totalClics }, { data: evenementsRecents }] =
    await Promise.all([
      supabase
        .from("evenements")
        .select("*", { count: "exact", head: true })
        .eq("commerce_id", commerceId)
        .eq("type", "visite_page"),
      supabase
        .from("evenements")
        .select("*", { count: "exact", head: true })
        .eq("commerce_id", commerceId)
        .eq("type", "clic_google"),
      supabase
        .from("evenements")
        .select("type, created_at")
        .eq("commerce_id", commerceId)
        .gte("created_at", depuis.toISOString()),
    ]);

  const parJour: PointJournalier[] = Array.from({ length: NB_JOURS }, (_, i) => {
    const jour = new Date(depuis);
    jour.setDate(jour.getDate() + i);
    return { date: jour.toISOString().slice(0, 10), scans: 0, clics: 0 };
  });

  const index = new Map(parJour.map((point) => [point.date, point]));
  for (const evenement of evenementsRecents ?? []) {
    const point = index.get(String(evenement.created_at).slice(0, 10));
    if (!point) continue;
    if (evenement.type === "visite_page") point.scans += 1;
    else point.clics += 1;
  }

  return {
    totalScans: totalScans ?? 0,
    totalClics: totalClics ?? 0,
    tauxClic:
      totalScans && totalScans > 0
        ? Math.round(((totalClics ?? 0) / totalScans) * 100)
        : null,
    parJour,
  };
}
