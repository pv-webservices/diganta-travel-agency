import { gsap } from 'gsap';
import { whatsappUrl } from '../config.js';

const MAX_PAX = 60;
const MONTHS_AHEAD = 18;

/**
 * Validate the planner form.
 * @param {FormData} data
 * @returns {{ ok: true, value: { name: string, month: string, pax: number, nights: number, vibes: string[] } } | { ok: false, error: string, field: string }}
 */
export function validatePlan(data) {
  const name = String(data.get('name') || '').trim();
  const month = String(data.get('month') || '');
  const pax = Number(data.get('pax'));
  const nights = Number(data.get('nights'));
  const vibes = data.getAll('vibe').map(String);

  if (name.length < 2) return { ok: false, error: 'Please tell us your name.', field: 'name' };
  if (!/^\d{4}-\d{2}$/.test(month)) return { ok: false, error: 'Please pick the month you plan to travel.', field: 'month' };
  if (!Number.isInteger(pax) || pax < 1 || pax > MAX_PAX) return { ok: false, error: `Travellers should be between 1 and ${MAX_PAX}.`, field: 'pax' };
  return { ok: true, value: { name: name.slice(0, 60), month, pax, nights, vibes } };
}

function formatMonth(value) {
  const [y, m] = value.split('-').map(Number);
  return new Date(y, m - 1, 1).toLocaleDateString('en-IN', { month: 'long', year: 'numeric' });
}

export function buildMessage({ name, month, pax, nights, vibes }) {
  return [
    'Hi Diganta Travels! I would like to plan an Andaman trip.',
    '',
    `Name: ${name}`,
    `Travel month: ${formatMonth(month)}`,
    `Travellers: ${pax}`,
    `Nights: ${nights}`,
    `Interested in: ${vibes.length ? vibes.join(', ') : 'Open to suggestions'}`,
  ].join('\n');
}

export function initPlanner() {
  const form = document.querySelector('.planner');
  if (!form) return;
  const error = form.querySelector('.planner__error');
  const nightsOut = form.querySelector('.planner__nights');
  const range = form.querySelector('input[name="nights"]');
  const month = form.querySelector('select[name="month"]');
  const pax = form.querySelector('input[name="pax"]');

  // Month picker: the next 18 months — works the same on every browser (Safari has no <input type="month">).
  const now = new Date();
  for (let i = 0; i < MONTHS_AHEAD; i += 1) {
    const d = new Date(now.getFullYear(), now.getMonth() + i, 1);
    const option = document.createElement('option');
    option.value = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`;
    option.textContent = d.toLocaleDateString('en-IN', { month: 'long', year: 'numeric' });
    month.appendChild(option);
  }

  // Traveller stepper
  const clampPax = (n) => Math.min(MAX_PAX, Math.max(1, Number.isFinite(n) ? n : 1));
  form.querySelectorAll('.stepper__btn').forEach((btn) => btn.addEventListener('click', () => {
    pax.value = String(clampPax(parseInt(pax.value, 10) + Number(btn.dataset.step)));
  }));
  pax.addEventListener('input', () => { pax.value = pax.value.replace(/\D/g, ''); });
  pax.addEventListener('blur', () => { pax.value = String(clampPax(parseInt(pax.value, 10))); });

  range.addEventListener('input', () => { nightsOut.textContent = range.value; });

  form.addEventListener('submit', (event) => {
    event.preventDefault();
    const result = validatePlan(new FormData(form));
    if (!result.ok) {
      error.textContent = result.error;
      const field = form.querySelector(`[name="${result.field}"]`);
      field?.focus();
      gsap.fromTo(form, { x: -8 }, { x: 0, duration: 0.5, ease: 'elastic.out(1, 0.3)' });
      return;
    }
    error.textContent = '';
    window.open(whatsappUrl(buildMessage(result.value)), '_blank', 'noopener');
  });
}
