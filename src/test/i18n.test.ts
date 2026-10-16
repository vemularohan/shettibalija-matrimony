import { describe, expect, it } from "vitest";
import { TRANSLATIONS } from "@/lib/i18n";

describe("i18n System & Hero Section Translations", () => {
  it("contains all required English strings with exact copy", () => {
    const en = TRANSLATIONS.en;
    expect(en.heading).toBe("Create a Matrimony Profile");
    expect(en.subheading).toBe("Find your perfect match");
    expect(en.profileFor).toBe("Profile created for");
    expect(en.namePlaceholder).toBe("Enter the name");
    expect(en.mobilePlaceholder).toBe("Enter Number");
    expect(en.registerFree).toBe("REGISTER FREE");
    expect(en.termsNotice).toBe("By clicking register free, I agree to the");
  });

  it("contains all required Telugu strings with exact copy", () => {
    const te = TRANSLATIONS.te;
    expect(te.heading).toBe("వివాహ ప్రొఫైల్ను సృష్టించండి");
    expect(te.subheading).toBe("మీకు సరైన జీవిత భాగస్వామిని కనుగొనండి");
    expect(te.profileFor).toBe("ప్రొఫైల్ ఎవరి కోసం");
    expect(te.namePlaceholder).toBe("పేరు నమోదు చేయండి");
    expect(te.mobilePlaceholder).toBe("నంబర్ నమోదు చేయండి");
    expect(te.registerFree).toBe("ఉచితంగా నమోదు చేసుకోండి");
    expect(te.termsNotice).toContain("ఉచితంగా నమోదు చేయడాన్ని క్లిక్ చేయడం ద్వారా");
  });

  it("has corresponding translations for all keys in both languages", () => {
    const enKeys = Object.keys(TRANSLATIONS.en).sort();
    const teKeys = Object.keys(TRANSLATIONS.te).sort();
    expect(enKeys).toEqual(teKeys);
  });
});
