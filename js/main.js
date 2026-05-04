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
  if (mobileNav && mobileOverlay) {
    mobileNav.classList.toggle('active');
    mobileOverlay.classList.toggle('active');
  }
}

if (menuToggle) menuToggle.addEventListener('click', toggleMenu);
if (mobileOverlay) mobileOverlay.addEventListener('click', toggleMenu);
if (mobileNav) {
  mobileNav.querySelectorAll('a').forEach(link => {
    link.addEventListener('click', toggleMenu);
  });
}


// ── SCROLL REVEAL ──
const reveals = document.querySelectorAll('.reveal');
const observer = new IntersectionObserver((entries) => {
  entries.forEach(e => {
    if (e.isIntersecting) {
      e.target.classList.add('visible');
    }
  });
}, { threshold: 0.12 });
reveals.forEach(el => observer.observe(el));


// ── CAROUSEL ──
let current = 0;
const track = document.getElementById('testiTrack');
if (track) {
  const cards = track.querySelectorAll('.testi-card');
  setInterval(() => {
    let visibleCards = window.innerWidth <= 640 ? 1 : (window.innerWidth <= 968 ? 2 : 3);
    const max = cards.length - visibleCards;
    if (max > 0) {
      current = current >= max ? 0 : current + 1;
      const cardW = cards[0].offsetWidth + 20;
      track.style.transform = `translateX(-${current * cardW}px)`;
    }
  }, 4000);
}


// ── AUTH MODAL ──
const authModal = document.getElementById('auth-modal');
const btnClose = document.getElementById('modal-close');
const authTrigger = document.getElementById('auth-trigger');
const authTriggerMobile = document.getElementById('auth-trigger-mobile');

function openModal() { if (authModal) authModal.classList.add('active'); }
function closeModal() { if (authModal) authModal.classList.remove('active'); }

if (authTrigger) authTrigger.addEventListener('click', openModal);
if (authTriggerMobile) {
  authTriggerMobile.addEventListener('click', () => {
    toggleMenu();
    setTimeout(openModal, 300);
  });
}
if (btnClose) btnClose.addEventListener('click', closeModal);
if (authModal) {
  authModal.addEventListener('click', (e) => {
    if (e.target === authModal) closeModal();
  });

  const tabLog = document.getElementById('tab-login');
  const tabReg = document.getElementById('tab-register');
  const authMode = document.getElementById('auth-mode');
  const regFields = document.getElementById('register-fields');
  const submitBtn = document.getElementById('auth-submit-btn');

  function setAuthMode(mode) {
    if (!authMode || !tabLog || !tabReg || !regFields || !submitBtn) return;
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
if (cookieBanner && !localStorage.getItem('cookiesAccepted')) {
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
        mapIframe.src = `https://maps.google.com/maps?q=${lat},${lng}&z=14&output=embed&t=m`;
      },
      (error) => { console.warn("Error al detectar la ubicación:", error.message); }
    );
  }
}
initGeolocation();


// ── MARKETPLACE: DATA & RENDERING ──
// servicesData is loaded from data.js
let services = window.servicesData || [];
const activitiesContainer = document.getElementById('activities-container');

function renderServices(filterCat = 'all', query = '') {
  if (!activitiesContainer) return;
  activitiesContainer.innerHTML = '';
  const filtered = services.filter(s => {
    const matchesCat = filterCat === 'all' || s.category === filterCat;
    const matchesQuery = !query || s.title.toLowerCase().includes(query.toLowerCase()) || (s.description && s.description.toLowerCase().includes(query.toLowerCase()));
    return matchesCat && matchesQuery;
  });

  if (filtered.length === 0) {
    const isSearch = query || filterCat !== 'all';
    activitiesContainer.innerHTML = `
      <div style="grid-column: 1 / -1; text-align: center; padding: 4rem; color: var(--text-light);">
        <i data-lucide="${isSearch ? 'search-x' : 'inbox'}" style="width: 48px; height: 48px; margin-bottom: 1rem; opacity: 0.5;"></i>
        <p>${isSearch ? 'No se han encontrado actividades que coincidan con tu búsqueda.' : 'Todavía no hay actividades publicadas en esta categoría. ¡Sé el primero en publicar una!'}</p>
        ${!isSearch ? '<button class="btn-primary" onclick="openServiceModal()" style="margin-top: 1.5rem;">Publicar Servicio</button>' : ''}
      </div>
    `;
  } else {
    filtered.forEach((s, index) => {
      const card = document.createElement('div');
      card.className = `act-card reveal visible`;
      card.style.transitionDelay = `${index * 0.1}s`;
      card.innerHTML = `
        <img src="${s.img}" alt="${s.title}" class="act-img">
        <div class="act-body">
          <div class="act-cat">${s.category}</div>
          <h3 class="act-title">${s.title}</h3>
          <div class="act-age"><i data-lucide="users"></i> ${s.age}</div>
          ${s.email || s.phone ? `
            <div class="act-contact" style="margin-top: 1rem; padding-top: 1rem; border-top: 1px solid var(--border); font-size: 0.85rem; color: var(--text-light); display: flex; flex-direction: column; gap: 5px;">
              ${s.email ? `<div style="display:flex; align-items:center; gap:8px;"><i data-lucide="mail" style="width:14px; height:14px;"></i> ${s.email}</div>` : ''}
              ${s.phone ? `<div style="display:flex; align-items:center; gap:8px;"><i data-lucide="phone" style="width:14px; height:14px;"></i> ${s.phone}</div>` : ''}
            </div>
          ` : ''}
        </div>`;
      activitiesContainer.appendChild(card);
    });
  }
  lucide.createIcons();
}

function initMarketplace() {
  const urlParams = new URLSearchParams(window.location.search);
  const catParam = urlParams.get('cat');
  if (activitiesContainer) {
    if (catParam) {
      const categoryFilter = document.getElementById('filter-category');
      if (categoryFilter) categoryFilter.value = catParam;
      renderServices(catParam);
    } else {
      renderServices();
    }
  }
}
initMarketplace();


// ── MARKETPLACE: ADD SERVICE MODAL ──
const serviceModal = document.getElementById('service-modal');
const serviceClose = document.getElementById('service-close');
const addServiceTrigger = document.getElementById('add-service-trigger');
const addServiceTriggerHero = document.getElementById('add-service-trigger-hero');

function openServiceModal() { if (serviceModal) serviceModal.classList.add('active'); }
function closeServiceModal() { if (serviceModal) serviceModal.classList.remove('active'); }

if (addServiceTrigger) addServiceTrigger.addEventListener('click', openServiceModal);
if (addServiceTriggerHero) addServiceTriggerHero.addEventListener('click', openServiceModal);
if (serviceClose) serviceClose.addEventListener('click', closeServiceModal);
if (serviceModal) {
  serviceModal.addEventListener('click', (e) => { if (e.target === serviceModal) closeServiceModal(); });
}

const serviceForm = document.getElementById('service-form');
const srvCatSelect = document.getElementById('srv-cat');
const suggestionContainer = document.getElementById('suggestion-container');

if (srvCatSelect && suggestionContainer) {
  srvCatSelect.addEventListener('change', () => {
    suggestionContainer.style.display = srvCatSelect.value === 'otro' ? 'block' : 'none';
  });
}

if (serviceForm) {
  serviceForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const name = document.getElementById('srv-name').value;
    const cat = document.getElementById('srv-cat').value;
    const email = document.getElementById('srv-email').value;
    const phone = document.getElementById('srv-phone').value;
    const suggestion = document.getElementById('srv-suggestion') ? document.getElementById('srv-suggestion').value : '';
    const desc = document.getElementById('srv-desc').value;
    const price = document.getElementById('srv-price').value;
    const location = document.getElementById('srv-location').value;
    const imgFile = document.getElementById('srv-img').files[0];

    const publish = (imgUrl) => {
      const newService = {
        id: Date.now(),
        title: name,
        category: cat === 'otro' ? 'Otro' : cat,
        email: email,
        phone: phone,
        age: 'Consultar edad',
        img: imgUrl || 'https://images.unsplash.com/photo-1497633762265-9d179a990aa6?auto=format&fit=crop&q=80&w=600',
        description: desc + ` | Precio: ${price}€ | Ubicación: ${location}`
      };

      services.unshift(newService);
      if (window.servicesData) window.servicesData.unshift(newService);

      if (activitiesContainer) {
        renderServices('all', '');
        const activitiesSection = document.getElementById('actividades');
        if (activitiesSection) activitiesSection.scrollIntoView({ behavior: 'smooth' });
      } else {
        const pagePath = window.location.pathname.includes('pages/') ? 'actividades.html' : 'pages/actividades.html';
        window.location.href = pagePath;
      }
      
      let alertMsg = `¡Genial! Tu servicio "${name}" ha sido publicado correctamente.`;
      if (cat === 'otro' && suggestion) {
        alertMsg += `\n\nHemos recibido tu sugerencia para la categoría: "${suggestion}". ¡La revisaremos pronto!`;
      }
      alert(alertMsg);
      
      closeServiceModal();
      serviceForm.reset();
      if (suggestionContainer) suggestionContainer.style.display = 'none';
    };

    if (imgFile) {
      const reader = new FileReader();
      reader.onload = (e) => publish(e.target.result);
      reader.readAsDataURL(imgFile);
    } else {
      publish(null);
    }
  });
}


// ── MARKETPLACE: SEARCH & FILTER ──
const searchInput = document.getElementById('service-search');
const categoryFilter = document.getElementById('filter-category');
const btnSearch = document.getElementById('btn-search');
const quickChips = document.querySelectorAll('.cat-chip');

function performFilter() {
  const query = (searchInput ? searchInput.value : '');
  const cat = (categoryFilter ? categoryFilter.value : 'all');
  quickChips.forEach(chip => {
    if (chip.dataset.cat) chip.classList.toggle('active', chip.dataset.cat === cat);
  });
  if (activitiesContainer) {
    renderServices(cat, query);
    const activitiesSection = document.getElementById('actividades');
    if (activitiesSection && (query || cat !== 'all')) activitiesSection.scrollIntoView({ behavior: 'smooth' });
  } else {
    const pagePath = window.location.pathname.includes('pages/') ? 'actividades.html' : 'pages/actividades.html';
    window.location.href = `${pagePath}?cat=${cat}&q=${query}`;
  }
}

if (btnSearch) btnSearch.addEventListener('click', performFilter);
if (searchInput) {
  searchInput.addEventListener('keyup', (e) => { if (e.key === 'Enter') performFilter(); });
}
if (categoryFilter) categoryFilter.addEventListener('change', performFilter);

quickChips.forEach(chip => {
  if (chip.tagName !== 'A') {
    chip.addEventListener('click', () => {
      const cat = chip.dataset.cat;
      const newCat = chip.classList.contains('active') ? 'all' : cat;
      if (categoryFilter) categoryFilter.value = newCat;
      performFilter();
    });
  }
});
