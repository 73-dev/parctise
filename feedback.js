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

// === Feedback elements ===
const feedbackList = document.getElementById('feedbackList');
const feedbackInput = document.getElementById('feedbackInput');
const feedbackName = document.getElementById('feedbackName');
const sendBtn = document.getElementById('feedbackSendBtn');

// === Realtime listener ===
db.collection('feedbacks')
  .orderBy('createdAt', 'asc')
  .onSnapshot(snapshot => {
    snapshot.docChanges().forEach(change => {
      if (change.type === 'added') {
        const d = change.doc.data();
        const item = document.createElement('div');
        item.className = 'p-3 rounded bg-slate-50 border border-slate-100 shadow-sm mb-2';

        const meta = document.createElement('div');
        meta.className = 'text-xs text-slate-500 mb-1';
        const name = d.name || 'Anonim';
        const time = d.createdAt ? d.createdAt.toDate().toLocaleString() : '';
        meta.textContent = `${name} • ${time}`;

        const txt = document.createElement('div');
        txt.className = 'text-sm text-slate-700';
        txt.textContent = d.text || '';

        item.appendChild(meta);
        item.appendChild(txt);
        feedbackList.appendChild(item);
        feedbackList.scrollTop = feedbackList.scrollHeight;
      }
    });
  });

// === Send message (unlimited) ===
sendBtn.addEventListener('click', async () => {
  const text = feedbackInput.value.trim();
  if (!text) return;

  const name = feedbackName.value.trim() || 'Anonim';

  try {
    await db.collection('feedbacks').add({
      name,
      text,
      createdAt: firebase.firestore.FieldValue.serverTimestamp()
    });
    feedbackInput.value = '';
    feedbackInput.focus();
  } catch (e) {
    console.error('Send error', e);
    alert('Xatolik: ' + (e.message || e));
  }
});
