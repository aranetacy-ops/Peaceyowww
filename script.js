// DOM Elements
const mainCard = document.getElementById('mainCard');
const questionView = document.getElementById('questionView');
const successView = document.getElementById('successView');
const yesBtn = document.getElementById('yesBtn');
const noBtn = document.getElementById('noBtn');
const noBtnText = document.getElementById('noBtnText');
const dodgeCounter = document.getElementById('dodgeCounter');
const replayBtn = document.getElementById('replayBtn');
const confettiCanvas = document.getElementById('confettiCanvas');

// Funny peace offering dodging phrases
const funnyPhrases = [
  "Still mad 😤",
  "Whoosh! 💨",
  "Can't stay mad! 😜",
  "Truce is mandatory! 🏳️",
  "Too slow! 🏃‍♂️",
  "Drop the grudge! 😂",
  "Forgive already! 🥺",
  "Peace only! ✌️",
  "Wrong button! 👉🤝"
];

let dodgeCount = 0;
let currentSideIndex = -1;

/* ===================================================
   CARD DODGING LOGIC (HOVER / TOUCH "STILL MAD")
   When hovering or touching "No", the entire card
   escapes to another side of the screen!
=================================================== */
function moveCardToAnotherSide(event) {
  if (event) {
    // Prevent touch defaults so tap doesn't register as a click on mobile
    if (event.type === 'touchstart' || event.type === 'pointerdown') {
      event.preventDefault();
    }
  }

  dodgeCount++;

  // Viewport dimensions & card size
  const vpWidth = window.innerWidth;
  const vpHeight = window.innerHeight;
  const cardWidth = mainCard.offsetWidth || 380;
  const cardHeight = mainCard.offsetHeight || 420;

  // Safe boundary margins so card stays safely inside screen
  const safeMargin = 16;
  let maxShiftX = Math.max(10, (vpWidth / 2) - (cardWidth / 2) - safeMargin);
  let maxShiftY = Math.max(10, (vpHeight / 2) - (cardHeight / 2) - safeMargin);

  // Subtle mobile scale adjustment to give ample room to jump around
  const isMobile = vpWidth < 600;
  const scaleEffect = isMobile ? 0.94 : 1;

  if (isMobile) {
    maxShiftX = Math.max(25, maxShiftX + 20);
  }

  // Predefined screen sides & corners (left, right, top-left, bottom-right, etc.)
  const sides = [
    { name: 'left', x: -maxShiftX * 0.95, y: 0, rotate: -3 },
    { name: 'right', x: maxShiftX * 0.95, y: 0, rotate: 3 },
    { name: 'top-left', x: -maxShiftX * 0.85, y: -maxShiftY * 0.75, rotate: -4 },
    { name: 'bottom-right', x: maxShiftX * 0.85, y: maxShiftY * 0.75, rotate: 4 },
    { name: 'top-right', x: maxShiftX * 0.85, y: -maxShiftY * 0.75, rotate: 3 },
    { name: 'bottom-left', x: -maxShiftX * 0.85, y: maxShiftY * 0.75, rotate: -3 },
    { name: 'bottom', x: 0, y: maxShiftY * 0.85, rotate: 2 },
    { name: 'top', x: 0, y: -maxShiftY * 0.85, rotate: -2 }
  ];

  // Pick a side different from the current one
  let eligibleIndices = sides.map((_, i) => i).filter(i => i !== currentSideIndex);
  let randomIndex = eligibleIndices[Math.floor(Math.random() * eligibleIndices.length)];
  currentSideIndex = randomIndex;
  const chosenSide = sides[randomIndex];

  // Move the entire card to another side!
  mainCard.style.transform = `translate(${chosenSide.x}px, ${chosenSide.y}px) scale(${scaleEffect}) rotate(${chosenSide.rotate}deg)`;

  // Update button text and counter hint
  const phrase = funnyPhrases[dodgeCount % funnyPhrases.length];
  noBtnText.textContent = phrase;

  if (dodgeCount >= 1) {
    dodgeCounter.textContent = `Dodged grudge ${dodgeCount} time${dodgeCount > 1 ? 's' : ''}! 🏃💨 (Just accept the truce!)`;
  }
}

// Attach hover and mobile touch listeners to the "Still mad" button
noBtn.addEventListener('mouseenter', moveCardToAnotherSide);
noBtn.addEventListener('mouseover', moveCardToAnotherSide);
noBtn.addEventListener('touchstart', moveCardToAnotherSide, { passive: false });
noBtn.addEventListener('pointerdown', moveCardToAnotherSide);

// If clicked by any chance, immediately trigger dodge
noBtn.addEventListener('click', (e) => {
  e.preventDefault();
  moveCardToAnotherSide(e);
});

/* ===================================================
   PROCEED INSIDE MAIN CARD ON "YES" (TRUCE ACCEPTED)
=================================================== */
yesBtn.addEventListener('click', () => {
  // Smoothly center the card back
  mainCard.style.transform = 'translate(0px, 0px) scale(1) rotate(0deg)';

  // Hide dodge counter
  dodgeCounter.textContent = '';

  // Switch view from question to inside the main card box
  questionView.classList.add('hidden');
  successView.classList.remove('hidden');

  // Trigger celebration confetti
  launchConfetti();
});

/* ===================================================
   REPLAY FUNCTIONALITY
=================================================== */
if (replayBtn) {
  replayBtn.addEventListener('click', () => {
    // Reset state & center card
    dodgeCount = 0;
    currentSideIndex = -1;
    mainCard.style.transform = 'translate(0px, 0px) scale(1) rotate(0deg)';
    
    noBtnText.textContent = "Still mad 😤";
    dodgeCounter.textContent = '';

    // Switch views back
    successView.classList.add('hidden');
    questionView.classList.remove('hidden');
  });
}

/* ===================================================
   CONFETTI CELEBRATION ENGINE (CANVAS)
=================================================== */
function launchConfetti() {
  const ctx = confettiCanvas.getContext('2d');
  confettiCanvas.width = window.innerWidth;
  confettiCanvas.height = window.innerHeight;

  const particles = [];
  const colors = ['#10b981', '#059669', '#3b82f6', '#f59e0b', '#06b6d4', '#64748b', '#ffffff'];

  for (let i = 0; i < 120; i++) {
    particles.push({
      x: window.innerWidth / 2,
      y: window.innerHeight / 2,
      r: Math.random() * 6 + 4,
      d: Math.random() * 20,
      color: colors[Math.floor(Math.random() * colors.length)],
      vx: (Math.random() - 0.5) * 16,
      vy: (Math.random() - 0.7) * 18,
      gravity: 0.35,
      tilt: Math.floor(Math.random() * 10) - 10,
      tiltAngle: 0,
      tiltAngleInc: (Math.random() * 0.07) + 0.05,
      alpha: 1
    });
  }

  let animationFrame;
  let timer = 0;

  function render() {
    ctx.clearRect(0, 0, confettiCanvas.width, confettiCanvas.height);

    particles.forEach((p) => {
      p.x += p.vx;
      p.y += p.vy;
      p.vy += p.gravity;
      p.tiltAngle += p.tiltAngleInc;
      p.tilt = Math.sin(p.tiltAngle) * 15;

      if (timer > 60) {
        p.alpha -= 0.015;
      }

      if (p.alpha > 0) {
        ctx.beginPath();
        ctx.lineWidth = p.r / 2;
        ctx.strokeStyle = p.color;
        ctx.fillStyle = p.color;
        ctx.globalAlpha = Math.max(0, p.alpha);
        ctx.moveTo(p.x + p.tilt + p.r, p.y);
        ctx.lineTo(p.x + p.tilt, p.y + p.tilt + p.r);
        ctx.stroke();
      }
    });

    timer++;

    if (particles.some(p => p.alpha > 0) && timer < 180) {
      animationFrame = requestAnimationFrame(render);
    } else {
      ctx.clearRect(0, 0, confettiCanvas.width, confettiCanvas.height);
      cancelAnimationFrame(animationFrame);
    }
  }

  render();
}

// Window resize safety: recalculate confetti canvas size
window.addEventListener('resize', () => {
  if (confettiCanvas) {
    confettiCanvas.width = window.innerWidth;
    confettiCanvas.height = window.innerHeight;
  }
});
