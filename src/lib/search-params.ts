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
  query?: string | undefined;
  profileId?: string | undefined;
  photoOnly?: boolean | undefined;
  horoscopeOnly?: boolean | undefined;
  sort?: string | undefined;
  page?: number | undefined;
};

function asString(value: unknown): string | undefined {
  return typeof value === "string" && value.trim() ? value : undefined;
}

function asNumber(value: unknown): number | undefined {
  const num = typeof value === "number" ? value : typeof value === "string" ? Number(value) : NaN;
  return Number.isFinite(num) ? num : undefined;
}

function asBoolean(value: unknown): boolean | undefined {
  if (value === true || value === "true" || value === 1 || value === "1") return true;
  if (value === false || value === "false" || value === 0 || value === "0") return false;
  return undefined;
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
    query: asString(search["query"]),
    profileId: asString(search["profileId"]),
    photoOnly: asBoolean(search["photoOnly"]),
    horoscopeOnly: asBoolean(search["horoscopeOnly"]),
    sort: asString(search["sort"]),
    page: asNumber(search["page"]),
  };
}
