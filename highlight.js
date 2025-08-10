// === Tanlangan matnni o'rash (ko'p qatorda ham ishlaydi) ===
function wrapSelection(className, noteText) {
  const selection = window.getSelection();
  if (!selection.rangeCount) return;
  const range = selection.getRangeAt(0);
  if (range.collapsed) return;

  // Tanlov ichidagi highlight yoki note’larni olib tashlaymiz (nested bo‘lishini oldini olish)
  const tempDiv = document.createElement('div');
  tempDiv.appendChild(range.cloneContents());
  tempDiv.querySelectorAll('.highlight, .note').forEach(span => {
    const parent = span.parentNode;
    while (span.firstChild) parent.insertBefore(span.firstChild, span);
    span.remove();
  });

  // Yangi span yaratish
  const span = document.createElement('span');
  span.className = className;
  if (noteText) span.setAttribute('data-note', noteText);
  span.appendChild(tempDiv);

  range.deleteContents();
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

// === Faqat tanlangan highlightni o'chirish ===
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
      span.remove();
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
    span.remove();
  });

  const res = document.getElementById('quiz-results-container');
  if (res) res.remove();

  hideFloatingMenu();
}

// === Menyuni ko'rsatish ===
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

  if (hBtn) hBtn.addEventListener('mousedown', e => { e.preventDefault(); highlightSelection(); });
  if (nBtn) nBtn.addEventListener('mousedown', e => { e.preventDefault(); addNoteToSelection(); });
  if (cBtn) cBtn.addEventListener('mousedown', e => { e.preventDefault(); clearHighlight(); });
  if (caBtn) caBtn.addEventListener('mousedown', e => { e.preventDefault(); clearAllCustom(); });

  // Touch versiya tugmalarini ham ishlatish
  [hBtn, nBtn, cBtn, caBtn].forEach(btn => {
    if (btn) btn.addEventListener('touchend', e => {
      e.preventDefault();
      e.stopPropagation();
      btn.click();
    });
  });

  function handleSelectionEvent() {
    const selection = window.getSelection();
    if (selection && !selection.isCollapsed) {
      const rect = selection.getRangeAt(0).getBoundingClientRect();
      const menu = document.getElementById('floatingMenu');
      const menuWidth = menu ? menu.offsetWidth : 120;
      const menuHeight = menu ? menu.offsetHeight : 30;

      // Menyuni tizim popup’iga yaqinroq chiqarish
      const x = rect.left + window.scrollX;
      const y = rect.bottom + window.scrollY + 5;

      showFloatingMenu(x, y);
    } else {
      hideFloatingMenu();
    }
  }

  // Tez reaksiya uchun selectionchange ishlatamiz
  document.addEventListener('selectionchange', () => {
    setTimeout(handleSelectionEvent, 10);
  });

  // Menyudan tashqariga bosilganda yopish
  document.addEventListener('click', e => {
    const menu = document.getElementById('floatingMenu');
    if (menu && !menu.contains(e.target) && window.getSelection().isCollapsed) {
      hideFloatingMenu();
    }
  });
});
