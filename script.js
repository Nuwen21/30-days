// For Kaveesha - JavaScript Interactions and Animations

// ==========================================
// --- CONFIGURATION (Change these to your own details!) ---
const MY_EMAIL = "your-email@example.com"; // Enter your email here to receive the letters
const MY_WHATSAPP_NUMBER = "your-whatsapp-number"; // Enter your phone number with country code (no spaces/plus, e.g. "94771234567")
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
    
    // Remaining days to 1 month
    let daysToNext = getDaysDiff(todayMidnight, oneMonthDate);
    if (daysToNext < 0) {
      // If we are past the 1 month anniversary, calculate days to the next month's anniversary
      // E.g., July 4th, August 4th, etc.
      let targetMonth = today.getMonth();
      let targetYear = today.getFullYear();
      
      // If today is past the 4th, target the 4th of next month
      if (today.getDate() >= 4) {
        targetMonth += 1;
        if (targetMonth > 11) {
          targetMonth = 0;
          targetYear += 1;
        }
      }
      const nextAnniversary = new Date(targetYear, targetMonth, 4);
      daysToNext = getDaysDiff(todayMidnight, nextAnniversary);
    }

    // Element references
    const cntMetEl = document.getElementById('cnt-met');
    const cntOfficialEl = document.getElementById('cnt-official');
    const cntNextEl = document.getElementById('cnt-next');

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

  // --- 3. Photo Frame Upload & Persistence ---
  const photoFrame = document.getElementById('photoFrame');
  const photoInput = document.getElementById('photoInput');
  const photoImg = document.getElementById('photoImg');
  const photoPlaceholder = document.getElementById('photoPlaceholder');
  const uploadStatus = document.getElementById('upload-status');

  // Trigger input click when photo frame is clicked
  if (photoFrame && photoInput) {
    photoFrame.addEventListener('click', () => {
      photoInput.click();
    });
  }

  // Load saved photo if exists
  const savedPhoto = localStorage.getItem('kaveesha_love_photo');
  if (savedPhoto && photoImg && photoPlaceholder) {
    photoImg.src = savedPhoto;
    photoImg.style.display = 'block';
    photoPlaceholder.style.display = 'none';
  }

  // Handle new photo upload
  if (photoInput) {
    photoInput.addEventListener('change', (e) => {
      const file = e.target.files[0];
      if (file) {
        if (file.size > 2 * 1024 * 1024) {
          showStatus(uploadStatus, 'Please select an image smaller than 2MB ✨', 'rgba(240, 230, 255, 0.7)');
          return;
        }

        const reader = new FileReader();
        reader.onload = (event) => {
          const base64Image = event.target.result;
          try {
            localStorage.setItem('kaveesha_love_photo', base64Image);
            if (photoImg && photoPlaceholder) {
              photoImg.src = base64Image;
              photoImg.style.display = 'block';
              photoPlaceholder.style.display = 'none';
            }
            showStatus(uploadStatus, 'Saved in our galaxy! 💫', 'var(--accent-light)');
          } catch (error) {
            console.error(error);
            showStatus(uploadStatus, 'Image too large to save in browser memory 🌟', 'rgba(255, 100, 100, 0.8)');
          }
        };
        reader.readAsDataURL(file);
      }
    });
  }

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
      const url = `https://wa.me/${MY_WHATSAPP_NUMBER}?text=${encodeURIComponent(formattedText)}`;
      window.open(url, '_blank');
    });
  }

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
});
