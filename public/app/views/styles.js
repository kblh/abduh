import { registerView } from './_taxonomy.js';

export const render = (ctx) => registerView(ctx, { group: 'styles', route: 'styles', title: 'Styly', note: 'rejstřík jako na konci knihy', placeholder: 'najít styl…', bandsMap: (s) => s.bandsByStyle });
