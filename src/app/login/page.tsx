import { demanderLienConnexion } from "./actions";

const MESSAGES_ERREUR: Record<string, string> = {
  "email-manquant": "Merci d'indiquer une adresse email.",
  "envoi-echoue": "L'envoi a échoué. Réessaie dans un instant.",
  "lien-invalide":
    "Le lien a expiré ou est invalide. Redemande un lien de connexion.",
};

export default async function LoginPage(props: PageProps<"/login">) {
  const { envoye, erreur, detail } = await props.searchParams;
  const messageErreur =
    typeof erreur === "string" ? MESSAGES_ERREUR[erreur] : undefined;
  const detailErreur = typeof detail === "string" ? detail : undefined;

  return (
    <main className="flex min-h-screen flex-col items-center justify-center gap-8 px-6 py-16">
      <svg
        className="h-20 w-20 text-nuit"
        viewBox="-60 -60 120 120"
        aria-hidden="true"
      >
        <circle
          cx="0"
          cy="0"
          r="53"
          fill="none"
          stroke="currentColor"
          strokeWidth="4.5"
        />
        <circle
          cx="0"
          cy="0"
          r="44"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.4"
          opacity="0.55"
        />
        <path
          fill="currentColor"
          d="M 0.0,-46.6 L 9.9,-13.7 L 44.6,-14.5 L 16.7,5.4 L 26.3,36.2 L 0.0,19.0 L -27.3,37.5 L -16.4,5.3 L -44.8,-14.6 L -10.2,-14.1 Z"
        />
      </svg>

      <div className="text-center">
        <p className="font-mono text-sm uppercase tracking-wide text-piment-texte">
          5 Stars Review
        </p>
        <h1 className="font-[family-name:var(--font-affichage)] text-2xl text-nuit">
          Connexion
        </h1>
      </div>

      {envoye === "1" ? (
        <p className="max-w-sm text-center text-encre">
          Lien envoyé. Ouvre ta boîte mail et clique sur le lien reçu pour te
          connecter.
        </p>
      ) : (
        <form
          action={demanderLienConnexion}
          className="flex w-full max-w-sm flex-col gap-3"
        >
          <label htmlFor="email" className="text-sm text-encre/80">
            Adresse email
          </label>
          <input
            id="email"
            name="email"
            type="email"
            required
            autoComplete="email"
            className="rounded border border-encre/20 bg-ecume px-4 py-3 text-encre"
          />
          {messageErreur && (
            <p className="text-sm text-piment-texte">{messageErreur}</p>
          )}
          {detailErreur && (
            <p className="font-mono text-xs text-encre/60">{detailErreur}</p>
          )}
          <button
            type="submit"
            className="rounded bg-nuit px-4 py-3 font-medium text-ecume"
          >
            Envoyer le lien de connexion
          </button>
        </form>
      )}
    </main>
  );
}
