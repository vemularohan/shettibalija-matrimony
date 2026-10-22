import { chromium } from 'playwright-core';
const browser = await chromium.launch({ executablePath: '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome', headless: true });
for (const width of [390, 768]) {
  const page = await browser.newPage({ viewport: { width, height: 844 } });
  await page.goto('http://localhost:8082/register', { waitUntil: 'networkidle' });
  const data = await page.evaluate(() => {
    const brand = document.querySelector('.register-frontdoor__brand');
    const span = brand?.querySelector('span');
    const r = e => e ? e.getBoundingClientRect().toJSON() : null;
    return { brand: r(brand), span: r(span), display: brand ? getComputedStyle(brand).display : null, text: span?.textContent };
  });
  console.log(width, JSON.stringify(data));
  await page.close();
}
await browser.close();
