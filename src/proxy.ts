import { createServerClient } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";

// Next.js 16 : ce fichier remplace middleware.ts (renommé "proxy"), même API.
//
// Rôle : vérification optimiste + rafraîchissement de la session Supabase à
// chaque requête. La vérification définitive (obligatoire) a lieu dans
// src/app/dashboard/layout.tsx via supabase.auth.getUser() côté serveur —
// voir la mise en garde Next.js : le proxy ne doit pas être la seule
// protection d'une route.
export async function proxy(request: NextRequest) {
  let response = NextResponse.next({ request });

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll();
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value }) =>
            request.cookies.set(name, value),
          );
          response = NextResponse.next({ request });
          cookiesToSet.forEach(({ name, value, options }) =>
            response.cookies.set(name, value, options),
          );
        },
      },
    },
  );

  const {
    data: { user },
  } = await supabase.auth.getUser();

  const path = request.nextUrl.pathname;

  if (!user && path.startsWith("/dashboard")) {
    const url = request.nextUrl.clone();
    url.pathname = "/login";
    return NextResponse.redirect(url);
  }

  if (user && path === "/login") {
    const url = request.nextUrl.clone();
    url.pathname = "/dashboard";
    return NextResponse.redirect(url);
  }

  return response;
}

// Limité aux routes qui dépendent de la session : les pages publiques
// (/avis/[slug], /go/[slug]) n'ont pas besoin de cette vérification et
// doivent rester aussi rapides que possible.
export const config = {
  matcher: ["/dashboard/:path*", "/login"],
};
