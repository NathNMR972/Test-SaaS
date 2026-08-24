import type { Secteur } from "@/lib/secteurs";

// Tracés repris tels quels du site vitrine (dépôt Test-Claude-Code,
// assets/css + index.html) pour rester cohérent visuellement entre les deux.
export function IconeSecteur({
  secteur,
  className,
}: {
  secteur: Secteur;
  className?: string;
}) {
  const trait = {
    fill: "none",
    stroke: "currentColor",
    strokeWidth: 1.75,
    strokeLinecap: "round" as const,
    strokeLinejoin: "round" as const,
  };

  switch (secteur) {
    case "restaurant":
      return (
        <svg viewBox="0 0 24 24" className={className} aria-hidden="true">
          <path {...trait} d="M6 3v6a2 2 0 0 0 2 2v10M6 3v6M9 3v6" />
          <path
            {...trait}
            d="M16.5 3c-1.7 0-3 1.8-3 4.2s1.3 4.2 3 4.2V21"
          />
        </svg>
      );
    case "salon":
      return (
        <svg viewBox="0 0 24 24" className={className} aria-hidden="true">
          <circle
            cx="6.2"
            cy="6.2"
            r="2.4"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.75"
          />
          <circle
            cx="6.2"
            cy="17.8"
            r="2.4"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.75"
          />
          <path
            fill="none"
            stroke="currentColor"
            strokeWidth="1.75"
            strokeLinecap="round"
            d="M8.2 7.7 20 19.5M8.2 16.3 20 4.5"
          />
        </svg>
      );
    case "garage":
      return (
        <svg viewBox="0 0 24 24" className={className} aria-hidden="true">
          <path
            {...trait}
            d="M14.7 6.3a4 4 0 0 0-5.6 5.1L4 16.5 7.5 20l5-5.1a4 4 0 0 0 5.1-5.6l-2.7 2.7-2-2 2.8-2.7Z"
          />
        </svg>
      );
    case "hotel":
      return (
        <svg viewBox="0 0 24 24" className={className} aria-hidden="true">
          <path
            {...trait}
            d="M3 19v-7.2A1.8 1.8 0 0 1 4.8 10h4.4A1.8 1.8 0 0 1 11 11.8V14M3 19v2.2M3 19h18v2.2M11 14h8.2A1.8 1.8 0 0 1 21 15.8V19M7 10V7.8A1 1 0 0 1 8 6.8h1.8a1 1 0 0 1 1 1V10"
          />
        </svg>
      );
    case "cabinet":
      return (
        <svg viewBox="0 0 24 24" className={className} aria-hidden="true">
          <rect
            x="3"
            y="8.2"
            width="18"
            height="11"
            rx="2"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.75"
          />
          <path
            {...trait}
            d="M8.4 8.2V6.4a2 2 0 0 1 2-2h3.2a2 2 0 0 1 2 2v1.8M3 13.4h18"
          />
        </svg>
      );
    case "boutique":
      return (
        <svg viewBox="0 0 24 24" className={className} aria-hidden="true">
          <path
            {...trait}
            d="M6 8h12l-1.1 12.2a1 1 0 0 1-1 .8H8.1a1 1 0 0 1-1-.8L6 8Z"
          />
          <path
            fill="none"
            stroke="currentColor"
            strokeWidth="1.75"
            strokeLinecap="round"
            d="M9 8V6.2a3 3 0 0 1 6 0V8"
          />
        </svg>
      );
  }
}
