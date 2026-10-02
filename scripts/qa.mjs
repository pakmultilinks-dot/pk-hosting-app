import puppeteer from 'puppeteer';
import fs from 'node:fs';
import path from 'node:path';
import http from 'node:http';

const DIST = path.resolve('dist');
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
await page.setViewport({ width: 390, height: 844 });
page.on('pageerror', (e) => console.log('PAGE ERROR:', String(e).slice(0, 200)));

const wait = (ms) => new Promise((r) => setTimeout(r, ms));
let pass = 0, fail = 0;
function check(name, cond, extra = '') {
  if (cond) { pass++; console.log('PASS:', name); }
  else { fail++; console.log('FAIL:', name, String(extra).slice(0, 200)); }
}
async function bodyText() { return page.evaluate(() => document.body.innerText); }
async function has(str, ms = 1500) {
  try { await page.waitForFunction((s) => document.body.innerText.includes(s), { timeout: ms }, str); return true; }
  catch { return false; }
}
async function expect(name, str, ms = 4000) { check(name, await has(str, ms), (await bodyText()).slice(0, 200)); }

// Tab bar click by label: find the actual tab button coords (fixed at bottom)
async function tabGo(label) {
  const ok = await page.evaluate(async (t) => {
    const els = [...document.querySelectorAll('div,span')].filter((e) => {
      if (e.offsetParent === null) return false;
      if (e.textContent.trim() !== t) return false;
      const r = e.getBoundingClientRect();
      return r.top > window.innerHeight - 140; // bottom tab bar only
    });
    if (!els.length) return false;
    const el = els[0];
    const r = el.getBoundingClientRect();
    const x = Math.round(r.left + r.width / 2), y = Math.round(r.top + r.height / 2);
    window.scrollTo(0, document.body.scrollHeight);
    return { x, y };
  }, label);
  if (!ok) { console.log('TAB MISS:', label); return false; }
  await wait(200);
  await page.mouse.click(ok.x, ok.y);
  await wait(700);
  return true;
}
async function tapText(text, exact = true) {
  const box = await page.evaluate((t, ex) => {
    const els = [...document.querySelectorAll('div,span,a,button')].filter((e) => {
      if (e.offsetParent === null) return false;
      const s = e.textContent.trim();
      return ex ? s === t : s.startsWith(t);
    });
    if (!els.length) return null;
    // RN Web keeps inactive tab screens mounted and overlapping in layout space.
    // Only a candidate that is actually hittable (topmost at its own center, the
    // way a real user's finger works) is usable.
    const depth = (e) => { let d = 0, n = e; while (n.parentElement) { d++; n = n.parentElement; } return d; };
    els.sort((a, b) => depth(b) - depth(a));
    for (const el of els) {
      el.scrollIntoView({ block: 'center', inline: 'center' });
      const r = el.getBoundingClientRect();
      if (r.top < 100 || r.top >= window.innerHeight || r.left < 0 || r.left >= window.innerWidth) continue;
      const x = Math.round(r.left + r.width / 2), y = Math.round(r.top + r.height / 2);
      const top = document.elementFromPoint(x, y);
      if (top && (top === el || el.contains(top) || top.contains(el))) return { x, y };
    }
    return { missed: true };
  }, text, exact);
  if (!box) { console.log('TAP MISS:', text); return false; }
  if (box.missed) { console.log('TAP UNDER HEADER:', text); return false; }
  await wait(300);
  await page.mouse.click(box.x, box.y);
  await wait(600);
  return true;
}
async function visibleInput(sel) {
  const handles = await page.$$(sel);
  for (const h of handles) { const box = await h.boundingBox(); if (box && box.width > 0 && box.height > 0) return h; }
  return null;
}
async function typeInto(sel, text) { const el = await visibleInput(sel); if (!el) { console.log('INPUT MISSING:', sel); return false; } await el.click(); await el.type(text); return true; }
async function setInput(sel, text) { const el = await visibleInput(sel); if (!el) { console.log('INPUT MISSING:', sel); return false; } await el.click({ clickCount: 3 }); await page.keyboard.type(text); return true; }
async function checkUrl(name, frag) {
  let ok = false;
  try {
    await page.waitForFunction((f) => window.location.href.includes(f), { timeout: 3000 }, frag);
    ok = true;
  } catch { ok = false; }
  check(name, ok, page.url());
}

// ---------- A. Tabs ----------
await page.goto(BASE + '/', { waitUntil: 'networkidle0' }); await wait(1400);
await expect('Home loads', 'Quality-crafted web hosting');
await tabGo('Plans'); await checkUrl('Plans tab route', '/plans');
await expect('Plans screen', 'Monthly billing');
await tabGo('Domains'); await checkUrl('Domains tab route', '/domains');
await expect('Domains screen', 'Popular extensions');
await tabGo('Cart'); await checkUrl('Cart tab route', '/cart');
await expect('Cart empty state', 'Your cart is empty');
await tabGo('Account'); await checkUrl('Account tab route', '/account');
await expect('Account screen', 'Demo Customer');
await tabGo('Home'); await checkUrl('Home tab route', '/');
await expect('Home again', 'Quality-crafted web hosting');

// ---------- B. Quick actions ----------
await tapText('Hosting'); await checkUrl('Quick Hosting -> Plans', '/plans'); await expect('Quick Hosting lands Plans', 'Monthly billing');
await tabGo('Home');
await tapText('Domains'); await checkUrl('Quick Domains -> Domains', '/domains');
await tabGo('Home');
await tapText('VPS'); await checkUrl('Quick VPS -> Plans', '/plans');
await tabGo('Home');
await tapText('Support'); await checkUrl('Quick Support -> Account', '/account');
await tabGo('Home');

// ---------- C. Plan categories & prices ----------
await tabGo('Plans');
await tapText('WordPress'); await expect('WP list', 'WP Starter'); check('WP Starter Rs 999', (await bodyText()).includes('Rs 999'));
await tapText('Reseller'); await expect('Reseller list', 'Reseller R1'); check('Reseller R1 Rs 1,499', (await bodyText()).includes('Rs 1,499'));
await tapText('VPS'); await expect('VPS list', 'Cloud VPS Starter');
await page.evaluate(() => { const cb = document.querySelector('input[type="checkbox"]'); if (cb && !cb.checked) cb.click(); });
await expect('VPS annual 11x -> Rs 38,489', 'Rs 38,489');
await page.evaluate(() => { const cb = document.querySelector('input[type="checkbox"]'); if (cb && cb.checked) cb.click(); }); await wait(400);
await tapText('Dedicated'); await expect('Dedicated list', 'Dedicated Entry (Germany)');

// ---------- D. Plan detail + add ----------
await tapText('WordPress'); await expect('WP back', 'WP Starter');
await tapText('Details >'); await expect('Detail opens', 'What is included');
check('Detail is WP Starter', (await bodyText()).includes('WP Starter'));
await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight)); await wait(300);
await tapText('Add to Cart', false);
check('Toast add from detail', await has('WP Starter added to cart', 2500), (await bodyText()).slice(-200));
await page.goBack(); await wait(900);
await tapText('Shared'); await expect('Shared list', 'Personal Hosting');
await tapText('Add to Cart');
check('Toast add from list', await has('Personal Hosting added to cart', 2500), (await bodyText()).slice(-200));

// ---------- E. Domains ----------
await tabGo('Domains'); await checkUrl('Domains route', '/domains');
await typeInto('input[placeholder*="Enter a name"]', 'google');
await page.keyboard.press('Enter');
await expect('google results', 'google.com', 3000);
check('google.com TAKEN', (await bodyText()).includes('TAKEN'));
await setInput('input[placeholder*="Enter a name"]', 'myuniqueapp');
await page.keyboard.press('Enter');
await expect('myuniqueapp results', 'myuniqueapp.com', 3000);
await tapText('Add to Cart');
check('Domain added toast', await has('added to cart', 2500), (await bodyText()).slice(-200));
check('Button flips to In Cart', await has('In Cart', 2000));
await tapText('.pk');
check('TLD chip .pk reorder', await has('myuniqueapp.pk', 1500));

// ---------- F. Cart ----------
await tabGo('Cart'); await checkUrl('Cart route', '/cart');
await expect('3 items', '3 items in cart');
await typeInto('input[placeholder*="WELCOME10"]', 'WRONGCODE');
await tapText('Apply');
await expect('Invalid promo', 'not valid', 3000);
await setInput('input[placeholder*="WELCOME10"]', 'WELCOME10');
await tapText('Apply');
await expect('Promo discount line', 'WELCOME10 discount', 3000);
check('Discount - Rs 70', (await bodyText()).includes('- Rs 70'), (await bodyText()).slice(0, 300));
await tapText('Remove'); // removes oldest = WP Starter
await expect('2 items after remove', '2 items in cart', 3000);
check('Discount still - Rs 70', (await bodyText()).includes('- Rs 70'));

// ---------- G. Checkout validation ----------
await tapText('Proceed to Checkout');
await tapText('Place Order', false);
await expect('Name required', 'full name', 3000);
await typeInto('input[placeholder*="Full name"]', 'Abdur Rehman');
await typeInto('input[placeholder*="Email for invoice"]', 'not-an-email');
await typeInto('input[placeholder*="Phone"]', '03146365550');
await tapText('Place Order', false);
await expect('Email invalid', 'valid email', 3000);
await setInput('input[placeholder*="Email for invoice"]', 'test@example.com');
await setInput('input[placeholder*="Phone"]', '123');
await tapText('Place Order', false);
await expect('Phone invalid', 'valid phone', 3000);
await setInput('input[placeholder*="Phone"]', '03146365550');
await tapText('Place Order', false);
await expect('Order confirmed', 'Order confirmed', 6000);
check('Order id', (await bodyText()).includes('PKH-'));

// ---------- H. Services + orders ----------
await tapText('View My Services');
await expect('Processing service', 'PROCESSING');
await expect('Recent orders', 'Recent orders');

// ---------- I. New ticket + reply ----------
await page.evaluate(() => window.scrollBy(0, 1600));
await tapText('Open a New Ticket');
await expect('New ticket form', 'Department');
await tapText('Open Ticket');
await expect('Subject error', 'subject', 3000);
await typeInto('input[placeholder*="My website is down"]', 'Site error 500');
await setInput('textarea, input[placeholder*="Describe what"]', 'short');
await tapText('Open Ticket');
await expect('Message error', 'more detail', 3000);
await setInput('textarea, input[placeholder*="Describe what"]', 'My site shows a 500 error since this morning, please check the server logs.');
await tapText('Open Ticket');
await expect('Ticket thread opens', 'Site error 500', 5000);
const replyOk = await setInput('textarea, input[placeholder*="your reply"]', 'Any update on this please?');
check('Reply box found', replyOk);
await tapText('Send Reply');
check('Reply appears', await has('Any update on this please?', 3000), (await bodyText()).slice(0, 200));
await page.goBack(); await wait(900);
check('Ticket in Account list', (await bodyText()).includes('Site error 500'), (await bodyText()).slice(0, 220));

// ---------- J. Empty cart + About ----------
await tabGo('Cart');
await expect('Cart empty after order', 'Your cart is empty');
await tapText('Browse Plans');
await expect('Browse Plans', 'Monthly billing');
await tabGo('Account');
await page.evaluate(() => window.scrollBy(0, 2200));
await tapText('About PK Hosting >');
await expect('About legal name', 'TechAbout (Private) Limited');
check('About phone', (await bodyText()).includes('(042) 3569 2952'));

console.log(`\nQA RESULT: ${pass} passed, ${fail} failed`);
await browser.close();
server.close();
process.exit(fail > 0 ? 1 : 0);
