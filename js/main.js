// ── SCROLL REVEAL ──
const reveals = document.querySelectorAll('.reveal');
const observer = new IntersectionObserver((entries) => {
  entries.forEach(e => {
    if (e.isIntersecting) {
      e.target.classList.add('visible');
      observer.unobserve(e.target);
    }
  });
}, { threshold: 0.12 });
reveals.forEach(el => observer.observe(el));

// ── CAROUSEL ──
let current = 0;
const track = document.getElementById('testiTrack');
const cards = track.querySelectorAll('.testi-card');
const visible = 3;
const max = cards.length - visible;

function moveCarousel(dir) {
  current = Math.max(0, Math.min(current + dir, max));
  const cardW = cards[0].offsetWidth + 20;
  track.style.transform = `translateX(-${current * cardW}px)`;
}

// Auto-advance
setInterval(() => {
  current = current >= max ? 0 : current + 1;
  const cardW = cards[0].offsetWidth + 20;
  track.style.transform = `translateX(-${current * cardW}px)`;
}, 4500);
