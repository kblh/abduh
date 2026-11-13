export const CONTINENTS = { africa: 'Afrika', america: 'Amerika', asia: 'Asie', australia: 'Austrálie', europe: 'Evropa', 'middle-east': 'Blízký východ' };
export const CONTINENT_ORDER = ['africa', 'america', 'asia', 'australia', 'europe', 'middle-east'];
export const fmt = (n) => n.toLocaleString('cs-CZ');
export const plural = (n, one, few, many) => `${fmt(n)} ${n === 1 ? one : n >= 2 && n <= 4 ? few : many}`;
export const czDate = (iso) => { const [y, m, d] = String(iso).split('-').map(Number); return d ? `${d}. ${m}. ${y}` : iso; };
