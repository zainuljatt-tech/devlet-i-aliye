/* ===== 3D DEPTH PARALLAX ===== */
(function() {
  const layers = [
    { type: 'crescent', speed: 0.12, top: '12%', left: '6%', size: 60 },
    { type: 'star', speed: 0.22, top: '30%', right: '8%', size: 20 },
    { type: 'star', speed: 0.18, top: '55%', left: '4%', size: 14 },
    { type: 'geometric', speed: 0.08, top: '70%', right: '5%', size: 80 },
    { type: 'star', speed: 0.25, top: '85%', left: '10%', size: 10 },
  ];

  const els = [];
  layers.forEach(l => {
    const el = document.createElement('div');
    el.className = 'parallax-depth';
    let inner = '';
    if (l.type === 'crescent') {
      el.style.cssText = `position:fixed;pointer-events:none;z-index:0;top:${l.top};left:${l.left};opacity:0.08;`;
      inner = `<svg width="${l.size}" height="${l.size}" viewBox="0 0 100 100"><path d="M70 10A45 45 0 1 0 70 90 35 35 0 1 1 70 10Z" fill="#d4af37"/></svg>`;
    } else if (l.type === 'star') {
      el.style.cssText = `position:fixed;pointer-events:none;z-index:0;top:${l.top};${l.left ? 'left:'+l.left : 'right:'+l.right};opacity:0.06;`;
      inner = `<svg width="${l.size}" height="${l.size}" viewBox="0 0 50 50"><polygon points="25,0 31,17 50,17 35,28 40,46 25,35 10,46 15,28 0,17 19,17" fill="#d4af37"/></svg>`;
    } else if (l.type === 'geometric') {
      el.style.cssText = `position:fixed;pointer-events:none;z-index:0;top:${l.top};right:${l.right};opacity:0.04;`;
      inner = `<svg width="${l.size}" height="${l.size}" viewBox="0 0 100 100"><polygon points="50,0 93,25 93,75 50,100 7,75 7,25" fill="none" stroke="#d4af37" stroke-width="0.8"/><polygon points="50,15 78,32 78,68 50,85 22,68 22,32" fill="none" stroke="#d4af37" stroke-width="0.6"/><polygon points="50,30 64,40 64,60 50,70 36,60 36,40" fill="none" stroke="#d4af37" stroke-width="0.4"/></svg>`;
    }
    el.innerHTML = inner;
    el.dataset.speed = l.speed;
    el.dataset.origY = l.top;
    document.body.appendChild(el);
    els.push(el);
  });

  let ticking = false;
  window.addEventListener('scroll', () => {
    if (!ticking) {
      requestAnimationFrame(() => {
        const scrollY = window.scrollY;
        els.forEach(el => {
          const speed = parseFloat(el.dataset.speed);
          el.style.transform = `translateY(${scrollY * speed}px)`;
        });
        ticking = false;
      });
      ticking = true;
    }
  });
})();

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
