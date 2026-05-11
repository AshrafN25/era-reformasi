/**
 * home.js — Fullscreen Slideshow Hero
 * Era Reformasi Indonesia 1998
 */

const slides = [
  {
    number: '01',
    eyebrow: 'Orde Baru · 1966–1998',
    title: 'Tiga Dekade\ndi Bawah Satu Tangan',
    titleEm: null,
    desc: 'Soeharto memimpin Indonesia selama 32 tahun dengan kekuasaan sentralistik. Kebebasan pers dibungkam, militer masuk ranah sipil, dan KKN mengakar di setiap lini pemerintahan.',
    chapter: 'Latar Belakang',
    chSub: 'Bab 1',
    href: '#latar'
  },
  {
    number: '02',
    eyebrow: 'Tragedi · 12 Mei 1998',
    title: 'Empat Peluru\nuntuk Demokrasi',
    titleEm: 'Tragedi Trisakti',
    desc: 'Elang Mulia Lesmana, Heri Hertanto, Hafidin Royan, dan Hendriawan Sie gugur ditembak aparat. Darah mereka menjadi pemantik revolusi yang tak bisa lagi dibendung.',
    chapter: 'Kronologi',
    chSub: 'Bab 2',
    href: '#timeline'
  },
  {
    number: '03',
    eyebrow: 'Reformasi · 21 Mei 1998',
    title: 'Soeharto\nMengundurkan Diri',
    titleEm: '09:00 WIB',
    desc: 'Di Istana Merdeka, setelah 32 tahun berkuasa, Soeharto membacakan pernyataan pengunduran dirinya. Ratusan ribu mahasiswa di Gedung DPR menyaksikan sejarah berubah.',
    chapter: 'Tokoh Kunci',
    chSub: 'Bab 3',
    href: '#tokoh'
  },
  {
    number: '04',
    eyebrow: 'Pemilu Bebas · 7 Juni 1999',
    title: 'Empat Puluh Delapan\nPartai, Satu Harapan',
    titleEm: null,
    desc: 'Pemilu 1999 diikuti 48 partai — paling beragam dalam sejarah Indonesia modern. Untuk pertama kalinya rakyat benar-benar bebas memilih tanpa tekanan dan intimidasi.',
    chapter: 'Hasil Perubahan',
    chSub: 'Bab 4',
    href: '#hasil'
  },
  {
    number: '05',
    eyebrow: 'Demokrasi · 2004–Kini',
    title: 'Warisan yang\nBelum Selesai',
    titleEm: null,
    desc: 'Reformasi membuka kebebasan, otonomi daerah, dan pemilu langsung. Namun korupsi bertransformasi, demokrasi diuji, dan perjuangan generasi baru baru saja dimulai.',
    chapter: 'Refleksi',
    chSub: 'Bab 7',
    href: '#kesimpulan'
  }
];

const AUTOPLAY_DURATION = 6000; // ms per slide

class HeroSlider {
  constructor() {
    this.current = 0;
    this.total = slides.length;
    this.timer = null;
    this.progressTimer = null;
    this.progressStart = null;

    this.hero = document.querySelector('.home-hero');
    this.bgs = document.querySelectorAll('.slide-bg');
    this.thumbs = document.querySelectorAll('.thumb-item');
    this.chapterItems = document.querySelectorAll('.chapter-list-item');
    this.progressBar = document.querySelector('.slide-progress-bar');

    this.elNumber = document.querySelector('.slide-number');
    this.elEyebrow = document.querySelector('.slide-eyebrow');
    this.elTitle = document.querySelector('.slide-title');
    this.elDesc = document.querySelector('.slide-desc');
    this.elLearn = document.querySelector('.slide-learn');
    this.elCounterCurrent = document.querySelector('.counter-current');

    this.init();
  }

  init() {
    // Thumbnail clicks
    this.thumbs.forEach(thumb => {
      thumb.addEventListener('click', () => {
        this.goTo(parseInt(thumb.dataset.target));
      });
    });

    // Chapter list clicks
    this.chapterItems.forEach(item => {
      item.addEventListener('click', () => {
        this.goTo(parseInt(item.dataset.target));
      });
    });

    // Prev / Next
    document.querySelector('.btn-prev').addEventListener('click', () => this.prev());
    document.querySelector('.btn-next').addEventListener('click', () => this.next());

    // Keyboard
    document.addEventListener('keydown', e => {
      if (e.key === 'ArrowLeft') this.prev();
      if (e.key === 'ArrowRight') this.next();
    });

    // Start
    this.goTo(0);
  }

  goTo(index) {
    const prev = this.current;
    this.current = (index + this.total) % this.total;

    // Update backgrounds
    this.bgs.forEach((bg, i) => {
      bg.classList.toggle('active', i === this.current);
    });

    // Update thumbnails
    this.thumbs.forEach((t, i) => {
      t.classList.toggle('active', i === this.current);
    });

    // Update chapter list
    this.chapterItems.forEach((c, i) => {
      c.classList.toggle('active', i === this.current);
    });

    // Update text content with animation
    this.updateContent();

    // Update counter
    this.elCounterCurrent.textContent = String(this.current + 1).padStart(2, '0');

    // Update learn more href
    this.elLearn.href = slides[this.current].href;

    // Restart autoplay
    this.startAutoplay();
  }

  updateContent() {
    const s = slides[this.current];

    // Remove ready class to re-trigger animations
    this.hero.classList.remove('slide-ready');

    this.elNumber.textContent = s.number;
    this.elEyebrow.textContent = s.eyebrow;

    // Build title HTML
    if (s.titleEm) {
      this.elTitle.innerHTML = s.title.replace('\n', '<br>') + '<em>' + s.titleEm + '</em>';
    } else {
      this.elTitle.innerHTML = s.title.replace('\n', '<br>');
    }

    this.elDesc.textContent = s.desc;

    // Re-trigger animation on next frame
    requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        this.hero.classList.add('slide-ready');
      });
    });
  }

  next() { this.goTo(this.current + 1); }
  prev() { this.goTo(this.current - 1); }

  startAutoplay() {
    clearInterval(this.timer);
    clearAnimationFrame(this.progressTimer);
    this.progressBar.style.width = '0%';
    this.progressStart = performance.now();

    const tick = (now) => {
      const elapsed = now - this.progressStart;
      const pct = Math.min((elapsed / AUTOPLAY_DURATION) * 100, 100);
      this.progressBar.style.width = pct + '%';

      if (elapsed >= AUTOPLAY_DURATION) {
        this.next();
      } else {
        this.progressTimer = requestAnimationFrame(tick);
      }
    };

    this.progressTimer = requestAnimationFrame(tick);
  }
}

// Polyfill clearAnimationFrame
function clearAnimationFrame(id) {
  if (id) cancelAnimationFrame(id);
}

// Init on DOM ready
document.addEventListener('DOMContentLoaded', () => {
  new HeroSlider();
});
