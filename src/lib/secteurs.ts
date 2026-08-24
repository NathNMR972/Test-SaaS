export const SECTEURS = [
  {
    valeur: "restaurant",
    libelle: "Restaurant",
    phraseAccueil:
      "Merci d'être passé chez nous. Un avis Google nous aide à faire connaître la maison — ça prend dix secondes.",
  },
  {
    valeur: "salon",
    libelle: "Salon de coiffure & institut",
    phraseAccueil:
      "Merci pour votre visite. Un avis Google aide notre salon à se faire connaître, dix secondes suffisent.",
  },
  {
    valeur: "garage",
    libelle: "Garage automobile",
    phraseAccueil:
      "Merci de nous avoir fait confiance. Un avis Google aide d'autres automobilistes à trouver un garage sérieux.",
  },
  {
    valeur: "hotel",
    libelle: "Hôtel",
    phraseAccueil:
      "Merci pour votre séjour. Un avis Google aide de futurs voyageurs à choisir notre établissement en confiance.",
  },
  {
    valeur: "cabinet",
    libelle: "Cabinet (médical, dentaire…)",
    phraseAccueil:
      "Merci pour votre visite. Un avis Google aide d'autres patients à trouver un praticien de confiance.",
  },
  {
    valeur: "boutique",
    libelle: "Boutique / commerce",
    phraseAccueil:
      "Merci pour votre passage en boutique. Un avis Google aide d'autres clients à nous découvrir.",
  },
] as const;

export type Secteur = (typeof SECTEURS)[number]["valeur"];

const SECTEURS_VALIDES = new Set<string>(SECTEURS.map((s) => s.valeur));

export function secteurValide(valeur: string): valeur is Secteur {
  return SECTEURS_VALIDES.has(valeur);
}

export function libelleSecteur(secteur: string): string {
  return SECTEURS.find((s) => s.valeur === secteur)?.libelle ?? secteur;
}

export function phraseAccueilSecteur(secteur: string): string {
  return (
    SECTEURS.find((s) => s.valeur === secteur)?.phraseAccueil ??
    "Merci de votre visite. Un avis Google nous aide à nous faire connaître."
  );
}
