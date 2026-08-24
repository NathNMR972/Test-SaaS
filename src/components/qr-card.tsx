export function QrCard({ commerceId, slug }: { commerceId: string; slug: string }) {
  const urlSvg = `/api/commerces/${commerceId}/qr-svg`;
  const urlPng = `/api/commerces/${commerceId}/qr-png`;

  return (
    <div className="w-full max-w-xs rounded-lg border border-encre/15 bg-ecume p-4">
      <p className="font-mono text-xs uppercase tracking-wide text-encre/50">
        QR code
      </p>
      {/* eslint-disable-next-line @next/next/no-img-element -- aperçu d'un fichier généré par notre API, pas un asset statique */}
      <img
        src={urlSvg}
        alt={`QR code vers la page publique de ${slug}`}
        className="mt-3 h-40 w-40"
      />
      <p className="mt-3 font-mono text-xs text-encre/60">avis/{slug}</p>
      <div className="mt-3 flex gap-4 text-sm">
        <a href={urlSvg} download={`${slug}-qr.svg`} className="underline">
          Télécharger en SVG
        </a>
        <a href={urlPng} download={`${slug}-qr.png`} className="underline">
          Télécharger en PNG
        </a>
      </div>
      <p className="mt-2 text-xs text-encre/50">
        SVG pour l&apos;impression professionnelle, PNG haute résolution pour
        les autres usages.
      </p>
    </div>
  );
}
