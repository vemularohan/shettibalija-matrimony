import { DEMO_PROFILES_DATA } from "./demo-profiles-data.mjs";
import fs from "node:fs";

function esc(val) {
  if (val === null || val === undefined) return "NULL";
  if (typeof val === "boolean") return val ? "true" : "false";
  if (typeof val === "number") return val.toString();
  if (Array.isArray(val)) {
    return `array[${val.map((x) => `'${x.replace(/'/g, "''")}'`).join(", ")}]`;
  }
  return `'${val.replace(/'/g, "''")}'`;
}

let sql = `-- Full Seed of 50 Demo Members for Shettibalija Matrimony
create or replace function public.seed_all_demo_profiles()
returns table(inserted_count integer, approved_count integer)
language plpgsql
security definer
set search_path = public
as $$
declare
  v_inserted integer := 0;
  v_approved integer := 0;
begin
`;

for (const p of DEMO_PROFILES_DATA) {
  const uid = p.id;
  const email = p.email;
  const fullName = p.display_name;
  const gender = p.gender;

  sql += `
  -- Member ${p.index}: ${fullName} (${p.profile_code})
  insert into auth.users (
    id, instance_id, aud, role, email, encrypted_password,
    email_confirmed_at, raw_app_meta_data, raw_user_meta_data, created_at, updated_at
  ) values (
    '${uid}'::uuid,
    '00000000-0000-0000-0000-000000000000',
    'authenticated', 'authenticated',
    '${email}',
    crypt('DemoPass123!', gen_salt('bf')),
    now(),
    jsonb_build_object('provider', 'email', 'providers', array['email']),
    jsonb_build_object('full_name', ${esc(fullName)}, 'gender', ${esc(gender)}),
    now(), now()
  ) on conflict (id) do update
  set email = excluded.email,
      raw_user_meta_data = excluded.raw_user_meta_data,
      updated_at = now();

  insert into public.profiles (
    id, full_name, gender, account_type, account_status, created_at, updated_at
  ) values (
    '${uid}'::uuid,
    ${esc(fullName)},
    ${esc(gender)},
    'self',
    'active',
    now(), now()
  ) on conflict (id) do update
  set full_name = excluded.full_name,
      gender = excluded.gender,
      updated_at = now();

  insert into public.matrimonial_profiles (
    id, owner_id, profile_code, display_name, gender, age, height_cm,
    marital_status, community, mother_tongue, native_place, present_location,
    city, state, education, occupation, designation, job_location, employment_type,
    salary_amount, salary_currency, salary_period, community_profession,
    complexion, food_habit, smoking_habit, drinking_habit, citizenship, languages,
    star, rashi, gothram, time_of_birth, place_of_birth, horoscope_available,
    about_me, family_summary, has_profile_photo, photo_visibility, visibility,
    moderation_status, declaration_accepted, declaration_accepted_at, verified_at,
    is_demo, created_at, updated_at
  ) values (
    '${uid}'::uuid,
    '${uid}'::uuid,
    ${esc(p.profile_code)},
    ${esc(p.display_name)},
    ${esc(p.gender)},
    ${p.age},
    ${p.height_cm},
    ${esc(p.marital_status)},
    'Shettibalija',
    'Telugu',
    ${esc(p.native_place)},
    ${esc(p.present_location)},
    ${esc(p.city)},
    ${esc(p.state)},
    ${esc(p.education)},
    ${esc(p.occupation)},
    ${esc(p.designation)},
    ${esc(p.job_location)},
    ${esc(p.employment_type)},
    ${esc(p.salary_amount)},
    ${esc(p.salary_currency)},
    ${esc(p.salary_period)},
    ${esc(p.community_profession)},
    ${esc(p.complexion)},
    ${esc(p.food_habit)},
    ${esc(p.smoking_habit)},
    ${esc(p.drinking_habit)},
    ${esc(p.citizenship)},
    ${esc(p.languages)},
    ${esc(p.star)},
    ${esc(p.rashi)},
    ${esc(p.gothram)},
    ${esc(p.time_of_birth)},
    ${esc(p.place_of_birth)},
    ${esc(p.horoscope_available)},
    ${esc(p.about_me)},
    ${esc(p.family.family_details)},
    ${p.has_profile_photo ? "true" : "false"},
    'members',
    ${esc(p.visibility)},
    ${esc(p.moderation_status)},
    true, now(),
    ${p.verified ? "now()" : "NULL"},
    true, now(), now()
  ) on conflict (id) do update
  set display_name = excluded.display_name,
      age = excluded.age,
      height_cm = excluded.height_cm,
      marital_status = excluded.marital_status,
      native_place = excluded.native_place,
      present_location = excluded.present_location,
      city = excluded.city,
      state = excluded.state,
      education = excluded.education,
      occupation = excluded.occupation,
      designation = excluded.designation,
      job_location = excluded.job_location,
      employment_type = excluded.employment_type,
      salary_amount = excluded.salary_amount,
      community_profession = excluded.community_profession,
      complexion = excluded.complexion,
      food_habit = excluded.food_habit,
      star = excluded.star,
      rashi = excluded.rashi,
      gothram = excluded.gothram,
      about_me = excluded.about_me,
      family_summary = excluded.family_summary,
      has_profile_photo = excluded.has_profile_photo,
      visibility = excluded.visibility,
      moderation_status = excluded.moderation_status,
      verified_at = excluded.verified_at,
      is_demo = true,
      updated_at = now();

  insert into public.profile_private_details (
    profile_id, owner_id, date_of_birth, email, native_place
  ) values (
    '${uid}'::uuid,
    '${uid}'::uuid,
    '${p.dob}'::date,
    '${email}',
    ${esc(p.native_place)}
  ) on conflict (profile_id) do update
  set date_of_birth = excluded.date_of_birth,
      email = excluded.email,
      native_place = excluded.native_place;

  insert into public.family_details (
    profile_id, owner_id, father_name, father_profession,
    mother_name, mother_profession, brothers_count, sisters_count,
    brothers_details, sisters_details, family_type, family_location, family_details
  ) values (
    '${uid}'::uuid,
    '${uid}'::uuid,
    ${esc(p.family.father_name)},
    ${esc(p.family.father_profession)},
    ${esc(p.family.mother_name)},
    ${esc(p.family.mother_profession)},
    ${p.family.brothers_count},
    ${p.family.sisters_count},
    ${esc(p.family.brothers_details)},
    ${esc(p.family.sisters_details)},
    ${esc(p.family.family_type)},
    ${esc(p.family.family_location)},
    ${esc(p.family.family_details)}
  ) on conflict (profile_id) do update
  set father_name = excluded.father_name,
      father_profession = excluded.father_profession,
      mother_name = excluded.mother_name,
      mother_profession = excluded.mother_profession,
      brothers_count = excluded.brothers_count,
      sisters_count = excluded.sisters_count,
      brothers_details = excluded.brothers_details,
      sisters_details = excluded.sisters_details,
      family_type = excluded.family_type,
      family_location = excluded.family_location,
      family_details = excluded.family_details,
      updated_at = now();

  insert into public.horoscope_details (
    profile_id, owner_id, horoscope_available, star, rashi, gothram
  ) values (
    '${uid}'::uuid,
    '${uid}'::uuid,
    ${p.horoscope_available ? "true" : "false"},
    ${esc(p.star)},
    ${esc(p.rashi)},
    ${esc(p.gothram)}
  ) on conflict (profile_id) do update
  set horoscope_available = excluded.horoscope_available,
      star = excluded.star,
      rashi = excluded.rashi,
      gothram = excluded.gothram,
      updated_at = now();

  insert into public.partner_preferences (
    profile_id, owner_id, preferred_min_age, preferred_max_age,
    preferred_min_height_cm, preferred_max_height_cm, preferred_marital_status,
    preferred_education, preferred_occupation, preferred_locations,
    preferred_food_habit, requirements_text
  ) values (
    '${uid}'::uuid,
    '${uid}'::uuid,
    ${p.partner_preferences.min_age},
    ${p.partner_preferences.max_age},
    ${p.partner_preferences.min_height},
    ${p.partner_preferences.max_height},
    ${esc(p.partner_preferences.marital_status)},
    ${esc(p.partner_preferences.education)},
    ${esc(p.partner_preferences.occupation)},
    ${esc(p.partner_preferences.locations)},
    ${esc(p.partner_preferences.food_habit)},
    ${esc(p.partner_preferences.requirements)}
  ) on conflict (profile_id) do update
  set preferred_min_age = excluded.preferred_min_age,
      preferred_max_age = excluded.preferred_max_age,
      preferred_min_height_cm = excluded.preferred_min_height_cm,
      preferred_max_height_cm = excluded.preferred_max_height_cm,
      preferred_marital_status = excluded.preferred_marital_status,
      preferred_education = excluded.preferred_education,
      preferred_occupation = excluded.preferred_occupation,
      preferred_locations = excluded.preferred_locations,
      preferred_food_habit = excluded.preferred_food_habit,
      requirements_text = excluded.requirements_text;
`;

  if (p.has_profile_photo && p.photo_url) {
    sql += `
  insert into public.profile_photos (
    profile_id, owner_id, storage_path, is_primary, consented
  ) values (
    '${uid}'::uuid,
    '${uid}'::uuid,
    ${esc(p.photo_url)},
    true, true
  ) on conflict (storage_path) do update
  set profile_id = excluded.profile_id,
      owner_id = excluded.owner_id,
      is_primary = true;
`;
  }
}

sql += `
  -- Create sample interaction: Member G01 expresses interest in Bride B01
  insert into public.interests (
    from_user_id, to_profile_id, status, message, created_at, updated_at
  ) values (
    '00000000-0000-4000-a000-000000000026'::uuid,
    '00000000-0000-4000-a000-000000000001'::uuid,
    'pending',
    'Namaste Harika garu, I came across your profile and found our backgrounds and values very aligned. Would be glad to connect.',
    now(), now()
  ) on conflict (from_user_id, to_profile_id) do update
  set status = excluded.status, message = excluded.message;

  -- Create sample shortlist: Bride B01 shortlists Groom G01
  insert into public.shortlisted_profiles (
    owner_id, profile_id, notes, created_at
  ) values (
    '00000000-0000-4000-a000-000000000001'::uuid,
    '00000000-0000-4000-a000-000000000026'::uuid,
    'Good match from Amalapuram, software lead in Hyderabad.',
    now()
  ) on conflict (owner_id, profile_id) do nothing;

  select count(*) into v_inserted from public.matrimonial_profiles where is_demo = true;
  select count(*) into v_approved from public.approved_matrimonial_profiles where is_demo = true;

  return query select v_inserted, v_approved;
end;
$$;

grant execute on function public.seed_all_demo_profiles() to anon, authenticated;
`;

fs.writeFileSync("supabase/migrations/migration_d_demo_seed_system.sql", sql, "utf-8");
console.log("Generated migration_d_demo_seed_system.sql successfully.");
