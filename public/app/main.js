import { h, svg } from './ui/dom.js';
import { initTheme, toggleTheme, effectiveTheme } from './ui/theme.js';
import { parseHash, buildHash } from './router.js';
import { loadData, buildStore } from './store.js';
import { buildIndex } from './search.js';

const NAV = [['home', 'Domů', '#/'], ['bands', 'Kapely', '#/bands'], ['cds', 'CD', '#/cds'], ['styles', 'Styly', '#/styles'], ['instruments', 'Nástroje', '#/instruments'], ['countries', 'Země', '#/countries'], ['shelves', 'Poličky', '#/shelves'], ['tags', 'Tagy', '#/tags']];
const SECTION = { band: 'bands', cd: 'cds', style: 'styles', instrument: 'instruments', country: 'countries', shelf: 'shelves', tag: 'tags', search: 'search' };
const DETAIL_GROUP = { band: 'bands', cd: 'cds', style: 'styles', instrument: 'instruments', country: 'countries', shelf: 'shelves', tag: 'tags' };
const SEARCH_ICON = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" aria-hidden="true"><circle cx="10.5" cy="10.5" r="6.5"/><path d="M15.5 15.5L21 21"/></svg>';

let ctx = null;
let headerInput = null;
let navLinks = [];
let tabLinks = [];
const mount = h('main', { id: 'app', class: 'paper' });

export function setQuery(q, { rerender = true } = {}) {
  const { route } = parseHash(location.hash);
  const url = buildHash('search', { query: { q } });
  if (route === 'search') history.replaceState(null, '', url);
  else history.pushState(null, '', url);
  if (rerender) render();
}

function buildShell() {
  headerInput = h('input', { type: 'search', placeholder: 'hledat všude…', 'aria-label': 'Hledat', autocomplete: 'off', onInput: (e) => setQuery(e.target.value) });
  navLinks = NAV.map(([key, label, href]) => h('a', { href, dataset: { key } }, label));
  tabLinks = NAV.slice(0, 6).map(([key, label, href]) => h('a', { href, dataset: { key } }, label));
  const themeBtn = h('button', { class: 'theme-toggle', type: 'button', 'aria-label': 'Přepnout světlý/tmavý motiv', onClick: () => { toggleTheme(); themeBtn.textContent = effectiveTheme() === 'dark' ? 'noc' : 'den'; } }, effectiveTheme() === 'dark' ? 'noc' : 'den');
  const shell = h('div', { class: 'shell' },
    h('header', { class: 'header' },
      h('a', { class: 'logo', href: '#/' }, h('img', { class: 'logo-img', src: 'logo.svg', alt: '', width: 32, height: 32 }), 'Abduh'),
      h('nav', { class: 'nav', 'aria-label': 'Hlavní' }, navLinks),
      h('div', { class: 'header-tools' },
        h('label', { class: 'search-field header-search' }, svg(SEARCH_ICON), headerInput, h('kbd', null, '/')),
        h('a', { class: 'search-link', href: '#/search', 'aria-label': 'Hledat' }, svg(SEARCH_ICON)),
        themeBtn)),
    mount,
    h('nav', { class: 'tabbar', 'aria-label': 'Sekce' }, tabLinks));
  document.getElementById('shell').replaceWith(shell);
  document.addEventListener('keydown', (e) => {
    if (e.key === '/' && !/^(INPUT|TEXTAREA|SELECT)$/.test(document.activeElement?.tagName) && !e.metaKey && !e.ctrlKey) {
      e.preventDefault();
      (document.querySelector('.big-search input') ?? headerInput).focus();
    }
  });
}

function setActive(route) {
  const key = route === 'home' ? 'home' : SECTION[route] ?? route;
  for (const a of [...navLinks, ...tabLinks]) {
    if (a.dataset.key === key) a.setAttribute('aria-current', 'page'); else a.removeAttribute('aria-current');
  }
}

async function loadView(route) {
  const name = route === 'notfound' ? 'notfound' : route;
  try {
    return await import(`./views/${name}.js`);
  } catch (e) {
    console.warn(`view ${name} unavailable`, e);
    return import('./views/notfound.js');
  }
}

const scrollMem = new Map();
let popped = false;
addEventListener('popstate', () => { popped = true; });
addEventListener('scroll', () => scrollMem.set(location.hash, scrollY), { passive: true });

let renderToken = 0;
export async function render() {
  if (!ctx) return;
  const token = ++renderToken;
  let { route, id, query } = parseHash(location.hash);
  const group = DETAIL_GROUP[route];
  if (group && !ctx.store.byId[group].has(id)) route = 'notfound';
  setActive(route);
  document.body.dataset.route = route;
  if (route !== 'search' && headerInput) headerInput.value = '';
  else if (headerInput && document.activeElement !== headerInput) headerInput.value = query.q ?? '';
  const view = await loadView(route);
  if (token !== renderToken) return;
  const refocus = document.activeElement?.closest?.('.big-search') ? true : false;
  mount.replaceChildren(view.render({ ...ctx, params: { id, query }, today: new Date() }));
  if (refocus) {
    const input = mount.querySelector('.big-search input');
    if (input) { input.focus(); input.setSelectionRange(input.value.length, input.value.length); }
  }
  if (route !== 'search') scrollTo({ top: popped ? scrollMem.get(location.hash) ?? 0 : 0, behavior: 'instant' });
  popped = false;
}

async function start() {
  initTheme();
  buildShell();
  const dataUrl = new URLSearchParams(location.search).get('fixture') ? 'dev/fixture.json' : 'data.json';
  mount.replaceChildren(h('p', { class: 'state' }, 'načítám sbírku…'));
  const load = async () => {
    try {
      const store = buildStore(await loadData(dataUrl));
      ctx = { store, index: buildIndex(store), setQuery };
      render();
    } catch (e) {
      mount.replaceChildren(h('div', { class: 'state' }, 'Sbírku se nepodařilo načíst.', h('br'), h('button', { class: 'stamp', type: 'button', onClick: () => { mount.replaceChildren(h('p', { class: 'state' }, 'načítám sbírku…')); load(); } }, 'ZKUSIT ZNOVU')));
    }
  };
  addEventListener('hashchange', render);
  await load();
}

start();
