import type { PublicProfileCardData } from "@/components/profiles/profile-card";

export type DemoProfile = PublicProfileCardData & {
  is_demo: true;
  about_me?: string;
  community: string;
  mother_tongue: string;
  languages: string[];
  marital_status: string;
  gender: "bride" | "groom";
  native_place: string;
  created_at: string;
  moderation_status: "approved";
  visibility: "visible";
  photo_visibility: "members";
  partner_preferences?: {
    min_age?: number;
    max_age?: number;
    min_height_cm?: number;
    max_height_cm?: number;
    education?: string;
    occupation?: string;
    preferred_locations?: string[];
  };
};

export const DEMO_PROFILES: DemoProfile[] = [
  // --- BRIDES (Females) ---
  {
    id: "demo-sbm-01",
    profile_code: "SBM-D101",
    is_demo: true,
    display_name: "Ananya R.",
    gender: "bride",
    age: 25,
    height_cm: 162,
    education: "B.Tech (CSE)",
    occupation: "Software Engineer",
    city: "Hyderabad",
    state: "Telangana",
    native_place: "East Godavari, AP",
    community: "Shettibalija",
    mother_tongue: "Telugu",
    languages: ["Telugu", "English", "Hindi"],
    marital_status: "never_married",
    about_me:
      "Namaste! I am working as a Software Engineer in Hyderabad. I am positive-minded, value work-life balance, and love Telugu culture, classical music, and cooking. Looking for an understanding and respectful partner.",
    family_summary:
      "Father is an executive in the state cooperative bank; mother is a homemaker. Traditional values with a modern, progressive outlook.",
    partner_preferences: {
      min_age: 26,
      max_age: 30,
      min_height_cm: 168,
      max_height_cm: 182,
      education: "B.Tech / M.Tech / MBA",
      occupation: "IT Professional or Govt Employee",
      preferred_locations: ["Hyderabad", "Vijayawada", "Visakhapatnam"],
    },
    created_at: "2026-09-28T09:15:00Z",
    moderation_status: "approved",
    visibility: "visible",
    photo_visibility: "members",
  },
  {
    id: "demo-sbm-02",
    profile_code: "SBM-D102",
    is_demo: true,
    display_name: "Sneha Latha K.",
    gender: "bride",
    age: 27,
    height_cm: 165,
    education: "MBBS, DNB Resident",
    occupation: "Doctor (Civil Assistant Surgeon)",
    city: "Visakhapatnam",
    state: "Andhra Pradesh",
    native_place: "Anakapalli, AP",
    community: "Shettibalija",
    mother_tongue: "Telugu",
    languages: ["Telugu", "English"],
    marital_status: "never_married",
    about_me:
      "Doctor currently pursuing DNB residency in Visakhapatnam. Compassionate, career-focused, and grounded in family values. Seeking a supportive life partner from a cultured family.",
    family_summary:
      "Well-settled doctor family. Father is a retired veterinary officer; elder brother is an architect in Bengaluru.",
    partner_preferences: {
      min_age: 28,
      max_age: 32,
      min_height_cm: 172,
      max_height_cm: 185,
      education: "MBBS / MD / MS / Civil Services",
      occupation: "Medical Professional or Group-1 Officer",
      preferred_locations: ["Visakhapatnam", "Hyderabad", "Vijayawada"],
    },
    created_at: "2026-10-01T11:30:00Z",
    moderation_status: "approved",
    visibility: "visible",
    photo_visibility: "members",
  },
  {
    id: "demo-sbm-03",
    profile_code: "SBM-D103",
    is_demo: true,
    display_name: "Deepika V.",
    gender: "bride",
    age: 24,
    height_cm: 158,
    education: "M.Sc (Biotechnology)",
    occupation: "Quality Analyst",
    city: "Rajahmundry",
    state: "Andhra Pradesh",
    native_place: "Kakinada, AP",
    community: "Shettibalija",
    mother_tongue: "Telugu",
    languages: ["Telugu", "English"],
    marital_status: "never_married",
    about_me:
      "Working as a Quality Analyst in Rajahmundry. Calm, caring nature with an appreciation for literature, gardening, and spending quiet moments with family. Looking for a dependable partner.",
    family_summary:
      "Respectable nuclear family. Father manages family wholesale business; mother is a government high school teacher.",
    partner_preferences: {
      min_age: 26,
      max_age: 30,
      min_height_cm: 165,
      max_height_cm: 180,
      education: "Post Graduate or Engineering Graduate",
      occupation: "Pharma / IT / Business",
      preferred_locations: ["Andhra Pradesh", "Hyderabad"],
    },
    created_at: "2026-10-04T14:45:00Z",
    moderation_status: "approved",
    visibility: "visible",
    photo_visibility: "members",
  },
  {
    id: "demo-sbm-04",
    profile_code: "SBM-D104",
    is_demo: true,
    display_name: "Pooja Sri P.",
    gender: "bride",
    age: 26,
    height_cm: 160,
    education: "MBA (Finance)",
    occupation: "Financial Risk Analyst",
    city: "Vijayawada",
    state: "Andhra Pradesh",
    native_place: "Guntur, AP",
    community: "Shettibalija",
    mother_tongue: "Telugu",
    languages: ["Telugu", "English", "Hindi"],
    marital_status: "never_married",
    about_me:
      "Finance professional with an MBA, working in Vijayawada. Ambitious yet traditional, fond of travel and badminton. Looking for a partner who believes in mutual respect and shared growth.",
    family_summary:
      "Close-knit cultured family. Father is an electrical contractor; one younger sister completing B.Tech.",
    partner_preferences: {
      min_age: 27,
      max_age: 31,
      min_height_cm: 170,
      max_height_cm: 182,
      education: "MBA / CA / B.Tech",
      occupation: "Corporate Finance or IT Professional",
      preferred_locations: ["Vijayawada", "Hyderabad", "Guntur"],
    },
    created_at: "2026-10-07T08:20:00Z",
    moderation_status: "approved",
    visibility: "visible",
    photo_visibility: "members",
  },
  {
    id: "demo-sbm-05",
    profile_code: "SBM-D105",
    is_demo: true,
    display_name: "Sowmya G.",
    gender: "bride",
    age: 28,
    height_cm: 164,
    education: "M.Tech (VLSI)",
    occupation: "Hardware Design Engineer",
    city: "Warangal",
    state: "Telangana",
    native_place: "Karimnagar, TS",
    community: "Shettibalija",
    mother_tongue: "Telugu",
    languages: ["Telugu", "English", "Hindi"],
    marital_status: "never_married",
    about_me:
      "VLSI engineer residing in Warangal. Passionate about electronics technology, Telangana culture, and weekend road trips. Seeking an educated and broad-minded companion.",
    family_summary:
      "Academically oriented family. Both parents are gazetted officers in Telangana state education department.",
    partner_preferences: {
      min_age: 29,
      max_age: 33,
      min_height_cm: 170,
      max_height_cm: 185,
      education: "M.Tech / MS / B.Tech",
      occupation: "Semiconductor or Software Industry",
      preferred_locations: ["Hyderabad", "Bengaluru", "Warangal"],
    },
    created_at: "2026-10-09T16:10:00Z",
    moderation_status: "approved",
    visibility: "visible",
    photo_visibility: "members",
  },
  {
    id: "demo-sbm-06",
    profile_code: "SBM-D106",
    is_demo: true,
    display_name: "Harika Ch.",
    gender: "bride",
    age: 25,
    height_cm: 163,
    education: "B.Arch",
    occupation: "Urban Planner & Architect",
    city: "Tirupati",
    state: "Andhra Pradesh",
    native_place: "Nellore, AP",
    community: "Shettibalija",
    mother_tongue: "Telugu",
    languages: ["Telugu", "English"],
    marital_status: "never_married",
    about_me:
      "Architect based in Tirupati. Creative, enthusiastic, and devoted to family. Looking for a life partner with positive energy and mutual understanding.",
    family_summary:
      "Father is an agricultural landholder and civil contractor; mother is a homemaker. Well connected in the community.",
    partner_preferences: {
      min_age: 26,
      max_age: 30,
      min_height_cm: 168,
      max_height_cm: 183,
      education: "B.Tech / Architect / Civil Services",
      occupation: "Professional or Established Business",
      preferred_locations: ["Tirupati", "Nellore", "Bengaluru", "Chennai"],
    },
    created_at: "2026-10-11T10:05:00Z",
    moderation_status: "approved",
    visibility: "visible",
    photo_visibility: "members",
  },
  {
    id: "demo-sbm-07",
    profile_code: "SBM-D107",
    is_demo: true,
    display_name: "Mounika D.",
    gender: "bride",
    age: 29,
    height_cm: 160,
    education: "CA (Chartered Accountant)",
    occupation: "Senior Auditor at Big 4",
    city: "Hyderabad",
    state: "Telangana",
    native_place: "West Godavari, AP",
    community: "Shettibalija",
    mother_tongue: "Telugu",
    languages: ["Telugu", "English", "Hindi"],
    marital_status: "never_married",
    about_me:
      "Chartered Accountant working with a Big 4 firm in Hyderabad. Simple lifestyle, professional drive, and strong connection with our community traditions. Seeking a mature, well-settled life partner.",
    family_summary:
      "Upper middle class family. Father retired from APSRTC central workshop; mother active in community social service.",
    partner_preferences: {
      min_age: 30,
      max_age: 34,
      min_height_cm: 170,
      max_height_cm: 184,
      education: "CA / MBA / B.Tech / MS",
      occupation: "Chartered Accountant or Senior Corporate Professional",
      preferred_locations: ["Hyderabad", "Bengaluru", "Vijayawada"],
    },
    created_at: "2026-10-13T12:00:00Z",
    moderation_status: "approved",
    visibility: "visible",
    photo_visibility: "members",
  },

  // --- GROOMS (Males) ---
  {
    id: "demo-sbm-08",
    profile_code: "SBM-D108",
    is_demo: true,
    display_name: "Sravan Kumar V.",
    gender: "groom",
    age: 28,
    height_cm: 178,
    education: "B.Tech (NIT Warangal)",
    occupation: "Senior Backend Developer",
    city: "Hyderabad",
    state: "Telangana",
    native_place: "Warangal, TS",
    community: "Shettibalija",
    mother_tongue: "Telugu",
    languages: ["Telugu", "English", "Hindi"],
    marital_status: "never_married",
    about_me:
      "NIT Warangal graduate working as a Senior Software Developer in Hyderabad. Love tech innovations, marathon runs, and spending festive holidays in our native town. Looking for an educated, caring bride.",
    family_summary:
      "Father is a retired revenue inspector; mother is a homemaker. One elder brother married and settled in the US.",
    partner_preferences: {
      min_age: 23,
      max_age: 27,
      min_height_cm: 158,
      max_height_cm: 170,
      education: "B.Tech / MCA / Degree",
      occupation: "IT Professional / Any Profession",
      preferred_locations: ["Hyderabad", "Warangal", "Telangana"],
    },
    created_at: "2026-09-29T13:40:00Z",
    moderation_status: "approved",
    visibility: "visible",
    photo_visibility: "members",
  },
  {
    id: "demo-sbm-09",
    profile_code: "SBM-D109",
    is_demo: true,
    display_name: "Dr. Sai Krishna P.",
    gender: "groom",
    age: 30,
    height_cm: 180,
    education: "MBBS, MS (General Surgery)",
    occupation: "Consultant General Surgeon",
    city: "Vijayawada",
    state: "Andhra Pradesh",
    native_place: "Guntur, AP",
    community: "Shettibalija",
    mother_tongue: "Telugu",
    languages: ["Telugu", "English"],
    marital_status: "never_married",
    about_me:
      "Consultant General Surgeon in Vijayawada. Calm-minded, focused on medical service, and respect family elders deeply. Seeking an understanding partner from a good family background.",
    family_summary:
      "Reputed family from Guntur district. Father owns agricultural lands and cold storage; mother homemaker.",
    partner_preferences: {
      min_age: 24,
      max_age: 28,
      min_height_cm: 160,
      max_height_cm: 172,
      education: "MBBS / BDS / M.Sc / Professional Degree",
      occupation: "Doctor or Homemaker with good family background",
      preferred_locations: ["Andhra Pradesh", "Hyderabad"],
    },
    created_at: "2026-10-02T15:20:00Z",
    moderation_status: "approved",
    visibility: "visible",
    photo_visibility: "members",
  },
  {
    id: "demo-sbm-10",
    profile_code: "SBM-D110",
    is_demo: true,
    display_name: "Karthik Teja B.",
    gender: "groom",
    age: 27,
    height_cm: 175,
    education: "B.Tech + MBA (IIM Kozhikode)",
    occupation: "Product Manager",
    city: "Hyderabad",
    state: "Telangana",
    native_place: "Rajahmundry, AP",
    community: "Shettibalija",
    mother_tongue: "Telugu",
    languages: ["Telugu", "English", "Hindi"],
    marital_status: "never_married",
    about_me:
      "Product Manager in Hyderabad with an engineering and IIM MBA background. Enjoy strategy games, weekend tennis, and travel. Seeking a compatible and cheerful partner.",
    family_summary:
      "Father is an executive engineer in Roads & Buildings; mother is an associate professor in Andhra University.",
    partner_preferences: {
      min_age: 23,
      max_age: 27,
      min_height_cm: 158,
      max_height_cm: 170,
      education: "Engineering or Post Graduate Graduate",
      occupation: "Working Professional",
      preferred_locations: ["Hyderabad", "Visakhapatnam", "Rajahmundry"],
    },
    created_at: "2026-10-05T09:50:00Z",
    moderation_status: "approved",
    visibility: "visible",
    photo_visibility: "members",
  },
  {
    id: "demo-sbm-11",
    profile_code: "SBM-D111",
    is_demo: true,
    display_name: "Venkata Rajesh N.",
    gender: "groom",
    age: 31,
    height_cm: 173,
    education: "M.Tech (Civil)",
    occupation: "Assistant Executive Engineer (Govt)",
    city: "Nellore",
    state: "Andhra Pradesh",
    native_place: "Ongole, AP",
    community: "Shettibalija",
    mother_tongue: "Telugu",
    languages: ["Telugu", "English"],
    marital_status: "never_married",
    about_me:
      "Assistant Executive Engineer in AP State Government, Nellore. Rooted in traditional values, enjoy classical Telugu literature and social work. Looking for an educated life partner.",
    family_summary:
      "Traditional Godavari/Krishna rooted family. Father is a retired LIC branch manager; mother homemaker.",
    partner_preferences: {
      min_age: 25,
      max_age: 29,
      min_height_cm: 155,
      max_height_cm: 168,
      education: "Any Degree or B.Tech",
      occupation: "Govt Employee / Teacher / Homemaker",
      preferred_locations: ["Nellore", "Tirupati", "Guntur", "Vijayawada"],
    },
    created_at: "2026-10-08T17:15:00Z",
    moderation_status: "approved",
    visibility: "visible",
    photo_visibility: "members",
  },
  {
    id: "demo-sbm-12",
    profile_code: "SBM-D112",
    is_demo: true,
    display_name: "Naveen Chandra M.",
    gender: "groom",
    age: 29,
    height_cm: 176,
    education: "B.E (ECE)",
    occupation: "Lead Cloud Solutions Architect",
    city: "Visakhapatnam",
    state: "Andhra Pradesh",
    native_place: "Kakinada, AP",
    community: "Shettibalija",
    mother_tongue: "Telugu",
    languages: ["Telugu", "English"],
    marital_status: "never_married",
    about_me:
      "Cloud Architect in Visakhapatnam. Passionate about technology, beach sunsets, and photography. Seeking an affectionate, educated partner to share life's journey.",
    family_summary:
      "Upper-middle class family. Father owns shipping clearance logistics firm; mother manages home. One younger sister married.",
    partner_preferences: {
      min_age: 24,
      max_age: 28,
      min_height_cm: 160,
      max_height_cm: 170,
      education: "B.Tech / MCA / Degree",
      occupation: "Software or Corporate Sector",
      preferred_locations: ["Visakhapatnam", "Kakinada", "Hyderabad"],
    },
    created_at: "2026-10-10T11:45:00Z",
    moderation_status: "approved",
    visibility: "visible",
    photo_visibility: "members",
  },
  {
    id: "demo-sbm-13",
    profile_code: "SBM-D113",
    is_demo: true,
    display_name: "Praveen Varma T.",
    gender: "groom",
    age: 26,
    height_cm: 172,
    education: "B.Com + CA Inter",
    occupation: "Branch Manager (Nationalized Bank)",
    city: "Karimnagar",
    state: "Telangana",
    native_place: "Nizamabad, TS",
    community: "Shettibalija",
    mother_tongue: "Telugu",
    languages: ["Telugu", "English", "Hindi"],
    marital_status: "never_married",
    about_me:
      "Nationalized bank branch manager in Karimnagar. Principled, financially grounded, and dedicated to family happiness. Looking for an educated bride with good family traditions.",
    family_summary:
      "Principled Telangana family. Father is a retired headmaster; mother is an active member of self-help group federations.",
    partner_preferences: {
      min_age: 22,
      max_age: 26,
      min_height_cm: 155,
      max_height_cm: 168,
      education: "Graduate or Post Graduate",
      occupation: "Banker / Teacher / Homemaker",
      preferred_locations: ["Karimnagar", "Warangal", "Hyderabad"],
    },
    created_at: "2026-10-12T14:30:00Z",
    moderation_status: "approved",
    visibility: "visible",
    photo_visibility: "members",
  },
  {
    id: "demo-sbm-14",
    profile_code: "SBM-D114",
    is_demo: true,
    display_name: "Suresh Babu K.",
    gender: "groom",
    age: 32,
    height_cm: 177,
    education: "M.S (Information Systems)",
    occupation: "Data Science Lead",
    city: "Hyderabad",
    state: "Telangana",
    native_place: "Eluru, AP",
    community: "Shettibalija",
    mother_tongue: "Telugu",
    languages: ["Telugu", "English"],
    marital_status: "never_married",
    about_me:
      "Lead Data Scientist in Hyderabad with MS degree. Balanced outlook on career and personal life, fond of fitness and reading. Looking for a companion with shared values.",
    family_summary:
      "Well-established family with roots in West Godavari. Owns house in Kukatpally, Hyderabad. Father retired commercial tax officer.",
    partner_preferences: {
      min_age: 26,
      max_age: 30,
      min_height_cm: 160,
      max_height_cm: 172,
      education: "B.Tech / M.Tech / MCA",
      occupation: "IT Professional or Banking",
      preferred_locations: ["Hyderabad", "Andhra Pradesh"],
    },
    created_at: "2026-10-14T18:00:00Z",
    moderation_status: "approved",
    visibility: "visible",
    photo_visibility: "members",
  },
];

export type DemoSearchFilter = {
  gender?: string | undefined;
  minAge?: number | undefined;
  maxAge?: number | undefined;
  state?: string | undefined;
  education?: string | undefined;
  occupation?: string | undefined;
};

export function filterDemoProfiles(filters?: DemoSearchFilter): DemoProfile[] {
  if (!filters) return DEMO_PROFILES;

  return DEMO_PROFILES.filter((profile) => {
    if (filters.gender && profile.gender !== filters.gender) {
      return false;
    }
    if (filters.minAge != null && profile.age != null && profile.age < filters.minAge) {
      return false;
    }
    if (filters.maxAge != null && profile.age != null && profile.age > filters.maxAge) {
      return false;
    }
    if (filters.state && profile.state !== filters.state) {
      return false;
    }
    if (
      filters.education &&
      profile.education &&
      !profile.education.toLowerCase().includes(filters.education.toLowerCase())
    ) {
      return false;
    }
    if (
      filters.occupation &&
      profile.occupation &&
      !profile.occupation.toLowerCase().includes(filters.occupation.toLowerCase())
    ) {
      return false;
    }
    return true;
  });
}

export function findDemoProfile(idOrCode: string): DemoProfile | undefined {
  const normalized = idOrCode.toLowerCase();
  return DEMO_PROFILES.find(
    (p) =>
      p.id.toLowerCase() === normalized ||
      (p.profile_code && p.profile_code.toLowerCase() === normalized),
  );
}

export function isDemoId(id: string): boolean {
  return id.startsWith("demo-") || id.startsWith("SBM-D");
}
