import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import Lenis from '@studio-freight/lenis';

gsap.registerPlugin(ScrollTrigger);

// ── Smooth scroll ─────────────────────────────────────────────────────────────
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
  gsap.ticker.add((time) => { lenis.raf(time * 1000); });
  gsap.ticker.lagSmoothing(0);
}

// ── Fade-up reveals ───────────────────────────────────────────────────────────
function initFadeUp() {
  gsap.utils.toArray('.fade-up').forEach((el) => {
    gsap.to(el, {
      scrollTrigger: { trigger: el, start: 'top 88%' },
      y: 0,
      opacity: 1,
      duration: 0.9,
      delay: parseFloat(el.dataset.delay) || 0,
      ease: 'power3.out',
    });
  });
}

// ── Features sticky nav ───────────────────────────────────────────────────────
function initFeaturesNav() {
  const navItems = document.querySelectorAll('.features__nav-item');
  const cards    = document.querySelectorAll('.features__card');
  if (!navItems.length || !cards.length) return;

  // Scroll-based highlight
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

  // Click to scroll to card
  navItems.forEach((item, index) => {
    item.addEventListener('click', () => {
      if (cards[index]) {
        cards[index].scrollIntoView({ behavior: 'smooth', block: 'center' });
        navItems.forEach((nav) => nav.classList.remove('active'));
        item.classList.add('active');
      }
    });
  });
}

// ── Navbar scroll state ───────────────────────────────────────────────────────
function initNavbar() {
  const navbar = document.querySelector('.navbar');
  if (!navbar) return;
  const onScroll = () => navbar.classList.toggle('scrolled', window.scrollY > 50);
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();
}

// ── Theme toggle ──────────────────────────────────────────────────────────────
function initTheme() {
  const toggle   = document.getElementById('theme-toggle');
  const iconMoon = document.querySelector('.icon-moon');
  const iconSun  = document.querySelector('.icon-sun');
  if (!toggle) return;

  function setTheme(theme) {
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem('theme', theme);
    if (iconMoon) iconMoon.style.display = theme === 'light' ? 'none'  : 'block';
    if (iconSun)  iconSun.style.display  = theme === 'light' ? 'block' : 'none';
  }

  const saved       = localStorage.getItem('theme');
  const prefersLight = window.matchMedia('(prefers-color-scheme: light)').matches;
  setTheme(saved || (prefersLight ? 'light' : 'dark'));

  toggle.addEventListener('click', () => {
    const current = document.documentElement.getAttribute('data-theme') || 'dark';
    setTheme(current === 'dark' ? 'light' : 'dark');
  });
}

// ── Sticky CTA bar ────────────────────────────────────────────────────────────
function initStickyCTA() {
  const bar    = document.getElementById('stickyCTA');
  const hero   = document.getElementById('hero');
  const offer  = document.getElementById('oferta');
  if (!bar || !hero) return;

  const onScroll = () => {
    const heroBottom  = hero.getBoundingClientRect().bottom;
    const offerTop    = offer ? offer.getBoundingClientRect().top : Infinity;
    const shouldShow  = heroBottom < 0 && offerTop > window.innerHeight;

    bar.classList.toggle('visible', shouldShow);
    bar.setAttribute('aria-hidden', String(!shouldShow));
  };

  window.addEventListener('scroll', onScroll, { passive: true });
}

// ── GTM event tracking ────────────────────────────────────────────────────────
function initGTM() {
  window.dataLayer = window.dataLayer || [];

  // CTA clicks — covers both old .btn-primary and new .btn-v5-primary
  document.querySelectorAll('.btn-primary, .btn-v5-primary, a.btn-primary').forEach((btn) => {
    btn.addEventListener('click', function () {
      window.dataLayer.push({
        event: 'cta_click',
        button_text: this.textContent.trim(),
        button_location: this.closest('section')?.id || 'unknown',
        timestamp: new Date().toISOString(),
      });
    });
  });

  // View pricing section
  const pricingSection = document.getElementById('oferta');
  if (pricingSection) {
    new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting && !entry.target.dataset.priceViewTracked) {
          window.dataLayer.push({
            event: 'view_pricing',
            section: 'offer',
            price_displayed: '$49.90 CAD/mês',
            timestamp: new Date().toISOString(),
          });
          entry.target.dataset.priceViewTracked = 'true';
        }
      });
    }, { threshold: 0.5 }).observe(pricingSection);
  }

  // Begin checkout
  const checkoutBtn = document.querySelector('.offer__cta, .offer__card .btn-v5-primary');
  if (checkoutBtn) {
    checkoutBtn.addEventListener('click', () => {
      window.dataLayer.push({
        event: 'begin_checkout',
        product: 'Protocolo C.O.R.E. 8',
        price: '$49.90 CAD',
        currency: 'CAD',
        timestamp: new Date().toISOString(),
      });
    });
  }

  console.log('✓ GTM Events initialized');
}

// ── Boot ──────────────────────────────────────────────────────────────────────
export function initAll() {
  initLenis();
  initFadeUp();
  initFeaturesNav();
  initNavbar();
  initTheme();
  initStickyCTA();
  initGTM();
}
