export type SearchParams = {
  gender?: string | undefined;
  minAge?: number | undefined;
  maxAge?: number | undefined;
  minHeight?: number | undefined;
  maxHeight?: number | undefined;
  state?: string | undefined;
  city?: string | undefined;
  education?: string | undefined;
  occupation?: string | undefined;
  maritalStatus?: string | undefined;
  motherTongue?: string | undefined;
  community?: string | undefined;
  foodHabit?: string | undefined;
  gothram?: string | undefined;
  star?: string | undefined;
  rashi?: string | undefined;
  page?: number | undefined;
};

function asString(value: unknown): string | undefined {
  return typeof value === "string" && value.trim() ? value : undefined;
}

function asNumber(value: unknown): number | undefined {
  const num = typeof value === "number" ? value : typeof value === "string" ? Number(value) : NaN;
  return Number.isFinite(num) ? num : undefined;
}

export function validateSearchParams(search: Record<string, unknown>): SearchParams {
  return {
    gender: asString(search["gender"]),
    minAge: asNumber(search["minAge"]),
    maxAge: asNumber(search["maxAge"]),
    minHeight: asNumber(search["minHeight"]),
    maxHeight: asNumber(search["maxHeight"]),
    state: asString(search["state"]),
    city: asString(search["city"]),
    education: asString(search["education"]),
    occupation: asString(search["occupation"]),
    maritalStatus: asString(search["maritalStatus"]),
    motherTongue: asString(search["motherTongue"]),
    community: asString(search["community"]),
    foodHabit: asString(search["foodHabit"]),
    gothram: asString(search["gothram"]),
    star: asString(search["star"]),
    rashi: asString(search["rashi"]),
    page: asNumber(search["page"]),
  };
}
