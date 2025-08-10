
  // === Firebase Config ===
  const firebaseConfig = {
    apiKey: "AIzaSyD73BQMxpTAU3qFhXdJa90bom8AMasSRtA",
    authDomain: "practise-d2591.firebaseapp.com",
    projectId: "practise-d2591",
    storageBucket: "practise-d2591.firebasestorage.app",
    messagingSenderId: "330260280903",
    appId: "1:330260280903:web:7980d74dfdc98f0712a362",
    measurementId: "G-Y70ZXHF9F9"
  };

  // Init Firebase
  firebase.initializeApp(firebaseConfig);
  const auth = firebase.auth();
  const db = firebase.firestore();

  // Anonim login
  auth.signInAnonymously().catch(e => console.warn("Anon login failed", e));

  // === Elements ===
  const feedbackList = document.getElementById('feedbackList');
  const feedbackInput = document.getElementById('feedbackInput');
  const feedbackName = document.getElementById('feedbackName');
  const sendBtn = document.getElementById('feedbackSendBtn');

  // Xabarlarni id bo'yicha tekshirish uchun set
  const loadedMessages = new Set();

  // Realtime listener (faqat yangi xabarlar qo'shiladi)
  db.collection('feedbacks').orderBy('createdAt', 'asc')
    .onSnapshot(snapshot => {
      snapshot.docChanges().forEach(change => {
        if (change.type === 'added') {
          const id = change.doc.id;
          if (loadedMessages.has(id)) return; // eski xabarni qayta chizmaslik
          loadedMessages.add(id);

          const d = change.doc.data();
          renderMessage(d);
        }
      });
    });

  function renderMessage(d) {
    const item = document.createElement('div');
    item.className = 'p-3 rounded bg-slate-50 border border-slate-100 shadow-sm mb-2';

    const meta = document.createElement('div');
    meta.className = 'text-xs text-slate-500 mb-1';
    const name = d.name || 'Anonim';
    const time = d.createdAt
      ? d.createdAt.toDate().toLocaleString()
      : new Date(d.localTime || Date.now()).toLocaleString();
    meta.textContent = `${name} • ${time}`;

    const txt = document.createElement('div');
    txt.className = 'text-sm text-slate-700';
    txt.textContent = d.text || '';

    item.appendChild(meta);
    item.appendChild(txt);
    feedbackList.appendChild(item);
    feedbackList.scrollTop = feedbackList.scrollHeight;
  }

  // Send message
  sendBtn.addEventListener('click', async () => {
    const text = feedbackInput.value.trim();
    if (!text) return;
    sendBtn.disabled = true;

    const name = feedbackName.value.trim() || 'Anonim';

    // Xabarni darhol ko'rsatish (local preview)
    const localMsg = {
      name,
      text,
      localTime: Date.now()
    };
    renderMessage(localMsg);

    try {
      await db.collection('feedbacks').add({
        name,
        text,
        localTime: Date.now(), // tez ko'rinishi uchun
        createdAt: firebase.firestore.FieldValue.serverTimestamp()
      });
      feedbackInput.value = '';
    } catch (e) {
      console.error('Send error', e);
      alert('Xatolik: ' + (e.message || e));
    } finally {
      sendBtn.disabled = false;
    }
  });
