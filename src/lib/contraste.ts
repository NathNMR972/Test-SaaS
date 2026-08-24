// Vérifie que la couleur choisie reste lisible avec du texte blanc dessus
// (boutons, bandeaux) et l'assombrit automatiquement si besoin — voir la
// section "Créer ou modifier un commerce" de CLAUDE.md.

type RGB = [number, number, number];

function hexVersRgb(hex: string): RGB {
  const h = hex.replace("#", "");
  return [
    parseInt(h.slice(0, 2), 16),
    parseInt(h.slice(2, 4), 16),
    parseInt(h.slice(4, 6), 16),
  ];
}

function rgbVersHex([r, g, b]: RGB): string {
  const c = (v: number) =>
    Math.max(0, Math.min(255, Math.round(v)))
      .toString(16)
      .padStart(2, "0");
  return `#${c(r)}${c(g)}${c(b)}`;
}

function luminanceRelative([r, g, b]: RGB): number {
  const composante = (v: number) => {
    const c = v / 255;
    return c <= 0.03928 ? c / 12.92 : Math.pow((c + 0.055) / 1.055, 2.4);
  };
  return (
    0.2126 * composante(r) + 0.7152 * composante(g) + 0.0722 * composante(b)
  );
}

function contrasteAvecBlanc(rgb: RGB): number {
  return (1 + 0.05) / (luminanceRelative(rgb) + 0.05);
}

// Seuil WCAG pour un composant d'interface (bouton, bandeau) : 3:1.
const SEUIL_LISIBLE = 3;

export function assurerContrasteLisible(hex: string): {
  couleur: string;
  corrigee: boolean;
} {
  let rgb = hexVersRgb(hex);
  let corrigee = false;
  let iterations = 0;

  while (
    contrasteAvecBlanc(rgb) < SEUIL_LISIBLE &&
    rgb.some((v) => v > 0) &&
    iterations < 40
  ) {
    rgb = rgb.map((v) => v * 0.9) as RGB;
    corrigee = true;
    iterations += 1;
  }

  return { couleur: rgbVersHex(rgb), corrigee };
}
