export const data = {
  bands: [
    { id: 'tinariwen', name: 'Tinariwen', countries: ['mali', 'algeria'], styles: ['desert-blues'], instruments: ['guitar'], added: '2026-11-10' },
    { id: 'ali-farka-toure', name: 'Ali Farka Touré', countries: ['mali'], styles: ['desert-blues'], instruments: ['guitar'] },
    { id: 'kora-man', name: 'Kora Man', countries: ['mali'], instruments: ['kora'] },
    { id: 'ballake', name: 'Ballaké Sissoko', countries: ['mali'], instruments: ['kora'] },
    { id: 'rai-band', name: 'Raï Band', countries: ['algeria'], styles: ['rai'], tags: ['woman'] },
    { id: 'lonely', name: 'Lonely' },
  ],
  cds: [
    { id: 'tinariwen-tassili', name: 'Tassili', bands: ['tinariwen'], year: 2011, added: '2026-11-12' },
    { id: 'ghost-cd', name: 'Ghost', bands: ['nobody'] },
  ],
  shelves: [{ id: 'desert', name: 'Desert', bands: ['tinariwen'], cds: ['tinariwen-tassili'] }, { id: 'empty', name: 'Empty' }],
  countries: [{ id: 'mali', name: 'Mali', continent: 'africa' }, { id: 'algeria', name: 'Algeria', continent: 'africa' }],
  styles: [{ id: 'desert-blues', name: 'desert-blues' }, { id: 'rai', name: 'rai' }],
  instruments: [{ id: 'guitar', name: 'guitar' }, { id: 'kora', name: 'kora', icon: '🪕' }],
};
