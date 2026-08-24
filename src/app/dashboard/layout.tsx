import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { seDeconnecter } from "./actions";

// Vérification réelle de la session (le proxy ne fait qu'une vérification
// optimiste). Next.js recommande de ne jamais se fier uniquement au proxy
// pour protéger une route.
export default async function DashboardLayout({
  children,
}: LayoutProps<"/dashboard">) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  return (
    <div className="min-h-screen">
      <header className="flex items-center justify-between border-b border-encre/10 px-6 py-4">
        <span className="font-mono text-sm uppercase tracking-wide text-piment-texte">
          5 Stars Review — Administration
        </span>
        <form action={seDeconnecter} className="flex items-center gap-4">
          <span className="text-sm text-encre/70">{user.email}</span>
          <button type="submit" className="text-sm underline">
            Se déconnecter
          </button>
        </form>
      </header>
      <main className="px-6 py-10">{children}</main>
    </div>
  );
}
