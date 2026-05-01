import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import Lenis from '@studio-freight/lenis';

gsap.registerPlugin(ScrollTrigger);

function initLenis() {
  const lenis = new Lenis({
    duration: 1.2,
    easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
    direction: 'vertical',
    gestureDirection: 'vertical',
    smooth: true,
    mouseMultiplier: 1,
    smoothTouch: false,
  });

  lenis.on('scroll', ScrollTrigger.update);

  gsap.ticker.add((time) => {
    lenis.raf(time * 1000);
  });
  gsap.ticker.lagSmoothing(0);
}

function initMagnetic() {
  document.querySelectorAll('.magnetic').forEach((elem) => {
    elem.addEventListener('mousemove', (e) => {
      const pos = elem.getBoundingClientRect();
      const x = e.clientX - pos.left - pos.width / 2;
      const y = e.clientY - pos.top - pos.height / 2;
      const strength = elem.dataset.strength || 20;

      gsap.to(elem, { x: (x / pos.width) * strength, y: (y / pos.height) * strength, duration: 0.5, ease: 'power2.out' });

      const text = elem.querySelector('.btn-text');
      if (text) {
        gsap.to(text, { x: (x / pos.width) * (strength / 2), y: (y / pos.height) * (strength / 2), duration: 0.5, ease: 'power2.out' });
      }
    });

    elem.addEventListener('mouseleave', () => {
      gsap.to(elem, { x: 0, y: 0, duration: 0.5, ease: 'elastic.out(1, 0.3)' });
      const text = elem.querySelector('.btn-text');
      if (text) gsap.to(text, { x: 0, y: 0, duration: 0.5, ease: 'elastic.out(1, 0.3)' });
    });
  });
}

function initFadeUp() {
  gsap.utils.toArray('.fade-up').forEach((el) => {
    gsap.to(el, {
      scrollTrigger: { trigger: el, start: 'top 85%' },
      y: 0,
      opacity: 1,
      duration: 1,
      delay: el.dataset.delay || 0,
      ease: 'power3.out',
    });
  });
}

function initFeaturesNav() {
  const navItems = document.querySelectorAll('.features__nav-item');
  const cards = document.querySelectorAll('.features__card');

  cards.forEach((card, index) => {
    ScrollTrigger.create({
      trigger: card,
      start: 'top center',
      end: 'bottom center',
      onToggle: (self) => {
        if (self.isActive) {
          navItems.forEach((nav) => nav.classList.remove('active'));
          if (navItems[index]) navItems[index].classList.add('active');
        }
      },
    });
  });
}

function initNavbar() {
  const navbar = document.querySelector('.navbar');
  if (!navbar) return;
  window.addEventListener('scroll', () => {
    navbar.classList.toggle('scrolled', window.scrollY > 50);
  });
}

function initTheme() {
  const toggle = document.getElementById('theme-toggle');
  const iconMoon = document.querySelector('.icon-moon');
  const iconSun = document.querySelector('.icon-sun');
  if (!toggle) return;

  function setTheme(theme) {
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem('theme', theme);
    iconMoon.style.display = theme === 'light' ? 'none' : 'block';
    iconSun.style.display = theme === 'light' ? 'block' : 'none';
  }

  const saved = localStorage.getItem('theme');
  const prefersLight = window.matchMedia('(prefers-color-scheme: light)').matches;
  setTheme(saved || (prefersLight ? 'light' : 'dark'));

  toggle.addEventListener('click', () => {
    const current = document.documentElement.getAttribute('data-theme') || 'dark';
    setTheme(current === 'dark' ? 'light' : 'dark');
  });
}

function initLangToggle() {
  const toggle = document.getElementById('lang-toggle');
  if (!toggle) return;
  toggle.addEventListener('click', () => {
    const isEn = window.location.pathname.startsWith('/en');
    window.location.href = isEn ? '/' : '/en/';
  });
}

function initOrbit() {
  const orbiters = document.querySelectorAll('.pillar-orbiter');
  const orbitRing = document.querySelector('.orbit-ring');
  if (!orbiters.length || !orbitRing) return;

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
      rotationY: -(angle * 180) / Math.PI,
    });
  });

  gsap.set(orbitRing, { rotationX: -15, rotationZ: 5, xPercent: -50, yPercent: -50 });
  gsap.set('.orbit-center', { rotationX: 15, rotationZ: -5, xPercent: -50, yPercent: -50 });

  const tl = gsap.timeline({ repeat: -1, defaults: { ease: 'none' } });
  tl.to(orbiters, { rotationY: '+=360', duration: 30 }, 0);
  orbiters.forEach((orbiter) => {
    const content = orbiter.querySelector('.pillar-content');
    tl.to(content, { rotationY: '-=360', duration: 30 }, 0);
  });
}

function initHeroNotif() {
  const notif = document.querySelector('.hero__notification');
  if (!notif) return;

  const tl = gsap.timeline({ delay: 1 });
  tl.to(notif, { opacity: 1, x: 0, scale: 1, duration: 1, ease: 'back.out(1.7)' });
  tl.to('.notif__icon svg path', { strokeDashoffset: 0, duration: 0.6, ease: 'power2.out' }, '-=0.3');

  gsap.to(notif, { y: '-=15', duration: 3, repeat: -1, yoyo: true, ease: 'sine.inOut' });
}

export function initAll() {
  initLenis();
  initMagnetic();
  initFadeUp();
  initFeaturesNav();
  initNavbar();
  initTheme();
  initLangToggle();
  initOrbit();
  initHeroNotif();
}
