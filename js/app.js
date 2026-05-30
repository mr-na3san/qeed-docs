'use strict';

const Highlight = (() => {
  const tokens = [
    [/^(\/\/[^\n]*)/, 'tok-cm'],
    [/^(\/\*[\s\S]*?\*\/)/, 'tok-cm'],
    [/^(`[^`]*`)/, 'tok-str'],
    [/^('(?:[^'\\]|\\.)*')/, 'tok-str'],
    [/^("(?:[^"\\]|\\.)*")/, 'tok-str'],
    [/^(0x[0-9a-fA-F]+|\d+\.?\d*)/, 'tok-num'],
    [/^(true|false|null|undefined|NaN|Infinity)(?![a-zA-Z0-9_])/, 'tok-bool'],
    [/^(const|let|var|async|await|return|function|class|new|import|export|default|from|if|else|for|while|try|catch|throw|of|in|extends|super|this|typeof|instanceof|static|get|set|delete|void)(?![a-zA-Z0-9_])/, 'tok-kw'],
    [/^([A-Z][A-Za-z0-9]*)(?![a-zA-Z0-9_])/, 'tok-cls'],
    [/^([a-z_][a-zA-Z0-9_]*)(?=\s*\()/, 'tok-fn'],
    [/^\.([a-zA-Z_][a-zA-Z0-9_]*)/, 'tok-prop'],
    [/^([a-zA-Z_$][a-zA-Z0-9_$]*)/, 'tok-var'],
  ];

  const esc = s => s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');

  function highlight(raw) {
    let out = '';
    let i = 0;
    while (i < raw.length) {
      let hit = false;
      for (const [re, cls] of tokens) {
        const m = re.exec(raw.slice(i));
        if (!m) continue;
        if (cls === 'tok-prop') {
          out += '.<span class="' + cls + '">' + esc(m[1]) + '</span>';
        } else {
          out += '<span class="' + cls + '">' + esc(m[0]) + '</span>';
        }
        i += m[0].length;
        hit = true;
        break;
      }
      if (!hit) { out += esc(raw[i]); i++; }
    }
    return out;
  }

  function run() {
    document.querySelectorAll('pre code[data-lang]').forEach(el => {
      el.innerHTML = highlight(el.textContent);
    });
  }

  return { run };
})();

const Clipboard = (() => {
  function init() {
    document.querySelectorAll('.copy-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        const pre = btn.closest('.code-block')?.querySelector('pre');
        if (!pre) return;
        navigator.clipboard.writeText(pre.textContent.trim()).then(() => {
          btn.classList.add('copied');
          btn.textContent = '✓ Copied';
          setTimeout(() => { btn.classList.remove('copied'); btn.textContent = 'Copy'; }, 2000);
        });
      });
    });

    document.querySelectorAll('.install-copy').forEach(btn => {
      btn.addEventListener('click', () => {
        const cmd = btn.closest('.install-strip')?.querySelector('.cmd')?.textContent;
        if (!cmd) return;
        navigator.clipboard.writeText(cmd).then(() => {
          btn.textContent = '✓';
          setTimeout(() => { btn.textContent = '⎘'; }, 2000);
        });
      });
    });
  }
  return { init };
})();

const Progress = (() => {
  let bar;
  function update() {
    const el = document.documentElement;
    const pct = (el.scrollTop / (el.scrollHeight - el.clientHeight)) * 100;
    bar.style.width = Math.min(100, Math.max(0, pct)) + '%';
  }
  function init() {
    bar = document.querySelector('.progress-bar');
    if (!bar) return;
    window.addEventListener('scroll', update, { passive: true });
    update();
  }
  return { init };
})();

const SidebarNav = (() => {
  function init() {
    const current = location.pathname.split('/').pop() || 'index.html';
    document.querySelectorAll('.sidebar-link').forEach(a => {
      const href = a.getAttribute('href')?.split('/').pop();
      if (href === current) a.classList.add('active');
    });
  }
  return { init };
})();

const MobileSidebar = (() => {
  function init() {
    const btn = document.querySelector('.header-menu-btn');
    const sidebar = document.querySelector('.sidebar');
    const overlay = document.querySelector('.sidebar-overlay');
    if (!btn) return;
    const toggle = open => {
      sidebar?.classList.toggle('open', open);
      overlay?.classList.toggle('open', open);
      document.body.style.overflow = open ? 'hidden' : '';
    };
    btn.addEventListener('click', () => toggle(!sidebar?.classList.contains('open')));
    overlay?.addEventListener('click', () => toggle(false));
  }
  return { init };
})();

const FloatToc = (() => {
  function init() {
    const toc = document.querySelector('.toc-float');
    if (!toc) return;
    const headings = document.querySelectorAll('.content h2, .content h3');
    const links = document.querySelectorAll('.toc-float-link');
    if (!headings.length) return;
    const obs = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        if (!entry.isIntersecting) return;
        links.forEach(l => l.classList.remove('toc-active'));
        toc.querySelector('[href="#' + entry.target.id + '"]')?.classList.add('toc-active');
      });
    }, { rootMargin: '-20% 0px -70% 0px' });
    headings.forEach(h => h.id && obs.observe(h));
  }
  return { init };
})();

const Search = (() => {
  const index = [
    { title: 'Installation', section: 'Getting Started', href: 'pages/installation.html', snippet: 'npm install qeed Node.js 18 better-sqlite3 native addon build requirements' },
    { title: 'Quick Start', section: 'Getting Started', href: 'pages/quickstart.html', snippet: 'qeed path set get delete has first database TTL metadata namespaces batch' },
    { title: 'Configuration', section: 'Getting Started', href: 'pages/configuration.html', snippet: 'namespace collection cache metrics sweepInterval pragmas WAL synchronous' },
    { title: 'Query Builder', section: 'API', href: 'pages/query.html', snippet: 'where orWhere sort limit offset select pluck get first count exists prefix keyMatches' },
    { title: 'Transactions', section: 'API', href: 'pages/transactions.html', snippet: 'tx atomic commit rollback BEGIN IMMEDIATE nested TransactionError batch' },
    { title: 'Cache System', section: 'API', href: 'pages/cache.html', snippet: 'LRU simple cache namespace isolation invalidation hit rate eviction maxSize' },
    { title: 'API Reference', section: 'API', href: 'pages/api.html', snippet: 'set get delete has batch ttl persist namespace collection backup export import metrics diagnostics' },
    { title: 'Advanced Guide', section: 'Advanced', href: 'pages/advanced.html', snippet: 'backup restore export import events metrics diagnostics security WAL benchmarks' },
    { title: 'FAQ', section: 'Reference', href: 'pages/faq.html', snippet: 'multi-process encryption TypeScript memory corruption WAL size Redis LevelDB large imports' },
    { title: 'set()', section: 'API Reference', href: 'pages/api.html#set', snippet: 'Store a value with optional TTL collection and metadata' },
    { title: 'get()', section: 'API Reference', href: 'pages/api.html#get', snippet: 'Read a record with optional dot-notation field extraction' },
    { title: 'batch()', section: 'API Reference', href: 'pages/api.html#batch', snippet: 'Execute multiple set del operations in a single atomic transaction' },
    { title: 'backup()', section: 'API Reference', href: 'pages/api.html#backup', snippet: 'Online SQLite backup gzip compression SHA-256 checksum atomic restore' },
    { title: 'where()', section: 'Query Builder', href: 'pages/query.html#where', snippet: 'eq ne gt gte lt lte like in parameterized JSON field conditions' },
    { title: 'TTL expiration', section: 'Core Concepts', href: 'pages/quickstart.html#ttl', snippet: 'Set expiration milliseconds expired keys return null automatically' },
    { title: 'Namespaces', section: 'Core Concepts', href: 'pages/quickstart.html#namespaces', snippet: 'db namespace app collection users scoped isolation' },
    { title: 'WAL mode', section: 'Advanced', href: 'pages/advanced.html#wal', snippet: 'Write-Ahead Logging concurrent reads durable writes no locking' },
    { title: 'SQL injection protection', section: 'Security', href: 'pages/advanced.html#security', snippet: 'Parameterized queries operator whitelist identifier allowlists prototype pollution' },
    { title: 'Benchmarks', section: 'Performance', href: 'pages/advanced.html#benchmarks', snippet: '138k writes per second 310k reads 1.8M cached reads' },
    { title: 'LRU Cache', section: 'Cache System', href: 'pages/cache.html#lru', snippet: 'O1 get set evict doubly-linked list Map no external dependencies' },
    { title: 'Events', section: 'API', href: 'pages/advanced.html#events', snippet: 'set update delete clear expire error synchronous emission on once off' },
    { title: 'Diagnostics', section: 'API', href: 'pages/advanced.html#metrics', snippet: 'health diagnostics metrics slowQueryLog integrityCheck pageCount freelist' },
  ];

  function query(q) {
    if (!q || q.length < 2) return [];
    const lower = q.toLowerCase();
    return index
      .map(item => ({
        ...item,
        score: (item.title.toLowerCase().includes(lower) ? 3 : 0) +
               (item.section.toLowerCase().includes(lower) ? 1 : 0) +
               (item.snippet.toLowerCase().includes(lower) ? 2 : 0),
      }))
      .filter(i => i.score > 0)
      .sort((a, b) => b.score - a.score)
      .slice(0, 8);
  }

  function hl(text, q) {
    const re = new RegExp('(' + q.replace(/[.*+?^${}()|[\]\\]/g, '\\$&') + ')', 'gi');
    return text.replace(re, '<mark>$1</mark>').slice(0, 120);
  }

  function init() {
    const input = document.querySelector('.header-search');
    const results = document.querySelector('.search-results');
    if (!input || !results) return;

    let timer;
    input.addEventListener('input', () => {
      clearTimeout(timer);
      timer = setTimeout(() => render(input.value.trim()), 120);
    });

    input.addEventListener('keydown', e => {
      if (e.key === 'Escape') { results.classList.remove('open'); input.blur(); }
    });

    document.addEventListener('click', e => {
      if (!input.contains(e.target) && !results.contains(e.target)) results.classList.remove('open');
    });

    document.addEventListener('keydown', e => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') { e.preventDefault(); input.focus(); input.select(); }
    });

    function render(q) {
      if (!q) { results.classList.remove('open'); return; }
      const hits = query(q);
      results.innerHTML = hits.length
        ? hits.map(h => `<a class="search-result-item" href="${h.href}"><div class="search-result-title">${h.title}</div><div class="search-result-section">${h.section}</div><div class="search-result-snippet">${hl(h.snippet, q)}</div></a>`).join('')
        : `<div class="search-empty">No results for "<strong>${q}</strong>"</div>`;
      results.classList.add('open');
    }
  }
  return { init };
})();

const Anchors = (() => {
  function init() {
    document.querySelectorAll('a[href^="#"]').forEach(a => {
      a.addEventListener('click', e => {
        const target = document.querySelector(a.getAttribute('href'));
        if (!target) return;
        e.preventDefault();
        target.scrollIntoView({ behavior: 'smooth', block: 'start' });
        history.pushState(null, '', a.getAttribute('href'));
      });
    });
  }
  return { init };
})();

document.addEventListener('DOMContentLoaded', () => {
  Highlight.run();
  Clipboard.init();
  Progress.init();
  SidebarNav.init();
  MobileSidebar.init();
  FloatToc.init();
  Search.init();
  Anchors.init();
});
