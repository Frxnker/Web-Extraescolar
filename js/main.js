// ── INITIALIZE ICONS ──
lucide.createIcons();

// ── THEME TOGGLE ──
const themeToggle = document.getElementById('theme-toggle');
const body = document.body;
const darkIcon = themeToggle.querySelector('.dark-icon');
const lightIcon = themeToggle.querySelector('.light-icon');

function updateThemeIcons() {
  const isDark = body.classList.contains('dark-mode');
  if (darkIcon && lightIcon) {
    darkIcon.style.display = isDark ? 'none' : 'block';
    lightIcon.style.display = isDark ? 'block' : 'none';
  }
}

// Set initial
const savedTheme = localStorage.getItem('theme');
if (savedTheme === 'light') {
  body.classList.remove('dark-mode');
} else {
  body.classList.add('dark-mode'); // Default is dark based on original
}
updateThemeIcons();

themeToggle.addEventListener('click', () => {
  body.classList.toggle('dark-mode');
  updateThemeIcons();
  localStorage.setItem('theme', body.classList.contains('dark-mode') ? 'dark' : 'light');
});


// ── MOBILE MENU ──
const menuToggle = document.getElementById('menu-toggle');
const mobileNav = document.getElementById('mobile-nav');
const mobileOverlay = document.getElementById('mobile-overlay');

function toggleMenu() {
  mobileNav.classList.toggle('active');
  mobileOverlay.classList.toggle('active');
}

menuToggle.addEventListener('click', toggleMenu);
mobileOverlay.addEventListener('click', toggleMenu);
mobileNav.querySelectorAll('a').forEach(link => {
  link.addEventListener('click', toggleMenu);
});


// ── SCROLL REVEAL ──
const reveals = document.querySelectorAll('.reveal');
const observer = new IntersectionObserver((entries) => {
  entries.forEach(e => {
    if (e.isIntersecting) {
      e.target.classList.add('visible');
      // Uncomment the line below if you want the animation to happen only once
      // observer.unobserve(e.target);
    }
  });
}, { threshold: 0.12 });
reveals.forEach(el => observer.observe(el));


// ── CAROUSEL ──
let current = 0;
const track = document.getElementById('testiTrack');
if (track) {
  const cards = track.querySelectorAll('.testi-card');
  // Auto-advance logic
  setInterval(() => {
    // Assuming cards are visible
    // Simple implementation for desktop 3 visible cards, mobile 1 or 2
    let visibleCards = window.innerWidth <= 640 ? 1 : (window.innerWidth <= 968 ? 2 : 3);
    const max = cards.length - visibleCards;

    if (max > 0) {
      current = current >= max ? 0 : current + 1;
      const cardW = cards[0].offsetWidth + 20; // 20 is the gap
      track.style.transform = `translateX(-${current * cardW}px)`;
    }
  }, 4000);
}


// ── AUTH MODAL ──
const authModal = document.getElementById('auth-modal');
const btnClose = document.getElementById('modal-close');
const authTrigger = document.getElementById('auth-trigger');
const authTriggerMobile = document.getElementById('auth-trigger-mobile');

function openModal() { authModal.classList.add('active'); }
function closeModal() { authModal.classList.remove('active'); }

if (authTrigger) authTrigger.addEventListener('click', openModal);
if (authTriggerMobile) {
  authTriggerMobile.addEventListener('click', () => {
    toggleMenu(); // Close mobile menu first
    setTimeout(openModal, 300);
  });
}
if (btnClose) btnClose.addEventListener('click', closeModal);
if (authModal) {
  authModal.addEventListener('click', (e) => {
    if (e.target === authModal) closeModal();
  });

  // Auth Tab Switching Logic (Login / Register)
  const tabLog = document.getElementById('tab-login');
  const tabReg = document.getElementById('tab-register');
  const authMode = document.getElementById('auth-mode');
  const regFields = document.getElementById('register-fields');
  const submitBtn = document.getElementById('auth-submit-btn');

  function setAuthMode(mode) {
    authMode.value = mode;
    if (mode === 'login') {
      tabLog.style.color = 'var(--primary)';
      tabLog.style.borderBottom = '2px solid var(--primary)';
      tabReg.style.color = 'var(--text-light)';
      tabReg.style.borderBottom = '2px solid transparent';
      regFields.style.display = 'none';
      submitBtn.textContent = 'Entrar';
    } else {
      tabReg.style.color = 'var(--primary)';
      tabReg.style.borderBottom = '2px solid var(--primary)';
      tabLog.style.color = 'var(--text-light)';
      tabLog.style.borderBottom = '2px solid transparent';
      regFields.style.display = 'block';
      submitBtn.textContent = 'Crear Cuenta';
    }
  }

  if (tabLog) tabLog.addEventListener('click', () => setAuthMode('login'));
  if (tabReg) tabReg.addEventListener('click', () => setAuthMode('register'));

  // Form Submission Logic
  const authForm = document.getElementById('auth-form');
  if (authForm) {
    authForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const originalText = submitBtn.textContent;
      
      submitBtn.disabled = true;
      submitBtn.textContent = 'Procesando...';

      setTimeout(() => {
        const action = authMode.value === 'login' ? 'iniciado sesión' : 'creado tu cuenta';
        alert(`¡Éxito! Has ${action} correctamente.`);
        closeModal();
        submitBtn.disabled = false;
        submitBtn.textContent = originalText;
      }, 1500);
    });
  }
}


// ── COOKIE BANNER ──
const cookieBanner = document.getElementById('cookie-banner');
const acceptCookies = document.getElementById('accept-cookies');

if (!localStorage.getItem('cookiesAccepted')) {
  // Small delay so it slides up smoothly after page load
  setTimeout(() => cookieBanner.classList.add('active'), 1000);
}

if (acceptCookies) {
  acceptCookies.addEventListener('click', () => {
    localStorage.setItem('cookiesAccepted', 'true');
    cookieBanner.classList.remove('active');
  });
}


// ── GEOLOCATION ──
function initGeolocation() {
  const mapIframe = document.getElementById('google-map');
  
  if (navigator.geolocation && mapIframe) {
    navigator.geolocation.getCurrentPosition(
      (position) => {
        const lat = position.coords.latitude;
        const lng = position.coords.longitude;
        
        // Update iframe with a dynamic view centered on coordinates
        // Using the maps.google.com format which is more flexible for direct coordinates without API key
        mapIframe.src = `https://maps.google.com/maps?q=${lat},${lng}&z=14&output=embed&t=m`;
        
        console.log(`Ubicación detectada: ${lat}, ${lng}`);
      },
      (error) => {
        console.warn("Error al detectar la ubicación:", error.message);
        // We keep the default Málaga view if user denies permission or there's an error
      }
    );
  }
}

// Start detection
initGeolocation();
