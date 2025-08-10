
    // Elements
    const audio = document.getElementById('audio');
    const playBtn = document.getElementById('playBtn');
    const playIcon = document.getElementById('playIcon');
    const pauseIcon = document.getElementById('pauseIcon');
    const seek = document.getElementById('seek');
    const curTime = document.getElementById('curTime');
    const totTime = document.getElementById('totTime');

    const countdownEl = document.getElementById('countdown');
    const timerToggle = document.getElementById('timerToggle');
    const timerPauseIcon = document.getElementById('timerPauseIcon');
    const timerPlayIcon = document.getElementById('timerPlayIcon');
    const timerRestart = document.getElementById('timerRestart');

    // ---------- Audio controls ----------
    // Toggle play/pause
    playBtn.addEventListener('click', () => {
      if (audio.paused) audio.play();
      else audio.pause();
    });

    audio.addEventListener('play', () => {
      playIcon.classList.add('hidden');
      pauseIcon.classList.remove('hidden');
      playBtn.setAttribute('aria-label','Pause');
    });
    audio.addEventListener('pause', () => {
      playIcon.classList.remove('hidden');
      pauseIcon.classList.add('hidden');
      playBtn.setAttribute('aria-label','Play');
    });

    // Update duration when metadata loaded
    audio.addEventListener('loadedmetadata', () => {
      seek.max = audio.duration;
      totTime.textContent = formatTime(audio.duration);
    });

    // Update progress while playing
    audio.addEventListener('timeupdate', () => {
      seek.value = audio.currentTime;
      curTime.textContent = formatTime(audio.currentTime);
    });

    // Seek by input
    seek.addEventListener('input', () => {
      audio.currentTime = seek.value;
    });

    function formatTime(s) {
      if (!isFinite(s)) return '00:00';
      const m = Math.floor(s / 60).toString().padStart(2,'0');
      const sec = Math.floor(s % 60).toString().padStart(2,'0');
      return `${m}:${sec}`;
    }

    // ---------- Timer (countdown) ----------
    const START_SECONDS = 60 * 60; // 60 minutes
    let timeLeft = START_SECONDS;
    let timerId = null;
    let timerRunning = true;

    function updateTimerDisplay() {
      const m = Math.floor(timeLeft / 60).toString().padStart(2,'0');
      const s = (timeLeft % 60).toString().padStart(2,'0');
      countdownEl.textContent = `${m}:${s}`;
    }

    function startTimer() {
      if (timerId) return;
      timerId = setInterval(() => {
        if (timeLeft > 0) {
          timeLeft--;
          updateTimerDisplay();
        } else {
          clearInterval(timerId);
          timerId = null;
          timerRunning = false;
          timerPauseIcon.classList.add('hidden');
          timerPlayIcon.classList.remove('hidden');
        }
      }, 1000);
      timerRunning = true;
      timerPauseIcon.classList.remove('hidden');
      timerPlayIcon.classList.add('hidden');
      timerToggle.setAttribute('aria-label','Pause timer');
    }

    function pauseTimer() {
      if (timerId) {
        clearInterval(timerId);
        timerId = null;
      }
      timerRunning = false;
      timerPauseIcon.classList.add('hidden');
      timerPlayIcon.classList.remove('hidden');
      timerToggle.setAttribute('aria-label','Resume timer');
    }

    function restartTimer() {
      timeLeft = START_SECONDS;
      updateTimerDisplay();
      if (timerId) {
        clearInterval(timerId);
        timerId = null;
      }
      startTimer();
    }

    // Timer controls
    timerToggle.addEventListener('click', () => {
      if (timerRunning) pauseTimer();
      else startTimer();
    });
    timerRestart.addEventListener('click', restartTimer);

    // Auto-start timer on load
    updateTimerDisplay();
    startTimer();

    // Accessibility: space/enter on buttons
    [playBtn, timerToggle, timerRestart].forEach(btn => {
      btn.addEventListener('keydown', (e) => {
        if (e.key === ' ' || e.key === 'Enter') { e.preventDefault(); btn.click(); }
      });
    });