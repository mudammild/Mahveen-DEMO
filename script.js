/* MAHVEEN.CO demo — update nomor WhatsApp dan isi katalog sebelum digunakan. */
(() => {
  // Nomor bisnis dari format Indonesia: kode negara + nomor, tanpa tanda +, spasi, atau strip.
  const WHATSAPP_NUMBER = "6285367043277";

  const toggle = document.querySelector(".menu-toggle");
  const nav = document.querySelector("#main-nav");

  if (toggle && nav) {
    toggle.addEventListener("click", () => {
      const open = nav.classList.toggle("open");
      toggle.setAttribute("aria-expanded", String(open));
      toggle.setAttribute("aria-label", open ? "Tutup menu" : "Buka menu");
    });
    nav.querySelectorAll("a").forEach(a => a.addEventListener("click", () => {
      nav.classList.remove("open");
      toggle.setAttribute("aria-expanded", "false");
    }));
  }

  document.querySelectorAll(".order-link").forEach(link => {
    const message = link.dataset.message || "Halo Mahveen.co, saya ingin bertanya tentang produk.";
    link.href = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(message)}`;
    link.target = "_blank";
    link.rel = "noopener noreferrer";
  });

  document.querySelectorAll("[data-product]").forEach(link => {
    link.addEventListener("click", event => {
      event.preventDefault();
      const product = link.dataset.product;
      const message = `Halo Mahveen.co, saya tertarik dengan ${product}. Apakah produk ini tersedia?`;
      window.open(`https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(message)}`, "_blank", "noopener,noreferrer");
    });
  });

  const filters = document.querySelectorAll(".filter");
  const products = document.querySelectorAll(".product");
  filters.forEach(button => {
    button.addEventListener("click", () => {
      filters.forEach(item => item.classList.toggle("active", item === button));
      const category = button.dataset.filter;
      products.forEach(product => {
        product.classList.toggle("is-hidden", category !== "all" && product.dataset.category !== category);
      });
    });
  });



  // Original ambient melody synthesized in-browser with Web Audio API.
  // No third-party song or recording is loaded. Audio starts only after a user tap.
  const welcome = document.querySelector("#welcome-screen");
  const enterWithMusic = document.querySelector("#enter-with-music");
  const enterSilent = document.querySelector("#enter-silent");
  const musicToggle = document.querySelector("#music-toggle");
  let audioContext = null;
  let masterGain = null;
  let musicTimer = null;
  let musicOn = false;
  let noteIndex = 0;
  const melody = [
    [523.25, 659.25, 783.99], [493.88, 587.33, 739.99],
    [440.00, 554.37, 659.25], [392.00, 493.88, 587.33],
    [440.00, 554.37, 659.25], [493.88, 587.33, 739.99],
    [523.25, 659.25, 783.99], [587.33, 698.46, 880.00]
  ];

  function playSoftNote(frequency, startAt, duration, volume, waveform = "sine") {
    const oscillator = audioContext.createOscillator();
    const gain = audioContext.createGain();
    oscillator.type = waveform;
    oscillator.frequency.setValueAtTime(frequency, startAt);
    gain.gain.setValueAtTime(0.0001, startAt);
    gain.gain.exponentialRampToValueAtTime(volume, startAt + 0.18);
    gain.gain.exponentialRampToValueAtTime(0.0001, startAt + duration);
    oscillator.connect(gain);
    gain.connect(masterGain);
    oscillator.start(startAt);
    oscillator.stop(startAt + duration + 0.05);
  }

  function playChord() {
    if (!audioContext || !masterGain || !musicOn) return;
    const now = audioContext.currentTime;
    const chord = melody[noteIndex % melody.length];
    // Soft pad chord with quiet, bell-like top note.
    chord.forEach((frequency, i) => {
      playSoftNote(frequency / 2, now + i * 0.09, 2.7, 0.035, "sine");
    });
    playSoftNote(chord[0] * 2, now + 0.2, 1.65, 0.018, "sine");
    playSoftNote(chord[1] * 1.5, now + 0.9, 1.25, 0.009, "sine");
    noteIndex += 1;
  }

  async function startMusic() {
    const AudioContextClass = window.AudioContext || window.webkitAudioContext;
    if (!AudioContextClass) {
      if (musicToggle) {
        musicToggle.textContent = "Musik tidak tersedia";
        musicToggle.disabled = true;
      }
      return false;
    }
    if (!audioContext) {
      audioContext = new AudioContextClass();
      masterGain = audioContext.createGain();
      masterGain.gain.value = 0.45;
      masterGain.connect(audioContext.destination);
    }
    await audioContext.resume();
    masterGain.gain.cancelScheduledValues(audioContext.currentTime);
    masterGain.gain.setTargetAtTime(0.45, audioContext.currentTime, 0.12);
    musicOn = true;
    playChord();
    if (musicTimer) window.clearInterval(musicTimer);
    musicTimer = window.setInterval(playChord, 2400);
    updateMusicButton();
    return true;
  }

  function stopMusic() {
    musicOn = false;
    if (musicTimer) window.clearInterval(musicTimer);
    musicTimer = null;
    if (masterGain && audioContext) {
      masterGain.gain.cancelScheduledValues(audioContext.currentTime);
      masterGain.gain.setTargetAtTime(0.0001, audioContext.currentTime, 0.12);
    }
    updateMusicButton();
  }

  function updateMusicButton() {
    if (!musicToggle) return;
    musicToggle.hidden = false;
    musicToggle.setAttribute("aria-pressed", String(musicOn));
    musicToggle.setAttribute("aria-label", musicOn ? "Matikan musik latar" : "Putar musik latar");
    musicToggle.innerHTML = musicOn ? "♫ <span>Musik aktif · matikan</span>" : "♫ <span>Nyalakan musik</span>";
  }

  function enterSite() {
    document.body.classList.remove("intro-locked");
    if (welcome) welcome.classList.add("is-leaving");
    window.setTimeout(() => {
      if (welcome) welcome.hidden = true;
    }, 600);
    if (musicToggle) musicToggle.hidden = false;
  }

  document.body.classList.add("intro-locked");
  if (enterWithMusic) {
    enterWithMusic.addEventListener("click", async () => {
      try { await startMusic(); } catch (error) { console.info("Audio tidak dapat dimulai pada browser ini.", error); }
      enterSite();
    });
  }
  if (enterSilent) enterSilent.addEventListener("click", enterSite);
  if (musicToggle) {
    musicToggle.addEventListener("click", async () => {
      if (musicOn) stopMusic();
      else {
        try { await startMusic(); } catch (error) { console.info("Audio tidak dapat dimulai pada browser ini.", error); }
      }
    });
  }

    const year = document.querySelector("#year");
  if (year) year.textContent = new Date().getFullYear();
})();
