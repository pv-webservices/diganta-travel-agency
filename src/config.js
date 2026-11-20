// Business contact details — taken from the Diganta Travels Google Business Profile.
// Update here and every call / WhatsApp link on the site follows.
export const CONTACT = {
  phoneDisplay: '080016 61774',
  phoneTel: '+918001661774',
  whatsapp: '918001661774',
  instagram: 'https://www.instagram.com/andamandiganta/',
};

export const whatsappUrl = (message) =>
  `https://wa.me/${CONTACT.whatsapp}?text=${encodeURIComponent(message)}`;

export const DEFAULT_WA_MESSAGE =
  'Hi Diganta Travels! I would like to plan a trip to the Andaman Islands.';
