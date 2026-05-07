const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

// Lenis Smooth Scroll
const lenis = new Lenis({
  duration: 1.2,
  easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
  direction: 'vertical',
  gestureDirection: 'vertical',
  smooth: true,
  mouseMultiplier: 1,
  smoothTouch: false,
});

function raf(time) {
  lenis.raf(time);
  requestAnimationFrame(raf);
}
requestAnimationFrame(raf);

// GSAP integration with Lenis
gsap.registerPlugin(ScrollTrigger);

// Magnetic Buttons
const magneticElements = document.querySelectorAll('.magnetic');
magneticElements.forEach((elem) => {
  elem.addEventListener("mousemove", function(e) {
    const position = elem.getBoundingClientRect();
    const x = e.clientX - position.left - position.width / 2;
    const y = e.clientY - position.top - position.height / 2;
    const strength = elem.dataset.strength || 20;

    gsap.to(elem, {
      x: (x / position.width) * strength,
      y: (y / position.height) * strength,
      duration: 0.5,
      ease: "power2.out"
    });

    const text = elem.querySelector('.btn-text');
    if (text) {
      gsap.to(text, {
        x: (x / position.width) * (strength / 2),
        y: (y / position.height) * (strength / 2),
        duration: 0.5,
        ease: "power2.out"
      });
    }
  });

  elem.addEventListener("mouseleave", function() {
    gsap.to(elem, { x: 0, y: 0, duration: 0.5, ease: "elastic.out(1, 0.3)" });
    const text = elem.querySelector('.btn-text');
    if (text) {
      gsap.to(text, { x: 0, y: 0, duration: 0.5, ease: "elastic.out(1, 0.3)" });
    }
  });
});

// Fade Up Animations
gsap.utils.toArray('.fade-up').forEach(element => {
  const delay = parseFloat(element.dataset.delay) || 0;
  gsap.to(element, {
    scrollTrigger: {
      trigger: element,
      start: "top 85%",
    },
    y: 0,
    opacity: 1,
    duration: 0.7,
    delay: delay,
    ease: "power3.out"
  });
});

// Sticky Features Tracker
const featuresNav = document.querySelectorAll('.features__nav-item');
const featuresCards = document.querySelectorAll('.features__card');

featuresCards.forEach((card, index) => {
  ScrollTrigger.create({
    trigger: card,
    start: "top center",
    end: "bottom center",
    onToggle: self => {
      if (self.isActive) {
        featuresNav.forEach(nav => nav.classList.remove('active'));
        featuresNav[index].classList.add('active');
      }
    }
  });
});

// Navbar scroll effect
const navbar = document.querySelector('.navbar');
window.addEventListener('scroll', () => {
  navbar.classList.toggle('scrolled', window.scrollY > 50);
}, { passive: true });

// Theme Toggle Logic
const themeToggle = document.getElementById('theme-toggle');
const iconMoon = document.querySelector('.icon-moon');
const iconSun = document.querySelector('.icon-sun');

function setTheme(theme) {
  document.documentElement.setAttribute('data-theme', theme);
  localStorage.setItem('theme', theme);
  iconMoon.style.display = theme === 'light' ? 'none' : 'block';
  iconSun.style.display  = theme === 'light' ? 'block' : 'none';
}

const savedTheme = localStorage.getItem('theme');
const systemPrefersLight = window.matchMedia('(prefers-color-scheme: light)').matches;
setTheme(savedTheme || (systemPrefersLight ? 'light' : 'dark'));

themeToggle.addEventListener('click', () => {
  const current = document.documentElement.getAttribute('data-theme') || 'dark';
  setTheme(current === 'dark' ? 'light' : 'dark');
});

// Language Toggle (placeholder)
document.getElementById('lang-toggle').addEventListener('click', () => {
  alert('Seletor de idiomas será implementado em breve para suportar EN/ES.');
});

// Hamburger Menu
const hamburger = document.querySelector('.navbar__hamburger');
const navLinks  = document.querySelector('.navbar__links');
if (hamburger && navLinks) {
  hamburger.addEventListener('click', () => {
    const isOpen = hamburger.classList.toggle('open');
    navLinks.classList.toggle('open', isOpen);
    hamburger.setAttribute('aria-expanded', String(isOpen));
  });
  navLinks.querySelectorAll('a').forEach(link => {
    link.addEventListener('click', () => {
      hamburger.classList.remove('open');
      navLinks.classList.remove('open');
      hamburger.setAttribute('aria-expanded', 'false');
    });
  });
}

// FAQ Accordion
document.querySelectorAll('.faq__trigger').forEach(trigger => {
  trigger.addEventListener('click', () => {
    const panel  = trigger.nextElementSibling;
    const isOpen = trigger.getAttribute('aria-expanded') === 'true';

    // Close all others
    document.querySelectorAll('.faq__trigger').forEach(t => {
      t.setAttribute('aria-expanded', 'false');
      t.nextElementSibling.hidden = true;
    });

    // Toggle clicked
    if (!isOpen) {
      trigger.setAttribute('aria-expanded', 'true');
      panel.hidden = false;
    }
  });
});

// 3D Orbit Animation for Pillars
const orbiters  = document.querySelectorAll('.pillar-orbiter');
const orbitRing = document.querySelector('.orbit-ring');

if (orbiters.length > 0 && orbitRing && !prefersReducedMotion) {
  const numPillars = orbiters.length;
  const radiusX = window.innerWidth > 1024 ? 480 : 200;

  orbiters.forEach((orbiter, i) => {
    const angle = (i / numPillars) * Math.PI * 2;
    gsap.set(orbiter, { rotationY: (angle * 180) / Math.PI });

    const content = orbiter.querySelector('.pillar-content');
    gsap.set(content, {
      xPercent: -50,
      yPercent: -50,
      z: radiusX,
      rotationY: -(angle * 180) / Math.PI
    });
  });

  gsap.set(orbitRing,      { rotationX: -15, rotationZ:  5, xPercent: -50, yPercent: -50 });
  gsap.set('.orbit-center', { rotationX:  15, rotationZ: -5, xPercent: -50, yPercent: -50 });

  const orbitTl = gsap.timeline({ repeat: -1, defaults: { ease: "none" } });
  orbitTl.to(orbiters, { rotationY: "+=360", duration: 30 }, 0);
  orbiters.forEach(orbiter => {
    const content = orbiter.querySelector('.pillar-content');
    orbitTl.to(content, { rotationY: "-=360", duration: 30 }, 0);
  });

  // Pause orbit when section is offscreen — saves CPU
  ScrollTrigger.create({
    trigger: '.pillars',
    start: 'top bottom',
    end: 'bottom top',
    onEnter: ()  => orbitTl.resume(),
    onLeave: ()  => orbitTl.pause(),
    onEnterBack: () => orbitTl.resume(),
    onLeaveBack: () => orbitTl.pause(),
  });
}

// Hero Notification Animation
const heroNotif = document.querySelector('.hero__notification');
if (heroNotif) {
  if (prefersReducedMotion) {
    // Show immediately without animation
    gsap.set(heroNotif, { opacity: 1, scale: 1, x: 0 });
  } else {
    const isMobile = window.innerWidth <= 640;
    const notifTl  = gsap.timeline({ delay: 1 });

    notifTl.to(heroNotif, {
      opacity: 1,
      // On mobile, notification is positioned with fixed left calc — only animate scale + opacity
      ...(isMobile ? {} : { x: 0 }),
      scale: 1,
      duration: 1,
      ease: "back.out(1.7)"
    });

    notifTl.to('.notif__icon svg path', {
      strokeDashoffset: 0,
      duration: 0.6,
      ease: "power2.out"
    }, "-=0.3");

    gsap.to(heroNotif, {
      y: "-=15",
      duration: 3,
      repeat: -1,
      yoyo: true,
      ease: "sine.inOut"
    });
  }
}
