// For Kaveesha - JavaScript Interactions and Animations

// ==========================================
// --- CONFIGURATION (Change these to your own details!) ---
const MY_EMAIL = "nuwensarathchandra14@gmail.com"; // Enter your email here to receive the letters
const MY_WHATSAPP_NUMBER = "94779598323"; // Enter your phone number with country code (no spaces/plus, e.g. "94771234567")
// ==========================================

document.addEventListener('DOMContentLoaded', () => {
  // --- 1. Starry Night Canvas ---
  const canvas = document.getElementById('starsCanvas');
  if (canvas) {
    const ctx = canvas.getContext('2d');
    let stars = [];
    let mouse = { x: null, y: null, radius: 100 };

    const resizeCanvas = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
      initStars();
    };

    const initStars = () => {
      stars = [];
      const density = 0.00015; // Star density per pixel
      const starCount = Math.floor(canvas.width * canvas.height * density);

      for (let i = 0; i < starCount; i++) {
        stars.push({
          x: Math.random() * canvas.width,
          y: Math.random() * canvas.height,
          size: Math.random() * 1.5 + 0.5,
          baseOpacity: Math.random() * 0.7 + 0.3,
          opacity: Math.random(),
          speed: Math.random() * 0.02 + 0.005,
          twinkleFactor: Math.random() > 0.5 ? 1 : -1,
        });
      }
    };

    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      stars.forEach(star => {
        // Twinkling effect
        star.opacity += star.speed * star.twinkleFactor;
        if (star.opacity > star.baseOpacity || star.opacity < 0.1) {
          star.twinkleFactor *= -1;
        }

        // Draw star
        ctx.fillStyle = `rgba(240, 230, 255, ${Math.max(0.1, star.opacity)})`;
        ctx.beginPath();
        ctx.arc(star.x, star.y, star.size, 0, Math.PI * 2);
        ctx.fill();

        // Subtle glow for stars near mouse
        if (mouse.x !== null && mouse.y !== null) {
          const dx = star.x - mouse.x;
          const dy = star.y - mouse.y;
          const distance = Math.sqrt(dx * dx + dy * dy);
          if (distance < mouse.radius) {
            // Draw a subtle connecting glow or halo
            const glowIntensity = (1 - distance / mouse.radius) * 0.5;
            ctx.fillStyle = `rgba(155, 138, 191, ${glowIntensity})`;
            ctx.beginPath();
            ctx.arc(star.x, star.y, star.size * 2, 0, Math.PI * 2);
            ctx.fill();
          }
        }
      });

      requestAnimationFrame(animate);
    };

    window.addEventListener('resize', resizeCanvas);
    window.addEventListener('mousemove', (e) => {
      mouse.x = e.clientX;
      mouse.y = e.clientY;
    });
    window.addEventListener('mouseleave', () => {
      mouse.x = null;
      mouse.y = null;
    });

    resizeCanvas();
    animate();
  }

  // --- 1.5 Falling Flower Petals Canvas ---
  const petalsCanvas = document.getElementById('petalsCanvas');
  if (petalsCanvas) {
    const pCtx = petalsCanvas.getContext('2d');
    let petals = [];

    const resizePetals = () => {
      petalsCanvas.width = window.innerWidth;
      petalsCanvas.height = window.innerHeight;
    };

    const petalColors = [
      { c1: '#ffd1dc', c2: '#ff9ebb', v: '#e5809e' }, // soft pink
      { c1: '#f8c8dc', c2: '#e6a8d7', v: '#c97bb6' }, // blush lavender
      { c1: '#ffe4e1', c2: '#ffb6c1', v: '#ea899a' }, // misty rose
      { c1: '#eed9fc', c2: '#cca7e6', v: '#a973cb' }, // pale violet
      { c1: '#fff0f5', c2: '#ffc5d3', v: '#e690a2' }  // lavender blush
    ];

    const initPetals = () => {
      petals = [];
      const count = Math.min(Math.floor(window.innerWidth * 0.035), 45);
      for (let i = 0; i < count; i++) {
        const color = petalColors[Math.floor(Math.random() * petalColors.length)];
        const isFlower = Math.random() < 0.22; // ~20% full blossom, 80% petals
        petals.push({
          x: Math.random() * petalsCanvas.width,
          y: Math.random() * petalsCanvas.height,
          size: isFlower ? Math.random() * 5 + 8 : Math.random() * 6 + 7,
          speedY: Math.random() * 1.2 + 0.6,
          speedX: (Math.random() - 0.5) * 0.5,
          wobble: Math.random() * Math.PI * 2,
          wobbleSpeed: Math.random() * 0.02 + 0.01,
          angle: Math.random() * Math.PI * 2,
          spinSpeed: (Math.random() - 0.5) * 0.03,
          opacity: Math.random() * 0.35 + 0.55,
          color1: color.c1,
          color2: color.c2,
          veinColor: color.v,
          isFlower: isFlower
        });
      }
    };

    const drawPetal = (p) => {
      pCtx.save();
      pCtx.translate(p.x, p.y);
      pCtx.rotate(p.angle);
      const flip = Math.cos(p.wobble);
      pCtx.scale(flip, 1);
      pCtx.globalAlpha = p.opacity;

      if (p.isFlower) {
        // Delicate 5-petal blossom
        for (let i = 0; i < 5; i++) {
          pCtx.save();
          pCtx.rotate((i * Math.PI * 2) / 5);
          const grad = pCtx.createRadialGradient(0, 0, 0, 0, p.size, p.size);
          grad.addColorStop(0, '#ffffff');
          grad.addColorStop(0.5, p.color1);
          grad.addColorStop(1, p.color2);
          pCtx.fillStyle = grad;
          pCtx.beginPath();
          pCtx.moveTo(0, 0);
          pCtx.bezierCurveTo(p.size * 0.5, -p.size * 0.4, p.size * 0.6, p.size * 0.7, 0, p.size);
          pCtx.bezierCurveTo(-p.size * 0.6, p.size * 0.7, -p.size * 0.5, -p.size * 0.4, 0, 0);
          pCtx.fill();
          pCtx.restore();
        }
        // Center pistil
        pCtx.beginPath();
        pCtx.arc(0, 0, p.size * 0.22, 0, Math.PI * 2);
        pCtx.fillStyle = '#ffeaa7';
        pCtx.fill();
      } else {
        // Curved petal
        const grad = pCtx.createLinearGradient(0, -p.size, 0, p.size);
        grad.addColorStop(0, p.color1);
        grad.addColorStop(1, p.color2);
        pCtx.fillStyle = grad;

        pCtx.beginPath();
        pCtx.moveTo(0, -p.size);
        pCtx.bezierCurveTo(p.size * 0.8, -p.size * 0.5, p.size * 0.8, p.size * 0.8, 0, p.size);
        pCtx.bezierCurveTo(-p.size * 0.8, p.size * 0.8, -p.size * 0.8, -p.size * 0.5, 0, -p.size);
        pCtx.fill();

        // Delicate vein
        pCtx.strokeStyle = p.veinColor;
        pCtx.lineWidth = 0.6;
        pCtx.globalAlpha = p.opacity * 0.5;
        pCtx.beginPath();
        pCtx.moveTo(0, -p.size * 0.7);
        pCtx.lineTo(0, p.size * 0.6);
        pCtx.stroke();
      }

      pCtx.restore();
    };

    const animatePetals = () => {
      pCtx.clearRect(0, 0, petalsCanvas.width, petalsCanvas.height);

      petals.forEach(p => {
        p.wobble += p.wobbleSpeed;
        p.angle += p.spinSpeed;
        p.y += p.speedY;
        p.x += Math.sin(p.wobble) * 0.8 + p.speedX;

        // Reset if offscreen
        if (p.y > petalsCanvas.height + 40) {
          p.y = -30;
          p.x = Math.random() * petalsCanvas.width;
        }
        if (p.x > petalsCanvas.width + 40) {
          p.x = -20;
        } else if (p.x < -40) {
          p.x = petalsCanvas.width + 20;
        }

        drawPetal(p);
      });

      requestAnimationFrame(animatePetals);
    };

    window.addEventListener('resize', () => {
      resizePetals();
      initPetals();
    });

    resizePetals();
    initPetals();
    animatePetals();
  }

  // --- 2. Dynamic Counters ---
  const metDate = new Date('2025-11-19T00:00:00');
  const officialDate = new Date('2026-05-04T00:00:00');
  // 1 month anniversary from official date is 2026-06-04
  const oneMonthDate = new Date('2026-06-04T00:00:00');

  const updateCounters = () => {
    const today = new Date();

    // Normalize to midnight for clean day calculation
    const todayMidnight = new Date(today.getFullYear(), today.getMonth(), today.getDate());

    const getDaysDiff = (start, end) => {
      const msDiff = end - start;
      return Math.floor(msDiff / (1000 * 60 * 60 * 24));
    };

    const daysSinceMet = getDaysDiff(metDate, todayMidnight);
    const daysOfficial = getDaysDiff(officialDate, todayMidnight);

    // Remaining days to next monthly milestone
    let nextAnniversary = oneMonthDate;
    if (getDaysDiff(todayMidnight, oneMonthDate) < 0) {
      let targetMonth = today.getMonth();
      let targetYear = today.getFullYear();

      // If today is past the 4th, target the 4th of next month
      if (today.getDate() > 4) {
        targetMonth += 1;
        if (targetMonth > 11) {
          targetMonth = 0;
          targetYear += 1;
        }
      }
      nextAnniversary = new Date(targetYear, targetMonth, 4);
    }
    const daysToNext = getDaysDiff(todayMidnight, nextAnniversary);

    // Calculate how many months anniversary this milestone represents
    const monthsTogether =
      (nextAnniversary.getFullYear() - officialDate.getFullYear()) * 12 +
      (nextAnniversary.getMonth() - officialDate.getMonth());

    // Element references
    const cntMetEl = document.getElementById('cnt-met');
    const cntOfficialEl = document.getElementById('cnt-official');
    const cntNextEl = document.getElementById('cnt-next');
    const cntNextLabelEl =
      document.getElementById('cnt-next-label') ||
      cntNextEl?.parentElement?.querySelector('.counter-label');

    if (cntNextLabelEl) {
      cntNextLabelEl.textContent = `days to ${monthsTogether} ${monthsTogether === 1 ? 'month' : 'months'}`;
    }

    // Animate counter logic
    const animateValue = (element, targetValue, duration = 1500) => {
      if (!element) return;
      if (isNaN(targetValue) || targetValue < 0) {
        element.textContent = '0';
        return;
      }

      let startTimestamp = null;
      const step = (timestamp) => {
        if (!startTimestamp) startTimestamp = timestamp;
        const progress = Math.min((timestamp - startTimestamp) / duration, 1);
        element.textContent = Math.floor(progress * targetValue);
        if (progress < 1) {
          window.requestAnimationFrame(step);
        } else {
          element.textContent = targetValue;
        }
      };
      window.requestAnimationFrame(step);
    };

    animateValue(cntMetEl, daysSinceMet);
    animateValue(cntOfficialEl, daysOfficial);
    animateValue(cntNextEl, daysToNext);
  };

  updateCounters();

  // --- 3. Photo Frame Section ---
  // The photo is now set statically via the image src attribute in HTML.

  // --- 4. Kaveesha's Reply Persistence & Sending ---
  const replyBox = document.getElementById('replyBox');
  const sendEmailBtn = document.getElementById('sendEmailBtn');
  const sendWhatsappBtn = document.getElementById('sendWhatsappBtn');
  const replyStatus = document.getElementById('reply-status');

  // Load saved reply if exists
  if (replyBox) {
    const savedReply = localStorage.getItem('kaveesha_reply');
    if (savedReply) {
      replyBox.value = savedReply;
    }

    // Auto-save draft as she types
    replyBox.addEventListener('input', () => {
      localStorage.setItem('kaveesha_reply', replyBox.value);
    });
  }

  // Send via Email (using FormSubmit.co API)
  if (sendEmailBtn && replyBox) {
    sendEmailBtn.addEventListener('click', async () => {
      const text = replyBox.value.trim();
      if (!text) {
        showStatus(replyStatus, 'Please write something first! ✍️', 'rgba(255, 100, 100, 0.8)');
        return;
      }

      if (MY_EMAIL === "your-email@example.com") {
        showStatus(replyStatus, 'Error: You need to set your email address in script.js first! 📧', 'rgba(255, 100, 100, 0.8)');
        return;
      }

      showStatus(replyStatus, 'Sending your letter into the cosmos... 🌌', 'var(--accent-mid)');
      sendEmailBtn.disabled = true;

      try {
        const response = await fetch(`https://formsubmit.co/ajax/${MY_EMAIL}`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json'
          },
          body: JSON.stringify({
            name: "Kaveesha",
            message: text,
            _subject: "A letter from Kaveesha! 💌"
          })
        });

        const data = await response.json();

        if (data.success === "true" || response.ok) {
          showStatus(replyStatus, 'Sent to his email! 📩✨', 'var(--accent-light)');
        } else {
          throw new Error('Failed to send');
        }
      } catch (err) {
        console.error(err);
        showStatus(replyStatus, 'Cosmic block! Please try again or use WhatsApp 💫', 'rgba(255, 100, 100, 0.8)');
      } finally {
        sendEmailBtn.disabled = false;
      }
    });
  }

  // Send via WhatsApp
  if (sendWhatsappBtn && replyBox) {
    sendWhatsappBtn.addEventListener('click', () => {
      const text = replyBox.value.trim();
      if (!text) {
        showStatus(replyStatus, 'Please write something first! ✍️', 'rgba(255, 100, 100, 0.8)');
        return;
      }

      if (MY_WHATSAPP_NUMBER === "your-whatsapp-number") {
        showStatus(replyStatus, 'Error: You need to set your WhatsApp number in script.js first! 💬', 'rgba(255, 100, 100, 0.8)');
        return;
      }

      showStatus(replyStatus, 'Opening WhatsApp... 💬', 'var(--accent-light)');
      const formattedText = `Hi! I wrote this for you: \n\n"${text}"`;
      const url = `https://api.whatsapp.com/send?phone=${MY_WHATSAPP_NUMBER}&text=${encodeURIComponent(formattedText)}`;
      window.open(url, '_blank');
    });
  }

  // --- 5. Constellation Glassy Popups ---
  const constellationData = [
    {
      title: "First met",
      date: "19 Nov 2025",
      image: "first.jpg",
      quote: "“Under the very same sky, the universe whispered our names and rewrote our destinies.”"
    },
    {
      title: "The confession",
      date: "28 Apr 2026",
      image: "us.JPG",
      quote: "“In the quiet of the night, words became courage, and silence turned into forever.”"
    },
    {
      title: "It became official",
      date: "4 May 2026",
      image: "third.JPG",
      quote: "“My favorite place in the entire cosmos is right here, standing by your side.”"
    }
  ];

  const constellationCards = document.querySelectorAll('.const-card');
  const modalOverlay = document.getElementById('constellationModal');
  const modalTitle = document.getElementById('modalTitle');
  const modalDate = document.getElementById('modalDate');
  const modalImage = document.getElementById('modalImage');
  const modalQuote = document.getElementById('modalQuote');
  const modalCloseBtn = document.getElementById('modalCloseBtn');

  const closeModal = () => {
    if (modalOverlay) {
      modalOverlay.classList.remove('active');
      document.body.classList.remove('modal-open');
    }
  };

  if (constellationCards && modalOverlay) {
    constellationCards.forEach(card => {
      card.addEventListener('click', () => {
        const index = card.getAttribute('data-index');
        if (index !== null && constellationData[index]) {
          const data = constellationData[index];
          if (modalTitle) modalTitle.textContent = data.title;
          if (modalDate) modalDate.textContent = data.date;
          if (modalImage) modalImage.src = data.image;
          if (modalQuote) modalQuote.textContent = data.quote;

          modalOverlay.classList.add('active');
          document.body.classList.add('modal-open');
        }
      });
    });
  }

  if (modalCloseBtn) {
    modalCloseBtn.addEventListener('click', closeModal);
  }

  if (modalOverlay) {
    modalOverlay.addEventListener('click', (e) => {
      if (e.target === modalOverlay) {
        closeModal();
      }
    });
  }

  window.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
      closeModal();
    }
  });

  // Helper function to display temporary status text
  const showStatus = (element, message, color) => {
    if (!element) return;
    element.textContent = message;
    element.style.color = color;
    element.style.opacity = '1';

    // Smooth fade out after 3 seconds
    setTimeout(() => {
      element.style.transition = 'opacity 1s ease';
      element.style.opacity = '0';
      setTimeout(() => {
        element.textContent = '';
        element.style.transition = '';
      }, 1000);
    }, 3000);
  };

  // --- 5. Background Music Player ("Adaariye - Cozzy") ---
  const bgMusic = document.getElementById('bgMusic');
  const musicPill = document.getElementById('musicToggleBtn');
  const musicPlayIcon = document.getElementById('musicPlayIcon');
  const musicActionText = document.getElementById('musicActionText');

  if (bgMusic && musicPill) {
    bgMusic.volume = 0.45;

    const startPlayback = () => {
      const playPromise = bgMusic.play();
      if (playPromise !== undefined) {
        playPromise
          .then(() => {
            musicPill.classList.add('playing');
            if (musicPlayIcon) musicPlayIcon.textContent = '⏸';
            if (musicActionText) musicActionText.textContent = 'Now Playing';
          })
          .catch(() => {
            // Autoplay blocked by browser policy until interaction
            musicPill.classList.remove('playing');
            if (musicPlayIcon) musicPlayIcon.textContent = '▶';
            if (musicActionText) musicActionText.textContent = 'Click to Play';
          });
      }
    };

    const pausePlayback = () => {
      bgMusic.pause();
      musicPill.classList.remove('playing');
      if (musicPlayIcon) musicPlayIcon.textContent = '▶';
      if (musicActionText) musicActionText.textContent = 'Paused';
    };

    musicPill.addEventListener('click', (e) => {
      e.stopPropagation();
      if (bgMusic.paused) {
        startPlayback();
      } else {
        pausePlayback();
      }
    });

    // Start playing on first user gesture anywhere on page
    const handleFirstGesture = () => {
      if (bgMusic.paused) {
        startPlayback();
      }
      window.removeEventListener('click', handleFirstGesture);
      window.removeEventListener('touchstart', handleFirstGesture);
      window.removeEventListener('keydown', handleFirstGesture);
      window.removeEventListener('scroll', handleFirstGesture);
    };

    window.addEventListener('click', handleFirstGesture, { once: true });
    window.addEventListener('touchstart', handleFirstGesture, { once: true });
    window.addEventListener('keydown', handleFirstGesture, { once: true });
    window.addEventListener('scroll', handleFirstGesture, { once: true });

    // Initial play attempt
    startPlayback();
  }

  // --- 6. Day / Night Theme Toggle ---
  const themeToggleBtn = document.getElementById('themeToggleBtn');
  const themeIcon = document.getElementById('themeIcon');
  const themeLabel = document.getElementById('themeLabel');

  const applyTheme = (isDay) => {
    if (isDay) {
      document.body.classList.add('day-mode');
      if (themeIcon) themeIcon.textContent = '🌙';
      if (themeLabel) themeLabel.textContent = 'Night';
      if (themeToggleBtn) themeToggleBtn.setAttribute('title', 'Switch to Night Mode');
    } else {
      document.body.classList.remove('day-mode');
      if (themeIcon) themeIcon.textContent = '☀️';
      if (themeLabel) themeLabel.textContent = 'Day';
      if (themeToggleBtn) themeToggleBtn.setAttribute('title', 'Switch to Day Mode');
    }
  };

  // Check saved preference or system preference
  const savedTheme = localStorage.getItem('kaveesha_theme');
  if (savedTheme === 'day') {
    applyTheme(true);
  }

  if (themeToggleBtn) {
    themeToggleBtn.addEventListener('click', () => {
      const isCurrentlyDay = document.body.classList.contains('day-mode');
      const nextIsDay = !isCurrentlyDay;
      applyTheme(nextIsDay);
      localStorage.setItem('kaveesha_theme', nextIsDay ? 'day' : 'night');
    });
  }
});
