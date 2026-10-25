/**
 * Shettibalija Matrimony — Marketing & Editorial Couple Imagery
 *
 * ============================================================================
 * ARCHITECTURAL RULE — STRICT DISTINCTION
 * ============================================================================
 * This dataset contains WEBSITE CONTENT / BRAND MARKETING IMAGERY only.
 *
 * 1. These images represent fictional, dignified Indian/Telugu married couples
 *    communicating the emotional promise and destination of matrimonial service:
 *    - love, companionship, successful marriage, family, trust, and happiness.
 * 2. They are NEVER associated with any matrimonial member profile or user_id.
 * 3. They are NEVER stored in profile_photos, user_photos, or member_photos.
 * 4. They NEVER appear in /admin/members or individual member profile cards.
 * 5. Individual matrimonial members (e.g. Vemula Harika, Pilli Vamsi Krishna)
 *    only use their own private/approved individual member portraits.
 * ============================================================================
 */

export interface MarketingCoupleImage {
  id: string;
  src: string;
  alt: string;
  altTe: string;
  captionEn: string;
  captionTe: string;
  theme: "home" | "festive" | "walk" | "mature" | "celebration";
  aspectRatio: string;
  isIllustrative: true;
}

export const MARKETING_COUPLE_IMAGES: Record<string, MarketingCoupleImage> = {
  homeCompanion: {
    id: "couple-home-companion",
    src: "/images/couples/couple-home-companion.webp",
    alt: "Fictional Telugu married couple sharing a warm morning coffee on their traditional home veranda",
    altTe: "తమ సాంప్రదాయ ఇంటి వరండాలో ఆనందంగా కాఫీ తాగుతున్న తెలుగు దంపతులు",
    captionEn: "From an unhurried introduction to a lifetime of shared laughter and companionship.",
    captionTe: "ప్రశాంతమైన పరిచయం నుండి ఆనందకరమైన దాంపత్య జీవితం వరకు.",
    theme: "home",
    aspectRatio: "16/9",
    isIllustrative: true,
  },
  festiveWedding: {
    id: "couple-festive-beginning",
    src: "/images/couples/couple-story-01.webp",
    alt: "Fictional newly married Telugu couple in traditional silk attire celebrating in an ancestral courtyard",
    altTe: "సంప్రదాయ పట్టు వస్త్రాలలో పూల అలంకరణతో ఆనందంగా ఉన్న తెలుగు నవదంపతులు",
    captionEn: "Two families united with blessings, respect, and deep shared traditions.",
    captionTe: "పెద్దల ఆశీర్వాదాలు, సంప్రదాయాలు మరియు పరస్పర గౌరవంతో మొదలైన బంధం.",
    theme: "festive",
    aspectRatio: "4/3",
    isIllustrative: true,
  },
  modernWalk: {
    id: "couple-modern-walk",
    src: "/images/couples/couple-story-02.webp",
    alt: "Fictional contemporary Telugu couple in smart traditional wear walking together in a garden",
    altTe: "తోటలో పరస్పర అనురాగంతో కలిసి నడుస్తున్న ఆధునిక తెలుగు దంపతులు",
    captionEn: "Shared roots, modern ambitions, and an enduring partnership built on mutual trust.",
    captionTe: "మన మూలాలు, ఆధునిక ఆశయాలు మరియు నమ్మకంతో నిర్మించిన జీవిత భాగస్వామ్యం.",
    theme: "walk",
    aspectRatio: "4/3",
    isIllustrative: true,
  },
  matureCompanionship: {
    id: "couple-mature-companion",
    src: "/images/couples/couple-mature-companion.webp",
    alt: "Fictional mature Telugu married couple seated comfortably together with serene, happy smiles",
    altTe: "సంతోషకరమైన దాంపత్య అనుభవంతో కలిసి కూర్చున్న పరిణతి చెందిన తెలుగు దంపతులు",
    captionEn: "A lifetime of quiet companionship, family pride, and strong roots.",
    captionTe: "తరతరాల సంప్రదాయం, కలకాలం నిలిచే ప్రశాంతమైన దాంపత్య తోడు.",
    theme: "mature",
    aspectRatio: "4/3",
    isIllustrative: true,
  },
  celebrationJourney: {
    id: "couple-celebration-journey",
    src: "/images/couples/couple-celebration-journey.webp",
    alt: "Fictional Telugu couple holding a traditional brass deepam during a festive family celebration",
    altTe: "పండుగ వేడుకలో సంప్రదాయ ఇత్తడి దీపం వెలిగిస్తూ ఆనందంగా ఉన్న తెలుగు దంపతులు",
    captionEn: "Lighting the way forward together, supported by family and community blessings.",
    captionTe: "కుటుంబ మరియు సమాజ ఆశీర్వాదాలతో కలిసి కొత్త వెలుగులను ఆహ్వానిస్తూ.",
    theme: "celebration",
    aspectRatio: "4/3",
    isIllustrative: true,
  },
};
