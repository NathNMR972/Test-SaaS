"use server";

import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { secteurValide } from "@/lib/secteurs";
import { assurerContrasteLisible } from "@/lib/contraste";
import { lienGoogleValide } from "@/lib/google-url";
import { televerserLogo, ErreurLogo } from "@/lib/logo";

export async function modifierCommerce(formData: FormData) {
  const id = String(formData.get("id") ?? "");
  const nom = String(formData.get("nom") ?? "").trim();
  const secteur = String(formData.get("secteur") ?? "");
  const couleurSaisie = String(formData.get("couleur_principale") ?? "");
  const adresse = String(formData.get("adresse") ?? "").trim() || null;
  const googleUrlSaisie = String(formData.get("google_avis_url") ?? "").trim();
  const logo = formData.get("logo");

  if (!id || !nom || !secteurValide(secteur) || !couleurSaisie) {
    redirect(`/dashboard/${id}/modifier?erreur=champs-invalides`);
  }

  if (googleUrlSaisie && !lienGoogleValide(googleUrlSaisie)) {
    redirect(`/dashboard/${id}/modifier?erreur=lien-google-invalide`);
  }

  const { couleur } = assurerContrasteLisible(couleurSaisie);
  const supabase = await createClient();

  const donnees: Record<string, unknown> = {
    nom,
    secteur,
    couleur_principale: couleur,
    adresse,
    google_avis_url: googleUrlSaisie || null,
  };

  if (logo instanceof File && logo.size > 0) {
    const { data: commerceActuel } = await supabase
      .from("commerces")
      .select("slug")
      .eq("id", id)
      .single();

    try {
      donnees.logo_url = await televerserLogo(
        supabase,
        commerceActuel?.slug ?? id,
        logo,
      );
    } catch (erreur) {
      if (erreur instanceof ErreurLogo) {
        redirect(`/dashboard/${id}/modifier?erreur=logo-invalide`);
      }
      throw erreur;
    }
  }

  const { error } = await supabase
    .from("commerces")
    .update(donnees)
    .eq("id", id);

  if (error) {
    redirect(`/dashboard/${id}/modifier?erreur=enregistrement-echoue`);
  }

  redirect("/dashboard");
}

export async function basculerArchivage(formData: FormData) {
  const id = String(formData.get("id") ?? "");
  const statutActuel = String(formData.get("statut_actuel") ?? "");
  const nouveauStatut = statutActuel === "actif" ? "archive" : "actif";

  const supabase = await createClient();
  await supabase.from("commerces").update({ statut: nouveauStatut }).eq("id", id);

  redirect(`/dashboard/${id}/modifier`);
}
