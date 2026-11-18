import fs from "node:fs";
import path from "node:path";

const SITE_URL = "https://www.settibalijagoudsmatrimony.com";

const PUBLIC_PATHS = [
  "/",
  "/settibalija-matrimony",
  "/shettibalija-matrimony",
  "/settibalija-brides",
  "/settibalija-grooms",
  "/matrimony-guides",
  "/matrimony-guides/create-a-strong-matrimonial-profile",
  "/matrimony-guides/find-a-suitable-settibalija-bride-or-groom",
  "/matrimony-guides/online-matrimony-safety-and-privacy",
  "/matrimony-guides/how-to-register-on-shettibalija-matrimony",
  "/matrimony-guides/questions-before-pelli-choopulu",
  "/about",
  "/help",
  "/contact",
  "/membership",
  "/privacy",
  "/terms",
  "/refund",
  "/success-stories",
  "/settibalija-matrimony-hyderabad",
  "/settibalija-matrimony-vijayawada",
  "/settibalija-matrimony-visakhapatnam",
  "/settibalija-matrimony-rajahmundry",
  "/settibalija-matrimony-kakinada",
  "/settibalija-matrimony-guntur",
  "/settibalija-matrimony-eluru",
  "/settibalija-matrimony-bhimavaram",
  "/settibalija-matrimony-nellore",
  "/settibalija-matrimony-tirupati",
  "/settibalija-matrimony-bengaluru",
  "/settibalija-matrimony-chennai",
];

const urls = PUBLIC_PATHS.map((pathname) => {
  const url = pathname === "/" ? `${SITE_URL}/` : `${SITE_URL}${pathname}`;
  return `  <url><loc>${url}</loc></url>`;
});

const sitemap = [
  '<?xml version="1.0" encoding="UTF-8"?>',
  '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">',
  ...urls,
  "</urlset>",
  "",
].join("\n");

const outputPath = path.resolve(process.cwd(), "public/sitemap.xml");
fs.writeFileSync(outputPath, sitemap, "utf8");
console.log(`Generated ${outputPath} with ${PUBLIC_PATHS.length} public URLs.`);
