// Reusable itinerary days. Packages are assembled from these so that the
// wording of a given excursion stays identical everywhere it appears.
// Each factory returns a fresh object: { title, text, stay, tags }.

const SVP = 'Sri Vijaya Puram';
const HAVELOCK = 'Swaraj Dweep (Havelock)';
const NEIL = 'Shaheed Dweep (Neil)';

const day = (title, text, stay, tags = []) => ({ title, text, stay, tags });

export const D = {
  arrive: () => day(
    'Arrive Sri Vijaya Puram · Cellular Jail & Light and Sound Show',
    'Our representative meets you at Veer Savarkar International Airport and drives you to your hotel. After lunch, visit Corbyn’s Cove beach, then the Cellular Jail National Memorial in the late afternoon. Stay on for the evening Light & Sound Show that retells the story of India’s freedom fighters.',
    SVP, ['Airport pick-up', 'Cellular Jail', 'Corbyn’s Cove'],
  ),
  arriveHoneymoon: () => day(
    'Arrive Sri Vijaya Puram · Welcome to the islands',
    'A warm welcome at the airport and a private transfer to your sea-view hotel, with your room decorated for the occasion. Slow afternoon at Corbyn’s Cove, then the Cellular Jail Light & Sound Show under the stars.',
    SVP, ['Private transfer', 'Room decoration', 'Light & Sound Show'],
  ),
  rossNorthBay: () => day(
    'Ross Island & North Bay (Coral Island)',
    'Take the boat from Aberdeen jetty to Ross Island (Netaji Subhas Chandra Bose Dweep) — the old British headquarters where banyan roots have swallowed the church, bakery and officers’ quarters, and deer wander the paths. Continue to North Bay, the coral island on the ₹20 note, for sea walk, semi-submarine, glass-bottom boat or snorkelling (at own cost).',
    SVP, ['Ross Island', 'North Bay', 'Water sports'],
  ),
  toHavelock: () => day(
    'Cruise to Swaraj Dweep · Radhanagar Beach sunset',
    'Morning transfer to the jetty for the private cruise to Swaraj Dweep (Havelock). Check in, rest, then head to Radhanagar Beach — a Blue Flag beach often ranked among Asia’s finest — for a swim and a long, golden sunset.',
    HAVELOCK, ['Private cruise', 'Radhanagar Beach'],
  ),
  elephantBeach: () => day(
    'Elephant Beach by speedboat',
    'A short speedboat ride to Elephant Beach, where live corals sit in clear shallow water. Snorkel, try a sea walk or glass-bottom boat ride, or simply relax on the sand (activities at own cost; the beach is open in the first half of the day). Evening at leisure.',
    HAVELOCK, ['Elephant Beach', 'Snorkelling'],
  ),
  havelockLeisure: () => day(
    'Kalapathar sunrise & a day at your own pace',
    'Catch sunrise among the black rocks of Kalapathar Beach. The rest of the day is yours — book a try-dive or a certified boat dive, go kayaking through mangrove creeks, or return to Radhanagar for one more sunset.',
    HAVELOCK, ['Kalapathar', 'Scuba (optional)'],
  ),
  havelockToNeil: () => day(
    'Cruise to Shaheed Dweep · Natural Bridge & Laxmanpur sunset',
    'Cruise across to Shaheed Dweep (Neil). Visit the Natural Bridge rock formation at low tide, with its tidal pools and corals, and end the day watching the sun set from Laxmanpur Beach.',
    NEIL, ['Natural Bridge', 'Laxmanpur Beach'],
  ),
  kalapatharToNeil: () => day(
    'Kalapathar Beach, then cruise to Shaheed Dweep',
    'Morning at Kalapathar Beach, where black rocks meet white sand and forest. Afternoon cruise to Shaheed Dweep (Neil); evening walk on Laxmanpur Beach and a visit to the Natural Bridge.',
    NEIL, ['Kalapathar', 'Natural Bridge'],
  ),
  elephantThenNeil: () => day(
    'Elephant Beach, then cruise to Shaheed Dweep',
    'Morning speedboat to Elephant Beach for snorkelling in the coral shallows. After lunch, cruise to Shaheed Dweep (Neil) and watch the sunset from Laxmanpur Beach.',
    NEIL, ['Elephant Beach', 'Laxmanpur Beach'],
  ),
  neilFull: () => day(
    'Sitapur sunrise & Bharatpur Beach',
    'Early sunrise at Sitapur Beach on the island’s eastern tip. Later, swim and snorkel on the living reef at Bharatpur Beach, or take a glass-bottom boat over the corals. Cycle between villages and paddy fields in the afternoon.',
    NEIL, ['Sitapur sunrise', 'Bharatpur Beach'],
  ),
  neilToSvp: () => day(
    'Bharatpur Beach, return cruise to Sri Vijaya Puram',
    'A last swim at Bharatpur Beach, then the cruise back to Sri Vijaya Puram. Evening free for shopping at Aberdeen Bazaar.',
    SVP, ['Bharatpur Beach', 'Return cruise'],
  ),
  neilToSvpMuseums: () => day(
    'Return cruise · Museums of Sri Vijaya Puram',
    'Cruise back to Sri Vijaya Puram. In the afternoon visit the Anthropological Museum and the Samudrika Naval Marine Museum to understand the islands’ tribes, corals and marine life. Free evening.',
    SVP, ['Return cruise', 'Museums'],
  ),
  neilToSvpChidiyatapu: () => day(
    'Return cruise · Chidiyatapu sunset',
    'Cruise back to Sri Vijaya Puram. After lunch, drive 28 km to Chidiyatapu at the southern tip of South Andaman — mangroves, birdsong and one of the islands’ best sunsets.',
    SVP, ['Return cruise', 'Chidiyatapu'],
  ),
  cityTour: () => day(
    'Sri Vijaya Puram city tour & shopping',
    'Explore the capital: the Anthropological Museum, Fisheries Museum, Samudrika Naval Marine Museum and the century-old Chatham Saw Mill. After lunch relax at Corbyn’s Cove, then shop for pearls, shell craft and spices at Aberdeen Bazaar.',
    SVP, ['Museums', 'Chatham Saw Mill', 'Shopping'],
  ),
  chidiyatapu: () => day(
    'Mount Harriet & Chidiyatapu sunset',
    'Drive through forest to Mount Harriet (Mount Manipur) for sweeping views of the islands, then on to Chidiyatapu for birdwatching along the mangroves and a sunset over the sea.',
    SVP, ['Mount Harriet', 'Chidiyatapu'],
  ),
  baratangDayTrip: () => day(
    'Baratang day trip · Limestone caves & mud volcano',
    'An early start (around 4 am) to join the first convoy from Jirkatang check post through the Jarawa reserve forest. At Baratang, a speedboat glides through tunnels of mangroves to the limestone caves; a short ride takes you to the bubbling mud volcano. Return to Sri Vijaya Puram by evening.',
    SVP, ['Convoy drive', 'Limestone caves', 'Mud volcano'],
  ),
  departure: () => day(
    'Departure with island memories',
    'Breakfast, check out and a comfortable drop at the airport for your onward flight. Leave with sand in your shoes and a camera full of blue.',
    null, ['Airport drop'],
  ),
  departureByCruise: () => day(
    'Return cruise & departure',
    'Morning cruise back to Sri Vijaya Puram, where our driver meets you at the jetty and drops you at the airport for your onward flight.',
    null, ['Return cruise', 'Airport drop'],
  ),
  candlelitDinner: () => day(
    'Elephant Beach & a candlelit dinner on the sand',
    'Snorkel together in the clear shallows of Elephant Beach in the morning. In the evening, a private candlelit dinner is set up on the beach, with the sound of the waves for music.',
    HAVELOCK, ['Elephant Beach', 'Candlelit dinner'],
  ),
  honeymoonNeil: () => day(
    'Cruise to Shaheed Dweep · Natural Bridge & sunset for two',
    'Cruise to the quieter island of Neil. Walk out to the Natural Bridge at low tide, cycle the village lanes, and watch the sunset from Laxmanpur Beach.',
    NEIL, ['Natural Bridge', 'Laxmanpur sunset'],
  ),
  honeymoonReturn: () => day(
    'Sitapur sunrise · return to Sri Vijaya Puram',
    'Wake early for sunrise at Sitapur, then cruise back to Sri Vijaya Puram. Evening at leisure — perhaps a dinner cruise or shopping for pearls at Aberdeen Bazaar.',
    SVP, ['Sitapur sunrise', 'Return cruise'],
  ),
  familyRossNorthBay: () => day(
    'Ross Island deer & North Bay glass-bottom boats',
    'Kids love Ross Island’s friendly deer and peacocks among the ruins. At North Bay, everyone can see the corals from a glass-bottom boat or semi-submarine — no swimming needed (activities at own cost).',
    SVP, ['Ross Island', 'Glass-bottom boat'],
  ),
  familyElephant: () => day(
    'Elephant Beach fun day',
    'A short speedboat ride to Elephant Beach for gentle snorkelling in shallow water, sand castles and a picnic lunch. Evening on Radhanagar Beach.',
    HAVELOCK, ['Elephant Beach', 'Snorkelling'],
  ),
  seaWalkDay: () => day(
    'North Bay sea walk & Ross Island',
    'Walk on the seabed at North Bay with a helmet supplying air — no swimming needed — among clownfish and sergeant-majors. Afternoon among the ruins of Ross Island.',
    SVP, ['Sea walk', 'Ross Island'],
  ),
  scubaDay: () => day(
    'Scuba dive & night kayaking',
    'A morning boat dive at one of Swaraj Dweep’s reef sites with a certified instructor — first-timers welcome. After dark, paddle through a mangrove lagoon where every stroke glows blue with bioluminescence (seasonal).',
    HAVELOCK, ['Scuba diving', 'Night kayaking'],
  ),
  snorkelNeilReturn: () => day(
    'Snorkel Shaheed Dweep · return to Sri Vijaya Puram',
    'Early cruise to Shaheed Dweep for snorkelling over the reef at Bharatpur and a walk to the Natural Bridge. Evening cruise back to Sri Vijaya Puram.',
    SVP, ['Snorkelling', 'Natural Bridge'],
  ),
  toBaratangStay: () => day(
    'Convoy to Baratang · Limestone caves & Parrot Island',
    'Join the early convoy north through the reserve forest. Speedboat through mangrove creeks to the limestone caves, visit the mud volcano, and at dusk watch thousands of parrots return to roost on Parrot Island.',
    'Baratang', ['Limestone caves', 'Mud volcano', 'Parrot Island'],
  ),
  toRangat: () => day(
    'Rangat · Dhaninallah mangrove walk & Amkunj beach',
    'Continue north to Rangat. Walk the 700-metre wooden boardwalk through the Dhaninallah mangroves, relax at Amkunj eco-beach and visit Cuthbert Bay, a turtle-nesting beach.',
    'Rangat', ['Dhaninallah', 'Amkunj Beach', 'Cuthbert Bay'],
  ),
  toDiglipur: () => day(
    'Mayabunder to Diglipur',
    'Drive through Mayabunder, stopping at Karmatang Beach, and on to Diglipur in North Andaman — the quietest corner of the islands. Evening at Kalipur Beach.',
    'Diglipur', ['Mayabunder', 'Karmatang Beach'],
  ),
  rossSmith: () => day(
    'Ross & Smith twin islands',
    'A boat from Aerial Bay jetty to Ross & Smith, two islands joined by a dazzling white sandbar with clear water on both sides — swim, snorkel and picnic. (Permit arranged by us.)',
    'Diglipur', ['Ross & Smith', 'Sandbar'],
  ),
  saddlePeak: () => day(
    'Saddle Peak trek or Kalipur turtle beach',
    'Trek through rainforest to Saddle Peak, the highest point in the Andamans (732 m), or take it easy at Kalipur and Lamiya Bay. In season (December–March) watch for nesting turtles.',
    'Diglipur', ['Saddle Peak', 'Kalipur Beach'],
  ),
  diglipurReturn: () => day(
    'Return to Sri Vijaya Puram',
    'A long scenic drive south along the Andaman Trunk Road through forests and small towns, back to Sri Vijaya Puram. Evening at leisure.',
    SVP, ['Scenic drive'],
  ),
  barrenIsland: () => day(
    'Barren Island day voyage',
    'Sail out to Barren Island, India’s only active volcano, rising straight out of the deep sea. View the smoking cone and black lava slopes from the deck — landing is not permitted. (Subject to operator schedule and sea conditions.)',
    SVP, ['Barren Island', 'Volcano'],
  ),
  mayabunderStay: () => day(
    'Convoy to Baratang, then on to Mayabunder',
    'Leave around 4 am for the first convoy from Jirkatang. See the Baratang limestone caves and mud volcano, then continue north to Mayabunder for the night.',
    'Mayabunder', ['Baratang', 'Limestone caves'],
  ),
  diglipurFromMayabunder: () => day(
    'Diglipur · Ross & Smith twin islands',
    'Drive about 80 km north to Diglipur and take the boat to Ross & Smith islands, joined by a white sandbar. Check in by late afternoon.',
    'Diglipur', ['Ross & Smith'],
  ),
  rangatBeaches: () => day(
    'Rangat beaches',
    'An early start for the drive to Rangat (100–110 km). Afternoon at Amkunj Beach, Cuthbert Bay and Morrice Dera.',
    'Rangat', ['Amkunj', 'Cuthbert Bay', 'Morrice Dera'],
  ),
  rangatToSvp: () => day(
    'Back to Sri Vijaya Puram through the heartland',
    'Drive about 170 km south through the heart of the islands, back to Sri Vijaya Puram for the night.',
    SVP, ['Scenic drive'],
  ),
};
