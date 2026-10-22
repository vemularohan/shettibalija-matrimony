import { chromium } from 'playwright-core';
const browser = await chromium.launch({ executablePath: '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome', headless: true });
const page = await browser.newPage({ viewport: { width: 390, height: 844 } });
await page.goto('http://localhost:8082/', { waitUntil: 'networkidle' });
const data = await page.evaluate(() => {
  const pick = s => { const e = document.querySelector(s); if (!e) return null; const r=e.getBoundingClientRect(); const cs=getComputedStyle(e); return {top:r.top,bottom:r.bottom,left:r.left,height:r.height,padding:cs.padding,position:cs.position}; };
  return { header: pick('header'), hero: pick('.front-door__hero'), content: pick('.front-door__content'), eyebrow: pick('.front-door__eyebrow'), copy: pick('.front-door__copy'), overline: pick('.front-door__overline') };
});
console.log(JSON.stringify(data,null,2));
await browser.close();
