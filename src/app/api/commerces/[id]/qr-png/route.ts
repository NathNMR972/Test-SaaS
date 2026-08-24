import { NextResponse, type NextRequest } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { commercePourQr } from "@/lib/qr-commerce";
import { genererQrPng } from "@/lib/qr";

export async function GET(
  request: NextRequest,
  { params }: RouteContext<"/api/commerces/[id]/qr-png">,
) {
  const { id } = await params;
  const supabase = await createClient();
  const resultat = await commercePourQr(supabase, id);

  if ("erreur" in resultat) {
    return new NextResponse(null, { status: resultat.erreur });
  }

  const png = await genererQrPng(
    `${request.nextUrl.origin}/avis/${resultat.slug}`,
  );

  return new NextResponse(new Uint8Array(png), {
    headers: {
      "Content-Type": "image/png",
      "Content-Disposition": `attachment; filename="${resultat.slug}-qr.png"`,
      "Cache-Control": "private, no-store",
    },
  });
}
