import puppeteer from 'puppeteer';
import fs from 'node:fs';
import path from 'node:path';
import http from 'node:http';

const DIST = path.resolve('dist');
const OUT = path.resolve('screenshots-qa2');
fs.mkdirSync(OUT, { recursive: true });
const MIME = { '.html': 'text/html', '.js': 'text/javascript', '.css': 'text/css', '.png': 'image/png', '.jpg': 'image/jpeg', '.json': 'application/json', '.ico': 'image/x-icon', '.svg': 'image/svg+xml', '.txt': 'text/plain', '.woff': 'font/woff', '.woff2': 'font/woff2', '.ttf': 'font/ttf' };
const server = http.createServer((req, res) => {
  let p = decodeURIComponent(new URL(req.url, 'http://x').pathname);
  let file = path.join(DIST, p);
  if (!fs.existsSync(file) || fs.statSync(file).isDirectory()) {
    const alt = file + '.html';
    file = fs.existsSync(alt) ? alt : path.join(DIST, 'index.html');
  }
  res.setHeader('Content-Type', MIME[path.extname(file)] || 'application/octet-stream');
  fs.createReadStream(file).pipe(res);
});
await new Promise((r) => server.listen(0, r));
const BASE = `http://127.0.0.1:${server.address().port}`;

const browser = await puppeteer.launch({ headless: 'new', args: ['--no-sandbox'] });
const page = await browser.newPage();
await page.setViewport({ width: 390, height: 844, deviceScaleFactor: 2, isMobile: true, hasTouch: true });
const wait = (ms) => new Promise((r) => setTimeout(r, ms));
async function shot(name) { await wait(800); await page.screenshot({ path: path.join(OUT, name + '.png') }); console.log('shot', name, page.url()); }
// Click the text by finding the element, scrolling it into view in ITS scroller, then
// clicking the element at the topmost point under its center via elementFromPoint retry.
async function clickText(text, exact = true) {
  for (let attempt = 0; attempt < 3; attempt++) {
    const done = await page.evaluate((t, ex) => {
      const els = [...document.querySelectorAll('div,span')].filter((e) => {
        if (e.offsetParent === null) return false;
        const s = e.textContent.trim();
        return ex ? s === t : s.startsWith(t);
      });
      if (!els.length) return 'none';
      els.sort((a, b) => a.textContent.length - b.textContent.length);
      const el = els[0];
      el.scrollIntoView({ block: 'center', inline: 'center' });
      const r = el.getBoundingClientRect();
      const x = r.left + r.width / 2, y = r.top + r.height / 2;
      const topEl = document.elementFromPoint(x, y);
      if (topEl && (topEl === el || el.contains(topEl) || topEl.contains(el))) {
        el.click();
        return 'clicked';
      }
      // tap the topmost element at that point (closest clickable ancestor handles it via bubbling)
      const tgt = topEl;
      if (tgt) { tgt.click(); return 'topped'; }
      el.click();
      return 'clicked';
    }, text, exact);
    if (done !== 'none') { await wait(700); return done; }
    await wait(500);
  }
  console.log('CLICK MISS:', text);
  return 'miss';
}

await page.goto(BASE + '/plans', { waitUntil: 'networkidle0' });
await wait(1500);
await clickText('WordPress'); await shot('qa-cat-wordpress');
await clickText('Reseller'); await shot('qa-cat-reseller');
await clickText('VPS');
await page.evaluate(() => { const cb = document.querySelector('input[type="checkbox"]'); if (cb && !cb.checked) cb.click(); });
await shot('qa-cat-vps-annual');
// open a VPS detail
await page.evaluate(() => window.scrollTo(0, 0)); await wait(400);
await clickText('Details >'); await wait(700); await shot('qa-vps-detail');
await page.goBack(); await wait(900);
await clickText('Dedicated'); await shot('qa-cat-dedicated');
await page.evaluate(() => window.scrollTo(0, 0)); await wait(400);
await clickText('Details >'); await wait(700); await shot('qa-dedicated-detail');
await page.goBack(); await wait(900);

// cart: add plan, invalid promo, remove item
await clickText('Shared');
await clickText('Add to Cart'); await wait(400); // Personal Hosting
// click the tab-bar Cart via bottom of viewport
await page.evaluate(() => {
  const els = [...document.querySelectorAll('div,span')].filter((e) => e.offsetParent !== null && e.textContent.trim() === 'Cart' && e.getBoundingClientRect().top > window.innerHeight - 140);
  if (els[0]) els[0].scrollIntoView({ block: 'center' });
});
await wait(300);
const tb = await page.evaluate(() => {
  const els = [...document.querySelectorAll('div,span')].filter((e) => e.offsetParent !== null && e.textContent.trim() === 'Cart' && e.getBoundingClientRect().top > window.innerHeight - 140);
  const r = els[0].getBoundingClientRect();
  return { x: r.left + r.width / 2, y: r.top + r.height / 2 };
});
await page.mouse.click(tb.x, tb.y); await wait(800);
await page.evaluate(() => window.scrollBy(0, 500));
await shot('qa-cart-1item');
const pi = await page.evaluate(() => {
  const i = [...document.querySelectorAll('input')].find((x) => x.placeholder && x.placeholder.includes('WELCOME10'));
  const r = i.getBoundingClientRect(); return { x: r.left + r.width / 2, y: r.top + r.height / 2 };
});
await page.mouse.click(pi.x, pi.y); await wait(300);
await page.keyboard.type('WRONGCODE');
await clickText('Apply'); await shot('qa-cart-invalid-promo');
await page.evaluate(() => { const i = [...document.querySelectorAll('input')].find((x) => x.placeholder && x.placeholder.includes('WELCOME10')); i.focus(); i.select(); });
await page.keyboard.type('WELCOME10');
await clickText('Apply'); await shot('qa-cart-valid-promo');
await clickText('Remove'); await shot('qa-cart-after-remove');

console.log('done');
await browser.close();
server.close();
