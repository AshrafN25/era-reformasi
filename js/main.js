/**
 * main.js — Era Reformasi Indonesia
 */

/* ─── NAV: transparent on hero, solid on scroll ─── */
const nav = document.querySelector('nav');

function updateNav() {
  if (window.scrollY > 60) {
    nav.classList.add('scrolled');
  } else {
    nav.classList.remove('scrolled');
  }
}

window.addEventListener('scroll', updateNav, { passive: true });
updateNav(); // run on load

/* ─── SCROLL-TRIGGERED FADE-IN ─── */
const observer = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
      }
    });
  },
  { threshold: 0.12, rootMargin: '0px 0px -40px 0px' }
);

document.querySelectorAll('.fade-in, .tl-item').forEach((el) => observer.observe(el));

/* ─── TIMELINE: stagger delay ─── */
document.querySelectorAll('.tl-item').forEach((item, i) => {
  item.style.transitionDelay = `${i * 0.06}s`;
});
