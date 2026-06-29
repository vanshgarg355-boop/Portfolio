/* =========================================================
   script.js — Vansh Garg Portfolio
   Handles: Loader · Navbar · Typing · Orbital Skills ·
            Scroll Reveal · Ripple · Canvas Particles ·
            Modal · Hamburger
   ========================================================= */

/* =========================================================
   1. PAGE LOADER
   ========================================================= */
window.addEventListener('load', () => {
  const loader = document.getElementById('loader');
  // Give the loader at least 800ms so the animation is visible
  setTimeout(() => {
    loader.classList.add('hidden');
  }, 900);
});

/* =========================================================
   2. NAVBAR — scroll shadow + hamburger
   ========================================================= */
const navbar    = document.getElementById('navbar');
const hamburger = document.getElementById('hamburger');
const mobileMenu= document.getElementById('mobileMenu');
const mobLinks  = document.querySelectorAll('.mob-link');

// Add shadow on scroll
window.addEventListener('scroll', () => {
  navbar.style.boxShadow = window.scrollY > 40
    ? '0 4px 30px rgba(0,0,0,0.4)'
    : 'none';
});

// Toggle mobile drawer
hamburger.addEventListener('click', () => {
  hamburger.classList.toggle('open');
  mobileMenu.classList.toggle('open');
});

// Close drawer when a link is clicked
mobLinks.forEach(link => {
  link.addEventListener('click', () => {
    hamburger.classList.remove('open');
    mobileMenu.classList.remove('open');
  });
});

/* =========================================================
   3. TYPING ANIMATION
   ========================================================= */
const typedEl = document.getElementById('typed-text');
const words   = [
  'Frontend Developer',
  'UI/UX Enthusiast',
  'Prompt Engineer',
  'JavaScript Developer',
  'Creative Coder',
];

let wordIdx   = 0;
let charIdx   = 0;
let isDeleting = false;
let typingSpeed = 90;

function type() {
  const current = words[wordIdx];

  if (isDeleting) {
    // Remove a character
    typedEl.textContent = current.slice(0, --charIdx);
    typingSpeed = 50;
  } else {
    // Add a character
    typedEl.textContent = current.slice(0, ++charIdx);
    typingSpeed = 90;
  }

  if (!isDeleting && charIdx === current.length) {
    // Full word shown — pause then delete
    typingSpeed = 1600;
    isDeleting = true;
  } else if (isDeleting && charIdx === 0) {
    // Word deleted — next word
    isDeleting = false;
    wordIdx = (wordIdx + 1) % words.length;
    typingSpeed = 400;
  }

  setTimeout(type, typingSpeed);
}
type();

/* =========================================================
   4. HERO CANVAS — floating particles
   ========================================================= */
(function initCanvas() {
  const canvas = document.getElementById('heroCanvas');
  const ctx    = canvas.getContext('2d');
  let particles = [];

  function resize() {
    canvas.width  = canvas.offsetWidth;
    canvas.height = canvas.offsetHeight;
  }
  resize();
  window.addEventListener('resize', resize);

  // Create particles
  function makeParticle() {
    return {
      x: Math.random() * canvas.width,
      y: Math.random() * canvas.height,
      r: Math.random() * 2 + 0.5,
      dx: (Math.random() - 0.5) * 0.4,
      dy: (Math.random() - 0.5) * 0.4,
      alpha: Math.random() * 0.5 + 0.1,
      // Alternating neon colours
      color: Math.random() > 0.5 ? '56,189,248' : '167,139,250',
    };
  }

  for (let i = 0; i < 120; i++) particles.push(makeParticle());

  function draw() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    particles.forEach(p => {
      ctx.beginPath();
      ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(${p.color},${p.alpha})`;
      ctx.fill();

      // Move
      p.x += p.dx;
      p.y += p.dy;

      // Wrap edges
      if (p.x < 0) p.x = canvas.width;
      if (p.x > canvas.width) p.x = 0;
      if (p.y < 0) p.y = canvas.height;
      if (p.y > canvas.height) p.y = 0;
    });

    // Draw connecting lines between nearby particles
    for (let i = 0; i < particles.length; i++) {
      for (let j = i + 1; j < particles.length; j++) {
        const dx = particles[i].x - particles[j].x;
        const dy = particles[i].y - particles[j].y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        if (dist < 90) {
          ctx.beginPath();
          ctx.strokeStyle = `rgba(99,102,241,${0.15 * (1 - dist / 90)})`;
          ctx.lineWidth = 0.5;
          ctx.moveTo(particles[i].x, particles[i].y);
          ctx.lineTo(particles[j].x, particles[j].y);
          ctx.stroke();
        }
      }
    }

    requestAnimationFrame(draw);
  }
  draw();
})();

/* =========================================================
   5. ORBITAL SKILLS SYSTEM
   ========================================================= */
(function initOrbit() {
  const skills = [
    { name: 'C++',               icon: '⚙️' },
    { name: 'Prompt\nEng.',      icon: '🤖' },
    { name: 'Java',              icon: '☕' },
    { name: 'JavaScript',        icon: '🟨' },
    { name: 'HTML',              icon: '🌐' },
    { name: 'CSS',               icon: '🎨' },
    { name: 'Tailwind',          icon: '💨' },
    { name: 'Bootstrap',         icon: '🅱️' },
    { name: 'Angular',           icon: '🔺' },
    { name: 'React',             icon: '⚛️' },
    { name: 'Node.js',           icon: '🟢' },
  ];

  const system      = document.getElementById('orbitSystem');
  const SIZE        = system.offsetWidth;   // matches CSS min(560px, 90vw)
  const CENTER      = SIZE / 2;
  const RING_RADIUS = CENTER * 0.82;        // one orbital ring

  // Create a single orbital ring element
  const ring = document.createElement('div');
  ring.classList.add('orbit-ring');
  ring.style.width  = RING_RADIUS * 2 + 'px';
  ring.style.height = RING_RADIUS * 2 + 'px';
  system.appendChild(ring);

  // Internal rotation angle (degrees) of the whole system
  let angle = 0;           // current rotation angle
  let speed = 0.12;        // auto-spin speed (deg/frame)

  // Drag / pointer state
  let isDragging   = false;
  let lastMouseAngle = 0;
  let angularVelocity = 0;

  // Place each skill globe on the ring
  const globeAngles = skills.map((_, i) => (360 / skills.length) * i);

  const globeEls = skills.map((skill, i) => {
    const globe = document.createElement('div');
    globe.classList.add('skill-globe');
    globe.innerHTML = `<span class="skill-emoji">${skill.icon}</span><span>${skill.name}</span>`;
    globe.title = skill.name;
    system.appendChild(globe);
    return globe;
  });

  function positionGlobes() {
    globeEls.forEach((globe, i) => {
      // Each globe's actual angle = its fixed offset + current system rotation
      const rad = ((globeAngles[i] + angle) * Math.PI) / 180;
      const x = CENTER + RING_RADIUS * Math.cos(rad);
      const y = CENTER + RING_RADIUS * Math.sin(rad);
      globe.style.left = x + 'px';
      globe.style.top  = y + 'px';
    });
  }

  // Animation loop
  function animate() {
    if (!isDragging) {
      angle += speed;
      // Gradually slow friction after drag
      if (Math.abs(angularVelocity) > 0.01) {
        angle += angularVelocity;
        angularVelocity *= 0.96; // friction
      }
    }
    positionGlobes();
    requestAnimationFrame(animate);
  }
  animate();

  /* ── Drag to spin ── */
  function getAngleFromCenter(e) {
    const rect = system.getBoundingClientRect();
    const cx = rect.left + rect.width  / 2;
    const cy = rect.top  + rect.height / 2;
    const clientX = e.touches ? e.touches[0].clientX : e.clientX;
    const clientY = e.touches ? e.touches[0].clientY : e.clientY;
    return Math.atan2(clientY - cy, clientX - cx) * (180 / Math.PI);
  }

  system.addEventListener('mousedown', e => {
    isDragging = true;
    lastMouseAngle = getAngleFromCenter(e);
    angularVelocity = 0;
  });
  system.addEventListener('touchstart', e => {
    isDragging = true;
    lastMouseAngle = getAngleFromCenter(e);
    angularVelocity = 0;
  }, { passive: true });

  window.addEventListener('mousemove', e => {
    if (!isDragging) return;
    const current = getAngleFromCenter(e);
    const delta = current - lastMouseAngle;
    angularVelocity = delta;
    angle += delta;
    lastMouseAngle = current;
  });
  window.addEventListener('touchmove', e => {
    if (!isDragging) return;
    const current = getAngleFromCenter(e);
    const delta = current - lastMouseAngle;
    angularVelocity = delta;
    angle += delta;
    lastMouseAngle = current;
  }, { passive: true });

  window.addEventListener('mouseup',   () => { isDragging = false; });
  window.addEventListener('touchend',  () => { isDragging = false; });

  /* ── Scroll over orbit to spin ── */
  system.addEventListener('wheel', e => {
    e.preventDefault();
    angle += e.deltaY * 0.2;
  }, { passive: false });

})();

/* =========================================================
   6. SCROLL REVEAL (IntersectionObserver)
   ========================================================= */
const revealEls = document.querySelectorAll('.reveal');

const observer = new IntersectionObserver(
  entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        // Stagger siblings slightly for a cascade effect
        const siblings = entry.target.parentElement.querySelectorAll('.reveal');
        siblings.forEach((el, i) => {
          el.style.transitionDelay = i * 80 + 'ms';
        });
      }
    });
  },
  { threshold: 0.12 }
);

revealEls.forEach(el => observer.observe(el));

/* =========================================================
   7. RIPPLE EFFECT
   ========================================================= */
document.querySelectorAll('.ripple').forEach(btn => {
  btn.addEventListener('click', function (e) {
    const rect = this.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const size = Math.max(rect.width, rect.height);

    const ripple = document.createElement('span');
    ripple.classList.add('ripple-wave');
    ripple.style.cssText = `
      width: ${size}px; height: ${size}px;
      left: ${x - size / 2}px; top: ${y - size / 2}px;
    `;
    this.appendChild(ripple);

    // Remove the element after animation completes
    ripple.addEventListener('animationend', () => ripple.remove());
  });
});

/* =========================================================
   9. SMOOTH ACTIVE NAV HIGHLIGHT on scroll
   ========================================================= */
const sections  = document.querySelectorAll('section[id]');
const navAnchors= document.querySelectorAll('.nav-links a');

const sectionObserver = new IntersectionObserver(
  entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        navAnchors.forEach(a => a.classList.remove('active'));
        const match = document.querySelector(`.nav-links a[href="#${entry.target.id}"]`);
        if (match) match.classList.add('active');
      }
    });
  },
  { threshold: 0.4 }
);

sections.forEach(sec => sectionObserver.observe(sec));

/* =========================================================
   10. FLOATING DECORATIVE ELEMENTS in hero (subtle)
   ========================================================= */
(function addFloaters() {
  const hero = document.getElementById('hero');
  const svgs = [
    `<svg width="60" height="60" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1"><polyline points="16 18 22 12 16 6"/><polyline points="8 6 2 12 8 18"/></svg>`,
    `<svg width="50" height="50" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1"><circle cx="12" cy="12" r="10"/><polygon points="10 8 16 12 10 16 10 8"/></svg>`,
    `<svg width="70" height="70" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1"><rect x="4" y="4" width="16" height="16" rx="2"/></svg>`,
  ];

  const positions = [
    { top: '15%', left: '5%',  delay: '0s'   },
    { top: '70%', left: '3%',  delay: '1.5s' },
    { top: '20%', right: '5%', delay: '0.8s' },
  ];

  svgs.forEach((svg, i) => {
    const div = document.createElement('div');
    div.classList.add('float-icon');
    div.innerHTML = svg;
    Object.assign(div.style, positions[i]);
    div.style.animationDelay = positions[i].delay;
    hero.appendChild(div);
  });
})();
