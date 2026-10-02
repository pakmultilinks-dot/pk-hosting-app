import puppeteer from 'puppeteer';
import fs from 'node:fs';
import path from 'node:path';
import http from 'node:http';

const DIST = path.resolve('dist');
const OUT = path.resolve('screenshots');
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
page.on('pageerror', (e) => console.log('PAGE ERROR:', String(e).slice(0, 200)));

const wait = (ms) => new Promise((r) => setTimeout(r, ms));

async function shot(name, ms = 900) {
  await wait(ms);
  await page.screenshot({ path: path.join(OUT, name + '.png') });
  console.log('shot', name);
}

// Click the deepest visible element whose own text exactly matches, then bubbles
// up to the nearest pressable ancestor and clicks that (React Native Web handlers).
async function tapText(text) {
  const ok = await page.evaluate((t) => {
    const els = [...document.querySelectorAll('div,span,a,button')].filter(
      (e) => e.offsetParent !== null && e.textContent.trim() === t
    );
    if (!els.length) return false;
    let el = els[els.length - 1];
    // walk up to clickable ancestor
    let target = el;
    while (target && target !== document.body) {
      if (target.onclick || target.getAttribute('role') === 'button' || target.tagName === 'A') break;
      target = target.parentElement;
    }
    (target || el).click();
    return true;
  }, text);
  if (!ok) console.log('TAP MISS:', text);
  await wait(700);
  return ok;
}

async function tapStartsWith(prefix) {
  const ok = await page.evaluate((t) => {
    const els = [...document.querySelectorAll('div,span,a,button')].filter(
      (e) => e.offsetParent !== null && e.textContent.trim().startsWith(t)
    );
    if (!els.length) return false;
    let el = els[els.length - 1];
    let target = el;
    while (target && target !== document.body) {
      if (target.onclick || target.getAttribute('role') === 'button' || target.tagName === 'A') break;
      target = target.parentElement;
    }
    (target || el).click();
    return true;
  }, prefix);
  if (!ok) console.log('TAP MISS startsWith:', prefix);
  await wait(700);
  return ok;
}

async function goto(route) {
  await page.goto(BASE + route, { waitUntil: 'networkidle0', timeout: 60000 });
  await wait(1200);
}

// ---------- Home ----------
await goto('/');
await shot('01-home');
// scroll home to show popular plans fully
await page.evaluate(() => window.scrollBy(0, 650));
await shot('01b-home-scrolled');
await page.evaluate(() => window.scrollTo(0, 0));

// ---------- Plans ----------
await tapText('Plans');
await shot('02-plans-monthly');
// annual toggle: RN Web Switch renders a checkbox input
await page.evaluate(() => {
  const cb = document.querySelector('input[type="checkbox"]');
  if (cb) cb.click();
});
await shot('03-plans-annual');
// open details of the FIRST (topmost) plan card on screen
await page.evaluate(() => window.scrollTo(0, 0));
await page.evaluate(() => {
  const btns = [...document.querySelectorAll('div,span')].filter(
    (e) => e.offsetParent !== null && e.textContent.trim() === 'Details >'
  );
  if (!btns.length) { console.log('NO DETAILS BTN'); return; }
  const rects = btns.map((b) => ({ b, top: b.getBoundingClientRect().top }));
  rects.sort((a, z) => a.top - z.top);
  rects[0].b.click();
});
await shot('04-plan-detail');
await page.evaluate(() => window.scrollBy(0, 600));
await shot('04b-plan-detail-scrolled');
await page.evaluate(() => window.scrollTo(0, 0));
// Add to Cart on the plan DETAIL page (topmost button; plans list may still be mounted behind)
await page.evaluate(() => {
  const btns = [...document.querySelectorAll('div,span')].filter(
    (e) => e.offsetParent !== null && e.textContent.trim().startsWith('Add to Cart')
  );
  if (!btns.length) { console.log('NO ADD BTN'); return; }
  const rects = btns.map((b) => ({ b, top: b.getBoundingClientRect().top })).filter((r) => r.top >= 0);
  rects.sort((a, z) => a.top - z.top);
  const el = (rects[0] || { b: btns[0] }).b;
  let t = el;
  while (t && t !== document.body && !t.onclick) t = t.parentElement;
  (t || el).click();
});
await wait(500);
// back via browser history
await page.goBack();
await wait(900);

// ---------- Domains (in-app tab tap so SPA state persists) ----------
await tapText('Domains');
await wait(500);
await shot('05-domains-list');
const input = await page.$('input[placeholder*="Enter a name"]');
if (!input) { console.log('DOMAIN INPUT MISSING'); } else {
  await input.type('mybusiness');
  await page.keyboard.press('Enter');
}
await shot('06-domains-results');
// add the FIRST available domain result (topmost on screen)
await page.evaluate(() => {
  const btns = [...document.querySelectorAll('div,span')].filter((e) => e.offsetParent !== null && e.textContent.trim() === 'Add to Cart');
  if (!btns.length) { console.log('NO DOMAIN ADD BTN'); return; }
  const rects = btns.map((b) => ({ b, top: b.getBoundingClientRect().top })).filter((r) => r.top >= 0);
  rects.sort((a, z) => a.top - z.top);
  const el = (rects[0] || { b: btns[0] }).b;
  let t = el;
  while (t && t !== document.body && !t.onclick) t = t.parentElement;
  (t || el).click();
});

// ---------- Cart ----------
await tapText('Cart');
await shot('07-cart');
const promoInput = await page.$('input[placeholder*="WELCOME10"]');
if (promoInput) await promoInput.type('WELCOME10');
await tapText('Apply');
await shot('08-cart-promo');

// ---------- Checkout ----------
await tapText('Proceed to Checkout');
await shot('09-checkout');
const nameI = await page.$('input[placeholder*="Full name"]');
if (nameI) await nameI.type('Abdur Rehman');
const emailI = await page.$('input[placeholder*="Email for invoice"]');
if (emailI) await emailI.type('test@example.com');
const phoneI = await page.$('input[placeholder*="Phone"]');
if (phoneI) await phoneI.type('03146365550');
await page.evaluate(() => window.scrollBy(0, 350));
await shot('09b-checkout-filled');
await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight));
await shot('09c-checkout-summary');
// place order, wait for success screen, then shoot it
await tapStartsWith('Place Order');
try {
  await page.waitForFunction(() => document.body.innerText.includes('Order confirmed'), { timeout: 8000 });
} catch {
  console.log('SUCCESS SCREEN NOT REACHED. url:', page.url());
  console.log('BODY:', await page.evaluate(() => document.body.innerText.slice(-600)));
}
await shot('10-order-success');

// ---------- Account ----------
const viewSvc = await page.evaluate(() => {
  const el = [...document.querySelectorAll('div,span')].find((e) => e.offsetParent && e.textContent.trim() === 'View My Services');
  if (el) { el.click(); return true; }
  return false;
});
if (!viewSvc) { console.log('VIEW SVC MISS, going direct'); await goto('/account'); }
await shot('11-account-services');
await page.evaluate(() => window.scrollBy(0, 900));
await shot('11b-account-scrolled');
await page.evaluate(() => window.scrollBy(0, 900));
await shot('11c-account-tickets');
await page.evaluate(() => window.scrollTo(0, 0));

// open ticket (real seed subject)
await tapText('SSL certificate not renewing automatically');
await shot('12-ticket-thread');
await page.evaluate(() => window.scrollBy(0, 500));
await shot('12b-ticket-reply');
await page.goBack();
await wait(900);

// new ticket form (direct route, back-stack state is unreliable on web export)
await goto('/new-ticket');
await shot('13-new-ticket');

// about
await goto('/about');
await shot('14-about');

console.log('done');
await browser.close();
server.close();
