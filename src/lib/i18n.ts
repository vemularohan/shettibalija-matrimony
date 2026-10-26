import { useEffect, useState } from "react";

export type Language = "en" | "te";

export const TRANSLATIONS = {
  en: {
    siteName: "Shettibalija Matrimony",
    siteSubtitle: "Find your perfect life partner within the Shettibalija community.",
    heroHeadline: "Find Your Perfect Life Partner",
    heroSupportingText: "Trusted matrimonial platform for the Shettibalija community.",
    logoAlt: "Shettibalija Sangham Official Logo",
    heading: "Create a Matrimony Profile",
    subheading: "Find your perfect match",
    profileFor: "Profile created for",
    namePlaceholder: "Enter the name",
    countryCode: "Country code",
    mobilePlaceholder: "Enter Number",
    registerFree: "REGISTER FREE",
    termsNotice: "By clicking register free, I agree to the",
    termsLink: "Terms & Conditions",
    andText: "and",
    privacyLink: "Privacy Policy",
    searchProfiles: "Search Profiles",
    searchTitle: "Quick Search",
    lookingFor: "Looking for",
    brideOrGroom: "Bride or Groom",
    bride: "Bride (Female)",
    groom: "Groom (Male)",
    location: "Location",
    anyState: "Any state",
    minAge: "Min age",
    maxAge: "Max age",
    education: "Education",
    occupation: "Occupation",
    any: "Any",
    self: "Self",
    son: "Son",
    daughter: "Daughter",
    brother: "Brother",
    sister: "Sister",
    relative: "Relative",
    friend: "Friend",

    // Step / Section Titles
    secPersonal: "1. Personal Details",
    secHoroscope: "2. Horoscope Details",
    secCareer: "3. Education & Career",
    secPhysical: "4. Physical Details",
    secFamily: "5. Family Details",
    secCommunity: "6. Community Details",
    secLifestyle: "7. Food & Lifestyle",
    secContact: "8. Contact Details",
    secPartner: "9. Partner Requirements",
    secConsent: "10. Declaration & Consent",

    // Section 1: Personal Details
    fullName: "Full Name / Name Including Surname",
    fullNamePlaceholder: "e.g. Shetti Venkata Rao",
    dob: "Date of Birth",
    timeOfBirth: "Time of Birth",
    placeOfBirth: "Place of Birth",
    placeOfBirthPlaceholder: "e.g. Kakinada, Rajahmundry",
    gender: "Gender",
    maritalStatus: "Marital Status",

    // Section 2: Horoscope Details
    horoscopeAvailable: "Horoscope Available?",
    starNakshatra: "Star / Nakshatra",
    rashi: "Rashi",
    gothram: "Gothram",
    gothramPlaceholder: "e.g. Janakula, Kasyapa",
    horoscopeDoc: "Horoscope Document / Image (Optional)",
    horoscopePrivacyNotice:
      "Horoscope documents are stored securely in protected storage and will not be displayed publicly.",

    // Section 3: Education & Career
    jobOccupation: "Job / Occupation",
    designation: "Designation",
    designationPlaceholder: "e.g. Senior Software Architect",
    jobLocation: "Job Location",
    jobLocationPlaceholder: "e.g. Hyderabad, Bengaluru, USA",
    salaryAmount: "Salary / Income Amount",
    salaryCurrency: "Currency",
    salaryPeriod: "Salary Period",
    employmentType: "Employment Type",

    // Section 4: Physical Details
    height: "Height",
    complexion: "Complexion (Optional)",

    // Section 5: Family Details
    fatherName: "Father's Name",
    fatherProfession: "Father's Profession",
    fatherProfessionPlaceholder: "e.g. Retired Govt Officer, Business",
    motherName: "Mother's Name",
    motherProfession: "Mother's Profession",
    motherProfessionPlaceholder: "e.g. Homemaker, Teacher",
    brothersCount: "Number of Brothers",
    sistersCount: "Number of Sisters",
    brothersDetails: "Brothers' Marital Status / Details",
    brothersDetailsPlaceholder: "e.g. 1 elder brother married, settled in Hyderabad",
    sistersDetails: "Sisters' Marital Status / Details",
    sistersDetailsPlaceholder: "e.g. 1 younger sister unmarried, pursuing B.Tech",
    familyType: "Family Type",
    familyLocation: "Family Location",
    familyLocationPlaceholder: "e.g. Visakhapatnam, Andhra Pradesh",
    familyAbout: "About Family & Values",
    familyAboutPlaceholder:
      "Briefly describe your family values, background, and native connection...",

    // Section 6: Community Details
    communityProfession: "Community Profession / Traditional Profession",
    communityProfessionPlaceholder: "e.g. Business, Carpenter, Employee...",
    nativePlace: "Native Place",
    nativePlacePlaceholder: "e.g. Amalapuram, East Godavari",
    presentPlace: "Present Place / Settled At",
    presentPlacePlaceholder: "e.g. Madhapur, Hyderabad",

    // Section 7: Food & Lifestyle
    foodHabits: "Food Habits",
    smoking: "Smoking",
    drinking: "Drinking",

    // Section 8: Contact Details
    contactNumber: "Contact Number",
    contactPrivacyNotice:
      "Your contact number is stored securely. It is not publicly visible and only shared through authorized requests.",
    showContactSetting: "Allow accepted matches to see contact number directly",

    // Section 9: Partner Requirements
    prefAgeRange: "Preferred Age Range (Years)",
    prefMinAge: "Min Age",
    prefMaxAge: "Max Age",
    prefHeightRange: "Preferred Height Range",
    prefMinHeight: "Min Height",
    prefMaxHeight: "Max Height",
    prefEducation: "Preferred Education",
    prefOccupation: "Preferred Occupation",
    prefLocation: "Preferred Location",
    prefLocationPlaceholder: "e.g. Hyderabad, AP, Any Metro city",
    prefMaritalStatus: "Preferred Marital Status",
    prefFoodHabit: "Preferred Food Habit",
    prefGothram: "Preferred Gothram",
    partnerExpectations: "Partner Requirements / Expectations",
    partnerExpectationsPlaceholder:
      "Write in detail about your expectations regarding education, family values, hobbies, or partner lifestyle (Telugu or English)...",

    // Section 10: Declaration & Consent
    declarationTitle: "Declaration & Consent",
    declarationNotice:
      "I declare that the information provided by me is correct and I authorize Shettibalija Matrimony to publish this information on its website and official social media channels for matrimonial purposes, subject to the site's Privacy Policy and Terms & Conditions.",
    declarationAcknowledge: "I confirm the above declaration is true and authentic.",

    // Actions & Form Controls
    next: "Next Section",
    previous: "Previous",
    saveProfile: "Save Profile",
    saveDraft: "Save Draft",
    draftSaved: "Draft saved locally!",
    submitting: "Submitting Profile...",
    completeProfile: "Complete Profile Registration",
    optional: "Optional",
    required: "Required",
    select: "-- Select --",
    yes: "Yes",
    no: "No",
    stepOf: "Step",
    of: "of",
    errorsFound: "Please check the highlighted fields above.",
    phoneReq: "Please enter a valid 10-digit phone number.",
    nameReq: "Please enter your full name.",
    dobReq: "Please enter a valid Date of Birth.",
    declarationReq: "You must accept the declaration to proceed.",
  },
  te: {
    siteName: "శెట్టిబలిజ మ్యాట్రిమోనీ",
    siteSubtitle: "శెట్టిబలిజ సమాజంలో మీకు సరైన జీవిత భాగస్వామిని కనుగొనండి.",
    heroHeadline: "మీకు సరైన జీవిత భాగస్వామిని కనుగొనండి",
    heroSupportingText: "శెట్టిబలిజ సమాజానికి విశ్వసనీయమైన వివాహ వేదిక.",
    logoAlt: "శెట్టిబలిజ సంఘం అధికారిక లోగో",
    heading: "వివాహ ప్రొఫైల్ను సృష్టించండి",
    subheading: "మీకు సరైన జీవిత భాగస్వామిని కనుగొనండి",
    profileFor: "ప్రొఫైల్ ఎవరి కోసం",
    namePlaceholder: "పేరు నమోదు చేయండి",
    countryCode: "కంట్రీ కోడ్",
    mobilePlaceholder: "నంబర్ నమోదు చేయండి",
    registerFree: "ఉచితంగా నమోదు చేసుకోండి",
    termsNotice: "ఉచితంగా నమోదు చేయడాన్ని క్లిక్ చేయడం ద్వారా, నేను",
    termsLink: "నిబంధనలు & షరతులు",
    andText: "మరియు",
    privacyLink: "గోప్యతా విధానానికి",
    searchProfiles: "ప్రొఫైల్‌లను శోధించండి",
    searchTitle: "శీఘ్ర శోధన",
    lookingFor: "ఎవరి కోసం",
    brideOrGroom: "వధువు లేదా వరుడు",
    bride: "వధువు (Bride)",
    groom: "వరుడు (Groom)",
    location: "ప్రాంతం",
    anyState: "ఏదైనా రాష్ట్రం",
    minAge: "కనిష్ట వయస్సు",
    maxAge: "గరిష్ట వయస్సు",
    education: "చదువు",
    occupation: "ఉద్యోగం",
    any: "ఏదైనా",
    self: "నా కోసం (Self)",
    son: "కుమారుడు (Son)",
    daughter: "కుమార్తె (Daughter)",
    brother: "సోదరుడు (Brother)",
    sister: "సోదరి (Sister)",
    relative: "బంధువు (Relative)",
    friend: "స్నేహితుడు (Friend)",

    // Step / Section Titles
    secPersonal: "1. వ్యక్తిగత వివరాలు",
    secHoroscope: "2. జాతక వివరాలు",
    secCareer: "3. విద్య & ఉద్యోగం",
    secPhysical: "4. శారీరక వివరాలు",
    secFamily: "5. కుటుంబ వివరాలు",
    secCommunity: "6. సమాజం & సంప్రదాయం",
    secLifestyle: "7. ఆహారం & జీవనశైలి",
    secContact: "8. సంప్రదింపు వివరాలు",
    secPartner: "9. జీవిత భాగస్వామి అభిరుచులు",
    secConsent: "10. డిక్లరేషన్ & సమ్మతి",

    // Section 1: Personal Details
    fullName: "పూర్తి పేరు / ఇంటి పేరుతో సహా",
    fullNamePlaceholder: "ఉదా: శెట్టి వెంకట రావు",
    dob: "పుట్టిన తేదీ",
    timeOfBirth: "పుట్టిన సమయం",
    placeOfBirth: "పుట్టిన ప్రదేశం",
    placeOfBirthPlaceholder: "ఉదా: కాకినాడ, రాజమండ్రి",
    gender: "లింగం",
    maritalStatus: "వైవాహిక స్థితి",

    // Section 2: Horoscope Details
    horoscopeAvailable: "జాతకం అందుబాటులో ఉందా?",
    starNakshatra: "నక్షత్రం",
    rashi: "రాశి",
    gothram: "గోత్రం",
    gothramPlaceholder: "ఉదా: జనకుల, కాశ్యప",
    horoscopeDoc: "జాతక పత్రం / ఫోటో (ఐచ్ఛికం)",
    horoscopePrivacyNotice:
      "జాతక పత్రాలు గోప్యంగా ఉంచబడతాయి మరియు మీ అనుమతి లేకుండా పబ్లిక్‌గా ప్రదర్శించబడవు.",

    // Section 3: Education & Career
    jobOccupation: "ఉద్యోగం / వృత్తి",
    designation: "హోదా (Designation)",
    designationPlaceholder: "ఉదా: సీనియర్ సాఫ్ట్‌వేర్ ఆర్కిటెక్ట్",
    jobLocation: "ఉద్యోగ స్థలం",
    jobLocationPlaceholder: "ఉదా: హైదరాబాద్, బెంగళూరు, అమెరికా",
    salaryAmount: "జీతం / ఆదాయం మొత్తం",
    salaryCurrency: "కరెన్సీ",
    salaryPeriod: "కాలపరిమితి (వార్షికం / నెలవారీ)",
    employmentType: "ఉద్యోగ రకం",

    // Section 4: Physical Details
    height: "ఎత్తు",
    complexion: "శరీర రంగు (Complexion - ఐచ్ఛికం)",

    // Section 5: Family Details
    fatherName: "తండ్రి పేరు",
    fatherProfession: "తండ్రి వృత్తి / ఉద్యోగం",
    fatherProfessionPlaceholder: "ఉదా: రిటైర్డ్ ప్రభుత్వ ఉద్యోగి, వ్యాపారం",
    motherName: "తల్లి పేరు",
    motherProfession: "తల్లి వృత్తి / ఉద్యోగం",
    motherProfessionPlaceholder: "ఉదా: గృహిణి, ఉపాధ్యాయురాలు",
    brothersCount: "సోదరుల సంఖ్య",
    sistersCount: "సోదరీమణుల సంఖ్య",
    brothersDetails: "సోదరుల వైవాహిక స్థితి & వివరాలు",
    brothersDetailsPlaceholder: "ఉదా: 1 అన్నయ్య, వివాహం అయ్యింది, హైదరాబాద్‌లో ఉన్నారు",
    sistersDetails: "సోదరీమణుల వైవాహిక స్థితి & వివరాలు",
    sistersDetailsPlaceholder: "ఉదా: 1 చెల్లెలు, చదువుకుంటోంది",
    familyType: "కుటుంబ రకం",
    familyLocation: "కుటుంబం ఉండే స్థలం",
    familyLocationPlaceholder: "ఉదా: విశాఖపట్నం, ఆంధ్రప్రదేశ్",
    familyAbout: "కుటుంబ నేపథ్యం & విలువలు",
    familyAboutPlaceholder: "మీ కుటుంబ సంప్రదాయాలు, విలువలు మరియు స్వస్థలం గురించి రాయండి...",

    // Section 6: Community Details
    communityProfession: "కుల / సంప్రదాయ వృత్తి",
    communityProfessionPlaceholder: "ఉదా: వ్యాపారం, వడ్రంగి, ఉద్యోగి...",
    nativePlace: "సొంత ఊరు (Native Place)",
    nativePlacePlaceholder: "ఉదా: అమలాపురం, తూర్పు గోదావరి",
    presentPlace: "ప్రస్తుత నివాస స్థలం",
    presentPlacePlaceholder: "ఉదా: మాదాపూర్, హైదరాబాద్",

    // Section 7: Food & Lifestyle
    foodHabits: "ఆహార అలవాట్లు",
    smoking: "పొగతాగే అలవాటు",
    drinking: "మద్యపాన అలవాటు",

    // Section 8: Contact Details
    contactNumber: "సంప్రదింపు నంబర్",
    contactPrivacyNotice: "మీ సంప్రదింపు నంబర్ గోప్యంగా ఉంచబడుతుంది. పబ్లిక్‌గా ఎవరికీ కనిపించదు.",
    showContactSetting: "ధృవీకరించబడిన సభ్యులు నేరుగా ఫోన్ నంబర్ చూడడానికి అనుమతించండి",

    // Section 9: Partner Requirements
    prefAgeRange: "ఆశించే వయస్సు పరిమితి (సంవత్సరాలు)",
    prefMinAge: "కనిష్ట వయస్సు",
    prefMaxAge: "గరిష్ట వయస్సు",
    prefHeightRange: "ఆశించే ఎత్తు పరిమితి",
    prefMinHeight: "కనిష్ట ఎత్తు",
    prefMaxHeight: "గరిష్ట ఎత్తు",
    prefEducation: "ఆశించే చదువు",
    prefOccupation: "ఆశించే ఉద్యోగం",
    prefLocation: "ఆశించే ప్రాంతం",
    prefLocationPlaceholder: "ఉదా: హైదరాబాద్, ఏపీ, ఎక్కడైనా",
    prefMaritalStatus: "ఆశించే వైవాహిక స్థితి",
    prefFoodHabit: "ఆశించే ఆహారపు అలవాటు",
    prefGothram: "ఆశించే గోత్రం",
    partnerExpectations: "జీవిత భాగస్వామి నుంచి ఆశించే అంశాలు / అభిరుచులు",
    partnerExpectationsPlaceholder:
      "చదువు, కుటుంబ విలువలు, అభిరుచులు లేదా ఇతర ప్రాధాన్యతల గురించి వివరించండి (తెలుగు లేదా ఆంగ్లంలో)...",

    // Section 10: Declaration & Consent
    declarationTitle: "డిక్లరేషన్ మరియు సమ్మతి",
    declarationNotice:
      "నేను అందించిన సమాచారం సరైనదని ప్రకటిస్తున్నాను. వివాహ సంబంధాల కోసం ఈ సమాచారాన్ని శెట్టిబలిజ మ్యాట్రిమోనీ వెబ్సైట్ మరియు అధికారిక సోషల్ మీడియా ఛానళ్లలో ప్రచురించడానికి నేను అనుమతిస్తున్నాను. ఇది వెబ్సైట్ గోప్యతా విధానం మరియు నిబంధనలు & షరతులకు లోబడి ఉంటుంది.",
    declarationAcknowledge: "నేను పైన పేర్కొన్న వివరాలను ధృవీకరిస్తున్నాను.",

    // Actions & Form Controls
    next: "తరువాతి విభాగం",
    previous: "మునుపటిది",
    saveProfile: "ప్రొఫైల్ సేవ్ చేయండి",
    saveDraft: "చిత్తుప్రతిగా భద్రపరచు",
    draftSaved: "వివరాలు సేవ్ చేయబడ్డాయి!",
    submitting: "సమర్పిస్తోంది...",
    completeProfile: "ప్రొఫైల్ రిజిస్ట్రేషన్ పూర్తి చేయండి",
    optional: "ఐచ్ఛికం",
    required: "తప్పనిసరి",
    select: "-- ఎంచుకోండి --",
    yes: "అవును",
    no: "కాదు",
    stepOf: "విభాగం",
    of: "నుండి",
    errorsFound: "దయచేసి ఎరుపు రంగులో ఉన్న వివరాలను సరిచూడండి.",
    phoneReq: "దయచేసి సరైన 10 అంకెల ఫోన్ నంబర్ నమోదు చేయండి.",
    nameReq: "దయచేసి మీ పూర్తి పేరు నమోదు చేయండి.",
    dobReq: "దయచేసి సరైన పుట్టిన తేదీ నమోదు చేయండి.",
    declarationReq: "కొనసాగడానికి దయచేసి డిక్లరేషన్‌ను అంగీకరించండి.",
  },
} as const;

export type TranslationKey = keyof (typeof TRANSLATIONS)["en"];

const STORAGE_KEY = "sbm_user_language";
const LANG_CHANGE_EVENT = "sbm-language-change";

export function getStoredLanguage(): Language {
  if (typeof window === "undefined") return "en";
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored === "te" || stored === "en") return stored;
  } catch {
    // ignore
  }
  return "en";
}

export function setStoredLanguage(lang: Language): void {
  if (typeof window === "undefined") return;
  try {
    localStorage.setItem(STORAGE_KEY, lang);
    window.dispatchEvent(new CustomEvent(LANG_CHANGE_EVENT, { detail: lang }));
  } catch {
    // ignore
  }
}

export function useLanguage() {
  const [lang, setLangState] = useState<Language>("en");

  useEffect(() => {
    const stored = getStoredLanguage();
    if (stored && stored !== "en") {
      setLangState(stored);
    }

    function onLangChange(event: Event) {
      const customEvent = event as CustomEvent<Language>;
      if (customEvent.detail) {
        setLangState(customEvent.detail);
      }
    }

    window.addEventListener(LANG_CHANGE_EVENT, onLangChange);
    return () => window.removeEventListener(LANG_CHANGE_EVENT, onLangChange);
  }, []);

  const setLanguage = (newLang: Language) => {
    setLangState(newLang);
    setStoredLanguage(newLang);
  };

  const t = (key: TranslationKey): string => {
    return TRANSLATIONS[lang]?.[key] ?? TRANSLATIONS.en[key] ?? key;
  };

  return { lang, setLanguage, t };
}
