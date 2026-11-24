// Shared behaviour for every page. Page entry files import this first.
import './styles/base.css';
import './styles/layout.css';
import './styles/components.css';
import './styles/ferry.css';

import { CONTACT, whatsappUrl, DEFAULT_WA_MESSAGE } from './config.js';

document.documentElement.classList.add('js');
const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

/** Rewires every phone / WhatsApp / email / Instagram link from config.js. */
function initContactLinks() {
  document.querySelectorAll('[data-tel]').forEach((a) => { a.href = `tel:${CONTACT.phoneTel}`; });
  document.querySelectorAll('[data-phone-text]').forEach((el) => { el.textContent = CONTACT.phoneDisplay; });
  document.querySelectorAll('[data-mail]').forEach((a) => { a.href = `mailto:${CONTACT.email}`; });
  document.querySelectorAll('[data-mail-text]').forEach((el) => { el.textContent = CONTACT.email; });
  document.querySelectorAll('[data-ig]').forEach((a) => { a.href = CONTACT.instagram; });
  document.querySelectorAll('[data-wa]').forEach((a) => {
    a.href = whatsappUrl(a.dataset.wa || DEFAULT_WA_MESSAGE);
  });
  document.querySelectorAll('[data-address]').forEach((el) => { el.textContent = CONTACT.address; });
  document.querySelectorAll('[data-maps]').forEach((a) => { a.href = CONTACT.mapsUrl; });
  document.querySelectorAll('[data-year]').forEach((el) => { el.textContent = String(new Date().getFullYear()); });
}

/**
 * Keeps keyboard focus inside an open overlay by making every other
 * top-level element inert. Call with `false` to restore the page.
 * @param {HTMLElement} overlay @param {boolean} on
 */
export function isolate(overlay, on) {
  [...document.body.children].forEach((el) => {
    if (el !== overlay && !el.contains(overlay) && el.tagName !== 'SCRIPT') el.inert = on;
  });
  document.body.style.overflow = on ? 'hidden' : '';
}

/** Marks the current page in the main nav and the mobile drawer. */
function markActiveNav() {
  const page = document.body.dataset.page;
  const groups = { package: 'packages', destination: 'destinations', services: 'experiences', gallery: 'experiences', 'travel-info': 'experiences' };
  const key = groups[page] ?? page;
  document.querySelectorAll(`[data-nav="${key}"]`).forEach((a) => a.setAttribute('aria-current', 'page'));
  const path = window.location.pathname.replace(/\/$/, '/index.html');
  document.querySelectorAll('.drawer__nav a').forEach((a) => {
    const href = new URL(a.href).pathname.replace(/^\/$/, '/index.html');
    if (href === path && !a.hash) a.setAttribute('aria-current', 'page');
  });
}

function initHeader() {
  const header = document.querySelector('[data-header]');
  const onScroll = () => header?.classList.toggle('is-scrolled', window.scrollY > 10);
  onScroll();
  window.addEventListener('scroll', onScroll, { passive: true });

  const burger = document.querySelector('[data-burger]');
  const drawer = document.querySelector('[data-drawer]');
  if (!burger || !drawer) return;
  const setOpen = (open) => {
    drawer.hidden = !open;
    burger.setAttribute('aria-expanded', String(open));
    isolate(drawer, open);
    if (open) drawer.querySelector('a, button')?.focus();
    else burger.focus({ preventScroll: true });
  };
  burger.addEventListener('click', () => setOpen(true));
  drawer.addEventListener('click', (e) => {
    if (e.target === drawer || e.target.closest('[data-drawer-close]') || e.target.closest('a')) setOpen(false);
  });
  document.addEventListener('keydown', (e) => { if (e.key === 'Escape' && !drawer.hidden) setOpen(false); });
}

/** Fades sections in as they scroll into view. Call again after rendering new [data-reveal] nodes. */
export function initReveals(root = document) {
  const items = [...root.querySelectorAll('[data-reveal]:not(.is-in)')];
  if (reducedMotion || !('IntersectionObserver' in window)) {
    items.forEach((el) => el.classList.add('is-in'));
    return;
  }
  const io = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) return;
      entry.target.classList.add('is-in');
      io.unobserve(entry.target);
    });
  }, { rootMargin: '0px 0px -8% 0px', threshold: 0.08 });
  items.forEach((el) => io.observe(el));
}

/** Muted background videos only load and play while on screen. */
export function initLazyVideos(root = document) {
  const videos = [...root.querySelectorAll('video[data-lazy-video]')];
  if (!videos.length) return;
  if (reducedMotion || !('IntersectionObserver' in window)) return; // keep the poster frame only
  const io = new IntersectionObserver((entries) => {
    entries.forEach(({ target, isIntersecting }) => {
      if (isIntersecting) {
        if (target.preload === 'none') { target.preload = 'auto'; target.load(); }
        target.play().catch(() => { /* autoplay blocked: the poster stays visible */ });
      } else {
        target.pause();
      }
    });
  }, { threshold: 0.2 });
  videos.forEach((v) => io.observe(v));
}

const FIELD_LABELS = {
  name: 'Name', phone: 'Phone', email: 'Email', dates: 'Travel dates', month: 'Travel month',
  travellers: 'Travellers', nights: 'Nights', style: 'Trip style', interests: 'Interests',
  package: 'Package', budget: 'Budget', message: 'Message',
};
const PHONE_RE = /^[+\d][\d\s-]{6,16}$/;

/** @param {HTMLFormElement} form @returns {string | null} error message */
function validateForm(form) {
  form.querySelectorAll('[aria-invalid]').forEach((el) => el.removeAttribute('aria-invalid'));
  const name = form.elements.namedItem('name');
  if (name && name.value.trim().length < 2) {
    name.setAttribute('aria-invalid', 'true');
    name.focus();
    return 'Please tell us your name.';
  }
  const phone = form.elements.namedItem('phone');
  if (phone && (phone.required || phone.value.trim()) && !PHONE_RE.test(phone.value.trim())) {
    phone.setAttribute('aria-invalid', 'true');
    phone.focus();
    return 'Please enter a valid phone number.';
  }
  return null;
}

/**
 * Enquiry forms have no backend: they compose a WhatsApp message and open it,
 * so nothing is sent until the visitor presses Send in WhatsApp.
 */
function initWhatsAppForms() {
  document.querySelectorAll('form[data-wa-form]').forEach((form) => {
    const note = form.querySelector('.form-note');
    form.addEventListener('submit', (e) => {
      e.preventDefault();
      const error = validateForm(form);
      if (note) { note.textContent = error ?? ''; note.classList.toggle('is-error', Boolean(error)); }
      if (error) return;
      const lines = [`Hi Diganta Travels! ${form.dataset.waForm || 'Trip enquiry'}:`];
      const data = new FormData(form);
      const interests = data.getAll('interest').join(', ');
      data.forEach((value, key) => {
        const text = String(value).trim().slice(0, 500);
        if (text && key !== 'interest') lines.push(`• ${FIELD_LABELS[key] ?? key}: ${text}`);
      });
      if (interests) lines.push(`• Interested in: ${interests}`);
      window.open(whatsappUrl(lines.join('\n')), '_blank', 'noopener');
      if (note) note.textContent = 'Opening WhatsApp — press Send and our team will reply shortly.';
    });
  });
}

/** Fills any <select data-month-options> with the next 12 months. */
function fillMonthOptions() {
  const selects = document.querySelectorAll('select[data-month-options]');
  if (!selects.length) return;
  const fmt = new Intl.DateTimeFormat('en-IN', { month: 'long', year: 'numeric' });
  const now = new Date();
  const months = Array.from({ length: 12 }, (_, i) => fmt.format(new Date(now.getFullYear(), now.getMonth() + i, 1)));
  selects.forEach((select) => {
    months.forEach((m) => select.append(new Option(m, m)));
  });
}

initContactLinks();
markActiveNav();
initHeader();
fillMonthOptions();
initWhatsAppForms();

// Page scripts render content first, then these pick up the new nodes.
queueMicrotask(() => {
  initReveals();
  initLazyVideos();
});
