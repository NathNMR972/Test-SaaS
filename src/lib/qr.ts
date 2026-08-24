import QRCode from "qrcode";

// Niveau de correction d'erreur élevé : le QR reste lisible même sali,
// plié ou légèrement abîmé une fois imprimé (chevalet, autocollant).
const OPTIONS = { errorCorrectionLevel: "H" as const, margin: 2 };

export function genererQrSvg(texte: string): Promise<string> {
  return QRCode.toString(texte, { ...OPTIONS, type: "svg" });
}

// 1024 px : qualité imprimable (chevalet, autocollant) sans être trop lourd
// à télécharger sur une connexion mobile moyenne.
export function genererQrPng(texte: string, largeur = 1024): Promise<Buffer> {
  return QRCode.toBuffer(texte, { ...OPTIONS, type: "png", width: largeur });
}
