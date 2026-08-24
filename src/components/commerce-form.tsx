"use client";

import { useState } from "react";
import { SECTEURS } from "@/lib/secteurs";
import { genererSlug } from "@/lib/slug";
import { assurerContrasteLisible } from "@/lib/contraste";
import { PagePubliquePreview } from "@/components/page-publique-preview";
import type { Commerce } from "@/types/commerce";

const COULEUR_DEFAUT = "#E6355C";

const MESSAGES_ERREUR: Record<string, string> = {
  "champs-invalides": "Merci de vérifier les champs — certains sont manquants ou mal formés.",
  "lien-google-invalide":
    "Ce lien ne ressemble pas à une fiche Google. Vérifie l'adresse copiée.",
  "enregistrement-echoue": "L'enregistrement a échoué. Réessaie dans un instant.",
  "logo-invalide": "Le logo n'a pas pu être enregistré (format ou taille non accepté).",
};

export function CommerceForm({
  action,
  commerce,
  erreur,
}: {
  action: (formData: FormData) => void;
  commerce?: Commerce;
  erreur?: string;
}) {
  const modification = Boolean(commerce);

  const [nom, setNom] = useState(commerce?.nom ?? "");
  const [slug, setSlug] = useState(commerce?.slug ?? "");
  const [slugModifieManuellement, setSlugModifieManuellement] = useState(false);
  const [secteur, setSecteur] = useState(commerce?.secteur ?? SECTEURS[0].valeur);
  const [couleur, setCouleur] = useState(commerce?.couleur_principale ?? COULEUR_DEFAUT);
  const [couleurCorrigee, setCouleurCorrigee] = useState(false);
  const [adresse, setAdresse] = useState(commerce?.adresse ?? "");
  const [googleUrl, setGoogleUrl] = useState(commerce?.google_avis_url ?? "");
  const [logoPreview, setLogoPreview] = useState<string | null>(commerce?.logo_url ?? null);

  function surChangementNom(valeur: string) {
    setNom(valeur);
    if (!modification && !slugModifieManuellement) {
      setSlug(genererSlug(valeur));
    }
  }

  function surChangementCouleur(valeur: string) {
    const { couleur: corrigee, corrigee: aCorrige } = assurerContrasteLisible(valeur);
    setCouleur(corrigee);
    setCouleurCorrigee(aCorrige);
  }

  function surChangementLogo(fichier: File | undefined) {
    if (fichier) {
      setLogoPreview(URL.createObjectURL(fichier));
    }
  }

  const messageErreur = erreur ? MESSAGES_ERREUR[erreur] : undefined;

  return (
    <div className="grid gap-10 lg:grid-cols-[1fr_auto]">
      <form action={action} className="flex max-w-lg flex-col gap-5">
        {modification && <input type="hidden" name="id" value={commerce!.id} />}

        <div className="flex flex-col gap-1">
          <label htmlFor="nom" className="text-sm text-encre/80">
            Nom du commerce
          </label>
          <input
            id="nom"
            name="nom"
            required
            maxLength={80}
            value={nom}
            onChange={(e) => surChangementNom(e.target.value)}
            className="rounded border border-encre/20 bg-ecume px-4 py-3 text-encre"
          />
        </div>

        <div className="flex flex-col gap-1">
          <label htmlFor="slug" className="text-sm text-encre/80">
            Identifiant d&apos;URL (avis/{"{"}slug{"}"})
          </label>
          {modification ? (
            <>
              <input
                disabled
                value={slug}
                className="rounded border border-encre/10 bg-papier-dim px-4 py-3 font-mono text-sm text-encre/60"
              />
              <p className="text-xs text-encre/60">
                Verrouillé : il est imprimé sur le QR code, il ne peut plus changer.
              </p>
            </>
          ) : (
            <>
              <input
                id="slug"
                name="slug"
                required
                maxLength={60}
                value={slug}
                onChange={(e) => {
                  setSlugModifieManuellement(true);
                  setSlug(genererSlug(e.target.value));
                }}
                className="rounded border border-encre/20 bg-ecume px-4 py-3 font-mono text-sm text-encre"
              />
              <p className="text-xs text-encre/60">
                Modifiable uniquement maintenant. Une fois le commerce créé, il sera
                verrouillé définitivement (il sera imprimé sur le QR code).
              </p>
            </>
          )}
        </div>

        <div className="flex flex-col gap-1">
          <label htmlFor="secteur" className="text-sm text-encre/80">
            Secteur d&apos;activité
          </label>
          <select
            id="secteur"
            name="secteur"
            value={secteur}
            onChange={(e) => setSecteur(e.target.value as typeof secteur)}
            className="rounded border border-encre/20 bg-ecume px-4 py-3 text-encre"
          >
            {SECTEURS.map((s) => (
              <option key={s.valeur} value={s.valeur}>
                {s.libelle}
              </option>
            ))}
          </select>
        </div>

        <div className="flex flex-col gap-1">
          <label htmlFor="couleur" className="text-sm text-encre/80">
            Couleur principale
          </label>
          <div className="flex items-center gap-3">
            <input
              id="couleur"
              name="couleur_principale"
              type="color"
              value={couleur}
              onChange={(e) => surChangementCouleur(e.target.value)}
              className="h-11 w-14 rounded border border-encre/20 bg-ecume"
            />
            <span className="font-mono text-sm text-encre/70">{couleur}</span>
          </div>
          {couleurCorrigee && (
            <p className="text-xs text-piment-texte">
              Couleur assombrie automatiquement pour rester lisible avec du texte blanc.
            </p>
          )}
        </div>

        <div className="flex flex-col gap-1">
          <label htmlFor="logo" className="text-sm text-encre/80">
            Logo (PNG, JPEG ou WebP, 2 Mo max — facultatif)
          </label>
          <input
            id="logo"
            name="logo"
            type="file"
            accept="image/png,image/jpeg,image/webp"
            onChange={(e) => surChangementLogo(e.target.files?.[0])}
            className="text-sm text-encre/80"
          />
        </div>

        <div className="flex flex-col gap-1">
          <label htmlFor="adresse" className="text-sm text-encre/80">
            Adresse (facultatif)
          </label>
          <input
            id="adresse"
            name="adresse"
            value={adresse}
            onChange={(e) => setAdresse(e.target.value)}
            className="rounded border border-encre/20 bg-ecume px-4 py-3 text-encre"
          />
        </div>

        <div className="flex flex-col gap-1">
          <label htmlFor="google_avis_url" className="text-sm text-encre/80">
            Lien de la fiche Google (facultatif pour l&apos;instant)
          </label>
          <input
            id="google_avis_url"
            name="google_avis_url"
            type="url"
            placeholder="https://g.page/r/..."
            value={googleUrl}
            onChange={(e) => setGoogleUrl(e.target.value)}
            className="rounded border border-encre/20 bg-ecume px-4 py-3 text-encre"
          />
          <p className="text-xs text-encre/60">
            Sur la fiche Google du commerce, bouton « Demander des avis » → copier le
            lien. Sans ce lien, la page publique ne pourra pas encore rediriger vers
            Google — tu pourras l&apos;ajouter plus tard, à tout moment, sans rien
            réimprimer.
          </p>
        </div>

        {messageErreur && <p className="text-sm text-piment-texte">{messageErreur}</p>}

        <button
          type="submit"
          className="mt-2 rounded bg-nuit px-4 py-3 font-medium text-ecume"
        >
          {modification ? "Enregistrer les modifications" : "Créer le commerce"}
        </button>
      </form>

      <div className="flex flex-col items-center gap-2">
        <p className="font-mono text-xs uppercase tracking-wide text-encre/50">
          Aperçu de la page publique
        </p>
        <PagePubliquePreview
          nom={nom}
          secteur={secteur}
          couleurPrincipale={couleur}
          logoUrl={logoPreview}
        />
      </div>
    </div>
  );
}
