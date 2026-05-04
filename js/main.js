// Talento Kids — Main JS
document.addEventListener('DOMContentLoaded', () => {
  // Mobile menu
  const menuToggle = document.querySelector('.menu-toggle');
  const navMobile = document.querySelector('.nav-mobile');
  if (menuToggle && navMobile) {
    menuToggle.addEventListener('click', () => {
      const open = navMobile.classList.toggle('open');
      menuToggle.setAttribute('aria-expanded', open ? 'true' : 'false');
    });
  }

  // FAQ accordion
  document.querySelectorAll('.faq-question').forEach(btn => {
    btn.addEventListener('click', () => {
      const expanded = btn.getAttribute('aria-expanded') === 'true';
      btn.setAttribute('aria-expanded', expanded ? 'false' : 'true');
    });
  });

  // Cookie banner
  const banner = document.querySelector('.cookie-banner');
  if (banner && !localStorage.getItem('cookies-ok')) {
    banner.classList.add('visible');
  }
  document.querySelectorAll('.cookie-btn-accept, .cookie-btn-reject').forEach(b => {
    b.addEventListener('click', () => {
      localStorage.setItem('cookies-ok', '1');
      banner && banner.classList.remove('visible');
    });
  });
});
