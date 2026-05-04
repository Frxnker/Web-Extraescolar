// ── INITIALIZE ICONS ──
import { db, collection, addDoc, getDocs, query, orderBy, deleteDoc, doc, where, auth, signInWithEmailAndPassword, createUserWithEmailAndPassword, onAuthStateChanged, signOut } from './firebase-config.js';
lucide.createIcons();

let currentUser = null;

// ── CUSTOM NOTIFICATION SYSTEM ──
function showToast(message, type = 'info') {
  const container = document.getElementById('toast-container');
  if (!container) return;
  
  const toast = document.createElement('div');
  toast.className = `toast ${type}`;
  toast.innerHTML = `
    <i data-lucide="${type === 'success' ? 'check-circle' : (type === 'error' ? 'x-circle' : 'info')}"></i>
    <span>${message}</span>
  `;
  container.appendChild(toast);
  lucide.createIcons();
  
  setTimeout(() => toast.classList.add('active'), 10);
  setTimeout(() => {
    toast.classList.remove('active');
    setTimeout(() => toast.remove(), 400);
  }, 4000);
}

function showConfirm(title, message, callback) {
  const modal = document.getElementById('confirm-modal');
  const titleEl = document.getElementById('confirm-title');
  const msgEl = document.getElementById('confirm-msg');
  const btnOk = document.getElementById('confirm-ok');
  const btnCancel = document.getElementById('confirm-cancel');
  
  if (!modal) {
    if (confirm(message)) callback();
    return;
  }
  
  titleEl.textContent = title;
  msgEl.textContent = message;
  modal.classList.add('active');
  
  const handleOk = () => {
    modal.classList.remove('active');
    btnOk.removeEventListener('click', handleOk);
    btnCancel.removeEventListener('click', handleCancel);
    callback();
  };
  
  const handleCancel = () => {
    modal.classList.remove('active');
    btnOk.removeEventListener('click', handleOk);
    btnCancel.removeEventListener('click', handleCancel);
  };
  
  btnOk.addEventListener('click', handleOk);
  btnCancel.addEventListener('click', handleCancel);
}

// ── AUTH STATE MONITORING ──
onAuthStateChanged(auth, (user) => {
  currentUser = user;
  const userActions = document.getElementById('user-actions');
  const userActionsMobile = document.getElementById('user-actions-mobile');
  const commentFormContainer = document.getElementById('comment-form-container');

  if (userActions) {
    if (user) {
      const initial = user.email.charAt(0).toUpperCase();
      userActions.innerHTML = `
        <button id="add-service-trigger" class="btn-primary">Publicar Servicio</button>
        <div class="profile-container">
          <div class="profile-circle" id="profile-trigger">${initial}</div>
          <div class="profile-dropdown" id="profile-dropdown">
            <div class="dropdown-header">${user.email}</div>
            <button class="dropdown-item"><i data-lucide="user" style="width:16px;"></i> Mi Perfil</button>
            <button class="dropdown-item"><i data-lucide="settings" style="width:16px;"></i> Gestionar Servicios</button>
            <div style="border-top: 1px solid var(--border); margin: 5px 0;"></div>
            <button class="dropdown-item logout" id="btn-logout"><i data-lucide="log-out" style="width:16px;"></i> Cerrar Sesión</button>
          </div>
        </div>
      `;
      
      if (userActionsMobile) {
        userActionsMobile.innerHTML = `
          <button id="add-service-trigger-mobile" class="btn-primary" style="width:100%; margin-top: 1rem;">Publicar Servicio</button>
          <a href="${window.location.pathname.includes('pages/') ? 'perfil.html' : 'pages/perfil.html'}" class="btn-secondary" style="width:100%; margin-top: 0.5rem; text-align: center; display: block;">Mi Perfil</a>
        `;
        const addMobile = document.getElementById('add-service-trigger-mobile');
        if (addMobile) addMobile.addEventListener('click', () => { toggleMenu(); openServiceModal(); });
      }

      // Event Listeners for Dropdown
      const trigger = document.getElementById('profile-trigger');
      const dropdown = document.getElementById('profile-dropdown');
      const logoutBtn = document.getElementById('btn-logout');
      const addServiceBtn = document.getElementById('add-service-trigger');

      if (trigger && dropdown) {
        trigger.addEventListener('click', (e) => {
          e.stopPropagation();
          dropdown.classList.toggle('active');
        });
        document.addEventListener('click', () => dropdown.classList.remove('active'));
      }
      
      if (logoutBtn) logoutBtn.addEventListener('click', () => signOut(auth));
      if (addServiceBtn) addServiceBtn.addEventListener('click', openServiceModal);
      
      // Open Account Page
      userActions.querySelectorAll('.dropdown-item').forEach(btn => {
        btn.addEventListener('click', () => {
          if (btn.classList.contains('logout')) return;
          const isPages = window.location.pathname.includes('pages/');
          const path = isPages ? 'perfil.html' : 'pages/perfil.html';
          window.location.href = path;
        });
      });

      // Formulario de comentarios para usuarios logueados
      if (commentFormContainer) {
        commentFormContainer.innerHTML = `
          <div style="background:var(--surface); padding:2rem; border-radius:20px; border:1px solid var(--border);">
            <h4 style="margin-bottom: 1rem;">Deja tu comentario</h4>
            <form id="comment-form">
              <div style="margin-bottom: 15px; display: flex; align-items: center; gap: 10px;">
                <label style="font-size: 0.9rem; color: var(--text-light);">Tu valoración:</label>
                <select id="comment-rating">
                  <option value="5">★★★★★ (5)</option>
                  <option value="4">★★★★☆ (4)</option>
                  <option value="3">★★★☆☆ (3)</option>
                  <option value="2">★★☆☆☆ (2)</option>
                  <option value="1">★☆☆☆☆ (1)</option>
                </select>
              </div>
              <textarea id="comment-text" placeholder="¿Qué te parece la plataforma?" required style="min-height:80px;"></textarea>
              <button type="submit" class="btn-primary">Publicar</button>
            </form>
          </div>
        `;
        initCommentForm();
      }
      
      // If we are on the profile page, populate it
      if (document.getElementById('my-services-grid')) {
        populateProfilePage(user);
      }
      
    } else {
      userActions.innerHTML = `<button id="auth-trigger" class="btn-primary">Iniciar Sesión</button>`;
      const authTrigger = document.getElementById('auth-trigger');
      if (authTrigger) authTrigger.addEventListener('click', openModal);

      if (userActionsMobile) {
        userActionsMobile.innerHTML = `<button id="auth-trigger-mobile" class="btn-primary" style="width:100%; margin-top: 1rem;">Acceder</button>`;
        const authTriggerMobile = document.getElementById('auth-trigger-mobile');
        if (authTriggerMobile) {
          authTriggerMobile.addEventListener('click', () => {
            toggleMenu();
            setTimeout(openModal, 300);
          });
        }
      }

      // Aviso para comentarios si no hay sesión
      if (commentFormContainer) {
        commentFormContainer.innerHTML = `
          <div style="background:rgba(99, 102, 241, 0.05); padding:2rem; border-radius:20px; border:1px dashed var(--primary); text-align:center;">
            <p style="color:var(--text-light); margin-bottom:1rem;">Inicia sesión para compartir tu opinión con la comunidad.</p>
            <button class="btn-secondary" onclick="openModal()">Iniciar Sesión ahora</button>
          </div>
        `;
      }

      // If on profile page and not logged in, redirect home
      if (window.location.pathname.includes('perfil.html')) {
        const path = window.location.pathname.includes('pages/') ? '../index.html' : 'index.html';
        window.location.href = path;
      }
    }
    lucide.createIcons();
    loadComments();
    updateStats();
    loadUserFavorites();
  }
});

async function updateStats() {
  const statActivities = document.getElementById('stat-activities');
  const statUsers = document.getElementById('stat-users');
  const statRating = document.getElementById('stat-rating');

  if (!statActivities) return; // Solo en Index

  try {
    // 1. Actividades
    const actSnap = await getDocs(collection(db, "actividades"));
    statActivities.textContent = actSnap.size;

    // 2. Usuarios
    const userSnap = await getDocs(collection(db, "usuarios"));
    statUsers.textContent = userSnap.size + 150; // Sumamos 150 como base de confianza

    // 3. Valoración
    const comSnap = await getDocs(collection(db, "comentarios"));
    let total = 0, count = 0;
    comSnap.forEach(d => {
      if (d.data().rating) { total += parseInt(d.data().rating); count++; }
    });
    statRating.textContent = count > 0 ? (total / count).toFixed(1) : "5.0";
  } catch (e) { console.error("Error stats:", e); }
}

// ── COMMUNITY COMMENTS LOGIC ──
async function loadComments() {
  const commentsList = document.getElementById('comments-list');
  if (!commentsList) return;

  try {
    const q = query(collection(db, "comentarios"), orderBy("timestamp", "desc"));
    const querySnapshot = await getDocs(q);
    commentsList.innerHTML = '';

    if (querySnapshot.empty) {
      commentsList.innerHTML = '<p style="text-align:center; color:var(--text-light); padding:2rem;">Aún no hay comentarios.</p>';
      return;
    }

    querySnapshot.forEach((docSnapshot) => {
      const data = docSnapshot.data();
      const commentId = docSnapshot.id;
      const date = data.timestamp ? new Date(data.timestamp.seconds * 1000).toLocaleDateString() : 'Reciente';
      const initial = data.authorEmail.charAt(0).toUpperCase();
      const stars = "★".repeat(data.rating || 5) + "☆".repeat(5 - (data.rating || 5));
      const isOwner = currentUser && currentUser.uid === data.authorUid;
      
      const commentDiv = document.createElement('div');
      commentDiv.style.cssText = 'background:var(--surface); padding:1.5rem; border-radius:18px; border:1px solid var(--border); display:flex; gap:15px; margin-bottom:1rem; position:relative;';
      commentDiv.innerHTML = `
        <div style="width:40px; height:40px; border-radius:50%; background:var(--primary); color:white; display:flex; align-items:center; justify-content:center; font-weight:700; flex-shrink:0;">${initial}</div>
        <div style="flex:1;">
          <div style="display:flex; justify-content:space-between; margin-bottom:5px;">
            <strong style="font-size:0.9rem;">${data.authorEmail.split('@')[0]} <span style="color:#f59e0b; margin-left:8px;">${stars}</span></strong>
            <div style="display:flex; align-items:center; gap:10px;">
              <span style="font-size:0.75rem; color:var(--text-light);">${date}</span>
              ${isOwner ? `<button class="btn-delete-comment" data-id="${commentId}" style="background:none; border:none; color:var(--text-light); cursor:pointer; padding:2px; display:flex; align-items:center;"><i data-lucide="trash-2" style="width:14px; height:14px;"></i></button>` : ''}
            </div>
          </div>
          <p style="font-size:0.9rem; color:var(--text); line-height:1.4;">${data.text}</p>
        </div>
      `;
      
      const delBtn = commentDiv.querySelector('.btn-delete-comment');
      if (delBtn) {
        delBtn.addEventListener('click', () => {
          showConfirm("¿Borrar comentario?", "¿Seguro que quieres borrar tu comentario?", async () => {
            try {
              await deleteDoc(doc(db, "comentarios", commentId));
              loadComments();
              updateStats();
              showToast("Comentario borrado.", "success");
            } catch (e) {
              console.error("Error deleting comment:", e);
              showToast("Error al borrar comentario.", "error");
            }
          });
        });
      }

      commentsList.appendChild(commentDiv);
    });
    lucide.createIcons();
  } catch (error) {
    console.error("Error loading comments:", error);
  }
}

function initCommentForm() {
  const commentForm = document.getElementById('comment-form');
  if (!commentForm) return;

  commentForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    const text = document.getElementById('comment-text').value;
    const rating = document.getElementById('comment-rating').value;
    
    try {
      await addDoc(collection(db, "comentarios"), {
        text: text,
        rating: rating,
        authorUid: currentUser.uid,
        authorEmail: currentUser.email,
        timestamp: new Date()
      });
      document.getElementById('comment-text').value = '';
      loadComments();
      updateStats();
    } catch (error) {
      console.error("Error posting comment:", error);
    }
  });
}

function populateProfilePage(user) {
  const emailDisplay = document.getElementById('display-email');
  const initialDisplay = document.getElementById('avatar-initial');
  const nameDisplay = document.getElementById('display-name');
  const emailField = document.getElementById('profile-email');
  const logoutFull = document.getElementById('btn-logout-full');
  const addNewBtn = document.getElementById('add-new-btn');

  if (emailDisplay) emailDisplay.textContent = user.email;
  if (emailField) emailField.textContent = user.email;
  if (initialDisplay) initialDisplay.textContent = user.email.charAt(0).toUpperCase();
  if (nameDisplay) nameDisplay.textContent = user.displayName || user.email.split('@')[0];
  
  if (logoutFull) logoutFull.addEventListener('click', () => signOut(auth));
  if (addNewBtn) addNewBtn.addEventListener('click', openServiceModal);

  renderUserServicesFull();
  renderFavoritesGrid();
}

function renderUserServicesFull() {
  const grid = document.getElementById('my-services-grid');
  if (!grid) return;
  grid.innerHTML = '';
  
  const myServices = services.filter(s => s.owner === currentUser.uid);
  if (myServices.length === 0) {
    grid.innerHTML = '<p style="grid-column: 1/-1; text-align:center; padding: 40px; color: var(--text-light);">No has publicado anuncios todavía.</p>';
    return;
  }

  myServices.forEach(s => {
    const card = document.createElement('div');
    card.className = 'act-card';
    card.innerHTML = `
      <img src="${s.img}" class="act-img">
      <div class="act-body">
        <h4 style="margin-bottom:10px;">${s.title}</h4>
        <div style="display:flex; gap:10px;">
          <button class="btn-secondary" style="flex:1; padding:5px; font-size:0.8rem;">Editar</button>
          <button class="btn-delete-full" style="padding:5px 10px; background:rgba(239, 68, 68, 0.1); color:#ef4444; border:none; border-radius:8px; cursor:pointer;"><i data-lucide="trash-2" style="width:16px;"></i></button>
        </div>
      </div>
    `;
    
    card.querySelector('.btn-delete-full').addEventListener('click', async () => {
      if (confirm(`¿Eliminar "${s.title}"?`)) {
        await deleteDoc(doc(db, "actividades", s._id));
        services = services.filter(item => item._id !== s._id);
        renderUserServicesFull();
      }
    });
    grid.appendChild(card);
  });
  lucide.createIcons();
}

// Logic for favorites (Firestore)
let userFavorites = [];

async function loadUserFavorites() {
  if (!currentUser) {
    userFavorites = [];
    renderServices();
    return;
  }
  try {
    const q = query(collection(db, "favoritos"), where("userId", "==", currentUser.uid));
    const snap = await getDocs(q);
    userFavorites = snap.docs.map(doc => doc.data().activityId);
    renderServices();
    if (document.getElementById('favorites-grid')) renderFavoritesGrid();
  } catch (e) { console.error("Error favorites:", e); }
}

async function toggleFavorite(activityId) {
  if (!currentUser) {
    showToast("Inicia sesión para guardar tus favoritos", "info");
    openModal();
    return;
  }

  try {
    const q = query(collection(db, "favoritos"), where("userId", "==", currentUser.uid), where("activityId", "==", activityId));
    const snap = await getDocs(q);
    
    if (!snap.empty) {
      // Quitar de favs
      await deleteDoc(doc(db, "favoritos", snap.docs[0].id));
      userFavorites = userFavorites.filter(id => id !== activityId);
      showToast("Eliminado de favoritos", "info");
    } else {
      // Añadir a favs
      await addDoc(collection(db, "favoritos"), {
        userId: currentUser.uid,
        activityId: activityId,
        timestamp: new Date()
      });
      userFavorites.push(activityId);
      showToast("Añadido a favoritos", "success");
    }
    renderServices();
    if (document.getElementById('favorites-grid')) renderFavoritesGrid();
  } catch (e) { console.error("Error toggle fav:", e); }
}

async function renderFavoritesGrid() {
  const grid = document.getElementById('favorites-grid');
  if (!grid) return;
  grid.innerHTML = '<div style="grid-column: 1/-1; text-align:center; padding:2rem;"><div class="loader"></div></div>';
  
  if (userFavorites.length === 0) {
    grid.innerHTML = '<p style="grid-column: 1/-1; text-align:center; padding: 40px; color: var(--text-light);">No tienes actividades guardadas.</p>';
    return;
  }

  grid.innerHTML = '';
  const myFavs = services.filter(s => userFavorites.includes(s.id));
  
  myFavs.forEach(s => {
    const card = document.createElement('div');
    card.className = 'act-card';
    card.innerHTML = `
      <img src="${s.img}" class="act-img">
      <div class="act-body">
        <div class="act-cat">${s.category}</div>
        <h4 style="margin-bottom:10px;">${s.title}</h4>
        <button class="btn-primary" style="padding: 8px; width:100%; font-size:0.8rem;">Ver Detalles</button>
      </div>
    `;
    card.querySelector('button').addEventListener('click', () => openDetailsModal(s));
    grid.appendChild(card);
  });
  lucide.createIcons();
}

// ── ACCOUNT PANEL LOGIC ──
const accountModal = document.getElementById('account-modal');
const accountClose = document.getElementById('account-close');
const userServicesList = document.getElementById('user-services-list');
const profileEmail = document.getElementById('profile-email');

async function abrirPanelCuenta() {
  if (!currentUser || !accountModal) return;
  
  if (profileEmail) profileEmail.textContent = currentUser.email;
  accountModal.classList.add('active');
  toggleScrollLock(true);
  
  renderUserServices();
}

function renderUserServices() {
  if (!userServicesList) return;
  userServicesList.innerHTML = '';
  
  const myServices = services.filter(s => s.owner === currentUser.uid);
  
  if (myServices.length === 0) {
    userServicesList.innerHTML = '<p style="text-align:center; padding: 20px; color: var(--text-light);">Aún no has publicado ningún servicio.</p>';
    return;
  }
  
  myServices.forEach(s => {
    const item = document.createElement('div');
    item.style.cssText = 'display:flex; align-items:center; gap:15px; padding:10px; background:var(--background); border-radius:10px; border:1px solid var(--border);';
    item.innerHTML = `
      <img src="${s.img}" style="width:50px; height:50px; border-radius:8px; object-fit:cover;">
      <div style="flex:1;">
        <h4 style="font-size:0.9rem; margin-bottom:2px;">${s.title}</h4>
        <p style="font-size:0.75rem; color:var(--text-light);">${s.category}</p>
      </div>
      <button class="btn-delete" style="background:rgba(239, 68, 68, 0.1); color:#ef4444; border:none; padding:8px; border-radius:8px; cursor:pointer;" title="Eliminar">
        <i data-lucide="trash-2" style="width:18px; height:18px;"></i>
      </button>
    `;
    
    const deleteBtn = item.querySelector('.btn-delete');
    deleteBtn.addEventListener('click', async () => {
          showConfirm("¿Estás seguro?", `¿Estás seguro de que quieres eliminar "${s.title}"?`, async () => {
            try {
              await deleteDoc(doc(db, "actividades", s._id));
              showToast("Servicio eliminado correctamente.", "success");
              // Update local list and UI
              services = services.filter(item => item._id !== s._id);
              renderUserServices();
              if (activitiesContainer) renderServices();
            } catch (error) {
              console.error("Error deleting:", error);
              showToast("Error al eliminar el servicio.", "error");
            }
          });
    });
    
    userServicesList.appendChild(item);
  });
  lucide.createIcons();
}

if (accountClose) {
  accountClose.addEventListener('click', () => {
    accountModal.classList.remove('active');
    toggleScrollLock(false);
  });
}
if (accountModal) {
  accountModal.addEventListener('click', (e) => { if (e.target === accountModal) { accountModal.classList.remove('active'); toggleScrollLock(false); } });
}

// ── THEME MANAGEMENT ──
const body = document.body;
const themeSelector = document.getElementById('theme-selector');

function applyTheme(theme) {
  const isDark = theme === 'dark' || (theme === 'auto' && window.matchMedia('(prefers-color-scheme: dark)').matches);
  body.classList.toggle('dark-mode', isDark);
  lucide.createIcons();
}

// Inicialización
const savedTheme = localStorage.getItem('theme') || 'auto';
applyTheme(savedTheme);

if (themeSelector) {
  themeSelector.value = savedTheme;
  themeSelector.addEventListener('change', () => {
    const newTheme = themeSelector.value;
    localStorage.setItem('theme', newTheme);
    applyTheme(newTheme);
  });
}

// Escuchar cambios del sistema
window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', () => {
  if (localStorage.getItem('theme') === 'auto' || !localStorage.getItem('theme')) {
    applyTheme('auto');
  }
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


// ── MODAL HELPERS ──
function toggleScrollLock(lock) {
  document.body.classList.toggle('no-scroll', lock);
}


// ── AUTH MODAL ──
const authModal = document.getElementById('auth-modal');
const btnClose = document.getElementById('modal-close');
const authTrigger = document.getElementById('auth-trigger');
const authTriggerMobile = document.getElementById('auth-trigger-mobile');

function openModal() { 
  if (authModal) {
    authModal.classList.add('active');
    toggleScrollLock(true);
  } 
}
function closeModal() { 
  if (authModal) {
    authModal.classList.remove('active');
    toggleScrollLock(false);
  } 
}

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
    authForm.addEventListener('submit', async (e) => {
      e.preventDefault();
      const email = authForm.querySelector('input[type="email"]').value;
      const password = authForm.querySelector('input[type="password"]').value;
      const mode = authMode.value;

      const originalText = submitBtn.textContent;
      submitBtn.disabled = true;
      submitBtn.textContent = 'Procesando...';

      try {
        if (mode === 'login') {
          await signInWithEmailAndPassword(auth, email, password);
          showToast("¡Bienvenido de nuevo!", "success");
        } else {
          const userCredential = await createUserWithEmailAndPassword(auth, email, password);
          // Registrar usuario en la colección para el conteo
          await addDoc(collection(db, "usuarios"), {
            uid: userCredential.user.uid,
            email: email,
            createdAt: new Date()
          });
          showToast("¡Cuenta creada con éxito!", "success");
        }
        closeModal();
      } catch (error) {
        console.error("Auth Error:", error);
        showToast("Error: " + error.message, "error");
      } finally {
        submitBtn.disabled = false;
        submitBtn.textContent = originalText;
      }
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




// ── MARKETPLACE: DATA & RENDERING ──
let services = [];
const activitiesContainer = document.getElementById('activities-container');

async function loadServices() {
  try {
    const q = query(collection(db, "actividades"), orderBy("id", "desc"));
    const querySnapshot = await getDocs(q);
    const firebaseServices = [];
    querySnapshot.forEach((doc) => {
      firebaseServices.push({ _id: doc.id, ...doc.data() });
    });
    services = firebaseServices.length > 0 ? firebaseServices : (window.servicesData || []);
    renderServices();
  } catch (error) {
    console.error("Error al cargar desde Firebase:", error);
    services = window.servicesData || [];
    renderServices();
  }
}

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
        <p>${isSearch ? 'No se han encontrado actividades que coincidan con tu búsqueda.' : 'Todavía no hay actividades publicadas en esta categoría.'}</p>
      </div>
    `;
  } else {
    filtered.forEach((s, index) => {
      const card = document.createElement('div');
      card.className = `act-card reveal visible`;
      card.style.transitionDelay = `${index * 0.1}s`;
      card.style.cursor = 'pointer';
      const isFav = userFavorites.includes(s.id);
      card.innerHTML = `
        <div class="fav-btn ${isFav ? 'active' : ''}" data-id="${s.id}" style="position:absolute; top:10px; right:10px; z-index:10; background:var(--surface); width:32px; height:32px; border-radius:50%; display:flex; align-items:center; justify-content:center; box-shadow:var(--shadow); cursor:pointer; border:1px solid var(--border);">
          <i data-lucide="heart" style="width:18px; height:18px; fill:${isFav ? '#ef4444' : 'none'}; color:${isFav ? '#ef4444' : 'var(--text-light)'};"></i>
        </div>
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
      
      const favBtn = card.querySelector('.fav-btn');
      favBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        toggleFavorite(s.id);
      });

      card.addEventListener('click', () => openDetailsModal(s));
      activitiesContainer.appendChild(card);
    });
  }
  lucide.createIcons();
}

// ── DETAILS MODAL LOGIC ──
const detailsModal = document.getElementById('details-modal');
const detailsClose = document.getElementById('details-close');
const detailsContent = document.getElementById('details-content');

function openDetailsModal(service) {
  if (!detailsModal || !detailsContent) return;
  
  const mapQuery = encodeURIComponent(service.location || service.title);
  
  detailsContent.innerHTML = `
    <div class="details-info">
      <img src="${service.img}" alt="${service.title}" style="width: 100%; border-radius: 12px; margin-bottom: 1.5rem; height: 250px; object-fit: cover;">
      <h2 style="font-size: 1.8rem; margin-bottom: 0.5rem;">${service.title}</h2>
      <div style="display: inline-block; padding: 4px 12px; background: var(--primary); color: white; border-radius: 20px; font-size: 0.8rem; margin-bottom: 1rem;">${service.category.toUpperCase()}</div>
      <p style="color: var(--text-light); line-height: 1.6; margin-bottom: 1.5rem;">${service.description || 'Sin descripción disponible.'}</p>
      
      <div style="display: flex; flex-direction: column; gap: 12px; margin-bottom: 1.5rem;">
        <div style="display:flex; align-items:center; gap:10px;"><i data-lucide="users" style="color: var(--primary)"></i> <strong>Edad:</strong> ${service.age}</div>
        <div style="display:flex; align-items:center; gap:10px;"><i data-lucide="map-pin" style="color: var(--primary)"></i> <strong>Ubicación:</strong> ${service.location || 'Consultar'}</div>
        ${service.email ? `<div style="display:flex; align-items:center; gap:10px;"><i data-lucide="mail" style="color: var(--primary)"></i> <strong>Email:</strong> ${service.email}</div>` : ''}
        ${service.phone ? `<div style="display:flex; align-items:center; gap:10px;"><i data-lucide="phone" style="color: var(--primary)"></i> <strong>Teléfono:</strong> ${service.phone}</div>` : ''}
      </div>
    </div>
    <div class="details-map">
      <h3 style="margin-bottom: 1rem;">Ubicación en el mapa</h3>
      <div style="width: 100%; height: 350px; border-radius: 12px; overflow: hidden; border: 1px solid var(--border);">
        <iframe 
          width="100%" 
          height="100%" 
          frameborder="0" 
          style="border:0" 
          src="https://www.google.com/maps/embed/v1/place?key=REPLACE_WITH_YOUR_API_KEY&q=${mapQuery}" 
          allowfullscreen>
          <!-- Note: v1/place requires an API key. For demo, we use a simpler search URL -->
        </iframe>
        <iframe 
          width="100%" 
          height="100%" 
          style="border:0" 
          loading="lazy" 
          allowfullscreen 
          src="https://maps.google.com/maps?q=${mapQuery}&t=&z=13&ie=UTF8&iwloc=&output=embed">
        </iframe>
      </div>
    </div>
  `;
  
  // Note: I included two iframes above, the second one is a classic embed that doesn't need a key
  // I will remove the first one to avoid errors
  detailsContent.querySelector('iframe').remove();
  
  detailsModal.classList.add('active');
  toggleScrollLock(true);
  lucide.createIcons();
}

if (detailsClose) {
  detailsClose.addEventListener('click', () => {
    detailsModal.classList.remove('active');
    toggleScrollLock(false);
  });
}
if (detailsModal) {
  detailsModal.addEventListener('click', (e) => {
    if (e.target === detailsModal) {
      detailsModal.classList.remove('active');
      toggleScrollLock(false);
    }
  });
}


function initMarketplace() {
  const urlParams = new URLSearchParams(window.location.search);
  const catParam = urlParams.get('cat');
  if (activitiesContainer) {
    const categoryFilter = document.getElementById('filter-category');
    if (catParam && categoryFilter) {
      categoryFilter.value = catParam;
    }
    loadServices(); // This calls renderServices internally
  }
}
initMarketplace();


// ── MARKETPLACE: ADD SERVICE MODAL ──
const serviceModal = document.getElementById('service-modal');
const serviceClose = document.getElementById('service-close');
const addServiceTrigger = document.getElementById('add-service-trigger');
const addServiceTriggerFab = document.getElementById('add-service-trigger-fab');

function openServiceModal() { 
  if (!currentUser) {
    showToast("Debes iniciar sesión para poder publicar un servicio.", "info");
    openModal();
    return;
  }
  if (serviceModal) {
    serviceModal.classList.add('active');
    toggleScrollLock(true);
  } 
}
function closeServiceModal() { 
  if (serviceModal) {
    serviceModal.classList.remove('active');
    toggleScrollLock(false);
  } 
}

if (addServiceTrigger) addServiceTrigger.addEventListener('click', openServiceModal);
if (addServiceTriggerFab) addServiceTriggerFab.addEventListener('click', openServiceModal);
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

    const publish = async (imgUrl) => {
      const newService = {
        id: Date.now(),
        owner: currentUser.uid, // Vincular al usuario actual
        title: name,
        category: cat === 'otro' ? 'Otro' : cat,
        email: email,
        phone: phone,
        age: 'Consultar edad',
        img: imgUrl || 'https://images.unsplash.com/photo-1497633762265-9d179a990aa6?auto=format&fit=crop&q=80&w=600',
        description: desc + ` | Precio: ${price}€ | Ubicación: ${location}`
      };

      try {
        // Guardar en Firebase
        await addDoc(collection(db, "actividades"), newService);
        
        // Actualizar lista local y UI
        services.unshift(newService);
        if (activitiesContainer) {
          renderServices('all', '');
          const activitiesSection = document.getElementById('actividades');
          if (activitiesSection) activitiesSection.scrollIntoView({ behavior: 'smooth' });
        } else {
          window.location.href = window.location.pathname.includes('pages/') ? 'actividades.html' : 'pages/actividades.html';
        }
        
        let alertMsg = `¡Genial! Tu servicio "${name}" ha sido publicado correctamente.`;
        if (cat === 'otro' && suggestion) {
          alertMsg += `\n\nHemos recibido tu sugerencia para la categoría: "${suggestion}". ¡La revisaremos pronto!`;
        }
        alert(alertMsg);
        
        closeServiceModal();
        serviceForm.reset();
        if (suggestionContainer) suggestionContainer.style.display = 'none';
      } catch (error) {
        console.error("Error al publicar en Firebase:", error);
        alert("Hubo un error al publicar tu servicio. Por favor, inténtalo de nuevo.");
      }
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
