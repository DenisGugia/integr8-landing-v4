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

// Custom Cursor
const cursor = document.querySelector('.cursor');
const magneticElements = document.querySelectorAll('.magnetic');

document.addEventListener('mousemove', (e) => {
  gsap.to(cursor, {
    x: e.clientX,
    y: e.clientY,
    duration: 0.1,
    ease: "power2.out"
  });
});

document.querySelectorAll('a, button').forEach(el => {
  el.addEventListener('mouseenter', () => cursor.classList.add('active'));
  el.addEventListener('mouseleave', () => cursor.classList.remove('active'));
});

// Magnetic Buttons
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
    
    // Move text inside if it has .btn-text
    const text = elem.querySelector('.btn-text');
    if(text) {
      gsap.to(text, {
        x: (x / position.width) * (strength / 2),
        y: (y / position.height) * (strength / 2),
        duration: 0.5,
        ease: "power2.out"
      });
    }
  });

  elem.addEventListener("mouseleave", function(e) {
    gsap.to(elem, {
      x: 0,
      y: 0,
      duration: 0.5,
      ease: "elastic.out(1, 0.3)"
    });
    const text = elem.querySelector('.btn-text');
    if(text) {
      gsap.to(text, {
        x: 0,
        y: 0,
        duration: 0.5,
        ease: "elastic.out(1, 0.3)"
      });
    }
  });
});

// Hero 3D Tilt
const heroVisual = document.querySelector('.hero__mockup-wrapper');
if (heroVisual) {
  document.addEventListener('mousemove', (e) => {
    const x = (window.innerWidth / 2 - e.clientX) / 25;
    const y = (window.innerHeight / 2 - e.clientY) / 25;
    
    gsap.to(heroVisual, {
      rotationY: -x,
      rotationX: y,
      duration: 1,
      ease: 'power2.out'
    });
  });
}

// Fade Up Animations
gsap.utils.toArray('.fade-up').forEach(element => {
  const delay = element.dataset.delay || 0;
  gsap.to(element, {
    scrollTrigger: {
      trigger: element,
      start: "top 85%",
    },
    y: 0,
    opacity: 1,
    duration: 1,
    delay: delay,
    ease: "power3.out"
  });
});

// Marquee Animation
const marquee = document.querySelector('.marquee__inner');
if (marquee) {
  gsap.to(marquee, {
    xPercent: -50,
    ease: "none",
    scrollTrigger: {
      trigger: ".statement",
      start: "top bottom",
      end: "bottom top",
      scrub: 1
    }
  });
}

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
  if (window.scrollY > 50) {
    navbar.classList.add('scrolled');
  } else {
    navbar.classList.remove('scrolled');
  }
});
