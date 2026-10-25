import { chromium } from "playwright-core";
const browser = await chromium.launch({
  executablePath: "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome",
  headless: true,
});
const [url, out, width, y] = process.argv.slice(2);
const page = await browser.newPage({ viewport: { width: Number(width), height: 900 } });
await page.goto(url, { waitUntil: "networkidle" });
await page.evaluate((yy) => window.scrollTo(0, Number(yy)), y);
await page.waitForTimeout(500);
await page.screenshot({ path: out });
await browser.close();
