import { detailView } from './_taxonomy.js';

export const render = (ctx) => detailView(ctx, { group: 'styles', route: 'styles', listLabel: 'Styly', filterKey: 'style', kind: 'style', aboutTitle: 'O stylu', bandsMap: (s) => s.bandsByStyle });
