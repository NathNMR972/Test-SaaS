import { notFound } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { CommerceForm } from "@/components/commerce-form";
import type { Commerce } from "@/types/commerce";
import { modifierCommerce, basculerArchivage } from "./actions";

export default async function ModifierCommercePage(
  props: PageProps<"/dashboard/[id]/modifier">,
) {
  const { id } = await props.params;
  const { erreur } = await props.searchParams;

  const supabase = await createClient();
  const { data: commerce } = await supabase
    .from("commerces")
    .select("*")
    .eq("id", id)
    .single<Commerce>();

  if (!commerce) {
    notFound();
  }

  return (
    <div>
      <div className="flex items-start justify-between gap-4">
        <div>
          <h1 className="font-[family-name:var(--font-affichage)] text-2xl text-nuit">
            Modifier {commerce.nom}
          </h1>
          <p className="mt-1 text-sm text-encre/70">
            avis/{commerce.slug} · statut :{" "}
            {commerce.statut === "actif" ? "actif" : "archivé"}
          </p>
        </div>
        <form action={basculerArchivage}>
          <input type="hidden" name="id" value={commerce.id} />
          <input type="hidden" name="statut_actuel" value={commerce.statut} />
          <button
            type="submit"
            className="rounded border border-encre/20 px-3 py-2 text-sm text-encre/80"
          >
            {commerce.statut === "actif" ? "Archiver" : "Réactiver"}
          </button>
        </form>
      </div>

      <div className="mt-8">
        <CommerceForm
          action={modifierCommerce}
          commerce={commerce}
          erreur={typeof erreur === "string" ? erreur : undefined}
        />
      </div>
    </div>
  );
}
