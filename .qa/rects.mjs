import { chromium } from 'playwright-core';
const browser = await chromium.launch({ executablePath: '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome', headless: true });
const page = await browser.newPage({ viewport: { width: 390, height: 844 } });
await page.goto('http://localhost:8082/register', { waitUntil: 'networkidle' });
const data = await page.evaluate(() => {
  const pick = s => { const e = document.querySelector(s); if (!e) return null; const r=e.getBoundingClientRect(); return {top:r.top,bottom:r.bottom,left:r.left,height:r.height, paddingTop:getComputedStyle(e).paddingTop}; };
  return { header: pick('header'), banner: pick('.register-frontdoor'), inner: pick('.register-frontdoor__inner'), brand: pick('.register-frontdoor__brand'), logo: pick('.register-frontdoor__brand img'), copy: pick('.register-frontdoor__copy') };
});
console.log(JSON.stringify(data,null,2));
await browser.close();
