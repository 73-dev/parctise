// script.js
// Assumes submitBtn and restartBtn are present in HTML (see instructions).
(() => {
  // --- Correct answers based on the "real answers" you provided ---
  const correct = {
    // Part 1 (1-10) - accept multiple text forms where appropriate
    1: ['69', 'sixty-nine', 'sixtynine'],
    2: ['stream'],
    3: ['data'],
    4: ['map'],
    5: ['visitors'],
    6: ['sounds'],
    7: ['freedom'],
    8: ['skills'],
    9: ['4.95', '4.95£', '4.95£', '4.95p', '4.95pound', '4.95pounds'],
    10: ['leaders'],

    // Part 2 (11-15) - radios
    11: 'B',
    12: 'A',
    13: 'B',
    14: 'C',
    15: 'A',

    // Map (16-20) - single letters
    16: 'G',
    17: 'C',
    18: 'B',
    19: 'D',
    20: 'A',

    // Part 3 (21-30)
    // 21 & 22 (two answers, either order) -> B and D
    21: ['B', 'D'],
    22: ['B', 'D'],

    // 23 & 24 -> A and E (either order)
    23: ['A', 'E'],
    24: ['A', 'E'],

    // 25-30 single-letter answers
    25: 'D',
    26: 'G',
    27: 'C',
    28: 'B',
    29: 'F',
    30: 'H',

    // Part 4 (31-40) - one-word answers
    31: ['walls', 'wall'],
    32: ['son'],
    33: ['fuel'],
    34: ['oxygen'],
    35: ['rectangular'],
    36: ['lamps'],
    37: ['family'],
    38: ['winter'],
    39: ['soil'],
    40: ['rain']
  };

  // Helper normalizers
  function normalizeText(t) {
    if (t === null || t === undefined) return '';
    return String(t)
      .trim()
      .toLowerCase()
      .replace(/[^\w\.\-££#]/g, '') // remove punctuation except some useful chars
      .replace(/£/g, '£');
  }

  function normalizeAlpha(t) {
    return String(t || '').trim().toUpperCase();
  }

  // Build list of inputs
  const allTextInputs = Array.from(document.querySelectorAll('input[type="text"]'));
  // Map inputs with maxlength=1 (these include map q16-20 and 25-30)
  const maxlengthInputs = Array.from(document.querySelectorAll('input[maxlength="1"]'));

  // Map inputs with ids q16..q20 explicitly
  const q16 = document.getElementById('q16');
  const q17 = document.getElementById('q17');
  const q18 = document.getElementById('q18');
  const q19 = document.getElementById('q19');
  const q20 = document.getElementById('q20');
  const mapInputs = [q16, q17, q18, q19, q20].filter(Boolean);

  // Determine Part1 inputs: assume the first 10 text inputs in the document are Q1..Q10
  const part1Inputs = allTextInputs.slice(0, 10);

  // Determine part4 inputs: last 10 text inputs (Q31..Q40)
  const part4Inputs = allTextInputs.slice(-10);

  // Determine 25-30 inputs: inputs with maxlength=1 excluding mapInputs
  const mapIds = mapInputs.map(i => i && i.id).filter(Boolean);
  const part25_30Inputs = maxlengthInputs.filter(i => !mapIds.includes(i.id)).slice(0, 6);

  // Radios 11-15
  function getRadioValue(name) {
    const r = document.querySelector(`input[name="${name}"]:checked`);
    return r ? r.value : '';
  }

  // Checkboxes groups for 21_22 and 23_24
  function getCheckboxValues(name) {
    return Array.from(document.querySelectorAll(`input[name="${name}"]:checked`)).map(x => x.value.toUpperCase());
  }

  // Create results container if not exist
  function ensureResultsContainer() {
    let c = document.getElementById('quiz-results-container');
    if (!c) {
      c = document.createElement('div');
      c.id = 'quiz-results-container';
      c.className = 'mt-6 p-4 bg-white border border-gray-200 rounded';
      // insert at end of main container
      const main = document.querySelector('body .max-w-2xl') || document.querySelector('body');
      main.appendChild(c);
    } else {
      c.innerHTML = ''; // clear before reuse
    }
    return c;
  }

  // Evaluate all answers and show table
  function evaluateAll() {
    const results = [];
    let correctCount = 0;

    // Part 1 (1-10)
    for (let i = 1; i <= 10; i++) {
      const input = part1Inputs[i - 1];
      const givenRaw = input ? input.value : '';
      const given = normalizeText(givenRaw);
      const accepted = correct[i].map(normalizeText);
      const isCorrect = accepted.includes(given);
      results.push({ q: i, given: givenRaw || '(no answer)', correct: correct[i].join(' / '), ok: isCorrect });
      if (isCorrect) correctCount++;
    }

    // Part 2 (11-15 radios)
    for (let i = 11; i <= 15; i++) {
      const given = getRadioValue('q' + i) || '(no answer)';
      const isCorrect = normalizeAlpha(given) === normalizeAlpha(correct[i]);
      results.push({ q: i, given, correct: correct[i], ok: isCorrect });
      if (isCorrect) correctCount++;
    }

    // Map 16-20
    for (let i = 16; i <= 20; i++) {
      const input = document.getElementById('q' + i);
      const given = input ? normalizeAlpha(input.value) : '(no answer)';
      const isCorrect = given && given === normalizeAlpha(correct[i]);
      results.push({ q: i, given: input ? input.value.toUpperCase() || '(no answer)' : '(no answer)', correct: correct[i], ok: isCorrect });
      if (isCorrect) correctCount++;
    }

    // Part 3: 21&22 (two answers for both q21 and q22; BUT UI has a single group q21_22 for two items)
    // For q21 & q22 we check the group named q21_22
    const sel21_22 = getCheckboxValues('q21_22'); // array of selected letters
    const sel23_24 = getCheckboxValues('q23_24');

    // For questions 21 and 22 we expect two selections B & D
    const required21_22 = (correct[21] || []).map(normalizeAlpha).sort();
    const got21_22 = sel21_22.map(normalizeAlpha).sort();

    // Evaluate 21 and 22 as two items: if both selected then both considered correct; otherwise mark both wrong.
    const both21_22_ok = JSON.stringify(required21_22) === JSON.stringify(got21_22);
    // If ok, we count 2 correct, else 0.
    results.push({ q: 21, given: sel21_22.join(', ') || '(no answer)', correct: required21_22.join(' & '), ok: both21_22_ok });
    results.push({ q: 22, given: sel21_22.join(', ') || '(no answer)', correct: required21_22.join(' & '), ok: both21_22_ok });
    if (both21_22_ok) correctCount += 2;

    // For 23 and 24
    const required23_24 = (correct[23] || []).map(normalizeAlpha).sort();
    const got23_24 = sel23_24.map(normalizeAlpha).sort();
    const both23_24_ok = JSON.stringify(required23_24) === JSON.stringify(got23_24);
    results.push({ q: 23, given: sel23_24.join(', ') || '(no answer)', correct: required23_24.join(' & '), ok: both23_24_ok });
    results.push({ q: 24, given: sel23_24.join(', ') || '(no answer)', correct: required23_24.join(' & '), ok: both23_24_ok });
    if (both23_24_ok) correctCount += 2;

    // 25-30 (single-letter text inputs)
    for (let i = 25; i <= 30; i++) {
      const idx = i - 25;
      const input = part25_30Inputs[idx];
      const givenRaw = input ? input.value : '';
      const given = normalizeAlpha(givenRaw);
      const isCorrect = given && given === normalizeAlpha(correct[i]);
      results.push({ q: i, given: givenRaw || '(no answer)', correct: correct[i], ok: isCorrect });
      if (isCorrect) correctCount++;
    }

    // Part 4 (31-40) last 10 text inputs in order
    for (let i = 31; i <= 40; i++) {
      const idx = i - 31;
      const input = part4Inputs[idx];
      const givenRaw = input ? input.value : '';
      const given = normalizeText(givenRaw).replace(/\.$/, ''); // drop trailing dot
      const accepted = (correct[i] || []).map(normalizeText);
      const isCorrect = accepted.includes(given);
      results.push({ q: i, given: givenRaw || '(no answer)', correct: (correct[i] || []).join(' / '), ok: isCorrect });
      if (isCorrect) correctCount++;
    }

    // Build results display
    const container = ensureResultsContainer();

    // Summary
    const totalQ = 40;
    const percent = Math.round((correctCount / totalQ) * 100);

    const summary = document.createElement('div');
    summary.className = 'mb-4';
    summary.innerHTML = `<div class="text-lg font-semibold">Results: ${correctCount}/${totalQ} (${percent}%)</div>`;
    container.appendChild(summary);

    // Table
    const table = document.createElement('table');
    table.className = 'w-full text-sm border-collapse';
    table.innerHTML = `
      <thead>
        <tr class="text-left border-b">
          <th class="py-2 pr-4">Q#</th>
          <th class="py-2 pr-4">Your answer</th>
          <th class="py-2 pr-4">Correct answer</th>
          <th class="py-2 pr-4">Result</th>
        </tr>
      </thead>
      <tbody></tbody>
    `;
    const tbody = table.querySelector('tbody');

    results.forEach(r => {
      const tr = document.createElement('tr');
      tr.className = 'border-b';
      const okMark = r.ok ? '✓' : '✕';
      const okClass = r.ok ? 'text-green-600 font-medium' : 'text-rose-600 font-medium';
      tr.innerHTML = `
        <td class="py-2 pr-4">${r.q}</td>
        <td class="py-2 pr-4">${escapeHtml(String(r.given))}</td>
        <td class="py-2 pr-4">${escapeHtml(String(r.correct))}</td>
        <td class="py-2 pr-4 ${okClass}">${okMark}</td>
      `;
      tbody.appendChild(tr);
    });

    container.appendChild(table);
    // Scroll to results
    container.scrollIntoView({ behavior: 'smooth' });
  }

  // Restart function: clear inputs and results
  function restartAll() {
    // clear text inputs
    document.querySelectorAll('input[type="text"]').forEach(i => (i.value = ''));
    // clear radios
    document.querySelectorAll('input[type="radio"]').forEach(r => (r.checked = false));
    // clear checkboxes
    document.querySelectorAll('input[type="checkbox"]').forEach(c => (c.checked = false));
    // remove results container if present
    const c = document.getElementById('quiz-results-container');
    if (c) c.remove();
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  // small helper to escape HTML
  function escapeHtml(s) {
    return String(s).replaceAll('&', '&amp;').replaceAll('<', '&lt;').replaceAll('>', '&gt;');
  }

  // hook buttons
  document.addEventListener('DOMContentLoaded', () => {
    const submitBtn = document.getElementById('submitBtn');
    const restartBtn = document.getElementById('restartBtn');
    if (submitBtn) submitBtn.addEventListener('click', evaluateAll);
    if (restartBtn) restartBtn.addEventListener('click', restartAll);
  });
})();
