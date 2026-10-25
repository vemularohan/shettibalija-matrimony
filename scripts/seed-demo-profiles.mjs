// Idempotent seed script for Shettibalija Matrimony demo profiles
// Inserts or updates 12 realistic fictional matrimonial profiles flagged with is_demo: true.
// Running this script multiple times is safe and never creates duplicates.

import { createClient } from "@supabase/supabase-js";
import fs from "node:fs";
import path from "node:path";

// Load .env
const envPath = path.resolve(process.cwd(), ".env");
if (fs.existsSync(envPath)) {
  const content = fs.readFileSync(envPath, "utf-8");
  for (const line of content.split("\n")) {
    const trimmed = line.trim();
    if (trimmed && !trimmed.startsWith("#")) {
      const [key, ...rest] = trimmed.split("=");
      const val = rest.join("=").replace(/^["']|["']$/g, "");
      process.env[key] = val;
    }
  }
}

const supabaseUrl = process.env.VITE_SUPABASE_URL || process.env.SUPABASE_URL;
const supabaseKey =
  process.env.SUPABASE_SERVICE_ROLE_KEY ||
  process.env.VITE_SUPABASE_PUBLISHABLE_KEY ||
  process.env.SUPABASE_PUBLISHABLE_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.error("Missing Supabase URL or key. Check .env configuration.");
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

export const DEMO_PROFILES = [
  {
    profile_code: "SBM-DEMO-01",
    display_name: "Phanindra Rayudu",
    gender: "groom",
    age: 28,
    height_cm: 178,
    marital_status: "never_married",
    community: "Shettibalija",
    mother_tongue: "Telugu",
    native_place: "Amalapuram",
    city: "Hyderabad",
    state: "Telangana",
    education: "B.Tech in Computer Science (NIT Warangal)",
    occupation: "Senior Software Engineer",
    family_summary:
      "Father is an agricultural landowner and former village president. Mother is a homemaker. One younger sister married in Kakinada.",
    about_me:
      "I work as a lead engineer at a product company in Gachibowli. Enjoy traditional Carnatic instrumental music, morning runs, and spending weekends with family.",
    star: "Rohini",
    rashi: "Vrishabha (Taurus)",
    gothram: "Kasyapa",
    food_habit: "vegetarian",
    moderation_status: "approved",
    visibility: "visible",
    is_demo: true,
  },
  {
    profile_code: "SBM-DEMO-02",
    display_name: "Madhuri Vemula",
    gender: "bride",
    age: 26,
    height_cm: 165,
    marital_status: "never_married",
    community: "Shettibalija",
    mother_tongue: "Telugu",
    native_place: "Kakinada",
    city: "Visakhapatnam",
    state: "Andhra Pradesh",
    education: "MBBS, MD Pediatrics (Andhra Medical College)",
    occupation: "Pediatric Resident Doctor",
    family_summary:
      "Reputed joint family from Kakinada. Father is a retired government principal; mother teaches Telugu literature. Elder brother is a civil architect.",
    about_me:
      "Dedicated medical resident passionate about child health. Looking for an understanding partner who values family heritage, career dedication, and open dialogue.",
    star: "Uttara Phalguni",
    rashi: "Kanya (Virgo)",
    gothram: "Viswamitra",
    food_habit: "vegetarian",
    moderation_status: "approved",
    visibility: "visible",
    is_demo: true,
  },
  {
    profile_code: "SBM-DEMO-03",
    display_name: "Venkata Sai Pilli",
    gender: "groom",
    age: 30,
    height_cm: 182,
    marital_status: "never_married",
    community: "Shettibalija",
    mother_tongue: "Telugu",
    native_place: "Rajahmundry",
    city: "Bengaluru",
    state: "Karnataka",
    education: "MS in Data Science (Univ. of Texas, Dallas)",
    occupation: "Lead Data Scientist",
    family_summary:
      "Well-settled Godavari family. Father manages family retail businesses; mother manages household. One elder brother married in Hyderabad.",
    about_me:
      "Returned to India after working in Austin for 3 years. Living in Whitefield, Bengaluru. Value cultural roots, calm conversations, and simple festive traditions.",
    star: "Swati",
    rashi: "Tula (Libra)",
    gothram: "Bharadwaja",
    food_habit: "eggetarian",
    moderation_status: "approved",
    visibility: "visible",
    is_demo: true,
  },
  {
    profile_code: "SBM-DEMO-04",
    display_name: "Ananya Ganti",
    gender: "bride",
    age: 25,
    height_cm: 162,
    marital_status: "never_married",
    community: "Shettibalija",
    mother_tongue: "Telugu",
    native_place: "Bhimavaram",
    city: "Hyderabad",
    state: "Telangana",
    education: "Chartered Accountant (CA)",
    occupation: "Financial Analyst (Deloitte)",
    family_summary:
      "Traditional family with agricultural roots in West Godavari. Father is an advocate; mother is a homemaker. Younger brother completing B.Tech.",
    about_me:
      "Working as a financial consultant in Hitec City. Blend modern career ambitions with deep reverence for our family traditions and cultural values.",
    star: "Mrigashira",
    rashi: "Mithuna (Gemini)",
    gothram: "Vasishta",
    food_habit: "vegetarian",
    moderation_status: "approved",
    visibility: "visible",
    is_demo: true,
  },
  {
    profile_code: "SBM-DEMO-05",
    display_name: "Srikiran Varma",
    gender: "groom",
    age: 31,
    height_cm: 175,
    marital_status: "never_married",
    community: "Shettibalija",
    mother_tongue: "Telugu",
    native_place: "Tanuku",
    city: "Vijayawada",
    state: "Andhra Pradesh",
    education: "MBA Finance (IIM Indore), B.Tech",
    occupation: "Assistant Vice President (Banking)",
    family_summary:
      "Respected business family in Tanuku. Father owns rice milling enterprise; mother is a homemaker. Two sisters, both well-settled.",
    about_me:
      "Based in Vijayawada managing regional banking operations. Balanced personality looking for an educated life partner who appreciates family harmony.",
    star: "Hastha",
    rashi: "Kanya (Virgo)",
    gothram: "Kaundinya",
    food_habit: "non_vegetarian",
    moderation_status: "approved",
    visibility: "visible",
    is_demo: true,
  },
  {
    profile_code: "SBM-DEMO-06",
    display_name: "Deepthi Koppula",
    gender: "bride",
    age: 27,
    height_cm: 168,
    marital_status: "never_married",
    community: "Shettibalija",
    mother_tongue: "Telugu",
    native_place: "Kakinada",
    city: "Hyderabad",
    state: "Telangana",
    education: "M.Tech in VLSI Design (JNTUK)",
    occupation: "Hardware Design Engineer (Qualcomm)",
    family_summary:
      "Father is an executive engineer in Roads & Buildings department; mother is a government high school teacher. One younger brother studying at IIT Madras.",
    about_me:
      "Chip design engineer passionate about technology. Enjoy reading Telugu novels, classical Kuchipudi dance, and culinary experiments on weekends.",
    star: "Anuradha",
    rashi: "Vrischika (Scorpio)",
    gothram: "Atri",
    food_habit: "vegetarian",
    moderation_status: "approved",
    visibility: "visible",
    is_demo: true,
  },
  {
    profile_code: "SBM-DEMO-07",
    display_name: "Harish Chandravemula",
    gender: "groom",
    age: 29,
    height_cm: 180,
    marital_status: "never_married",
    community: "Shettibalija",
    mother_tongue: "Telugu",
    native_place: "Amalapuram",
    city: "Visakhapatnam",
    state: "Andhra Pradesh",
    education: "B.Arch (School of Planning and Architecture)",
    occupation: "Architect & Partner (Design Studio)",
    family_summary:
      "Traditional Godavari family with strong community ties. Father is an educational trust secretary; mother is a homemaker.",
    about_me:
      "Co-founded an architectural consultancy specializing in eco-friendly coastal homes. Love traveling through rural Andhra, heritage architecture, and sketch art.",
    star: "Pushya",
    rashi: "Karkataka (Cancer)",
    gothram: "Kasyapa",
    food_habit: "non_vegetarian",
    moderation_status: "approved",
    visibility: "visible",
    is_demo: true,
  },
  {
    profile_code: "SBM-DEMO-08",
    display_name: "Kavitha Palivela",
    gender: "bride",
    age: 28,
    height_cm: 164,
    marital_status: "never_married",
    community: "Shettibalija",
    mother_tongue: "Telugu",
    native_place: "Rajahmundry",
    city: "Bengaluru",
    state: "Karnataka",
    education: "M.Sc in Biotechnology, PGDBI",
    occupation: "Bioinformatics Research Scientist",
    family_summary:
      "Father is a retired banking officer; mother is a homemaker. Younger sister is an IT consultant in Pune.",
    about_me:
      "Conducting genomics research for a healthcare multinational. Down-to-earth, fond of nature walks, filter coffee, and deep family conversations.",
    star: "Revati",
    rashi: "Meena (Pisces)",
    gothram: "Bharadwaja",
    food_habit: "vegetarian",
    moderation_status: "approved",
    visibility: "visible",
    is_demo: true,
  },
  {
    profile_code: "SBM-DEMO-09",
    display_name: "Srikar Medapati",
    gender: "groom",
    age: 32,
    height_cm: 176,
    marital_status: "never_married",
    community: "Shettibalija",
    mother_tongue: "Telugu",
    native_place: "Kakinada",
    city: "Hyderabad",
    state: "Telangana",
    education: "M.S. in Cyber Security (Georgia Tech)",
    occupation: "Information Security Manager",
    family_summary:
      "Joint family in Kakinada with wholesale trade business. Father is a merchant association member; mother is a homemaker.",
    about_me:
      "Working with a cloud security provider in Hyderabad. Believer in mutual respect, quiet confidence, and supporting each other's aspirations.",
    star: "Ashwini",
    rashi: "Mesha (Aries)",
    gothram: "Viswamitra",
    food_habit: "eggetarian",
    moderation_status: "approved",
    visibility: "visible",
    is_demo: true,
  },
  {
    profile_code: "SBM-DEMO-10",
    display_name: "Sireesha Bandaru",
    gender: "bride",
    age: 26,
    height_cm: 160,
    marital_status: "never_married",
    community: "Shettibalija",
    mother_tongue: "Telugu",
    native_place: "Amalapuram",
    city: "Vijayawada",
    state: "Andhra Pradesh",
    education: "B.Tech in Electronics, MBA",
    occupation: "Product Marketing Manager",
    family_summary:
      "Father is an assistant commissioner in state tax; mother is a veena player and homemaker. Elder brother is a doctor in Guntur.",
    about_me:
      "Leading digital product campaigns in Vijayawada. Cheerful, family-oriented, and love celebrating festivals with authentic traditional rituals.",
    star: "Punardasu",
    rashi: "Mithuna (Gemini)",
    gothram: "Vasishta",
    food_habit: "vegetarian",
    moderation_status: "approved",
    visibility: "visible",
    is_demo: true,
  },
  {
    profile_code: "SBM-DEMO-11",
    display_name: "Kalyan Chodavarapu",
    gender: "groom",
    age: 27,
    height_cm: 181,
    marital_status: "never_married",
    community: "Shettibalija",
    mother_tongue: "Telugu",
    native_place: "Bhimavaram",
    city: "Bengaluru",
    state: "Karnataka",
    education: "B.Tech in Artificial Intelligence (IIT Hyderabad)",
    occupation: "Machine Learning Researcher",
    family_summary:
      "Cultured family in Bhimavaram. Father is an aquaculture business owner; mother is a homemaker. Younger sister is preparing for civil services.",
    about_me:
      "AI researcher working on generative models. Avid reader of Telugu poetry, badminton enthusiast, and deeply appreciative of Godavari hospitality.",
    star: "Chitra",
    rashi: "Tula (Libra)",
    gothram: "Kaundinya",
    food_habit: "eggetarian",
    moderation_status: "approved",
    visibility: "visible",
    is_demo: true,
  },
  {
    profile_code: "SBM-DEMO-12",
    display_name: "Meghana Nallamilli",
    gender: "bride",
    age: 25,
    height_cm: 166,
    marital_status: "never_married",
    community: "Shettibalija",
    mother_tongue: "Telugu",
    native_place: "Visakhapatnam",
    city: "Visakhapatnam",
    state: "Andhra Pradesh",
    education: "B.Arch, Master of Urban Planning",
    occupation: "Urban Design Consultant",
    family_summary:
      "Father is an officer in Visakhapatnam Port Authority; mother is a senior college lecturer. One younger brother doing engineering in Chennai.",
    about_me:
      "Urban planner working on coastal smart city initiatives. Value cultural roots, open communication, and looking forward to an enriching matrimonial journey.",
    star: "Dhanishta",
    rashi: "Makara (Capricorn)",
    gothram: "Atri",
    food_habit: "vegetarian",
    moderation_status: "approved",
    visibility: "visible",
    is_demo: true,
  },
];

async function seed() {
  console.log("🌱 Starting idempotent seed of Shettibalija Matrimony demo profiles...");

  // First, find or create an anonymous system/demo owner if needed
  // We check existing profiles by profile_code
  let successCount = 0;

  for (const item of DEMO_PROFILES) {
    try {
      const { data: existing } = await supabase
        .from("matrimonial_profiles")
        .select("id, profile_code")
        .eq("profile_code", item.profile_code)
        .maybeSingle();

      if (existing) {
        const { error } = await supabase
          .from("matrimonial_profiles")
          .update({
            ...item,
            updated_at: new Date().toISOString(),
          })
          .eq("id", existing.id);

        if (error) {
          console.warn(`Update note for ${item.profile_code}:`, error.message);
        } else {
          successCount++;
        }
      } else {
        const { error } = await supabase.from("matrimonial_profiles").insert(item);
        if (error) {
          console.warn(`Insert note for ${item.profile_code}:`, error.message);
        } else {
          successCount++;
        }
      }
    } catch (err) {
      console.warn(`Error processing ${item.profile_code}:`, err.message);
    }
  }

  console.log(
    `✅ Seed process completed. Processed ${successCount}/${DEMO_PROFILES.length} demo profiles.`,
  );
}

seed();
