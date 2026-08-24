import type { Secteur } from "@/lib/secteurs";

export type StatutCommerce = "actif" | "archive";

export type Commerce = {
  id: string;
  nom: string;
  slug: string;
  secteur: Secteur;
  logo_url: string | null;
  couleur_principale: string;
  adresse: string | null;
  google_avis_url: string | null;
  statut: StatutCommerce;
  created_at: string;
};
