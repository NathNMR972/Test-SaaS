import { notFound } from "next/navigation";
import { after } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { libelleSecteur, phraseAccueilSecteur, secteurValide } from "@/lib/secteurs";
import { IconeSecteur } from "@/components/icone-secteur";

export default async function PagePublique(props: PageProps<"/avis/[slug]">) {
  const { slug } = await props.params;

  const supabase = await createClient();
  const { data: commerce } = await supabase
    .from("commerces")
    .select("id, nom, secteur, logo_url, couleur_principale, google_avis_url")
    .eq("slug", slug)
    .eq("statut", "actif")
    .single();

  if (!commerce || !secteurValide(commerce.secteur)) {
    notFound();
  }

  after(async () => {
    await supabase
      .from("evenements")
      .insert({ commerce_id: commerce.id, type: "visite_page" });
  });

  return (
    <main
      className="flex min-h-screen flex-col items-center justify-center gap-6 px-6 py-16 text-center text-white"
      style={{ backgroundColor: commerce.couleur_principale }}
    >
      <div className="flex h-24 w-24 items-center justify-center rounded-full bg-white/15">
        {commerce.logo_url ? (
          // eslint-disable-next-line @next/next/no-img-element -- logo hébergé sur Supabase Storage, taille fixe
          <img
            src={commerce.logo_url}
            alt=""
            className="h-24 w-24 rounded-full object-cover"
          />
        ) : (
          <IconeSecteur secteur={commerce.secteur} className="h-10 w-10" />
        )}
      </div>

      <div>
        <p className="font-mono text-xs uppercase tracking-wide text-white/70">
          {libelleSecteur(commerce.secteur)}
        </p>
        <h1 className="mt-1 font-[family-name:var(--font-affichage)] text-3xl">
          {commerce.nom}
        </h1>
      </div>

      <p className="max-w-sm text-white/90">
        {phraseAccueilSecteur(commerce.secteur)}
      </p>

      {commerce.google_avis_url ? (
        <div className="mt-2 flex flex-col items-center gap-3">
          <a
            href={`/go/${slug}`}
            className="rounded-lg bg-white px-8 py-4 text-lg font-semibold shadow-lg"
            style={{ color: commerce.couleur_principale }}
          >
            Voir mon avis Google
          </a>
          <p className="font-mono text-xs text-white/70">
            Vous seriez redirigé vers la vraie fiche Google — jamais filtrée.
          </p>
        </div>
      ) : (
        <p className="mt-2 text-sm text-white/80">
          Cette page est en cours de préparation.
        </p>
      )}
    </main>
  );
}
