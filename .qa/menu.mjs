import { chromium } from "playwright-core";
const browser = await chromium.launch({
  executablePath: "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome",
  headless: true,
});
const page = await browser.newPage({ viewport: { width: 390, height: 844 } });
await page.goto("http://localhost:8082/about", { waitUntil: "networkidle" });
await page
  .getByRole("button", { name: /open menu|menu/i })
  .first()
  .click();
await page.waitForTimeout(500);
await page.screenshot({ path: "/tmp/menu-390.png" });
console.log(
  await page
    .locator("[role=dialog]")
    .innerText()
    .catch((e) => "no dialog " + e.message),
);
await browser.close();
