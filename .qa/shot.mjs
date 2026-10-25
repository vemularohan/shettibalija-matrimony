import { chromium } from "playwright-core";
const chrome = "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome";
const browser = await chromium.launch({ executablePath: chrome, headless: true });
const args = process.argv.slice(2);
const url = args[0] || "http://localhost:8081/";
const out = args[1] || "/tmp/sbm.png";
const width = Number(args[2] || 1440);
const height = Number(args[3] || 900);
const full = args[4] !== "viewport";
const page = await browser.newPage({ viewport: { width, height }, deviceScaleFactor: 1 });
const errors = [];
page.on("console", (m) => {
  if (m.type() === "error") errors.push(m.text());
});
page.on("pageerror", (e) => errors.push(String(e)));
await page.goto(url, { waitUntil: "networkidle", timeout: 60000 });
await page.evaluate(async () => {
  await document.fonts.ready;
  const h = document.documentElement.scrollHeight;
  for (let y = 0; y < h; y += 600) {
    window.scrollTo(0, y);
    await new Promise((r) => setTimeout(r, 60));
  }
  window.scrollTo(0, 0);
});
await page.waitForTimeout(800);
await page.screenshot({ path: out, fullPage: full });
console.log(
  JSON.stringify({
    title: await page.title(),
    h: await page.evaluate(() => document.documentElement.scrollHeight),
    w: await page.evaluate(() => innerWidth),
    out,
    errors,
  }),
);
await browser.close();
