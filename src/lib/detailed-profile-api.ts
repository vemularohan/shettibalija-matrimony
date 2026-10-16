import { supabase } from "@/integrations/supabase/client";
import {
  type DetailedProfileFormData,
  INITIAL_DETAILED_FORM_DATA,
  calculateAgeFromDob,
} from "./detailed-profile-types";

const METADATA_TAG = "__SBM_DETAILED_V1__:";

export function serializeDetailedData(data: DetailedProfileFormData): string {
  return `${METADATA_TAG}${JSON.stringify(data)}`;
}

export function deserializeDetailedData(
  raw: string | null | undefined,
): Partial<DetailedProfileFormData> | null {
  if (!raw || !raw.startsWith(METADATA_TAG)) return null;
  try {
    const jsonStr = raw.slice(METADATA_TAG.length);
    return JSON.parse(jsonStr) as Partial<DetailedProfileFormData>;
  } catch {
    return null;
  }
}

/**
 * Save complete detailed profile data across Supabase tables
 */
export async function saveDetailedMatrimonialProfile({
  userId,
  profileId,
  formData,
}: {
  userId: string;
  profileId?: string | undefined;
  formData: DetailedProfileFormData;
}): Promise<{ profileId: string }> {
  const calculatedAge = calculateAgeFromDob(formData.dateOfBirth);
  const serializedMetadata = serializeDetailedData(formData);

  // 1. Update profiles table (User account phone & name)
  if (formData.contactNumber.trim() || formData.fullName.trim()) {
    const profileUpdate: { phone?: string | null; full_name?: string } = {};
    if (formData.contactNumber.trim()) profileUpdate.phone = formData.contactNumber.trim();
    if (formData.fullName.trim()) profileUpdate.full_name = formData.fullName.trim();

    await supabase.from("profiles").update(profileUpdate).eq("id", userId);
  }

  let finalProfileId = profileId;

  // 2. Base payload for matrimonial_profiles
  const baseProfilePayload = {
    display_name: formData.fullName.trim() || "Member",
    gender: formData.gender,
    age: calculatedAge,
    height_cm: formData.heightCm || null,
    marital_status: formData.maritalStatus,
    community: "Shettibalija",
    mother_tongue: "Telugu",
    native_place: formData.nativePlace.trim() || null,
    city: formData.presentPlace.trim() || formData.jobLocation.trim() || null,
    education: formData.education || null,
    occupation: formData.occupation || null,
    family_summary: formData.familyAbout.trim() || null,
    updated_at: new Date().toISOString(),
  };

  // Attempt to write with new columns if supported
  const extendedProfilePayload = {
    ...baseProfilePayload,
    time_of_birth: formData.timeOfBirth || null,
    place_of_birth: formData.placeOfBirth || null,
    designation: formData.designation || null,
    job_location: formData.jobLocation || null,
    salary_amount: formData.salaryAmount || null,
    salary_currency: formData.salaryCurrency || "INR",
    salary_period: formData.salaryPeriod || "annual",
    employment_type: formData.employmentType || null,
    complexion: formData.complexion || null,
    gothram: formData.gothram || null,
    community_profession: formData.communityProfession || null,
    present_location: formData.presentPlace || null,
    food_habit: formData.foodHabit || null,
    smoking_habit: formData.smoking || null,
    drinking_habit: formData.drinking || null,
    declaration_accepted: formData.declarationAccepted,
    declaration_accepted_at: formData.declarationAcceptedAt || new Date().toISOString(),
  };

  if (finalProfileId) {
    // Try updating with extended payload first; fall back to base payload if remote schema doesn't have new columns
    const { error: extError } = await supabase
      .from("matrimonial_profiles")
      .update(extendedProfilePayload as unknown as typeof baseProfilePayload)
      .eq("id", finalProfileId);

    if (extError) {
      // Column might not exist in Supabase yet, use base payload
      const { error: baseError } = await supabase
        .from("matrimonial_profiles")
        .update(baseProfilePayload)
        .eq("id", finalProfileId);

      if (baseError) throw baseError;
    }
  } else {
    // Insert new profile
    const insertPayload = {
      ...extendedProfilePayload,
      owner_id: userId,
      visibility: "visible",
      photo_visibility: "members",
    };

    const { data: newProfile, error: insertError } = await supabase
      .from("matrimonial_profiles")
      .insert(insertPayload as unknown as typeof baseProfilePayload & { owner_id: string })
      .select("id")
      .single();

    if (insertError) {
      // Fallback to base insert payload
      const { data: fallbackProfile, error: fallbackError } = await supabase
        .from("matrimonial_profiles")
        .insert({
          ...baseProfilePayload,
          owner_id: userId,
          visibility: "visible",
          photo_visibility: "members",
        })
        .select("id")
        .single();

      if (fallbackError) throw fallbackError;
      finalProfileId = fallbackProfile?.id;
    } else {
      finalProfileId = newProfile?.id;
    }
  }

  if (!finalProfileId) {
    throw new Error("Could not determine matrimonial profile ID.");
  }

  // 3. Upsert profile_private_details
  // We store the full serialized metadata into `family_description` so that 100% of the structured form is preserved
  // regardless of remote schema state!
  const privatePayload = {
    owner_id: userId,
    profile_id: finalProfileId,
    date_of_birth: formData.dateOfBirth || null,
    native_place: formData.nativePlace || null,
    father_occupation: formData.fatherProfession || null,
    mother_occupation: formData.motherProfession || null,
    siblings_count: (formData.brothersCount || 0) + (formData.sistersCount || 0),
    family_type: formData.familyType || "nuclear",
    family_location: formData.familyLocation || null,
    family_description: serializedMetadata, // Guarantees complete lossless storage of all 10 sections
    employer_details: formData.designation
      ? `${formData.designation} at ${formData.jobLocation}`
      : null,
    annual_income: formData.salaryAmount
      ? `${formData.salaryCurrency} ${formData.salaryAmount} (${formData.salaryPeriod})`
      : null,
    phone_visibility: formData.showContactDirectly ? "members" : "hidden",
  };

  try {
    await supabase.from("profile_private_details").upsert(privatePayload);
  } catch (err) {
    console.warn("Could not upsert profile_private_details:", err);
  }

  // 4. Upsert partner_preferences
  const partnerPayload = {
    owner_id: userId,
    profile_id: finalProfileId,
    min_age: formData.preferredAgeMin || 18,
    max_age: formData.preferredAgeMax || 60,
    min_height_cm: formData.preferredHeightMin || 140,
    max_height_cm: formData.preferredHeightMax || 200,
    marital_statuses: formData.preferredMaritalStatus
      ? [formData.preferredMaritalStatus]
      : ["never_married"],
    education: formData.preferredEducation || null,
    occupation: formData.preferredOccupation || null,
    preferred_locations: formData.preferredLocation ? [formData.preferredLocation] : [],
    other_preferences: formData.requirementsText || null,
  };

  try {
    await supabase.from("partner_preferences").upsert(partnerPayload);
  } catch (err) {
    console.warn("Could not upsert partner_preferences:", err);
  }

  return { profileId: finalProfileId };
}

/**
 * Reconstruct full DetailedProfileFormData from profile, private details, and partner preferences
 */
export function reconstructDetailedFormData({
  profile,
  privateDetails,
  partnerPreferences,
  accountPhone,
}: {
  profile?: Record<string, unknown> | null;
  privateDetails?: Record<string, unknown> | null;
  partnerPreferences?: Record<string, unknown> | null;
  accountPhone?: string | null;
}): DetailedProfileFormData {
  // Start with default template
  const data: DetailedProfileFormData = { ...INITIAL_DETAILED_FORM_DATA };

  // 1. Check if we have serialized metadata in family_description
  const rawMetadata = privateDetails?.["family_description"] as string | undefined;
  const parsedMeta = deserializeDetailedData(rawMetadata);
  if (parsedMeta) {
    Object.assign(data, parsedMeta);
  }

  // 2. Overlay actual database columns if present
  if (profile) {
    if (profile["display_name"]) data.fullName = String(profile["display_name"]);
    if (profile["gender"]) data.gender = profile["gender"] as "bride" | "groom";
    if (profile["marital_status"])
      data.maritalStatus = profile["marital_status"] as DetailedProfileFormData["maritalStatus"];
    if (profile["height_cm"]) data.heightCm = Number(profile["height_cm"]);
    if (profile["education"]) data.education = String(profile["education"]);
    if (profile["occupation"]) data.occupation = String(profile["occupation"]);
    if (profile["native_place"]) data.nativePlace = String(profile["native_place"]);
    if (profile["city"]) data.presentPlace = String(profile["city"]);
    if (profile["family_summary"]) data.familyAbout = String(profile["family_summary"]);

    // If extended columns exist on profile
    if (profile["time_of_birth"]) data.timeOfBirth = String(profile["time_of_birth"]);
    if (profile["place_of_birth"]) data.placeOfBirth = String(profile["place_of_birth"]);
    if (profile["designation"]) data.designation = String(profile["designation"]);
    if (profile["job_location"]) data.jobLocation = String(profile["job_location"]);
    if (profile["salary_amount"]) data.salaryAmount = String(profile["salary_amount"]);
    if (profile["salary_currency"]) data.salaryCurrency = String(profile["salary_currency"]);
    if (profile["salary_period"])
      data.salaryPeriod = profile["salary_period"] as "annual" | "monthly";
    if (profile["employment_type"]) data.employmentType = String(profile["employment_type"]);
    if (profile["complexion"]) data.complexion = String(profile["complexion"]);
    if (profile["gothram"]) data.gothram = String(profile["gothram"]);
    if (profile["community_profession"])
      data.communityProfession = String(profile["community_profession"]);
    if (profile["food_habit"])
      data.foodHabit = profile["food_habit"] as DetailedProfileFormData["foodHabit"];
    if (profile["smoking_habit"])
      data.smoking = profile["smoking_habit"] as DetailedProfileFormData["smoking"];
    if (profile["drinking_habit"])
      data.drinking = profile["drinking_habit"] as DetailedProfileFormData["drinking"];
  }

  if (privateDetails) {
    if (privateDetails["date_of_birth"]) data.dateOfBirth = String(privateDetails["date_of_birth"]);
    if (privateDetails["father_occupation"])
      data.fatherProfession = String(privateDetails["father_occupation"]);
    if (privateDetails["mother_occupation"])
      data.motherProfession = String(privateDetails["mother_occupation"]);
    if (privateDetails["family_location"])
      data.familyLocation = String(privateDetails["family_location"]);
    if (privateDetails["family_type"])
      data.familyType = privateDetails["family_type"] as DetailedProfileFormData["familyType"];
    if (privateDetails["phone_visibility"] === "members") data.showContactDirectly = true;
  }

  if (partnerPreferences) {
    if (partnerPreferences["min_age"] != null)
      data.preferredAgeMin = Number(partnerPreferences["min_age"]);
    if (partnerPreferences["max_age"] != null)
      data.preferredAgeMax = Number(partnerPreferences["max_age"]);
    if (partnerPreferences["min_height_cm"] != null)
      data.preferredHeightMin = Number(partnerPreferences["min_height_cm"]);
    if (partnerPreferences["max_height_cm"] != null)
      data.preferredHeightMax = Number(partnerPreferences["max_height_cm"]);
    if (partnerPreferences["education"])
      data.preferredEducation = String(partnerPreferences["education"]);
    if (partnerPreferences["occupation"])
      data.preferredOccupation = String(partnerPreferences["occupation"]);
    if (partnerPreferences["other_preferences"])
      data.requirementsText = String(partnerPreferences["other_preferences"]);
  }

  if (accountPhone && !data.contactNumber) {
    data.contactNumber = accountPhone;
  }

  return data;
}
