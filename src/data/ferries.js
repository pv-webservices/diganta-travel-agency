// Inter-island routes & operators. Durations and fares are typical, not live:
// operators change schedules by season — the site always says so next to them.

/**
 * @typedef {{ id: string, from: string, to: string, fromId: string, toId: string,
 *   mode: 'cruise' | 'boat' | 'road', duration: string, operators: string[],
 *   departures: string, fare?: string, note: string }} FerryRoute
 */

/** @type {FerryRoute[]} */
export const FERRY_ROUTES = Object.freeze([
  {
    id: 'svp-havelock', from: 'Sri Vijaya Puram', to: 'Swaraj Dweep', fromId: 'sri-vijaya-puram', toId: 'havelock',
    mode: 'cruise', duration: '1 hr 30 min – 2 hr 30 min',
    operators: ['Makruzz', 'Nautika', 'Green Ocean', 'ITT Majestic', 'Government ferry'],
    departures: 'Morning (6:00–8:00 AM) & afternoon (1:00–2:00 PM)', fare: 'approx. ₹1,500 – ₹2,000',
    note: 'The busiest route — book private cruises well in advance in peak season.',
  },
  {
    id: 'havelock-neil', from: 'Swaraj Dweep', to: 'Shaheed Dweep', fromId: 'havelock', toId: 'neil',
    mode: 'cruise', duration: '45 min – 1 hr',
    operators: ['Makruzz', 'Nautika', 'Green Ocean', 'ITT Majestic', 'Government ferry'],
    departures: 'Morning & early afternoon', fare: 'approx. ₹1,300 – ₹1,700',
    note: 'Short hop between the two most popular islands.',
  },
  {
    id: 'neil-svp', from: 'Shaheed Dweep', to: 'Sri Vijaya Puram', fromId: 'neil', toId: 'sri-vijaya-puram',
    mode: 'cruise', duration: '1 hr 15 min – 2 hr',
    operators: ['Makruzz', 'Nautika', 'Green Ocean', 'Government ferry'],
    departures: 'Morning & afternoon', fare: 'approx. ₹1,400 – ₹1,900',
    note: 'Most itineraries end the island loop on this route.',
  },
  {
    id: 'svp-ross-northbay', from: 'Sri Vijaya Puram', to: 'Ross Island & North Bay', fromId: 'sri-vijaya-puram', toId: 'north-bay',
    mode: 'boat', duration: '15 – 30 min each way',
    operators: ['Boats from Aberdeen jetty (Rajiv Gandhi Water Sports Complex)'],
    departures: 'From 8:30 AM; combined half-day trip', fare: 'Boat tickets bought at the jetty',
    note: 'Ross Island is closed on Wednesdays. Weather can suspend boats.',
  },
  {
    id: 'svp-baratang', from: 'Sri Vijaya Puram', to: 'Baratang', fromId: 'sri-vijaya-puram', toId: 'baratang',
    mode: 'road', duration: '≈ 3 hr by road + vehicle ferry',
    operators: ['Private AC cab in convoy', 'Speedboat to the limestone caves'],
    departures: 'Convoy from Jirkatang check post, first at 6:00 AM',
    note: 'An early 4 AM start from your hotel. Photography is not allowed in the reserve forest.',
  },
  {
    id: 'svp-diglipur', from: 'Sri Vijaya Puram', to: 'Diglipur', fromId: 'sri-vijaya-puram', toId: 'diglipur',
    mode: 'road', duration: '10 – 12 hr by road · overnight by ship',
    operators: ['Private cab via the Andaman Trunk Road', 'Government ship'],
    departures: 'Early morning by road; ship on select days',
    note: 'Best broken up with nights at Rangat or Mayabunder.',
  },
  {
    id: 'havelock-barren', from: 'Sri Vijaya Puram / Swaraj Dweep', to: 'Barren Island', fromId: 'havelock', toId: 'barren-island',
    mode: 'boat', duration: 'Full-day voyage',
    operators: ['Special cruise or private charter'],
    departures: 'Select dates only',
    note: 'Sail-by only; landing on the island is not permitted.',
  },
]);

/** @typedef {{ name: string, vessel: string, classes: string, about: string }} Operator */

/** @type {Operator[]} */
export const FERRY_OPERATORS = Object.freeze([
  { name: 'Makruzz', vessel: 'Makruzz, Makruzz Gold, Makruzz Pearl', classes: 'Premium · Deluxe · Royal', about: 'Large air-conditioned catamarans; the most frequent private service.' },
  { name: 'Nautika', vessel: 'Nautika & Nautika Lite (formerly Sea Link)', classes: 'Luxury · Premium · Business', about: 'Among the fastest crossings, with comfortable reclining seats.' },
  { name: 'Green Ocean', vessel: 'Green Ocean 1 & 2', classes: 'Economy · Luxury · Royal', about: 'Budget-friendly private cruise with a choice of decks.' },
  { name: 'ITT Majestic', vessel: 'ITT Majestic', classes: 'Premium · Deluxe · Business', about: 'A newer high-speed catamaran on the Havelock–Neil circuit.' },
  { name: 'Government ferry', vessel: 'DSS ferries', classes: 'Bunk · Deluxe', about: 'The cheapest option; tickets sold at the counter and in limited numbers.' },
]);

export const FERRY_TIPS = Object.freeze([
  'Book private cruises 2–4 weeks ahead from October to January; seats sell out.',
  'Avoid inter-island crossings on your arrival day — flight delays are common.',
  'Reach the jetty 45–60 minutes before departure with a government photo ID.',
  'Sea conditions can change schedules; we re-confirm every sailing a day before.',
]);
