import { chromium } from 'playwright-core';
const chrome = '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome';
const browser = await chromium.launch({ executablePath: chrome, headless: true });
const page = await browser.newPage({ viewport: { width: 1440, height: 900 } });
await page.goto(process.argv[2] || 'http://localhost:8082/membership', { waitUntil: 'networkidle' });
const data = await page.evaluate(() => {
  const root = document.querySelector('.sbm-page');
  const header = document.querySelector('header');
  return {
    scrollY: window.scrollY,
    body: getComputedStyle(document.body).paddingTop,
    root: root ? { rect: root.getBoundingClientRect().toJSON(), paddingTop: getComputedStyle(root).paddingTop, bg: getComputedStyle(root).backgroundColor } : null,
    firstHeader: header ? { rect: header.getBoundingClientRect().toJSON(), pos: getComputedStyle(header).position } : null,
    pageHeight: document.documentElement.scrollHeight,
  };
});
console.log(JSON.stringify(data, null, 2));
await browser.close();
