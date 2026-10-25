/**
 * Shettibalija Matrimony — Demo & Illustrative Success Stories
 *
 * ============================================================================
 * ARCHITECTURAL RULE — DEMO / MARKETING CONTENT
 * ============================================================================
 * These stories represent illustrative demo narratives showcasing how families
 * connect within the Shettibalija community.
 *
 * - Fictional couple names and illustrative experiences.
 * - Fictional marketing couple imagery (never attached to member accounts).
 * - Explicitly flagged with `is_demo: true` and illustrative badges.
 * - Does not claim to be verified customers or real customer profiles.
 * ============================================================================
 */

export interface DemoSuccessStory {
  id: string;
  couple_names: string;
  couple_names_te: string;
  city: string;
  city_te: string;
  marriage_year: number;
  headline: string;
  headline_te: string;
  story: string;
  story_te: string;
  photo_url: string;
  photo_alt: string;
  is_demo: true;
  theme: string;
}

export const DEMO_SUCCESS_STORIES: DemoSuccessStory[] = [
  {
    id: "demo-story-01",
    couple_names: "Anusha & Kiran",
    couple_names_te: "అనూష & కిరణ్",
    city: "Rajamahendravaram",
    city_te: "రాజమహేంద్రవరం",
    marriage_year: 2024,
    headline: "Two families, one beautiful beginning.",
    headline_te: "రెండు కుటుంబాలు, ఒక అందమైన ప్రారంభం.",
    story:
      "After connecting through community introductions, their families found that they shared identical values, traditions, and hopes for the future. An unhurried introduction led to mutual respect and a lifelong bond blessed by both families.",
    story_te:
      "సమాజ పరిచయాల ద్వారా కలిసిన తర్వాత, ఇరు కుటుంబాలు ఒకే విధమైన విలువలు, ఆచారాలు మరియు భవిష్యత్ ఆశయాలను పంచుకుంటున్నాయని గ్రహించారు. ఒక ప్రశాంతమైన పరిచయం పెద్దల ఆశీర్వాదాలతో అందమైన దాంపత్యంగా మారింది.",
    photo_url: "/images/couples/couple-story-01.webp",
    photo_alt: "Fictional Telugu couple Anusha & Kiran in festive South Indian wedding attire",
    is_demo: true,
    theme: "Traditional family blessing",
  },
  {
    id: "demo-story-02",
    couple_names: "Harika & Vamsi",
    couple_names_te: "హారిక & వంశీ",
    city: "Visakhapatnam & Hyderabad",
    city_te: "విశాఖపట్నం & హైదరాబాద్",
    marriage_year: 2023,
    headline: "Shared roots, shared ambitions.",
    headline_te: "మన మూలాలు, మన ఆశయాలు.",
    story:
      "Both pursuing demanding professional careers, they looked for a partner who understood modern aspirations while honoring their Shettibalija cultural roots. A thoughtful conversation between their parents gave them the foundation to build a warm, supportive home together.",
    story_te:
      "వృత్తిపరమైన రంగాలలో స్థిరపడినప్పటికీ, తమ సాంస్కృతిక మూలాలను మరియు కుటుంబ విలువలనూ గౌరవించే జీవిత భాగస్వామి కోసం వెతికారు. తల్లిదండ్రుల మధ్య జరిగిన గౌరవప్రదమైన సంభాషణ నేడు వారి సంతోషకరమైన దాంపత్యానికి పునాది అయింది.",
    photo_url: "/images/couples/couple-story-02.webp",
    photo_alt: "Fictional Telugu couple Harika & Vamsi walking together in a garden",
    is_demo: true,
    theme: "Modern partnership with roots",
  },
  {
    id: "demo-story-03",
    couple_names: "Sravanthi & Ramesh",
    couple_names_te: "శ్రావంతి & రమేష్",
    city: "Kakinada",
    city_te: "కాకినాడ",
    marriage_year: 2022,
    headline: "A bond nurtured by mutual respect.",
    headline_te: "పరస్పర గౌరవంతో బలపడిన బంధం.",
    story:
      "Introduced through mutual community circles, their families took time to understand each other's native traditions and family background. Today, they share a quiet life of deep companionship, laughter, and strong family ties.",
    story_te:
      "సమాజ పరిచయం ద్వారా ప్రారంభమైన ఈ బంధంలో, ఇరు కుటుంబాలు ఒకరి సంప్రదాయాలను మరొకరు అర్థం చేసుకోవడానికి తగిన సమయం తీసుకున్నాయి. పరస్పర గౌరవం మరియు తోడుతో వారి దాంపత్య జీవితం ప్రశాంతంగా సాగుతోంది.",
    photo_url: "/images/couples/couple-story-03.webp",
    photo_alt: "Fictional Telugu couple Sravanthi & Ramesh in dignified companionship",
    is_demo: true,
    theme: "Unhurried, enduring companionship",
  },
];
