const SLUG_VALIDE = /^[a-z0-9]+(-[a-z0-9]+)*$/;
const MARQUES_ACCENT = /[̀-ͯ]/g;

// Identifiant d'URL : lisible, stable, sans accent ni caractère spécial.
export function genererSlug(texte: string): string {
  return texte
    .normalize("NFD")
    .replace(MARQUES_ACCENT, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 60);
}

export function slugValide(slug: string): boolean {
  return slug.length > 0 && slug.length <= 60 && SLUG_VALIDE.test(slug);
}
