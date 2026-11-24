// Business contact details — taken from the Diganta Travels Google Business Profile.
// Update here and every call / WhatsApp / email link on the site follows
// (elements carrying data-tel, data-wa, data-mail are rewired at runtime).
export const CONTACT = Object.freeze({
  company: 'Diganta Travels Pvt. Ltd.',
  phoneDisplay: '+91 80016 61774',
  phoneTel: '+918001661774',
  whatsapp: '918001661774',
  email: 'info@digantatravels.in',
  instagram: 'https://www.instagram.com/andamandiganta/',
  address: 'Katchal Inn Hotel, Babu Lane, Mohanpura, Sri Vijaya Puram, Andaman & Nicobar Islands 744101',
  mapsUrl: 'https://www.google.com/maps/search/?api=1&query=Diganta+Travels+Sri+Vijaya+Puram',
  rating: '5.0',
  reviewCount: '1,143',
  years: 17,
});

/** @param {string} message @returns {string} */
export const whatsappUrl = (message) =>
  `https://wa.me/${CONTACT.whatsapp}?text=${encodeURIComponent(message)}`;

export const DEFAULT_WA_MESSAGE =
  'Hi Diganta Travels! I would like to plan a trip to the Andaman Islands.';
