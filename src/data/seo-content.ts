export type LandingContent = {
  slug: string;
  title: string;
  description: string;
  eyebrow: string;
  intro: string;
  focus: string;
  practical: string[];
  questions: { question: string; answer: string }[];
};

const LOCATION_SEEDS: [string, string, string, string, string[]][] = [
  [
    "hyderabad",
    "Hyderabad",
    "Telangana's capital is home to families who want a community-aware search while staying open to a modern, privacy-first introduction.",
    "Consider profiles by city, family values, education and the details that matter to your household.",
    [
      "Whether you live in Hyderabad or are considering a match with family roots here, use the platform to begin a conversation without publishing private contact details.",
      "Families can create a profile for themselves or for a son, daughter, sibling or relative and involve the candidate at every step.",
    ],
  ],
  [
    "vijayawada",
    "Vijayawada",
    "Start a thoughtful Settibalija matrimonial search for families in Vijayawada and the surrounding Krishna region.",
    "A city-focused starting point for families who value community context, family participation and respectful introductions.",
    [
      "Location can help families organise a search, but it should be considered alongside character, expectations, education and family conversations.",
      "Profiles are reviewed before they appear in discovery; review is for completeness and community fit, not identity verification.",
    ],
  ],
  [
    "visakhapatnam",
    "Visakhapatnam",
    "Find a privacy-conscious way for Visakhapatnam families to begin Settibalija matrimonial introductions.",
    "Explore a community-specific platform without exposing phone numbers, email addresses or private profile information to search engines.",
    [
      "A useful introduction starts with the details a family is comfortable sharing. Take time to read a profile and speak with the family before making decisions.",
      "Members control when a conversation moves forward, and public pages do not expose private contact details.",
    ],
  ],
  [
    "rajahmundry",
    "Rajahmundry",
    "A community-focused starting point for Settibalija matrimony searches connected with Rajahmundry.",
    "Keep family involvement and privacy at the centre of your search for a suitable match.",
    [
      "Families connected with Rajahmundry can use location as one filter while keeping the wider Settibalija community in view.",
      "The platform is designed for introductions, not rushed comparisons or public disclosure of sensitive matrimonial details.",
    ],
  ],
  [
    "kakinada",
    "Kakinada",
    "Begin a considered Settibalija matrimonial search for families in Kakinada and nearby coastal communities.",
    "Search with context: community, location, education, work and family expectations can all be part of a respectful introduction.",
    [
      "A city page is a starting point, not a promise of local member counts or an office. Actual availability depends on current member profiles and privacy choices.",
      "Create a profile to make your family's preferences and introduction expectations clear.",
    ],
  ],
  [
    "guntur",
    "Guntur",
    "A privacy-first Settibalija matrimony page for families searching from Guntur.",
    "Use a community-aware registration and discovery experience for introductions that can include parents and relatives.",
    [
      "A profile can be managed by the candidate or by a family member acting with the candidate's knowledge and involvement.",
      "Before sharing contact information, confirm details directly with the family and use the platform's reporting and privacy controls.",
    ],
  ],
  [
    "eluru",
    "Eluru",
    "Explore a calm, community-specific approach to Settibalija matrimony for families in Eluru.",
    "Find a useful place to begin when families want shared roots and a more organised introduction process.",
    [
      "A location preference can narrow a search, while family values and expectations help determine whether a conversation is worth pursuing.",
      "The public website is not a directory of private member records; authenticated access and member settings protect personal details.",
    ],
  ],
  [
    "bhimavaram",
    "Bhimavaram",
    "Begin Settibalija matrimonial introductions connected with Bhimavaram and the surrounding West Godavari region.",
    "A thoughtful route into community matchmaking for families who prefer privacy and family participation.",
    [
      "Use the registration flow to create a complete profile rather than relying on public personal details.",
      "Families should discuss compatibility, expectations and consent directly; the platform supports introductions but does not make decisions for them.",
    ],
  ],
  [
    "nellore",
    "Nellore",
    "A community-focused Settibalija matrimony starting point for families in Nellore.",
    "Organise a search around meaningful information while keeping contact details and private photographs protected.",
    [
      "Nellore is one possible location preference, not a guarantee of profiles or match counts. Search results depend on approved member choices.",
      "Good profiles are clear about expectations, respectful in tone and honest about the information shared.",
    ],
  ],
  [
    "tirupati",
    "Tirupati",
    "Start a privacy-aware Settibalija matrimonial search for families in Tirupati.",
    "Bring community context and family participation together in a more considered way to discover introductions.",
    [
      "Families can take part without putting personal phone numbers or email addresses on an open page.",
      "Read the privacy policy and terms, and make your own enquiries before moving from an online introduction to a family meeting.",
    ],
  ],
  [
    "bengaluru",
    "Bengaluru",
    "A community-aware Settibalija matrimony page for Bengaluru families and families living away from their native place.",
    "Stay connected to community matchmaking while considering work, location, family involvement and long-term plans.",
    [
      "Many families live across cities. Bengaluru can be one preference within a wider search rather than a limitation on community connections.",
      "Use the platform to start a conversation and keep sensitive details within the member access rules.",
    ],
  ],
  [
    "chennai",
    "Chennai",
    "Begin a privacy-first Settibalija matrimonial search for families in Chennai.",
    "A useful starting point for community introductions when families want both cultural context and practical location preferences.",
    [
      "A location page cannot promise a local office, local statistics or a fixed number of profiles. It explains how to search responsibly when Chennai is relevant.",
      "Registration lets families build a fuller profile and decide how to participate in the introduction process.",
    ],
  ],
];

export const LOCATION_PAGES: LandingContent[] = LOCATION_SEEDS.map(
  ([slug, city, description, focus, practical]) => ({
    slug,
    title: `Settibalija Matrimony in ${city}`,
    description,
    eyebrow: `${city} families • Settibalija community`,
    intro: `Looking for Settibalija matrimony in ${city}? ${focus}`,
    focus,
    practical,
    questions: [
      {
        question: `Can families in ${city} register?`,
        answer: `Yes. Candidates, parents, siblings and relatives can start a profile, provided the information is accurate and the candidate is involved in the matrimonial decision.`,
      },
      {
        question: `Are ${city} member details public?`,
        answer:
          "No. Phone numbers, email addresses, horoscope documents and private profile information are not published as public SEO content.",
      },
    ],
  }),
);

export type GuideArticle = {
  slug: string;
  title: string;
  summary: string;
  sections: [string, string][];
};

export const GUIDE_ARTICLES: GuideArticle[] = [
  {
    slug: "create-a-strong-matrimonial-profile",
    title: "How to Create a Strong Matrimonial Profile",
    summary: "A practical checklist for writing a clear, honest and useful profile for families.",
    sections: [
      [
        "Start with accuracy",
        "Use current information about education, work, location and expectations. A profile is more useful when it helps another family understand the person rather than trying to sound perfect.",
      ],
      [
        "Write for a family conversation",
        "Mention the values and practical details that a family may want to discuss. Avoid publishing phone numbers, email addresses or sensitive documents in an open profile.",
      ],
      [
        "Review before publishing",
        "Read the profile once as a parent or candidate. Check spelling, dates and consent, then keep the profile updated as circumstances change.",
      ],
    ],
  },
  {
    slug: "find-a-suitable-settibalija-bride-or-groom",
    title: "How to Find a Suitable Settibalija Bride or Groom",
    summary: "How to combine community context, compatibility and respectful family conversations.",
    sections: [
      [
        "Begin with priorities",
        "Decide which preferences are essential and which are flexible. Community, location, education and work may matter, but they should support a fuller conversation about values and expectations.",
      ],
      [
        "Read beyond a checklist",
        "A profile is an introduction, not a final judgement. Look for clear information and use the platform's interest flow to express genuine intent.",
      ],
      [
        "Involve the right people",
        "The candidate and families should know who is participating. Ask questions respectfully and never pressure someone to continue a conversation.",
      ],
    ],
  },
  {
    slug: "online-matrimony-safety-and-privacy",
    title: "How to Use Online Matrimony Safely",
    summary:
      "Simple steps for protecting personal information while getting to know a matrimonial match.",
    sections: [
      [
        "Protect contact information",
        "Do not publish phone numbers, personal email addresses, identity documents or financial information in a profile. Move to direct contact only when both sides are comfortable.",
      ],
      [
        "Verify through conversation",
        "Online profile review is not identity verification. Speak with the family, ask consistent questions and make independent enquiries before important decisions.",
      ],
      [
        "Use platform controls",
        "Report suspicious behaviour, respect privacy settings and pause or remove a profile when it is no longer needed.",
      ],
    ],
  },
  {
    slug: "how-to-register-on-shettibalija-matrimony",
    title: "How to Register on Shettibalija Matrimony",
    summary:
      "A step-by-step guide to creating a profile and preparing for community introductions.",
    sections: [
      [
        "Create an account",
        "Start with the registration flow and choose who the profile is for. Parents and relatives can help, while the candidate should remain part of the decision.",
      ],
      [
        "Complete the important details",
        "Add accurate personal, education, work and family information that you are comfortable sharing. Save your progress if you need more time.",
      ],
      [
        "Understand privacy",
        "Review the privacy policy and member settings before uploading photographs or adding optional information.",
      ],
    ],
  },
  {
    slug: "questions-before-pelli-choopulu",
    title: "Questions Families Can Discuss Before Pelli Choopulu",
    summary: "A respectful discussion guide for families preparing for a first meeting.",
    sections: [
      [
        "Expectations",
        "Discuss where each person hopes to live, work plans, family responsibilities and the kind of support both sides expect.",
      ],
      [
        "Communication",
        "Agree on how questions will be asked and how the candidate can express a clear yes, no or not-yet. Consent should remain central.",
      ],
      [
        "Next steps",
        "Decide whether another conversation is useful. A respectful introduction does not require an immediate commitment.",
      ],
    ],
  },
];
