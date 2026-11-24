import './page.js';

// Prefill the trip planner from links such as the home quote bar
// (/contact.html?month=…&travellers=…&style=…) or "Customise" buttons (?package=…).
const form = document.querySelector('[data-planner]');
const params = new URLSearchParams(window.location.search);
const MAX_LEN = 80;

/** Selects the option matching `value`, adding it if the list doesn't have it. */
function setSelect(select, value) {
  const match = [...select.options].find((o) => o.value === value || o.text === value);
  if (match) { select.value = match.value; return; }
  select.append(new Option(value, value, true, true));
}

if (form) {
  ['month', 'travellers', 'style', 'package'].forEach((key) => {
    const value = params.get(key)?.trim().slice(0, MAX_LEN);
    const field = form.elements.namedItem(key);
    if (!value || !field) return;
    if (field instanceof HTMLSelectElement) setSelect(field, value);
    else field.value = value;
  });

  const interest = params.get('interest')?.trim().slice(0, MAX_LEN);
  if (interest) {
    const box = [...form.querySelectorAll('input[name="interest"]')]
      .find((i) => i.value.toLowerCase() === interest.toLowerCase());
    if (box) box.checked = true;
    else {
      const message = form.elements.namedItem('message');
      message.value = `I'm interested in: ${interest}`;
    }
  }
}
