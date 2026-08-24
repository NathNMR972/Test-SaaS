import { NextResponse, type NextRequest } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { commercePourQr } from "@/lib/qr-commerce";
import { genererQrSvg } from "@/lib/qr";

export async function GET(
  request: NextRequest,
  { params }: RouteContext<"/api/commerces/[id]/qr-svg">,
) {
  const { id } = await params;
  const supabase = await createClient();
  const resultat = await commercePourQr(supabase, id);

  if ("erreur" in resultat) {
    return new NextResponse(null, { status: resultat.erreur });
  }

  const svg = await genererQrSvg(
    `${request.nextUrl.origin}/avis/${resultat.slug}`,
  );

  return new NextResponse(svg, {
    headers: {
      "Content-Type": "image/svg+xml",
      "Content-Disposition": `attachment; filename="${resultat.slug}-qr.svg"`,
      "Cache-Control": "private, no-store",
    },
  });
}
