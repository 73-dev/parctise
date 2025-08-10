import { db, collection, addDoc, onSnapshot, query, orderBy, serverTimestamp } from "./firebase.js";

const feedbackList = document.getElementById('feedbackList');
const feedbackInput = document.getElementById('feedbackInput');
const feedbackName = document.getElementById('feedbackName');
const sendBtn = document.getElementById('feedbackSendBtn');

// Real vaqt listener
const q = query(collection(db, "feedbacks"), orderBy("createdAt", "asc"));
onSnapshot(q, snapshot => {
  feedbackList.innerHTML = '';
  snapshot.forEach(doc => {
    const data = doc.data();
    const div = document.createElement("div");
    div.className = "feedback-item";

    const meta = document.createElement("div");
    meta.className = "feedback-meta";
    meta.textContent = `${data.name || "Anonim"} • ${data.createdAt?.toDate().toLocaleString() || ""}`;

    const txt = document.createElement("div");
    txt.textContent = data.text;

    div.appendChild(meta);
    div.appendChild(txt);
    feedbackList.appendChild(div);
  });
  feedbackList.scrollTop = feedbackList.scrollHeight;
});

// Yuborish
sendBtn.addEventListener("click", async () => {
  const text = feedbackInput.value.trim();
  if (!text) return;
  const name = feedbackName.value.trim() || "Anonim";

  await addDoc(collection(db, "feedbacks"), {
    name,
    text,
    createdAt: serverTimestamp()
  });

  feedbackInput.value = '';
});
