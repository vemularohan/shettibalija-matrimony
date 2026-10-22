import { chromium } from 'playwright-core';
const browser = await chromium.launch({ executablePath: '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome', headless: true });
for (const width of [390, 1440]) {
  const page = await browser.newPage({ viewport: { width, height: 900 } });
  await page.goto('http://localhost:8082/', { waitUntil: 'networkidle' });
  await page.getByRole('button', { name: 'తెలుగు' }).first().click();
  await page.waitForTimeout(600);
  await page.screenshot({ path: `/tmp/home-te-${width}.png` });
  console.log(width, await page.evaluate(() => ({ h: document.documentElement.scrollHeight, sw: document.documentElement.scrollWidth, w: innerWidth, h1: document.querySelector('h1')?.innerText })));
  await page.close();
}
await browser.close();
