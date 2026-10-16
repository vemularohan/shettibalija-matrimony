export const GENDER_OPTIONS = [
  { value: "bride", label: "Bride", labelTe: "వధువు" },
  { value: "groom", label: "Groom", labelTe: "వరుడు" },
] as const;

export const ACCOUNT_CREATED_BY = [
  { value: "self", label: "Self", labelTe: "స్వయంగా" },
  { value: "parent_guardian", label: "Parent / Guardian", labelTe: "తల్లిదండ్రులు / సంరక్షకులు" },
] as const;

// Exactly the 5 requested marital statuses:
export const MARITAL_STATUS_OPTIONS = [
  { value: "never_married", label: "Never Married", labelTe: "ఇంతకు ముందు వివాహం కాలేదు" },
  { value: "divorced", label: "Divorced", labelTe: "విడాకులు పొందిన వారు" },
  { value: "widowed", label: "Widowed", labelTe: "వితంతువు / వితంతుడు" },
  { value: "separated", label: "Separated", labelTe: "వేరుగా ఉంటున్న వారు" },
  { value: "second_marriage", label: "Second Marriage", labelTe: "రెండవ వివాహం" },
] as const;

export const COMPLEXION_OPTIONS = [
  { value: "fair", label: "Fair", labelTe: "ఫెయిర్ (తెలుపు)" },
  { value: "wheatish", label: "Wheatish", labelTe: "గోధుమ రంగు" },
  { value: "dusky", label: "Dusky", labelTe: "మాసిన రంగు" },
  { value: "dark", label: "Dark", labelTe: "నలుపు" },
  { value: "prefer_not_to_say", label: "Prefer not to say", labelTe: "చెప్పడానికి ఇష్టపడలేదు" },
] as const;

export const EMPLOYMENT_TYPE_OPTIONS = [
  { value: "government", label: "Government", labelTe: "ప్రభుత్వ ఉద్యోగం" },
  { value: "private", label: "Private", labelTe: "ప్రైవేట్ ఉద్యోగం" },
  { value: "business", label: "Business", labelTe: "వ్యాపారం" },
  { value: "self_employed", label: "Self Employed", labelTe: "స్వయం ఉపాధి" },
  { value: "professional", label: "Professional", labelTe: "ప్రొఫెషనల్" },
  { value: "other", label: "Other", labelTe: "ఇతర" },
  { value: "not_working", label: "Not Working", labelTe: "ఉద్యోగం చేయడం లేదు" },
] as const;

export const SALARY_PERIOD_OPTIONS = [
  { value: "annual", label: "Annual", labelTe: "వార్షికం (Annual)" },
  { value: "monthly", label: "Monthly", labelTe: "నెలవారీ (Monthly)" },
] as const;

export const CURRENCY_OPTIONS = [
  { value: "INR", label: "INR (₹) - Indian Rupee" },
  { value: "USD", label: "USD ($) - US Dollar" },
  { value: "EUR", label: "EUR (€) - Euro" },
  { value: "GBP", label: "GBP (£) - British Pound" },
  { value: "AED", label: "AED (د.إ) - UAE Dirham" },
  { value: "CAD", label: "CAD ($) - Canadian Dollar" },
  { value: "AUD", label: "AUD ($) - Australian Dollar" },
  { value: "SGD", label: "SGD ($) - Singapore Dollar" },
] as const;

export const FAMILY_TYPE_OPTIONS = [
  { value: "nuclear", label: "Nuclear", labelTe: "చిన్న కుటుంబం (Nuclear)" },
  { value: "joint", label: "Joint", labelTe: "ఉమ్మడి కుటుంబం (Joint)" },
  { value: "other", label: "Other", labelTe: "ఇతర (Other)" },
] as const;

export const COMMUNITY_PROFESSION_SUGGESTIONS = [
  { value: "Carpenter", label: "Carpenter", labelTe: "వడ్రంగి (Carpenter)" },
  { value: "Goldsmith", label: "Goldsmith", labelTe: "కంసాలి (Goldsmith)" },
  { value: "Business", label: "Business", labelTe: "వ్యాపారం (Business)" },
  { value: "Employee", label: "Employee", labelTe: "ఉద్యోగి (Employee)" },
  { value: "Contractor", label: "Contractor", labelTe: "కాంట్రాక్టర్ (Contractor)" },
  { value: "Trader", label: "Trader", labelTe: "వర్తకుడు (Trader)" },
  { value: "Other", label: "Other", labelTe: "ఇతర (Other)" },
] as const;

export const FOOD_HABIT_OPTIONS = [
  { value: "vegetarian", label: "Vegetarian", labelTe: "శాఖాహారం (Vegetarian)" },
  { value: "non_vegetarian", label: "Non-Vegetarian", labelTe: "మాంసాహారం (Non-Vegetarian)" },
  { value: "eggetarian", label: "Eggetarian", labelTe: "గుడ్డు మాత్రమే (Eggetarian)" },
  { value: "other", label: "Other", labelTe: "ఇతర (Other)" },
  { value: "prefer_not_to_say", label: "Prefer not to say", labelTe: "చెప్పడానికి ఇష్టపడలేదు" },
] as const;

export const LIFESTYLE_HABIT_OPTIONS = [
  { value: "no", label: "No", labelTe: "లేదు (No)" },
  { value: "occasionally", label: "Occasionally", labelTe: "అప్పుడప్పుడు (Occasionally)" },
  { value: "yes", label: "Yes", labelTe: "అవును (Yes)" },
  { value: "prefer_not_to_say", label: "Prefer not to say", labelTe: "చెప్పడానికి ఇష్టపడలేదు" },
] as const;

export const NAKSHATRA_OPTIONS = [
  { value: "Ashwini", label: "Ashwini", labelTe: "అశ్విని" },
  { value: "Bharani", label: "Bharani", labelTe: "భరణి" },
  { value: "Krittika", label: "Krittika", labelTe: "కృత్తిక" },
  { value: "Rohini", label: "Rohini", labelTe: "రోహిణి" },
  { value: "Mrigashira", label: "Mrigashira", labelTe: "మృగశిర" },
  { value: "Arudra", label: "Arudra", labelTe: "ఆరుద్ర" },
  { value: "Punarvasu", label: "Punarvasu", labelTe: "పునర్వసు" },
  { value: "Pushya", label: "Pushya (Pushyami)", labelTe: "పుష్యమి" },
  { value: "Ashlesha", label: "Ashlesha", labelTe: "ఆశ్లేష" },
  { value: "Magha", label: "Magha (Makha)", labelTe: "మఘ" },
  { value: "Purva Phalguni", label: "Purva Phalguni (Pubba)", labelTe: "పుబ్బ / పూర్వ ఫల్గుణి" },
  { value: "Uttara Phalguni", label: "Uttara Phalguni (Uttara)", labelTe: "ఉత్తర / ఉత్తర ఫల్గుణి" },
  { value: "Hasta", label: "Hasta", labelTe: "హస్త" },
  { value: "Chitra", label: "Chitra", labelTe: "చిత్ర" },
  { value: "Swati", label: "Swati", labelTe: "స్వాతి" },
  { value: "Vishakha", label: "Vishakha", labelTe: "విశాఖ" },
  { value: "Anuradha", label: "Anuradha", labelTe: "అనూరాధ" },
  { value: "Jyeshtha", label: "Jyeshtha", labelTe: "జ్యేష్ఠ" },
  { value: "Mula", label: "Mula", labelTe: "మూల" },
  { value: "Purva Ashadha", label: "Purva Ashadha", labelTe: "పూర్వాషాఢ" },
  { value: "Uttara Ashadha", label: "Uttara Ashadha", labelTe: "ఉత్తరాషాఢ" },
  { value: "Shravana", label: "Shravana", labelTe: "శ్రవణం" },
  { value: "Dhanishta", label: "Dhanishta", labelTe: "ధనిష్ఠ" },
  { value: "Shatabhisha", label: "Shatabhisha", labelTe: "శతభిషం" },
  { value: "Purva Bhadrapada", label: "Purva Bhadrapada", labelTe: "పూర్వాభాద్ర" },
  { value: "Uttara Bhadrapada", label: "Uttara Bhadrapada", labelTe: "ఉత్తరాభాద్ర" },
  { value: "Revati", label: "Revati", labelTe: "రేవతి" },
] as const;

export const RASHI_OPTIONS = [
  { value: "Mesha", label: "Mesha (Aries)", labelTe: "మేషం (Mesha)" },
  { value: "Vrishabha", label: "Vrishabha (Taurus)", labelTe: "వృషభం (Vrishabha)" },
  { value: "Mithuna", label: "Mithuna (Gemini)", labelTe: "మిథునం (Mithuna)" },
  { value: "Karkataka", label: "Karkataka (Cancer)", labelTe: "కర్కాటకం (Karkataka)" },
  { value: "Simha", label: "Simha (Leo)", labelTe: "సింహం (Simha)" },
  { value: "Kanya", label: "Kanya (Virgo)", labelTe: "కన్య (Kanya)" },
  { value: "Tula", label: "Tula (Libra)", labelTe: "తుల (Tula)" },
  { value: "Vrischika", label: "Vrischika (Scorpio)", labelTe: "వృశ్చికం (Vrischika)" },
  { value: "Dhanu", label: "Dhanu (Sagittarius)", labelTe: "ధనుస్సు (Dhanu)" },
  { value: "Makara", label: "Makara (Capricorn)", labelTe: "మకరం (Makara)" },
  { value: "Kumbha", label: "Kumbha (Aquarius)", labelTe: "కుంభం (Kumbha)" },
  { value: "Meena", label: "Meena (Pisces)", labelTe: "మీనం (Meena)" },
] as const;

export const EDUCATION_OPTIONS = [
  "High School",
  "Diploma",
  "B.A",
  "B.Com",
  "B.Sc",
  "B.Tech",
  "B.E",
  "BBA",
  "BCA",
  "MBBS",
  "B.Pharm",
  "M.A",
  "M.Com",
  "M.Sc",
  "M.Tech",
  "MCA",
  "MBA",
  "MD / MS",
  "Ph.D",
  "CA",
  "Other",
] as const;

export const OCCUPATION_OPTIONS = [
  "Software Professional",
  "Government Employee",
  "Teacher / Professor",
  "Doctor / Healthcare",
  "Civil Engineer",
  "Mechanical Engineer",
  "Business / Entrepreneur",
  "Banking / Finance",
  "Chartered Accountant",
  "Lawyer / Legal",
  "Civil Services (IAS/IPS/Group)",
  "Defense / Police",
  "Merchant Navy / Aviation",
  "Homemaker",
  "Student",
  "Agriculture / Farming",
  "Contractor / Builder",
  "Trader / Merchant",
  "Other",
] as const;

export const STATES = [
  "Telangana",
  "Andhra Pradesh",
  "Karnataka",
  "Tamil Nadu",
  "Maharashtra",
  "Odisha",
  "Delhi",
  "Other",
] as const;

export const PHOTO_VISIBILITY_OPTIONS = [
  { value: "members", label: "Visible to logged-in members (after authorization)" },
  { value: "hidden", label: "Protected until access is granted" },
] as const;

export const PROFILE_VISIBILITY_OPTIONS = [
  { value: "visible", label: "Visible in search after approval" },
  { value: "hidden", label: "Hidden from search" },
] as const;

export const REPORT_REASONS = [
  "Fake profile",
  "Inappropriate content",
  "Wrong information",
  "Harassment",
  "Other",
] as const;

export const HEIGHT_CHOICES = [
  { cm: 137, label: "4' 6\" (137 cm)" },
  { cm: 140, label: "4' 7\" (140 cm)" },
  { cm: 142, label: "4' 8\" (142 cm)" },
  { cm: 145, label: "4' 9\" (145 cm)" },
  { cm: 147, label: "4' 10\" (147 cm)" },
  { cm: 150, label: "4' 11\" (150 cm)" },
  { cm: 152, label: "5' 0\" (152 cm)" },
  { cm: 155, label: "5' 1\" (155 cm)" },
  { cm: 157, label: "5' 2\" (157 cm)" },
  { cm: 160, label: "5' 3\" (160 cm)" },
  { cm: 162, label: "5' 4\" (162 cm)" },
  { cm: 165, label: "5' 5\" (165 cm)" },
  { cm: 168, label: "5' 6\" (168 cm)" },
  { cm: 170, label: "5' 7\" (170 cm)" },
  { cm: 173, label: "5' 8\" (173 cm)" },
  { cm: 175, label: "5' 9\" (175 cm)" },
  { cm: 178, label: "5' 10\" (178 cm)" },
  { cm: 180, label: "5' 11\" (180 cm)" },
  { cm: 183, label: "6' 0\" (183 cm)" },
  { cm: 185, label: "6' 1\" (185 cm)" },
  { cm: 188, label: "6' 2\" (188 cm)" },
  { cm: 191, label: "6' 3\" (191 cm)" },
  { cm: 193, label: "6' 4\" (193 cm)" },
  { cm: 196, label: "6' 5\" (196 cm)" },
  { cm: 198, label: "6' 6\" (198 cm)" },
  { cm: 201, label: "6' 7\" (201 cm)" },
  { cm: 203, label: "6' 8\" (203 cm)" },
  { cm: 206, label: "6' 9\" (206 cm)" },
  { cm: 208, label: "6' 10\" (208 cm)" },
  { cm: 211, label: "6' 11\" (211 cm)" },
  { cm: 213, label: "7' 0\" (213 cm)" },
] as const;

export const HEIGHT_CM_OPTIONS = Array.from({ length: 61 }, (_, index) => 137 + index);

export const AGE_OPTIONS = Array.from({ length: 43 }, (_, index) => 18 + index);
