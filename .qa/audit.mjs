import { chromium } from "playwright-core";
const chrome = "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome";
const browser = await chromium.launch({ executablePath: chrome, headless: true });
const BASE = "http://localhost:8082";
const paths = [
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
const widths = [360, 390, 430, 768, 1024, 1280, 1440, 1600];
for (const width of widths) {
  const context = await browser.newContext({
    viewport: { width, height: width < 700 ? 844 : 900 },
    deviceScaleFactor: 1,
  });
  const page = await context.newPage();
  const errors = [];
  page.on("console", (m) => {
    if (m.type() === "error") errors.push(m.text().slice(0, 180));
  });
  page.on("pageerror", (e) => errors.push("PAGEERROR " + String(e).slice(0, 180)));
  for (const path of paths) {
    errors.length = 0;
    try {
      await page.goto(BASE + path, { waitUntil: "networkidle", timeout: 45000 });
      await page.evaluate(() => document.fonts.ready);
      await page.waitForTimeout(250);
      const info = await page.evaluate(() => {
        const all = Array.from(document.querySelectorAll("*"));
        let worst = null;
        for (const el of all) {
          const r = el.getBoundingClientRect();
          if (r.width > 0 && (r.right > window.innerWidth + 1 || r.left < -1)) {
            const over = Math.max(r.right - window.innerWidth, -r.left);
            if (!worst || over > worst.over)
              worst = {
                over,
                tag: el.tagName,
                cls: String(el.className).slice(0, 80),
                right: Math.round(r.right),
                left: Math.round(r.left),
              };
          }
        }
        return {
          scrollWidth: document.documentElement.scrollWidth,
          innerWidth: window.innerWidth,
          height: document.documentElement.scrollHeight,
          worst,
        };
      });
      const overflow = info.scrollWidth > width + 1;
      console.log(
        `${width} ${path} ${overflow ? "OVERFLOW" : "ok"} h=${info.height} sw=${info.scrollWidth}${info.worst ? " worst=" + JSON.stringify(info.worst) : ""}${errors.length ? " errors=" + JSON.stringify(errors) : ""}`,
      );
    } catch (e) {
      console.log(`${width} ${path} FAIL ${String(e).slice(0, 160)}`);
    }
  }
  await context.close();
}
await browser.close();
