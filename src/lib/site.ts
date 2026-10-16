export const SITE_NAME = "Shettibalija Matrimony";
export const SITE_NAME_TE = "శెట్టిబలిజ మ్యాట్రిమోనీ";
export const SITE_TAGLINE = "Find your perfect life partner within the Shettibalija community.";
export const SITE_TAGLINE_TE = "శెట్టిబలిజ సమాజంలో మీకు సరైన జీవిత భాగస్వామిని కనుగొనండి.";
export const SITE_LOGO_URL = "/logo.png";
export const COMMUNITY_NAME = "Shettibalija";
export const PHOTO_BUCKET = "matrimony-photos";
export const PAGE_SIZE = 12;

export const PUBLIC_NAV = [
  { to: "/", label: "Home" },
  { to: "/search", label: "Search Profiles" },
  { to: "/membership", label: "Membership" },
  { to: "/about", label: "About" },
  { to: "/contact", label: "Contact" },
] as const;

export const MEMBER_NAV = [
  { to: "/dashboard", label: "Dashboard" },
  { to: "/dashboard/profile", label: "My Profile" },
  { to: "/search", label: "Search" },
  { to: "/dashboard/interests", label: "Interests" },
  { to: "/dashboard/notifications", label: "Notifications" },
] as const;

export const ADMIN_NAV = [
  { to: "/admin", label: "Dashboard" },
  { to: "/admin/members", label: "Members" },
  { to: "/admin/pending", label: "Pending Profiles" },
  { to: "/admin/photos", label: "Photos" },
  { to: "/admin/memberships", label: "Memberships" },
  { to: "/admin/payments", label: "Payments" },
  { to: "/admin/reports", label: "Reports" },
  { to: "/admin/notifications", label: "Notifications" },
  { to: "/admin/settings", label: "Settings" },
] as const;
