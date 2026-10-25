import { chromium } from "playwright-core";
const browser = await chromium.launch({
  executablePath: "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome",
  headless: true,
});
const page = await browser.newPage({ viewport: { width: 1440, height: 900 } });
const pages = [
  "/",
  "/about",
  "/contact",
  "/privacy",
  "/terms",
  "/refund",
  "/help",
  "/membership",
  "/success-stories",
  "/login",
  "/register",
  "/search",
];
const links = new Set();
for (const p of pages) {
  await page.goto("http://localhost:8082" + p, { waitUntil: "networkidle" });
  const hrefs = await page.$$eval("a[href]", (as) => as.map((a) => a.getAttribute("href")));
  for (const h of hrefs)
    if (h && h.startsWith("/") && !h.startsWith("//")) links.add(h.split("#")[0]);
}
for (const l of [...links].sort()) {
  const res = await page.request.get("http://localhost:8082" + l, { maxRedirects: 0 });
  if (res.status() >= 400) console.log(res.status(), l);
}
console.log("checked", links.size);
await browser.close();
