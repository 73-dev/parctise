document.addEventListener("DOMContentLoaded", () => {
  const feedbackListEl = document.getElementById("feedbackList");
  const feedbackInput = document.getElementById("feedbackInput");
  const sendBtn = document.getElementById("feedbackSendBtn");

  // LocalStorage’dan ma’lumotni yuklash
  let feedbacks = JSON.parse(localStorage.getItem("feedbacks") || "[]");

  function renderFeedbacks() {
    feedbackListEl.innerHTML = "";
    feedbacks.forEach(fb => {
      const div = document.createElement("div");
      div.className = "feedback-item";
      div.textContent = fb;
      feedbackListEl.appendChild(div);
    });
  }

  // Fikr yuborish
  sendBtn.addEventListener("click", () => {
    const text = feedbackInput.value.trim();
    if (!text) return;

    feedbacks.push(text);
    localStorage.setItem("feedbacks", JSON.stringify(feedbacks));
    feedbackInput.value = "";
    renderFeedbacks();
  });

  // Boshlang‘ich render
  renderFeedbacks();
});
