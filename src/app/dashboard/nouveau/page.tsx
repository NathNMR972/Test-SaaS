import { CommerceForm } from "@/components/commerce-form";
import { creerCommerce } from "./actions";

export default async function NouveauCommercePage(
  props: PageProps<"/dashboard/nouveau">,
) {
  const { erreur } = await props.searchParams;

  return (
    <div>
      <h1 className="font-[family-name:var(--font-affichage)] text-2xl text-nuit">
        Nouveau commerce
      </h1>
      <p className="mt-1 max-w-lg text-sm text-encre/70">
        L&apos;identifiant d&apos;URL se propose automatiquement à partir du nom.
        Une fois le commerce créé, il ne pourra plus changer.
      </p>
      <div className="mt-8">
        <CommerceForm
          action={creerCommerce}
          erreur={typeof erreur === "string" ? erreur : undefined}
        />
      </div>
    </div>
  );
}
