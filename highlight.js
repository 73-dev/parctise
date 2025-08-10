let savedSelection = null;

// === Selection’ni saqlash ===
function saveSelection() {
  const selection = window.getSelection();
  if (selection.rangeCount > 0) {
    savedSelection = selection.getRangeAt(0).cloneRange();
  }
}

// === Saqlangan selection’dan foydalanish ===
function restoreSelection() {
  if (!savedSelection) return null;
  const selection = window.getSelection();
  selection.removeAllRanges();
  selection.addRange(savedSelection);
  return savedSelection;
}

// === Tanlangan matnni span bilan o‘rash (mobil + desktop) ===
function wrapSavedSelection(className, noteText) {
  const range = restoreSelection();
  if (!range || range.collapsed) return;

  const span = document.createElement('span');
  span.className = className;
  if (noteText) span.setAttribute('data-note', noteText);

  const contents = range.extractContents();
  span.appendChild(contents);
  range.insertNode(span);

  savedSelection = null;
  window.getSelection().removeAllRanges();
}

// === Highlight qo‘shish ===
function highlightSelection() {
  wrapSavedSelection('highlight');
  hideFloatingMenu();
}

// === Note qo‘shish ===
function addNoteToSelection() {
  const noteText = prompt("Note matnini kiriting:");
  if (noteText) wrapSavedSelection('note', noteText);
  hideFloatingMenu();
}

// === Tanlangan highlightlarni o‘chirish ===
function clearHighlight() {
  const range = restoreSelection();
  if (!range || range.collapsed) return;

  document.querySelectorAll('.highlight').forEach(span => {
    if (range.intersectsNode(span)) {
      const parent = span.parentNode;
      while (span.firstChild) parent.insertBefore(span.firstChild, span);
      span.remove();
    }
  });

  savedSelection = null;
  window.getSelection().removeAllRanges();
  hideFloatingMenu();
}

// === Hammasini tozalash ===
function clearAllCustom() {
  document.querySelectorAll('.highlight, .note').forEach(span => {
    const parent = span.parentNode;
    while (span.firstChild) parent.insertBefore(span.firstChild, span);
    span.remove();
  });
  hideFloatingMenu();
}

// === Menyuni joylashtirish ===
function showFloatingMenu(x, y) {
  const menu = document.getElementById('floatingMenu');
  if (menu) {
    menu.style.left = `${x}px`;
    menu.style.top = `${y}px`;
    menu.style.display = 'flex';
    menu.style.zIndex = 9999;
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

  // Tugma bosishda selection yo‘qolmasligi uchun touchstart + mousedown
  [[hBtn, highlightSelection], [nBtn, addNoteToSelection], [cBtn, clearHighlight], [caBtn, clearAllCustom]]
    .forEach(([btn, handler]) => {
      if (!btn) return;
      btn.addEventListener('mousedown', e => { e.preventDefault(); handler(); });
      btn.addEventListener('touchstart', e => { e.preventDefault(); handler(); }, { passive: false });
    });

  function handleSelectionEvent() {
    const selection = window.getSelection();
    if (selection && !selection.isCollapsed) {
      saveSelection();
      const rect = selection.getRangeAt(0).getBoundingClientRect();
      const menu = document.getElementById('floatingMenu');
      const menuWidth = menu ? menu.offsetWidth : 120;
      const menuHeight = menu ? menu.offsetHeight : 30;

      const x = rect.left + window.scrollX + (rect.width / 2) - (menuWidth / 2);
      const y = rect.bottom + window.scrollY + 6; // pastroqqa chiqadi

      showFloatingMenu(x, y);
    } else {
      hideFloatingMenu();
    }
  }

  // Desktop
  document.addEventListener('mouseup', handleSelectionEvent);

  // Mobile (Google menu bilan yonma-yon chiqishi uchun kichik delay bilan)
  document.addEventListener('touchend', () => {
    setTimeout(handleSelectionEvent, 50);
  });

  // Tashqariga bosganda menyuni yopish
  document.addEventListener('click', e => {
    const menu = document.getElementById('floatingMenu');
    if (menu && !menu.contains(e.target) && window.getSelection().isCollapsed) {
      hideFloatingMenu();
    }
  });
});
