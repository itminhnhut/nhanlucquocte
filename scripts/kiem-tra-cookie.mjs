// E2E: thông báo đồng ý cookie. Chưa bấm gì thì KHÔNG script đo lường nào được tải;
// bấm Đồng ý mới tải; trang tra cứu văn bằng không bao giờ quay lại phiên.
// Cần Chrome mở sẵn cổng 9222 và dev server ở 3344. Chạy: node scripts/kiem-tra-cookie.mjs
const base = 'http://127.0.0.1:9222';
const SITE = 'http://127.0.0.1:3344';
const t = await (await fetch(`${base}/json/new?about:blank`, { method: 'PUT' })).json();
const closeTab = async () => { try { await fetch(`${base}/json/close/${t.id}`); } catch {} };
const ws = new WebSocket(t.webSocketDebuggerUrl);
let id = 0; const pending = new Map(); const handlers = [];
ws.addEventListener('message', (e) => { const m = JSON.parse(e.data); if (m.id && pending.has(m.id)) { pending.get(m.id)(m); pending.delete(m.id); } else if (m.method) handlers.forEach((h) => h(m)); });
await new Promise((r) => ws.addEventListener('open', r));
const send = (m, p = {}) => new Promise((res) => { const n = ++id; pending.set(n, res); ws.send(JSON.stringify({ id: n, method: m, params: p })); });
const js = (e) => send('Runtime.evaluate', { expression: e, returnByValue: true, awaitPromise: true }).then((r) => r.result?.result?.value ?? r.result?.exceptionDetails?.text);
const wait = (ms) => new Promise((r) => setTimeout(r, ms));
let pass = 0, fail = 0;
const check = (name, ok, detail = '') => { (ok ? pass++ : fail++); console.log(`  ${ok ? 'ĐẠT ' : 'HỎNG'} ${name.padEnd(52)} ${detail}`); };

// Ghi lại MỌI request ra ngoài để biết chắc có gọi Google/Microsoft hay không
const requested = [];
await send('Network.enable');
handlers.push((m) => { if (m.method === 'Network.requestWillBeSent') requested.push(m.params.request.url); });
await send('Page.enable'); await send('Runtime.enable');

const trackerHits = () => requested.filter((u) => /googletagmanager\.com|google-analytics\.com|clarity\.ms/.test(u));

// Dọn sạch trạng thái: hồ sơ Chrome giữ localStorage giữa các lần chạy, không dọn thì
// lần chạy sau vào thẳng trạng thái "đã đồng ý" và mọi phép thử Lô 1 đều sai.
const reset = async () => {
  await send('Page.navigate', { url: SITE });
  await wait(1500);
  await js("try{localStorage.clear();sessionStorage.clear()}catch{}");
  await send('Network.clearBrowserCookies');
  await send('Network.clearBrowserCache');
};
await reset();

console.log('\nLô 1 — chưa chọn gì');
await send('Page.navigate', { url: SITE });
await wait(2500);
requested.length = 0;
await wait(1200);
await js("window.scrollBy(0,400)"); await wait(1500);
check('không tải script đo lường nào', trackerHits().length === 0, trackerHits().join(' ') || 'sạch');
check('window.gtag chưa phải hàm', (await js('typeof window.gtag')) !== 'function');
check('banner hiện ra', (await js(`!!document.querySelector('[aria-labelledby="cookie-title"]')`)) === true);
check('có nút Đồng ý và Từ chối',
  (await js(`[...document.querySelectorAll('[aria-labelledby="cookie-title"] button')].map(b=>b.textContent.trim()).join('|')`)) === 'Từ chối|Đồng ý');

console.log('\nLô 2 — bấm Từ chối');
await js(`[...document.querySelectorAll('[aria-labelledby="cookie-title"] button')].find(b=>b.textContent.trim()==='Từ chối').click()`);
await wait(1200);
check('vẫn không tải script đo lường', trackerHits().length === 0, trackerHits().join(' ') || 'sạch');
check('banner đã đóng', (await js(`!!document.querySelector('[aria-labelledby="cookie-title"]')`)) === false);
check('lựa chọn được lưu lại', /denied/.test(await js(`localStorage.getItem('nlqt-consent')`) || ''));
await send('Page.navigate', { url: `${SITE}/tuyen-sinh` }); await wait(2200);
check('tải lại trang vẫn không hỏi lại, không đo', trackerHits().length === 0 && (await js(`!!document.querySelector('[aria-labelledby="cookie-title"]')`)) === false);

console.log('\nLô 3 — mở lại từ chân trang rồi bấm Đồng ý');
await js(`document.querySelector('footer button')?.click()`);
await wait(600);
check('nút "Cài đặt cookie" mở lại được banner', (await js(`!!document.querySelector('[aria-labelledby="cookie-title"]')`)) === true);
await js(`[...document.querySelectorAll('[aria-labelledby="cookie-title"] button')].find(b=>b.textContent.trim()==='Đồng ý').click()`);
await wait(2500);
check('đã tải Google Analytics', trackerHits().some((u) => /googletagmanager\.com/.test(u)), '');
check('đã tải Microsoft Clarity', trackerHits().some((u) => /clarity\.ms/.test(u)), '');
check('window.gtag đã là hàm', (await js('typeof window.gtag')) === 'function');

console.log('\nLô 4 — trang tra cứu văn bằng không được quay lại phiên');
await reset();
await send('Page.navigate', { url: `${SITE}/tra-cuu-van-bang` });
await wait(2500);
requested.length = 0;
await js(`[...document.querySelectorAll('[aria-labelledby="cookie-title"] button')].find(b=>b.textContent.trim()==='Đồng ý')?.click()`);
await wait(2500);
check('vào thẳng trang tra cứu rồi đồng ý: KHÔNG tải Clarity',
  !trackerHits().some((u) => /clarity\.ms/.test(u)), trackerHits().filter((u)=>/clarity/.test(u)).join(' ') || 'sạch');
check('nhưng vẫn tải Google Analytics', trackerHits().some((u) => /googletagmanager\.com/.test(u)));

const errs = await js('JSON.stringify(window.__errs||[])');
console.log(`\nChạy ${pass + fail} mục — ĐẠT ${pass}, HỎNG ${fail}`);
if (errs && errs !== '[]') console.log('Lỗi console:', errs);
await closeTab(); ws.close();
process.exit(fail ? 1 : 0);
