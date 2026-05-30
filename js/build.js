#!/usr/bin/env node
'use strict';

const fs = require('node:fs');
const path = require('node:path');

const OUT = path.join(__dirname, '..', 'pages');

const SIDEBAR = (active) => `
  <nav class="sidebar">
    <div class="sidebar-section"><div class="sidebar-label">Getting Started</div>
      <a class="sidebar-link${active==='home'?' active':''}" href="../index.html">Home</a>
      <a class="sidebar-link${active==='installation'?' active':''}" href="installation.html">Installation</a>
      <a class="sidebar-link${active==='quickstart'?' active':''}" href="quickstart.html">Quick Start</a>
      <a class="sidebar-link${active==='configuration'?' active':''}" href="configuration.html">Configuration</a>
    </div>
    <div class="sidebar-section"><div class="sidebar-label">API</div>
      <a class="sidebar-link${active==='query'?' active':''}" href="query.html">Query Builder</a>
      <a class="sidebar-link${active==='transactions'?' active':''}" href="transactions.html">Transactions</a>
      <a class="sidebar-link${active==='cache'?' active':''}" href="cache.html">Cache System</a>
      <a class="sidebar-link${active==='api'?' active':''}" href="api.html">API Reference <span class="sidebar-badge">full</span></a>
    </div>
    <div class="sidebar-section"><div class="sidebar-label">Advanced</div>
      <a class="sidebar-link${active==='advanced'?' active':''}" href="advanced.html">Advanced Guide</a>
      <a class="sidebar-link${active==='faq'?' active':''}" href="faq.html">FAQ</a>
    </div>
  </nav>
  <div class="sidebar-overlay"></div>`;

const HEADER = `
  <div class="progress-bar"></div>
  <header class="header">
    <button class="header-menu-btn">☰</button>
    <a class="header-logo" href="../index.html"><img class="header-logo-img" src="../logo.png" alt="Qeed logo" /><div><div class="header-logo-name">Qeed</div><div class="header-logo-version">v1.0.0</div></div></a>
    <div class="header-search-wrap"><span class="header-search-icon">⌕</span><input class="header-search" type="search" placeholder="Search docs… (⌘K)" autocomplete="off" /><div class="search-results"></div></div>
    <nav class="header-actions">
      <a class="header-github" href="https://github.com/mr-na3san/qeed" target="_blank" rel="noopener"><svg width="15" height="15" viewBox="0 0 16 16" fill="currentColor"><path d="M8 0C3.58 0 0 3.58 0 8c0 3.54 2.29 6.53 5.47 7.59.4.07.55-.17.55-.38 0-.19-.01-.82-.01-1.49-2.01.37-2.53-.49-2.69-.94-.09-.23-.48-.94-.82-1.13-.28-.15-.68-.52-.01-.53.63-.01 1.08.58 1.23.82.72 1.21 1.87.87 2.33.66.07-.52.28-.87.51-1.07-1.78-.2-3.64-.89-3.64-3.95 0-.87.31-1.59.82-2.15-.08-.2-.36-1.02.08-2.12 0 0 .67-.21 2.2.82.64-.18 1.32-.27 2-.27.68 0 1.36.09 2 .27 1.53-1.04 2.2-.82 2.2-.82.44 1.1.16 1.92.08 2.12.51.56.82 1.27.82 2.15 0 3.07-1.87 3.75-3.65 3.95.29.25.54.73.54 1.48 0 1.07-.01 1.93-.01 2.2 0 .21.15.46.55.38A8.013 8.013 0 0016 8c0-4.42-3.58-8-8-8z"/></svg>GitHub</a>
      <a class="header-npm" href="https://npmjs.com/package/qeed" target="_blank" rel="noopener"><svg width=\"28\" height=\"10\" viewBox=\"0 0 780 250\" fill=\"#cb3837\" xmlns=\"http://www.w3.org/2000/svg\"><path d=\"M240 250V0H0v250h240zm-150-40V90h60v120h-60zM300 0v250h240V90h-60v120h-60V90h-60v160H300zm420 0H480v250h240V0zm-60 210h-60V90h-60v120h-60V40h180v170z\"/></svg>NPM</a>
    </nav>
  </header>`;

function page({ slug, title, active, toc, content, prev, next }) {
  const tocHtml = toc ? `
  <aside class="toc-float">
    <div class="toc-float-label">On this page</div>
    ${toc.map(t=>`<a class="toc-float-link" href="#${t.id}">${t.text}</a>`).join('\n    ')}
  </aside>` : '';

  const navHtml = (prev||next) ? `
    <nav class="page-nav">
      ${prev?`<a class="page-nav-item" href="${prev.href}"><span class="page-nav-dir">← Previous</span><span class="page-nav-title">${prev.title}</span></a>`:'<div></div>'}
      ${next?`<a class="page-nav-item next" href="${next.href}"><span class="page-nav-dir">Next →</span><span class="page-nav-title">${next.title}</span></a>`:''}
    </nav>` : '';

  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8"/><meta name="viewport" content="width=device-width,initial-scale=1.0"/>
  <title>${title} — Qeed Docs</title>
  <link rel="icon" type="image/svg+xml" href="../favicon.svg"/>
  <link rel="stylesheet" href="../css/tokens.css"/>
  <link rel="stylesheet" href="../css/base.css"/>
  <link rel="stylesheet" href="../css/layout.css"/>
  <link rel="stylesheet" href="../css/components.css"/>
</head>
<body>
${HEADER}
<div class="shell">
  ${SIDEBAR(active)}
  <main class="main"><div class="content">
${content}
${navHtml}
  </div></main>
  ${tocHtml}
</div>
<script src="../js/shell.js"></script><script src="../js/app.js"></script>
</body></html>`;
}

// ── Configuration ────────────────────────────────────────
fs.writeFileSync(path.join(OUT, 'configuration.html'), page({
  slug: 'configuration', title: 'Configuration', active: 'configuration',
  toc: [
    {id:'factory',text:'Factory options'},
    {id:'namespace',text:'namespace / collection'},
    {id:'cache-config',text:'Cache options'},
    {id:'metrics-config',text:'Metrics options'},
    {id:'events-config',text:'Events options'},
    {id:'pragmas',text:'SQLite pragmas'},
    {id:'class',text:'Class API'},
  ],
  prev: {href:'quickstart.html',title:'Quick Start'},
  next: {href:'query.html',title:'Query Builder'},
  content: `
    <h1>Configuration</h1>
    <p>All configuration is passed as a plain object to <code>qeed()</code> or <code>new Qeed()</code>. Every field is optional except <code>path</code>.</p>

    <h2 id="factory">Full options reference</h2>
    <div class="code-block"><div class="code-header"><span class="code-lang">js</span><button class="copy-btn">Copy</button></div>
    <pre><code data-lang="js">const db = qeed({
  // Required
  path: './data.db',           // file path or ':memory:'

  // Scope defaults
  namespace:  'default',       // default namespace for this instance
  collection: 'default',       // default collection for this instance

  // TTL sweep
  sweepInterval: 60_000,       // ms between expired-record cleanup runs

  // Cache
  cache: {
    enabled:  false,           // off by default
    mode:     'lru',           // 'simple' | 'lru'
    maxSize:  1000,            // max entries per namespace+collection bucket
  },

  // Metrics
  metrics: {
    slowQueryMs: 100,          // ops slower than this appear in slowQueryLog()
  },

  // Event system
  events: {
    maxListeners: 50,          // per-event listener cap (default 50)
  },

  // SQLite PRAGMAs (override defaults)
  pragmas: {
    cache_size:   -8000,       // 8MB page cache (negative = KiB)
    busy_timeout:  5000,       // ms before SQLITE_BUSY error
    mmap_size:     268435456,  // 256MB memory-mapped I/O
    synchronous:  'NORMAL',    // FULL for max durability
  },

  // Open read-only (writes throw)
  readonly: false,
});</code></pre></div>

    <h2 id="namespace">namespace and collection</h2>
    <p>Setting <code>namespace</code> and <code>collection</code> at construction time creates a pre-scoped instance. All operations on that instance use those values as defaults — overridable per-call via the <code>collection</code> option.</p>
    <div class="code-block"><div class="code-header"><span class="code-lang">js</span><button class="copy-btn">Copy</button></div>
    <pre><code data-lang="js">const users = qeed({ path: './app.db', namespace: 'myapp', collection: 'users' });
users.set('u:1', { name: 'Alice' });  // stored in myapp/users

// Override collection per call
users.set('u:1', { name: 'Alice' }, { collection: 'admins' });

// Get a new scoped instance at runtime
const posts = users.collection('posts');
const tenant = users.namespace('tenant_b');</code></pre></div>

    <h2 id="cache-config">Cache options</h2>
    <table>
      <thead><tr><th>Option</th><th>Type</th><th>Default</th><th>Description</th></tr></thead>
      <tbody>
        <tr><td><code>enabled</code></td><td>boolean</td><td><code>false</code></td><td>Enable in-process cache</td></tr>
        <tr><td><code>mode</code></td><td>string</td><td><code>'lru'</code></td><td><code>'simple'</code> (FIFO) or <code>'lru'</code> (Least Recently Used)</td></tr>
        <tr><td><code>maxSize</code></td><td>number</td><td><code>1000</code></td><td>Max entries per namespace+collection bucket</td></tr>
      </tbody>
    </table>
    <p>Use <code>mode: 'lru'</code> when your access pattern has a hot subset of keys. Use <code>mode: 'simple'</code> for uniform access patterns — it has marginally lower overhead.</p>

    <h2 id="metrics-config">Metrics options</h2>
    <table>
      <thead><tr><th>Option</th><th>Type</th><th>Default</th><th>Description</th></tr></thead>
      <tbody>
        <tr><td><code>slowQueryMs</code></td><td>number</td><td><code>100</code></td><td>Threshold in ms. Operations slower than this appear in <code>db.slowQueryLog()</code></td></tr>
      </tbody>
    </table>

    <h2 id="events-config">Events options</h2>
    <table>
      <thead><tr><th>Option</th><th>Type</th><th>Default</th><th>Description</th></tr></thead>
      <tbody>
        <tr><td><code>maxListeners</code></td><td>number</td><td><code>50</code></td><td>Hard cap on listeners per event. A warning fires at 80% capacity.</td></tr>
      </tbody>
    </table>

    <h2 id="pragmas">SQLite pragmas</h2>
    <p>Qeed applies these pragmas by default. Override any of them via the <code>pragmas</code> option.</p>
    <table>
      <thead><tr><th>Pragma</th><th>Default</th><th>Effect</th></tr></thead>
      <tbody>
        <tr><td><code>journal_mode</code></td><td><code>WAL</code></td><td>Write-Ahead Logging — concurrent reads, durable writes</td></tr>
        <tr><td><code>synchronous</code></td><td><code>NORMAL</code></td><td>Safe with WAL; avoids full fsync on every write</td></tr>
        <tr><td><code>foreign_keys</code></td><td><code>ON</code></td><td>FK enforcement (Qeed schema has none, but user extensions may)</td></tr>
        <tr><td><code>temp_store</code></td><td><code>MEMORY</code></td><td>Temp tables in RAM</td></tr>
        <tr><td><code>mmap_size</code></td><td><code>256MB</code></td><td>Memory-mapped I/O for read performance</td></tr>
        <tr><td><code>cache_size</code></td><td><code>-8000</code></td><td>8MB SQLite page cache</td></tr>
        <tr><td><code>busy_timeout</code></td><td><code>5000ms</code></td><td>Wait before throwing SQLITE_BUSY</td></tr>
      </tbody>
    </table>

    <div class="notice warn"><span class="notice-icon">⚠️</span><div class="notice-body"><strong>Never change <code>journal_mode</code> to DELETE or TRUNCATE.</strong> WAL is required for Qeed's concurrency model. Changing it may cause read-write interference.</div></div>

    <h2 id="class">Class API</h2>
    <p>Use <code>new Qeed(config)</code> + <code>db.open()</code> when you need explicit lifecycle control — for example in dependency injection containers or test frameworks.</p>
    <div class="code-block"><div class="code-header"><span class="code-lang">js</span><button class="copy-btn">Copy</button></div>
    <pre><code data-lang="js">import { Qeed } from 'qeed';

const db = new Qeed({ path: './app.db', cache: { enabled: true } });
db.open();   // connect, apply pragmas, init schema, start TTL sweep

// ... use db ...

db.close();  // stop sweep, close connection</code></pre></div>
`}));

// ── Query Builder ────────────────────────────────────────
fs.writeFileSync(path.join(OUT, 'query.html'), page({
  slug: 'query', title: 'Query Builder', active: 'query',
  toc: [
    {id:'overview',text:'Overview'},
    {id:'where',text:'where() / orWhere()'},
    {id:'operators',text:'Operator reference'},
    {id:'prefix',text:'prefix() / keyMatches()'},
    {id:'sort',text:'sort()'},
    {id:'pagination',text:'limit() / offset()'},
    {id:'projection',text:'select() / pluck()'},
    {id:'terminals',text:'get / first / count / exists'},
    {id:'nested',text:'Nested dot-notation'},
    {id:'security',text:'Security design'},
  ],
  prev: {href:'configuration.html',title:'Configuration'},
  next: {href:'transactions.html',title:'Transactions'},
  content: `
    <h1>Query Builder</h1>
    <p>Qeed's fluent query builder lets you filter, sort, and project records using a chainable API. Every query compiles to a fully parameterized SQL statement — no raw SQL, no string interpolation, no injection surface.</p>

    <h2 id="overview">How it works</h2>
    <p>Calling <code>db.query()</code> returns a <code>QueryBuilder</code> instance. You chain filter and shape methods, then call a terminal method (<code>get</code>, <code>first</code>, <code>count</code>, or <code>exists</code>) to execute.</p>
    <div class="notice info"><span class="notice-icon">🔒</span><div class="notice-body"><strong>Security guarantee.</strong> The builder accumulates intent as a plain state object. The compiler transforms that state into <code>{ sql, params }</code> — the only place SQL is assembled. It never executes. All user values are in the <code>params</code> array, never in the SQL string. <code>json_extract(value, ?)</code> is used for field paths — the path is a bound parameter.</div></div>

    <h2 id="where">where() and orWhere()</h2>
    <div class="code-block"><div class="code-header"><span class="code-lang">js</span><button class="copy-btn">Copy</button></div>
    <pre><code data-lang="js">// AND conditions (chained where calls)
const admins = db.query()
  .where('role', 'eq', 'admin')
  .where('active', 'eq', true)
  .where('score', 'gte', 80)
  .get();

// OR condition — must follow at least one where()
const results = db.query()
  .where('age', 'lt', 18)
  .orWhere('role', 'eq', 'guest')
  .get();

// IN operator — pass an array
const selected = db.query()
  .where('role', 'in', ['admin', 'moderator', 'editor'])
  .get();

// LIKE operator — % and _ are SQLite wildcards
const found = db.query()
  .where('name', 'like', 'Al%')
  .get();</code></pre></div>

    <h2 id="operators">Operator reference</h2>
    <table>
      <thead><tr><th>Key</th><th>SQL</th><th>Value type</th><th>Notes</th></tr></thead>
      <tbody>
        <tr><td><code>eq</code></td><td><code>=</code></td><td>scalar</td><td>Booleans coerced to 1/0</td></tr>
        <tr><td><code>ne</code></td><td><code>!=</code></td><td>scalar</td><td></td></tr>
        <tr><td><code>gt</code></td><td><code>&gt;</code></td><td>number | string</td><td></td></tr>
        <tr><td><code>gte</code></td><td><code>&gt;=</code></td><td>number | string</td><td></td></tr>
        <tr><td><code>lt</code></td><td><code>&lt;</code></td><td>number | string</td><td></td></tr>
        <tr><td><code>lte</code></td><td><code>&lt;=</code></td><td>number | string</td><td></td></tr>
        <tr><td><code>like</code></td><td><code>LIKE</code></td><td>string</td><td><code>%</code> = any chars, <code>_</code> = one char</td></tr>
        <tr><td><code>in</code></td><td><code>IN (...)</code></td><td>array (max 1000)</td><td>Non-empty array of scalars</td></tr>
      </tbody>
    </table>
    <div class="notice warn"><span class="notice-icon">⚠️</span><div class="notice-body">Any operator string not in this list throws <code>ValidationError</code> immediately — before any SQL is constructed.</div></div>

    <h2 id="prefix">prefix() and keyMatches()</h2>
    <div class="code-block"><div class="code-header"><span class="code-lang">js</span><button class="copy-btn">Copy</button></div>
    <pre><code data-lang="js">// prefix() — compiled as BETWEEN range, uses composite index
const userRecords = db.query().prefix('user:').get();
const count = db.query().prefix('session:').count();

// keyMatches() — LIKE pattern on the key column
const matched = db.query().keyMatches('user:_').get();  // user:1, user:2 …
const wildcard = db.query().keyMatches('%:active').get();</code></pre></div>
    <div class="notice tip"><span class="notice-icon">⚡</span><div class="notice-body"><strong>Performance.</strong> <code>prefix()</code> compiles to <code>key &gt;= ? AND key &lt; ?</code> — a BETWEEN-style range that hits the <code>(namespace, collection, key)</code> composite index directly. Prefer it over <code>keyMatches()</code> for prefix scans.</div></div>

    <h2 id="sort">sort()</h2>
    <div class="code-block"><div class="code-header"><span class="code-lang">js</span><button class="copy-btn">Copy</button></div>
    <pre><code data-lang="js">// Sort by a value field (uses json_extract)
db.query().sort('score', 'desc').get();
db.query().sort('name', 'asc').get();

// Sort by built-in columns (no json_extract overhead)
db.query().sort('key', 'asc').get();
db.query().sort('createdAt', 'desc').get();
db.query().sort('updatedAt', 'asc').get();</code></pre></div>

    <h2 id="pagination">limit() and offset()</h2>
    <div class="code-block"><div class="code-header"><span class="code-lang">js</span><button class="copy-btn">Copy</button></div>
    <pre><code data-lang="js">// First 20 records by score
const top20 = db.query().sort('score', 'desc').limit(20).get();

// Page 3 (0-indexed pages of 10)
const page3 = db.query()
  .sort('createdAt', 'asc')
  .limit(10)
  .offset(20)
  .get();</code></pre></div>

    <h2 id="projection">select() and pluck()</h2>
    <div class="code-block"><div class="code-header"><span class="code-lang">js</span><button class="copy-btn">Copy</button></div>
    <pre><code data-lang="js">// select() — return a subset of value fields
// rec.value = { name: 'Alice', role: 'admin' }
const partial = db.query().select(['name', 'role']).get();

// Dot-notation works in select()
// rec.value = { address_city: 'NYC' }
const cities = db.query().select(['address.city']).get();

// pluck() — return a single scalar as rec.value
// rec.value = 'Alice'
const names = db.query().pluck('name').get();

// pluck() on a nested field
// rec.value = 'NYC'
const citiesPlucked = db.query().pluck('address.city').get();</code></pre></div>

    <h2 id="terminals">Terminal methods</h2>
    <div class="code-block"><div class="code-header"><span class="code-lang">js</span><button class="copy-btn">Copy</button></div>
    <pre><code data-lang="js">const q = db.query().where('role', 'eq', 'admin');

// get() — all matching records
const records = q.get();         // QeedRecord[]

// first() — first match or null; internally adds LIMIT 1
const top = q.sort('score', 'desc').first();  // QeedRecord | null

// count() — number of matches
const n = q.count();             // number

// exists() — true if any match exists; uses SELECT 1 LIMIT 1
const any = q.exists();          // boolean</code></pre></div>
    <div class="notice tip"><span class="notice-icon">💡</span><div class="notice-body"><code>first()</code> does <em>not</em> mutate the builder. You can reuse the same builder for <code>first()</code> and <code>get()</code> without interference.</div></div>

    <h2 id="nested">Nested dot-notation</h2>
    <div class="code-block"><div class="code-header"><span class="code-lang">js</span><button class="copy-btn">Copy</button></div>
    <pre><code data-lang="js">db.set('u:1', { profile: { city: 'NYC', age: 28 }, active: true });
db.set('u:2', { profile: { city: 'LA',  age: 35 }, active: false });

// Filter on a nested field
const nycUsers = db.query()
  .where('profile.city', 'eq', 'NYC')
  .where('profile.age', 'gte', 21)
  .get();

// Sort by nested field
const byAge = db.query()
  .sort('profile.age', 'asc')
  .get();

// Pluck nested
const ages = db.query().pluck('profile.age').get();</code></pre></div>

    <h2 id="security">Security design</h2>
    <p>Every field name passed to <code>where()</code>, <code>sort()</code>, <code>select()</code>, or <code>pluck()</code> is validated against the regex <code>/^[a-zA-Z_][a-zA-Z0-9_.]{0,127}$/</code> and checked against a banned-segment set (<code>__proto__</code>, <code>constructor</code>, <code>prototype</code>). Invalid fields throw <code>ValidationError</code> before any SQL is touched.</p>
    <div class="code-block"><div class="code-header"><span class="code-lang">js</span><button class="copy-btn">Copy</button></div>
    <pre><code data-lang="js">// These all throw ValidationError immediately:
db.query().where("role') OR 1=1 --", 'eq', 'admin');
db.query().where('__proto__', 'eq', 'anything');
db.query().where('a.constructor.b', 'eq', 'x');
db.query().where('role', 'DROP TABLE records', 'x');
db.query().sort('score', 'sideways');

// SQL injection in values is inert — values are bound parameters
const rows = db.query().where('role', 'eq', "' OR '1'='1").get();
// rows === [] — the injection string is treated as a literal value</code></pre></div>
`}));

// ── Transactions ─────────────────────────────────────────
fs.writeFileSync(path.join(OUT, 'transactions.html'), page({
  slug: 'transactions', title: 'Transactions', active: 'transactions',
  toc: [
    {id:'overview',text:'Overview'},
    {id:'basic',text:'Basic transaction'},
    {id:'rollback',text:'Automatic rollback'},
    {id:'return',text:'Return values'},
    {id:'batch',text:'Batch vs tx'},
    {id:'nested',text:'Nested transactions'},
    {id:'internals',text:'BEGIN IMMEDIATE'},
    {id:'patterns',text:'Real-world patterns'},
  ],
  prev: {href:'query.html',title:'Query Builder'},
  next: {href:'cache.html',title:'Cache System'},
  content: `
    <h1>Transactions</h1>
    <p>Qeed wraps SQLite's native transaction system in a safe, ergonomic API. Every transaction uses <code>BEGIN IMMEDIATE</code>, commits on success, and rolls back on any thrown error.</p>

    <h2 id="overview">Overview</h2>
    <p><code>db.tx(fn)</code> runs your function inside a transaction. The function receives the same <code>db</code> instance. All reads and writes inside the function participate in the transaction.</p>

    <h2 id="basic">Basic transaction</h2>
    <div class="code-block"><div class="code-header"><span class="code-lang">js</span><button class="copy-btn">Copy</button></div>
    <pre><code data-lang="js">db.tx(scope => {
  scope.set('account:alice', { balance: 950 });
  scope.set('account:bob',   { balance: 150 });
  scope.set('log:001', { type: 'transfer', amount: 50, ts: Date.now() });
});
// All three writes committed atomically</code></pre></div>

    <h2 id="rollback">Automatic rollback</h2>
    <p>Any error thrown inside <code>tx(fn)</code> — whether from Qeed validation or your own code — triggers an immediate rollback. The error is re-thrown to the caller.</p>
    <div class="code-block"><div class="code-header"><span class="code-lang">js</span><button class="copy-btn">Copy</button></div>
    <pre><code data-lang="js">const alice = db.get('account:alice').value;

try {
  db.tx(scope => {
    if (alice.balance < 200) throw new Error('insufficient funds');
    scope.set('account:alice', { balance: alice.balance - 200 });
    scope.set('account:bob',   { balance: bob.balance   + 200 });
  });
} catch (err) {
  console.log(err.message);  // 'insufficient funds'
  // Both writes were rolled back — balances unchanged
}</code></pre></div>

    <h2 id="return">Return values</h2>
    <div class="code-block"><div class="code-header"><span class="code-lang">js</span><button class="copy-btn">Copy</button></div>
    <pre><code data-lang="js">const result = db.tx(scope => {
  scope.set('counter', (scope.get('counter')?.value ?? 0) + 1);
  return scope.get('counter').value;
});

console.log(result);  // the new counter value</code></pre></div>

    <h2 id="batch">Batch vs tx</h2>
    <p>Both <code>batch()</code> and <code>tx()</code> are atomic. Use each for different needs:</p>
    <table>
      <thead><tr><th></th><th><code>batch()</code></th><th><code>tx()</code></th></tr></thead>
      <tbody>
        <tr><td>Operation types</td><td>set and del only</td><td>Any db operation</td></tr>
        <tr><td>Conditional logic</td><td>No</td><td>Yes — full JS</td></tr>
        <tr><td>Read inside tx</td><td>No</td><td>Yes</td></tr>
        <tr><td>Performance</td><td>Slightly faster (no fn call)</td><td>Full flexibility</td></tr>
      </tbody>
    </table>

    <h2 id="nested">Nested transactions</h2>
    <p>Qeed does not support nested transactions. Calling <code>db.tx()</code> inside another <code>db.tx()</code> throws <code>TransactionError</code> immediately. This is intentional — SQLite savepoints exist but their partial-commit semantics create subtle bugs.</p>
    <div class="code-block"><div class="code-header"><span class="code-lang">js</span><button class="copy-btn">Copy</button></div>
    <pre><code data-lang="js">db.tx(outer => {
  outer.set('k1', 1);
  db.tx(inner => { /* throws TransactionError */ });
});</code></pre></div>
    <p><strong>Design pattern</strong>: compose operations as functions that accept a <code>scope</code> parameter, then call them all within a single transaction:</p>
    <div class="code-block"><div class="code-header"><span class="code-lang">js</span><button class="copy-btn">Copy</button></div>
    <pre><code data-lang="js">function debitUser(scope, userId, amount) {
  const rec = scope.get('account:' + userId);
  if (!rec || rec.value.balance < amount) throw new Error('insufficient');
  scope.set('account:' + userId, { ...rec.value, balance: rec.value.balance - amount });
}

function creditUser(scope, userId, amount) {
  const rec = scope.get('account:' + userId);
  const current = rec?.value?.balance ?? 0;
  scope.set('account:' + userId, { balance: current + amount });
}

// Compose in a single tx — no nesting needed
db.tx(scope => {
  debitUser(scope, 'alice', 100);
  creditUser(scope, 'bob',  100);
});</code></pre></div>

    <h2 id="internals">BEGIN IMMEDIATE internals</h2>
    <p>Qeed uses <code>BEGIN IMMEDIATE</code> rather than the SQLite default <code>BEGIN DEFERRED</code>. This eliminates the deferred-to-exclusive upgrade race that can occur in WAL mode when a transaction starts as a read but later attempts a write. <code>IMMEDIATE</code> acquires the write lock upfront, preventing <code>SQLITE_BUSY</code> mid-transaction.</p>

    <h2 id="patterns">Real-world patterns</h2>
    <h4>Counter with uniqueness guarantee</h4>
    <div class="code-block"><div class="code-header"><span class="code-lang">js</span><button class="copy-btn">Copy</button></div>
    <pre><code data-lang="js">function nextId(scope, key) {
  const current = scope.get(key)?.value ?? 0;
  const next = current + 1;
  scope.set(key, next);
  return next;
}

const orderId = db.tx(scope => {
  const id = nextId(scope, 'seq:orders');
  scope.set('order:' + id, { items: [...], total: 149.00 });
  return id;
});</code></pre></div>

    <h4>Optimistic update with validation</h4>
    <div class="code-block"><div class="code-header"><span class="code-lang">js</span><button class="copy-btn">Copy</button></div>
    <pre><code data-lang="js">db.tx(scope => {
  const rec = scope.get('config:limits');
  if (!rec) throw new Error('config not found');
  if (rec.value.version !== expectedVersion) throw new Error('stale read');
  scope.set('config:limits', {
    ...rec.value,
    rateLimit: 500,
    version: rec.value.version + 1,
  });
});</code></pre></div>
`}));

// ── Cache ────────────────────────────────────────────────
fs.writeFileSync(path.join(OUT, 'cache.html'), page({
  slug: 'cache', title: 'Cache System', active: 'cache',
  toc: [
    {id:'overview',text:'Overview'},
    {id:'enable',text:'Enabling the cache'},
    {id:'lru',text:'LRU mode'},
    {id:'simple',text:'Simple mode'},
    {id:'isolation',text:'Namespace isolation'},
    {id:'invalidation',text:'Invalidation guarantees'},
    {id:'stats',text:'Cache statistics'},
    {id:'patterns',text:'Patterns'},
    {id:'limits',text:'Limits and tradeoffs'},
  ],
  prev: {href:'transactions.html',title:'Transactions'},
  next: {href:'api.html',title:'API Reference'},
  content: `
    <h1>Cache System</h1>
    <p>Qeed's optional in-process cache sits in front of every <code>get()</code> call. A cache hit returns a frozen record reference with zero SQLite I/O — reaching 1.8M+ reads per second on a warm cache.</p>

    <h2 id="overview">How it works</h2>
    <p>The cache is organised into <em>buckets</em> — one Map (or LRU) per <code>namespace+collection</code> pair. Reads populate the cache. Writes, deletes, TTL changes, and imports all synchronously invalidate the relevant entry or bucket before returning.</p>
    <div class="code-block"><div class="code-header"><span class="code-lang">js</span><button class="copy-btn">Copy</button></div>
    <pre><code data-lang="js">// Read path:
// 1. cache.get(ns, col, key)
//    → HIT  → return frozen record (zero DB I/O)
//    → MISS → store.get() → cache.set() → return record

// Write path:
// store.set() → cache.invalidate(ns, col, key) → return</code></pre></div>

    <h2 id="enable">Enabling the cache</h2>
    <div class="code-block"><div class="code-header"><span class="code-lang">js</span><button class="copy-btn">Copy</button></div>
    <pre><code data-lang="js">const db = qeed({
  path: './data.db',
  cache: {
    enabled: true,
    mode: 'lru',      // recommended for most workloads
    maxSize: 1000,    // max entries per namespace+collection bucket
  },
});</code></pre></div>

    <h2 id="lru">LRU mode</h2>
    <p>In LRU mode, each bucket is backed by a doubly-linked list + Map providing O(1) get, set, and evict. When the bucket reaches <code>maxSize</code>, the least-recently-used entry is evicted.</p>
    <div class="code-block"><div class="code-header"><span class="code-lang">js</span><button class="copy-btn">Copy</button></div>
    <pre><code data-lang="js">const db = qeed({ path: './app.db', cache: { enabled: true, mode: 'lru', maxSize: 500 } });

// Warm the cache
for (let i = 0; i < 500; i++) {
  db.set('cfg:' + i, { value: i });
  db.get('cfg:' + i);
}

// Access cfg:0 to promote it to MRU position
db.get('cfg:0');

// Adding cfg:500 evicts cfg:1 (LRU), not cfg:0
db.set('cfg:500', { value: 500 });
db.get('cfg:500');</code></pre></div>

    <h2 id="simple">Simple mode</h2>
    <p>Simple mode uses a plain Map with FIFO eviction — the oldest-inserted entry is removed when the bucket is full. Lower overhead than LRU, but less optimal for workloads with a hot subset of keys.</p>

    <h2 id="isolation">Namespace isolation</h2>
    <p>Each namespace+collection pair has an independent bucket. Flushing namespace A never touches namespace B's cache entries.</p>
    <div class="code-block"><div class="code-header"><span class="code-lang">js</span><button class="copy-btn">Copy</button></div>
    <pre><code data-lang="js">const ns1 = db.namespace('tenant_a');
const ns2 = db.namespace('tenant_b');

ns1.set('k', 'val-a'); ns1.get('k'); // ns1 cache populated
ns2.set('k', 'val-b'); ns2.get('k'); // ns2 cache populated

ns1.set('k', 'updated-a');  // invalidates ns1 bucket only
ns2.get('k').value;          // 'val-b' — ns2 cache unaffected</code></pre></div>

    <h2 id="invalidation">Invalidation guarantees</h2>
    <p>The cache is <em>never stale</em> after any Qeed API call. Invalidation is synchronous and happens before the operation returns.</p>
    <table>
      <thead><tr><th>Operation</th><th>Cache effect</th></tr></thead>
      <tbody>
        <tr><td><code>set()</code></td><td>Invalidate <code>(ns, col, key)</code></td></tr>
        <tr><td><code>delete()</code></td><td>Invalidate <code>(ns, col, key)</code></td></tr>
        <tr><td><code>ttl()</code></td><td>Invalidate <code>(ns, col, key)</code></td></tr>
        <tr><td><code>persist()</code></td><td>Invalidate <code>(ns, col, key)</code></td></tr>
        <tr><td><code>batch()</code></td><td>Invalidate each key in the batch</td></tr>
        <tr><td><code>flushCollection()</code></td><td>Clear the entire collection bucket</td></tr>
        <tr><td><code>flushNamespace()</code></td><td>Clear all buckets for the namespace</td></tr>
        <tr><td><code>deletePrefix()</code></td><td>Invalidate all matching cache keys</td></tr>
        <tr><td><code>import()</code></td><td>Flush entire cache</td></tr>
      </tbody>
    </table>
    <div class="notice info"><span class="notice-icon">🔒</span><div class="notice-body"><strong>Field-pluck reads bypass the cache.</strong> A <code>get(key, { field: 'user.name' })</code> call always hits the database. This prevents a full-record cache entry from being shadowed by a partial read that could go stale.</div></div>

    <h2 id="stats">Cache statistics</h2>
    <div class="code-block"><div class="code-header"><span class="code-lang">js</span><button class="copy-btn">Copy</button></div>
    <pre><code data-lang="js">const m = db.metrics();
m.cache.hits;         // number of cache hits
m.cache.misses;       // number of cache misses
m.cache.evictions;    // entries evicted due to maxSize
m.cache.invalidations;// entries removed by write/delete/flush
m.cache.hitRate;      // percentage: hits / (hits + misses) * 100
m.cache.size;         // current total entries across all buckets
m.cache.buckets;      // number of active namespace+collection buckets</code></pre></div>

    <h2 id="patterns">Patterns</h2>
    <h4>Hot-key workload (LRU ideal)</h4>
    <div class="code-block"><div class="code-header"><span class="code-lang">js</span><button class="copy-btn">Copy</button></div>
    <pre><code data-lang="js">// Config and feature flags — read millions of times, updated rarely
const db = qeed({
  path: './app.db',
  cache: { enabled: true, mode: 'lru', maxSize: 200 }
});

db.set('config:rateLimit', { requests: 1000, window: 60_000 });
// First access hits DB; subsequent reads are pure in-memory
for (let i = 0; i < 1_000_000; i++) {
  const cfg = db.get('config:rateLimit');
  // ...
}</code></pre></div>

    <h2 id="limits">Limits and tradeoffs</h2>
    <ul>
      <li><strong>Memory:</strong> <code>maxSize</code> is counted in entries, not bytes. A bucket of 1000 entries with 1KB values uses ~1MB. Size your cache against available process memory.</li>
      <li><strong>Single-process only:</strong> The cache is in-process. A second Node.js process opening the same SQLite file will not see the first process's cache entries — or its invalidations. Do not use the cache in multi-process deployments unless you accept eventual consistency.</li>
      <li><strong>No TTL in cache:</strong> Cache entries do not have their own expiry. Expired records are filtered at the DB read layer — if a cached record's <code>expiresAt</code> passes, the cache entry will return a frozen record that Qeed's DB layer would have filtered. Use <code>sweepInterval</code> to keep expired records out of the DB and therefore out of the cache population.</li>
    </ul>
`}));

// ── API Reference ────────────────────────────────────────
fs.writeFileSync(path.join(OUT, 'api.html'), page({
  slug: 'api', title: 'API Reference', active: 'api',
  toc: [
    {id:'factory',text:'qeed() / new Qeed()'},
    {id:'set',text:'set()'},
    {id:'get',text:'get()'},
    {id:'delete',text:'delete()'},
    {id:'has',text:'has()'},
    {id:'ttl',text:'ttl() / persist()'},
    {id:'batch',text:'batch()'},
    {id:'tx',text:'tx()'},
    {id:'query',text:'query()'},
    {id:'ns-col',text:'namespace() / collection()'},
    {id:'flush',text:'flush methods'},
    {id:'events',text:'Events API'},
    {id:'observe',text:'Observability'},
    {id:'io',text:'Backup & IO'},
    {id:'errors',text:'Error types'},
  ],
  prev: {href:'cache.html',title:'Cache System'},
  next: {href:'advanced.html',title:'Advanced Guide'},
  content: `
    <h1>API Reference</h1>
    <p>Complete method signatures for the <code>Qeed</code> class. All methods are synchronous except <code>backup()</code>, <code>verifyBackup()</code>, <code>restore()</code>, and <code>export()</code>.</p>

    <h2 id="factory">Factory and constructor</h2>
    <div class="method-block">
      <div class="method-header"><span class="method-name">qeed(config)</span><span class="method-ret">→ Qeed</span></div>
      <div class="method-body"><p class="method-desc">Open a database and return a ready-to-use instance. Equivalent to <code>new Qeed(config).open()</code>.</p></div>
    </div>
    <div class="method-block">
      <div class="method-header"><span class="method-name">new Qeed(config)</span><span class="method-ret">→ Qeed</span></div>
      <div class="method-body"><p class="method-desc">Create an instance without opening. Call <code>db.open()</code> explicitly.</p></div>
    </div>

    <h2 id="set">set()</h2>
    <div class="method-block">
      <div class="method-header"><span class="method-name">db.set</span><span class="method-sig">(key, value, opts?)</span><span class="method-ret">→ void</span></div>
      <div class="method-body">
        <p class="method-desc">Write a key-value pair. Always an upsert — if the key exists it is overwritten.</p>
        <div class="method-params">
          <div class="method-param"><span class="param-name">key</span><span class="param-type">string</span><span class="param-desc">Printable string, max 512 bytes, no null bytes</span></div>
          <div class="method-param"><span class="param-name">value</span><span class="param-type">any</span><span class="param-desc">Any JSON-serializable value. <code>undefined</code> throws. Max 1MB serialized, max 10 nesting levels.</span></div>
          <div class="method-param"><span class="param-name">opts.ttl</span><span class="param-type">number?</span><span class="param-opt">optional</span><span class="param-desc">Expiry in milliseconds from now. Must be a positive finite number.</span></div>
          <div class="method-param"><span class="param-name">opts.collection</span><span class="param-type">string?</span><span class="param-opt">optional</span><span class="param-desc">Override the default collection for this call.</span></div>
          <div class="method-param"><span class="param-name">opts.meta</span><span class="param-type">object?</span><span class="param-opt">optional</span><span class="param-desc">Arbitrary metadata blob. Must be a plain object.</span></div>
        </div>
      </div>
    </div>

    <h2 id="get">get()</h2>
    <div class="method-block">
      <div class="method-header"><span class="method-name">db.get</span><span class="method-sig">(key, opts?)</span><span class="method-ret">→ QeedRecord | null</span></div>
      <div class="method-body">
        <p class="method-desc">Read a record. Returns <code>null</code> if the key does not exist or has expired. The returned record is frozen.</p>
        <div class="method-params">
          <div class="method-param"><span class="param-name">key</span><span class="param-type">string</span><span class="param-desc">Key to read</span></div>
          <div class="method-param"><span class="param-name">opts.field</span><span class="param-type">string?</span><span class="param-opt">optional</span><span class="param-desc">Dot-notation field to pluck from value. Result is in <code>rec.value</code>. Bypasses cache.</span></div>
          <div class="method-param"><span class="param-name">opts.collection</span><span class="param-type">string?</span><span class="param-opt">optional</span><span class="param-desc">Override the default collection for this call.</span></div>
        </div>
      </div>
    </div>

    <h2 id="delete">delete()</h2>
    <div class="method-block">
      <div class="method-header"><span class="method-name">db.delete</span><span class="method-sig">(key, opts?)</span><span class="method-ret">→ boolean</span></div>
      <div class="method-body"><p class="method-desc">Delete a key. Returns <code>true</code> if the key existed, <code>false</code> otherwise.</p></div>
    </div>

    <h2 id="has">has()</h2>
    <div class="method-block">
      <div class="method-header"><span class="method-name">db.has</span><span class="method-sig">(key, opts?)</span><span class="method-ret">→ boolean</span></div>
      <div class="method-body"><p class="method-desc">Check if a key exists and has not expired. Returns <code>false</code> for missing or expired keys.</p></div>
    </div>

    <h2 id="ttl">ttl() and persist()</h2>
    <div class="method-block">
      <div class="method-header"><span class="method-name">db.ttl</span><span class="method-sig">(key, ms, opts?)</span><span class="method-ret">→ boolean</span></div>
      <div class="method-body"><p class="method-desc">Set or update the TTL of an existing, non-expired key. Returns <code>true</code> if the key was found and updated.</p></div>
    </div>
    <div class="method-block">
      <div class="method-header"><span class="method-name">db.persist</span><span class="method-sig">(key, opts?)</span><span class="method-ret">→ boolean</span></div>
      <div class="method-body"><p class="method-desc">Remove the TTL from an existing key, making it permanent. Returns <code>true</code> if the key existed.</p></div>
    </div>

    <h2 id="batch">batch()</h2>
    <div class="method-block">
      <div class="method-header"><span class="method-name">db.batch</span><span class="method-sig">(ops[], opts?)</span><span class="method-ret">→ number</span></div>
      <div class="method-body">
        <p class="method-desc">Execute multiple set/del operations in a single atomic transaction. Returns the number of operations applied.</p>
        <div class="method-params">
          <div class="method-param"><span class="param-name">ops</span><span class="param-type">BatchOp[]</span><span class="param-desc">Array of <code>{ type: 'set'|'del', key, value?, options? }</code> objects. All are validated before any DB write begins.</span></div>
        </div>
      </div>
    </div>

    <h2 id="tx">tx()</h2>
    <div class="method-block">
      <div class="method-header"><span class="method-name">db.tx</span><span class="method-sig">(fn)</span><span class="method-ret">→ any</span></div>
      <div class="method-body"><p class="method-desc">Run <code>fn</code> inside a <code>BEGIN IMMEDIATE</code> transaction. <code>fn</code> receives the <code>db</code> instance. Commits on success, rolls back and re-throws on any error. The return value of <code>fn</code> is returned. Nested calls throw <code>TransactionError</code>.</p></div>
    </div>

    <h2 id="query">query()</h2>
    <div class="method-block">
      <div class="method-header"><span class="method-name">db.query</span><span class="method-sig">(opts?)</span><span class="method-ret">→ QueryBuilder</span></div>
      <div class="method-body"><p class="method-desc">Return a fluent <code>QueryBuilder</code> scoped to the current namespace and collection. See <a href="query.html">Query Builder</a> for the full API.</p></div>
    </div>

    <h2 id="ns-col">namespace() and collection()</h2>
    <div class="method-block">
      <div class="method-header"><span class="method-name">db.namespace</span><span class="method-sig">(name)</span><span class="method-ret">→ Qeed</span></div>
      <div class="method-body"><p class="method-desc">Return a new <code>Qeed</code> instance scoped to <code>name</code>. Shares the connection, cache, events, and metrics with the parent.</p></div>
    </div>
    <div class="method-block">
      <div class="method-header"><span class="method-name">db.collection</span><span class="method-sig">(name)</span><span class="method-ret">→ Qeed</span></div>
      <div class="method-body"><p class="method-desc">Return a new <code>Qeed</code> instance scoped to <code>name</code> within the current namespace.</p></div>
    </div>

    <h2 id="flush">Flush methods</h2>
    <div class="method-block">
      <div class="method-header"><span class="method-name">db.flushNamespace</span><span class="method-sig">()</span><span class="method-ret">→ number</span></div>
      <div class="method-body"><p class="method-desc">Delete all records in the current namespace. Returns count deleted. Also flushes the cache for the namespace.</p></div>
    </div>
    <div class="method-block">
      <div class="method-header"><span class="method-name">db.flushCollection</span><span class="method-sig">(col?)</span><span class="method-ret">→ number</span></div>
      <div class="method-body"><p class="method-desc">Delete all records in the current (or specified) collection. Also invalidates the collection's cache bucket.</p></div>
    </div>
    <div class="method-block">
      <div class="method-header"><span class="method-name">db.deletePrefix</span><span class="method-sig">(prefix, opts?)</span><span class="method-ret">→ number</span></div>
      <div class="method-body"><p class="method-desc">Delete all keys starting with <code>prefix</code> in the current collection. Uses index-friendly BETWEEN rewrite.</p></div>
    </div>
    <div class="method-block">
      <div class="method-header"><span class="method-name">db.sweep</span><span class="method-sig">()</span><span class="method-ret">→ number</span></div>
      <div class="method-body"><p class="method-desc">Manually run the TTL sweep. Returns the number of expired records deleted. The automatic sweep runs every <code>sweepInterval</code> ms.</p></div>
    </div>

    <h2 id="events">Events API</h2>
    <div class="code-block"><div class="code-header"><span class="code-lang">js</span><button class="copy-btn">Copy</button></div>
    <pre><code data-lang="js">const unsub = db.on(event, fn);   // subscribe → returns unsubscribe fn
db.once(event, fn);               // subscribe for one emission
db.off(event, fn);                // unsubscribe by reference

// Valid events: 'set' | 'update' | 'delete' | 'clear' | 'expire' | 'error'</code></pre></div>

    <h2 id="observe">Observability</h2>
    <div class="code-block"><div class="code-header"><span class="code-lang">js</span><button class="copy-btn">Copy</button></div>
    <pre><code data-lang="js">db.metrics();          // → full metrics snapshot (ops, cache, latency, slow queries)
db.diagnostics();      // → full diagnostics snapshot (metrics + db PRAGMA stats + health)
db.health();           // → { status, warnings, errors }
db.integrityCheck();   // → 'ok' | string[]  (runs PRAGMA integrity_check)
db.slowQueryLog();     // → array of { op, ms, at, meta }</code></pre></div>

    <h2 id="io">Backup and IO</h2>
    <div class="code-block"><div class="code-header"><span class="code-lang">js</span><button class="copy-btn">Copy</button></div>
    <pre><code data-lang="js">await db.backup(destDir, { compress: false, onProgress: fn }); // → BackupResult
await db.verifyBackup(backupDir);   // → { valid, recordCount, warnings }
await db.restore(backupDir, { verifyChecksum: true });  // → { recordCount, durationMs }
db.listBackups(backupDir);          // → manifest[]

await db.export(destPath, { format: 'json', compress: false, namespace, collection });
db.import(srcPath, { verifyChecksum: true, skipInvalid: false, namespace, collection });</code></pre></div>

    <h2 id="errors">Error types</h2>
    <table>
      <thead><tr><th>Class</th><th>Code</th><th>When thrown</th></tr></thead>
      <tbody>
        <tr><td><code>QeedError</code></td><td>base</td><td>Base class for all Qeed errors</td></tr>
        <tr><td><code>InvalidKeyError</code></td><td><code>INVALID_KEY</code></td><td>Key fails validation (empty, null byte, too long)</td></tr>
        <tr><td><code>InvalidValueError</code></td><td><code>INVALID_VALUE</code></td><td><code>undefined</code>, function, circular ref, too large</td></tr>
        <tr><td><code>ValidationError</code></td><td><code>VALIDATION_ERROR</code></td><td>Namespace, collection, field, operator, TTL fails</td></tr>
        <tr><td><code>TransactionError</code></td><td><code>TRANSACTION_ERROR</code></td><td>Nested transaction, <code>tx()</code> without function arg</td></tr>
        <tr><td><code>LifecycleError</code></td><td><code>LIFECYCLE_ERROR</code></td><td>Double open, use after close, bad config</td></tr>
        <tr><td><code>IOError</code></td><td><code>IO_ERROR</code></td><td>Backup, restore, export, import failures</td></tr>
      </tbody>
    </table>
    <div class="code-block"><div class="code-header"><span class="code-lang">js</span><button class="copy-btn">Copy</button></div>
    <pre><code data-lang="js">import { ValidationError } from 'qeed';
try {
  db.set('', 'value');
} catch (err) {
  err instanceof ValidationError;  // true
  err.code;                        // 'INVALID_KEY'
  err.context;                     // { key: '' }
  err.message;                     // human-readable
}</code></pre></div>
`}));

// ── Advanced ─────────────────────────────────────────────
fs.writeFileSync(path.join(OUT, 'advanced.html'), page({
  slug: 'advanced', title: 'Advanced Guide', active: 'advanced',
  toc: [
    {id:'backup',text:'Backup & restore'},
    {id:'export',text:'Export & import'},
    {id:'events',text:'Events'},
    {id:'metrics',text:'Metrics & diagnostics'},
    {id:'security',text:'Security architecture'},
    {id:'wal',text:'WAL mode'},
    {id:'benchmarks',text:'Benchmarks'},
  ],
  prev: {href:'api.html',title:'API Reference'},
  next: {href:'faq.html',title:'FAQ'},
  content: `
    <h1>Advanced Guide</h1>

    <h2 id="backup">Backup and restore</h2>
    <p>Qeed uses SQLite's native online backup API — safe to call while the database is actively being read and written.</p>
    <div class="code-block"><div class="code-header"><span class="code-lang">js</span><button class="copy-btn">Copy</button></div>
    <pre><code data-lang="js">// Create a compressed backup
const result = await db.backup('./backups', { compress: true });
console.log(result.filePath);    // backups/qeed-backup-2024-01-01T...db.gz
console.log(result.checksum);    // SHA-256 of the backup file
console.log(result.recordCount); // records at backup time
console.log(result.durationMs);  // how long it took

// Verify without restoring
const check = await db.verifyBackup('./backups');
console.log(check.valid);        // true | false
console.log(check.warnings);     // [] | ['checksum mismatch — ...']

// Atomic restore with automatic rollback on failure
await db.restore('./backups');
// If restore fails: pre-restore snapshot is reinstated, error thrown

// List backups
const manifests = db.listBackups('./backups');</code></pre></div>

    <h4>Restore safety sequence</h4>
    <ol>
      <li>Checksum verified against manifest</li>
      <li>Pre-restore snapshot copied (<code>db.db.pre-restore-snapshot</code>)</li>
      <li>Database connection closed</li>
      <li>Backup file copied over live database</li>
      <li>Connection reopened</li>
      <li><code>PRAGMA integrity_check</code> run on restored database</li>
      <li>If check fails: snapshot reinstated, connection reopened, <code>IOError</code> thrown</li>
      <li>Snapshot deleted</li>
    </ol>

    <h2 id="export">Export and import</h2>
    <div class="code-block"><div class="code-header"><span class="code-lang">js</span><button class="copy-btn">Copy</button></div>
    <pre><code data-lang="js">// Export all records
await db.export('./data.json');

// Export a namespace
await db.export('./users.json', { namespace: 'myapp', collection: 'users' });

// Compressed NDJSON
await db.export('./data.ndjson.gz', { format: 'ndjson', compress: true });

// Import — transactional, all or nothing
const result = db.import('./data.json');
console.log(result.imported);  // records written
console.log(result.skipped);   // records skipped (only with skipInvalid)

// Import with overrides
db.import('./users.json', {
  namespace: 'archive',
  collection: 'users_2023',
  skipInvalid: true,       // skip bad records instead of failing
  verifyChecksum: false,   // skip SHA-256 check
});</code></pre></div>

    <div class="notice tip"><span class="notice-icon">💡</span><div class="notice-body">Every export file starts with a JSON manifest on line 1: <code>magic</code>, <code>version</code>, <code>format</code>, <code>exportedAt</code>, <code>recordCount</code>, and a SHA-256 <code>checksum</code> of the payload. Import validates all of these before touching the database.</div></div>

    <h2 id="events">Events</h2>
    <div class="code-block"><div class="code-header"><span class="code-lang">js</span><button class="copy-btn">Copy</button></div>
    <pre><code data-lang="js">// on() returns an unsubscribe function
const unsubSet = db.on('set', e => {
  console.log('created', e.namespace, e.collection, e.key);
});

const unsubUpdate = db.on('update', e => {
  console.log('updated', e.key);
});

db.on('delete', e => { /* ... */ });
db.on('clear',  e => { /* e.collection is null for flushNamespace */ });
db.on('error',  e => { /* e.event, e.error — listener threw */ });

db.once('set', fn);   // fires once then auto-removes
unsubSet();           // unsubscribe
db.off('update', fn); // remove by function reference

// Listener count
db.on._state;  // use EventManager directly for introspection</code></pre></div>

    <div class="notice info"><span class="notice-icon">📡</span><div class="notice-body"><strong>Events are synchronous.</strong> They fire after the operation is confirmed and before control returns to the caller. A listener that throws does not crash the emit — the error is caught and re-emitted on <code>'error'</code>.</div></div>

    <h2 id="metrics">Metrics and diagnostics</h2>
    <div class="code-block"><div class="code-header"><span class="code-lang">js</span><button class="copy-btn">Copy</button></div>
    <pre><code data-lang="js">const m = db.metrics();

// Per-operation stats
m.ops.set.total;       // total calls
m.ops.get.avgMs;       // average latency
m.ops.query.errors;    // error count

// Latency histogram (total ops across all buckets = total operations)
m.latency.le_1ms;      // ops completing in ≤1ms
m.latency.le_5ms;      // ops completing in ≤5ms
m.latency.gt_1000ms;   // ops taking >1s

// Slow queries
m.slowQueries.count;
m.slowQueries.thresholdMs;
m.slowQueries.recent;  // last 10 entries: { op, ms, at, meta }

// Full diagnostics
const d = db.diagnostics();
d.health.status;       // 'healthy' | 'degraded' | 'unhealthy'
d.health.warnings;     // ['high freelist ratio: 35% — consider VACUUM']
d.db.pageCount;
d.db.freelistCount;    // >30% of pageCount = consider VACUUM
d.db.walSizeBytes;     // large WAL = checkpoint may be stalled

// Reset counters
// const m = new MetricsManager(); m.resetCounters();</code></pre></div>

    <h2 id="security">Security architecture</h2>
    <p>Every attack vector in the threat model has a specific code-level defense:</p>
    <table>
      <thead><tr><th>Threat</th><th>Defense</th><th>Module</th></tr></thead>
      <tbody>
        <tr><td>SQL injection via values</td><td>All values are <code>?</code> bound params, never interpolated</td><td><code>store/set.js</code></td></tr>
        <tr><td>SQL injection via field names</td><td>Regex allowlist + banned segment set; path used as <code>?</code> param in WHERE</td><td><code>query/ops.js</code></td></tr>
        <tr><td>Operator injection</td><td>Closed Map of 8 tokens; anything else throws before SQL is touched</td><td><code>query/ops.js</code></td></tr>
        <tr><td>Identifier injection (namespace/collection)</td><td><code>/^[a-zA-Z_][a-zA-Z0-9_]{0,63}$/</code> enforced on every call</td><td><code>security/sanitize.js</code></td></tr>
        <tr><td>Prototype pollution</td><td>Recursive scan + JSON round-trip clone of all incoming objects</td><td><code>security/proto.js</code></td></tr>
        <tr><td>Unsafe serialization</td><td>Max 10 depth, max 1MB, no functions, no circular refs</td><td><code>security/serialize.js</code></td></tr>
        <tr><td>Cache corruption</td><td>Invalidate-before-return on every write path; no partial reads cached</td><td><code>src/index.js</code></td></tr>
        <tr><td>Backup corruption</td><td>SHA-256 checksum + <code>PRAGMA integrity_check</code> before restore commits</td><td><code>io/backup.js</code></td></tr>
      </tbody>
    </table>

    <h2 id="wal">WAL mode internals</h2>
    <p>Write-Ahead Logging is enabled by default (<code>PRAGMA journal_mode=WAL</code>). In WAL mode:</p>
    <ul>
      <li>Readers and writers never block each other</li>
      <li>Writes are appended to the <code>-wal</code> file; readers see a consistent snapshot</li>
      <li>WAL is checkpointed into the main database file automatically by SQLite</li>
      <li>A large <code>-wal</code> file (visible in <code>db.diagnostics().db.walSizeBytes</code>) means checkpointing is stalled — usually because a long-running read is holding an old snapshot</li>
    </ul>

    <h2 id="benchmarks">Benchmarks</h2>
    <div class="code-block"><div class="code-header"><span class="code-lang">bash</span><button class="copy-btn">Copy</button></div>
    <pre><code data-lang="js">node bench/run.js</code></pre></div>
    <table>
      <thead><tr><th>Operation</th><th>Throughput</th></tr></thead>
      <tbody>
        <tr><td><code>get()</code> cache hit (LRU)</td><td style="font-family:var(--font-mono);color:var(--col-cyan)">1,800,000 / s</td></tr>
        <tr><td><code>get()</code> no cache</td><td style="font-family:var(--font-mono);color:var(--col-cyan)">310,000 / s</td></tr>
        <tr><td><code>set()</code> simple value</td><td style="font-family:var(--font-mono);color:var(--col-cyan)">138,000 / s</td></tr>
        <tr><td><code>batch()</code> 100 ops</td><td style="font-family:var(--font-mono);color:var(--col-cyan)">196,000 ops / s</td></tr>
        <tr><td>TTL sweep 10k records</td><td style="font-family:var(--font-mono);color:var(--col-cyan)">&lt; 1ms</td></tr>
      </tbody>
    </table>
`}));

// ── FAQ ──────────────────────────────────────────────────
fs.writeFileSync(path.join(OUT, 'faq.html'), page({
  slug: 'faq', title: 'FAQ', active: 'faq',
  toc: [
    {id:'multi-process',text:'Multi-process?'},
    {id:'encryption',text:'Encryption?'},
    {id:'typescript',text:'TypeScript?'},
    {id:'memory',text:'Memory usage?'},
    {id:'corruption',text:'Corruption?'},
    {id:'wal-size',text:'Large WAL file?'},
    {id:'vs-redis',text:'vs Redis / LevelDB?'},
    {id:'import-large',text:'Large imports?'},
  ],
  prev: {href:'advanced.html',title:'Advanced Guide'},
  content: `
    <h1>FAQ</h1>

    <h2 id="multi-process">Can I use Qeed across multiple processes?</h2>
    <p><strong>For reads: yes.</strong> SQLite WAL mode allows multiple readers on the same file from different processes. For writes, only one writer can hold the lock at a time — SQLite serializes concurrent writers via <code>busy_timeout</code>.</p>
    <p><strong>The in-process cache is not shared across processes.</strong> If process A writes a value and process B has it cached, B's cache will be stale until the next cache miss (which triggers a DB read). For multi-process write-heavy workloads, either disable the cache or implement an out-of-band cache invalidation channel.</p>

    <h2 id="encryption">Does Qeed encrypt data at rest?</h2>
    <p>No. Qeed stores data in a standard SQLite file. For encryption at rest, use <strong>SQLCipher</strong> (an encrypted SQLite variant) or encrypt the storage volume at the OS level (LUKS, FileVault, BitLocker). Do not store passwords, private keys, or other secrets in Qeed without separate encryption.</p>

    <h2 id="typescript">TypeScript support?</h2>
    <p>Qeed ships JSDoc typings throughout. TypeScript users get full IntelliSense — parameter types, return types, and option autocomplete — without a separate <code>@types</code> package and without a build step. Add <code>"checkJs": true</code> to your <code>tsconfig.json</code> to enable type checking across JavaScript files that import Qeed.</p>
    <p>A separate <code>.d.ts</code> file is planned for a future release.</p>

    <h2 id="memory">How much memory does Qeed use?</h2>
    <p>Memory consumption has three components:</p>
    <ul>
      <li><strong>SQLite page cache:</strong> Controlled by <code>PRAGMA cache_size</code>. Default is -8000 (8MB). Increase for read-heavy workloads, decrease for constrained environments.</li>
      <li><strong>In-process cache:</strong> Disabled by default. When enabled, <code>maxSize</code> entries × average record size. A bucket of 1000 entries at ~1KB each ≈ 1MB.</li>
      <li><strong>Prepared statement cache:</strong> One compiled SQLite statement per distinct SQL string. Fixed at ~10–15 statements for typical usage. Negligible.</li>
    </ul>

    <h2 id="corruption">Can the database get corrupted?</h2>
    <p>SQLite with WAL mode and <code>PRAGMA synchronous=NORMAL</code> is extremely durable. The combination protects against process crashes. A power failure mid-write is the main remaining risk — use <code>PRAGMA synchronous=FULL</code> to eliminate it at a performance cost.</p>
    <p>Run <code>db.integrityCheck()</code> periodically to detect corruption early. Backup files include a SHA-256 checksum and SQLite integrity check before restore commits.</p>

    <h2 id="wal-size">The -wal file is growing. Why?</h2>
    <p>SQLite checkpoints the WAL file into the main database file automatically. If the WAL keeps growing, a long-running read transaction is holding an old snapshot and preventing the checkpoint. Look for:</p>
    <ul>
      <li>An open database connection in another process that started a read and never closed it</li>
      <li>A <code>db.tx()</code> call that is never completing</li>
    </ul>
    <p>Check <code>db.diagnostics().db.walSizeBytes</code>. Values over 64MB trigger a warning in <code>db.health()</code>.</p>

    <h2 id="vs-redis">How does Qeed compare to Redis or LevelDB?</h2>
    <table>
      <thead><tr><th></th><th>Qeed</th><th>Redis</th><th>LevelDB</th></tr></thead>
      <tbody>
        <tr><td>Storage</td><td>SQLite file</td><td>In-memory + RDB/AOF</td><td>LSM files</td></tr>
        <tr><td>Network</td><td>None (in-process)</td><td>TCP</td><td>None (in-process)</td></tr>
        <tr><td>Query</td><td>JSON field queries</td><td>Limited (SCAN, Lua)</td><td>Range scans only</td></tr>
        <tr><td>Transactions</td><td>Yes (ACID)</td><td>MULTI/EXEC (optimistic)</td><td>Batch (no rollback)</td></tr>
        <tr><td>Setup</td><td>Zero (npm install)</td><td>Separate server process</td><td>Zero</td></tr>
        <tr><td>Multi-process writes</td><td>Serialized by SQLite</td><td>Yes (single-threaded)</td><td>Single writer</td></tr>
      </tbody>
    </table>

    <h2 id="import-large">How do I import a very large export file?</h2>
    <p>The current <code>db.import()</code> loads the full payload into memory before inserting. For files over ~500MB, split the export into smaller files by namespace or collection:</p>
    <div class="code-block"><div class="code-header"><span class="code-lang">js</span><button class="copy-btn">Copy</button></div>
    <pre><code data-lang="js">// Export by collection
await db.export('./users.json',  { namespace: 'app', collection: 'users' });
await db.export('./posts.json',  { namespace: 'app', collection: 'posts' });
await db.export('./events.json', { namespace: 'app', collection: 'events' });

// Import each separately — each is its own atomic transaction
db.import('./users.json');
db.import('./posts.json');
db.import('./events.json');</code></pre></div>

    <p>NDJSON format with <code>skipInvalid: true</code> is more resilient for large imports — a single bad record does not abort the entire operation.</p>
`}));

console.log('All pages generated successfully.');
