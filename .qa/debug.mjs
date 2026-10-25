import { chromium } from "playwright-core";
const chrome = "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome";
const browser = await chromium.launch({ executablePath: chrome, headless: true });
const url = process.argv[2] || "http://localhost:8082/success-stories";
const page = await browser.newPage({ viewport: { width: 1440, height: 900 } });
page.on("console", (m) => console.log("CONSOLE", m.type(), m.text()));
page.on("pageerror", (e) => console.log("PAGEERROR", String(e)));
page.on("response", (r) => {
  if (r.status() >= 400) console.log("HTTP", r.status(), r.url());
});
page.on("requestfailed", (r) => console.log("FAILED", r.url(), r.failure()?.errorText));
await page.goto(url, { waitUntil: "networkidle", timeout: 60000 });
await page.waitForTimeout(1500);
console.log("TITLE", await page.title());
console.log("BODY", (await page.locator("body").innerText()).slice(0, 1200));
await browser.close();
