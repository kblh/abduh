import { registerView } from './_taxonomy.js';

export const render = (ctx) => registerView(ctx, { group: 'instruments', route: 'instruments', title: 'Nástroje', note: 'od A do Z', placeholder: 'najít nástroj…', bandsMap: (s) => s.bandsByInstrument, icons: true });
