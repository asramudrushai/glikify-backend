/*
 * Glikify chat widget.
 * Add to any website with one line:
 *   <script src="https://replify-backend.onrender.com/widget/widget.js" data-business-id="10" data-name="BHG Assistant" data-color="#5B3BFF" defer></script>
 * Optional: data-greeting="Hi! How can I help?"  data-open="true" (opens on load)
 */
(function () {
  var script = document.currentScript;
  if (!script || window.__glikifyWidget) return;
  window.__glikifyWidget = true;

  var API = new URL(script.src).origin;
  var BIZ = parseInt(script.getAttribute('data-business-id'), 10) || 1;
  var NAME = script.getAttribute('data-name') || 'Assistant';
  var COLOR = script.getAttribute('data-color') || '#5B3BFF';
  var GREETING = script.getAttribute('data-greeting') || ('Hi, I\'m ' + NAME.replace(/ Assistant$/, '') + '! Ask me anything and I\'ll do my best to help.');
  var OPEN = script.getAttribute('data-open') === 'true';
  var session = null;

  var host = document.createElement('div');
  host.setAttribute('aria-live', 'polite');
  document.body.appendChild(host);
  var root = host.attachShadow ? host.attachShadow({ mode: 'open' }) : host;

  root.innerHTML =
    '<style>' +
    ':host{all:initial}' +
    '*{box-sizing:border-box;font-family:-apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,Helvetica,Arial,sans-serif}' +
    '[hidden]{display:none!important}' +
    '.fab{position:fixed;right:20px;bottom:20px;z-index:2147483000;width:60px;height:60px;border-radius:50%;border:0;background:' + COLOR + ';color:#fff;cursor:pointer;box-shadow:0 8px 24px rgba(0,0,0,.25);display:grid;place-items:center}' +
    '.fab:hover{transform:scale(1.06)}.fab:focus-visible{outline:3px solid #fff;outline-offset:2px}' +
    '.fab svg{width:28px;height:28px;fill:#fff}' +
    '.win{position:fixed;right:20px;bottom:92px;z-index:2147483000;width:min(370px,calc(100vw - 24px));height:min(540px,calc(100vh - 120px));background:#fff;color:#111;border-radius:16px;box-shadow:0 16px 48px rgba(0,0,0,.25);display:flex;flex-direction:column;overflow:hidden}' +
    '.head{background:' + COLOR + ';color:#fff;padding:14px 16px;display:flex;align-items:center;gap:10px}' +
    '.head b{display:block;font-size:15px}.head small{font-size:12px;opacity:.9}' +
    '.x{margin-left:auto;background:none;border:0;color:#fff;font-size:24px;line-height:1;cursor:pointer;padding:2px 6px}' +
    '.log{flex:1;overflow-y:auto;padding:14px;display:flex;flex-direction:column;gap:8px;background:#f6f7fb}' +
    '.m{max-width:85%;padding:9px 12px;border-radius:14px;font-size:14px;line-height:1.45;white-space:pre-wrap;word-wrap:break-word}' +
    '.bot{background:#fff;border:1px solid #e5e7eb;align-self:flex-start;border-bottom-left-radius:4px}' +
    '.you{background:' + COLOR + ';color:#fff;align-self:flex-end;border-bottom-right-radius:4px}' +
    '.ask{display:flex;gap:8px;padding:10px;border-top:1px solid #e5e7eb}' +
    'input{flex:1;min-width:0;font-size:14px;padding:10px 12px;border:1px solid #d1d5db;border-radius:10px;color:#111;background:#fff}' +
    'input:focus{outline:2px solid ' + COLOR + ';outline-offset:0;border-color:transparent}' +
    '.btn{background:' + COLOR + ';color:#fff;border:0;border-radius:10px;padding:10px 14px;font-size:14px;font-weight:600;cursor:pointer}' +
    '.lead{display:flex;flex-direction:column;gap:8px;padding:12px;border-top:1px solid #e5e7eb}' +
    '.lead b{font-size:14px}.later{background:none;border:0;color:#6b7280;font-size:12px;text-decoration:underline;cursor:pointer}' +
    '.pw{text-align:center;font-size:11px;color:#9ca3af;padding:0 0 8px}.pw a{color:inherit}' +
    '@media (max-width:480px){.win{right:12px;bottom:86px}.fab{right:14px;bottom:14px}}' +
    '</style>' +
    '<button class="fab" type="button" aria-label="Chat with ' + esc(NAME) + '" aria-expanded="false"><svg viewBox="0 0 24 24"><path d="M4 4h16a2 2 0 0 1 2 2v10a2 2 0 0 1-2 2H9l-5 4v-4H4a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2z"/></svg></button>' +
    '<div class="win" role="dialog" aria-label="Chat with ' + esc(NAME) + '" hidden>' +
    '<div class="head"><div><b>' + esc(NAME) + '</b><small>Typically replies instantly</small></div><button class="x" type="button" aria-label="Close chat">&times;</button></div>' +
    '<div class="log"></div>' +
    '<form class="ask"><input type="text" placeholder="Type your question..." aria-label="Your question" maxlength="300" autocomplete="off"><button class="btn" type="submit">Send</button></form>' +
    '<form class="lead" hidden><b>Leave your details and we\'ll be in touch</b><input class="ln" type="text" placeholder="Your name (optional)" maxlength="100" autocomplete="name"><input class="le" type="email" placeholder="Your email *" required maxlength="150" autocomplete="email"><button class="btn" type="submit">Send details</button><button class="later" type="button">Maybe later, keep chatting</button></form>' +
    '<div class="pw">Powered by <a href="https://glikify.com" target="_blank" rel="noopener">Glikify</a></div>' +
    '</div>';

  function esc(t) { return String(t).replace(/[&<>"']/g, function (c) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]; }); }
  function $(s) { return root.querySelector(s); }
  var fab = $('.fab'), win = $('.win'), log = $('.log'), ask = $('.ask'), input = $('.ask input'), lead = $('.lead');

  function add(cls, text) { var d = document.createElement('div'); d.className = 'm ' + cls; d.textContent = text; log.appendChild(d); log.scrollTop = log.scrollHeight; return d; }
  function startSession() {
    if (session !== null) return; session = 0;
    fetch(API + '/api/chat/session', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ businessId: BIZ }) })
      .then(function (r) { return r.json(); }).then(function (d) { session = d.sessionId || 0; }).catch(function () {});
  }
  function toggle(open) {
    win.hidden = !open; fab.setAttribute('aria-expanded', open);
    if (open) { if (!log.children.length) add('bot', GREETING); startSession(); input.focus(); }
  }
  fab.addEventListener('click', function () { toggle(win.hidden); });
  $('.x').addEventListener('click', function () { toggle(false); fab.focus(); });

  ask.addEventListener('submit', function (e) {
    e.preventDefault();
    var q = input.value.trim(); if (!q) return; input.value = '';
    add('you', q); var t = add('bot', '...');
    fetch(API + '/api/chat/' + BIZ + '/answer?question=' + encodeURIComponent(q))
      .then(function (r) { return r.json(); })
      .then(function (d) {
        var a = d.answer || "Sorry, I didn't catch that. Could you ask another way?";
        t.textContent = a;
        var low = a.toLowerCase();
        if (low.indexOf('leave your details') > -1 || low.indexOf('leave your name and email') > -1) { lead.hidden = false; ask.hidden = true; $('.le').focus(); }
      })
      .catch(function () { t.textContent = "Sorry, I'm having trouble connecting. Please try again in a moment."; });
  });
  $('.later').addEventListener('click', function () { lead.hidden = true; ask.hidden = false; input.focus(); });
  lead.addEventListener('submit', function (e) {
    e.preventDefault();
    var name = $('.ln').value.trim(), email = $('.le').value.trim();
    fetch(API + '/api/leads', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ businessId: BIZ, name: name, email: email, sessionId: session || null }) })
      .then(function (r) { if (!r.ok) throw 0; lead.reset(); lead.hidden = true; ask.hidden = false; add('bot', 'Thank you' + (name ? ', ' + name : '') + "! We'll be in touch soon."); })
      .catch(function () { add('bot', "Sorry, that didn't send. Please try again."); });
  });
  if (OPEN) toggle(true);
})();
