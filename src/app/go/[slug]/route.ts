import { redirect } from "next/navigation";
import { after } from "next/server";
import { createClient } from "@/lib/supabase/server";

// Le QR code n'encode jamais l'URL Google directement : il pointe vers
// /avis/[slug], dont le bouton pointe ici. On lit google_avis_url en base à
// chaque requête, donc changer la destination ne demande aucune réimpression.
export async function GET(
  _request: Request,
  { params }: RouteContext<"/go/[slug]">,
) {
  const { slug } = await params;

  const supabase = await createClient();
  const { data: commerce } = await supabase
    .from("commerces")
    .select("id, google_avis_url")
    .eq("slug", slug)
    .eq("statut", "actif")
    .single();

  if (!commerce?.google_avis_url) {
    redirect(`/avis/${slug}`);
  }

  after(async () => {
    await supabase
      .from("evenements")
      .insert({ commerce_id: commerce.id, type: "clic_google" });
  });

  redirect(commerce.google_avis_url);
}
