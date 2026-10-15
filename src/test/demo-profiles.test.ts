import { describe, expect, it } from "vitest";
import { DEMO_PROFILES, filterDemoProfiles, findDemoProfile, isDemoId } from "@/data/demo-profiles";

describe("Demo Matrimonial Profiles Dataset", () => {
  it("contains between 10 and 15 demo profiles", () => {
    expect(DEMO_PROFILES.length).toBeGreaterThanOrEqual(10);
    expect(DEMO_PROFILES.length).toBeLessThanOrEqual(15);
    expect(DEMO_PROFILES.length).toBe(14);
  });

  it("marks all records strictly with is_demo: true", () => {
    for (const profile of DEMO_PROFILES) {
      expect(profile.is_demo).toBe(true);
    }
  });

  it("ensures no demo profiles have profile photos (No-Image requirement)", () => {
    for (const profile of DEMO_PROFILES) {
      // Neither image URLs nor avatar image paths should be present on demo profiles
      expect((profile as { photos?: unknown }).photos).toBeUndefined();
      expect((profile as { avatar_url?: unknown }).avatar_url).toBeUndefined();
    }
  });

  it("contains all required realistic demographic and preference fields", () => {
    for (const profile of DEMO_PROFILES) {
      expect(profile.id).toMatch(/^demo-sbm-\d{2}$/);
      expect(profile.profile_code).toMatch(/^SBM-D\d{3}$/);
      expect(profile.display_name).toBeTruthy();
      expect(["bride", "groom"]).toContain(profile.gender);
      expect(profile.age).toBeGreaterThanOrEqual(21);
      expect(profile.height_cm).toBeGreaterThan(140);
      expect(profile.education).toBeTruthy();
      expect(profile.occupation).toBeTruthy();
      expect(profile.city).toBeTruthy();
      expect(["Telangana", "Andhra Pradesh"]).toContain(profile.state);
      expect(profile.marital_status).toBe("never_married");
      expect(profile.mother_tongue).toBe("Telugu");
      expect(profile.about_me).toBeTruthy();
      expect(profile.partner_preferences).toBeDefined();
      expect(profile.partner_preferences?.preferred_locations?.length).toBeGreaterThan(0);
    }
  });

  it("isDemoId correctly identifies demo profile IDs and codes", () => {
    expect(isDemoId("demo-sbm-01")).toBe(true);
    expect(isDemoId("SBM-D101")).toBe(true);
    expect(isDemoId("c6f8b9e4-4d82-4f3a-9e12-87f54c30b201")).toBe(false);
    expect(isDemoId("")).toBe(false);
  });

  it("findDemoProfile retrieves profiles by id and profile_code case-insensitively", () => {
    const byId = findDemoProfile("demo-sbm-01");
    expect(byId).toBeDefined();
    expect(byId?.display_name).toBe("Ananya R.");

    const byCode = findDemoProfile("sbm-d101");
    expect(byCode).toBeDefined();
    expect(byCode?.id).toBe("demo-sbm-01");

    const nonExistent = findDemoProfile("non-existent-id");
    expect(nonExistent).toBeUndefined();
  });

  it("filterDemoProfiles filters correctly by gender, age, and state", () => {
    const brides = filterDemoProfiles({ gender: "bride" });
    expect(brides.length).toBe(7);
    for (const b of brides) expect(b.gender).toBe("bride");

    const grooms = filterDemoProfiles({ gender: "groom" });
    expect(grooms.length).toBe(7);
    for (const g of grooms) expect(g.gender).toBe("groom");

    const hyderabadProfiles = filterDemoProfiles({ state: "Telangana" });
    expect(hyderabadProfiles.length).toBeGreaterThan(0);
    for (const p of hyderabadProfiles) expect(p.state).toBe("Telangana");

    const ageFiltered = filterDemoProfiles({ minAge: 25, maxAge: 27 });
    for (const p of ageFiltered) {
      expect(p.age).toBeGreaterThanOrEqual(25);
      expect(p.age).toBeLessThanOrEqual(27);
    }
  });
});
