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

// === Realtime listener (faqat bitta marta to‘liq yangilaydi) ===
db.collection('feedbacks').orderBy('createdAt', 'asc')
  .onSnapshot(snapshot => {
    feedbackList.innerHTML = ''; // eski DOM tozalash
    snapshot.forEach(doc => {
      const d = doc.data();
      renderMessage(doc.id, d);
    });
    feedbackList.scrollTop = feedbackList.scrollHeight;
  });

// === Render message ===
function renderMessage(id, d) {
  const item = document.createElement('div');
  item.className = 'p-3 rounded bg-slate-50 border shadow-sm flex justify-between items-start mb-2';

  // Content
  const content = document.createElement('div');
  const meta = document.createElement('div');
  meta.className = 'text-xs text-gray-500 mb-1';
  meta.textContent = `${d.name || 'Anonim'} • ${d.createdAt ? d.createdAt.toDate().toLocaleString() : ''}`;
  const txt = document.createElement('div');
  txt.className = 'text-sm text-gray-800';
  txt.textContent = d.text || '';
  content.appendChild(meta);
  content.appendChild(txt);

  // Delete button
  const delBtn = document.createElement('button');
  delBtn.textContent = '✖';
  delBtn.className = 'text-red-500 hover:text-red-700 text-xs';
  delBtn.onclick = async () => {
    if (confirm("Bu xabarni o‘chirishni xohlaysizmi?")) {
      await db.collection('feedbacks').doc(id).delete();
    }
  };

  item.appendChild(content);
  item.appendChild(delBtn);
  feedbackList.appendChild(item);
}

// === Send message ===
sendBtn.addEventListener('click', async () => {
  const text = feedbackInput.value.trim();
  if (!text) return;

  sendBtn.disabled = true;
  const name = feedbackName.value.trim() || 'Anonim';

  try {
    await db.collection('feedbacks').add({
      name,
      text,
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
