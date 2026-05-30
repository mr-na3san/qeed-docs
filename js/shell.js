'use strict';

const NAV = [
  {
    label: 'Getting Started',
    links: [
      { text: 'Home',          href: '../index.html' },
      { text: 'Installation',  href: 'installation.html' },
      { text: 'Quick Start',   href: 'quickstart.html' },
      { text: 'Configuration', href: 'configuration.html' },
    ],
  },
  {
    label: 'API',
    links: [
      { text: 'Query Builder', href: 'query.html' },
      { text: 'Transactions',  href: 'transactions.html' },
      { text: 'Cache System',  href: 'cache.html' },
      { text: 'API Reference', href: 'api.html', badge: 'full' },
    ],
  },
  {
    label: 'Advanced',
    links: [
      { text: 'Advanced Guide', href: 'advanced.html' },
      { text: 'FAQ',            href: 'faq.html' },
    ],
  },
];

if (typeof module !== 'undefined') module.exports = { NAV };
