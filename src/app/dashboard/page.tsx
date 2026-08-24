import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { libelleSecteur } from "@/lib/secteurs";
import type { Commerce } from "@/types/commerce";

export default async function DashboardPage() {
  const supabase = await createClient();
  const { data: commerces } = await supabase
    .from("commerces")
    .select("*")
    .order("created_at", { ascending: false })
    .returns<Commerce[]>();

  const liste = commerces ?? [];

  return (
    <div>
      <div className="flex items-center justify-between gap-4">
        <h1 className="font-[family-name:var(--font-affichage)] text-2xl text-nuit">
          Commerces
        </h1>
        <Link
          href="/dashboard/nouveau"
          className="rounded bg-nuit px-4 py-2 text-sm font-medium text-ecume"
        >
          Nouveau commerce
        </Link>
      </div>

      {liste.length === 0 ? (
        <div className="mt-10 max-w-md rounded border border-dashed border-encre/25 p-8 text-center">
          <p className="text-encre/80">Aucun commerce pour l&apos;instant.</p>
          <p className="mt-2 text-sm text-encre/60">
            Crée le premier commerce pour générer sa page publique et son QR code.
          </p>
          <Link
            href="/dashboard/nouveau"
            className="mt-4 inline-block rounded bg-nuit px-4 py-2 text-sm font-medium text-ecume"
          >
            Créer un commerce
          </Link>
        </div>
      ) : (
        <ul className="mt-8 flex flex-col divide-y divide-encre/10 border-y border-encre/10">
          {liste.map((commerce) => (
            <li
              key={commerce.id}
              className="flex items-center justify-between gap-4 py-4"
            >
              <div>
                <p className="font-medium text-nuit">
                  {commerce.nom}
                  {commerce.statut === "archive" && (
                    <span className="ml-2 font-mono text-xs uppercase text-encre/50">
                      archivé
                    </span>
                  )}
                </p>
                <p className="font-mono text-xs text-encre/60">
                  avis/{commerce.slug} · {libelleSecteur(commerce.secteur)}
                </p>
                {!commerce.google_avis_url && (
                  <p className="mt-1 text-xs text-piment-texte">
                    Lien Google manquant — la page publique ne peut pas
                    encore rediriger.
                  </p>
                )}
              </div>
              <Link
                href={`/dashboard/${commerce.id}/modifier`}
                className="text-sm underline"
              >
                Modifier
              </Link>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
