/* ===== LENIS SMOOTH SCROLL ===== */
const lenis = new Lenis({ duration: 1.1, smoothWheel: true });
function raf(time) {
  lenis.raf(time);
  requestAnimationFrame(raf);
}
requestAnimationFrame(raf);

/* ===== PAGE TRANSITIONS ===== */
(function() {
  const overlay = document.createElement('div');
  overlay.id = 'page-transition';
  overlay.style.cssText = `
    position:fixed; inset:0; z-index:99999; pointer-events:none;
    background:#0a0907; transform:translateY(-100%); transition:transform 0.7s cubic-bezier(.77,0,.18,1);
  `;
  document.body.appendChild(overlay);

  // On arriving at a new page, fade transition in then out
  if (sessionStorage.getItem('pt')) {
    sessionStorage.removeItem('pt');
    overlay.style.transform = 'translateY(0)';
    requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        overlay.style.transform = 'translateY(100%)';
        setTimeout(() => { overlay.style.transform = 'translateY(-100%)'; overlay.style.pointerEvents = 'none'; }, 700);
      });
    });
  }

  // Intercept nav links
  document.querySelectorAll('nav a[href]').forEach(a => {
    a.addEventListener('click', e => {
      if (a.hostname === location.hostname && !a.hash && a.pathname !== location.pathname) {
        e.preventDefault();
        sessionStorage.setItem('pt', '1');
        overlay.style.pointerEvents = 'auto';
        overlay.style.transform = 'translateY(0)';
        setTimeout(() => { window.location.href = a.href; }, 700);
      }
    });
  });
})();

/* ===== SPLIT TEXT REVEAL ===== */
(function() {
  document.querySelectorAll('.title').forEach(title => {
    const words = title.textContent.split(' ');
    title.innerHTML = words.map(w => `<span class="split-word">${w}</span>`).join(' ');
    title.style.opacity = '1';
  });
  const obs = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.querySelectorAll('.split-word').forEach((w, i) => {
          w.style.transitionDelay = `${i * 0.06}s`;
          w.classList.add('revealed');
        });
        obs.unobserve(entry.target);
      }
    });
  }, { threshold: 0.3 });
  document.querySelectorAll('.title').forEach(t => obs.observe(t));
})();

/* ===== 3D DEPTH PARALLAX ===== */
(function() {
  const hero = document.querySelector('.hero');
  if (!hero) return;
  const logo = hero.querySelector('.hero-logo');
  const title = hero.querySelector('h2');
  const subtitle = hero.querySelector('p');

  window.addEventListener('scroll', () => {
    const st = window.scrollY;
    const heroH = hero.offsetHeight;
    if (st > heroH * 1.5) return;

    const slow = st * 0.06;
    const mid = st * 0.12;
    const fast = st * 0.20;

    if (logo) logo.style.transform = `translateY(${slow}px) scale(${1 - st * 0.00008})`;
    if (title) title.style.transform = `translateY(${mid}px)`;
    if (subtitle) subtitle.style.transform = `translateY(${fast}px)`;
  });
})();

/* ===== GOLDEN FLOATING PARTICLES ===== */

/* ===== GOLDEN FLOATING PARTICLES ===== */
(function() {
  const canvas = document.createElement('canvas');
  canvas.id = 'gold-particles';
  canvas.style.cssText = 'position:fixed;inset:0;pointer-events:none;z-index:9998;';
  document.body.appendChild(canvas);
  const ctx = canvas.getContext('2d');
  let w, h, particles = [];

  function resize() {
    w = canvas.width = window.innerWidth;
    h = canvas.height = window.innerHeight;
  }
  resize();
  window.addEventListener('resize', resize);

  const COUNT = 45;
  for (let i = 0; i < COUNT; i++) {
    particles.push({
      x: Math.random() * w,
      y: Math.random() * h,
      r: Math.random() * 2.2 + 0.8,
      speedY: Math.random() * 0.25 + 0.08,
      drift: Math.random() * 0.2 - 0.1,
      alpha: Math.random() * 0.5 + 0.2,
      pulse: Math.random() * Math.PI * 2
    });
  }

  function animate() {
    ctx.clearRect(0, 0, w, h);
    particles.forEach(p => {
      p.y -= p.speedY;
      p.x += p.drift + Math.sin(p.pulse) * 0.15;
      p.pulse += 0.008;
      if (p.y < -10) { p.y = h + 10; p.x = Math.random() * w; }
      if (p.x < -10) p.x = w + 10;
      if (p.x > w + 10) p.x = -10;

      const flicker = 0.6 + Math.sin(p.pulse * 1.5) * 0.4;
      const a = p.alpha * flicker;

      ctx.beginPath();
      ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(212,175,55,${a})`;
      ctx.fill();

      ctx.beginPath();
      ctx.arc(p.x, p.y, p.r * 2.5, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(212,175,55,${a * 0.12})`;
      ctx.fill();
    });
    requestAnimationFrame(animate);
  }
  animate();
})();

/* ===== GOLD CLICK SPARKLE ===== */
document.addEventListener('click', (e) => {
  const colors = ['#d4af37', '#f0d060', '#e8c84a', '#c49820'];
  for (let i = 0; i < 10; i++) {
    const dot = document.createElement('div');
    const angle = (i / 10) * Math.PI * 2 + (Math.random() - 0.5) * 0.5;
    const vel = 30 + Math.random() * 50;
    const size = 3 + Math.random() * 4;
    dot.style.cssText = `
      position:fixed; width:${size}px; height:${size}px; border-radius:50%;
      background:${colors[i % 4]}; pointer-events:none; z-index:99999;
      left:${e.clientX}px; top:${e.clientY}px;
      box-shadow:0 0 ${4 + size}px rgba(212,175,55,0.6);
    `;
    document.body.appendChild(dot);
    const x = Math.cos(angle) * vel;
    const y = Math.sin(angle) * vel - 20;
    dot.animate([
      { transform: 'translate(0,0) scale(1.2)', opacity: 1 },
      { transform: `translate(${x}px,${y}px) scale(0)`, opacity: 0 }
    ], { duration: 500 + Math.random() * 200, easing: 'cubic-bezier(.25,.46,.45,.94)' })
      .onfinish = () => dot.remove();
  }
});

/* ===== HERO TYPEWRITER ===== */
(function() {
  const el = document.querySelector('.hero-content p');
  if (!el) return;
  const text = el.innerHTML;
  el.innerHTML = '';
  el.style.minHeight = '60px';
  let i = 0;
  setTimeout(function type() {
    if (i < text.length) {
      el.innerHTML += text[i];
      i++;
      setTimeout(type, 30 + Math.random() * 18);
    }
  }, 2200);
})();

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
