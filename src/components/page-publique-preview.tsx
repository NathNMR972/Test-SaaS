import { libelleSecteur } from "@/lib/secteurs";

// Aperçu simplifié de la page publique — réutilisé tel quel quand la vraie
// page /avis/[slug] sera construite (Jalon 4).
export function PagePubliquePreview({
  nom,
  secteur,
  couleurPrincipale,
  logoUrl,
}: {
  nom: string;
  secteur: string;
  couleurPrincipale: string;
  logoUrl?: string | null;
}) {
  return (
    <div className="w-full max-w-xs overflow-hidden rounded-lg border border-encre/15 bg-ecume">
      <div
        className="flex h-32 items-center justify-center"
        style={{ backgroundColor: couleurPrincipale }}
      >
        {logoUrl ? (
          // eslint-disable-next-line @next/next/no-img-element -- aperçu en direct, source dynamique (fichier local ou logo déjà en ligne)
          <img
            src={logoUrl}
            alt=""
            className="h-16 w-16 rounded-full object-cover"
          />
        ) : (
          <span className="text-3xl font-bold text-white">
            {nom.trim().charAt(0).toUpperCase() || "?"}
          </span>
        )}
      </div>
      <div className="p-4 text-center">
        <p className="font-mono text-xs uppercase tracking-wide text-encre/60">
          {libelleSecteur(secteur)}
        </p>
        <p className="mt-1 font-[family-name:var(--font-affichage)] text-lg text-nuit">
          {nom || "Nom du commerce"}
        </p>
        <div
          className="mt-3 rounded px-4 py-2 text-sm font-medium text-white"
          style={{ backgroundColor: couleurPrincipale }}
        >
          Voir mon avis Google
        </div>
      </div>
    </div>
  );
}
