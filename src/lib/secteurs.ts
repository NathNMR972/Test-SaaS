export const SECTEURS = [
  { valeur: "restaurant", libelle: "Restaurant" },
  { valeur: "salon", libelle: "Salon de coiffure & institut" },
  { valeur: "garage", libelle: "Garage automobile" },
  { valeur: "hotel", libelle: "Hôtel" },
  { valeur: "cabinet", libelle: "Cabinet (médical, dentaire…)" },
  { valeur: "boutique", libelle: "Boutique / commerce" },
] as const;

export type Secteur = (typeof SECTEURS)[number]["valeur"];

const SECTEURS_VALIDES = new Set<string>(SECTEURS.map((s) => s.valeur));

export function secteurValide(valeur: string): valeur is Secteur {
  return SECTEURS_VALIDES.has(valeur);
}

export function libelleSecteur(secteur: string): string {
  return SECTEURS.find((s) => s.valeur === secteur)?.libelle ?? secteur;
}
