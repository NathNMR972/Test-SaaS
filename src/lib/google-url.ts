// Valide qu'un lien ressemble bien à une fiche/avis Google (Maps, fiche
// d'établissement, lien court "Demander des avis"), sans appeler Google.

const HOTES_VALIDES = [
  "google.com",
  "maps.google.com",
  "maps.app.goo.gl",
  "g.page",
  "goo.gl",
  "g.co",
  "search.google.com",
];

export function lienGoogleValide(url: string): boolean {
  let hostname: string;
  try {
    hostname = new URL(url).hostname.toLowerCase();
  } catch {
    return false;
  }

  return HOTES_VALIDES.some(
    (hote) => hostname === hote || hostname.endsWith(`.${hote}`),
  );
}
