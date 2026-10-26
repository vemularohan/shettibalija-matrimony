-- Full Seed of 50 Demo Members for Shettibalija Matrimony
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

  -- Member 1: Harika Vemula (SB-DEMO-B01)
  insert into auth.users (
    id, instance_id, aud, role, email, encrypted_password,
    email_confirmed_at, raw_app_meta_data, raw_user_meta_data, created_at, updated_at
  ) values (
    '00000000-0000-4000-a000-000000000001'::uuid,
    '00000000-0000-0000-0000-000000000000',
    'authenticated', 'authenticated',
    'demo-b01@shettibalijamatrimony.internal',
    crypt('DemoPass123!', gen_salt('bf')),
    now(),
    jsonb_build_object('provider', 'email', 'providers', array['email']),
    jsonb_build_object('full_name', 'Harika Vemula', 'gender', 'bride'),
    now(), now()
  ) on conflict (id) do update
  set email = excluded.email,
      raw_user_meta_data = excluded.raw_user_meta_data,
      updated_at = now();

  insert into public.profiles (
    id, full_name, gender, account_type, account_status, created_at, updated_at
  ) values (
    '00000000-0000-4000-a000-000000000001'::uuid,
    'Harika Vemula',
    'bride',
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
    '00000000-0000-4000-a000-000000000001'::uuid,
    '00000000-0000-4000-a000-000000000001'::uuid,
    'SB-DEMO-B01',
    'Harika Vemula',
    'bride',
    24,
    163,
    'never_married',
    'Shettibalija',
    'Telugu',
    'Amalapuram',
    'Hyderabad',
    'Hyderabad',
    'Telangana',
    'B.Tech in Electronics & Communication (JNTU Kakinada)',
    'Software Engineer',
    'Software Engineer',
    'Hyderabad',
    'Full-time',
    '₹7.5 Lakhs',
    'INR',
    'annual',
    'Agriculture & Business',
    'Wheatish',
    'vegetarian',
    'No',
    'No',
    'Indian',
    array['Telugu', 'English'],
    'Rohini',
    'Vrishabha (Taurus)',
    'Kasyapa',
    '07:15 AM',
    'Amalapuram',
    true,
    'I work as an application developer in Hyderabad while keeping strong ties to our Konaseema hometown. I enjoy traditional Telugu music, evening badminton with colleagues, and visiting family during festivals. Looking for a progressive, well-mannered partner who respects family values and encourages mutual growth.',
    'Traditional Godavari family with respected agricultural background in Amalapuram. Grounded in cultural ethics and close family bonds.',
    true,
    'members',
    'visible',
    'approved',
    true, now(),
    now(),
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
    '00000000-0000-4000-a000-000000000001'::uuid,
    '00000000-0000-4000-a000-000000000001'::uuid,
    '2002-05-14'::date,
    'demo-b01@shettibalijamatrimony.internal',
    'Amalapuram'
  ) on conflict (profile_id) do update
  set date_of_birth = excluded.date_of_birth,
      email = excluded.email,
      native_place = excluded.native_place;

  insert into public.family_details (
    profile_id, owner_id, father_name, father_profession,
    mother_name, mother_profession, brothers_count, sisters_count,
    brothers_details, sisters_details, family_type, family_location, family_details
  ) values (
    '00000000-0000-4000-a000-000000000001'::uuid,
    '00000000-0000-4000-a000-000000000001'::uuid,
    'Satyanarayana Vemula',
    'Coconut Plantation & Agricultural Landowner',
    'Lakshmi Vemula',
    'Homemaker',
    1,
    0,
    'Younger brother studying B.Tech at VIT',
    NULL,
    'Nuclear',
    'Amalapuram, Konaseema Dist',
    'Traditional Godavari family with respected agricultural background in Amalapuram. Grounded in cultural ethics and close family bonds.'
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
    '00000000-0000-4000-a000-000000000001'::uuid,
    '00000000-0000-4000-a000-000000000001'::uuid,
    true,
    'Rohini',
    'Vrishabha (Taurus)',
    'Kasyapa'
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
    '00000000-0000-4000-a000-000000000001'::uuid,
    '00000000-0000-4000-a000-000000000001'::uuid,
    26,
    30,
    172,
    185,
    array['never_married'],
    'B.Tech / M.Tech / MBA / MS',
    'Software / Corporate / Govt Officer',
    array['Hyderabad', 'Bengaluru', 'Visakhapatnam'],
    'vegetarian',
    'Looking for an educated, caring companion from a respectable family with good communication and clean habits.'
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

  insert into public.profile_photos (
    profile_id, owner_id, storage_path, is_primary, consented
  ) values (
    '00000000-0000-4000-a000-000000000001'::uuid,
    '00000000-0000-4000-a000-000000000001'::uuid,
    '/images/profiles/demo-bride-01.jpg?p=B01',
    true, true
  ) on conflict (storage_path) do update
  set profile_id = excluded.profile_id,
      owner_id = excluded.owner_id,
      is_primary = true;

  -- Member 2: Dr. Sirisha Rayudu (SB-DEMO-B02)
  insert into auth.users (
    id, instance_id, aud, role, email, encrypted_password,
    email_confirmed_at, raw_app_meta_data, raw_user_meta_data, created_at, updated_at
  ) values (
    '00000000-0000-4000-a000-000000000002'::uuid,
    '00000000-0000-0000-0000-000000000000',
    'authenticated', 'authenticated',
    'demo-b02@shettibalijamatrimony.internal',
    crypt('DemoPass123!', gen_salt('bf')),
    now(),
    jsonb_build_object('provider', 'email', 'providers', array['email']),
    jsonb_build_object('full_name', 'Dr. Sirisha Rayudu', 'gender', 'bride'),
    now(), now()
  ) on conflict (id) do update
  set email = excluded.email,
      raw_user_meta_data = excluded.raw_user_meta_data,
      updated_at = now();

  insert into public.profiles (
    id, full_name, gender, account_type, account_status, created_at, updated_at
  ) values (
    '00000000-0000-4000-a000-000000000002'::uuid,
    'Dr. Sirisha Rayudu',
    'bride',
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
    '00000000-0000-4000-a000-000000000002'::uuid,
    '00000000-0000-4000-a000-000000000002'::uuid,
    'SB-DEMO-B02',
    'Dr. Sirisha Rayudu',
    'bride',
    28,
    165,
    'never_married',
    'Shettibalija',
    'Telugu',
    'Kakinada',
    'Visakhapatnam',
    'Visakhapatnam',
    'Andhra Pradesh',
    'MBBS, MD General Medicine (Andhra Medical College)',
    'Resident Physician',
    'Senior Resident Doctor',
    'Visakhapatnam',
    'Government / Hospital',
    '₹14 Lakhs',
    'INR',
    'annual',
    'Medical & Education',
    'Fair',
    'vegetarian',
    'No',
    'No',
    'Indian',
    array['Telugu', 'English', 'Hindi'],
    'Uttara Phalguni',
    'Kanya (Virgo)',
    'Viswamitra',
    '06:40 AM',
    'Kakinada',
    true,
    'Practicing medicine at King George Hospital, Visakhapatnam. Medicine is my vocation and family is my foundation. I enjoy quiet coffee breaks, reading contemporary non-fiction, and classical vocal concerts. Seeking an understanding life partner who appreciates dedication and values mutual respect in a marriage.',
    'Academic, highly educated family residing in Kakinada. Deep respect for education, community service, and classical arts.',
    true,
    'members',
    'visible',
    'approved',
    true, now(),
    now(),
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
    '00000000-0000-4000-a000-000000000002'::uuid,
    '00000000-0000-4000-a000-000000000002'::uuid,
    '1998-09-21'::date,
    'demo-b02@shettibalijamatrimony.internal',
    'Kakinada'
  ) on conflict (profile_id) do update
  set date_of_birth = excluded.date_of_birth,
      email = excluded.email,
      native_place = excluded.native_place;

  insert into public.family_details (
    profile_id, owner_id, father_name, father_profession,
    mother_name, mother_profession, brothers_count, sisters_count,
    brothers_details, sisters_details, family_type, family_location, family_details
  ) values (
    '00000000-0000-4000-a000-000000000002'::uuid,
    '00000000-0000-4000-a000-000000000002'::uuid,
    'Subba Rao Rayudu',
    'Retired District Educational Officer (DEO)',
    'Saraswathi Rayudu',
    'Lecturer in Telugu Literature',
    1,
    0,
    'Elder brother is an architect settled in Kakinada',
    NULL,
    'Nuclear',
    'Kakinada, Kakinada Dist',
    'Academic, highly educated family residing in Kakinada. Deep respect for education, community service, and classical arts.'
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
    '00000000-0000-4000-a000-000000000002'::uuid,
    '00000000-0000-4000-a000-000000000002'::uuid,
    true,
    'Uttara Phalguni',
    'Kanya (Virgo)',
    'Viswamitra'
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
    '00000000-0000-4000-a000-000000000002'::uuid,
    '00000000-0000-4000-a000-000000000002'::uuid,
    29,
    33,
    175,
    188,
    array['never_married'],
    'Doctor / Post Graduate / Senior Professional',
    'Doctor / Civil Services / Tech Lead',
    array['Visakhapatnam', 'Hyderabad', 'Vijayawada'],
    'vegetarian',
    'Preferably a doctor or professionally qualified gentleman who values work-life balance and supportive partnership.'
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

  insert into public.profile_photos (
    profile_id, owner_id, storage_path, is_primary, consented
  ) values (
    '00000000-0000-4000-a000-000000000002'::uuid,
    '00000000-0000-4000-a000-000000000002'::uuid,
    '/images/profiles/demo-bride-02.jpg?p=B02',
    true, true
  ) on conflict (storage_path) do update
  set profile_id = excluded.profile_id,
      owner_id = excluded.owner_id,
      is_primary = true;

  -- Member 3: Keerthana Koppisetti (SB-DEMO-B03)
  insert into auth.users (
    id, instance_id, aud, role, email, encrypted_password,
    email_confirmed_at, raw_app_meta_data, raw_user_meta_data, created_at, updated_at
  ) values (
    '00000000-0000-4000-a000-000000000003'::uuid,
    '00000000-0000-0000-0000-000000000000',
    'authenticated', 'authenticated',
    'demo-b03@shettibalijamatrimony.internal',
    crypt('DemoPass123!', gen_salt('bf')),
    now(),
    jsonb_build_object('provider', 'email', 'providers', array['email']),
    jsonb_build_object('full_name', 'Keerthana Koppisetti', 'gender', 'bride'),
    now(), now()
  ) on conflict (id) do update
  set email = excluded.email,
      raw_user_meta_data = excluded.raw_user_meta_data,
      updated_at = now();

  insert into public.profiles (
    id, full_name, gender, account_type, account_status, created_at, updated_at
  ) values (
    '00000000-0000-4000-a000-000000000003'::uuid,
    'Keerthana Koppisetti',
    'bride',
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
    '00000000-0000-4000-a000-000000000003'::uuid,
    '00000000-0000-4000-a000-000000000003'::uuid,
    'SB-DEMO-B03',
    'Keerthana Koppisetti',
    'bride',
    25,
    168,
    'never_married',
    'Shettibalija',
    'Telugu',
    'Rajahmundry',
    'Bengaluru',
    'Bengaluru',
    'Karnataka',
    'B.Tech in Computer Science (NIT Warangal)',
    'Cloud Solutions Engineer',
    'Cloud Solutions Architect',
    'Bengaluru',
    'Full-time',
    '₹22 Lakhs',
    'INR',
    'annual',
    'Business & Engineering',
    'Fair',
    'eggetarian',
    'No',
    'No',
    'Indian',
    array['Telugu', 'English', 'Kannada'],
    'Swati',
    'Tula (Libra)',
    'Bharadwaja',
    '09:30 AM',
    'Rajahmundry',
    true,
    'Working with cloud infrastructure at a premier tech firm in Bengaluru. I love trekking in the Western Ghats, weekend baking, and Godavari culinary traditions. I am looking for a warm, ambitious partner who is optimistic, enjoys good conversations, and values shared cultural identity.',
    'Reputed merchant family in Rajahmundry. Known for commercial integrity, philanthropic support for local temples, and progressive mindset.',
    true,
    'members',
    'visible',
    'approved',
    true, now(),
    now(),
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
    '00000000-0000-4000-a000-000000000003'::uuid,
    '00000000-0000-4000-a000-000000000003'::uuid,
    '2001-11-03'::date,
    'demo-b03@shettibalijamatrimony.internal',
    'Rajahmundry'
  ) on conflict (profile_id) do update
  set date_of_birth = excluded.date_of_birth,
      email = excluded.email,
      native_place = excluded.native_place;

  insert into public.family_details (
    profile_id, owner_id, father_name, father_profession,
    mother_name, mother_profession, brothers_count, sisters_count,
    brothers_details, sisters_details, family_type, family_location, family_details
  ) values (
    '00000000-0000-4000-a000-000000000003'::uuid,
    '00000000-0000-4000-a000-000000000003'::uuid,
    'Venkateswara Rao Koppisetti',
    'Wholesale Textile & Garment Merchant',
    'Padmavathi Koppisetti',
    'Homemaker',
    0,
    1,
    NULL,
    'Elder sister married to an engineer in Chennai',
    'Nuclear',
    'Rajahmundry, East Godavari',
    'Reputed merchant family in Rajahmundry. Known for commercial integrity, philanthropic support for local temples, and progressive mindset.'
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
    '00000000-0000-4000-a000-000000000003'::uuid,
    '00000000-0000-4000-a000-000000000003'::uuid,
    true,
    'Swati',
    'Tula (Libra)',
    'Bharadwaja'
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
    '00000000-0000-4000-a000-000000000003'::uuid,
    '00000000-0000-4000-a000-000000000003'::uuid,
    27,
    31,
    175,
    188,
    array['never_married'],
    'B.Tech / M.Tech / MBA',
    'Software Architect / Product Manager / Entrepreneur',
    array['Bengaluru', 'Hyderabad', 'Abroad'],
    'any',
    'Looking for an intelligent, fun-loving partner with strong family orientation and independent thinking.'
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

  insert into public.profile_photos (
    profile_id, owner_id, storage_path, is_primary, consented
  ) values (
    '00000000-0000-4000-a000-000000000003'::uuid,
    '00000000-0000-4000-a000-000000000003'::uuid,
    '/images/profiles/demo-bride-03.jpg?p=B03',
    true, true
  ) on conflict (storage_path) do update
  set profile_id = excluded.profile_id,
      owner_id = excluded.owner_id,
      is_primary = true;

  -- Member 4: Sravani Pilli (SB-DEMO-B04)
  insert into auth.users (
    id, instance_id, aud, role, email, encrypted_password,
    email_confirmed_at, raw_app_meta_data, raw_user_meta_data, created_at, updated_at
  ) values (
    '00000000-0000-4000-a000-000000000004'::uuid,
    '00000000-0000-0000-0000-000000000000',
    'authenticated', 'authenticated',
    'demo-b04@shettibalijamatrimony.internal',
    crypt('DemoPass123!', gen_salt('bf')),
    now(),
    jsonb_build_object('provider', 'email', 'providers', array['email']),
    jsonb_build_object('full_name', 'Sravani Pilli', 'gender', 'bride'),
    now(), now()
  ) on conflict (id) do update
  set email = excluded.email,
      raw_user_meta_data = excluded.raw_user_meta_data,
      updated_at = now();

  insert into public.profiles (
    id, full_name, gender, account_type, account_status, created_at, updated_at
  ) values (
    '00000000-0000-4000-a000-000000000004'::uuid,
    'Sravani Pilli',
    'bride',
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
    '00000000-0000-4000-a000-000000000004'::uuid,
    '00000000-0000-4000-a000-000000000004'::uuid,
    'SB-DEMO-B04',
    'Sravani Pilli',
    'bride',
    26,
    160,
    'never_married',
    'Shettibalija',
    'Telugu',
    'Bhimavaram',
    'Vijayawada',
    'Vijayawada',
    'Andhra Pradesh',
    'M.Sc in Biotechnology (Andhra University)',
    'Quality Control Analyst',
    'Senior Quality Specialist',
    'Vijayawada',
    'Full-time',
    '₹8 Lakhs',
    'INR',
    'annual',
    'Aquaculture & Industry',
    'Wheatish',
    'vegetarian',
    'No',
    'No',
    'Indian',
    array['Telugu', 'English'],
    'Anuradha',
    'Vrishchika (Scorpio)',
    'Kaundinya',
    '04:20 PM',
    'Bhimavaram',
    true,
    'Working in pharmaceutical quality analysis in Vijayawada. I enjoy classical Kuchipudi dance, caring for plants, and festival cooking with family. Seeking an earnest, down-to-earth person who believes in mutual respect and maintaining joyful family relationships.',
    'Well-established Godavari joint family with rich agricultural and aquaculture background. Warm, hospitable, and deeply community-rooted.',
    true,
    'members',
    'visible',
    'approved',
    true, now(),
    now(),
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
    '00000000-0000-4000-a000-000000000004'::uuid,
    '00000000-0000-4000-a000-000000000004'::uuid,
    '2000-03-18'::date,
    'demo-b04@shettibalijamatrimony.internal',
    'Bhimavaram'
  ) on conflict (profile_id) do update
  set date_of_birth = excluded.date_of_birth,
      email = excluded.email,
      native_place = excluded.native_place;

  insert into public.family_details (
    profile_id, owner_id, father_name, father_profession,
    mother_name, mother_profession, brothers_count, sisters_count,
    brothers_details, sisters_details, family_type, family_location, family_details
  ) values (
    '00000000-0000-4000-a000-000000000004'::uuid,
    '00000000-0000-4000-a000-000000000004'::uuid,
    'Rambabu Pilli',
    'Aqua Feed Distributor & Farm Owner',
    'Sita Mahalakshmi Pilli',
    'Homemaker',
    1,
    1,
    'Elder brother manages the family business in Bhimavaram',
    'Younger sister studying pharmacy',
    'Joint',
    'Bhimavaram, West Godavari',
    'Well-established Godavari joint family with rich agricultural and aquaculture background. Warm, hospitable, and deeply community-rooted.'
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
    '00000000-0000-4000-a000-000000000004'::uuid,
    '00000000-0000-4000-a000-000000000004'::uuid,
    true,
    'Anuradha',
    'Vrishchika (Scorpio)',
    'Kaundinya'
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
    '00000000-0000-4000-a000-000000000004'::uuid,
    '00000000-0000-4000-a000-000000000004'::uuid,
    27,
    31,
    170,
    182,
    array['never_married'],
    'Graduate / Post Graduate',
    'Business / Software / State Govt',
    array['Vijayawada', 'Guntur', 'Hyderabad', 'Bhimavaram'],
    'vegetarian',
    'A culturally grounded, kind-hearted gentleman with stable career and good family background.'
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

  insert into public.profile_photos (
    profile_id, owner_id, storage_path, is_primary, consented
  ) values (
    '00000000-0000-4000-a000-000000000004'::uuid,
    '00000000-0000-4000-a000-000000000004'::uuid,
    '/images/profiles/demo-bride-04.jpg?p=B04',
    true, true
  ) on conflict (storage_path) do update
  set profile_id = excluded.profile_id,
      owner_id = excluded.owner_id,
      is_primary = true;

  -- Member 5: Divya Battula (SB-DEMO-B05)
  insert into auth.users (
    id, instance_id, aud, role, email, encrypted_password,
    email_confirmed_at, raw_app_meta_data, raw_user_meta_data, created_at, updated_at
  ) values (
    '00000000-0000-4000-a000-000000000005'::uuid,
    '00000000-0000-0000-0000-000000000000',
    'authenticated', 'authenticated',
    'demo-b05@shettibalijamatrimony.internal',
    crypt('DemoPass123!', gen_salt('bf')),
    now(),
    jsonb_build_object('provider', 'email', 'providers', array['email']),
    jsonb_build_object('full_name', 'Divya Battula', 'gender', 'bride'),
    now(), now()
  ) on conflict (id) do update
  set email = excluded.email,
      raw_user_meta_data = excluded.raw_user_meta_data,
      updated_at = now();

  insert into public.profiles (
    id, full_name, gender, account_type, account_status, created_at, updated_at
  ) values (
    '00000000-0000-4000-a000-000000000005'::uuid,
    'Divya Battula',
    'bride',
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
    '00000000-0000-4000-a000-000000000005'::uuid,
    '00000000-0000-4000-a000-000000000005'::uuid,
    'SB-DEMO-B05',
    'Divya Battula',
    'bride',
    27,
    162,
    'never_married',
    'Shettibalija',
    'Telugu',
    'Machilipatnam',
    'Hyderabad',
    'Hyderabad',
    'Telangana',
    'Chartered Accountant (FCA, ICAI)',
    'Senior Financial Analyst',
    'Assistant Manager - M&A Tax',
    'Hyderabad',
    'Full-time',
    '₹15 Lakhs',
    'INR',
    'annual',
    'Finance & Trade',
    'Wheatish',
    'vegetarian',
    'No',
    'No',
    'Indian',
    array['Telugu', 'English', 'Hindi'],
    'Ashwini',
    'Mesha (Aries)',
    'Vasishta',
    '11:15 AM',
    'Machilipatnam',
    true,
    'Chartered Accountant currently working with corporate advisory at Deloitte Hyderabad. I appreciate disciplined work ethics, weekend road trips, and exploring South Indian filter coffee spots. Looking for a partner who is emotionally mature, career-oriented, and believes in equal companionship.',
    'Finance and service background family settled in Hyderabad. Emphasis on integrity, financial prudence, and progressive outlook.',
    true,
    'members',
    'visible',
    'approved',
    true, now(),
    now(),
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
    '00000000-0000-4000-a000-000000000005'::uuid,
    '00000000-0000-4000-a000-000000000005'::uuid,
    '1999-07-29'::date,
    'demo-b05@shettibalijamatrimony.internal',
    'Machilipatnam'
  ) on conflict (profile_id) do update
  set date_of_birth = excluded.date_of_birth,
      email = excluded.email,
      native_place = excluded.native_place;

  insert into public.family_details (
    profile_id, owner_id, father_name, father_profession,
    mother_name, mother_profession, brothers_count, sisters_count,
    brothers_details, sisters_details, family_type, family_location, family_details
  ) values (
    '00000000-0000-4000-a000-000000000005'::uuid,
    '00000000-0000-4000-a000-000000000005'::uuid,
    'Nagabhushanam Battula',
    'Chief Accounts Officer (Retired)',
    'Parvathi Battula',
    'School Teacher',
    0,
    1,
    NULL,
    'Younger sister working at Wipro Hyderabad',
    'Nuclear',
    'Hyderabad & Machilipatnam',
    'Finance and service background family settled in Hyderabad. Emphasis on integrity, financial prudence, and progressive outlook.'
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
    '00000000-0000-4000-a000-000000000005'::uuid,
    '00000000-0000-4000-a000-000000000005'::uuid,
    true,
    'Ashwini',
    'Mesha (Aries)',
    'Vasishta'
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
    '00000000-0000-4000-a000-000000000005'::uuid,
    '00000000-0000-4000-a000-000000000005'::uuid,
    28,
    32,
    172,
    185,
    array['never_married'],
    'CA / MBA / B.Tech / Civil Services',
    'Finance / Tech / Banking / Management',
    array['Hyderabad', 'Bengaluru', 'Mumbai'],
    'vegetarian',
    'A pleasant, professional individual with clear career goals, humor, and respect for elderly family members.'
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

  insert into public.profile_photos (
    profile_id, owner_id, storage_path, is_primary, consented
  ) values (
    '00000000-0000-4000-a000-000000000005'::uuid,
    '00000000-0000-4000-a000-000000000005'::uuid,
    '/images/profiles/demo-bride-01.jpg?p=B05',
    true, true
  ) on conflict (storage_path) do update
  set profile_id = excluded.profile_id,
      owner_id = excluded.owner_id,
      is_primary = true;

  -- Member 6: Lahari Challa (SB-DEMO-B06)
  insert into auth.users (
    id, instance_id, aud, role, email, encrypted_password,
    email_confirmed_at, raw_app_meta_data, raw_user_meta_data, created_at, updated_at
  ) values (
    '00000000-0000-4000-a000-000000000006'::uuid,
    '00000000-0000-0000-0000-000000000000',
    'authenticated', 'authenticated',
    'demo-b06@shettibalijamatrimony.internal',
    crypt('DemoPass123!', gen_salt('bf')),
    now(),
    jsonb_build_object('provider', 'email', 'providers', array['email']),
    jsonb_build_object('full_name', 'Lahari Challa', 'gender', 'bride'),
    now(), now()
  ) on conflict (id) do update
  set email = excluded.email,
      raw_user_meta_data = excluded.raw_user_meta_data,
      updated_at = now();

  insert into public.profiles (
    id, full_name, gender, account_type, account_status, created_at, updated_at
  ) values (
    '00000000-0000-4000-a000-000000000006'::uuid,
    'Lahari Challa',
    'bride',
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
    '00000000-0000-4000-a000-000000000006'::uuid,
    '00000000-0000-4000-a000-000000000006'::uuid,
    'SB-DEMO-B06',
    'Lahari Challa',
    'bride',
    23,
    157,
    'never_married',
    'Shettibalija',
    'Telugu',
    'Eluru',
    'Eluru',
    'Eluru',
    'Andhra Pradesh',
    'B.Com, MBA in HR (Acharya Nagarjuna University)',
    'HR Executive',
    'Talent Acquisition Specialist',
    'Vijayawada',
    'Full-time',
    '₹5.5 Lakhs',
    'INR',
    'annual',
    'Employee & Trade',
    'Fair',
    'vegetarian',
    'No',
    'No',
    'Indian',
    array['Telugu', 'English'],
    'Revati',
    'Meena (Pisces)',
    'Atri',
    '08:10 AM',
    'Eluru',
    true,
    'Working in human resources for a tech logistics firm. I am cheerful, deeply connected to my parents, and fond of pencil sketching and devotional music. Seeking a loving and supportive partner who values simplicity, honesty, and family unity.',
    'Warm and traditional family based in Eluru. Close-knit relatives with high standing in community affairs and cultural festivals.',
    true,
    'members',
    'visible',
    'approved',
    true, now(),
    now(),
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
    '00000000-0000-4000-a000-000000000006'::uuid,
    '00000000-0000-4000-a000-000000000006'::uuid,
    '2003-01-12'::date,
    'demo-b06@shettibalijamatrimony.internal',
    'Eluru'
  ) on conflict (profile_id) do update
  set date_of_birth = excluded.date_of_birth,
      email = excluded.email,
      native_place = excluded.native_place;

  insert into public.family_details (
    profile_id, owner_id, father_name, father_profession,
    mother_name, mother_profession, brothers_count, sisters_count,
    brothers_details, sisters_details, family_type, family_location, family_details
  ) values (
    '00000000-0000-4000-a000-000000000006'::uuid,
    '00000000-0000-4000-a000-000000000006'::uuid,
    'Prabhakar Rao Challa',
    'Government Polytechnic Officer',
    'Anasuya Challa',
    'Homemaker',
    1,
    0,
    'Elder brother is a civil engineer in Vijayawada',
    NULL,
    'Nuclear',
    'Eluru, Eluru Dist',
    'Warm and traditional family based in Eluru. Close-knit relatives with high standing in community affairs and cultural festivals.'
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
    '00000000-0000-4000-a000-000000000006'::uuid,
    '00000000-0000-4000-a000-000000000006'::uuid,
    true,
    'Revati',
    'Meena (Pisces)',
    'Atri'
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
    '00000000-0000-4000-a000-000000000006'::uuid,
    '00000000-0000-4000-a000-000000000006'::uuid,
    25,
    28,
    168,
    180,
    array['never_married'],
    'B.Tech / MBA / MCA',
    'IT / Private / Banking',
    array['Vijayawada', 'Hyderabad', 'Eluru', 'Guntur'],
    'vegetarian',
    'A soft-spoken, responsible person from a cultured Telugu family with clean habits.'
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

  insert into public.profile_photos (
    profile_id, owner_id, storage_path, is_primary, consented
  ) values (
    '00000000-0000-4000-a000-000000000006'::uuid,
    '00000000-0000-4000-a000-000000000006'::uuid,
    '/images/profiles/demo-bride-02.jpg?p=B06',
    true, true
  ) on conflict (storage_path) do update
  set profile_id = excluded.profile_id,
      owner_id = excluded.owner_id,
      is_primary = true;

  -- Member 7: Bhavya Grandhi (SB-DEMO-B07)
  insert into auth.users (
    id, instance_id, aud, role, email, encrypted_password,
    email_confirmed_at, raw_app_meta_data, raw_user_meta_data, created_at, updated_at
  ) values (
    '00000000-0000-4000-a000-000000000007'::uuid,
    '00000000-0000-0000-0000-000000000000',
    'authenticated', 'authenticated',
    'demo-b07@shettibalijamatrimony.internal',
    crypt('DemoPass123!', gen_salt('bf')),
    now(),
    jsonb_build_object('provider', 'email', 'providers', array['email']),
    jsonb_build_object('full_name', 'Bhavya Grandhi', 'gender', 'bride'),
    now(), now()
  ) on conflict (id) do update
  set email = excluded.email,
      raw_user_meta_data = excluded.raw_user_meta_data,
      updated_at = now();

  insert into public.profiles (
    id, full_name, gender, account_type, account_status, created_at, updated_at
  ) values (
    '00000000-0000-4000-a000-000000000007'::uuid,
    'Bhavya Grandhi',
    'bride',
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
    '00000000-0000-4000-a000-000000000007'::uuid,
    '00000000-0000-4000-a000-000000000007'::uuid,
    'SB-DEMO-B07',
    'Bhavya Grandhi',
    'bride',
    29,
    166,
    'never_married',
    'Shettibalija',
    'Telugu',
    'Kakinada',
    'Hyderabad',
    'Hyderabad',
    'Telangana',
    'M.Tech in Structural Engineering (JNTUH)',
    'Civil Design Engineer',
    'Senior Structural Engineer',
    'Hyderabad',
    'Full-time',
    '₹16 Lakhs',
    'INR',
    'annual',
    'Contractor & Engineering',
    'Wheatish',
    'eggetarian',
    'No',
    'No',
    'Indian',
    array['Telugu', 'English'],
    'Dhanishta',
    'Makara (Capricorn)',
    'Harita',
    '03:45 PM',
    'Kakinada',
    true,
    'Designing major infrastructure and commercial buildings with Larsen & Toubro. Beyond engineering calculations, I have a passion for carnatic violin, weekend cycling, and heritage architecture. Looking for a progressive life companion who believes in teamwork, active lifestyle, and mutual career support.',
    'Reputed engineering and contracting family. Highly focused on quality construction and community development projects.',
    true,
    'members',
    'visible',
    'approved',
    true, now(),
    now(),
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
    '00000000-0000-4000-a000-000000000007'::uuid,
    '00000000-0000-4000-a000-000000000007'::uuid,
    '1997-08-15'::date,
    'demo-b07@shettibalijamatrimony.internal',
    'Kakinada'
  ) on conflict (profile_id) do update
  set date_of_birth = excluded.date_of_birth,
      email = excluded.email,
      native_place = excluded.native_place;

  insert into public.family_details (
    profile_id, owner_id, father_name, father_profession,
    mother_name, mother_profession, brothers_count, sisters_count,
    brothers_details, sisters_details, family_type, family_location, family_details
  ) values (
    '00000000-0000-4000-a000-000000000007'::uuid,
    '00000000-0000-4000-a000-000000000007'::uuid,
    'Mallikarjuna Grandhi',
    'Civil Contractor & Infrastructure Developer',
    'Bhavani Grandhi',
    'Homemaker',
    1,
    0,
    'Younger brother is an architect in Bengaluru',
    NULL,
    'Nuclear',
    'Hyderabad & Kakinada',
    'Reputed engineering and contracting family. Highly focused on quality construction and community development projects.'
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
    '00000000-0000-4000-a000-000000000007'::uuid,
    '00000000-0000-4000-a000-000000000007'::uuid,
    true,
    'Dhanishta',
    'Makara (Capricorn)',
    'Harita'
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
    '00000000-0000-4000-a000-000000000007'::uuid,
    '00000000-0000-4000-a000-000000000007'::uuid,
    30,
    34,
    174,
    188,
    array['never_married'],
    'B.Tech / M.Tech / MBA / MS',
    'Engineer / Architect / Project Lead',
    array['Hyderabad', 'Bengaluru', 'Chennai'],
    'any',
    'Looking for an open-minded, ambitious partner who values mutual understanding and has a warm sense of humor.'
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

  insert into public.profile_photos (
    profile_id, owner_id, storage_path, is_primary, consented
  ) values (
    '00000000-0000-4000-a000-000000000007'::uuid,
    '00000000-0000-4000-a000-000000000007'::uuid,
    '/images/profiles/demo-bride-03.jpg?p=B07',
    true, true
  ) on conflict (storage_path) do update
  set profile_id = excluded.profile_id,
      owner_id = excluded.owner_id,
      is_primary = true;

  -- Member 8: Swathi Nallamilli (SB-DEMO-B08)
  insert into auth.users (
    id, instance_id, aud, role, email, encrypted_password,
    email_confirmed_at, raw_app_meta_data, raw_user_meta_data, created_at, updated_at
  ) values (
    '00000000-0000-4000-a000-000000000008'::uuid,
    '00000000-0000-0000-0000-000000000000',
    'authenticated', 'authenticated',
    'demo-b08@shettibalijamatrimony.internal',
    crypt('DemoPass123!', gen_salt('bf')),
    now(),
    jsonb_build_object('provider', 'email', 'providers', array['email']),
    jsonb_build_object('full_name', 'Swathi Nallamilli', 'gender', 'bride'),
    now(), now()
  ) on conflict (id) do update
  set email = excluded.email,
      raw_user_meta_data = excluded.raw_user_meta_data,
      updated_at = now();

  insert into public.profiles (
    id, full_name, gender, account_type, account_status, created_at, updated_at
  ) values (
    '00000000-0000-4000-a000-000000000008'::uuid,
    'Swathi Nallamilli',
    'bride',
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
    '00000000-0000-4000-a000-000000000008'::uuid,
    '00000000-0000-4000-a000-000000000008'::uuid,
    'SB-DEMO-B08',
    'Swathi Nallamilli',
    'bride',
    26,
    164,
    'never_married',
    'Shettibalija',
    'Telugu',
    'Amalapuram',
    'Chennai',
    'Chennai',
    'Tamil Nadu',
    'B.Tech in Information Technology (SRM University)',
    'Software Engineer',
    'Frontend Tech Lead',
    'Chennai',
    'Full-time',
    '₹18 Lakhs',
    'INR',
    'annual',
    'Trader & Landowner',
    'Dusky',
    'non_vegetarian',
    'No',
    'No',
    'Indian',
    array['Telugu', 'English', 'Tamil'],
    'Hasta',
    'Kanya (Virgo)',
    'Agastya',
    '01:25 PM',
    'Amalapuram',
    true,
    'Leading a frontend UI engineering team at Zoho Chennai. I love creative interface design, swimming, and exploring coastal cuisines. I am seeking a dependable, thoughtful life partner who values career ambitions and cherishes traditional Telugu roots.',
    'Respected merchant family from Amalapuram with agricultural landholdings. Values warmth, honesty, and broad-minded perspective.',
    true,
    'members',
    'visible',
    'approved',
    true, now(),
    now(),
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
    '00000000-0000-4000-a000-000000000008'::uuid,
    '00000000-0000-4000-a000-000000000008'::uuid,
    '2000-10-24'::date,
    'demo-b08@shettibalijamatrimony.internal',
    'Amalapuram'
  ) on conflict (profile_id) do update
  set date_of_birth = excluded.date_of_birth,
      email = excluded.email,
      native_place = excluded.native_place;

  insert into public.family_details (
    profile_id, owner_id, father_name, father_profession,
    mother_name, mother_profession, brothers_count, sisters_count,
    brothers_details, sisters_details, family_type, family_location, family_details
  ) values (
    '00000000-0000-4000-a000-000000000008'::uuid,
    '00000000-0000-4000-a000-000000000008'::uuid,
    'Srirama Murthy Nallamilli',
    'Paddy Merchant & Rice Mill Partner',
    'Varalakshmi Nallamilli',
    'Homemaker',
    0,
    1,
    NULL,
    'Elder sister married to software lead in Hyderabad',
    'Nuclear',
    'Amalapuram, Konaseema',
    'Respected merchant family from Amalapuram with agricultural landholdings. Values warmth, honesty, and broad-minded perspective.'
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
    '00000000-0000-4000-a000-000000000008'::uuid,
    '00000000-0000-4000-a000-000000000008'::uuid,
    true,
    'Hasta',
    'Kanya (Virgo)',
    'Agastya'
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
    '00000000-0000-4000-a000-000000000008'::uuid,
    '00000000-0000-4000-a000-000000000008'::uuid,
    27,
    31,
    172,
    185,
    array['never_married'],
    'B.Tech / MS / MBA',
    'Tech / Product / Consulting',
    array['Chennai', 'Bengaluru', 'Hyderabad'],
    'any',
    'A progressive, supportive person who enjoys engaging discussions and respects family ties.'
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

  insert into public.profile_photos (
    profile_id, owner_id, storage_path, is_primary, consented
  ) values (
    '00000000-0000-4000-a000-000000000008'::uuid,
    '00000000-0000-4000-a000-000000000008'::uuid,
    '/images/profiles/demo-bride-04.jpg?p=B08',
    true, true
  ) on conflict (storage_path) do update
  set profile_id = excluded.profile_id,
      owner_id = excluded.owner_id,
      is_primary = true;

  -- Member 9: Tejaswini Medisetti (SB-DEMO-B09)
  insert into auth.users (
    id, instance_id, aud, role, email, encrypted_password,
    email_confirmed_at, raw_app_meta_data, raw_user_meta_data, created_at, updated_at
  ) values (
    '00000000-0000-4000-a000-000000000009'::uuid,
    '00000000-0000-0000-0000-000000000000',
    'authenticated', 'authenticated',
    'demo-b09@shettibalijamatrimony.internal',
    crypt('DemoPass123!', gen_salt('bf')),
    now(),
    jsonb_build_object('provider', 'email', 'providers', array['email']),
    jsonb_build_object('full_name', 'Tejaswini Medisetti', 'gender', 'bride'),
    now(), now()
  ) on conflict (id) do update
  set email = excluded.email,
      raw_user_meta_data = excluded.raw_user_meta_data,
      updated_at = now();

  insert into public.profiles (
    id, full_name, gender, account_type, account_status, created_at, updated_at
  ) values (
    '00000000-0000-4000-a000-000000000009'::uuid,
    'Tejaswini Medisetti',
    'bride',
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
    '00000000-0000-4000-a000-000000000009'::uuid,
    '00000000-0000-4000-a000-000000000009'::uuid,
    'SB-DEMO-B09',
    'Tejaswini Medisetti',
    'bride',
    28,
    165,
    'never_married',
    'Shettibalija',
    'Telugu',
    'Rajahmundry',
    'Hyderabad',
    'Hyderabad',
    'Telangana',
    'B.Arch, Master of Urban Planning (CEPT University)',
    'Urban Planner',
    'Associate Urban Design Consultant',
    'Hyderabad',
    'Full-time',
    '₹13 Lakhs',
    'INR',
    'annual',
    'Business & Real Estate',
    'Wheatish',
    'vegetarian',
    'No',
    'No',
    'Indian',
    array['Telugu', 'English', 'Hindi'],
    'Mrigashira',
    'Mithuna (Gemini)',
    'Sandilya',
    '10:50 AM',
    'Rajahmundry',
    true,
    'Working on urban renewal and green public infrastructure projects. I love photography, weekend gardening, and Telugu literature. Looking for an understanding partner who values professional drive while keeping family togetherness at the center.',
    'Prominent commercial family with dealerships across Godavari districts. Forward-looking, hospitable, and community-minded.',
    true,
    'members',
    'visible',
    'approved',
    true, now(),
    now(),
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
    '00000000-0000-4000-a000-000000000009'::uuid,
    '00000000-0000-4000-a000-000000000009'::uuid,
    '1998-04-06'::date,
    'demo-b09@shettibalijamatrimony.internal',
    'Rajahmundry'
  ) on conflict (profile_id) do update
  set date_of_birth = excluded.date_of_birth,
      email = excluded.email,
      native_place = excluded.native_place;

  insert into public.family_details (
    profile_id, owner_id, father_name, father_profession,
    mother_name, mother_profession, brothers_count, sisters_count,
    brothers_details, sisters_details, family_type, family_location, family_details
  ) values (
    '00000000-0000-4000-a000-000000000009'::uuid,
    '00000000-0000-4000-a000-000000000009'::uuid,
    'Venkatapathi Medisetti',
    'Automobile Dealership Owner',
    'Subhadra Medisetti',
    'Homemaker',
    1,
    0,
    'Younger brother completed MBA, joining family business',
    NULL,
    'Nuclear',
    'Rajahmundry & Hyderabad',
    'Prominent commercial family with dealerships across Godavari districts. Forward-looking, hospitable, and community-minded.'
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
    '00000000-0000-4000-a000-000000000009'::uuid,
    '00000000-0000-4000-a000-000000000009'::uuid,
    true,
    'Mrigashira',
    'Mithuna (Gemini)',
    'Sandilya'
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
    '00000000-0000-4000-a000-000000000009'::uuid,
    '00000000-0000-4000-a000-000000000009'::uuid,
    29,
    33,
    174,
    186,
    array['never_married'],
    'Master''s / Professional Degree',
    'Architect / Engineer / Business Executive',
    array['Hyderabad', 'Bengaluru', 'Visakhapatnam'],
    'vegetarian',
    'Cultured, responsible gentleman with modern thinking and respect for cultural traditions.'
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

  insert into public.profile_photos (
    profile_id, owner_id, storage_path, is_primary, consented
  ) values (
    '00000000-0000-4000-a000-000000000009'::uuid,
    '00000000-0000-4000-a000-000000000009'::uuid,
    '/images/profiles/demo-bride-01.jpg?p=B09',
    true, true
  ) on conflict (storage_path) do update
  set profile_id = excluded.profile_id,
      owner_id = excluded.owner_id,
      is_primary = true;

  -- Member 10: Manasa Vendra (SB-DEMO-B10)
  insert into auth.users (
    id, instance_id, aud, role, email, encrypted_password,
    email_confirmed_at, raw_app_meta_data, raw_user_meta_data, created_at, updated_at
  ) values (
    '00000000-0000-4000-a000-000000000010'::uuid,
    '00000000-0000-0000-0000-000000000000',
    'authenticated', 'authenticated',
    'demo-b10@shettibalijamatrimony.internal',
    crypt('DemoPass123!', gen_salt('bf')),
    now(),
    jsonb_build_object('provider', 'email', 'providers', array['email']),
    jsonb_build_object('full_name', 'Manasa Vendra', 'gender', 'bride'),
    now(), now()
  ) on conflict (id) do update
  set email = excluded.email,
      raw_user_meta_data = excluded.raw_user_meta_data,
      updated_at = now();

  insert into public.profiles (
    id, full_name, gender, account_type, account_status, created_at, updated_at
  ) values (
    '00000000-0000-4000-a000-000000000010'::uuid,
    'Manasa Vendra',
    'bride',
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
    '00000000-0000-4000-a000-000000000010'::uuid,
    '00000000-0000-4000-a000-000000000010'::uuid,
    'SB-DEMO-B10',
    'Manasa Vendra',
    'bride',
    25,
    158,
    'never_married',
    'Shettibalija',
    'Telugu',
    'Visakhapatnam',
    'Visakhapatnam',
    'Visakhapatnam',
    'Andhra Pradesh',
    'B.Pharmacy, Pharm.D (Andhra University)',
    'Clinical Pharmacist',
    'Clinical Specialist',
    'Visakhapatnam',
    'Hospital',
    '₹6.8 Lakhs',
    'INR',
    'annual',
    'Healthcare & Pharmacy',
    'Fair',
    'vegetarian',
    'No',
    'No',
    'Indian',
    array['Telugu', 'English'],
    'Pushya',
    'Karkataka (Cancer)',
    'Gautama',
    '05:00 AM',
    'Visakhapatnam',
    true,
    'Working as a clinical specialist at Care Hospitals Visakhapatnam. Passionate about patient counseling and pharmacology. In my free time, I enjoy beachside strolls, yoga, and listening to Ilaiyaraaja melodies. Seeking an amicable, grounded partner from a loving family.',
    'Public sector executive family residing in steel plant township. Calm, disciplined, and very affectionate towards extended family.',
    true,
    'members',
    'visible',
    'approved',
    true, now(),
    now(),
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
    '00000000-0000-4000-a000-000000000010'::uuid,
    '00000000-0000-4000-a000-000000000010'::uuid,
    '2001-06-30'::date,
    'demo-b10@shettibalijamatrimony.internal',
    'Visakhapatnam'
  ) on conflict (profile_id) do update
  set date_of_birth = excluded.date_of_birth,
      email = excluded.email,
      native_place = excluded.native_place;

  insert into public.family_details (
    profile_id, owner_id, father_name, father_profession,
    mother_name, mother_profession, brothers_count, sisters_count,
    brothers_details, sisters_details, family_type, family_location, family_details
  ) values (
    '00000000-0000-4000-a000-000000000010'::uuid,
    '00000000-0000-4000-a000-000000000010'::uuid,
    'Appala Naidu Vendra',
    'Senior Administrative Officer, Vizag Steel Plant',
    'Lalitha Vendra',
    'Homemaker',
    1,
    0,
    'Elder brother is a software engineer in Pune',
    NULL,
    'Nuclear',
    'Visakhapatnam, AP',
    'Public sector executive family residing in steel plant township. Calm, disciplined, and very affectionate towards extended family.'
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
    '00000000-0000-4000-a000-000000000010'::uuid,
    '00000000-0000-4000-a000-000000000010'::uuid,
    true,
    'Pushya',
    'Karkataka (Cancer)',
    'Gautama'
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
    '00000000-0000-4000-a000-000000000010'::uuid,
    '00000000-0000-4000-a000-000000000010'::uuid,
    26,
    30,
    168,
    180,
    array['never_married'],
    'Graduate / Post Graduate',
    'Private / IT / Banking / Govt',
    array['Visakhapatnam', 'Hyderabad', 'Vijayawada'],
    'vegetarian',
    'A caring, well-mannered person who believes in shared happiness and mutual understanding.'
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

  insert into public.profile_photos (
    profile_id, owner_id, storage_path, is_primary, consented
  ) values (
    '00000000-0000-4000-a000-000000000010'::uuid,
    '00000000-0000-4000-a000-000000000010'::uuid,
    '/images/profiles/demo-bride-02.jpg?p=B10',
    true, true
  ) on conflict (storage_path) do update
  set profile_id = excluded.profile_id,
      owner_id = excluded.owner_id,
      is_primary = true;

  -- Member 11: Nandini Ganta (SB-DEMO-B11)
  insert into auth.users (
    id, instance_id, aud, role, email, encrypted_password,
    email_confirmed_at, raw_app_meta_data, raw_user_meta_data, created_at, updated_at
  ) values (
    '00000000-0000-4000-a000-000000000011'::uuid,
    '00000000-0000-0000-0000-000000000000',
    'authenticated', 'authenticated',
    'demo-b11@shettibalijamatrimony.internal',
    crypt('DemoPass123!', gen_salt('bf')),
    now(),
    jsonb_build_object('provider', 'email', 'providers', array['email']),
    jsonb_build_object('full_name', 'Nandini Ganta', 'gender', 'bride'),
    now(), now()
  ) on conflict (id) do update
  set email = excluded.email,
      raw_user_meta_data = excluded.raw_user_meta_data,
      updated_at = now();

  insert into public.profiles (
    id, full_name, gender, account_type, account_status, created_at, updated_at
  ) values (
    '00000000-0000-4000-a000-000000000011'::uuid,
    'Nandini Ganta',
    'bride',
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
    '00000000-0000-4000-a000-000000000011'::uuid,
    '00000000-0000-4000-a000-000000000011'::uuid,
    'SB-DEMO-B11',
    'Nandini Ganta',
    'bride',
    30,
    167,
    'never_married',
    'Shettibalija',
    'Telugu',
    'Guntur',
    'Pune',
    'Pune',
    'Maharashtra',
    'B.Tech, MBA from Symbiosis Institute (Pune)',
    'Product Manager',
    'Senior Product Manager',
    'Pune',
    'Full-time',
    '₹26 Lakhs',
    'INR',
    'annual',
    'Corporate & Banking',
    'Fair',
    'vegetarian',
    'No',
    'No',
    'Indian',
    array['Telugu', 'English', 'Hindi', 'Marathi'],
    'Krittika',
    'Mesha (Aries)',
    'Kasyapa',
    '02:15 PM',
    'Guntur',
    true,
    'Senior Product Manager at Barclays Pune. I love leading fintech innovation, reading historical biographies, and staying fit through cross-fit training. Looking for an accomplished, emotionally intelligent gentleman who values open conversations and equal partnership.',
    'Highly regarded legal background family from Guntur. Liberal values, strong social standing, and deep philanthropic interest.',
    true,
    'members',
    'visible',
    'approved',
    true, now(),
    now(),
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
    '00000000-0000-4000-a000-000000000011'::uuid,
    '00000000-0000-4000-a000-000000000011'::uuid,
    '1996-12-19'::date,
    'demo-b11@shettibalijamatrimony.internal',
    'Guntur'
  ) on conflict (profile_id) do update
  set date_of_birth = excluded.date_of_birth,
      email = excluded.email,
      native_place = excluded.native_place;

  insert into public.family_details (
    profile_id, owner_id, father_name, father_profession,
    mother_name, mother_profession, brothers_count, sisters_count,
    brothers_details, sisters_details, family_type, family_location, family_details
  ) values (
    '00000000-0000-4000-a000-000000000011'::uuid,
    '00000000-0000-4000-a000-000000000011'::uuid,
    'Chandraiah Ganta',
    'Senior Advocate (Civil Law), Guntur Bar',
    'Kamakshi Ganta',
    'Homemaker',
    0,
    1,
    NULL,
    'Elder sister is an Associate Professor in Hyderabad',
    'Nuclear',
    'Guntur & Hyderabad',
    'Highly regarded legal background family from Guntur. Liberal values, strong social standing, and deep philanthropic interest.'
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
    '00000000-0000-4000-a000-000000000011'::uuid,
    '00000000-0000-4000-a000-000000000011'::uuid,
    true,
    'Krittika',
    'Mesha (Aries)',
    'Kasyapa'
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
    '00000000-0000-4000-a000-000000000011'::uuid,
    '00000000-0000-4000-a000-000000000011'::uuid,
    30,
    35,
    175,
    188,
    array['never_married'],
    'B.Tech / MBA / MS',
    'Tech Lead / Director / Investment Banker / Founder',
    array['Pune', 'Mumbai', 'Hyderabad', 'Bengaluru'],
    'any',
    'An ambitious, mature individual who communicates clearly and brings positivity into life.'
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

  insert into public.profile_photos (
    profile_id, owner_id, storage_path, is_primary, consented
  ) values (
    '00000000-0000-4000-a000-000000000011'::uuid,
    '00000000-0000-4000-a000-000000000011'::uuid,
    '/images/profiles/demo-bride-03.jpg?p=B11',
    true, true
  ) on conflict (storage_path) do update
  set profile_id = excluded.profile_id,
      owner_id = excluded.owner_id,
      is_primary = true;

  -- Member 12: Aishwarya Karri (SB-DEMO-B12)
  insert into auth.users (
    id, instance_id, aud, role, email, encrypted_password,
    email_confirmed_at, raw_app_meta_data, raw_user_meta_data, created_at, updated_at
  ) values (
    '00000000-0000-4000-a000-000000000012'::uuid,
    '00000000-0000-0000-0000-000000000000',
    'authenticated', 'authenticated',
    'demo-b12@shettibalijamatrimony.internal',
    crypt('DemoPass123!', gen_salt('bf')),
    now(),
    jsonb_build_object('provider', 'email', 'providers', array['email']),
    jsonb_build_object('full_name', 'Aishwarya Karri', 'gender', 'bride'),
    now(), now()
  ) on conflict (id) do update
  set email = excluded.email,
      raw_user_meta_data = excluded.raw_user_meta_data,
      updated_at = now();

  insert into public.profiles (
    id, full_name, gender, account_type, account_status, created_at, updated_at
  ) values (
    '00000000-0000-4000-a000-000000000012'::uuid,
    'Aishwarya Karri',
    'bride',
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
    '00000000-0000-4000-a000-000000000012'::uuid,
    '00000000-0000-4000-a000-000000000012'::uuid,
    'SB-DEMO-B12',
    'Aishwarya Karri',
    'bride',
    27,
    170,
    'never_married',
    'Shettibalija',
    'Telugu',
    'Kakinada',
    'Dubai',
    'Dubai',
    'UAE',
    'M.Sc in Data Science (University of Leeds, UK)',
    'Data Analyst',
    'Business Intelligence Lead',
    'Dubai',
    'Full-time',
    '160,000 AED',
    'AED',
    'annual',
    'Real Estate & Trading',
    'Wheatish',
    'eggetarian',
    'No',
    'No',
    'Indian',
    array['Telugu', 'English', 'Arabic (Basic)'],
    'Magha',
    'Simha (Leo)',
    'Viswamitra',
    '07:50 AM',
    'Kakinada',
    true,
    'Working as a Business Intelligence Lead with Emirates NBD Bank in Downtown Dubai. I love international travel, scuba diving, and hosting Telugu potlucks for friends. Looking for an ambitious, broad-minded partner working in UAE, India, or abroad.',
    'Global Telugu business family with roots in Kakinada. Balancing international exposure with deep adherence to Telugu festivals.',
    true,
    'members',
    'visible',
    'approved',
    true, now(),
    now(),
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
    '00000000-0000-4000-a000-000000000012'::uuid,
    '00000000-0000-4000-a000-000000000012'::uuid,
    '1999-02-11'::date,
    'demo-b12@shettibalijamatrimony.internal',
    'Kakinada'
  ) on conflict (profile_id) do update
  set date_of_birth = excluded.date_of_birth,
      email = excluded.email,
      native_place = excluded.native_place;

  insert into public.family_details (
    profile_id, owner_id, father_name, father_profession,
    mother_name, mother_profession, brothers_count, sisters_count,
    brothers_details, sisters_details, family_type, family_location, family_details
  ) values (
    '00000000-0000-4000-a000-000000000012'::uuid,
    '00000000-0000-4000-a000-000000000012'::uuid,
    'Dharma Rao Karri',
    'Commercial Real Estate Developer',
    'Rajyalakshmi Karri',
    'Homemaker',
    1,
    0,
    'Younger brother pursuing aviation in Hyderabad',
    NULL,
    'Nuclear',
    'Kakinada & Dubai',
    'Global Telugu business family with roots in Kakinada. Balancing international exposure with deep adherence to Telugu festivals.'
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
    '00000000-0000-4000-a000-000000000012'::uuid,
    '00000000-0000-4000-a000-000000000012'::uuid,
    true,
    'Magha',
    'Simha (Leo)',
    'Viswamitra'
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
    '00000000-0000-4000-a000-000000000012'::uuid,
    '00000000-0000-4000-a000-000000000012'::uuid,
    28,
    33,
    177,
    190,
    array['never_married'],
    'MS / MBA / B.Tech',
    'Finance / Consulting / Tech',
    array['Dubai', 'Abu Dhabi', 'Hyderabad', 'Bengaluru', 'USA'],
    'any',
    'Global mindset, strong communication, family-oriented, and supportive of career goals.'
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

  insert into public.profile_photos (
    profile_id, owner_id, storage_path, is_primary, consented
  ) values (
    '00000000-0000-4000-a000-000000000012'::uuid,
    '00000000-0000-4000-a000-000000000012'::uuid,
    '/images/profiles/demo-bride-04.jpg?p=B12',
    true, true
  ) on conflict (storage_path) do update
  set profile_id = excluded.profile_id,
      owner_id = excluded.owner_id,
      is_primary = true;

  -- Member 13: Pranavi Dommeti (SB-DEMO-B13)
  insert into auth.users (
    id, instance_id, aud, role, email, encrypted_password,
    email_confirmed_at, raw_app_meta_data, raw_user_meta_data, created_at, updated_at
  ) values (
    '00000000-0000-4000-a000-000000000013'::uuid,
    '00000000-0000-0000-0000-000000000000',
    'authenticated', 'authenticated',
    'demo-b13@shettibalijamatrimony.internal',
    crypt('DemoPass123!', gen_salt('bf')),
    now(),
    jsonb_build_object('provider', 'email', 'providers', array['email']),
    jsonb_build_object('full_name', 'Pranavi Dommeti', 'gender', 'bride'),
    now(), now()
  ) on conflict (id) do update
  set email = excluded.email,
      raw_user_meta_data = excluded.raw_user_meta_data,
      updated_at = now();

  insert into public.profiles (
    id, full_name, gender, account_type, account_status, created_at, updated_at
  ) values (
    '00000000-0000-4000-a000-000000000013'::uuid,
    'Pranavi Dommeti',
    'bride',
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
    '00000000-0000-4000-a000-000000000013'::uuid,
    '00000000-0000-4000-a000-000000000013'::uuid,
    'SB-DEMO-B13',
    'Pranavi Dommeti',
    'bride',
    24,
    162,
    'never_married',
    'Shettibalija',
    'Telugu',
    'Amalapuram',
    'Hyderabad',
    'Hyderabad',
    'Telangana',
    'B.Tech in Artificial Intelligence (IIT Hyderabad)',
    'AI Research Engineer',
    'Machine Learning Engineer',
    'Hyderabad',
    'Full-time',
    '₹32 Lakhs',
    'INR',
    'annual',
    'Agriculture & Academia',
    'Fair',
    'vegetarian',
    'No',
    'No',
    'Indian',
    array['Telugu', 'English'],
    'Chitra',
    'Tula (Libra)',
    'Bharadwaja',
    '06:10 PM',
    'Amalapuram',
    true,
    'AI engineer developing natural language models at Google India. I love learning classical languages, painting with water colors, and family reunions. Looking for an intellectually stimulating, compassionate life partner who shares an upbeat view on life.',
    'Highly academic and culturally distinguished family from Konaseema. Values education, intellectual curiosity, and grounded humility.',
    true,
    'members',
    'visible',
    'approved',
    true, now(),
    now(),
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
    '00000000-0000-4000-a000-000000000013'::uuid,
    '00000000-0000-4000-a000-000000000013'::uuid,
    '2002-08-04'::date,
    'demo-b13@shettibalijamatrimony.internal',
    'Amalapuram'
  ) on conflict (profile_id) do update
  set date_of_birth = excluded.date_of_birth,
      email = excluded.email,
      native_place = excluded.native_place;

  insert into public.family_details (
    profile_id, owner_id, father_name, father_profession,
    mother_name, mother_profession, brothers_count, sisters_count,
    brothers_details, sisters_details, family_type, family_location, family_details
  ) values (
    '00000000-0000-4000-a000-000000000013'::uuid,
    '00000000-0000-4000-a000-000000000013'::uuid,
    'Trimurtulu Dommeti',
    'Senior High School Principal (Retired)',
    'Vijayalakshmi Dommeti',
    'Homemaker',
    1,
    0,
    'Elder brother is an IPS probationer',
    NULL,
    'Nuclear',
    'Amalapuram & Hyderabad',
    'Highly academic and culturally distinguished family from Konaseema. Values education, intellectual curiosity, and grounded humility.'
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
    '00000000-0000-4000-a000-000000000013'::uuid,
    '00000000-0000-4000-a000-000000000013'::uuid,
    true,
    'Chitra',
    'Tula (Libra)',
    'Bharadwaja'
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
    '00000000-0000-4000-a000-000000000013'::uuid,
    '00000000-0000-4000-a000-000000000013'::uuid,
    26,
    30,
    172,
    185,
    array['never_married'],
    'IIT / NIT / B.Tech / MS / Civil Services',
    'Tech / Research / Civil Services / Entrepreneur',
    array['Hyderabad', 'Bengaluru', 'USA'],
    'vegetarian',
    'Bright, thoughtful companion with integrity, warmth, and strong emotional bonding.'
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

  insert into public.profile_photos (
    profile_id, owner_id, storage_path, is_primary, consented
  ) values (
    '00000000-0000-4000-a000-000000000013'::uuid,
    '00000000-0000-4000-a000-000000000013'::uuid,
    '/images/profiles/demo-bride-01.jpg?p=B13',
    true, true
  ) on conflict (storage_path) do update
  set profile_id = excluded.profile_id,
      owner_id = excluded.owner_id,
      is_primary = true;

  -- Member 14: Dr. Meghana Geddam (SB-DEMO-B14)
  insert into auth.users (
    id, instance_id, aud, role, email, encrypted_password,
    email_confirmed_at, raw_app_meta_data, raw_user_meta_data, created_at, updated_at
  ) values (
    '00000000-0000-4000-a000-000000000014'::uuid,
    '00000000-0000-0000-0000-000000000000',
    'authenticated', 'authenticated',
    'demo-b14@shettibalijamatrimony.internal',
    crypt('DemoPass123!', gen_salt('bf')),
    now(),
    jsonb_build_object('provider', 'email', 'providers', array['email']),
    jsonb_build_object('full_name', 'Dr. Meghana Geddam', 'gender', 'bride'),
    now(), now()
  ) on conflict (id) do update
  set email = excluded.email,
      raw_user_meta_data = excluded.raw_user_meta_data,
      updated_at = now();

  insert into public.profiles (
    id, full_name, gender, account_type, account_status, created_at, updated_at
  ) values (
    '00000000-0000-4000-a000-000000000014'::uuid,
    'Dr. Meghana Geddam',
    'bride',
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
    '00000000-0000-4000-a000-000000000014'::uuid,
    '00000000-0000-4000-a000-000000000014'::uuid,
    'SB-DEMO-B14',
    'Dr. Meghana Geddam',
    'bride',
    29,
    160,
    'never_married',
    'Shettibalija',
    'Telugu',
    'Nellore',
    'Tirupati',
    'Tirupati',
    'Andhra Pradesh',
    'BDS, MDS in Orthodontics (SVIMS Tirupati)',
    'Dentist',
    'Consultant Orthodontist',
    'Tirupati',
    'Hospital & Clinic',
    '₹12 Lakhs',
    'INR',
    'annual',
    'Medical Practice',
    'Wheatish',
    'vegetarian',
    'No',
    'No',
    'Indian',
    array['Telugu', 'English'],
    'Purva Phalguni',
    'Simha (Leo)',
    'Kaundinya',
    '04:30 AM',
    'Nellore',
    true,
    'Orthodontist with private practice and hospital consultation in Tirupati. I find joy in giving people confident smiles. Spiritual, fond of classical music, temple visits, and culinary experiments. Looking for a dependable, warm partner with shared cultural values.',
    'Spiritual, honest service-oriented family from South Coastal Andhra. Dedicated to community service and educational upliftment.',
    true,
    'members',
    'visible',
    'approved',
    true, now(),
    now(),
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
    '00000000-0000-4000-a000-000000000014'::uuid,
    '00000000-0000-4000-a000-000000000014'::uuid,
    '1997-05-27'::date,
    'demo-b14@shettibalijamatrimony.internal',
    'Nellore'
  ) on conflict (profile_id) do update
  set date_of_birth = excluded.date_of_birth,
      email = excluded.email,
      native_place = excluded.native_place;

  insert into public.family_details (
    profile_id, owner_id, father_name, father_profession,
    mother_name, mother_profession, brothers_count, sisters_count,
    brothers_details, sisters_details, family_type, family_location, family_details
  ) values (
    '00000000-0000-4000-a000-000000000014'::uuid,
    '00000000-0000-4000-a000-000000000014'::uuid,
    'Narayana Geddam',
    'Civil Supplies Corporation Manager',
    'Radha Geddam',
    'Homemaker',
    0,
    1,
    NULL,
    'Younger sister studying MBA in Tirupati',
    'Nuclear',
    'Nellore & Tirupati',
    'Spiritual, honest service-oriented family from South Coastal Andhra. Dedicated to community service and educational upliftment.'
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
    '00000000-0000-4000-a000-000000000014'::uuid,
    '00000000-0000-4000-a000-000000000014'::uuid,
    true,
    'Purva Phalguni',
    'Simha (Leo)',
    'Kaundinya'
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
    '00000000-0000-4000-a000-000000000014'::uuid,
    '00000000-0000-4000-a000-000000000014'::uuid,
    30,
    34,
    170,
    182,
    array['never_married'],
    'Doctor / Engineer / Professional',
    'Doctor / Corporate / Govt Officer',
    array['Tirupati', 'Nellore', 'Chennai', 'Hyderabad'],
    'vegetarian',
    'A soft-spoken, well-settled person with high moral values and clean personal habits.'
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

  insert into public.profile_photos (
    profile_id, owner_id, storage_path, is_primary, consented
  ) values (
    '00000000-0000-4000-a000-000000000014'::uuid,
    '00000000-0000-4000-a000-000000000014'::uuid,
    '/images/profiles/demo-bride-02.jpg?p=B14',
    true, true
  ) on conflict (storage_path) do update
  set profile_id = excluded.profile_id,
      owner_id = excluded.owner_id,
      is_primary = true;

  -- Member 15: Anusha Boddu (SB-DEMO-B15)
  insert into auth.users (
    id, instance_id, aud, role, email, encrypted_password,
    email_confirmed_at, raw_app_meta_data, raw_user_meta_data, created_at, updated_at
  ) values (
    '00000000-0000-4000-a000-000000000015'::uuid,
    '00000000-0000-0000-0000-000000000000',
    'authenticated', 'authenticated',
    'demo-b15@shettibalijamatrimony.internal',
    crypt('DemoPass123!', gen_salt('bf')),
    now(),
    jsonb_build_object('provider', 'email', 'providers', array['email']),
    jsonb_build_object('full_name', 'Anusha Boddu', 'gender', 'bride'),
    now(), now()
  ) on conflict (id) do update
  set email = excluded.email,
      raw_user_meta_data = excluded.raw_user_meta_data,
      updated_at = now();

  insert into public.profiles (
    id, full_name, gender, account_type, account_status, created_at, updated_at
  ) values (
    '00000000-0000-4000-a000-000000000015'::uuid,
    'Anusha Boddu',
    'bride',
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
    '00000000-0000-4000-a000-000000000015'::uuid,
    '00000000-0000-4000-a000-000000000015'::uuid,
    'SB-DEMO-B15',
    'Anusha Boddu',
    'bride',
    26,
    159,
    'never_married',
    'Shettibalija',
    'Telugu',
    'Rajahmundry',
    'Rajahmundry',
    'Rajahmundry',
    'Andhra Pradesh',
    'M.A. in English Literature, B.Ed (Andhra University)',
    'Lecturer / Teacher',
    'Post Graduate Teacher (PGT)',
    'Rajahmundry',
    'Government School',
    '₹6.2 Lakhs',
    'INR',
    'annual',
    'Government & Education',
    'Fair',
    'vegetarian',
    'No',
    'No',
    'Indian',
    array['Telugu', 'English', 'Hindi'],
    'Arudra',
    'Mithuna (Gemini)',
    'Vasishta',
    '08:40 PM',
    'Rajahmundry',
    true,
    'Teaching English literature at a central school in Rajahmundry. I have a passion for books, classical Telugu poetry, and home gardening. Looking for an honest, steady companion who appreciates cultural roots and mutual understanding in married life.',
    'Dignified government service background family in Rajahmundry. Peaceful, respected in local neighborhood and community forums.',
    true,
    'members',
    'visible',
    'approved',
    true, now(),
    now(),
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
    '00000000-0000-4000-a000-000000000015'::uuid,
    '00000000-0000-4000-a000-000000000015'::uuid,
    '2000-09-08'::date,
    'demo-b15@shettibalijamatrimony.internal',
    'Rajahmundry'
  ) on conflict (profile_id) do update
  set date_of_birth = excluded.date_of_birth,
      email = excluded.email,
      native_place = excluded.native_place;

  insert into public.family_details (
    profile_id, owner_id, father_name, father_profession,
    mother_name, mother_profession, brothers_count, sisters_count,
    brothers_details, sisters_details, family_type, family_location, family_details
  ) values (
    '00000000-0000-4000-a000-000000000015'::uuid,
    '00000000-0000-4000-a000-000000000015'::uuid,
    'Krishnamurthy Boddu',
    'Treasury Officer (Government of AP)',
    'Kalyani Boddu',
    'Homemaker',
    1,
    0,
    'Younger brother is an engineer at TCS Hyderabad',
    NULL,
    'Nuclear',
    'Rajahmundry, AP',
    'Dignified government service background family in Rajahmundry. Peaceful, respected in local neighborhood and community forums.'
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
    '00000000-0000-4000-a000-000000000015'::uuid,
    '00000000-0000-4000-a000-000000000015'::uuid,
    true,
    'Arudra',
    'Mithuna (Gemini)',
    'Vasishta'
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
    '00000000-0000-4000-a000-000000000015'::uuid,
    '00000000-0000-4000-a000-000000000015'::uuid,
    27,
    31,
    170,
    182,
    array['never_married'],
    'Graduate / Post Graduate',
    'Govt / Banking / IT / Private',
    array['Rajahmundry', 'Kakinada', 'Hyderabad', 'Vijayawada'],
    'vegetarian',
    'A sensible, supportive life partner with good family traditions and steady outlook.'
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

  insert into public.profile_photos (
    profile_id, owner_id, storage_path, is_primary, consented
  ) values (
    '00000000-0000-4000-a000-000000000015'::uuid,
    '00000000-0000-4000-a000-000000000015'::uuid,
    '/images/profiles/demo-bride-03.jpg?p=B15',
    true, true
  ) on conflict (storage_path) do update
  set profile_id = excluded.profile_id,
      owner_id = excluded.owner_id,
      is_primary = true;

  -- Member 16: Sunitha Pecheti (SB-DEMO-B16)
  insert into auth.users (
    id, instance_id, aud, role, email, encrypted_password,
    email_confirmed_at, raw_app_meta_data, raw_user_meta_data, created_at, updated_at
  ) values (
    '00000000-0000-4000-a000-000000000016'::uuid,
    '00000000-0000-0000-0000-000000000000',
    'authenticated', 'authenticated',
    'demo-b16@shettibalijamatrimony.internal',
    crypt('DemoPass123!', gen_salt('bf')),
    now(),
    jsonb_build_object('provider', 'email', 'providers', array['email']),
    jsonb_build_object('full_name', 'Sunitha Pecheti', 'gender', 'bride'),
    now(), now()
  ) on conflict (id) do update
  set email = excluded.email,
      raw_user_meta_data = excluded.raw_user_meta_data,
      updated_at = now();

  insert into public.profiles (
    id, full_name, gender, account_type, account_status, created_at, updated_at
  ) values (
    '00000000-0000-4000-a000-000000000016'::uuid,
    'Sunitha Pecheti',
    'bride',
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
    '00000000-0000-4000-a000-000000000016'::uuid,
    '00000000-0000-4000-a000-000000000016'::uuid,
    'SB-DEMO-B16',
    'Sunitha Pecheti',
    'bride',
    31,
    168,
    'divorced',
    'Shettibalija',
    'Telugu',
    'Visakhapatnam',
    'Bengaluru',
    'Bengaluru',
    'Karnataka',
    'B.Tech + MBA (IIM Kozhikode)',
    'Director of Operations',
    'Director - Supply Chain Operations',
    'Bengaluru',
    'Full-time',
    '₹35 Lakhs',
    'INR',
    'annual',
    'Corporate & Real Estate',
    'Wheatish',
    'vegetarian',
    'No',
    'No',
    'Indian',
    array['Telugu', 'English', 'Hindi'],
    'Bharani',
    'Mesha (Aries)',
    'Atri',
    '02:10 AM',
    'Visakhapatnam',
    true,
    'Operations Director at an e-commerce firm in Bengaluru. Briefly married 4 years ago; divorced with mutual consent and no complications or children. Life has taught me resilience, empathy, and clear priorities. Looking for an emotionally mature, kind-hearted companion for a fresh and meaningful beginning.',
    'Educated, understanding family from Visakhapatnam. Open-minded and supportive of their children''s happiness and independence.',
    true,
    'members',
    'visible',
    'approved',
    true, now(),
    now(),
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
    '00000000-0000-4000-a000-000000000016'::uuid,
    '00000000-0000-4000-a000-000000000016'::uuid,
    '1995-03-22'::date,
    'demo-b16@shettibalijamatrimony.internal',
    'Visakhapatnam'
  ) on conflict (profile_id) do update
  set date_of_birth = excluded.date_of_birth,
      email = excluded.email,
      native_place = excluded.native_place;

  insert into public.family_details (
    profile_id, owner_id, father_name, father_profession,
    mother_name, mother_profession, brothers_count, sisters_count,
    brothers_details, sisters_details, family_type, family_location, family_details
  ) values (
    '00000000-0000-4000-a000-000000000016'::uuid,
    '00000000-0000-4000-a000-000000000016'::uuid,
    'Anjaneyulu Pecheti',
    'Retired Port Authority Manager',
    'Haimavathi Pecheti',
    'Homemaker',
    1,
    0,
    'Brother works as an AI consultant in Germany',
    NULL,
    'Nuclear',
    'Visakhapatnam & Bengaluru',
    'Educated, understanding family from Visakhapatnam. Open-minded and supportive of their children''s happiness and independence.'
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
    '00000000-0000-4000-a000-000000000016'::uuid,
    '00000000-0000-4000-a000-000000000016'::uuid,
    true,
    'Bharani',
    'Mesha (Aries)',
    'Atri'
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
    '00000000-0000-4000-a000-000000000016'::uuid,
    '00000000-0000-4000-a000-000000000016'::uuid,
    31,
    37,
    174,
    188,
    array['never_married', 'divorced'],
    'Master''s / MBA / B.Tech',
    'Corporate Executive / Entrepreneur / Senior Tech',
    array['Bengaluru', 'Hyderabad', 'Visakhapatnam'],
    'any',
    'An understanding, secure gentleman who values transparency, mutual emotional support, and respect.'
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

  insert into public.profile_photos (
    profile_id, owner_id, storage_path, is_primary, consented
  ) values (
    '00000000-0000-4000-a000-000000000016'::uuid,
    '00000000-0000-4000-a000-000000000016'::uuid,
    '/images/profiles/demo-bride-04.jpg?p=B16',
    true, true
  ) on conflict (storage_path) do update
  set profile_id = excluded.profile_id,
      owner_id = excluded.owner_id,
      is_primary = true;

  -- Member 17: Ramya Chelluboyina (SB-DEMO-B17)
  insert into auth.users (
    id, instance_id, aud, role, email, encrypted_password,
    email_confirmed_at, raw_app_meta_data, raw_user_meta_data, created_at, updated_at
  ) values (
    '00000000-0000-4000-a000-000000000017'::uuid,
    '00000000-0000-0000-0000-000000000000',
    'authenticated', 'authenticated',
    'demo-b17@shettibalijamatrimony.internal',
    crypt('DemoPass123!', gen_salt('bf')),
    now(),
    jsonb_build_object('provider', 'email', 'providers', array['email']),
    jsonb_build_object('full_name', 'Ramya Chelluboyina', 'gender', 'bride'),
    now(), now()
  ) on conflict (id) do update
  set email = excluded.email,
      raw_user_meta_data = excluded.raw_user_meta_data,
      updated_at = now();

  insert into public.profiles (
    id, full_name, gender, account_type, account_status, created_at, updated_at
  ) values (
    '00000000-0000-4000-a000-000000000017'::uuid,
    'Ramya Chelluboyina',
    'bride',
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
    '00000000-0000-4000-a000-000000000017'::uuid,
    '00000000-0000-4000-a000-000000000017'::uuid,
    'SB-DEMO-B17',
    'Ramya Chelluboyina',
    'bride',
    25,
    161,
    'never_married',
    'Shettibalija',
    'Telugu',
    'Amalapuram',
    'Kakinada',
    'Kakinada',
    'Andhra Pradesh',
    'B.Sc in Clinical Nutrition & Dietetics',
    'Dietitian / Nutritionist',
    'Consultant Clinical Dietitian',
    'Kakinada',
    'Hospital',
    '₹5 Lakhs',
    'INR',
    'annual',
    'Business & Agriculture',
    'Fair',
    'vegetarian',
    'No',
    'No',
    'Indian',
    array['Telugu', 'English'],
    'Shravana',
    'Makara (Capricorn)',
    'Harita',
    '07:30 PM',
    'Amalapuram',
    true,
    'Consultant Dietitian working with Apollo Clinic Kakinada. Enthusiastic about holistic wellness, classical veena, and culinary arts. Seeking an amicable, family-focused partner who appreciates simple joys and mutual respect.',
    'Traditional Godavari merchant family with vast agricultural property. Very hospitable, warm, and engaged in local community welfare.',
    true,
    'members',
    'visible',
    'approved',
    true, now(),
    now(),
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
    '00000000-0000-4000-a000-000000000017'::uuid,
    '00000000-0000-4000-a000-000000000017'::uuid,
    '2001-01-17'::date,
    'demo-b17@shettibalijamatrimony.internal',
    'Amalapuram'
  ) on conflict (profile_id) do update
  set date_of_birth = excluded.date_of_birth,
      email = excluded.email,
      native_place = excluded.native_place;

  insert into public.family_details (
    profile_id, owner_id, father_name, father_profession,
    mother_name, mother_profession, brothers_count, sisters_count,
    brothers_details, sisters_details, family_type, family_location, family_details
  ) values (
    '00000000-0000-4000-a000-000000000017'::uuid,
    '00000000-0000-4000-a000-000000000017'::uuid,
    'Kameswara Rao Chelluboyina',
    'Timber Merchant & Landowner',
    'Suryakantham Chelluboyina',
    'Homemaker',
    1,
    1,
    'Brother runs family enterprise in Amalapuram',
    'Sister studying degree',
    'Joint',
    'Amalapuram & Kakinada',
    'Traditional Godavari merchant family with vast agricultural property. Very hospitable, warm, and engaged in local community welfare.'
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
    '00000000-0000-4000-a000-000000000017'::uuid,
    '00000000-0000-4000-a000-000000000017'::uuid,
    true,
    'Shravana',
    'Makara (Capricorn)',
    'Harita'
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
    '00000000-0000-4000-a000-000000000017'::uuid,
    '00000000-0000-4000-a000-000000000017'::uuid,
    26,
    30,
    170,
    182,
    array['never_married'],
    'Graduate / Post Graduate',
    'Business / Software / Banking',
    array['Kakinada', 'Rajahmundry', 'Hyderabad', 'Visakhapatnam'],
    'vegetarian',
    'Culturally rooted person with sound character, positive temperament, and affection for family.'
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

  insert into public.profile_photos (
    profile_id, owner_id, storage_path, is_primary, consented
  ) values (
    '00000000-0000-4000-a000-000000000017'::uuid,
    '00000000-0000-4000-a000-000000000017'::uuid,
    '/images/profiles/demo-bride-01.jpg?p=B17',
    true, true
  ) on conflict (storage_path) do update
  set profile_id = excluded.profile_id,
      owner_id = excluded.owner_id,
      is_primary = true;

  -- Member 18: Pavani Bikkina (SB-DEMO-B18)
  insert into auth.users (
    id, instance_id, aud, role, email, encrypted_password,
    email_confirmed_at, raw_app_meta_data, raw_user_meta_data, created_at, updated_at
  ) values (
    '00000000-0000-4000-a000-000000000018'::uuid,
    '00000000-0000-0000-0000-000000000000',
    'authenticated', 'authenticated',
    'demo-b18@shettibalijamatrimony.internal',
    crypt('DemoPass123!', gen_salt('bf')),
    now(),
    jsonb_build_object('provider', 'email', 'providers', array['email']),
    jsonb_build_object('full_name', 'Pavani Bikkina', 'gender', 'bride'),
    now(), now()
  ) on conflict (id) do update
  set email = excluded.email,
      raw_user_meta_data = excluded.raw_user_meta_data,
      updated_at = now();

  insert into public.profiles (
    id, full_name, gender, account_type, account_status, created_at, updated_at
  ) values (
    '00000000-0000-4000-a000-000000000018'::uuid,
    'Pavani Bikkina',
    'bride',
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
    '00000000-0000-4000-a000-000000000018'::uuid,
    '00000000-0000-4000-a000-000000000018'::uuid,
    'SB-DEMO-B18',
    'Pavani Bikkina',
    'bride',
    27,
    164,
    'never_married',
    'Shettibalija',
    'Telugu',
    'Kakinada',
    'Hyderabad',
    'Hyderabad',
    'Telangana',
    'B.Tech in CSE (IIIT Hyderabad)',
    'Full Stack Developer',
    'Senior Software Engineer',
    'Hyderabad',
    'Full-time',
    '₹24 Lakhs',
    'INR',
    'annual',
    'Contractor & Construction',
    'Wheatish',
    'eggetarian',
    'No',
    'No',
    'Indian',
    array['Telugu', 'English'],
    'Jyeshtha',
    'Vrishchika (Scorpio)',
    'Sandilya',
    '12:40 PM',
    'Kakinada',
    true,
    'Senior engineer at ServiceNow Hyderabad. I build enterprise cloud applications, love weekend road cycling, and practice carnatic flute. Seeking a progressive, caring companion with whom I can build an intellectually fulfilling and joyful family life.',
    'Enterprising family from coastal Andhra with business interests in construction. Forward-looking, supportive of women''s education and careers.',
    true,
    'members',
    'visible',
    'approved',
    true, now(),
    now(),
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
    '00000000-0000-4000-a000-000000000018'::uuid,
    '00000000-0000-4000-a000-000000000018'::uuid,
    '1999-11-14'::date,
    'demo-b18@shettibalijamatrimony.internal',
    'Kakinada'
  ) on conflict (profile_id) do update
  set date_of_birth = excluded.date_of_birth,
      email = excluded.email,
      native_place = excluded.native_place;

  insert into public.family_details (
    profile_id, owner_id, father_name, father_profession,
    mother_name, mother_profession, brothers_count, sisters_count,
    brothers_details, sisters_details, family_type, family_location, family_details
  ) values (
    '00000000-0000-4000-a000-000000000018'::uuid,
    '00000000-0000-4000-a000-000000000018'::uuid,
    'Simhachalam Bikkina',
    'Building Contractor & Real Estate Promoter',
    'Annapurna Bikkina',
    'Homemaker',
    1,
    0,
    'Brother is an MS graduate working in USA',
    NULL,
    'Nuclear',
    'Kakinada & Hyderabad',
    'Enterprising family from coastal Andhra with business interests in construction. Forward-looking, supportive of women''s education and careers.'
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
    '00000000-0000-4000-a000-000000000018'::uuid,
    '00000000-0000-4000-a000-000000000018'::uuid,
    true,
    'Jyeshtha',
    'Vrishchika (Scorpio)',
    'Sandilya'
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
    '00000000-0000-4000-a000-000000000018'::uuid,
    '00000000-0000-4000-a000-000000000018'::uuid,
    28,
    32,
    174,
    186,
    array['never_married'],
    'B.Tech / MS / MBA',
    'Software Lead / Tech Architect / Entrepreneur',
    array['Hyderabad', 'Bengaluru', 'USA'],
    'any',
    'Looking for an intelligent, warm partner with strong integrity and shared cultural interests.'
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

  insert into public.profile_photos (
    profile_id, owner_id, storage_path, is_primary, consented
  ) values (
    '00000000-0000-4000-a000-000000000018'::uuid,
    '00000000-0000-4000-a000-000000000018'::uuid,
    '/images/profiles/demo-bride-02.jpg?p=B18',
    true, true
  ) on conflict (storage_path) do update
  set profile_id = excluded.profile_id,
      owner_id = excluded.owner_id,
      is_primary = true;

  -- Member 19: Deepika Sunkara (SB-DEMO-B19)
  insert into auth.users (
    id, instance_id, aud, role, email, encrypted_password,
    email_confirmed_at, raw_app_meta_data, raw_user_meta_data, created_at, updated_at
  ) values (
    '00000000-0000-4000-a000-000000000019'::uuid,
    '00000000-0000-0000-0000-000000000000',
    'authenticated', 'authenticated',
    'demo-b19@shettibalijamatrimony.internal',
    crypt('DemoPass123!', gen_salt('bf')),
    now(),
    jsonb_build_object('provider', 'email', 'providers', array['email']),
    jsonb_build_object('full_name', 'Deepika Sunkara', 'gender', 'bride'),
    now(), now()
  ) on conflict (id) do update
  set email = excluded.email,
      raw_user_meta_data = excluded.raw_user_meta_data,
      updated_at = now();

  insert into public.profiles (
    id, full_name, gender, account_type, account_status, created_at, updated_at
  ) values (
    '00000000-0000-4000-a000-000000000019'::uuid,
    'Deepika Sunkara',
    'bride',
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
    '00000000-0000-4000-a000-000000000019'::uuid,
    '00000000-0000-4000-a000-000000000019'::uuid,
    'SB-DEMO-B19',
    'Deepika Sunkara',
    'bride',
    28,
    166,
    'never_married',
    'Shettibalija',
    'Telugu',
    'Bhimavaram',
    'Dallas, Texas, USA',
    'Dallas',
    'Texas',
    'MS in Information Systems (UT Dallas)',
    'Senior Data Engineer',
    'Senior Data Engineer',
    'Dallas, TX, USA',
    'Full-time',
    '$115,000',
    'USD',
    'annual',
    'Business & Farming',
    'Fair',
    'vegetarian',
    'No',
    'No',
    'Indian (H1B Visa)',
    array['Telugu', 'English'],
    'Purva Ashadha',
    'Dhanus (Sagittarius)',
    'Gautama',
    '09:15 AM',
    'Bhimavaram',
    true,
    'Working as a Senior Data Engineer with telecom analytics in Dallas, Texas. Love road trips across national parks, Indian cooking, and community volunteering. Seeking a well-educated partner based in the US or open to relocating, with good family background.',
    'Affluent and grounded family from Bhimavaram. Value traditional culture while enthusiastically supporting international careers.',
    true,
    'members',
    'visible',
    'approved',
    true, now(),
    now(),
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
    '00000000-0000-4000-a000-000000000019'::uuid,
    '00000000-0000-4000-a000-000000000019'::uuid,
    '1998-07-07'::date,
    'demo-b19@shettibalijamatrimony.internal',
    'Bhimavaram'
  ) on conflict (profile_id) do update
  set date_of_birth = excluded.date_of_birth,
      email = excluded.email,
      native_place = excluded.native_place;

  insert into public.family_details (
    profile_id, owner_id, father_name, father_profession,
    mother_name, mother_profession, brothers_count, sisters_count,
    brothers_details, sisters_details, family_type, family_location, family_details
  ) values (
    '00000000-0000-4000-a000-000000000019'::uuid,
    '00000000-0000-4000-a000-000000000019'::uuid,
    'Veerabhadra Rao Sunkara',
    'Agricultural Landowner & Aquaculture Businessman',
    'Kanakadurga Sunkara',
    'Homemaker',
    1,
    0,
    'Brother working as a software manager in Hyderabad',
    NULL,
    'Nuclear',
    'Bhimavaram & Dallas',
    'Affluent and grounded family from Bhimavaram. Value traditional culture while enthusiastically supporting international careers.'
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
    '00000000-0000-4000-a000-000000000019'::uuid,
    '00000000-0000-4000-a000-000000000019'::uuid,
    true,
    'Purva Ashadha',
    'Dhanus (Sagittarius)',
    'Gautama'
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
    '00000000-0000-4000-a000-000000000019'::uuid,
    '00000000-0000-4000-a000-000000000019'::uuid,
    28,
    33,
    175,
    188,
    array['never_married'],
    'MS / MBA / B.Tech',
    'Software Engineer / Tech Lead / Financial Analyst',
    array['USA', 'Canada'],
    'vegetarian',
    'A friendly, accomplished individual settled in the US who respects Telugu customs and family bonds.'
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

  insert into public.profile_photos (
    profile_id, owner_id, storage_path, is_primary, consented
  ) values (
    '00000000-0000-4000-a000-000000000019'::uuid,
    '00000000-0000-4000-a000-000000000019'::uuid,
    '/images/profiles/demo-bride-03.jpg?p=B19',
    true, true
  ) on conflict (storage_path) do update
  set profile_id = excluded.profile_id,
      owner_id = excluded.owner_id,
      is_primary = true;

  -- Member 20: Yamini Mallipudi (SB-DEMO-B20)
  insert into auth.users (
    id, instance_id, aud, role, email, encrypted_password,
    email_confirmed_at, raw_app_meta_data, raw_user_meta_data, created_at, updated_at
  ) values (
    '00000000-0000-4000-a000-000000000020'::uuid,
    '00000000-0000-0000-0000-000000000000',
    'authenticated', 'authenticated',
    'demo-b20@shettibalijamatrimony.internal',
    crypt('DemoPass123!', gen_salt('bf')),
    now(),
    jsonb_build_object('provider', 'email', 'providers', array['email']),
    jsonb_build_object('full_name', 'Yamini Mallipudi', 'gender', 'bride'),
    now(), now()
  ) on conflict (id) do update
  set email = excluded.email,
      raw_user_meta_data = excluded.raw_user_meta_data,
      updated_at = now();

  insert into public.profiles (
    id, full_name, gender, account_type, account_status, created_at, updated_at
  ) values (
    '00000000-0000-4000-a000-000000000020'::uuid,
    'Yamini Mallipudi',
    'bride',
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
    '00000000-0000-4000-a000-000000000020'::uuid,
    '00000000-0000-4000-a000-000000000020'::uuid,
    'SB-DEMO-B20',
    'Yamini Mallipudi',
    'bride',
    24,
    163,
    'never_married',
    'Shettibalija',
    'Telugu',
    'Vijayawada',
    'Vijayawada',
    'Vijayawada',
    'Andhra Pradesh',
    'B.Com, Chartered Accountant Inter',
    'Tax Consultant',
    'Direct Tax Consultant',
    'Vijayawada',
    'Full-time',
    '₹8.5 Lakhs',
    'INR',
    'annual',
    'Trading & Logistics',
    'Wheatish',
    'vegetarian',
    'No',
    'No',
    'Indian',
    array['Telugu', 'English'],
    'Uttara Bhadrapada',
    'Meena (Pisces)',
    'Kasyapa',
    '06:50 PM',
    'Vijayawada',
    true,
    'Working as a tax consultant at PwC. I value diligence, quiet evenings reading classic novels, and weekend temple visits with family. Seeking an earnest, warm-hearted partner who values integrity, shared laughter, and healthy communication.',
    'Established merchant family in Vijayawada with longstanding business goodwill. Traditional Godavari culinary and spiritual roots.',
    true,
    'members',
    'visible',
    'approved',
    true, now(),
    now(),
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
    '00000000-0000-4000-a000-000000000020'::uuid,
    '00000000-0000-4000-a000-000000000020'::uuid,
    '2002-12-05'::date,
    'demo-b20@shettibalijamatrimony.internal',
    'Vijayawada'
  ) on conflict (profile_id) do update
  set date_of_birth = excluded.date_of_birth,
      email = excluded.email,
      native_place = excluded.native_place;

  insert into public.family_details (
    profile_id, owner_id, father_name, father_profession,
    mother_name, mother_profession, brothers_count, sisters_count,
    brothers_details, sisters_details, family_type, family_location, family_details
  ) values (
    '00000000-0000-4000-a000-000000000020'::uuid,
    '00000000-0000-4000-a000-000000000020'::uuid,
    'Hanumantha Rao Mallipudi',
    'Wholesale Grocery & Grain Merchant',
    'Meenakshi Mallipudi',
    'Homemaker',
    0,
    1,
    NULL,
    'Younger sister pursuing degree in Vijayawada',
    'Nuclear',
    'Vijayawada, Krishna Dist',
    'Established merchant family in Vijayawada with longstanding business goodwill. Traditional Godavari culinary and spiritual roots.'
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
    '00000000-0000-4000-a000-000000000020'::uuid,
    '00000000-0000-4000-a000-000000000020'::uuid,
    true,
    'Uttara Bhadrapada',
    'Meena (Pisces)',
    'Kasyapa'
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
    '00000000-0000-4000-a000-000000000020'::uuid,
    '00000000-0000-4000-a000-000000000020'::uuid,
    26,
    29,
    170,
    182,
    array['never_married'],
    'Graduate / Post Graduate',
    'CA / Banking / IT / Business',
    array['Vijayawada', 'Hyderabad', 'Guntur'],
    'vegetarian',
    'Cultured, responsible gentleman with good family background and clear moral compass.'
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

  insert into public.profile_photos (
    profile_id, owner_id, storage_path, is_primary, consented
  ) values (
    '00000000-0000-4000-a000-000000000020'::uuid,
    '00000000-0000-4000-a000-000000000020'::uuid,
    '/images/profiles/demo-bride-04.jpg?p=B20',
    true, true
  ) on conflict (storage_path) do update
  set profile_id = excluded.profile_id,
      owner_id = excluded.owner_id,
      is_primary = true;

  -- Member 21: Kavitha Pothula (SB-DEMO-B21)
  insert into auth.users (
    id, instance_id, aud, role, email, encrypted_password,
    email_confirmed_at, raw_app_meta_data, raw_user_meta_data, created_at, updated_at
  ) values (
    '00000000-0000-4000-a000-000000000021'::uuid,
    '00000000-0000-0000-0000-000000000000',
    'authenticated', 'authenticated',
    'demo-b21@shettibalijamatrimony.internal',
    crypt('DemoPass123!', gen_salt('bf')),
    now(),
    jsonb_build_object('provider', 'email', 'providers', array['email']),
    jsonb_build_object('full_name', 'Kavitha Pothula', 'gender', 'bride'),
    now(), now()
  ) on conflict (id) do update
  set email = excluded.email,
      raw_user_meta_data = excluded.raw_user_meta_data,
      updated_at = now();

  insert into public.profiles (
    id, full_name, gender, account_type, account_status, created_at, updated_at
  ) values (
    '00000000-0000-4000-a000-000000000021'::uuid,
    'Kavitha Pothula',
    'bride',
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
    '00000000-0000-4000-a000-000000000021'::uuid,
    '00000000-0000-4000-a000-000000000021'::uuid,
    'SB-DEMO-B21',
    'Kavitha Pothula',
    'bride',
    29,
    165,
    'widowed',
    'Shettibalija',
    'Telugu',
    'Rajahmundry',
    'Hyderabad',
    'Hyderabad',
    'Telangana',
    'M.Sc in Mathematics (Osmania University)',
    'Senior Analytics Consultant',
    'Lead Business Analyst',
    'Hyderabad',
    'Full-time',
    '₹14 Lakhs',
    'INR',
    'annual',
    'Employee & Education',
    'Fair',
    'vegetarian',
    'No',
    'No',
    'Indian',
    array['Telugu', 'English'],
    'Mula',
    'Dhanus (Sagittarius)',
    'Viswamitra',
    '01:35 PM',
    'Rajahmundry',
    true,
    'Senior Business Analyst in Hyderabad. Lost my husband in a road accident 3 years ago; no children. Life continues with hope, courage, and dedication to work and family. Looking for an understanding, kind-hearted gentleman with whom I can rebuild a supportive, joyful home.',
    'Cultured, affectionate family settled in Hyderabad. Known for their supportive warmth, resilience, and ethical principles.',
    true,
    'members',
    'visible',
    'approved',
    true, now(),
    now(),
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
    '00000000-0000-4000-a000-000000000021'::uuid,
    '00000000-0000-4000-a000-000000000021'::uuid,
    '1997-02-28'::date,
    'demo-b21@shettibalijamatrimony.internal',
    'Rajahmundry'
  ) on conflict (profile_id) do update
  set date_of_birth = excluded.date_of_birth,
      email = excluded.email,
      native_place = excluded.native_place;

  insert into public.family_details (
    profile_id, owner_id, father_name, father_profession,
    mother_name, mother_profession, brothers_count, sisters_count,
    brothers_details, sisters_details, family_type, family_location, family_details
  ) values (
    '00000000-0000-4000-a000-000000000021'::uuid,
    '00000000-0000-4000-a000-000000000021'::uuid,
    'Bapanna Pothula',
    'Retired Commercial Tax Officer',
    'Sujatha Pothula',
    'Homemaker',
    1,
    0,
    'Brother is a software developer in Hyderabad',
    NULL,
    'Nuclear',
    'Rajahmundry & Hyderabad',
    'Cultured, affectionate family settled in Hyderabad. Known for their supportive warmth, resilience, and ethical principles.'
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
    '00000000-0000-4000-a000-000000000021'::uuid,
    '00000000-0000-4000-a000-000000000021'::uuid,
    true,
    'Mula',
    'Dhanus (Sagittarius)',
    'Viswamitra'
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
    '00000000-0000-4000-a000-000000000021'::uuid,
    '00000000-0000-4000-a000-000000000021'::uuid,
    30,
    36,
    172,
    185,
    array['never_married', 'widowed', 'divorced'],
    'Graduate / Post Graduate',
    'Any professional or business career',
    array['Hyderabad', 'Visakhapatnam', 'Rajahmundry'],
    'vegetarian',
    'A considerate, emotionally mature companion who appreciates honesty, mutual care, and family companionship.'
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

  insert into public.profile_photos (
    profile_id, owner_id, storage_path, is_primary, consented
  ) values (
    '00000000-0000-4000-a000-000000000021'::uuid,
    '00000000-0000-4000-a000-000000000021'::uuid,
    '/images/profiles/demo-bride-01.jpg?p=B21',
    true, true
  ) on conflict (storage_path) do update
  set profile_id = excluded.profile_id,
      owner_id = excluded.owner_id,
      is_primary = true;

  -- Member 22: Sandhya Yalla (SB-DEMO-B22)
  insert into auth.users (
    id, instance_id, aud, role, email, encrypted_password,
    email_confirmed_at, raw_app_meta_data, raw_user_meta_data, created_at, updated_at
  ) values (
    '00000000-0000-4000-a000-000000000022'::uuid,
    '00000000-0000-0000-0000-000000000000',
    'authenticated', 'authenticated',
    'demo-b22@shettibalijamatrimony.internal',
    crypt('DemoPass123!', gen_salt('bf')),
    now(),
    jsonb_build_object('provider', 'email', 'providers', array['email']),
    jsonb_build_object('full_name', 'Sandhya Yalla', 'gender', 'bride'),
    now(), now()
  ) on conflict (id) do update
  set email = excluded.email,
      raw_user_meta_data = excluded.raw_user_meta_data,
      updated_at = now();

  insert into public.profiles (
    id, full_name, gender, account_type, account_status, created_at, updated_at
  ) values (
    '00000000-0000-4000-a000-000000000022'::uuid,
    'Sandhya Yalla',
    'bride',
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
    '00000000-0000-4000-a000-000000000022'::uuid,
    '00000000-0000-4000-a000-000000000022'::uuid,
    'SB-DEMO-B22',
    'Sandhya Yalla',
    'bride',
    26,
    160,
    'never_married',
    'Shettibalija',
    'Telugu',
    'Eluru',
    'Hyderabad',
    'Hyderabad',
    'Telangana',
    'B.Des in UI/UX Design (NIFT Hyderabad)',
    'Product Designer',
    'Senior UI/UX Designer',
    'Hyderabad',
    'Full-time',
    '₹17 Lakhs',
    'INR',
    'annual',
    'Business & Design',
    'Dusky',
    'vegetarian',
    'No',
    'No',
    'Indian',
    array['Telugu', 'English'],
    'Punarvasu',
    'Mithuna (Gemini)',
    'Bharadwaja',
    '09:00 PM',
    'Eluru',
    true,
    'Product designer at Swiggy Hyderabad. Passionate about design systems, pottery, coffee brewing, and listening to Carnatic instrumental fusion. Seeking a creative, open-hearted partner who appreciates design, humor, and close family bonds.',
    'Respectable commercial family based in Eluru. Blend of traditional Telugu culture and modern creative aspirations.',
    true,
    'members',
    'visible',
    'approved',
    true, now(),
    now(),
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
    '00000000-0000-4000-a000-000000000022'::uuid,
    '00000000-0000-4000-a000-000000000022'::uuid,
    '2000-06-16'::date,
    'demo-b22@shettibalijamatrimony.internal',
    'Eluru'
  ) on conflict (profile_id) do update
  set date_of_birth = excluded.date_of_birth,
      email = excluded.email,
      native_place = excluded.native_place;

  insert into public.family_details (
    profile_id, owner_id, father_name, father_profession,
    mother_name, mother_profession, brothers_count, sisters_count,
    brothers_details, sisters_details, family_type, family_location, family_details
  ) values (
    '00000000-0000-4000-a000-000000000022'::uuid,
    '00000000-0000-4000-a000-000000000022'::uuid,
    'Nageswara Rao Yalla',
    'Wholesale Fertilizer & Seeds Distributor',
    'Madhavi Yalla',
    'Homemaker',
    1,
    0,
    'Younger brother is an architect in Hyderabad',
    NULL,
    'Nuclear',
    'Eluru & Hyderabad',
    'Respectable commercial family based in Eluru. Blend of traditional Telugu culture and modern creative aspirations.'
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
    '00000000-0000-4000-a000-000000000022'::uuid,
    '00000000-0000-4000-a000-000000000022'::uuid,
    true,
    'Punarvasu',
    'Mithuna (Gemini)',
    'Bharadwaja'
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
    '00000000-0000-4000-a000-000000000022'::uuid,
    '00000000-0000-4000-a000-000000000022'::uuid,
    27,
    31,
    170,
    184,
    array['never_married'],
    'B.Tech / Design / MBA',
    'Tech / Creative / Entrepreneur',
    array['Hyderabad', 'Bengaluru'],
    'any',
    'Fun-loving, intellectually curious individual with clean habits and respect for personal growth.'
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

  insert into public.profile_photos (
    profile_id, owner_id, storage_path, is_primary, consented
  ) values (
    '00000000-0000-4000-a000-000000000022'::uuid,
    '00000000-0000-4000-a000-000000000022'::uuid,
    '/images/profiles/demo-bride-02.jpg?p=B22',
    true, true
  ) on conflict (storage_path) do update
  set profile_id = excluded.profile_id,
      owner_id = excluded.owner_id,
      is_primary = true;

  -- Member 23: Sowmya Mattaparthi (SB-DEMO-B23)
  insert into auth.users (
    id, instance_id, aud, role, email, encrypted_password,
    email_confirmed_at, raw_app_meta_data, raw_user_meta_data, created_at, updated_at
  ) values (
    '00000000-0000-4000-a000-000000000023'::uuid,
    '00000000-0000-0000-0000-000000000000',
    'authenticated', 'authenticated',
    'demo-b23@shettibalijamatrimony.internal',
    crypt('DemoPass123!', gen_salt('bf')),
    now(),
    jsonb_build_object('provider', 'email', 'providers', array['email']),
    jsonb_build_object('full_name', 'Sowmya Mattaparthi', 'gender', 'bride'),
    now(), now()
  ) on conflict (id) do update
  set email = excluded.email,
      raw_user_meta_data = excluded.raw_user_meta_data,
      updated_at = now();

  insert into public.profiles (
    id, full_name, gender, account_type, account_status, created_at, updated_at
  ) values (
    '00000000-0000-4000-a000-000000000023'::uuid,
    'Sowmya Mattaparthi',
    'bride',
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
    '00000000-0000-4000-a000-000000000023'::uuid,
    '00000000-0000-4000-a000-000000000023'::uuid,
    'SB-DEMO-B23',
    'Sowmya Mattaparthi',
    'bride',
    25,
    162,
    'never_married',
    'Shettibalija',
    'Telugu',
    'Kakinada',
    'Kakinada',
    'Kakinada',
    'Andhra Pradesh',
    'B.Tech in Civil Engineering (JNTU Kakinada)',
    'Assistant Executive Engineer',
    'Assistant Executive Engineer (AEE)',
    'Kakinada',
    'State Government',
    '₹7.2 Lakhs',
    'INR',
    'annual',
    'Government & Engineering',
    'Fair',
    'vegetarian',
    'No',
    'No',
    'Indian',
    array['Telugu', 'English'],
    'Shatabhisha',
    'Kumbha (Aquarius)',
    'Kaundinya',
    '04:10 PM',
    'Kakinada',
    true,
    'Serving as Assistant Executive Engineer in the state water resources department. I enjoy Carnatic music, badminton, and participating in community service drives. Looking for an educated, well-settled life partner with clean habits and family warmth.',
    'Respected government engineering family in Kakinada. High regard for public service, integrity, and social values.',
    true,
    'members',
    'visible',
    'approved',
    true, now(),
    NULL,
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
    '00000000-0000-4000-a000-000000000023'::uuid,
    '00000000-0000-4000-a000-000000000023'::uuid,
    '2001-09-19'::date,
    'demo-b23@shettibalijamatrimony.internal',
    'Kakinada'
  ) on conflict (profile_id) do update
  set date_of_birth = excluded.date_of_birth,
      email = excluded.email,
      native_place = excluded.native_place;

  insert into public.family_details (
    profile_id, owner_id, father_name, father_profession,
    mother_name, mother_profession, brothers_count, sisters_count,
    brothers_details, sisters_details, family_type, family_location, family_details
  ) values (
    '00000000-0000-4000-a000-000000000023'::uuid,
    '00000000-0000-4000-a000-000000000023'::uuid,
    'Gangadhara Rao Mattaparthi',
    'Executive Engineer (Irrigation Dept, Retired)',
    'Sridevi Mattaparthi',
    'Homemaker',
    0,
    1,
    NULL,
    'Elder sister married to a software architect in Visakhapatnam',
    'Nuclear',
    'Kakinada, AP',
    'Respected government engineering family in Kakinada. High regard for public service, integrity, and social values.'
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
    '00000000-0000-4000-a000-000000000023'::uuid,
    '00000000-0000-4000-a000-000000000023'::uuid,
    true,
    'Shatabhisha',
    'Kumbha (Aquarius)',
    'Kaundinya'
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
    '00000000-0000-4000-a000-000000000023'::uuid,
    '00000000-0000-4000-a000-000000000023'::uuid,
    26,
    30,
    170,
    182,
    array['never_married'],
    'B.Tech / Post Graduate / Govt Officer',
    'Govt / Engineering / Banking',
    array['Kakinada', 'Visakhapatnam', 'Rajahmundry', 'Vijayawada'],
    'vegetarian',
    'A soft-spoken, principled gentleman from a good family background.'
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

  insert into public.profile_photos (
    profile_id, owner_id, storage_path, is_primary, consented
  ) values (
    '00000000-0000-4000-a000-000000000023'::uuid,
    '00000000-0000-4000-a000-000000000023'::uuid,
    '/images/profiles/demo-bride-03.jpg?p=B23',
    true, true
  ) on conflict (storage_path) do update
  set profile_id = excluded.profile_id,
      owner_id = excluded.owner_id,
      is_primary = true;

  -- Member 24: Alekhya Vasamsetti (SB-DEMO-B24)
  insert into auth.users (
    id, instance_id, aud, role, email, encrypted_password,
    email_confirmed_at, raw_app_meta_data, raw_user_meta_data, created_at, updated_at
  ) values (
    '00000000-0000-4000-a000-000000000024'::uuid,
    '00000000-0000-0000-0000-000000000000',
    'authenticated', 'authenticated',
    'demo-b24@shettibalijamatrimony.internal',
    crypt('DemoPass123!', gen_salt('bf')),
    now(),
    jsonb_build_object('provider', 'email', 'providers', array['email']),
    jsonb_build_object('full_name', 'Alekhya Vasamsetti', 'gender', 'bride'),
    now(), now()
  ) on conflict (id) do update
  set email = excluded.email,
      raw_user_meta_data = excluded.raw_user_meta_data,
      updated_at = now();

  insert into public.profiles (
    id, full_name, gender, account_type, account_status, created_at, updated_at
  ) values (
    '00000000-0000-4000-a000-000000000024'::uuid,
    'Alekhya Vasamsetti',
    'bride',
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
    '00000000-0000-4000-a000-000000000024'::uuid,
    '00000000-0000-4000-a000-000000000024'::uuid,
    'SB-DEMO-B24',
    'Alekhya Vasamsetti',
    'bride',
    27,
    158,
    'never_married',
    'Shettibalija',
    'Telugu',
    'Amalapuram',
    'Amalapuram',
    'Amalapuram',
    'Andhra Pradesh',
    'B.Com, MBA in Finance',
    'Bank Operations Manager',
    'Assistant Branch Manager',
    'Amalapuram',
    'Public Sector Bank',
    '₹9 Lakhs',
    'INR',
    'annual',
    'Banking & Agriculture',
    'Wheatish',
    'vegetarian',
    'No',
    'No',
    'Indian',
    array['Telugu', 'English'],
    'Ashlesha',
    'Karkataka (Cancer)',
    'Vasishta',
    '11:20 AM',
    'Amalapuram',
    true,
    'Working as assistant manager at Union Bank of India. Grounded, affectionate, and fond of classical devotional songs and cooking traditional Godavari delicacies. Seeking a grounded, responsible companion who honors family traditions.',
    'Traditional Konaseema agricultural family with high standing in Amalapuram. Value simplicity, hospitality, and ethical values.',
    true,
    'members',
    'hidden',
    'pending',
    true, now(),
    NULL,
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
    '00000000-0000-4000-a000-000000000024'::uuid,
    '00000000-0000-4000-a000-000000000024'::uuid,
    '1999-05-02'::date,
    'demo-b24@shettibalijamatrimony.internal',
    'Amalapuram'
  ) on conflict (profile_id) do update
  set date_of_birth = excluded.date_of_birth,
      email = excluded.email,
      native_place = excluded.native_place;

  insert into public.family_details (
    profile_id, owner_id, father_name, father_profession,
    mother_name, mother_profession, brothers_count, sisters_count,
    brothers_details, sisters_details, family_type, family_location, family_details
  ) values (
    '00000000-0000-4000-a000-000000000024'::uuid,
    '00000000-0000-4000-a000-000000000024'::uuid,
    'Somaraju Vasamsetti',
    'Agricultural Landowner & Coconut Grower',
    'Janaki Vasamsetti',
    'Homemaker',
    1,
    0,
    'Brother manages family agriculture and local business',
    NULL,
    'Nuclear',
    'Amalapuram, Konaseema',
    'Traditional Konaseema agricultural family with high standing in Amalapuram. Value simplicity, hospitality, and ethical values.'
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
    '00000000-0000-4000-a000-000000000024'::uuid,
    '00000000-0000-4000-a000-000000000024'::uuid,
    true,
    'Ashlesha',
    'Karkataka (Cancer)',
    'Vasishta'
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
    '00000000-0000-4000-a000-000000000024'::uuid,
    '00000000-0000-4000-a000-000000000024'::uuid,
    28,
    32,
    168,
    180,
    array['never_married'],
    'Graduate / Post Graduate',
    'Banking / Govt / Professional',
    array['Amalapuram', 'Kakinada', 'Rajahmundry', 'Hyderabad'],
    'vegetarian',
    'A disciplined, responsible person with good family upbringing.'
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

  insert into public.profile_photos (
    profile_id, owner_id, storage_path, is_primary, consented
  ) values (
    '00000000-0000-4000-a000-000000000024'::uuid,
    '00000000-0000-4000-a000-000000000024'::uuid,
    '/images/profiles/demo-bride-04.jpg?p=B24',
    true, true
  ) on conflict (storage_path) do update
  set profile_id = excluded.profile_id,
      owner_id = excluded.owner_id,
      is_primary = true;

  -- Member 25: Madhavi Kadali (SB-DEMO-B25)
  insert into auth.users (
    id, instance_id, aud, role, email, encrypted_password,
    email_confirmed_at, raw_app_meta_data, raw_user_meta_data, created_at, updated_at
  ) values (
    '00000000-0000-4000-a000-000000000025'::uuid,
    '00000000-0000-0000-0000-000000000000',
    'authenticated', 'authenticated',
    'demo-b25@shettibalijamatrimony.internal',
    crypt('DemoPass123!', gen_salt('bf')),
    now(),
    jsonb_build_object('provider', 'email', 'providers', array['email']),
    jsonb_build_object('full_name', 'Madhavi Kadali', 'gender', 'bride'),
    now(), now()
  ) on conflict (id) do update
  set email = excluded.email,
      raw_user_meta_data = excluded.raw_user_meta_data,
      updated_at = now();

  insert into public.profiles (
    id, full_name, gender, account_type, account_status, created_at, updated_at
  ) values (
    '00000000-0000-4000-a000-000000000025'::uuid,
    'Madhavi Kadali',
    'bride',
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
    '00000000-0000-4000-a000-000000000025'::uuid,
    '00000000-0000-4000-a000-000000000025'::uuid,
    'SB-DEMO-B25',
    'Madhavi Kadali',
    'bride',
    24,
    156,
    'never_married',
    'Shettibalija',
    'Telugu',
    'Machilipatnam',
    'Vijayawada',
    'Vijayawada',
    'Andhra Pradesh',
    'B.Sc in Computer Science',
    'Junior Web Developer',
    'Associate Developer',
    'Vijayawada',
    'Full-time',
    '₹4.2 Lakhs',
    'INR',
    'annual',
    'Carpenter & Small Enterprise',
    'Fair',
    'vegetarian',
    'No',
    'No',
    'Indian',
    array['Telugu', 'English'],
    NULL,
    NULL,
    'Atri',
    NULL,
    'Machilipatnam',
    false,
    'Junior software developer at an IT solutions provider in Vijayawada. I enjoy handicrafts, painting, and spending peaceful time with my family. Looking for a down-to-earth, genuine life partner.',
    'Hardworking artisan family known for master craftsmanship in traditional wooden furniture and interior architecture.',
    false,
    'members',
    'visible',
    'approved',
    true, now(),
    now(),
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
    '00000000-0000-4000-a000-000000000025'::uuid,
    '00000000-0000-4000-a000-000000000025'::uuid,
    '2002-10-11'::date,
    'demo-b25@shettibalijamatrimony.internal',
    'Machilipatnam'
  ) on conflict (profile_id) do update
  set date_of_birth = excluded.date_of_birth,
      email = excluded.email,
      native_place = excluded.native_place;

  insert into public.family_details (
    profile_id, owner_id, father_name, father_profession,
    mother_name, mother_profession, brothers_count, sisters_count,
    brothers_details, sisters_details, family_type, family_location, family_details
  ) values (
    '00000000-0000-4000-a000-000000000025'::uuid,
    '00000000-0000-4000-a000-000000000025'::uuid,
    'Chinna Kadali',
    'Master Carpenter & Interior Woodworks Contractor',
    'Bhavani Kadali',
    'Homemaker',
    1,
    0,
    'Brother assists in woodworks enterprise',
    NULL,
    'Nuclear',
    'Machilipatnam, Krishna Dist',
    'Hardworking artisan family known for master craftsmanship in traditional wooden furniture and interior architecture.'
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
    '00000000-0000-4000-a000-000000000025'::uuid,
    '00000000-0000-4000-a000-000000000025'::uuid,
    false,
    NULL,
    NULL,
    'Atri'
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
    '00000000-0000-4000-a000-000000000025'::uuid,
    '00000000-0000-4000-a000-000000000025'::uuid,
    25,
    29,
    165,
    178,
    array['never_married'],
    'Graduate',
    'Any stable job / business',
    array['Vijayawada', 'Guntur', 'Machilipatnam'],
    'vegetarian',
    'Honest, kind-hearted individual with stable employment.'
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

  -- Member 26: Kiran Kumar Vemula (SB-DEMO-G01)
  insert into auth.users (
    id, instance_id, aud, role, email, encrypted_password,
    email_confirmed_at, raw_app_meta_data, raw_user_meta_data, created_at, updated_at
  ) values (
    '00000000-0000-4000-a000-000000000026'::uuid,
    '00000000-0000-0000-0000-000000000000',
    'authenticated', 'authenticated',
    'demo-g01@shettibalijamatrimony.internal',
    crypt('DemoPass123!', gen_salt('bf')),
    now(),
    jsonb_build_object('provider', 'email', 'providers', array['email']),
    jsonb_build_object('full_name', 'Kiran Kumar Vemula', 'gender', 'groom'),
    now(), now()
  ) on conflict (id) do update
  set email = excluded.email,
      raw_user_meta_data = excluded.raw_user_meta_data,
      updated_at = now();

  insert into public.profiles (
    id, full_name, gender, account_type, account_status, created_at, updated_at
  ) values (
    '00000000-0000-4000-a000-000000000026'::uuid,
    'Kiran Kumar Vemula',
    'groom',
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
    '00000000-0000-4000-a000-000000000026'::uuid,
    '00000000-0000-4000-a000-000000000026'::uuid,
    'SB-DEMO-G01',
    'Kiran Kumar Vemula',
    'groom',
    28,
    178,
    'never_married',
    'Shettibalija',
    'Telugu',
    'Amalapuram',
    'Hyderabad',
    'Hyderabad',
    'Telangana',
    'B.Tech in Computer Science (NIT Warangal)',
    'Senior Software Engineer',
    'Senior Staff Software Engineer',
    'Hyderabad',
    'Full-time',
    '₹32 Lakhs',
    'INR',
    'annual',
    'Agriculture & Real Estate',
    'Fair',
    'vegetarian',
    'No',
    'No',
    'Indian',
    array['Telugu', 'English', 'Hindi'],
    'Rohini',
    'Vrishabha (Taurus)',
    'Kasyapa',
    '07:30 AM',
    'Amalapuram',
    true,
    'Leading a backend distributed systems team at Uber Hyderabad. Avid marathon runner, badminton enthusiast, and fond of classical Telugu instrumental music. Looking for an educated, caring companion who appreciates both modern aspirations and traditional warmth.',
    'Well-established Godavari family with agricultural and commercial properties. Progressive views combined with strong cultural roots.',
    true,
    'members',
    'visible',
    'approved',
    true, now(),
    now(),
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
    '00000000-0000-4000-a000-000000000026'::uuid,
    '00000000-0000-4000-a000-000000000026'::uuid,
    '1998-08-10'::date,
    'demo-g01@shettibalijamatrimony.internal',
    'Amalapuram'
  ) on conflict (profile_id) do update
  set date_of_birth = excluded.date_of_birth,
      email = excluded.email,
      native_place = excluded.native_place;

  insert into public.family_details (
    profile_id, owner_id, father_name, father_profession,
    mother_name, mother_profession, brothers_count, sisters_count,
    brothers_details, sisters_details, family_type, family_location, family_details
  ) values (
    '00000000-0000-4000-a000-000000000026'::uuid,
    '00000000-0000-4000-a000-000000000026'::uuid,
    'Venkata Rao Vemula',
    'Agricultural Landowner & Real Estate Investor',
    'Satyavathi Vemula',
    'Homemaker',
    1,
    0,
    'Younger brother is an architect in Bengaluru',
    NULL,
    'Nuclear',
    'Amalapuram & Hyderabad',
    'Well-established Godavari family with agricultural and commercial properties. Progressive views combined with strong cultural roots.'
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
    '00000000-0000-4000-a000-000000000026'::uuid,
    '00000000-0000-4000-a000-000000000026'::uuid,
    true,
    'Rohini',
    'Vrishabha (Taurus)',
    'Kasyapa'
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
    '00000000-0000-4000-a000-000000000026'::uuid,
    '00000000-0000-4000-a000-000000000026'::uuid,
    23,
    27,
    158,
    170,
    array['never_married'],
    'B.Tech / MS / MBA / Doctor',
    'Software / Corporate / Doctor',
    array['Hyderabad', 'Bengaluru', 'Visakhapatnam'],
    'vegetarian',
    'Cultured, family-oriented partner with good communication, positive outlook, and mutual career support.'
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

  insert into public.profile_photos (
    profile_id, owner_id, storage_path, is_primary, consented
  ) values (
    '00000000-0000-4000-a000-000000000026'::uuid,
    '00000000-0000-4000-a000-000000000026'::uuid,
    '/images/profiles/demo-groom-01.jpg?p=G01',
    true, true
  ) on conflict (storage_path) do update
  set profile_id = excluded.profile_id,
      owner_id = excluded.owner_id,
      is_primary = true;

  -- Member 27: Dr. Vamsi Krishna Rayudu (SB-DEMO-G02)
  insert into auth.users (
    id, instance_id, aud, role, email, encrypted_password,
    email_confirmed_at, raw_app_meta_data, raw_user_meta_data, created_at, updated_at
  ) values (
    '00000000-0000-4000-a000-000000000027'::uuid,
    '00000000-0000-0000-0000-000000000000',
    'authenticated', 'authenticated',
    'demo-g02@shettibalijamatrimony.internal',
    crypt('DemoPass123!', gen_salt('bf')),
    now(),
    jsonb_build_object('provider', 'email', 'providers', array['email']),
    jsonb_build_object('full_name', 'Dr. Vamsi Krishna Rayudu', 'gender', 'groom'),
    now(), now()
  ) on conflict (id) do update
  set email = excluded.email,
      raw_user_meta_data = excluded.raw_user_meta_data,
      updated_at = now();

  insert into public.profiles (
    id, full_name, gender, account_type, account_status, created_at, updated_at
  ) values (
    '00000000-0000-4000-a000-000000000027'::uuid,
    'Dr. Vamsi Krishna Rayudu',
    'groom',
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
    '00000000-0000-4000-a000-000000000027'::uuid,
    '00000000-0000-4000-a000-000000000027'::uuid,
    'SB-DEMO-G02',
    'Dr. Vamsi Krishna Rayudu',
    'groom',
    31,
    182,
    'never_married',
    'Shettibalija',
    'Telugu',
    'Kakinada',
    'Visakhapatnam',
    'Visakhapatnam',
    'Andhra Pradesh',
    'MBBS, MS in Orthopedics (Andhra Medical College)',
    'Orthopedic Surgeon',
    'Consultant Orthopedic Surgeon',
    'Visakhapatnam',
    'Hospital & Private',
    '₹24 Lakhs',
    'INR',
    'annual',
    'Medical & Business',
    'Wheatish',
    'vegetarian',
    'No',
    'No',
    'Indian',
    array['Telugu', 'English'],
    'Uttara Phalguni',
    'Kanya (Virgo)',
    'Viswamitra',
    '10:15 AM',
    'Kakinada',
    true,
    'Consultant surgeon at a multi-specialty hospital in Visakhapatnam. Passionate about sports medicine and joint reconstruction. Outside work, I enjoy coastal cycling, photography, and reading. Seeking an understanding, educated life partner who values empathy and family life.',
    'Distinguished medical family from Kakinada with decades of healthcare service. High cultural values and academic atmosphere.',
    true,
    'members',
    'visible',
    'approved',
    true, now(),
    now(),
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
    '00000000-0000-4000-a000-000000000027'::uuid,
    '00000000-0000-4000-a000-000000000027'::uuid,
    '1995-04-14'::date,
    'demo-g02@shettibalijamatrimony.internal',
    'Kakinada'
  ) on conflict (profile_id) do update
  set date_of_birth = excluded.date_of_birth,
      email = excluded.email,
      native_place = excluded.native_place;

  insert into public.family_details (
    profile_id, owner_id, father_name, father_profession,
    mother_name, mother_profession, brothers_count, sisters_count,
    brothers_details, sisters_details, family_type, family_location, family_details
  ) values (
    '00000000-0000-4000-a000-000000000027'::uuid,
    '00000000-0000-4000-a000-000000000027'::uuid,
    'Dr. Ramachandra Rao Rayudu',
    'Senior Consultant Physician (Retired)',
    'Madhavi Rayudu',
    'Homemaker',
    0,
    1,
    NULL,
    'Sister is a dental surgeon married in Hyderabad',
    'Nuclear',
    'Kakinada & Visakhapatnam',
    'Distinguished medical family from Kakinada with decades of healthcare service. High cultural values and academic atmosphere.'
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
    '00000000-0000-4000-a000-000000000027'::uuid,
    '00000000-0000-4000-a000-000000000027'::uuid,
    true,
    'Uttara Phalguni',
    'Kanya (Virgo)',
    'Viswamitra'
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
    '00000000-0000-4000-a000-000000000027'::uuid,
    '00000000-0000-4000-a000-000000000027'::uuid,
    25,
    29,
    160,
    172,
    array['never_married'],
    'Doctor / Post Graduate / Engineer',
    'Doctor / Healthcare / Professional',
    array['Visakhapatnam', 'Kakinada', 'Hyderabad'],
    'vegetarian',
    'Understanding, supportive partner who appreciates the medical profession and shares family values.'
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

  insert into public.profile_photos (
    profile_id, owner_id, storage_path, is_primary, consented
  ) values (
    '00000000-0000-4000-a000-000000000027'::uuid,
    '00000000-0000-4000-a000-000000000027'::uuid,
    '/images/profiles/demo-groom-02.jpg?p=G02',
    true, true
  ) on conflict (storage_path) do update
  set profile_id = excluded.profile_id,
      owner_id = excluded.owner_id,
      is_primary = true;

  -- Member 28: Sai Karthik Koppisetti (SB-DEMO-G03)
  insert into auth.users (
    id, instance_id, aud, role, email, encrypted_password,
    email_confirmed_at, raw_app_meta_data, raw_user_meta_data, created_at, updated_at
  ) values (
    '00000000-0000-4000-a000-000000000028'::uuid,
    '00000000-0000-0000-0000-000000000000',
    'authenticated', 'authenticated',
    'demo-g03@shettibalijamatrimony.internal',
    crypt('DemoPass123!', gen_salt('bf')),
    now(),
    jsonb_build_object('provider', 'email', 'providers', array['email']),
    jsonb_build_object('full_name', 'Sai Karthik Koppisetti', 'gender', 'groom'),
    now(), now()
  ) on conflict (id) do update
  set email = excluded.email,
      raw_user_meta_data = excluded.raw_user_meta_data,
      updated_at = now();

  insert into public.profiles (
    id, full_name, gender, account_type, account_status, created_at, updated_at
  ) values (
    '00000000-0000-4000-a000-000000000028'::uuid,
    'Sai Karthik Koppisetti',
    'groom',
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
    '00000000-0000-4000-a000-000000000028'::uuid,
    '00000000-0000-4000-a000-000000000028'::uuid,
    'SB-DEMO-G03',
    'Sai Karthik Koppisetti',
    'groom',
    29,
    180,
    'never_married',
    'Shettibalija',
    'Telugu',
    'Rajahmundry',
    'Bengaluru',
    'Bengaluru',
    'Karnataka',
    'B.Tech, M.Tech in Computer Science (IIT Madras)',
    'Principal Software Architect',
    'Principal Architect',
    'Bengaluru',
    'Full-time',
    '₹40 Lakhs',
    'INR',
    'annual',
    'Business & Corporate',
    'Fair',
    'eggetarian',
    'No',
    'No',
    'Indian',
    array['Telugu', 'English', 'Kannada'],
    'Swati',
    'Tula (Libra)',
    'Bharadwaja',
    '06:45 AM',
    'Rajahmundry',
    true,
    'Working as a principal systems architect at Cisco Bengaluru. I love building high-scale distributed networks, playing tennis, and weekend filter coffee brewing. Seeking an intelligent, fun-loving, and compassionate life partner.',
    'Commercial and industrial business family in Rajahmundry. Respected for integrity, philanthropy, and family closeness.',
    true,
    'members',
    'visible',
    'approved',
    true, now(),
    now(),
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
    '00000000-0000-4000-a000-000000000028'::uuid,
    '00000000-0000-4000-a000-000000000028'::uuid,
    '1997-10-05'::date,
    'demo-g03@shettibalijamatrimony.internal',
    'Rajahmundry'
  ) on conflict (profile_id) do update
  set date_of_birth = excluded.date_of_birth,
      email = excluded.email,
      native_place = excluded.native_place;

  insert into public.family_details (
    profile_id, owner_id, father_name, father_profession,
    mother_name, mother_profession, brothers_count, sisters_count,
    brothers_details, sisters_details, family_type, family_location, family_details
  ) values (
    '00000000-0000-4000-a000-000000000028'::uuid,
    '00000000-0000-4000-a000-000000000028'::uuid,
    'Suryanarayana Koppisetti',
    'Printing Press & Packaging Enterprise Owner',
    'Rajeswari Koppisetti',
    'Homemaker',
    1,
    0,
    'Younger brother running regional packaging unit',
    NULL,
    'Nuclear',
    'Rajahmundry, AP',
    'Commercial and industrial business family in Rajahmundry. Respected for integrity, philanthropy, and family closeness.'
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
    '00000000-0000-4000-a000-000000000028'::uuid,
    '00000000-0000-4000-a000-000000000028'::uuid,
    true,
    'Swati',
    'Tula (Libra)',
    'Bharadwaja'
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
    '00000000-0000-4000-a000-000000000028'::uuid,
    '00000000-0000-4000-a000-000000000028'::uuid,
    24,
    28,
    162,
    174,
    array['never_married'],
    'B.Tech / MS / MBA / CA',
    'Tech / Finance / Corporate',
    array['Bengaluru', 'Hyderabad', 'Abroad'],
    'any',
    'An ambitious, open-minded companion who communicates transparently and respects family traditions.'
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

  insert into public.profile_photos (
    profile_id, owner_id, storage_path, is_primary, consented
  ) values (
    '00000000-0000-4000-a000-000000000028'::uuid,
    '00000000-0000-4000-a000-000000000028'::uuid,
    '/images/profiles/demo-groom-03.jpg?p=G03',
    true, true
  ) on conflict (storage_path) do update
  set profile_id = excluded.profile_id,
      owner_id = excluded.owner_id,
      is_primary = true;

  -- Member 29: Sandeep Pilli (SB-DEMO-G04)
  insert into auth.users (
    id, instance_id, aud, role, email, encrypted_password,
    email_confirmed_at, raw_app_meta_data, raw_user_meta_data, created_at, updated_at
  ) values (
    '00000000-0000-4000-a000-000000000029'::uuid,
    '00000000-0000-0000-0000-000000000000',
    'authenticated', 'authenticated',
    'demo-g04@shettibalijamatrimony.internal',
    crypt('DemoPass123!', gen_salt('bf')),
    now(),
    jsonb_build_object('provider', 'email', 'providers', array['email']),
    jsonb_build_object('full_name', 'Sandeep Pilli', 'gender', 'groom'),
    now(), now()
  ) on conflict (id) do update
  set email = excluded.email,
      raw_user_meta_data = excluded.raw_user_meta_data,
      updated_at = now();

  insert into public.profiles (
    id, full_name, gender, account_type, account_status, created_at, updated_at
  ) values (
    '00000000-0000-4000-a000-000000000029'::uuid,
    'Sandeep Pilli',
    'groom',
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
    '00000000-0000-4000-a000-000000000029'::uuid,
    '00000000-0000-4000-a000-000000000029'::uuid,
    'SB-DEMO-G04',
    'Sandeep Pilli',
    'groom',
    27,
    175,
    'never_married',
    'Shettibalija',
    'Telugu',
    'Bhimavaram',
    'Hyderabad',
    'Hyderabad',
    'Telangana',
    'B.Tech, MS in Computer Engineering (USC, Los Angeles)',
    'Staff Hardware Engineer',
    'Staff Silicon Engineer',
    'Hyderabad',
    'Full-time',
    '₹28 Lakhs',
    'INR',
    'annual',
    'Aquaculture & Engineering',
    'Wheatish',
    'non_vegetarian',
    'No',
    'No',
    'Indian',
    array['Telugu', 'English'],
    'Anuradha',
    'Vrishchika (Scorpio)',
    'Kaundinya',
    '02:20 PM',
    'Bhimavaram',
    true,
    'Staff Engineer at Qualcomm Hyderabad working on 5G processors. Enthusiastic about technology, table tennis, and family road trips to Godavari riverbanks. Looking for a smart, joyful partner who shares traditional family warmth and modern lifestyle.',
    'Influential business family from Bhimavaram with agricultural and export operations. Deep community roots and modern education.',
    true,
    'members',
    'visible',
    'approved',
    true, now(),
    now(),
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
    '00000000-0000-4000-a000-000000000029'::uuid,
    '00000000-0000-4000-a000-000000000029'::uuid,
    '1999-02-23'::date,
    'demo-g04@shettibalijamatrimony.internal',
    'Bhimavaram'
  ) on conflict (profile_id) do update
  set date_of_birth = excluded.date_of_birth,
      email = excluded.email,
      native_place = excluded.native_place;

  insert into public.family_details (
    profile_id, owner_id, father_name, father_profession,
    mother_name, mother_profession, brothers_count, sisters_count,
    brothers_details, sisters_details, family_type, family_location, family_details
  ) values (
    '00000000-0000-4000-a000-000000000029'::uuid,
    '00000000-0000-4000-a000-000000000029'::uuid,
    'Subrahmanyam Pilli',
    'Aquaculture Processing Plant Partner',
    'Venkatamma Pilli',
    'Homemaker',
    1,
    0,
    'Younger brother pursuing MS in Germany',
    NULL,
    'Joint',
    'Bhimavaram & Hyderabad',
    'Influential business family from Bhimavaram with agricultural and export operations. Deep community roots and modern education.'
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
    '00000000-0000-4000-a000-000000000029'::uuid,
    '00000000-0000-4000-a000-000000000029'::uuid,
    true,
    'Anuradha',
    'Vrishchika (Scorpio)',
    'Kaundinya'
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
    '00000000-0000-4000-a000-000000000029'::uuid,
    '00000000-0000-4000-a000-000000000029'::uuid,
    23,
    27,
    158,
    170,
    array['never_married'],
    'B.Tech / MS / MBA',
    'Software / Corporate / Banking',
    array['Hyderabad', 'Vijayawada', 'Visakhapatnam'],
    'any',
    'A sweet-natured, cultured companion from an educated family with good moral values.'
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

  insert into public.profile_photos (
    profile_id, owner_id, storage_path, is_primary, consented
  ) values (
    '00000000-0000-4000-a000-000000000029'::uuid,
    '00000000-0000-4000-a000-000000000029'::uuid,
    '/images/profiles/demo-groom-04.jpg?p=G04',
    true, true
  ) on conflict (storage_path) do update
  set profile_id = excluded.profile_id,
      owner_id = excluded.owner_id,
      is_primary = true;

  -- Member 30: Harish Battula (SB-DEMO-G05)
  insert into auth.users (
    id, instance_id, aud, role, email, encrypted_password,
    email_confirmed_at, raw_app_meta_data, raw_user_meta_data, created_at, updated_at
  ) values (
    '00000000-0000-4000-a000-000000000030'::uuid,
    '00000000-0000-0000-0000-000000000000',
    'authenticated', 'authenticated',
    'demo-g05@shettibalijamatrimony.internal',
    crypt('DemoPass123!', gen_salt('bf')),
    now(),
    jsonb_build_object('provider', 'email', 'providers', array['email']),
    jsonb_build_object('full_name', 'Harish Battula', 'gender', 'groom'),
    now(), now()
  ) on conflict (id) do update
  set email = excluded.email,
      raw_user_meta_data = excluded.raw_user_meta_data,
      updated_at = now();

  insert into public.profiles (
    id, full_name, gender, account_type, account_status, created_at, updated_at
  ) values (
    '00000000-0000-4000-a000-000000000030'::uuid,
    'Harish Battula',
    'groom',
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
    '00000000-0000-4000-a000-000000000030'::uuid,
    '00000000-0000-4000-a000-000000000030'::uuid,
    'SB-DEMO-G05',
    'Harish Battula',
    'groom',
    30,
    176,
    'never_married',
    'Shettibalija',
    'Telugu',
    'Machilipatnam',
    'Vijayawada',
    'Vijayawada',
    'Andhra Pradesh',
    'Chartered Accountant (FCA, ICAI)',
    'Chartered Accountant',
    'Senior Partner - Audit & Tax',
    'Vijayawada',
    'Practice Partner',
    '₹20 Lakhs',
    'INR',
    'annual',
    'Finance & Taxation',
    'Fair',
    'vegetarian',
    'No',
    'No',
    'Indian',
    array['Telugu', 'English', 'Hindi'],
    'Ashwini',
    'Mesha (Aries)',
    'Vasishta',
    '09:10 AM',
    'Machilipatnam',
    true,
    'Partner at a reputed accounting firm in Vijayawada. Passionate about taxation, financial mentoring, and playing chess. I value calm demeanor, family celebrations, and honesty in relationships. Seeking a sensible, caring partner to share life''s milestones.',
    'Finance and banking background family settled in Vijayawada. Known for ethical business practice and active philanthropic work.',
    true,
    'members',
    'visible',
    'approved',
    true, now(),
    now(),
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
    '00000000-0000-4000-a000-000000000030'::uuid,
    '00000000-0000-4000-a000-000000000030'::uuid,
    '1996-06-18'::date,
    'demo-g05@shettibalijamatrimony.internal',
    'Machilipatnam'
  ) on conflict (profile_id) do update
  set date_of_birth = excluded.date_of_birth,
      email = excluded.email,
      native_place = excluded.native_place;

  insert into public.family_details (
    profile_id, owner_id, father_name, father_profession,
    mother_name, mother_profession, brothers_count, sisters_count,
    brothers_details, sisters_details, family_type, family_location, family_details
  ) values (
    '00000000-0000-4000-a000-000000000030'::uuid,
    '00000000-0000-4000-a000-000000000030'::uuid,
    'Durgaprasad Battula',
    'Senior Bank Manager (Retired)',
    'Sarada Battula',
    'Homemaker',
    0,
    1,
    NULL,
    'Sister is a dental surgeon married in Guntur',
    'Nuclear',
    'Vijayawada & Machilipatnam',
    'Finance and banking background family settled in Vijayawada. Known for ethical business practice and active philanthropic work.'
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
    '00000000-0000-4000-a000-000000000030'::uuid,
    '00000000-0000-4000-a000-000000000030'::uuid,
    true,
    'Ashwini',
    'Mesha (Aries)',
    'Vasishta'
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
    '00000000-0000-4000-a000-000000000030'::uuid,
    '00000000-0000-4000-a000-000000000030'::uuid,
    24,
    28,
    158,
    170,
    array['never_married'],
    'CA / MBA / B.Tech / Post Graduate',
    'Finance / Tech / Banking / Teaching',
    array['Vijayawada', 'Guntur', 'Hyderabad', 'Machilipatnam'],
    'vegetarian',
    'Cultured, family-centric individual with good education and positive outlook.'
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

  insert into public.profile_photos (
    profile_id, owner_id, storage_path, is_primary, consented
  ) values (
    '00000000-0000-4000-a000-000000000030'::uuid,
    '00000000-0000-4000-a000-000000000030'::uuid,
    '/images/profiles/demo-groom-01.jpg?p=G05',
    true, true
  ) on conflict (storage_path) do update
  set profile_id = excluded.profile_id,
      owner_id = excluded.owner_id,
      is_primary = true;

  -- Member 31: Praveen Challa (SB-DEMO-G06)
  insert into auth.users (
    id, instance_id, aud, role, email, encrypted_password,
    email_confirmed_at, raw_app_meta_data, raw_user_meta_data, created_at, updated_at
  ) values (
    '00000000-0000-4000-a000-000000000031'::uuid,
    '00000000-0000-0000-0000-000000000000',
    'authenticated', 'authenticated',
    'demo-g06@shettibalijamatrimony.internal',
    crypt('DemoPass123!', gen_salt('bf')),
    now(),
    jsonb_build_object('provider', 'email', 'providers', array['email']),
    jsonb_build_object('full_name', 'Praveen Challa', 'gender', 'groom'),
    now(), now()
  ) on conflict (id) do update
  set email = excluded.email,
      raw_user_meta_data = excluded.raw_user_meta_data,
      updated_at = now();

  insert into public.profiles (
    id, full_name, gender, account_type, account_status, created_at, updated_at
  ) values (
    '00000000-0000-4000-a000-000000000031'::uuid,
    'Praveen Challa',
    'groom',
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
    '00000000-0000-4000-a000-000000000031'::uuid,
    '00000000-0000-4000-a000-000000000031'::uuid,
    'SB-DEMO-G06',
    'Praveen Challa',
    'groom',
    26,
    177,
    'never_married',
    'Shettibalija',
    'Telugu',
    'Eluru',
    'Hyderabad',
    'Hyderabad',
    'Telangana',
    'B.Tech in Mechanical Engineering (Osmania University)',
    'Robotics Engineer',
    'Senior Automation Engineer',
    'Hyderabad',
    'Full-time',
    '₹11 Lakhs',
    'INR',
    'annual',
    'Engineering & Industry',
    'Wheatish',
    'vegetarian',
    'No',
    'No',
    'Indian',
    array['Telugu', 'English'],
    'Revati',
    'Meena (Pisces)',
    'Atri',
    '05:40 PM',
    'Eluru',
    true,
    'Working on automotive robotics and autonomous manufacturing systems at Hyundai Mobis. I love tech gadgets, cricket, and weekend cooking experiments. Looking for an understanding, pleasant partner with whom I can build a warm, happy future.',
    'Government engineering service family. Values disciplined lifestyle, hospitality, and educational excellence.',
    true,
    'members',
    'visible',
    'approved',
    true, now(),
    now(),
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
    '00000000-0000-4000-a000-000000000031'::uuid,
    '00000000-0000-4000-a000-000000000031'::uuid,
    '2000-01-30'::date,
    'demo-g06@shettibalijamatrimony.internal',
    'Eluru'
  ) on conflict (profile_id) do update
  set date_of_birth = excluded.date_of_birth,
      email = excluded.email,
      native_place = excluded.native_place;

  insert into public.family_details (
    profile_id, owner_id, father_name, father_profession,
    mother_name, mother_profession, brothers_count, sisters_count,
    brothers_details, sisters_details, family_type, family_location, family_details
  ) values (
    '00000000-0000-4000-a000-000000000031'::uuid,
    '00000000-0000-4000-a000-000000000031'::uuid,
    'Satyanarayana Challa',
    'Deputy Executive Engineer (R&B Dept)',
    'Bhavani Challa',
    'Homemaker',
    1,
    0,
    'Elder brother is an MBA working in Bengaluru',
    NULL,
    'Nuclear',
    'Eluru & Hyderabad',
    'Government engineering service family. Values disciplined lifestyle, hospitality, and educational excellence.'
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
    '00000000-0000-4000-a000-000000000031'::uuid,
    '00000000-0000-4000-a000-000000000031'::uuid,
    true,
    'Revati',
    'Meena (Pisces)',
    'Atri'
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
    '00000000-0000-4000-a000-000000000031'::uuid,
    '00000000-0000-4000-a000-000000000031'::uuid,
    22,
    26,
    156,
    168,
    array['never_married'],
    'B.Tech / MBA / Graduate',
    'Software / Corporate / Govt',
    array['Hyderabad', 'Vijayawada', 'Eluru'],
    'vegetarian',
    'A cheerful, down-to-earth person who values family bonding and mutual respect.'
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

  insert into public.profile_photos (
    profile_id, owner_id, storage_path, is_primary, consented
  ) values (
    '00000000-0000-4000-a000-000000000031'::uuid,
    '00000000-0000-4000-a000-000000000031'::uuid,
    '/images/profiles/demo-groom-02.jpg?p=G06',
    true, true
  ) on conflict (storage_path) do update
  set profile_id = excluded.profile_id,
      owner_id = excluded.owner_id,
      is_primary = true;

  -- Member 32: Naveen Grandhi (SB-DEMO-G07)
  insert into auth.users (
    id, instance_id, aud, role, email, encrypted_password,
    email_confirmed_at, raw_app_meta_data, raw_user_meta_data, created_at, updated_at
  ) values (
    '00000000-0000-4000-a000-000000000032'::uuid,
    '00000000-0000-0000-0000-000000000000',
    'authenticated', 'authenticated',
    'demo-g07@shettibalijamatrimony.internal',
    crypt('DemoPass123!', gen_salt('bf')),
    now(),
    jsonb_build_object('provider', 'email', 'providers', array['email']),
    jsonb_build_object('full_name', 'Naveen Grandhi', 'gender', 'groom'),
    now(), now()
  ) on conflict (id) do update
  set email = excluded.email,
      raw_user_meta_data = excluded.raw_user_meta_data,
      updated_at = now();

  insert into public.profiles (
    id, full_name, gender, account_type, account_status, created_at, updated_at
  ) values (
    '00000000-0000-4000-a000-000000000032'::uuid,
    'Naveen Grandhi',
    'groom',
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
    '00000000-0000-4000-a000-000000000032'::uuid,
    '00000000-0000-4000-a000-000000000032'::uuid,
    'SB-DEMO-G07',
    'Naveen Grandhi',
    'groom',
    32,
    179,
    'never_married',
    'Shettibalija',
    'Telugu',
    'Kakinada',
    'Kakinada',
    'Kakinada',
    'Andhra Pradesh',
    'B.Tech, Master in Construction Management (NICMAR)',
    'Civil & Marine Contractor',
    'Managing Director',
    'Kakinada',
    'Business Owner',
    '₹35 Lakhs',
    'INR',
    'annual',
    'Port Logistics & Marine Contracting',
    'Wheatish',
    'non_vegetarian',
    'No',
    'No',
    'Indian',
    array['Telugu', 'English', 'Hindi'],
    'Dhanishta',
    'Makara (Capricorn)',
    'Harita',
    '01:20 PM',
    'Kakinada',
    true,
    'Managing maritime construction and coastal infrastructure projects across Kakinada deepwater port. Enjoy deep-sea angling, fitness, and family get-togethers. Seeking a confident, gracious partner from an affectionate family.',
    'Prominent coastal business family with extensive port development projects. Known for community leadership, trust, and enterprise.',
    true,
    'members',
    'visible',
    'approved',
    true, now(),
    now(),
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
    '00000000-0000-4000-a000-000000000032'::uuid,
    '00000000-0000-4000-a000-000000000032'::uuid,
    '1994-11-12'::date,
    'demo-g07@shettibalijamatrimony.internal',
    'Kakinada'
  ) on conflict (profile_id) do update
  set date_of_birth = excluded.date_of_birth,
      email = excluded.email,
      native_place = excluded.native_place;

  insert into public.family_details (
    profile_id, owner_id, father_name, father_profession,
    mother_name, mother_profession, brothers_count, sisters_count,
    brothers_details, sisters_details, family_type, family_location, family_details
  ) values (
    '00000000-0000-4000-a000-000000000032'::uuid,
    '00000000-0000-4000-a000-000000000032'::uuid,
    'Prasad Grandhi',
    'Class-I Port & Coastal Works Contractor',
    'Usha Grandhi',
    'Homemaker',
    1,
    1,
    'Brother manages port logistics company',
    'Sister married to a civil surgeon in Rajahmundry',
    'Joint',
    'Kakinada, AP',
    'Prominent coastal business family with extensive port development projects. Known for community leadership, trust, and enterprise.'
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
    '00000000-0000-4000-a000-000000000032'::uuid,
    '00000000-0000-4000-a000-000000000032'::uuid,
    true,
    'Dhanishta',
    'Makara (Capricorn)',
    'Harita'
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
    '00000000-0000-4000-a000-000000000032'::uuid,
    '00000000-0000-4000-a000-000000000032'::uuid,
    25,
    30,
    162,
    175,
    array['never_married'],
    'Graduate / Post Graduate',
    'Any professional or business background',
    array['Kakinada', 'Visakhapatnam', 'Hyderabad'],
    'any',
    'Cultured, articulate, and family-oriented partner with mutual respect.'
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

  insert into public.profile_photos (
    profile_id, owner_id, storage_path, is_primary, consented
  ) values (
    '00000000-0000-4000-a000-000000000032'::uuid,
    '00000000-0000-4000-a000-000000000032'::uuid,
    '/images/profiles/demo-groom-03.jpg?p=G07',
    true, true
  ) on conflict (storage_path) do update
  set profile_id = excluded.profile_id,
      owner_id = excluded.owner_id,
      is_primary = true;

  -- Member 33: Rohit Nallamilli (SB-DEMO-G08)
  insert into auth.users (
    id, instance_id, aud, role, email, encrypted_password,
    email_confirmed_at, raw_app_meta_data, raw_user_meta_data, created_at, updated_at
  ) values (
    '00000000-0000-4000-a000-000000000033'::uuid,
    '00000000-0000-0000-0000-000000000000',
    'authenticated', 'authenticated',
    'demo-g08@shettibalijamatrimony.internal',
    crypt('DemoPass123!', gen_salt('bf')),
    now(),
    jsonb_build_object('provider', 'email', 'providers', array['email']),
    jsonb_build_object('full_name', 'Rohit Nallamilli', 'gender', 'groom'),
    now(), now()
  ) on conflict (id) do update
  set email = excluded.email,
      raw_user_meta_data = excluded.raw_user_meta_data,
      updated_at = now();

  insert into public.profiles (
    id, full_name, gender, account_type, account_status, created_at, updated_at
  ) values (
    '00000000-0000-4000-a000-000000000033'::uuid,
    'Rohit Nallamilli',
    'groom',
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
    '00000000-0000-4000-a000-000000000033'::uuid,
    '00000000-0000-4000-a000-000000000033'::uuid,
    'SB-DEMO-G08',
    'Rohit Nallamilli',
    'groom',
    28,
    181,
    'never_married',
    'Shettibalija',
    'Telugu',
    'Amalapuram',
    'Chennai',
    'Chennai',
    'Tamil Nadu',
    'B.Tech in ECE (SSN College of Engineering)',
    'Semiconductor Design Engineer',
    'Senior ASIC Design Engineer',
    'Chennai',
    'Full-time',
    '₹22 Lakhs',
    'INR',
    'annual',
    'Trader & Landowner',
    'Fair',
    'vegetarian',
    'No',
    'No',
    'Indian',
    array['Telugu', 'English', 'Tamil'],
    'Hasta',
    'Kanya (Virgo)',
    'Agastya',
    '08:15 AM',
    'Amalapuram',
    true,
    'Senior hardware design engineer at Texas Instruments Chennai. Outside chip architecture, I enjoy badminton, weekend coastal drives, and Telugu film comedy. Looking for a progressive, pleasant life partner who values family unity and mutual career support.',
    'Respected trading and landowning family in Amalapuram. Grounded in traditional Godavari hospitality and progressive outlook.',
    true,
    'members',
    'visible',
    'approved',
    true, now(),
    now(),
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
    '00000000-0000-4000-a000-000000000033'::uuid,
    '00000000-0000-4000-a000-000000000033'::uuid,
    '1998-03-27'::date,
    'demo-g08@shettibalijamatrimony.internal',
    'Amalapuram'
  ) on conflict (profile_id) do update
  set date_of_birth = excluded.date_of_birth,
      email = excluded.email,
      native_place = excluded.native_place;

  insert into public.family_details (
    profile_id, owner_id, father_name, father_profession,
    mother_name, mother_profession, brothers_count, sisters_count,
    brothers_details, sisters_details, family_type, family_location, family_details
  ) values (
    '00000000-0000-4000-a000-000000000033'::uuid,
    '00000000-0000-4000-a000-000000000033'::uuid,
    'Nagendra Rao Nallamilli',
    'Paddy & Coconut Trader and Landowner',
    'Suryavathi Nallamilli',
    'Homemaker',
    0,
    1,
    NULL,
    'Sister completed B.Tech, married in Hyderabad',
    'Nuclear',
    'Amalapuram & Chennai',
    'Respected trading and landowning family in Amalapuram. Grounded in traditional Godavari hospitality and progressive outlook.'
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
    '00000000-0000-4000-a000-000000000033'::uuid,
    '00000000-0000-4000-a000-000000000033'::uuid,
    true,
    'Hasta',
    'Kanya (Virgo)',
    'Agastya'
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
    '00000000-0000-4000-a000-000000000033'::uuid,
    '00000000-0000-4000-a000-000000000033'::uuid,
    23,
    27,
    160,
    172,
    array['never_married'],
    'B.Tech / MS / MBA',
    'Tech / Corporate / Banking',
    array['Chennai', 'Hyderabad', 'Bengaluru', 'Kakinada'],
    'vegetarian',
    'Kind-hearted, educated partner who enjoys meaningful conversations and respects elders.'
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

  insert into public.profile_photos (
    profile_id, owner_id, storage_path, is_primary, consented
  ) values (
    '00000000-0000-4000-a000-000000000033'::uuid,
    '00000000-0000-4000-a000-000000000033'::uuid,
    '/images/profiles/demo-groom-04.jpg?p=G08',
    true, true
  ) on conflict (storage_path) do update
  set profile_id = excluded.profile_id,
      owner_id = excluded.owner_id,
      is_primary = true;

  -- Member 34: Mahesh Medisetti (SB-DEMO-G09)
  insert into auth.users (
    id, instance_id, aud, role, email, encrypted_password,
    email_confirmed_at, raw_app_meta_data, raw_user_meta_data, created_at, updated_at
  ) values (
    '00000000-0000-4000-a000-000000000034'::uuid,
    '00000000-0000-0000-0000-000000000000',
    'authenticated', 'authenticated',
    'demo-g09@shettibalijamatrimony.internal',
    crypt('DemoPass123!', gen_salt('bf')),
    now(),
    jsonb_build_object('provider', 'email', 'providers', array['email']),
    jsonb_build_object('full_name', 'Mahesh Medisetti', 'gender', 'groom'),
    now(), now()
  ) on conflict (id) do update
  set email = excluded.email,
      raw_user_meta_data = excluded.raw_user_meta_data,
      updated_at = now();

  insert into public.profiles (
    id, full_name, gender, account_type, account_status, created_at, updated_at
  ) values (
    '00000000-0000-4000-a000-000000000034'::uuid,
    'Mahesh Medisetti',
    'groom',
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
    '00000000-0000-4000-a000-000000000034'::uuid,
    '00000000-0000-4000-a000-000000000034'::uuid,
    'SB-DEMO-G09',
    'Mahesh Medisetti',
    'groom',
    30,
    176,
    'never_married',
    'Shettibalija',
    'Telugu',
    'Rajahmundry',
    'Mumbai',
    'Mumbai',
    'Maharashtra',
    'B.Tech, MBA in Finance (SPJIMR Mumbai)',
    'Investment Banker',
    'Vice President - M&A Advisory',
    'Mumbai',
    'Full-time',
    '₹38 Lakhs',
    'INR',
    'annual',
    'Finance & Retail',
    'Fair',
    'vegetarian',
    'No',
    'No',
    'Indian',
    array['Telugu', 'English', 'Hindi'],
    'Mrigashira',
    'Mithuna (Gemini)',
    'Sandilya',
    '04:15 PM',
    'Rajahmundry',
    true,
    'Vice President at ICICI Securities Mumbai handling corporate transactions. Passionate about economic analysis, squash, and morning jogging by Marine Drive. Looking for an ambitious, graceful companion who believes in equal partnership and family joy.',
    'Influential business family from Rajahmundry. High ethical standards, strong commercial goodwill, and warm cultural spirit.',
    true,
    'members',
    'visible',
    'approved',
    true, now(),
    now(),
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
    '00000000-0000-4000-a000-000000000034'::uuid,
    '00000000-0000-4000-a000-000000000034'::uuid,
    '1996-08-09'::date,
    'demo-g09@shettibalijamatrimony.internal',
    'Rajahmundry'
  ) on conflict (profile_id) do update
  set date_of_birth = excluded.date_of_birth,
      email = excluded.email,
      native_place = excluded.native_place;

  insert into public.family_details (
    profile_id, owner_id, father_name, father_profession,
    mother_name, mother_profession, brothers_count, sisters_count,
    brothers_details, sisters_details, family_type, family_location, family_details
  ) values (
    '00000000-0000-4000-a000-000000000034'::uuid,
    '00000000-0000-4000-a000-000000000034'::uuid,
    'Bhavani Prasad Medisetti',
    'Automobile Showroom Owner & Real Estate Investor',
    'Leelavathi Medisetti',
    'Homemaker',
    1,
    0,
    'Brother manages family automobile dealership',
    NULL,
    'Nuclear',
    'Rajahmundry & Mumbai',
    'Influential business family from Rajahmundry. High ethical standards, strong commercial goodwill, and warm cultural spirit.'
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
    '00000000-0000-4000-a000-000000000034'::uuid,
    '00000000-0000-4000-a000-000000000034'::uuid,
    true,
    'Mrigashira',
    'Mithuna (Gemini)',
    'Sandilya'
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
    '00000000-0000-4000-a000-000000000034'::uuid,
    '00000000-0000-4000-a000-000000000034'::uuid,
    24,
    29,
    160,
    172,
    array['never_married'],
    'MBA / CA / B.Tech / Post Graduate',
    'Finance / Consulting / Tech / Corporate',
    array['Mumbai', 'Hyderabad', 'Bengaluru'],
    'vegetarian',
    'An accomplished, emotionally grounded partner with warmth, optimism, and good family background.'
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

  insert into public.profile_photos (
    profile_id, owner_id, storage_path, is_primary, consented
  ) values (
    '00000000-0000-4000-a000-000000000034'::uuid,
    '00000000-0000-4000-a000-000000000034'::uuid,
    '/images/profiles/demo-groom-01.jpg?p=G09',
    true, true
  ) on conflict (storage_path) do update
  set profile_id = excluded.profile_id,
      owner_id = excluded.owner_id,
      is_primary = true;

  -- Member 35: Vinay Vendra (SB-DEMO-G10)
  insert into auth.users (
    id, instance_id, aud, role, email, encrypted_password,
    email_confirmed_at, raw_app_meta_data, raw_user_meta_data, created_at, updated_at
  ) values (
    '00000000-0000-4000-a000-000000000035'::uuid,
    '00000000-0000-0000-0000-000000000000',
    'authenticated', 'authenticated',
    'demo-g10@shettibalijamatrimony.internal',
    crypt('DemoPass123!', gen_salt('bf')),
    now(),
    jsonb_build_object('provider', 'email', 'providers', array['email']),
    jsonb_build_object('full_name', 'Vinay Vendra', 'gender', 'groom'),
    now(), now()
  ) on conflict (id) do update
  set email = excluded.email,
      raw_user_meta_data = excluded.raw_user_meta_data,
      updated_at = now();

  insert into public.profiles (
    id, full_name, gender, account_type, account_status, created_at, updated_at
  ) values (
    '00000000-0000-4000-a000-000000000035'::uuid,
    'Vinay Vendra',
    'groom',
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
    '00000000-0000-4000-a000-000000000035'::uuid,
    '00000000-0000-4000-a000-000000000035'::uuid,
    'SB-DEMO-G10',
    'Vinay Vendra',
    'groom',
    25,
    174,
    'never_married',
    'Shettibalija',
    'Telugu',
    'Visakhapatnam',
    'Visakhapatnam',
    'Visakhapatnam',
    'Andhra Pradesh',
    'B.Tech in Marine Engineering (Andhra University)',
    'Marine Engineer',
    'Junior Marine Engineer',
    'Visakhapatnam',
    'Port Authority',
    '₹9 Lakhs',
    'INR',
    'annual',
    'Marine & Port Logistics',
    'Dusky',
    'vegetarian',
    'No',
    'No',
    'Indian',
    array['Telugu', 'English'],
    'Pushya',
    'Karkataka (Cancer)',
    'Gautama',
    '09:40 PM',
    'Visakhapatnam',
    true,
    'Working as a marine engineer with port authority vessel maintenance. I love open sea voyages, football, and Telugu folk arts. Seeking a warm-hearted, kind companion who values simplicity and family contentment.',
    'Disciplined and affectionate defense-civilian family residing in Visakhapatnam. Grounded in integrity, family loyalty, and education.',
    true,
    'members',
    'visible',
    'approved',
    true, now(),
    now(),
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
    '00000000-0000-4000-a000-000000000035'::uuid,
    '00000000-0000-4000-a000-000000000035'::uuid,
    '2001-05-15'::date,
    'demo-g10@shettibalijamatrimony.internal',
    'Visakhapatnam'
  ) on conflict (profile_id) do update
  set date_of_birth = excluded.date_of_birth,
      email = excluded.email,
      native_place = excluded.native_place;

  insert into public.family_details (
    profile_id, owner_id, father_name, father_profession,
    mother_name, mother_profession, brothers_count, sisters_count,
    brothers_details, sisters_details, family_type, family_location, family_details
  ) values (
    '00000000-0000-4000-a000-000000000035'::uuid,
    '00000000-0000-4000-a000-000000000035'::uuid,
    'Chinna Rao Vendra',
    'Chief Mechanical Supervisor, Naval Dockyard (Retired)',
    'Varalakshmi Vendra',
    'Homemaker',
    0,
    1,
    NULL,
    'Elder sister is a lecturer in Visakhapatnam',
    'Nuclear',
    'Visakhapatnam, AP',
    'Disciplined and affectionate defense-civilian family residing in Visakhapatnam. Grounded in integrity, family loyalty, and education.'
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
    '00000000-0000-4000-a000-000000000035'::uuid,
    '00000000-0000-4000-a000-000000000035'::uuid,
    true,
    'Pushya',
    'Karkataka (Cancer)',
    'Gautama'
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
    '00000000-0000-4000-a000-000000000035'::uuid,
    '00000000-0000-4000-a000-000000000035'::uuid,
    22,
    25,
    156,
    168,
    array['never_married'],
    'Graduate / B.Tech / B.Sc',
    'Teacher / Private / IT',
    array['Visakhapatnam', 'Kakinada', 'Vizianagaram'],
    'vegetarian',
    'A soft-spoken, genuine person who appreciates family bonds and shared happiness.'
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

  insert into public.profile_photos (
    profile_id, owner_id, storage_path, is_primary, consented
  ) values (
    '00000000-0000-4000-a000-000000000035'::uuid,
    '00000000-0000-4000-a000-000000000035'::uuid,
    '/images/profiles/demo-groom-02.jpg?p=G10',
    true, true
  ) on conflict (storage_path) do update
  set profile_id = excluded.profile_id,
      owner_id = excluded.owner_id,
      is_primary = true;

  -- Member 36: Teja Ganta (SB-DEMO-G11)
  insert into auth.users (
    id, instance_id, aud, role, email, encrypted_password,
    email_confirmed_at, raw_app_meta_data, raw_user_meta_data, created_at, updated_at
  ) values (
    '00000000-0000-4000-a000-000000000036'::uuid,
    '00000000-0000-0000-0000-000000000000',
    'authenticated', 'authenticated',
    'demo-g11@shettibalijamatrimony.internal',
    crypt('DemoPass123!', gen_salt('bf')),
    now(),
    jsonb_build_object('provider', 'email', 'providers', array['email']),
    jsonb_build_object('full_name', 'Teja Ganta', 'gender', 'groom'),
    now(), now()
  ) on conflict (id) do update
  set email = excluded.email,
      raw_user_meta_data = excluded.raw_user_meta_data,
      updated_at = now();

  insert into public.profiles (
    id, full_name, gender, account_type, account_status, created_at, updated_at
  ) values (
    '00000000-0000-4000-a000-000000000036'::uuid,
    'Teja Ganta',
    'groom',
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
    '00000000-0000-4000-a000-000000000036'::uuid,
    '00000000-0000-4000-a000-000000000036'::uuid,
    'SB-DEMO-G11',
    'Teja Ganta',
    'groom',
    33,
    183,
    'never_married',
    'Shettibalija',
    'Telugu',
    'Guntur',
    'Hyderabad',
    'Hyderabad',
    'Telangana',
    'B.Sc (Agri), MBA in Agribusiness Management',
    'Agribusiness Entrepreneur',
    'Founder & Managing Director',
    'Hyderabad',
    'Business Owner',
    '₹45 Lakhs',
    'INR',
    'annual',
    'Agro Exports & Processing',
    'Fair',
    'vegetarian',
    'No',
    'No',
    'Indian',
    array['Telugu', 'English', 'Hindi'],
    'Krittika',
    'Mesha (Aries)',
    'Kasyapa',
    '07:05 AM',
    'Guntur',
    true,
    'Founder of an export agribusiness firm connecting farmers with overseas markets. Passionate about sustainable farming, horse riding, and spending time with my parents. Looking for a gracious, educated life partner who values family heritage and supportive partnership.',
    'Leading agricultural trade family from Guntur region. Known for business dynamism, community philanthropy, and deep family respect.',
    true,
    'members',
    'visible',
    'approved',
    true, now(),
    now(),
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
    '00000000-0000-4000-a000-000000000036'::uuid,
    '00000000-0000-4000-a000-000000000036'::uuid,
    '1993-09-24'::date,
    'demo-g11@shettibalijamatrimony.internal',
    'Guntur'
  ) on conflict (profile_id) do update
  set date_of_birth = excluded.date_of_birth,
      email = excluded.email,
      native_place = excluded.native_place;

  insert into public.family_details (
    profile_id, owner_id, father_name, father_profession,
    mother_name, mother_profession, brothers_count, sisters_count,
    brothers_details, sisters_details, family_type, family_location, family_details
  ) values (
    '00000000-0000-4000-a000-000000000036'::uuid,
    '00000000-0000-4000-a000-000000000036'::uuid,
    'Kotiswamy Ganta',
    'Chilli Merchant & Cold Storage Promoter',
    'Rukmini Ganta',
    'Homemaker',
    1,
    0,
    'Younger brother manages regional export warehousing',
    NULL,
    'Joint',
    'Guntur & Hyderabad',
    'Leading agricultural trade family from Guntur region. Known for business dynamism, community philanthropy, and deep family respect.'
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
    '00000000-0000-4000-a000-000000000036'::uuid,
    '00000000-0000-4000-a000-000000000036'::uuid,
    true,
    'Krittika',
    'Mesha (Aries)',
    'Kasyapa'
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
    '00000000-0000-4000-a000-000000000036'::uuid,
    '00000000-0000-4000-a000-000000000036'::uuid,
    26,
    31,
    162,
    175,
    array['never_married'],
    'Graduate / Post Graduate / Professional',
    'Any stable career / Business / Teaching',
    array['Hyderabad', 'Guntur', 'Vijayawada'],
    'vegetarian',
    'Cultured, family-loving companion with warmth, practical sense, and positive attitude.'
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

  insert into public.profile_photos (
    profile_id, owner_id, storage_path, is_primary, consented
  ) values (
    '00000000-0000-4000-a000-000000000036'::uuid,
    '00000000-0000-4000-a000-000000000036'::uuid,
    '/images/profiles/demo-groom-03.jpg?p=G11',
    true, true
  ) on conflict (storage_path) do update
  set profile_id = excluded.profile_id,
      owner_id = excluded.owner_id,
      is_primary = true;

  -- Member 37: Abhishek Karri (SB-DEMO-G12)
  insert into auth.users (
    id, instance_id, aud, role, email, encrypted_password,
    email_confirmed_at, raw_app_meta_data, raw_user_meta_data, created_at, updated_at
  ) values (
    '00000000-0000-4000-a000-000000000037'::uuid,
    '00000000-0000-0000-0000-000000000000',
    'authenticated', 'authenticated',
    'demo-g12@shettibalijamatrimony.internal',
    crypt('DemoPass123!', gen_salt('bf')),
    now(),
    jsonb_build_object('provider', 'email', 'providers', array['email']),
    jsonb_build_object('full_name', 'Abhishek Karri', 'gender', 'groom'),
    now(), now()
  ) on conflict (id) do update
  set email = excluded.email,
      raw_user_meta_data = excluded.raw_user_meta_data,
      updated_at = now();

  insert into public.profiles (
    id, full_name, gender, account_type, account_status, created_at, updated_at
  ) values (
    '00000000-0000-4000-a000-000000000037'::uuid,
    'Abhishek Karri',
    'groom',
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
    '00000000-0000-4000-a000-000000000037'::uuid,
    '00000000-0000-4000-a000-000000000037'::uuid,
    'SB-DEMO-G12',
    'Abhishek Karri',
    'groom',
    29,
    180,
    'never_married',
    'Shettibalija',
    'Telugu',
    'Kakinada',
    'Seattle, Washington, USA',
    'Seattle',
    'Washington',
    'MS in Computer Science (University of Washington)',
    'Senior Software Engineer',
    'SDE II - AWS Cloud Infrastructure',
    'Seattle, WA, USA',
    'Full-time',
    '$155,000',
    'USD',
    'annual',
    'Technology & Real Estate',
    'Fair',
    'eggetarian',
    'No',
    'No',
    'Indian (H1B Visa)',
    array['Telugu', 'English'],
    'Magha',
    'Simha (Leo)',
    'Viswamitra',
    '03:30 AM',
    'Kakinada',
    true,
    'Working on core cloud storage at AWS in Seattle. I enjoy snowboarding in the Cascades, cooking Telugu dishes for weekend gatherings, and playing guitar. Looking for a progressive, joyful life partner settled in the US or willing to move.',
    'Highly educated and progressive family from Kakinada with global exposure. Focus on high moral character, education, and mutual respect.',
    true,
    'members',
    'visible',
    'approved',
    true, now(),
    now(),
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
    '00000000-0000-4000-a000-000000000037'::uuid,
    '00000000-0000-4000-a000-000000000037'::uuid,
    '1997-01-19'::date,
    'demo-g12@shettibalijamatrimony.internal',
    'Kakinada'
  ) on conflict (profile_id) do update
  set date_of_birth = excluded.date_of_birth,
      email = excluded.email,
      native_place = excluded.native_place;

  insert into public.family_details (
    profile_id, owner_id, father_name, father_profession,
    mother_name, mother_profession, brothers_count, sisters_count,
    brothers_details, sisters_details, family_type, family_location, family_details
  ) values (
    '00000000-0000-4000-a000-000000000037'::uuid,
    '00000000-0000-4000-a000-000000000037'::uuid,
    'Suryanarayana Karri',
    'Executive Engineer (Irrigation, Retired)',
    'Purna Chandrika Karri',
    'Homemaker',
    0,
    1,
    NULL,
    'Sister is an MS graduate working in California',
    'Nuclear',
    'Kakinada & Seattle',
    'Highly educated and progressive family from Kakinada with global exposure. Focus on high moral character, education, and mutual respect.'
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
    '00000000-0000-4000-a000-000000000037'::uuid,
    '00000000-0000-4000-a000-000000000037'::uuid,
    true,
    'Magha',
    'Simha (Leo)',
    'Viswamitra'
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
    '00000000-0000-4000-a000-000000000037'::uuid,
    '00000000-0000-4000-a000-000000000037'::uuid,
    24,
    28,
    160,
    174,
    array['never_married'],
    'MS / B.Tech / MBA / Doctor',
    'Software / Corporate / Healthcare',
    array['USA', 'Canada'],
    'any',
    'Independent, warm, and family-oriented partner with shared cultural pride and good humor.'
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

  insert into public.profile_photos (
    profile_id, owner_id, storage_path, is_primary, consented
  ) values (
    '00000000-0000-4000-a000-000000000037'::uuid,
    '00000000-0000-4000-a000-000000000037'::uuid,
    '/images/profiles/demo-groom-04.jpg?p=G12',
    true, true
  ) on conflict (storage_path) do update
  set profile_id = excluded.profile_id,
      owner_id = excluded.owner_id,
      is_primary = true;

  -- Member 38: Aditya Dommeti (SB-DEMO-G13)
  insert into auth.users (
    id, instance_id, aud, role, email, encrypted_password,
    email_confirmed_at, raw_app_meta_data, raw_user_meta_data, created_at, updated_at
  ) values (
    '00000000-0000-4000-a000-000000000038'::uuid,
    '00000000-0000-0000-0000-000000000000',
    'authenticated', 'authenticated',
    'demo-g13@shettibalijamatrimony.internal',
    crypt('DemoPass123!', gen_salt('bf')),
    now(),
    jsonb_build_object('provider', 'email', 'providers', array['email']),
    jsonb_build_object('full_name', 'Aditya Dommeti', 'gender', 'groom'),
    now(), now()
  ) on conflict (id) do update
  set email = excluded.email,
      raw_user_meta_data = excluded.raw_user_meta_data,
      updated_at = now();

  insert into public.profiles (
    id, full_name, gender, account_type, account_status, created_at, updated_at
  ) values (
    '00000000-0000-4000-a000-000000000038'::uuid,
    'Aditya Dommeti',
    'groom',
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
    '00000000-0000-4000-a000-000000000038'::uuid,
    '00000000-0000-4000-a000-000000000038'::uuid,
    'SB-DEMO-G13',
    'Aditya Dommeti',
    'groom',
    27,
    177,
    'never_married',
    'Shettibalija',
    'Telugu',
    'Amalapuram',
    'Hyderabad',
    'Hyderabad',
    'Telangana',
    'B.Tech in Civil Engineering (BITS Pilani)',
    'Construction Project Manager',
    'Project Manager - Highrise Projects',
    'Hyderabad',
    'Full-time',
    '₹16 Lakhs',
    'INR',
    'annual',
    'Contractor & Landowner',
    'Wheatish',
    'vegetarian',
    'No',
    'No',
    'Indian',
    array['Telugu', 'English', 'Hindi'],
    'Chitra',
    'Tula (Libra)',
    'Bharadwaja',
    '11:50 PM',
    'Amalapuram',
    true,
    'Managing commercial high-rise construction projects in Financial District Hyderabad. Enjoy badminton, classical music concerts, and weekend family getaways to Konaseema. Looking for an educated, understanding partner with positive family outlook.',
    'Well-known contractor family in Konaseema. Very affectionate, hospitable, and respected in community gatherings.',
    true,
    'members',
    'visible',
    'approved',
    true, now(),
    now(),
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
    '00000000-0000-4000-a000-000000000038'::uuid,
    '00000000-0000-4000-a000-000000000038'::uuid,
    '1999-04-11'::date,
    'demo-g13@shettibalijamatrimony.internal',
    'Amalapuram'
  ) on conflict (profile_id) do update
  set date_of_birth = excluded.date_of_birth,
      email = excluded.email,
      native_place = excluded.native_place;

  insert into public.family_details (
    profile_id, owner_id, father_name, father_profession,
    mother_name, mother_profession, brothers_count, sisters_count,
    brothers_details, sisters_details, family_type, family_location, family_details
  ) values (
    '00000000-0000-4000-a000-000000000038'::uuid,
    '00000000-0000-4000-a000-000000000038'::uuid,
    'Venkateswarlu Dommeti',
    'Government Civil Contractor & Coconut Planter',
    'Mahalakshmi Dommeti',
    'Homemaker',
    1,
    0,
    'Younger brother is doing MBA at IIM Ranchi',
    NULL,
    'Nuclear',
    'Amalapuram & Hyderabad',
    'Well-known contractor family in Konaseema. Very affectionate, hospitable, and respected in community gatherings.'
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
    '00000000-0000-4000-a000-000000000038'::uuid,
    '00000000-0000-4000-a000-000000000038'::uuid,
    true,
    'Chitra',
    'Tula (Libra)',
    'Bharadwaja'
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
    '00000000-0000-4000-a000-000000000038'::uuid,
    '00000000-0000-4000-a000-000000000038'::uuid,
    23,
    26,
    158,
    170,
    array['never_married'],
    'B.Tech / MBA / Graduate',
    'Tech / Corporate / Banking / Architecture',
    array['Hyderabad', 'Visakhapatnam', 'Rajahmundry'],
    'vegetarian',
    'Cultured, caring partner who values family companionship and mutual respect.'
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

  insert into public.profile_photos (
    profile_id, owner_id, storage_path, is_primary, consented
  ) values (
    '00000000-0000-4000-a000-000000000038'::uuid,
    '00000000-0000-4000-a000-000000000038'::uuid,
    '/images/profiles/demo-groom-01.jpg?p=G13',
    true, true
  ) on conflict (storage_path) do update
  set profile_id = excluded.profile_id,
      owner_id = excluded.owner_id,
      is_primary = true;

  -- Member 39: Dr. Rakesh Geddam (SB-DEMO-G14)
  insert into auth.users (
    id, instance_id, aud, role, email, encrypted_password,
    email_confirmed_at, raw_app_meta_data, raw_user_meta_data, created_at, updated_at
  ) values (
    '00000000-0000-4000-a000-000000000039'::uuid,
    '00000000-0000-0000-0000-000000000000',
    'authenticated', 'authenticated',
    'demo-g14@shettibalijamatrimony.internal',
    crypt('DemoPass123!', gen_salt('bf')),
    now(),
    jsonb_build_object('provider', 'email', 'providers', array['email']),
    jsonb_build_object('full_name', 'Dr. Rakesh Geddam', 'gender', 'groom'),
    now(), now()
  ) on conflict (id) do update
  set email = excluded.email,
      raw_user_meta_data = excluded.raw_user_meta_data,
      updated_at = now();

  insert into public.profiles (
    id, full_name, gender, account_type, account_status, created_at, updated_at
  ) values (
    '00000000-0000-4000-a000-000000000039'::uuid,
    'Dr. Rakesh Geddam',
    'groom',
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
    '00000000-0000-4000-a000-000000000039'::uuid,
    '00000000-0000-4000-a000-000000000039'::uuid,
    'SB-DEMO-G14',
    'Dr. Rakesh Geddam',
    'groom',
    32,
    178,
    'never_married',
    'Shettibalija',
    'Telugu',
    'Nellore',
    'Nellore',
    'Nellore',
    'Andhra Pradesh',
    'MBBS, MD, DNB Cardiology (Narayana Medical College)',
    'Cardiologist',
    'Consultant Interventional Cardiologist',
    'Nellore',
    'Hospital',
    '₹30 Lakhs',
    'INR',
    'annual',
    'Medical Practice',
    'Wheatish',
    'vegetarian',
    'No',
    'No',
    'Indian',
    array['Telugu', 'English'],
    'Purva Phalguni',
    'Simha (Leo)',
    'Kaundinya',
    '06:10 AM',
    'Nellore',
    true,
    'Cardiologist at a superspecialty hospital in Nellore. Medicine requires dedication, and I strive to maintain balance with family time, swimming, and classical music. Seeking an educated, empathetic life partner with warm family values.',
    'Distinguished government service and medical family in Nellore. Dedicated to public welfare, moral integrity, and family unity.',
    true,
    'members',
    'visible',
    'approved',
    true, now(),
    now(),
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
    '00000000-0000-4000-a000-000000000039'::uuid,
    '00000000-0000-4000-a000-000000000039'::uuid,
    '1994-07-03'::date,
    'demo-g14@shettibalijamatrimony.internal',
    'Nellore'
  ) on conflict (profile_id) do update
  set date_of_birth = excluded.date_of_birth,
      email = excluded.email,
      native_place = excluded.native_place;

  insert into public.family_details (
    profile_id, owner_id, father_name, father_profession,
    mother_name, mother_profession, brothers_count, sisters_count,
    brothers_details, sisters_details, family_type, family_location, family_details
  ) values (
    '00000000-0000-4000-a000-000000000039'::uuid,
    '00000000-0000-4000-a000-000000000039'::uuid,
    'Satyanarayana Geddam',
    'Senior Revenue Divisional Officer (Retired)',
    'Anasuyamma Geddam',
    'Homemaker',
    0,
    1,
    NULL,
    'Sister is a software lead married in Chennai',
    'Nuclear',
    'Nellore, AP',
    'Distinguished government service and medical family in Nellore. Dedicated to public welfare, moral integrity, and family unity.'
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
    '00000000-0000-4000-a000-000000000039'::uuid,
    '00000000-0000-4000-a000-000000000039'::uuid,
    true,
    'Purva Phalguni',
    'Simha (Leo)',
    'Kaundinya'
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
    '00000000-0000-4000-a000-000000000039'::uuid,
    '00000000-0000-4000-a000-000000000039'::uuid,
    26,
    30,
    160,
    172,
    array['never_married'],
    'Doctor / Post Graduate / Engineer',
    'Doctor / Healthcare / Tech',
    array['Nellore', 'Tirupati', 'Chennai', 'Hyderabad'],
    'vegetarian',
    'Compassionate, understanding companion who appreciates professional commitments and family togetherness.'
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

  insert into public.profile_photos (
    profile_id, owner_id, storage_path, is_primary, consented
  ) values (
    '00000000-0000-4000-a000-000000000039'::uuid,
    '00000000-0000-4000-a000-000000000039'::uuid,
    '/images/profiles/demo-groom-02.jpg?p=G14',
    true, true
  ) on conflict (storage_path) do update
  set profile_id = excluded.profile_id,
      owner_id = excluded.owner_id,
      is_primary = true;

  -- Member 40: Varun Boddu (SB-DEMO-G15)
  insert into auth.users (
    id, instance_id, aud, role, email, encrypted_password,
    email_confirmed_at, raw_app_meta_data, raw_user_meta_data, created_at, updated_at
  ) values (
    '00000000-0000-4000-a000-000000000040'::uuid,
    '00000000-0000-0000-0000-000000000000',
    'authenticated', 'authenticated',
    'demo-g15@shettibalijamatrimony.internal',
    crypt('DemoPass123!', gen_salt('bf')),
    now(),
    jsonb_build_object('provider', 'email', 'providers', array['email']),
    jsonb_build_object('full_name', 'Varun Boddu', 'gender', 'groom'),
    now(), now()
  ) on conflict (id) do update
  set email = excluded.email,
      raw_user_meta_data = excluded.raw_user_meta_data,
      updated_at = now();

  insert into public.profiles (
    id, full_name, gender, account_type, account_status, created_at, updated_at
  ) values (
    '00000000-0000-4000-a000-000000000040'::uuid,
    'Varun Boddu',
    'groom',
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
    '00000000-0000-4000-a000-000000000040'::uuid,
    '00000000-0000-4000-a000-000000000040'::uuid,
    'SB-DEMO-G15',
    'Varun Boddu',
    'groom',
    26,
    175,
    'never_married',
    'Shettibalija',
    'Telugu',
    'Rajahmundry',
    'Hyderabad',
    'Hyderabad',
    'Telangana',
    'B.Tech in ECE (JNTU Hyderabad)',
    'Embedded Systems Engineer',
    'Firmware Engineer',
    'Hyderabad',
    'Full-time',
    '₹12 Lakhs',
    'INR',
    'annual',
    'Employee & Engineering',
    'Fair',
    'vegetarian',
    'No',
    'No',
    'Indian',
    array['Telugu', 'English'],
    'Arudra',
    'Mithuna (Gemini)',
    'Vasishta',
    '01:45 PM',
    'Rajahmundry',
    true,
    'Firmware engineer at Bosch Hyderabad. I design automotive sensors, love playing cricket, and enjoy weekend cooking. Looking for an affectionate, supportive partner with whom I can build a joyful, balanced home.',
    'Affectionate government service family with quiet dignity. Cultured, polite, and deeply bonded with extended relatives.',
    true,
    'members',
    'visible',
    'approved',
    true, now(),
    now(),
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
    '00000000-0000-4000-a000-000000000040'::uuid,
    '00000000-0000-4000-a000-000000000040'::uuid,
    '2000-11-20'::date,
    'demo-g15@shettibalijamatrimony.internal',
    'Rajahmundry'
  ) on conflict (profile_id) do update
  set date_of_birth = excluded.date_of_birth,
      email = excluded.email,
      native_place = excluded.native_place;

  insert into public.family_details (
    profile_id, owner_id, father_name, father_profession,
    mother_name, mother_profession, brothers_count, sisters_count,
    brothers_details, sisters_details, family_type, family_location, family_details
  ) values (
    '00000000-0000-4000-a000-000000000040'::uuid,
    '00000000-0000-4000-a000-000000000040'::uuid,
    'Srirama Murthy Boddu',
    'Chief Electrical Inspector (Retired)',
    'Satyavathi Boddu',
    'Homemaker',
    0,
    1,
    NULL,
    'Sister working at Cognizant Hyderabad',
    'Nuclear',
    'Rajahmundry & Hyderabad',
    'Affectionate government service family with quiet dignity. Cultured, polite, and deeply bonded with extended relatives.'
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
    '00000000-0000-4000-a000-000000000040'::uuid,
    '00000000-0000-4000-a000-000000000040'::uuid,
    true,
    'Arudra',
    'Mithuna (Gemini)',
    'Vasishta'
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
    '00000000-0000-4000-a000-000000000040'::uuid,
    '00000000-0000-4000-a000-000000000040'::uuid,
    22,
    26,
    156,
    168,
    array['never_married'],
    'B.Tech / MCA / Graduate',
    'IT / Corporate / Banking',
    array['Hyderabad', 'Rajahmundry', 'Visakhapatnam'],
    'vegetarian',
    'Soft-spoken, pleasant partner who respects family traditions and values companionship.'
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

  insert into public.profile_photos (
    profile_id, owner_id, storage_path, is_primary, consented
  ) values (
    '00000000-0000-4000-a000-000000000040'::uuid,
    '00000000-0000-4000-a000-000000000040'::uuid,
    '/images/profiles/demo-groom-03.jpg?p=G15',
    true, true
  ) on conflict (storage_path) do update
  set profile_id = excluded.profile_id,
      owner_id = excluded.owner_id,
      is_primary = true;

  -- Member 41: Suresh Pecheti (SB-DEMO-G16)
  insert into auth.users (
    id, instance_id, aud, role, email, encrypted_password,
    email_confirmed_at, raw_app_meta_data, raw_user_meta_data, created_at, updated_at
  ) values (
    '00000000-0000-4000-a000-000000000041'::uuid,
    '00000000-0000-0000-0000-000000000000',
    'authenticated', 'authenticated',
    'demo-g16@shettibalijamatrimony.internal',
    crypt('DemoPass123!', gen_salt('bf')),
    now(),
    jsonb_build_object('provider', 'email', 'providers', array['email']),
    jsonb_build_object('full_name', 'Suresh Pecheti', 'gender', 'groom'),
    now(), now()
  ) on conflict (id) do update
  set email = excluded.email,
      raw_user_meta_data = excluded.raw_user_meta_data,
      updated_at = now();

  insert into public.profiles (
    id, full_name, gender, account_type, account_status, created_at, updated_at
  ) values (
    '00000000-0000-4000-a000-000000000041'::uuid,
    'Suresh Pecheti',
    'groom',
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
    '00000000-0000-4000-a000-000000000041'::uuid,
    '00000000-0000-4000-a000-000000000041'::uuid,
    'SB-DEMO-G16',
    'Suresh Pecheti',
    'groom',
    34,
    181,
    'divorced',
    'Shettibalija',
    'Telugu',
    'Visakhapatnam',
    'Bengaluru',
    'Bengaluru',
    'Karnataka',
    'B.Tech, MS in Software Engineering (TU Munich, Germany)',
    'Senior Director of Engineering',
    'Senior Director - Enterprise Cloud',
    'Bengaluru',
    'Full-time',
    '₹48 Lakhs',
    'INR',
    'annual',
    'Corporate & Real Estate',
    'Fair',
    'vegetarian',
    'No',
    'No',
    'Indian',
    array['Telugu', 'English', 'German (Conversational)'],
    'Bharani',
    'Mesha (Aries)',
    'Atri',
    '09:30 AM',
    'Visakhapatnam',
    true,
    'Leading enterprise engineering at SAP Labs Bengaluru. Divorced amicably 5 years ago after a short marriage; no children or encumbrances. I believe in emotional clarity, mutual respect, and active healthy living. Seeking an understanding, optimistic partner to share life''s adventures.',
    'Academic, highly respected family from Visakhapatnam. Open-minded, culturally grounded, and supportive of a thoughtful fresh start.',
    true,
    'members',
    'visible',
    'approved',
    true, now(),
    now(),
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
    '00000000-0000-4000-a000-000000000041'::uuid,
    '00000000-0000-4000-a000-000000000041'::uuid,
    '1992-02-14'::date,
    'demo-g16@shettibalijamatrimony.internal',
    'Visakhapatnam'
  ) on conflict (profile_id) do update
  set date_of_birth = excluded.date_of_birth,
      email = excluded.email,
      native_place = excluded.native_place;

  insert into public.family_details (
    profile_id, owner_id, father_name, father_profession,
    mother_name, mother_profession, brothers_count, sisters_count,
    brothers_details, sisters_details, family_type, family_location, family_details
  ) values (
    '00000000-0000-4000-a000-000000000041'::uuid,
    '00000000-0000-4000-a000-000000000041'::uuid,
    'Bhadra Rao Pecheti',
    'Professor of Mechanical Engineering (Retired)',
    'Suryakumari Pecheti',
    'Homemaker',
    1,
    0,
    'Brother is a business consultant in London',
    NULL,
    'Nuclear',
    'Visakhapatnam & Bengaluru',
    'Academic, highly respected family from Visakhapatnam. Open-minded, culturally grounded, and supportive of a thoughtful fresh start.'
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
    '00000000-0000-4000-a000-000000000041'::uuid,
    '00000000-0000-4000-a000-000000000041'::uuid,
    true,
    'Bharani',
    'Mesha (Aries)',
    'Atri'
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
    '00000000-0000-4000-a000-000000000041'::uuid,
    '00000000-0000-4000-a000-000000000041'::uuid,
    28,
    34,
    162,
    176,
    array['never_married', 'divorced'],
    'Master''s / B.Tech / MBA / Doctor',
    'Tech / Corporate / Banking / Academic',
    array['Bengaluru', 'Hyderabad', 'Visakhapatnam'],
    'any',
    'A mature, kind-hearted companion who believes in open communication, personal dignity, and mutual affection.'
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

  insert into public.profile_photos (
    profile_id, owner_id, storage_path, is_primary, consented
  ) values (
    '00000000-0000-4000-a000-000000000041'::uuid,
    '00000000-0000-4000-a000-000000000041'::uuid,
    '/images/profiles/demo-groom-04.jpg?p=G16',
    true, true
  ) on conflict (storage_path) do update
  set profile_id = excluded.profile_id,
      owner_id = excluded.owner_id,
      is_primary = true;

  -- Member 42: Kalyan Chelluboyina (SB-DEMO-G17)
  insert into auth.users (
    id, instance_id, aud, role, email, encrypted_password,
    email_confirmed_at, raw_app_meta_data, raw_user_meta_data, created_at, updated_at
  ) values (
    '00000000-0000-4000-a000-000000000042'::uuid,
    '00000000-0000-0000-0000-000000000000',
    'authenticated', 'authenticated',
    'demo-g17@shettibalijamatrimony.internal',
    crypt('DemoPass123!', gen_salt('bf')),
    now(),
    jsonb_build_object('provider', 'email', 'providers', array['email']),
    jsonb_build_object('full_name', 'Kalyan Chelluboyina', 'gender', 'groom'),
    now(), now()
  ) on conflict (id) do update
  set email = excluded.email,
      raw_user_meta_data = excluded.raw_user_meta_data,
      updated_at = now();

  insert into public.profiles (
    id, full_name, gender, account_type, account_status, created_at, updated_at
  ) values (
    '00000000-0000-4000-a000-000000000042'::uuid,
    'Kalyan Chelluboyina',
    'groom',
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
    '00000000-0000-4000-a000-000000000042'::uuid,
    '00000000-0000-4000-a000-000000000042'::uuid,
    'SB-DEMO-G17',
    'Kalyan Chelluboyina',
    'groom',
    28,
    176,
    'never_married',
    'Shettibalija',
    'Telugu',
    'Amalapuram',
    'Kakinada',
    'Kakinada',
    'Andhra Pradesh',
    'B.Pharmacy, MBA in Pharma Marketing',
    'Regional Business Manager',
    'Regional Manager - Specialty Pharma',
    'Kakinada',
    'Full-time',
    '₹13 Lakhs',
    'INR',
    'annual',
    'Wholesale Distribution & Agriculture',
    'Wheatish',
    'vegetarian',
    'No',
    'No',
    'Indian',
    array['Telugu', 'English'],
    'Shravana',
    'Makara (Capricorn)',
    'Harita',
    '03:15 AM',
    'Amalapuram',
    true,
    'Regional manager at Dr. Reddy''s Laboratories. I enjoy meeting people, coastal driving, and family festival celebrations. Looking for a pleasant, educated life partner who appreciates family roots and mutual respect.',
    'Traditional Godavari agricultural family with widespread farmland in Konaseema. Very hospitable, honest, and community-minded.',
    true,
    'members',
    'visible',
    'approved',
    true, now(),
    now(),
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
    '00000000-0000-4000-a000-000000000042'::uuid,
    '00000000-0000-4000-a000-000000000042'::uuid,
    '1998-10-31'::date,
    'demo-g17@shettibalijamatrimony.internal',
    'Amalapuram'
  ) on conflict (profile_id) do update
  set date_of_birth = excluded.date_of_birth,
      email = excluded.email,
      native_place = excluded.native_place;

  insert into public.family_details (
    profile_id, owner_id, father_name, father_profession,
    mother_name, mother_profession, brothers_count, sisters_count,
    brothers_details, sisters_details, family_type, family_location, family_details
  ) values (
    '00000000-0000-4000-a000-000000000042'::uuid,
    '00000000-0000-4000-a000-000000000042'::uuid,
    'Ramakrishna Chelluboyina',
    'Agricultural Landowner & Coconut Exporter',
    'Durga Chelluboyina',
    'Homemaker',
    1,
    0,
    'Younger brother studying B.Tech at VIT',
    NULL,
    'Joint',
    'Amalapuram & Kakinada',
    'Traditional Godavari agricultural family with widespread farmland in Konaseema. Very hospitable, honest, and community-minded.'
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
    '00000000-0000-4000-a000-000000000042'::uuid,
    '00000000-0000-4000-a000-000000000042'::uuid,
    true,
    'Shravana',
    'Makara (Capricorn)',
    'Harita'
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
    '00000000-0000-4000-a000-000000000042'::uuid,
    '00000000-0000-4000-a000-000000000042'::uuid,
    23,
    27,
    158,
    170,
    array['never_married'],
    'Graduate / Post Graduate',
    'Private / IT / Banking / Teaching',
    array['Kakinada', 'Rajahmundry', 'Visakhapatnam', 'Vijayawada'],
    'vegetarian',
    'A soft-spoken, family-loving companion with good character and positive outlook.'
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

  insert into public.profile_photos (
    profile_id, owner_id, storage_path, is_primary, consented
  ) values (
    '00000000-0000-4000-a000-000000000042'::uuid,
    '00000000-0000-4000-a000-000000000042'::uuid,
    '/images/profiles/demo-groom-01.jpg?p=G17',
    true, true
  ) on conflict (storage_path) do update
  set profile_id = excluded.profile_id,
      owner_id = excluded.owner_id,
      is_primary = true;

  -- Member 43: Chaitanya Bikkina (SB-DEMO-G18)
  insert into auth.users (
    id, instance_id, aud, role, email, encrypted_password,
    email_confirmed_at, raw_app_meta_data, raw_user_meta_data, created_at, updated_at
  ) values (
    '00000000-0000-4000-a000-000000000043'::uuid,
    '00000000-0000-0000-0000-000000000000',
    'authenticated', 'authenticated',
    'demo-g18@shettibalijamatrimony.internal',
    crypt('DemoPass123!', gen_salt('bf')),
    now(),
    jsonb_build_object('provider', 'email', 'providers', array['email']),
    jsonb_build_object('full_name', 'Chaitanya Bikkina', 'gender', 'groom'),
    now(), now()
  ) on conflict (id) do update
  set email = excluded.email,
      raw_user_meta_data = excluded.raw_user_meta_data,
      updated_at = now();

  insert into public.profiles (
    id, full_name, gender, account_type, account_status, created_at, updated_at
  ) values (
    '00000000-0000-4000-a000-000000000043'::uuid,
    'Chaitanya Bikkina',
    'groom',
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
    '00000000-0000-4000-a000-000000000043'::uuid,
    '00000000-0000-4000-a000-000000000043'::uuid,
    'SB-DEMO-G18',
    'Chaitanya Bikkina',
    'groom',
    31,
    184,
    'never_married',
    'Shettibalija',
    'Telugu',
    'Kakinada',
    'Abu Dhabi',
    'Abu Dhabi',
    'UAE',
    'B.Tech in Chemical Engineering (Andhra University)',
    'Process Safety Engineer',
    'Lead Process Safety Specialist',
    'Abu Dhabi',
    'Energy Sector',
    '240,000 AED',
    'AED',
    'annual',
    'Contracting & Petrochemicals',
    'Fair',
    'eggetarian',
    'No',
    'No',
    'Indian',
    array['Telugu', 'English', 'Hindi'],
    'Jyeshtha',
    'Vrishchika (Scorpio)',
    'Sandilya',
    '07:45 PM',
    'Kakinada',
    true,
    'Lead safety engineer with ADNOC in Abu Dhabi. I enjoy desert photography, fitness, and family get-togethers in Kakinada during holidays. Seeking an articulate, warm life partner settled in the Gulf or willing to relocate.',
    'Reputed family from Kakinada with civil contracting history. Value integrity, global exposure, and strong family ties.',
    true,
    'members',
    'visible',
    'approved',
    true, now(),
    now(),
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
    '00000000-0000-4000-a000-000000000043'::uuid,
    '00000000-0000-4000-a000-000000000043'::uuid,
    '1995-12-08'::date,
    'demo-g18@shettibalijamatrimony.internal',
    'Kakinada'
  ) on conflict (profile_id) do update
  set date_of_birth = excluded.date_of_birth,
      email = excluded.email,
      native_place = excluded.native_place;

  insert into public.family_details (
    profile_id, owner_id, father_name, father_profession,
    mother_name, mother_profession, brothers_count, sisters_count,
    brothers_details, sisters_details, family_type, family_location, family_details
  ) values (
    '00000000-0000-4000-a000-000000000043'::uuid,
    '00000000-0000-4000-a000-000000000043'::uuid,
    'Ananda Rao Bikkina',
    'Government Works Contractor (Retired)',
    'Satyavani Bikkina',
    'Homemaker',
    1,
    0,
    'Elder brother is an engineer in Hyderabad',
    NULL,
    'Nuclear',
    'Kakinada & Abu Dhabi',
    'Reputed family from Kakinada with civil contracting history. Value integrity, global exposure, and strong family ties.'
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
    '00000000-0000-4000-a000-000000000043'::uuid,
    '00000000-0000-4000-a000-000000000043'::uuid,
    true,
    'Jyeshtha',
    'Vrishchika (Scorpio)',
    'Sandilya'
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
    '00000000-0000-4000-a000-000000000043'::uuid,
    '00000000-0000-4000-a000-000000000043'::uuid,
    25,
    29,
    162,
    175,
    array['never_married'],
    'Graduate / Post Graduate',
    'Tech / Corporate / Banking / Any',
    array['Abu Dhabi', 'Dubai', 'Hyderabad', 'Visakhapatnam'],
    'any',
    'Cultured, broad-minded partner with good family values and warm nature.'
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

  insert into public.profile_photos (
    profile_id, owner_id, storage_path, is_primary, consented
  ) values (
    '00000000-0000-4000-a000-000000000043'::uuid,
    '00000000-0000-4000-a000-000000000043'::uuid,
    '/images/profiles/demo-groom-02.jpg?p=G18',
    true, true
  ) on conflict (storage_path) do update
  set profile_id = excluded.profile_id,
      owner_id = excluded.owner_id,
      is_primary = true;

  -- Member 44: Nikhil Sunkara (SB-DEMO-G19)
  insert into auth.users (
    id, instance_id, aud, role, email, encrypted_password,
    email_confirmed_at, raw_app_meta_data, raw_user_meta_data, created_at, updated_at
  ) values (
    '00000000-0000-4000-a000-000000000044'::uuid,
    '00000000-0000-0000-0000-000000000000',
    'authenticated', 'authenticated',
    'demo-g19@shettibalijamatrimony.internal',
    crypt('DemoPass123!', gen_salt('bf')),
    now(),
    jsonb_build_object('provider', 'email', 'providers', array['email']),
    jsonb_build_object('full_name', 'Nikhil Sunkara', 'gender', 'groom'),
    now(), now()
  ) on conflict (id) do update
  set email = excluded.email,
      raw_user_meta_data = excluded.raw_user_meta_data,
      updated_at = now();

  insert into public.profiles (
    id, full_name, gender, account_type, account_status, created_at, updated_at
  ) values (
    '00000000-0000-4000-a000-000000000044'::uuid,
    'Nikhil Sunkara',
    'groom',
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
    '00000000-0000-4000-a000-000000000044'::uuid,
    '00000000-0000-4000-a000-000000000044'::uuid,
    'SB-DEMO-G19',
    'Nikhil Sunkara',
    'groom',
    29,
    179,
    'never_married',
    'Shettibalija',
    'Telugu',
    'Bhimavaram',
    'Hyderabad',
    'Hyderabad',
    'Telangana',
    'B.Tech in CSE (NIT Surathkal)',
    'Engineering Manager',
    'Engineering Manager - Platform Systems',
    'Hyderabad',
    'Full-time',
    '₹36 Lakhs',
    'INR',
    'annual',
    'Business & Technology',
    'Wheatish',
    'vegetarian',
    'No',
    'No',
    'Indian',
    array['Telugu', 'English'],
    'Purva Ashadha',
    'Dhanus (Sagittarius)',
    'Gautama',
    '01:10 PM',
    'Bhimavaram',
    true,
    'Engineering manager at Swiggy Hyderabad leading consumer platform services. Outside work, I love playing badminton, listening to podcasts, and Godavari river cuisine. Looking for an intelligent, warm partner who brings joy and companionship into life.',
    'Dynamic entrepreneurial family from West Godavari. Known for commercial innovation, educational backing, and hospitality.',
    true,
    'members',
    'visible',
    'approved',
    true, now(),
    now(),
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
    '00000000-0000-4000-a000-000000000044'::uuid,
    '00000000-0000-4000-a000-000000000044'::uuid,
    '1997-06-25'::date,
    'demo-g19@shettibalijamatrimony.internal',
    'Bhimavaram'
  ) on conflict (profile_id) do update
  set date_of_birth = excluded.date_of_birth,
      email = excluded.email,
      native_place = excluded.native_place;

  insert into public.family_details (
    profile_id, owner_id, father_name, father_profession,
    mother_name, mother_profession, brothers_count, sisters_count,
    brothers_details, sisters_details, family_type, family_location, family_details
  ) values (
    '00000000-0000-4000-a000-000000000044'::uuid,
    '00000000-0000-4000-a000-000000000044'::uuid,
    'Ravi Kumar Sunkara',
    'Aquaculture Feed Mill Owner',
    'Pushpavathi Sunkara',
    'Homemaker',
    0,
    1,
    NULL,
    'Sister is an architect in Bengaluru',
    'Nuclear',
    'Bhimavaram & Hyderabad',
    'Dynamic entrepreneurial family from West Godavari. Known for commercial innovation, educational backing, and hospitality.'
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
    '00000000-0000-4000-a000-000000000044'::uuid,
    '00000000-0000-4000-a000-000000000044'::uuid,
    true,
    'Purva Ashadha',
    'Dhanus (Sagittarius)',
    'Gautama'
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
    '00000000-0000-4000-a000-000000000044'::uuid,
    '00000000-0000-4000-a000-000000000044'::uuid,
    24,
    28,
    160,
    172,
    array['never_married'],
    'B.Tech / MBA / MS / Graduate',
    'Tech / Corporate / Banking',
    array['Hyderabad', 'Bengaluru', 'Visakhapatnam'],
    'vegetarian',
    'A sweet-natured, ambitious companion who values mutual respect, humor, and family connection.'
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

  insert into public.profile_photos (
    profile_id, owner_id, storage_path, is_primary, consented
  ) values (
    '00000000-0000-4000-a000-000000000044'::uuid,
    '00000000-0000-4000-a000-000000000044'::uuid,
    '/images/profiles/demo-groom-03.jpg?p=G19',
    true, true
  ) on conflict (storage_path) do update
  set profile_id = excluded.profile_id,
      owner_id = excluded.owner_id,
      is_primary = true;

  -- Member 45: Goutham Mallipudi (SB-DEMO-G20)
  insert into auth.users (
    id, instance_id, aud, role, email, encrypted_password,
    email_confirmed_at, raw_app_meta_data, raw_user_meta_data, created_at, updated_at
  ) values (
    '00000000-0000-4000-a000-000000000045'::uuid,
    '00000000-0000-0000-0000-000000000000',
    'authenticated', 'authenticated',
    'demo-g20@shettibalijamatrimony.internal',
    crypt('DemoPass123!', gen_salt('bf')),
    now(),
    jsonb_build_object('provider', 'email', 'providers', array['email']),
    jsonb_build_object('full_name', 'Goutham Mallipudi', 'gender', 'groom'),
    now(), now()
  ) on conflict (id) do update
  set email = excluded.email,
      raw_user_meta_data = excluded.raw_user_meta_data,
      updated_at = now();

  insert into public.profiles (
    id, full_name, gender, account_type, account_status, created_at, updated_at
  ) values (
    '00000000-0000-4000-a000-000000000045'::uuid,
    'Goutham Mallipudi',
    'groom',
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
    '00000000-0000-4000-a000-000000000045'::uuid,
    '00000000-0000-4000-a000-000000000045'::uuid,
    'SB-DEMO-G20',
    'Goutham Mallipudi',
    'groom',
    27,
    177,
    'never_married',
    'Shettibalija',
    'Telugu',
    'Vijayawada',
    'Vijayawada',
    'Vijayawada',
    'Andhra Pradesh',
    'B.Sc, LLB (Corporate Law)',
    'Corporate Lawyer',
    'Legal Associate',
    'Vijayawada',
    'Legal Practice',
    '₹10 Lakhs',
    'INR',
    'annual',
    'Legal & Real Estate',
    'Fair',
    'vegetarian',
    'No',
    'No',
    'Indian',
    array['Telugu', 'English'],
    'Uttara Bhadrapada',
    'Meena (Pisces)',
    'Kasyapa',
    '11:00 AM',
    'Vijayawada',
    true,
    'Practicing corporate and commercial property law in Vijayawada. I enjoy debate, reading Telugu social novels, and morning tennis. Seeking a sensible, cultured partner from an affectionate family.',
    'Distinguished legal fraternity family in Vijayawada. High reputation for integrity, intellectual depth, and social service.',
    true,
    'members',
    'visible',
    'approved',
    true, now(),
    now(),
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
    '00000000-0000-4000-a000-000000000045'::uuid,
    '00000000-0000-4000-a000-000000000045'::uuid,
    '1999-03-15'::date,
    'demo-g20@shettibalijamatrimony.internal',
    'Vijayawada'
  ) on conflict (profile_id) do update
  set date_of_birth = excluded.date_of_birth,
      email = excluded.email,
      native_place = excluded.native_place;

  insert into public.family_details (
    profile_id, owner_id, father_name, father_profession,
    mother_name, mother_profession, brothers_count, sisters_count,
    brothers_details, sisters_details, family_type, family_location, family_details
  ) values (
    '00000000-0000-4000-a000-000000000045'::uuid,
    '00000000-0000-4000-a000-000000000045'::uuid,
    'Jaganmohan Rao Mallipudi',
    'Senior Advocate (High Court of AP)',
    'Padma Mallipudi',
    'Homemaker',
    1,
    0,
    'Younger brother preparing for judicial civil services',
    NULL,
    'Nuclear',
    'Vijayawada, AP',
    'Distinguished legal fraternity family in Vijayawada. High reputation for integrity, intellectual depth, and social service.'
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
    '00000000-0000-4000-a000-000000000045'::uuid,
    '00000000-0000-4000-a000-000000000045'::uuid,
    true,
    'Uttara Bhadrapada',
    'Meena (Pisces)',
    'Kasyapa'
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
    '00000000-0000-4000-a000-000000000045'::uuid,
    '00000000-0000-4000-a000-000000000045'::uuid,
    23,
    26,
    158,
    170,
    array['never_married'],
    'Graduate / Post Graduate',
    'Any profession / Law / Tech / Banking',
    array['Vijayawada', 'Guntur', 'Hyderabad'],
    'vegetarian',
    'Grounded, educated partner who values family unity and has an affectionate nature.'
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

  insert into public.profile_photos (
    profile_id, owner_id, storage_path, is_primary, consented
  ) values (
    '00000000-0000-4000-a000-000000000045'::uuid,
    '00000000-0000-4000-a000-000000000045'::uuid,
    '/images/profiles/demo-groom-04.jpg?p=G20',
    true, true
  ) on conflict (storage_path) do update
  set profile_id = excluded.profile_id,
      owner_id = excluded.owner_id,
      is_primary = true;

  -- Member 46: Rajesh Pothula (SB-DEMO-G21)
  insert into auth.users (
    id, instance_id, aud, role, email, encrypted_password,
    email_confirmed_at, raw_app_meta_data, raw_user_meta_data, created_at, updated_at
  ) values (
    '00000000-0000-4000-a000-000000000046'::uuid,
    '00000000-0000-0000-0000-000000000000',
    'authenticated', 'authenticated',
    'demo-g21@shettibalijamatrimony.internal',
    crypt('DemoPass123!', gen_salt('bf')),
    now(),
    jsonb_build_object('provider', 'email', 'providers', array['email']),
    jsonb_build_object('full_name', 'Rajesh Pothula', 'gender', 'groom'),
    now(), now()
  ) on conflict (id) do update
  set email = excluded.email,
      raw_user_meta_data = excluded.raw_user_meta_data,
      updated_at = now();

  insert into public.profiles (
    id, full_name, gender, account_type, account_status, created_at, updated_at
  ) values (
    '00000000-0000-4000-a000-000000000046'::uuid,
    'Rajesh Pothula',
    'groom',
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
    '00000000-0000-4000-a000-000000000046'::uuid,
    '00000000-0000-4000-a000-000000000046'::uuid,
    'SB-DEMO-G21',
    'Rajesh Pothula',
    'groom',
    33,
    180,
    'separated',
    'Shettibalija',
    'Telugu',
    'Rajahmundry',
    'Hyderabad',
    'Hyderabad',
    'Telangana',
    'B.Tech, MS in Information Assurance (SUNY Buffalo)',
    'Cyber Security Architect',
    'Lead Security Architect',
    'Hyderabad',
    'Full-time',
    '₹25 Lakhs',
    'INR',
    'annual',
    'Corporate & Technology',
    'Wheatish',
    'vegetarian',
    'No',
    'No',
    'Indian',
    array['Telugu', 'English'],
    'Mula',
    'Dhanus (Sagittarius)',
    'Viswamitra',
    '08:10 PM',
    'Rajahmundry',
    true,
    'Leading enterprise cyber security architecture at Wipro Hyderabad. Legally separated (divorce proceedings finalized amicably; no children). Life is an ongoing journey of learning and maturity. Seeking an empathetic, understanding life partner to embark on a shared, peaceful life together.',
    'Respected civil services family with quiet dignity. Supportive, ethical, and deeply appreciative of open dialogue.',
    true,
    'members',
    'visible',
    'approved',
    true, now(),
    now(),
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
    '00000000-0000-4000-a000-000000000046'::uuid,
    '00000000-0000-4000-a000-000000000046'::uuid,
    '1993-01-22'::date,
    'demo-g21@shettibalijamatrimony.internal',
    'Rajahmundry'
  ) on conflict (profile_id) do update
  set date_of_birth = excluded.date_of_birth,
      email = excluded.email,
      native_place = excluded.native_place;

  insert into public.family_details (
    profile_id, owner_id, father_name, father_profession,
    mother_name, mother_profession, brothers_count, sisters_count,
    brothers_details, sisters_details, family_type, family_location, family_details
  ) values (
    '00000000-0000-4000-a000-000000000046'::uuid,
    '00000000-0000-4000-a000-000000000046'::uuid,
    'Chitti Babu Pothula',
    'Deputy Collector (Retired)',
    'Parvathamma Pothula',
    'Homemaker',
    1,
    0,
    'Brother works as an architect in Hyderabad',
    NULL,
    'Nuclear',
    'Rajahmundry & Hyderabad',
    'Respected civil services family with quiet dignity. Supportive, ethical, and deeply appreciative of open dialogue.'
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
    '00000000-0000-4000-a000-000000000046'::uuid,
    '00000000-0000-4000-a000-000000000046'::uuid,
    true,
    'Mula',
    'Dhanus (Sagittarius)',
    'Viswamitra'
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
    '00000000-0000-4000-a000-000000000046'::uuid,
    '00000000-0000-4000-a000-000000000046'::uuid,
    27,
    33,
    160,
    174,
    array['never_married', 'divorced', 'widowed'],
    'Graduate / Post Graduate',
    'Tech / Corporate / Banking / Professional',
    array['Hyderabad', 'Visakhapatnam', 'Rajahmundry'],
    'vegetarian',
    'Emotionally mature, kind-hearted companion who believes in mutual care and honesty.'
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

  insert into public.profile_photos (
    profile_id, owner_id, storage_path, is_primary, consented
  ) values (
    '00000000-0000-4000-a000-000000000046'::uuid,
    '00000000-0000-4000-a000-000000000046'::uuid,
    '/images/profiles/demo-groom-01.jpg?p=G21',
    true, true
  ) on conflict (storage_path) do update
  set profile_id = excluded.profile_id,
      owner_id = excluded.owner_id,
      is_primary = true;

  -- Member 47: Sanjay Yalla (SB-DEMO-G22)
  insert into auth.users (
    id, instance_id, aud, role, email, encrypted_password,
    email_confirmed_at, raw_app_meta_data, raw_user_meta_data, created_at, updated_at
  ) values (
    '00000000-0000-4000-a000-000000000047'::uuid,
    '00000000-0000-0000-0000-000000000000',
    'authenticated', 'authenticated',
    'demo-g22@shettibalijamatrimony.internal',
    crypt('DemoPass123!', gen_salt('bf')),
    now(),
    jsonb_build_object('provider', 'email', 'providers', array['email']),
    jsonb_build_object('full_name', 'Sanjay Yalla', 'gender', 'groom'),
    now(), now()
  ) on conflict (id) do update
  set email = excluded.email,
      raw_user_meta_data = excluded.raw_user_meta_data,
      updated_at = now();

  insert into public.profiles (
    id, full_name, gender, account_type, account_status, created_at, updated_at
  ) values (
    '00000000-0000-4000-a000-000000000047'::uuid,
    'Sanjay Yalla',
    'groom',
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
    '00000000-0000-4000-a000-000000000047'::uuid,
    '00000000-0000-4000-a000-000000000047'::uuid,
    'SB-DEMO-G22',
    'Sanjay Yalla',
    'groom',
    28,
    175,
    'never_married',
    'Shettibalija',
    'Telugu',
    'Eluru',
    'Bengaluru',
    'Bengaluru',
    'Karnataka',
    'B.Tech, MS in AI (University of Edinburgh, UK)',
    'Machine Learning Scientist',
    'Senior Research Scientist',
    'Bengaluru',
    'Full-time',
    '₹34 Lakhs',
    'INR',
    'annual',
    'Business & Technology',
    'Fair',
    'vegetarian',
    'No',
    'No',
    'Indian',
    array['Telugu', 'English'],
    'Punarvasu',
    'Mithuna (Gemini)',
    'Bharadwaja',
    '03:40 AM',
    'Eluru',
    true,
    'Research scientist working on generative vision models at Adobe Bengaluru. I enjoy hiking, photography, and Telugu classical poetry. Seeking an intellectually curious, cheerful partner who values companionship, family, and shared growth.',
    'Well-known merchant family in Eluru. Broad-minded, values education, and deeply supportive of independent thought.',
    true,
    'members',
    'visible',
    'approved',
    true, now(),
    now(),
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
    '00000000-0000-4000-a000-000000000047'::uuid,
    '00000000-0000-4000-a000-000000000047'::uuid,
    '1998-05-19'::date,
    'demo-g22@shettibalijamatrimony.internal',
    'Eluru'
  ) on conflict (profile_id) do update
  set date_of_birth = excluded.date_of_birth,
      email = excluded.email,
      native_place = excluded.native_place;

  insert into public.family_details (
    profile_id, owner_id, father_name, father_profession,
    mother_name, mother_profession, brothers_count, sisters_count,
    brothers_details, sisters_details, family_type, family_location, family_details
  ) values (
    '00000000-0000-4000-a000-000000000047'::uuid,
    '00000000-0000-4000-a000-000000000047'::uuid,
    'Ramamohana Rao Yalla',
    'Paddy Merchant & Cold Storage Managing Partner',
    'Prabhavathi Yalla',
    'Homemaker',
    0,
    1,
    NULL,
    'Sister completed B.Tech, married to software lead in Hyderabad',
    'Nuclear',
    'Eluru & Bengaluru',
    'Well-known merchant family in Eluru. Broad-minded, values education, and deeply supportive of independent thought.'
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
    '00000000-0000-4000-a000-000000000047'::uuid,
    '00000000-0000-4000-a000-000000000047'::uuid,
    true,
    'Punarvasu',
    'Mithuna (Gemini)',
    'Bharadwaja'
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
    '00000000-0000-4000-a000-000000000047'::uuid,
    '00000000-0000-4000-a000-000000000047'::uuid,
    23,
    27,
    158,
    170,
    array['never_married'],
    'B.Tech / MS / MBA / Post Graduate',
    'Tech / Corporate / Banking / Design',
    array['Bengaluru', 'Hyderabad', 'Vijayawada'],
    'vegetarian',
    'An ambitious, thoughtful companion with good humor, warmth, and strong family ties.'
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

  insert into public.profile_photos (
    profile_id, owner_id, storage_path, is_primary, consented
  ) values (
    '00000000-0000-4000-a000-000000000047'::uuid,
    '00000000-0000-4000-a000-000000000047'::uuid,
    '/images/profiles/demo-groom-02.jpg?p=G22',
    true, true
  ) on conflict (storage_path) do update
  set profile_id = excluded.profile_id,
      owner_id = excluded.owner_id,
      is_primary = true;

  -- Member 48: Anand Mattaparthi (SB-DEMO-G23)
  insert into auth.users (
    id, instance_id, aud, role, email, encrypted_password,
    email_confirmed_at, raw_app_meta_data, raw_user_meta_data, created_at, updated_at
  ) values (
    '00000000-0000-4000-a000-000000000048'::uuid,
    '00000000-0000-0000-0000-000000000000',
    'authenticated', 'authenticated',
    'demo-g23@shettibalijamatrimony.internal',
    crypt('DemoPass123!', gen_salt('bf')),
    now(),
    jsonb_build_object('provider', 'email', 'providers', array['email']),
    jsonb_build_object('full_name', 'Anand Mattaparthi', 'gender', 'groom'),
    now(), now()
  ) on conflict (id) do update
  set email = excluded.email,
      raw_user_meta_data = excluded.raw_user_meta_data,
      updated_at = now();

  insert into public.profiles (
    id, full_name, gender, account_type, account_status, created_at, updated_at
  ) values (
    '00000000-0000-4000-a000-000000000048'::uuid,
    'Anand Mattaparthi',
    'groom',
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
    '00000000-0000-4000-a000-000000000048'::uuid,
    '00000000-0000-4000-a000-000000000048'::uuid,
    'SB-DEMO-G23',
    'Anand Mattaparthi',
    'groom',
    30,
    176,
    'never_married',
    'Shettibalija',
    'Telugu',
    'Kakinada',
    'Kakinada',
    'Kakinada',
    'Andhra Pradesh',
    'B.Com, MBA in Retail & Marketing',
    'Goldsmith & Jewelry Merchant',
    'Managing Partner',
    'Kakinada',
    'Business Owner',
    '₹18 Lakhs',
    'INR',
    'annual',
    'Goldsmith & Jewelry Retail',
    'Fair',
    'vegetarian',
    'No',
    'No',
    'Indian',
    array['Telugu', 'English'],
    'Shatabhisha',
    'Kumbha (Aquarius)',
    'Kaundinya',
    '10:25 PM',
    'Kakinada',
    true,
    'Managing our family''s heritage jewelry showroom in Kakinada. We specialize in temple jewelry and modern designs. I enjoy cricket, Carnatic instrumental music, and temple architecture. Looking for a cultured, loving life partner who cherishes traditional family values.',
    'Established traditional jewelry business family in Kakinada. Renowned for craftsmanship, honesty, and deep participation in community events.',
    true,
    'members',
    'visible',
    'approved',
    true, now(),
    NULL,
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
    '00000000-0000-4000-a000-000000000048'::uuid,
    '00000000-0000-4000-a000-000000000048'::uuid,
    '1996-09-14'::date,
    'demo-g23@shettibalijamatrimony.internal',
    'Kakinada'
  ) on conflict (profile_id) do update
  set date_of_birth = excluded.date_of_birth,
      email = excluded.email,
      native_place = excluded.native_place;

  insert into public.family_details (
    profile_id, owner_id, father_name, father_profession,
    mother_name, mother_profession, brothers_count, sisters_count,
    brothers_details, sisters_details, family_type, family_location, family_details
  ) values (
    '00000000-0000-4000-a000-000000000048'::uuid,
    '00000000-0000-4000-a000-000000000048'::uuid,
    'Narasimha Murthy Mattaparthi',
    'Master Goldsmith & Traditional Jewelry Merchant',
    'Saraswathi Mattaparthi',
    'Homemaker',
    1,
    0,
    'Younger brother partners in the family showroom',
    NULL,
    'Joint',
    'Kakinada, AP',
    'Established traditional jewelry business family in Kakinada. Renowned for craftsmanship, honesty, and deep participation in community events.'
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
    '00000000-0000-4000-a000-000000000048'::uuid,
    '00000000-0000-4000-a000-000000000048'::uuid,
    true,
    'Shatabhisha',
    'Kumbha (Aquarius)',
    'Kaundinya'
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
    '00000000-0000-4000-a000-000000000048'::uuid,
    '00000000-0000-4000-a000-000000000048'::uuid,
    23,
    28,
    158,
    170,
    array['never_married'],
    'Graduate / Post Graduate',
    'Any profession / Teaching / Banking',
    array['Kakinada', 'Rajahmundry', 'Visakhapatnam'],
    'vegetarian',
    'Cultured, affectionate individual who values family warmth and has a pleasant demeanor.'
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

  insert into public.profile_photos (
    profile_id, owner_id, storage_path, is_primary, consented
  ) values (
    '00000000-0000-4000-a000-000000000048'::uuid,
    '00000000-0000-4000-a000-000000000048'::uuid,
    '/images/profiles/demo-groom-03.jpg?p=G23',
    true, true
  ) on conflict (storage_path) do update
  set profile_id = excluded.profile_id,
      owner_id = excluded.owner_id,
      is_primary = true;

  -- Member 49: Pavan Vasamsetti (SB-DEMO-G24)
  insert into auth.users (
    id, instance_id, aud, role, email, encrypted_password,
    email_confirmed_at, raw_app_meta_data, raw_user_meta_data, created_at, updated_at
  ) values (
    '00000000-0000-4000-a000-000000000049'::uuid,
    '00000000-0000-0000-0000-000000000000',
    'authenticated', 'authenticated',
    'demo-g24@shettibalijamatrimony.internal',
    crypt('DemoPass123!', gen_salt('bf')),
    now(),
    jsonb_build_object('provider', 'email', 'providers', array['email']),
    jsonb_build_object('full_name', 'Pavan Vasamsetti', 'gender', 'groom'),
    now(), now()
  ) on conflict (id) do update
  set email = excluded.email,
      raw_user_meta_data = excluded.raw_user_meta_data,
      updated_at = now();

  insert into public.profiles (
    id, full_name, gender, account_type, account_status, created_at, updated_at
  ) values (
    '00000000-0000-4000-a000-000000000049'::uuid,
    'Pavan Vasamsetti',
    'groom',
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
    '00000000-0000-4000-a000-000000000049'::uuid,
    '00000000-0000-4000-a000-000000000049'::uuid,
    'SB-DEMO-G24',
    'Pavan Vasamsetti',
    'groom',
    29,
    173,
    'never_married',
    'Shettibalija',
    'Telugu',
    'Amalapuram',
    'Amalapuram',
    'Amalapuram',
    'Andhra Pradesh',
    'B.Tech in Electrical Engineering',
    'Assistant Engineer (State Power)',
    'Assistant Engineer (Electrical)',
    'Rajahmundry',
    'State PSU',
    '₹8.4 Lakhs',
    'INR',
    'annual',
    'Government & Engineering',
    'Wheatish',
    'vegetarian',
    'No',
    'No',
    'Indian',
    array['Telugu', 'English'],
    'Ashlesha',
    'Karkataka (Cancer)',
    'Vasishta',
    '04:50 PM',
    'Amalapuram',
    true,
    'Assistant Engineer with APTRANSCO. Grounded in my values, fond of badminton, listening to devotional music, and spending time with my parents. Seeking an educated, affectionate partner who values family unity.',
    'Traditional Konaseema agricultural and electrical contracting family. Honest, respected, and deeply rooted in Godavari customs.',
    true,
    'members',
    'hidden',
    'pending',
    true, now(),
    NULL,
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
    '00000000-0000-4000-a000-000000000049'::uuid,
    '00000000-0000-4000-a000-000000000049'::uuid,
    '1997-12-01'::date,
    'demo-g24@shettibalijamatrimony.internal',
    'Amalapuram'
  ) on conflict (profile_id) do update
  set date_of_birth = excluded.date_of_birth,
      email = excluded.email,
      native_place = excluded.native_place;

  insert into public.family_details (
    profile_id, owner_id, father_name, father_profession,
    mother_name, mother_profession, brothers_count, sisters_count,
    brothers_details, sisters_details, family_type, family_location, family_details
  ) values (
    '00000000-0000-4000-a000-000000000049'::uuid,
    '00000000-0000-4000-a000-000000000049'::uuid,
    'Veeranna Vasamsetti',
    'Electrical Contractor & Coconut Farm Owner',
    'Sundari Vasamsetti',
    'Homemaker',
    0,
    1,
    NULL,
    'Sister married to a civil engineer in Vijayawada',
    'Nuclear',
    'Amalapuram, Konaseema',
    'Traditional Konaseema agricultural and electrical contracting family. Honest, respected, and deeply rooted in Godavari customs.'
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
    '00000000-0000-4000-a000-000000000049'::uuid,
    '00000000-0000-4000-a000-000000000049'::uuid,
    true,
    'Ashlesha',
    'Karkataka (Cancer)',
    'Vasishta'
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
    '00000000-0000-4000-a000-000000000049'::uuid,
    '00000000-0000-4000-a000-000000000049'::uuid,
    23,
    27,
    156,
    168,
    array['never_married'],
    'Graduate / B.Tech / Teaching',
    'Govt / Banking / Private / Teaching',
    array['Amalapuram', 'Kakinada', 'Rajahmundry'],
    'vegetarian',
    'Soft-spoken, traditional partner with good family values.'
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

  insert into public.profile_photos (
    profile_id, owner_id, storage_path, is_primary, consented
  ) values (
    '00000000-0000-4000-a000-000000000049'::uuid,
    '00000000-0000-4000-a000-000000000049'::uuid,
    '/images/profiles/demo-groom-04.jpg?p=G24',
    true, true
  ) on conflict (storage_path) do update
  set profile_id = excluded.profile_id,
      owner_id = excluded.owner_id,
      is_primary = true;

  -- Member 50: Vijay Kadali (SB-DEMO-G25)
  insert into auth.users (
    id, instance_id, aud, role, email, encrypted_password,
    email_confirmed_at, raw_app_meta_data, raw_user_meta_data, created_at, updated_at
  ) values (
    '00000000-0000-4000-a000-000000000050'::uuid,
    '00000000-0000-0000-0000-000000000000',
    'authenticated', 'authenticated',
    'demo-g25@shettibalijamatrimony.internal',
    crypt('DemoPass123!', gen_salt('bf')),
    now(),
    jsonb_build_object('provider', 'email', 'providers', array['email']),
    jsonb_build_object('full_name', 'Vijay Kadali', 'gender', 'groom'),
    now(), now()
  ) on conflict (id) do update
  set email = excluded.email,
      raw_user_meta_data = excluded.raw_user_meta_data,
      updated_at = now();

  insert into public.profiles (
    id, full_name, gender, account_type, account_status, created_at, updated_at
  ) values (
    '00000000-0000-4000-a000-000000000050'::uuid,
    'Vijay Kadali',
    'groom',
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
    '00000000-0000-4000-a000-000000000050'::uuid,
    '00000000-0000-4000-a000-000000000050'::uuid,
    'SB-DEMO-G25',
    'Vijay Kadali',
    'groom',
    25,
    171,
    'never_married',
    'Shettibalija',
    'Telugu',
    'Machilipatnam',
    'Vijayawada',
    'Vijayawada',
    'Andhra Pradesh',
    'Diploma in Mechanical Engineering',
    'Workshop Supervisor',
    'Fabrication Supervisor',
    'Vijayawada',
    'Contractor',
    '₹4.8 Lakhs',
    'INR',
    'annual',
    'Carpenter & Metal Fabrication',
    'Dark',
    'non_vegetarian',
    'No',
    'No',
    'Indian',
    array['Telugu', 'English'],
    NULL,
    NULL,
    'Atri',
    NULL,
    'Machilipatnam',
    false,
    'Supervising structural fabrication and mechanical assembly in Vijayawada. I value hard work, honesty, cricket, and quiet family evenings. Looking for a simple, caring life partner.',
    'Hardworking artisan family known for precision metal fabrication and traditional carpentry. Honest and affectionate.',
    false,
    'members',
    'visible',
    'approved',
    true, now(),
    now(),
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
    '00000000-0000-4000-a000-000000000050'::uuid,
    '00000000-0000-4000-a000-000000000050'::uuid,
    '2001-08-20'::date,
    'demo-g25@shettibalijamatrimony.internal',
    'Machilipatnam'
  ) on conflict (profile_id) do update
  set date_of_birth = excluded.date_of_birth,
      email = excluded.email,
      native_place = excluded.native_place;

  insert into public.family_details (
    profile_id, owner_id, father_name, father_profession,
    mother_name, mother_profession, brothers_count, sisters_count,
    brothers_details, sisters_details, family_type, family_location, family_details
  ) values (
    '00000000-0000-4000-a000-000000000050'::uuid,
    '00000000-0000-4000-a000-000000000050'::uuid,
    'Satyam Kadali',
    'Senior Carpenter & Woodwork Craftsman',
    'Mangamma Kadali',
    'Homemaker',
    1,
    0,
    'Younger brother studying ITI mechanical',
    NULL,
    'Nuclear',
    'Machilipatnam & Vijayawada',
    'Hardworking artisan family known for precision metal fabrication and traditional carpentry. Honest and affectionate.'
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
    '00000000-0000-4000-a000-000000000050'::uuid,
    '00000000-0000-4000-a000-000000000050'::uuid,
    false,
    NULL,
    NULL,
    'Atri'
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
    '00000000-0000-4000-a000-000000000050'::uuid,
    '00000000-0000-4000-a000-000000000050'::uuid,
    21,
    25,
    154,
    166,
    array['never_married'],
    'Graduate / Intermediate / Diploma',
    'Any honest profession or homemaker',
    array['Vijayawada', 'Guntur', 'Machilipatnam'],
    'any',
    'A kind, supportive partner who values simplicity and family togetherness.'
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
