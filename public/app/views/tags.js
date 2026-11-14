import { registerView } from './_taxonomy.js';

export const render = (ctx) => registerView(ctx, { group: 'tags', route: 'tags', title: 'Tagy', note: 'štítky na kapelách', placeholder: 'najít tag…', bandsMap: (s) => s.bandsByTag });
