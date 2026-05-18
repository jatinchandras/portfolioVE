/* ============================================
   JATIN CHANDRA PORTFOLIO — SCRIPTS
   ============================================ */

// ============================================
// INTRO LOADER — NETFLIX STYLE
// ============================================
(function () {
  const intro = document.getElementById('intro');
  document.body.classList.add('intro-active');
  // All animation runs via pure CSS keyframes — no class toggling
  setTimeout(() => {
    intro.remove();
    document.body.classList.remove('intro-active');
  }, 3200);
})();

// CURSOR
const cursor = document.getElementById('cursor');
const follower = document.getElementById('cursor-follower');
let mouseX = 0, mouseY = 0;
let followerX = 0, followerY = 0;

document.addEventListener('mousemove', (e) => {
  mouseX = e.clientX;
  mouseY = e.clientY;
  cursor.style.left = mouseX + 'px';
  cursor.style.top = mouseY + 'px';
});

function animateFollower() {
  followerX += (mouseX - followerX) * 0.12;
  followerY += (mouseY - followerY) * 0.12;
  follower.style.left = followerX + 'px';
  follower.style.top = followerY + 'px';
  requestAnimationFrame(animateFollower);
}
animateFollower();

document.querySelectorAll('a, button, .portfolio-card, .recognition-card').forEach(el => {
  el.addEventListener('mouseenter', () => follower.classList.add('expanded'));
  el.addEventListener('mouseleave', () => follower.classList.remove('expanded'));
});

// NAV SCROLL
const nav = document.getElementById('nav');
window.addEventListener('scroll', () => {
  nav.classList.toggle('scrolled', window.scrollY > 60);
});

// HAMBURGER
const hamburger = document.getElementById('hamburger');
const mobileMenu = document.getElementById('mobile-menu');
hamburger.addEventListener('click', () => {
  mobileMenu.classList.toggle('open');
});
document.querySelectorAll('.mobile-link').forEach(link => {
  link.addEventListener('click', () => mobileMenu.classList.remove('open'));
});

// REVEAL ON SCROLL
const reveals = document.querySelectorAll('.reveal');
const revealObserver = new IntersectionObserver((entries) => {
  entries.forEach((entry, i) => {
    if (entry.isIntersecting) {
      const delay = entry.target.dataset.delay || 0;
      setTimeout(() => {
        entry.target.classList.add('visible');
      }, delay);
      revealObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.1, rootMargin: '0px 0px -40px 0px' });

reveals.forEach((el, i) => {
  const siblings = Array.from(el.parentElement.children).filter(c => c.classList.contains('reveal'));
  const idx = siblings.indexOf(el);
  el.dataset.delay = idx * 80;
  revealObserver.observe(el);
});

// SKILL BAR ANIMATION
const skillObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.querySelectorAll('.skill-fill').forEach((bar, i) => {
        setTimeout(() => bar.classList.add('animated'), i * 100);
      });
      skillObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.3 });

document.querySelectorAll('.skill-group').forEach(group => skillObserver.observe(group));

// LIGHTBOX
const lightbox = document.getElementById('lightbox');
const lightboxVideo = document.getElementById('lightbox-video');
const lightboxClose = document.getElementById('lightbox-close');
const lightboxBackdrop = document.getElementById('lightbox-backdrop');

function openLightbox(embedUrl) {
  lightboxVideo.innerHTML = `<iframe src="${embedUrl}?autoplay=1&rel=0" allow="autoplay; fullscreen" allowfullscreen></iframe>`;
  lightbox.classList.add('open');
  document.body.style.overflow = 'hidden';
}
function closeLightbox() {
  lightbox.classList.remove('open');
  lightboxVideo.innerHTML = '';
  document.body.style.overflow = '';
}
lightboxClose.addEventListener('click', closeLightbox);
lightboxBackdrop.addEventListener('click', closeLightbox);
document.addEventListener('keydown', e => { if (e.key === 'Escape') closeLightbox(); });

// PORTFOLIO FILTER
const filterBtns = document.querySelectorAll('.filter-btn');

function getCards() { return document.querySelectorAll('.portfolio-card'); }

function applyFilter(filter) {
  getCards().forEach(card => {
    const match = filter === 'all' || card.dataset.category === filter;
    card.classList.toggle('hidden', !match);
  });
}

filterBtns.forEach(btn => {
  btn.addEventListener('click', () => {
    filterBtns.forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
    applyFilter(btn.dataset.filter);
  });
});

// WIRE UP VIDEO CARDS (called after DOM updates)
function wireVideoCards() {
  getCards().forEach(card => {
    card.addEventListener('click', () => {
      const vid = card.dataset.videoId;
      const src = card.dataset.videoSrc;
      const type = card.dataset.videoType || 'youtube';
      if (vid && type === 'youtube') openLightbox(`https://www.youtube.com/embed/${vid}`);
      else if (vid && type === 'vimeo') openLightbox(`https://player.vimeo.com/video/${vid}`);
      else if (vid && type === 'drive') openLightbox(`https://drive.google.com/file/d/${vid}/preview`);
      else if (type === 'instagram' && src) window.open(src, '_blank');
      else if (src) openLightbox(src);
    });
  });
}
wireVideoCards();

// SMOOTH ANCHOR SCROLL (with nav offset)
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', (e) => {
    const target = document.querySelector(anchor.getAttribute('href'));
    if (!target) return;
    e.preventDefault();
    const offset = nav.offsetHeight + 16;
    const top = target.getBoundingClientRect().top + window.scrollY - offset;
    window.scrollTo({ top, behavior: 'smooth' });
  });
});

// ANIMATED NUMBER COUNTER
function animateCount(el, target, suffix = '') {
  let start = 0;
  const isSymbol = isNaN(parseFloat(target));
  if (isSymbol) return;
  const num = parseFloat(target);
  const duration = 1600;
  const step = duration / 60;
  const increment = num / (duration / step);
  const timer = setInterval(() => {
    start += increment;
    if (start >= num) { start = num; clearInterval(timer); }
    el.textContent = (Number.isInteger(num) ? Math.floor(start) : start.toFixed(0)) + suffix;
  }, step);
}

const statsObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.querySelectorAll('.stat-number').forEach(stat => {
        const raw = stat.textContent.trim();
        if (raw === '∞') return;
        const match = raw.match(/^(\d+)(.*)$/);
        if (match) animateCount(stat, match[1], match[2]);
      });
      statsObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.5 });

const heroStats = document.querySelector('.hero-stats');
if (heroStats) statsObserver.observe(heroStats);

// FADE IN UP for filtered cards
const style = document.createElement('style');
style.textContent = `
@keyframes fadeInUp {
  from { opacity: 0; transform: translateY(20px); }
  to { opacity: 1; transform: translateY(0); }
}
`;
document.head.appendChild(style);
