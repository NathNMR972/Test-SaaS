import { redirect } from "next/navigation";
import { type NextRequest } from "next/server";
import { createClient } from "@/lib/supabase/server";

// Lien cliqué depuis l'email "connexion" envoyé par Supabase. Avec le
// modèle d'email par défaut (non modifiable sans SMTP personnalisé),
// Supabase vérifie le lien lui-même puis nous redirige ici avec un code
// à échanger contre une session (flux PKCE), plutôt qu'un jeton à vérifier
// nous-mêmes.
export async function GET(request: NextRequest) {
  const { searchParams } = request.nextUrl;
  const code = searchParams.get("code");
  const flowId = searchParams.get("sb_flow_id");

  if (code) {
    const supabase = await createClient();
    const { error } = await supabase.auth.exchangeCodeForSession(
      code,
      flowId ? { flowId } : undefined,
    );

    if (!error) {
      redirect("/dashboard");
    }

    // Détail temporaire affiché le temps de diagnostiquer (voir login/actions.ts).
    redirect(`/login?erreur=lien-invalide&detail=${encodeURIComponent(error.message)}`);
  }

  redirect("/login?erreur=lien-invalide&detail=parametres-manquants");
}
