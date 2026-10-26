export type DetailedProfileFormData = {
  // 1. Personal Details
  profileFor?:
    "myself" | "daughter" | "son" | "brother" | "sister" | "relative" | "friend" | string;
  fullName: string;
  dateOfBirth: string; // YYYY-MM-DD
  timeOfBirth: string;
  placeOfBirth: string;
  gender: "bride" | "groom";
  maritalStatus: "never_married" | "divorced" | "widowed" | "separated" | "second_marriage";

  // 2. Horoscope Details
  horoscopeAvailable: "yes" | "no";
  star: string;
  rashi: string;
  gothram: string;
  horoscopeFilePath: string;

  // 3. Education & Career
  education: string;
  occupation: string;
  designation: string;
  jobLocation: string;
  salaryAmount: string;
  salaryCurrency: string;
  salaryPeriod: "annual" | "monthly";
  employmentType: string;

  // 4. Physical Details
  heightCm: number;
  complexion: string;

  // 5. Family Details
  fatherName: string;
  fatherProfession: string;
  motherName: string;
  motherProfession: string;
  brothersCount: number;
  sistersCount: number;
  brothersDetails: string;
  sistersDetails: string;
  familyType: "nuclear" | "joint" | "other";
  familyLocation: string;
  familyAbout: string;

  // 6. Community Details
  communityProfession: string;
  nativePlace: string;
  presentPlace: string;

  // 7. Food & Lifestyle
  foodHabit: "vegetarian" | "non_vegetarian" | "eggetarian" | "other" | "prefer_not_to_say";
  smoking: "no" | "occasionally" | "yes" | "prefer_not_to_say";
  drinking: "no" | "occasionally" | "yes" | "prefer_not_to_say";

  // 8. Contact Details
  contactNumber: string;
  showContactDirectly: boolean;

  // 9. Partner Requirements
  preferredAgeMin: number | null;
  preferredAgeMax: number | null;
  preferredHeightMin: number | null;
  preferredHeightMax: number | null;
  preferredEducation: string;
  preferredOccupation: string;
  preferredLocation: string;
  preferredMaritalStatus: string;
  preferredFoodHabit: string;
  preferredGothram: string;
  requirementsText: string;

  // 10. Declaration & Consent
  declarationAccepted: boolean;
  declarationAcceptedAt: string | null;
};

export const INITIAL_DETAILED_FORM_DATA: DetailedProfileFormData = {
  fullName: "",
  dateOfBirth: "1998-01-01",
  timeOfBirth: "",
  placeOfBirth: "",
  gender: "bride",
  maritalStatus: "never_married",

  horoscopeAvailable: "no",
  star: "",
  rashi: "",
  gothram: "",
  horoscopeFilePath: "",

  education: "B.Tech",
  occupation: "Software Professional",
  designation: "",
  jobLocation: "",
  salaryAmount: "",
  salaryCurrency: "INR",
  salaryPeriod: "annual",
  employmentType: "private",

  heightCm: 165,
  complexion: "",

  fatherName: "",
  fatherProfession: "",
  motherName: "",
  motherProfession: "",
  brothersCount: 0,
  sistersCount: 0,
  brothersDetails: "",
  sistersDetails: "",
  familyType: "nuclear",
  familyLocation: "",
  familyAbout: "",

  communityProfession: "Employee",
  nativePlace: "",
  presentPlace: "",

  foodHabit: "non_vegetarian",
  smoking: "no",
  drinking: "no",

  contactNumber: "",
  showContactDirectly: false,

  preferredAgeMin: 24,
  preferredAgeMax: 30,
  preferredHeightMin: 160,
  preferredHeightMax: 180,
  preferredEducation: "Graduate / Post Graduate",
  preferredOccupation: "Software / Govt / Business",
  preferredLocation: "Andhra Pradesh / Telangana",
  preferredMaritalStatus: "never_married",
  preferredFoodHabit: "any",
  preferredGothram: "Different Gothram",
  requirementsText: "",

  declarationAccepted: false,
  declarationAcceptedAt: null,
};

export function calculateAgeFromDob(dobStr: string): number {
  if (!dobStr) return 25;
  const birth = new Date(dobStr);
  if (isNaN(birth.getTime())) return 25;
  const today = new Date();
  let age = today.getFullYear() - birth.getFullYear();
  const m = today.getMonth() - birth.getMonth();
  if (m < 0 || (m === 0 && today.getDate() < birth.getDate())) {
    age--;
  }
  return Math.max(18, Math.min(80, age));
}

export function formatSalary(amount?: string | null, currency = "INR", period = "annual"): string {
  if (!amount || !amount.trim()) return "Not specified";
  const num = Number(amount.replace(/[^0-9.]/g, ""));
  if (isNaN(num) || num <= 0) return amount;

  const currSymbol =
    currency === "INR"
      ? "₹"
      : currency === "USD"
        ? "$"
        : currency === "EUR"
          ? "€"
          : currency === "GBP"
            ? "£"
            : `${currency} `;

  let formattedNum = "";
  if (currency === "INR") {
    if (num >= 100000) {
      formattedNum = `${(num / 100000).toFixed(1).replace(/\.0$/, "")} Lakhs`;
    } else {
      formattedNum = num.toLocaleString("en-IN");
    }
  } else {
    formattedNum = num.toLocaleString("en-US");
  }

  const periodStr = period === "monthly" ? "p.m." : "p.a.";
  return `${currSymbol}${formattedNum} ${periodStr}`;
}
