import type { Tables } from "@/integrations/supabase/types";

type Profile = Tables<"matrimonial_profiles">;
type PrivateDetails = Tables<"profile_private_details"> | null;
type Preferences = Tables<"partner_preferences"> | null;

const CHECKS = [
  { key: "display_name", weight: 10, ok: (p: Profile) => Boolean(p.display_name.trim()) },
  { key: "gender", weight: 8, ok: (p: Profile) => Boolean(p.gender) },
  { key: "age", weight: 8, ok: (p: Profile) => p.age >= 18 },
  { key: "height", weight: 6, ok: (p: Profile) => Boolean(p.height_cm) },
  { key: "location", weight: 8, ok: (p: Profile) => Boolean(p.city && p.state) },
  { key: "education", weight: 8, ok: (p: Profile) => Boolean(p.education) },
  { key: "occupation", weight: 8, ok: (p: Profile) => Boolean(p.occupation) },
  { key: "family", weight: 8, ok: (p: Profile) => Boolean(p.family_summary) },
  { key: "about", weight: 8, ok: (p: Profile) => Boolean(p.native_place) },
] as const;

export function profileCompletion(
  profile: Profile | null,
  privateDetails: PrivateDetails,
  preferences: Preferences,
  photoCount: number,
): { percent: number; missing: string[] } {
  if (!profile) return { percent: 0, missing: ["Create your matrimonial profile"] };

  let score = 0;
  const missing: string[] = [];
  const total = CHECKS.reduce((sum, item) => sum + item.weight, 0) + 18 + 10;

  for (const item of CHECKS) {
    if (item.ok(profile)) score += item.weight;
    else missing.push(item.key.replaceAll("_", " "));
  }

  if (privateDetails?.date_of_birth && privateDetails.father_occupation) score += 10;
  else missing.push("family details");

  if (preferences?.min_age && preferences.max_age) score += 8;
  else missing.push("partner preferences");

  if (photoCount > 0) score += 10;
  else missing.push("photos");

  return { percent: Math.min(100, Math.round((score / total) * 100)), missing };
}
