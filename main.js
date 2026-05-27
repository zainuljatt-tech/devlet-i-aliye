/* ===== PAGE LOAD LOGO INTRO ===== */
document.body.style.overflow = 'hidden';
window.addEventListener('load', () => {
  const loader = document.getElementById('loader-intro');
  if (loader) {
    setTimeout(() => {
      loader.classList.add('hide');
      document.body.style.overflow = '';
    }, 1800);
  }
});

/* ===== MOBILE MENU ===== */
const menuToggle = document.getElementById('menu-toggle');
const navList = document.querySelector('nav ul');
if (menuToggle && navList) {
  menuToggle.addEventListener('click', () => {
    menuToggle.classList.toggle('active');
    navList.classList.toggle('active');
  });
  document.querySelectorAll('nav ul li a').forEach(link => {
    link.addEventListener('click', () => {
      if (navList.classList.contains('active')) {
        navList.classList.remove('active');
        menuToggle.classList.remove('active');
      }
    });
  });
}

/* ===== SCROLL PROGRESS BAR ===== */
const progressBar = document.createElement('div');
progressBar.id = 'scroll-progress';
document.body.prepend(progressBar);
window.addEventListener('scroll', () => {
  const scrollTop = window.scrollY;
  const docHeight = document.documentElement.scrollHeight - window.innerHeight;
  progressBar.style.width = `${(scrollTop / docHeight) * 100}%`;
});

/* ===== NAVBAR SCROLL SHRINK ===== */
const nav = document.querySelector('nav');
let lastScroll = 0;
window.addEventListener('scroll', () => {
  const currentScroll = window.scrollY;
  if (currentScroll > 80) {
    nav.classList.add('nav-scrolled');
  } else {
    nav.classList.remove('nav-scrolled');
  }
  lastScroll = currentScroll;
});

/* ===== PREMIUM INTERSECTION OBSERVER ===== */
const revealOptions = { threshold: 0.12, rootMargin: '0px 0px -40px 0px' };
const revealObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      const el = entry.target;
      const delay = el.dataset.delay || 0;
      setTimeout(() => {
        el.classList.add('visible');
      }, delay);
      revealObserver.unobserve(el);
    }
  });
}, revealOptions);

// Observe all sections
document.querySelectorAll('section, .baskan-section, footer').forEach(el => {
  revealObserver.observe(el);
});

// Observe stagger containers
document.querySelectorAll('.stagger-children').forEach(el => {
  revealObserver.observe(el);
});

// Observe individual stagger children
document.querySelectorAll('.mission-card, .gallery img, .team-box').forEach((el, i) => {
  el.dataset.delay = i * 80;
  revealObserver.observe(el);
});

// Observe about-photo
document.querySelectorAll('.about-photo').forEach(el => {
  revealObserver.observe(el);
});

// Observe subpage sections
document.querySelectorAll('.subpage section').forEach(el => {
  revealObserver.observe(el);
});

/* ===== HERO PARALLAX ===== */
const hero = document.querySelector('.hero');
if (hero) {
  window.addEventListener('scroll', () => {
    const scrolled = window.scrollY;
    const heroContent = hero.querySelector('.hero-content');
    if (heroContent && scrolled < hero.offsetHeight) {
      heroContent.style.transform = `translateY(${scrolled * 0.08}px)`;
      heroContent.style.opacity = 1 - (scrolled / hero.offsetHeight) * 0.3;
    }
  });
}

/* ===== 3D TILT ON MISSION CARDS ===== */
document.querySelectorAll('.mission-card').forEach(card => {
  card.addEventListener('mousemove', (e) => {
    const rect = card.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const centerX = rect.width / 2;
    const centerY = rect.height / 2;
    const rotateX = ((y - centerY) / centerY) * -6;
    const rotateY = ((x - centerX) / centerX) * 6;
    card.style.transform = `perspective(800px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateY(-6px)`;
  });
  card.addEventListener('mouseleave', () => {
    card.style.transform = 'perspective(800px) rotateX(0) rotateY(0) translateY(0)';
  });
});

/* ===== BUTTON RIPPLE ===== */
document.querySelectorAll('.btn').forEach(btn => {
  btn.addEventListener('click', function (e) {
    const rect = this.getBoundingClientRect();
    const ripple = document.createElement('span');
    ripple.className = 'ripple';
    const size = Math.max(rect.width, rect.height);
    ripple.style.width = ripple.style.height = `${size}px`;
    ripple.style.left = `${e.clientX - rect.left - size / 2}px`;
    ripple.style.top = `${e.clientY - rect.top - size / 2}px`;
    this.appendChild(ripple);
    ripple.addEventListener('animationend', () => ripple.remove());
  });
});

/* ===== AUTH TAB SWITCH ===== */
function showTab(tab) {
  document.querySelectorAll('.auth-tab').forEach(t => t.classList.remove('active'));
  document.querySelectorAll('.auth-form').forEach(f => {
    f.style.opacity = '0';
    f.style.transform = 'translateY(10px)';
    setTimeout(() => { f.style.display = 'none'; }, 200);
  });
  const activeTab = document.querySelector(`[onclick="showTab('${tab}')"]`);
  if (activeTab) activeTab.classList.add('active');
  const form = document.getElementById(`${tab}-form`);
  if (form) {
    setTimeout(() => {
      form.style.display = 'flex';
      requestAnimationFrame(() => {
        form.style.opacity = '1';
        form.style.transform = 'translateY(0)';
      });
    }, 250);
  }
}

/* ===== CONTACT FORM ===== */
function submitContact(event) {
  event.preventDefault();
  const btn = event.target.querySelector('.btn');
  if (btn) {
    btn.textContent = 'Gönderiliyor...';
    btn.disabled = true;
  }
  setTimeout(() => {
    alert('Mesajınız alındı. Teşekkür ederiz!');
    event.target.reset();
    if (btn) {
      btn.textContent = 'Gönder';
      btn.disabled = false;
    }
  }, 600);
}

/* ===== SMOOTH ANCHOR LINKS ===== */
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', function (e) {
    const href = this.getAttribute('href');
    if (href === '#') return;
    const target = document.querySelector(href);
    if (target) {
      e.preventDefault();
      target.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  });
});

/* ===== GALLERY IMAGE LIGHTBOX ===== */
document.querySelectorAll('.gallery img').forEach(img => {
  img.addEventListener('click', function () {
    const overlay = document.createElement('div');
    overlay.style.cssText = `
      position:fixed; inset:0; z-index:9999;
      background:rgba(0,0,0,0.92); display:flex;
      align-items:center; justify-content:center;
      cursor:zoom-out; opacity:0;
      transition:opacity 0.4s ease;
      backdrop-filter:blur(10px);
      -webkit-backdrop-filter:blur(10px);
    `;
    const clone = this.cloneNode(true);
    clone.style.cssText = `
      max-width:90vw; max-height:90vh; width:auto; height:auto;
      border-radius:8px; border:1px solid rgba(212,175,55,0.2);
      box-shadow:0 30px 80px rgba(0,0,0,0.5);
      transform:scale(0.9); transition:transform 0.4s cubic-bezier(0.16,1,0.3,1);
    `;
    overlay.appendChild(clone);
    document.body.appendChild(overlay);
    requestAnimationFrame(() => {
      overlay.style.opacity = '1';
      clone.style.transform = 'scale(1)';
    });
    overlay.addEventListener('click', () => {
      overlay.style.opacity = '0';
      clone.style.transform = 'scale(0.9)';
      setTimeout(() => overlay.remove(), 400);
    });
  });
});

/* ===== PREVENT ORPHAN NAV REDIRECTS ON FORM SUBMIT ===== */
document.querySelectorAll('.auth-form').forEach(form => {
  form.addEventListener('submit', function (e) {
    const btn = this.querySelector('.btn');
    if (btn) {
      btn.textContent = 'Gönderiliyor...';
      btn.disabled = true;
    }
  });
});
