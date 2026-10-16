import { describe, expect, it } from "vitest";
import fs from "node:fs";
import path from "node:path";
import { SITE_LOGO_URL, SITE_NAME, SITE_TAGLINE } from "@/lib/site";
import { TRANSLATIONS } from "@/lib/i18n";

describe("Shettibalija Sangham Logo & Branding Verification", () => {
  it("has the official logo files present in public", () => {
    const publicLogo = path.resolve(process.cwd(), "public/logo.png");
    const publicMatrimonyLogo = path.resolve(process.cwd(), "public/matrimonylogo.png");
    expect(fs.existsSync(publicLogo)).toBe(true);
    expect(fs.existsSync(publicMatrimonyLogo)).toBe(true);

    const stats = fs.statSync(publicLogo);
    expect(stats.size).toBeGreaterThan(100000);
  });

  it("exports correct SITE_LOGO_URL pointing to valid public logo", () => {
    expect(["/logo.png", "/matrimonylogo.png"]).toContain(SITE_LOGO_URL);
  });

  it("contains bilingual site titles and subtitles in i18n", () => {
    expect(TRANSLATIONS.en.siteName).toBe("Shettibalija Matrimony");
    expect(TRANSLATIONS.en.siteSubtitle).toBe(
      "Find your perfect life partner within the Shettibalija community.",
    );

    expect(TRANSLATIONS.te.siteName).toBe("శెట్టిబలిజ మ్యాట్రిమోనీ");
    expect(TRANSLATIONS.te.siteSubtitle).toBe(
      "శెట్టిబలిజ సమాజంలో మీకు సరైన జీవిత భాగస్వామిని కనుగొనండి.",
    );
  });

  it("matches site tagline in site.ts", () => {
    expect(SITE_TAGLINE).toBe("Find your perfect life partner within the Shettibalija community.");
  });
});
