"use server";

import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";

export async function demanderLienConnexion(formData: FormData) {
  const email = String(formData.get("email") ?? "").trim();

  if (!email) {
    redirect("/login?erreur=email-manquant");
  }

  const origin = (await headers()).get("origin");
  const supabase = await createClient();

  const { error } = await supabase.auth.signInWithOtp({
    email,
    options: {
      // Un seul compte admin : jamais de création de compte à la volée.
      shouldCreateUser: false,
      emailRedirectTo: `${origin}/auth/confirm`,
    },
  });

  if (error) {
    // Message brut affiché temporairement le temps de diagnostiquer la mise
    // en route (voir Jalon 2 dans CLAUDE.md) — à retirer une fois validé.
    redirect(`/login?erreur=envoi-echoue&detail=${encodeURIComponent(error.message)}`);
  }

  redirect("/login?envoye=1");
}
