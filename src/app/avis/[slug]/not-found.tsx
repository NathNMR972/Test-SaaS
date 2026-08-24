export default function CommerceIntrouvable() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center gap-4 bg-nuit px-6 text-center text-ecume">
      <p className="font-mono text-sm uppercase tracking-wide text-soleil">
        5 Stars Review
      </p>
      <h1 className="font-[family-name:var(--font-affichage)] text-2xl">
        Cette page n&apos;existe pas.
      </h1>
      <p className="max-w-sm text-ecume/80">
        Le lien scanné ne correspond à aucun commerce actif. Vérifiez le QR
        code ou contactez directement l&apos;établissement.
      </p>
    </main>
  );
}
