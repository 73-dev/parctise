// === Tanlangan matnni span bilan o'rash (mobil + desktop ishlaydi) ===
function wrapSelection(className, noteText) {
  const selection = window.getSelection();
  if (!selection.rangeCount) return;
  const range = selection.getRangeAt(0);
  if (range.collapsed) return;

  const span = document.createElement('span');
  span.className = className;
  if (noteText) span.setAttribute('data-note', noteText);

  const contents = range.extractContents();
  span.appendChild(contents);
  range.insertNode(span);
  selection.removeAllRanges();
}

// === Highlight qo'shish ===
function highlightSelection() {
  wrapSelection('highlight');
  hideFloatingMenu();
}

// === Note qo'shish ===
function addNoteToSelection() {
  const noteText = prompt("Note matnini kiriting:");
  if (noteText) wrapSelection('note', noteText);
  hideFloatingMenu();
}

// === Tanlangan highlightlarni o'chirish ===
function clearHighlight() {
  const selection = window.getSelection();
  if (!selection.rangeCount) return;
  const range = selection.getRangeAt(0);
  if (range.collapsed) return;

  const highlights = document.querySelectorAll('.highlight');
  highlights.forEach(span => {
    if (range.intersectsNode(span)) {
      const parent = span.parentNode;
      while (span.firstChild) parent.insertBefore(span.firstChild, span);
      parent.removeChild(span);
    }
  });

  hideFloatingMenu();
}

// === Hammasini tozalash ===
function clearAllCustom() {
  document.querySelectorAll('input[type="text"], textarea').forEach(i => i.value = '');
  document.querySelectorAll('input[type="radio"], input[type="checkbox"]').forEach(i => i.checked = false);

  document.querySelectorAll('.highlight, .note').forEach(span => {
    const parent = span.parentNode;
    while (span.firstChild) parent.insertBefore(span.firstChild, span);
    parent.removeChild(span);
  });

  const res = document.getElementById('quiz-results-container');
  if (res) res.remove();

  hideFloatingMenu();
}

// === Menyuni joylashtirish ===
function showFloatingMenu(x, y) {
  const menu = document.getElementById('floatingMenu');
  if (menu) {
    menu.style.left = x + 'px';
    menu.style.top = y + 'px';
    menu.style.display = 'flex';
    menu.style.zIndex = 9999; // har doim eng tepada
  }
}

function hideFloatingMenu() {
  const menu = document.getElementById('floatingMenu');
  if (menu) menu.style.display = 'none';
}

// === Hodisalarni ulash ===
document.addEventListener('DOMContentLoaded', () => {
  const hBtn = document.getElementById('highlightBtn');
  const nBtn = document.getElementById('noteBtn');
  const cBtn = document.getElementById('clearHighlightBtn');
  const caBtn = document.getElementById('clearAllBtn');

  if (hBtn) hBtn.addEventListener('click', highlightSelection);
  if (nBtn) nBtn.addEventListener('click', addNoteToSelection);
  if (cBtn) cBtn.addEventListener('click', clearHighlight);
  if (caBtn) caBtn.addEventListener('click', clearAllCustom);

  function handleSelectionEvent() {
    const selection = window.getSelection();
    if (selection && !selection.isCollapsed) {
      const rect = selection.getRangeAt(0).getBoundingClientRect();
      const menu = document.getElementById('floatingMenu');
      const menuWidth = menu ? menu.offsetWidth : 120;
      const menuHeight = menu ? menu.offsetHeight : 30;

      const x = rect.left + window.scrollX + (rect.width / 2) - (menuWidth / 2);
      const y = rect.top + window.scrollY - menuHeight - 8;

      showFloatingMenu(x, y);
    } else {
      hideFloatingMenu();
    }
  }

  // Tez ishlashi uchun selectionchange ishlatamiz
  document.addEventListener('selectionchange', () => {
    setTimeout(handleSelectionEvent, 10);
  });

  // Tashqariga bosilganda menyuni yopish
  document.addEventListener('click', e => {
    const menu = document.getElementById('floatingMenu');
    if (menu && !menu.contains(e.target) && window.getSelection().isCollapsed) {
      hideFloatingMenu();
    }
  });

  // Mobil tizim popup'ni kamaytirish
  document.addEventListener('touchstart', e => {
    if (document.getElementById('floatingMenu')?.contains(e.target)) {
      e.preventDefault();
    }
  }, { passive: false });
});
