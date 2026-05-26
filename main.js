const menuToggle = document.getElementById('menu-toggle');
const navList = document.querySelector('nav ul');

if (menuToggle && navList) {
  menuToggle.addEventListener('click', () => {
    menuToggle.classList.toggle('active');
    navList.classList.toggle('active');
  });

  document.querySelectorAll('nav ul li a').forEach((link) => {
    link.addEventListener('click', () => {
      if (navList.classList.contains('active')) {
        navList.classList.remove('active');
        menuToggle.classList.remove('active');
      }
    });
  });
}

function submitContact(event) {
  event.preventDefault();
  alert('Mesajınız alındı. Teşekkür ederiz!');
  event.target.reset();
}

const revealObserver = new IntersectionObserver((entries) => {
  entries.forEach((entry) => {
    if (entry.isIntersecting) {
      entry.target.classList.add('visible');
      revealObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.18 });

document.querySelectorAll('.gallery img').forEach((el, index) => {
  el.style.transitionDelay = `${index * 90}ms`;
  revealObserver.observe(el);
});

document.querySelectorAll('.mission-card').forEach((el, index) => {
  el.style.transitionDelay = `${index * 100}ms`;
  revealObserver.observe(el);
});

document.querySelectorAll('section').forEach((el) => {
  revealObserver.observe(el);
});

document.querySelectorAll('.about-photo').forEach((el) => {
  revealObserver.observe(el);
});
