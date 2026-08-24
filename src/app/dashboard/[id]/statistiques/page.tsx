import { notFound } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { chargerStatistiques } from "@/lib/statistiques";
import { StatsPanel } from "@/components/stats-panel";

export default async function StatistiquesPage(
  props: PageProps<"/dashboard/[id]/statistiques">,
) {
  const { id } = await props.params;
  const supabase = await createClient();

  const { data: commerce } = await supabase
    .from("commerces")
    .select("nom")
    .eq("id", id)
    .single();

  if (!commerce) {
    notFound();
  }

  const stats = await chargerStatistiques(supabase, id);
  const maxValeur = Math.max(
    1,
    ...stats.parJour.flatMap((point) => [point.scans, point.clics]),
  );
  const hauteurBarre = 96;

  return (
    <div>
      <h1 className="font-[family-name:var(--font-affichage)] text-2xl text-nuit">
        Statistiques — {commerce.nom}
      </h1>
      <p className="mt-1 text-sm text-encre/70">Les 30 derniers jours.</p>

      <div className="mt-8">
        <StatsPanel stats={stats} />
      </div>

      <div className="mt-10 overflow-x-auto">
        <div
          className="flex items-end gap-1.5"
          style={{ minWidth: `${stats.parJour.length * 14}px` }}
        >
          {stats.parJour.map((point) => (
            <div
              key={point.date}
              title={`${point.date} : ${point.scans} scan(s), ${point.clics} clic(s)`}
              className="flex items-end gap-0.5"
              style={{ height: `${hauteurBarre}px` }}
            >
              <div
                className="w-1.5 rounded-t bg-nuit"
                style={{ height: `${(point.scans / maxValeur) * hauteurBarre}px` }}
              />
              <div
                className="w-1.5 rounded-t bg-piment"
                style={{ height: `${(point.clics / maxValeur) * hauteurBarre}px` }}
              />
            </div>
          ))}
        </div>
        <div className="mt-3 flex items-center gap-4 text-xs text-encre/60">
          <span className="flex items-center gap-1.5">
            <span className="h-2 w-2 rounded-full bg-nuit" /> Scans
          </span>
          <span className="flex items-center gap-1.5">
            <span className="h-2 w-2 rounded-full bg-piment" /> Clics vers Google
          </span>
        </div>
      </div>

      <div className="mt-10 max-w-lg rounded border border-encre/15 bg-papier-dim p-4 text-sm text-encre/80">
        <p className="font-medium text-encre">
          Ce que ces chiffres mesurent — et ce qu&apos;ils ne mesurent pas
        </p>
        <p className="mt-2">
          Un « scan » est une ouverture de la page publique du commerce. Un
          « clic » est un passage vers la vraie fiche Google.
        </p>
        <p className="mt-2">
          Ce que nous <strong>ne savons pas</strong> : combien de ces clics se
          sont transformés en avis réellement publiés — Google ne nous
          communique pas cette information. Le taux de clic mesure
          l&apos;intérêt suscité, pas le nombre d&apos;avis laissés.
        </p>
      </div>
    </div>
  );
}
