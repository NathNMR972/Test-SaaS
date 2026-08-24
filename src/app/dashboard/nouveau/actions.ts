"use server";

import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { genererSlug, slugValide } from "@/lib/slug";
import { secteurValide } from "@/lib/secteurs";
import { assurerContrasteLisible } from "@/lib/contraste";
import { lienGoogleValide } from "@/lib/google-url";
import { televerserLogo, ErreurLogo } from "@/lib/logo";

export async function creerCommerce(formData: FormData) {
  const nom = String(formData.get("nom") ?? "").trim();
  const slugSaisi = String(formData.get("slug") ?? "").trim();
  const secteur = String(formData.get("secteur") ?? "");
  const couleurSaisie = String(formData.get("couleur_principale") ?? "");
  const adresse = String(formData.get("adresse") ?? "").trim() || null;
  const googleUrlSaisie = String(formData.get("google_avis_url") ?? "").trim();
  const logo = formData.get("logo");

  const slug = genererSlug(slugSaisi || nom);

  if (!nom || !slugValide(slug) || !secteurValide(secteur) || !couleurSaisie) {
    redirect("/dashboard/nouveau?erreur=champs-invalides");
  }

  if (googleUrlSaisie && !lienGoogleValide(googleUrlSaisie)) {
    redirect("/dashboard/nouveau?erreur=lien-google-invalide");
  }

  const { couleur } = assurerContrasteLisible(couleurSaisie);
  const supabase = await createClient();

  let logoUrl: string | null = null;
  if (logo instanceof File && logo.size > 0) {
    try {
      logoUrl = await televerserLogo(supabase, slug, logo);
    } catch (erreur) {
      if (erreur instanceof ErreurLogo) {
        redirect("/dashboard/nouveau?erreur=logo-invalide");
      }
      throw erreur;
    }
  }

  const { error } = await supabase.from("commerces").insert({
    nom,
    slug,
    secteur,
    couleur_principale: couleur,
    adresse,
    google_avis_url: googleUrlSaisie || null,
    logo_url: logoUrl,
  });

  if (error) {
    redirect("/dashboard/nouveau?erreur=enregistrement-echoue");
  }

  redirect("/dashboard");
}
