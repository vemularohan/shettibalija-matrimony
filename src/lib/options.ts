export const GENDER_OPTIONS = [
  { value: "bride", label: "Bride" },
  { value: "groom", label: "Groom" },
] as const;

export const ACCOUNT_CREATED_BY = [
  { value: "self", label: "Self" },
  { value: "parent_guardian", label: "Parent / Guardian" },
] as const;

export const MARITAL_STATUS_OPTIONS = [
  { value: "never_married", label: "Never Married" },
  { value: "divorced", label: "Divorced" },
  { value: "widowed", label: "Widowed" },
  { value: "awaiting_divorce", label: "Awaiting Divorce" },
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
  "MBBS",
  "M.A",
  "M.Com",
  "M.Sc",
  "M.Tech",
  "MBA",
  "Ph.D",
  "CA",
  "Other",
] as const;

export const OCCUPATION_OPTIONS = [
  "Software Professional",
  "Government Employee",
  "Teacher",
  "Doctor",
  "Engineer",
  "Business",
  "Banking",
  "Lawyer",
  "Homemaker",
  "Student",
  "Agriculture",
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

export const FAMILY_TYPE_OPTIONS = ["Nuclear", "Joint", "Other"] as const;

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

export const HEIGHT_CM_OPTIONS = Array.from({ length: 61 }, (_, index) => 137 + index);

export const AGE_OPTIONS = Array.from({ length: 43 }, (_, index) => 18 + index);
