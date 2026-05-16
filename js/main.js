/**
 * main.js — Era Reformasi Indonesia
 * Micro-interactions: scroll progress, nav state, count-up, fade-in
 */

/* ── 0. HAMBURGER MENU TOGGLE ── */
const hamburger = document.querySelector('.nav-hamburger');
const navLinks = document.querySelector('.nav-links');
const navLinksItems = document.querySelectorAll('.nav-links a');

// Toggle menu
hamburger.addEventListener('click', () => {
  hamburger.classList.toggle('active');
  navLinks.classList.toggle('active');
  document.body.style.overflow = navLinks.classList.contains('active') ? 'hidden' : '';
});

// Close menu when clicking a link
navLinksItems.forEach(link => {
  link.addEventListener('click', () => {
    hamburger.classList.remove('active');
    navLinks.classList.remove('active');
    document.body.style.overflow = '';
  });
});

// Close menu when clicking outside
document.addEventListener('click', (e) => {
  if (!e.target.closest('nav')) {
    hamburger.classList.remove('active');
    navLinks.classList.remove('active');
    document.body.style.overflow = '';
  }
});

/* ── 1. SCROLL PROGRESS BAR ── */
const progressBar = document.createElement('div');
progressBar.className = 'scroll-progress';
document.body.prepend(progressBar);

function updateProgress() {
  const scrollTop  = window.scrollY;
  const docHeight  = document.documentElement.scrollHeight - window.innerHeight;
  const pct        = docHeight > 0 ? (scrollTop / docHeight) * 100 : 0;
  progressBar.style.width = pct + '%';
}

/* ── 2. NAV: transparent → solid on scroll ── */
const nav = document.querySelector('nav');

function updateNav() {
  nav.classList.toggle('scrolled', window.scrollY > 60);
}

/* ── 3. ACTIVE NAV LINK — highlight current section ── */
const sections   = Array.from(document.querySelectorAll('section[id]'));
const navLinksAll   = Array.from(document.querySelectorAll('.nav-links a'));
const indexItems = Array.from(document.querySelectorAll('.hero-index-list li'));

function updateActiveNav() {
  const scrollMid = window.scrollY + window.innerHeight * 0.4;
  let current = '';

  sections.forEach(sec => {
    if (sec.offsetTop <= scrollMid) current = sec.id;
  });

  navLinksAll.forEach(a => {
    const href = a.getAttribute('href').replace('#', '');
    a.classList.toggle('active', href === current);
  });

  indexItems.forEach(li => {
    const a = li.querySelector('a');
    if (!a) return;
    const href = a.getAttribute('href').replace('#', '');
    li.classList.toggle('active', href === current);
  });
}

/* ── 4. SCROLL LISTENER (passive, batched) ── */
let ticking = false;
window.addEventListener('scroll', () => {
  if (!ticking) {
    requestAnimationFrame(() => {
      updateProgress();
      updateNav();
      updateActiveNav();
      ticking = false;
    });
    ticking = true;
  }
}, { passive: true });

// Run on load
updateProgress();
updateNav();
updateActiveNav();

/* ── 5. INTERSECTION OBSERVER — fade-in + timeline stagger ── */
const fadeObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        fadeObserver.unobserve(entry.target); // fire once
      }
    });
  },
  { threshold: 0.1, rootMargin: '0px 0px -50px 0px' }
);

document.querySelectorAll('.fade-in').forEach(el => fadeObserver.observe(el));

/* ── 6. TIMELINE ITEMS — stagger on scroll ── */
const tlObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        tlObserver.unobserve(entry.target);
      }
    });
  },
  { threshold: 0.15, rootMargin: '0px 0px -40px 0px' }
);

document.querySelectorAll('.tl-item').forEach((item, i) => {
  item.style.transitionDelay = `${i * 0.07}s`;
  tlObserver.observe(item);
});

/* ── 7. COUNT-UP ANIMATION for stat numbers ── */
function countUp(el, target, duration = 1400) {
  const isDecimal  = target.toString().includes('.');
  const suffix     = el.dataset.suffix || '';
  const prefix     = el.dataset.prefix || '';
  const start      = performance.now();

  function step(now) {
    const elapsed  = now - start;
    const progress = Math.min(elapsed / duration, 1);
    // Ease out cubic
    const eased    = 1 - Math.pow(1 - progress, 3);
    const current  = isDecimal
      ? (eased * target).toFixed(1)
      : Math.round(eased * target);

    el.textContent = prefix + current + suffix;

    if (progress < 1) requestAnimationFrame(step);
  }

  requestAnimationFrame(step);
}

// Observe stat numbers
const statObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach(entry => {
      if (!entry.isIntersecting) return;
      const el  = entry.target;
      const raw = el.dataset.count;
      if (!raw) return;
      countUp(el, parseFloat(raw));
      statObserver.unobserve(el);
    });
  },
  { threshold: 0.5 }
);

document.querySelectorAll('[data-count]').forEach(el => statObserver.observe(el));

/* ── 8. HOVER SOUND (subtle — optional, disabled by default) ── */
// Uncomment to enable subtle click feedback
// document.querySelectorAll('.bg-card, .milestone-card, .nilai-card').forEach(el => {
//   el.addEventListener('mouseenter', () => {
//     const ctx = new (window.AudioContext || window.webkitAudioContext)();
//     const osc = ctx.createOscillator();
//     const gain = ctx.createGain();
//     osc.connect(gain); gain.connect(ctx.destination);
//     osc.frequency.value = 800; gain.gain.value = 0.02;
//     osc.start(); gain.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + 0.1);
//     osc.stop(ctx.currentTime + 0.1);
//   });
// });

/* ── 9. CURSOR TRAIL on hero (subtle yellow dot) ── */
const hero = document.querySelector('.hero');
if (hero) {
  const dot = document.createElement('div');
  dot.style.cssText = `
    position: fixed; pointer-events: none; z-index: 9999;
    width: 6px; height: 6px; border-radius: 50%;
    background: oklch(68.1% 0.162 75.834 / 0.6);
    transform: translate(-50%, -50%);
    transition: opacity 0.3s ease, transform 0.15s ease;
    opacity: 0;
  `;
  document.body.appendChild(dot);

  let mouseX = 0, mouseY = 0;
  let dotX = 0, dotY = 0;
  let isOnHero = false;

  hero.addEventListener('mouseenter', () => {
    isOnHero = true;
    dot.style.opacity = '1';
  });
  hero.addEventListener('mouseleave', () => {
    isOnHero = false;
    dot.style.opacity = '0';
  });

  document.addEventListener('mousemove', e => {
    mouseX = e.clientX;
    mouseY = e.clientY;
  });

  function animateDot() {
    dotX += (mouseX - dotX) * 0.18;
    dotY += (mouseY - dotY) * 0.18;
    dot.style.left = dotX + 'px';
    dot.style.top  = dotY + 'px';
    requestAnimationFrame(animateDot);
  }
  animateDot();
}

/* ── 10. SECTION ENTRANCE — add class when section enters viewport ── */
const sectionObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach(entry => {
      entry.target.classList.toggle('in-view', entry.isIntersecting);
    });
  },
  { threshold: 0.05 }
);

sections.forEach(sec => sectionObserver.observe(sec));

/* ── 11. AMANDEMEN ITEMS — stagger on scroll ── */
const amandemenObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        amandemenObserver.unobserve(entry.target);
      }
    });
  },
  { threshold: 0.1, rootMargin: '0px 0px -30px 0px' }
);

document.querySelectorAll('.amandemen-item, .prinsip-item, .otonomi-item').forEach((el, i) => {
  el.style.opacity = '0';
  el.style.transform = 'translateX(-16px)';
  el.style.transition = `opacity 0.5s ease ${i * 0.08}s, transform 0.5s ease ${i * 0.08}s`;
  amandemenObserver.observe(el);
});

// Trigger visible state
const amandemenVisibleObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.style.opacity = '1';
        entry.target.style.transform = 'translateX(0)';
        amandemenVisibleObserver.unobserve(entry.target);
      }
    });
  },
  { threshold: 0.1, rootMargin: '0px 0px -30px 0px' }
);

document.querySelectorAll('.amandemen-item, .prinsip-item, .otonomi-item').forEach(el => {
  amandemenVisibleObserver.observe(el);
});



