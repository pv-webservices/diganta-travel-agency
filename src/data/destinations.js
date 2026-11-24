const IMG = '/media/img/gen/';

/**
 * @typedef {{ id: string, name: string, alias: string, region: string, tagline: string,
 *   image: string, intro: string, attractions: { name: string, text: string }[],
 *   reach: string, stay: string, bestFor: string[], note?: string }} Destination

 */

/** @type {Destination[]} */
const RAW = [
  {
    id: 'sri-vijaya-puram', name: 'Sri Vijaya Puram', alias: 'formerly Port Blair', region: 'South Andaman',
    tagline: 'Where every journey begins.', image: 'dest-sri-vijaya-puram',
    intro: 'The capital of the Andaman & Nicobar Islands and the gateway for every trip. Flights land at Veer Savarkar International Airport, and all the inter-island cruises leave from its jetties. It is also where the islands’ history lives — from the Cellular Jail to the ruins of Ross Island.',
    attractions: [
      { name: 'Cellular Jail & Light and Sound Show', text: 'The colonial-era prison, now a national memorial; the evening show tells the story of the freedom struggle.' },
      { name: 'Corbyn’s Cove', text: 'A palm-fringed city beach with jet ski, speedboat and sea-kart rides.' },
      { name: 'Chidiyatapu & Mount Harriet', text: 'Bird-filled mangroves, a famous sunset point and forest views from the islands’ third-highest peak.' },
      { name: 'Museums', text: 'Anthropological Museum, Samudrika Naval Marine Museum and the Fisheries Museum.' },
      { name: 'Chatham Saw Mill', text: 'One of Asia’s oldest and largest saw mills, on its own small island.' },
    ],
    reach: 'Direct flights from Chennai, Kolkata, Delhi, Bengaluru and other cities; passenger ships from Chennai, Kolkata and Visakhapatnam.',
    stay: '2–3 nights (split at the start and end of your trip)',
    bestFor: ['History', 'Sunsets', 'Shopping'],
  },
  {
    id: 'havelock', name: 'Swaraj Dweep', aka: 'Havelock', alias: 'Havelock Island', region: 'Ritchie’s Archipelago',
    tagline: 'White sands. Endless blue.', image: 'dest-havelock',
    intro: 'The most loved of the Andaman Islands: powder-white beaches, forests running down to the sea and the best dive sites in India just offshore. Radhanagar Beach holds a Blue Flag for its clean water and sand.',
    attractions: [
      { name: 'Radhanagar Beach (Beach No. 7)', text: 'A wide arc of white sand often ranked among Asia’s finest beaches; famous for sunsets.' },
      { name: 'Elephant Beach', text: 'Live corals in shallow water; snorkelling, sea walk and glass-bottom boats. Reached by speedboat or a forest trek.' },
      { name: 'Kalapathar Beach', text: 'Black rocks, white sand and turquoise water — a quiet sunrise spot.' },
      { name: 'Scuba diving', text: 'Try-dives for first-timers and certified boat dives at sites such as Nemo Reef and The Wall.' },
      { name: 'Night kayaking', text: 'Paddle through mangrove creeks lit up by bioluminescent plankton (seasonal).' },
    ],
    reach: 'Private cruise from Sri Vijaya Puram (about 1.5–2.5 hours) or government ferry; 1 hour from Shaheed Dweep.',
    stay: '2–3 nights', bestFor: ['Beaches', 'Scuba', 'Honeymoon'],
  },
  {
    id: 'neil', name: 'Shaheed Dweep', aka: 'Neil', alias: 'Neil Island', region: 'Ritchie’s Archipelago',
    tagline: 'A slower kind of paradise.', image: 'dest-neil',
    intro: 'Small, green and laid-back: cycle between villages and paddy fields, walk out on the reef at low tide and watch the sun rise and set from opposite ends of the island on the same day.',
    attractions: [
      { name: 'Natural Bridge', text: 'A rock arch formed by the sea; best seen at low tide with corals and tidal pools around it.' },
      { name: 'Laxmanpur Beach', text: 'A long white beach famous for sunsets.' },
      { name: 'Bharatpur Beach', text: 'Calm, shallow water over a living reef — snorkelling, glass-bottom boat and scuba.' },
      { name: 'Sitapur Beach', text: 'The island’s sunrise point, with limestone cliffs and rock pools.' },
    ],
    reach: 'Private cruise from Sri Vijaya Puram (about 1.5–2 hours) or from Swaraj Dweep (about 1 hour).',
    stay: '1–2 nights', bestFor: ['Slow travel', 'Snorkelling', 'Cycling'],
    note: 'Low tide matters for the Natural Bridge — we plan your visit around the tide table.',
  },
  {
    id: 'ross-island', name: 'Ross Island', alias: 'Netaji Subhas Chandra Bose Dweep', region: 'South Andaman',
    tagline: 'Stories held in the roots.', image: 'dest-ross',
    intro: 'Once the British administrative headquarters, Ross Island is now a hauntingly beautiful ruin: banyan roots grip the church, bakery and Chief Commissioner’s house, while spotted deer and peacocks roam the paths.',
    attractions: [
      { name: 'Colonial ruins', text: 'The church, bakery, water-distillation plant, swimming pool and Japanese bunkers.' },
      { name: 'Wildlife', text: 'Tame spotted deer, peacocks and rabbits on the island trails.' },
      { name: 'Light & Sound Show', text: 'An evening show on the island’s history (operating days vary).' },
    ],
    reach: 'A 15–20 minute boat ride from Aberdeen jetty (Rajiv Gandhi Water Sports Complex), usually combined with North Bay.',
    stay: 'Half-day excursion', bestFor: ['History', 'Photography', 'Families'],
    note: 'Closed on Wednesdays; boat operations depend on the weather.',
  },
  {
    id: 'north-bay', name: 'North Bay Island', alias: 'Coral Island', region: 'South Andaman',
    tagline: 'An invitation to the ocean.', image: 'dest-north-bay',
    intro: 'The lighthouse island printed on the old ₹20 note, with a coral reef just off the beach. North Bay is the easiest place in the Andamans to see corals — by sea walk, semi-submarine, glass-bottom boat or snorkel.',
    attractions: [
      { name: 'Sea walk', text: 'Walk on the seabed with a helmet supplying air — no swimming needed.' },
      { name: 'Semi-submarine & glass-bottom boats', text: 'See the reef through glass windows while staying dry.' },
      { name: 'Scuba & snorkelling', text: 'Shore dives for beginners and snorkelling over the coral garden.' },
      { name: 'Parasailing & jet ski', text: 'Fast, fun water sports on the bay.' },
    ],
    reach: 'A 20–30 minute boat ride from Aberdeen jetty; usually visited with Ross Island.',
    stay: 'Half-day excursion', bestFor: ['Water sports', 'Kids', 'Corals'],
  },
  {
    id: 'baratang', name: 'Baratang', alias: 'Middle Andaman', region: 'Middle Andaman',
    tagline: 'Nature, a little closer.', image: 'dest-baratang',
    intro: 'A day of adventure north of the capital: a convoy drive through ancient forest, a speedboat through mangrove tunnels, limestone caves shaped over millions of years and India’s only mud volcanoes.',
    attractions: [
      { name: 'Limestone caves', text: 'Reached by speedboat through mangrove creeks and a short forest walk.' },
      { name: 'Mud volcano', text: 'Small cones of bubbling grey mud, pushed up by gases from deep underground.' },
      { name: 'Parrot Island', text: 'At dusk, thousands of parakeets fly in to roost on a single mangrove island.' },
      { name: 'Baludera Beach', text: 'A quiet, curving beach near the jetty.' },
    ],
    reach: 'About 100 km by road from Sri Vijaya Puram (3 hours) including a vehicle-ferry crossing; departures join an early-morning convoy.',
    stay: 'Day trip or 1 night', bestFor: ['Nature', 'Caves', 'Adventure'],
    note: 'Start times are set by the convoy schedule — expect a 4 am pick-up.',
  },
  {
    id: 'rangat', name: 'Rangat', alias: 'Middle Andaman', region: 'Middle Andaman',
    tagline: 'Mangroves, turtles and quiet shores.', image: 'dest-rangat',
    intro: 'A green, rural stop on the way north, with eco-parks, turtle-nesting beaches and one of the longest mangrove boardwalks in the islands.',
    attractions: [
      { name: 'Dhaninallah Mangrove Walkway', text: 'A wooden boardwalk of about 700 m through dense mangroves to a beach.' },
      { name: 'Amkunj Beach', text: 'An eco-beach with driftwood benches and huts.' },
      { name: 'Cuthbert Bay', text: 'A turtle-nesting beach (December to February).' },
      { name: 'Morrice Dera', text: 'A beach with dramatic twin rocks just offshore.' },
    ],
    reach: 'About 170 km by road from Sri Vijaya Puram via Baratang, or by government ferry.',
    stay: '1 night', bestFor: ['Eco-tourism', 'Turtles'],
  },
  {
    id: 'diglipur', name: 'Diglipur', alias: 'North Andaman', region: 'North Andaman',
    tagline: 'The edge of the map.', image: 'dest-diglipur',
    intro: 'The quiet north: twin islands joined by a sandbar, the highest peak in the Andamans and beaches where sea turtles come ashore to nest.',
    attractions: [
      { name: 'Ross & Smith Islands', text: 'Two islands joined by a narrow white sandbar; swim on both sides.' },
      { name: 'Saddle Peak', text: 'A forest trek to the highest point in the Andamans (732 m).' },
      { name: 'Kalipur Beach', text: 'A nesting beach for four species of sea turtle (December to March).' },
      { name: 'Alfred Caves & mud volcano', text: 'Limestone caves and another of the islands’ mud volcanoes.' },
    ],
    reach: 'About 300 km by road from Sri Vijaya Puram (10–12 hours), or by government ship.',
    stay: '2–3 nights', bestFor: ['Offbeat', 'Trekking', 'Turtles'],
  },
  {
    id: 'barren-island', name: 'Barren Island', alias: 'India’s only active volcano', region: 'Andaman Sea',
    tagline: 'Fire at sea.', image: 'dest-barren',
    intro: 'A smoking cone rising from the deep, about 135 km north-east of Sri Vijaya Puram. Visitors view the volcano from the boat — landing is not permitted — and the surrounding waters are among the clearest dive sites in the region.',
    attractions: [
      { name: 'Volcano sail-by', text: 'See the ash slopes and lava flows from the deck.' },
      { name: 'Liveaboard diving', text: 'Advanced divers can join liveaboard trips to the island’s reefs (seasonal).' },
    ],
    reach: 'Day voyage by special cruise or charter, subject to operator schedule and sea conditions.',
    stay: 'Day voyage', bestFor: ['Bucket list', 'Diving'],
    note: 'Trips run only on select dates — ask us early.',
  },
];

export const DESTINATIONS = Object.freeze(RAW.map((d) => Object.freeze({
  ...d,
  img: `${IMG}${d.image}.webp`,
  imgSm: `${IMG}${d.image}-sm.webp`,
})));

/** @param {string} id */
export const findDestination = (id) => DESTINATIONS.find((d) => d.id === id);
