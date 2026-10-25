import { chromium } from "playwright-core";
const browser = await chromium.launch({
  executablePath: "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome",
  headless: true,
});
const page = await browser.newPage({ viewport: { width: 1440, height: 900 } });
await page.goto("http://localhost:8082/", { waitUntil: "networkidle" });
for (let i = 0; i < 14; i++) {
  await page.keyboard.press("Tab");
  const info = await page.evaluate(() => {
    const el = document.activeElement;
    const cs = getComputedStyle(el);
    return {
      tag: el?.tagName,
      text: (el?.textContent || "").trim().slice(0, 45),
      outline: cs.outlineWidth + " " + cs.outlineStyle + " " + cs.outlineColor,
      boxShadow: cs.boxShadow.slice(0, 40),
    };
  });
  console.log(i + 1, JSON.stringify(info));
}
await browser.close();
