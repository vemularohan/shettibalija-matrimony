import { describe, expect, it } from "vitest";
import { MARITAL_STATUS_OPTIONS, COMPLEXION_OPTIONS, EMPLOYMENT_TYPE_OPTIONS } from "@/lib/options";
import { TRANSLATIONS } from "@/lib/i18n";
import { serializeDetailedData, deserializeDetailedData } from "@/lib/detailed-profile-api";
import { INITIAL_DETAILED_FORM_DATA, calculateAgeFromDob } from "@/lib/detailed-profile-types";
import { filterDemoProfiles } from "@/data/demo-profiles";

describe("Detailed Matrimonial Profile Requirements", () => {
  it("enforces exactly the 5 specified marital status values", () => {
    const values = MARITAL_STATUS_OPTIONS.map((m) => m.value);
    expect(values).toEqual([
      "never_married",
      "divorced",
      "widowed",
      "separated",
      "second_marriage",
    ]);

    const labels = MARITAL_STATUS_OPTIONS.map((m) => m.label);
    expect(labels).toEqual([
      "Never Married",
      "Divorced",
      "Widowed",
      "Separated",
      "Second Marriage",
    ]);
  });

  it("has exact required declaration strings in English and Telugu", () => {
    const enNotice = TRANSLATIONS.en.declarationNotice;
    const teNotice = TRANSLATIONS.te.declarationNotice;

    expect(enNotice).toBe(
      "I declare that the information provided by me is correct and I authorize Shettibalija Matrimony to publish this information on its website and official social media channels for matrimonial purposes, subject to the site's Privacy Policy and Terms & Conditions.",
    );

    expect(teNotice).toBe(
      "నేను అందించిన సమాచారం సరైనదని ప్రకటిస్తున్నాను. వివాహ సంబంధాల కోసం ఈ సమాచారాన్ని శెట్టిబలిజ మ్యాట్రిమోనీ వెబ్సైట్ మరియు అధికారిక సోషల్ మీడియా ఛానళ్లలో ప్రచురించడానికి నేను అనుమతిస్తున్నాను. ఇది వెబ్సైట్ గోప్యతా విధానం మరియు నిబంధనలు & షరతులకు లోబడి ఉంటుంది.",
    );
  });

  it("includes all 10 required section titles in English and Telugu", () => {
    expect(TRANSLATIONS.en.secPersonal).toBe("1. Personal Details");
    expect(TRANSLATIONS.en.secHoroscope).toBe("2. Horoscope Details");
    expect(TRANSLATIONS.en.secCareer).toBe("3. Education & Career");
    expect(TRANSLATIONS.en.secPhysical).toBe("4. Physical Details");
    expect(TRANSLATIONS.en.secFamily).toBe("5. Family Details");
    expect(TRANSLATIONS.en.secCommunity).toBe("6. Community Details");
    expect(TRANSLATIONS.en.secLifestyle).toBe("7. Food & Lifestyle");
    expect(TRANSLATIONS.en.secContact).toBe("8. Contact Details");
    expect(TRANSLATIONS.en.secPartner).toBe("9. Partner Requirements");
    expect(TRANSLATIONS.en.secConsent).toBe("10. Declaration & Consent");

    expect(TRANSLATIONS.te.secPersonal).toContain("వ్యక్తిగత వివరాలు");
    expect(TRANSLATIONS.te.secHoroscope).toContain("జాతక వివరాలు");
    expect(TRANSLATIONS.te.secCareer).toContain("విద్య & ఉద్యోగం");
    expect(TRANSLATIONS.te.secPhysical).toContain("శారీరక వివరాలు");
    expect(TRANSLATIONS.te.secFamily).toContain("కుటుంబ వివరాలు");
    expect(TRANSLATIONS.te.secCommunity).toContain("సమాజం & సంప్రదాయం");
    expect(TRANSLATIONS.te.secLifestyle).toContain("ఆహారం & జీవనశైలి");
    expect(TRANSLATIONS.te.secContact).toContain("సంప్రదింపు వివరాలు");
    expect(TRANSLATIONS.te.secPartner).toContain("జీవిత భాగస్వామి అభిరుచులు");
    expect(TRANSLATIONS.te.secConsent).toContain("డిక్లరేషన్ & సమ్మతి");
  });

  it("correctly serializes and deserializes detailed profile metadata", () => {
    const testData = {
      ...INITIAL_DETAILED_FORM_DATA,
      fullName: "Shetti Satish Kumar",
      gothram: "Janakula",
      star: "Rohini",
      rashi: "Vrishabha",
      salaryAmount: "1800000",
      fatherName: "Venkata Rao S.",
      brothersDetails: "1 elder brother married",
      declarationAccepted: true,
    };

    const serialized = serializeDetailedData(testData);
    expect(serialized).toContain("__SBM_DETAILED_V1__:");

    const deserialized = deserializeDetailedData(serialized);
    expect(deserialized).not.toBeNull();
    expect(deserialized?.fullName).toBe("Shetti Satish Kumar");
    expect(deserialized?.gothram).toBe("Janakula");
    expect(deserialized?.star).toBe("Rohini");
    expect(deserialized?.fatherName).toBe("Venkata Rao S.");
    expect(deserialized?.declarationAccepted).toBe(true);
  });

  it("correctly calculates age from DOB string", () => {
    const age = calculateAgeFromDob("1996-05-15");
    expect(age).toBeGreaterThanOrEqual(25);
    expect(age).toBeLessThanOrEqual(40);
  });

  it("includes non-mandatory complexion options and employment types", () => {
    const compValues = COMPLEXION_OPTIONS.map((c) => c.value);
    expect(compValues).toContain("fair");
    expect(compValues).toContain("wheatish");
    expect(compValues).toContain("dusky");
    expect(compValues).toContain("dark");
    expect(compValues).toContain("prefer_not_to_say");

    const empValues = EMPLOYMENT_TYPE_OPTIONS.map((e) => e.value);
    expect(empValues).toContain("government");
    expect(empValues).toContain("private");
    expect(empValues).toContain("business");
    expect(empValues).toContain("self_employed");
    expect(empValues).toContain("professional");
    expect(empValues).toContain("other");
    expect(empValues).toContain("not_working");
  });

  it("filters demo profiles by the new criteria (star, gothram, marital status)", () => {
    const rohiniProfiles = filterDemoProfiles({ star: "Rohini" });
    expect(rohiniProfiles.length).toBeGreaterThan(0);
    expect(rohiniProfiles.every((p) => p.star === "Rohini")).toBe(true);

    const neverMarried = filterDemoProfiles({ maritalStatus: "never_married" });
    expect(neverMarried.length).toBeGreaterThan(0);
    expect(neverMarried.every((p) => p.marital_status === "never_married")).toBe(true);
  });
});
