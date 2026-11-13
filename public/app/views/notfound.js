import { h } from '../ui/dom.js';

export function render() {
  return h('section', { class: 'notfound' },
    h('p', { class: 'eyebrow' }, 'CHYBA 404'),
    h('h1', null, 'Tahle kartička v krabici chybí.'),
    h('p', null, 'Odkaz vede na kapelu, zemi nebo cédéčko, které ve sbírce není – možná přejmenované, možná překlep.'),
    h('p', { class: 'actions' }, h('a', { class: 'stamp', href: '#/' }, 'ZPĚT DOMŮ')),
  );
}
