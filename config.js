// K-beauty SKU ranking universe — brands tracked on Amazon Beauty bestseller
// lists (US/UK/FR/ES/DE). Brands with a `ticker` are Korea-listed; the rest
// are private or foreign — kept in the universe so they show up correctly
// as "no ticker yet" rather than falling into Unmapped.
// Mirrored from mooboard-clone/config.js — keep the two in sync by hand
// until mooboard-clone is retired in favor of this project.
const KBEAUTY_BRAND_UNIVERSE = [
  { name: 'Medicube', aliases: ['medicube'], ticker: '278470.KS' },
  { name: "d'Alba", aliases: ["d'alba", 'dalba'], ticker: '483650.KS' },
  { name: 'COSRX', aliases: ['cosrx'], ticker: '090430.KS' },
  { name: 'Anua', aliases: ['anua'] },
  { name: 'Beauty of Joseon', aliases: ['beauty of joseon'] },
  { name: 'Torriden', aliases: ['torriden'] },
  { name: 'Round Lab', aliases: ['round lab', 'roundlab'] },
  { name: 'SKIN1004', aliases: ['skin1004', 'skin 1004'] },
  { name: 'numbuzin', aliases: ['numbuzin'] },
  { name: 'Some By Mi', aliases: ['some by mi', 'somebymi'] },
  { name: 'Isntree', aliases: ['isntree'] },
  { name: 'Tirtir', aliases: ['tirtir'] },
  { name: 'Biodance', aliases: ['biodance'] },
  { name: 'celimax', aliases: ['celimax'] },
  { name: "Dr.Althea", aliases: ['dr.althea', 'dr althea'] },
  { name: 'TOCOBO', aliases: ['tocobo'] },
  { name: 'Purito', aliases: ['purito'] },
  { name: 'Cosmax', aliases: ['cosmax'], ticker: '192820.KS' },
  { name: 'Kolmar Korea', aliases: ['kolmar'], ticker: '161890.KS' },
];
