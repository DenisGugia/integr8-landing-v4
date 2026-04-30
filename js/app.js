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

// Hero 3D Tilt removed as requested

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

// Marquee Animation is handled by CSS keyframes

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

// Theme Toggle Logic
const themeToggle = document.getElementById('theme-toggle');
const iconMoon = document.querySelector('.icon-moon');
const iconSun = document.querySelector('.icon-sun');

function setTheme(theme) {
  document.documentElement.setAttribute('data-theme', theme);
  localStorage.setItem('theme', theme);
  if (theme === 'light') {
    iconMoon.style.display = 'none';
    iconSun.style.display = 'block';
  } else {
    iconMoon.style.display = 'block';
    iconSun.style.display = 'none';
  }
}

// Initialize theme
const savedTheme = localStorage.getItem('theme');
const systemPrefersLight = window.matchMedia('(prefers-color-scheme: light)').matches;

if (savedTheme) {
  setTheme(savedTheme);
} else if (systemPrefersLight) {
  setTheme('light');
} else {
  setTheme('dark');
}

themeToggle.addEventListener('click', () => {
  const currentTheme = document.documentElement.getAttribute('data-theme') || 'dark';
  setTheme(currentTheme === 'dark' ? 'light' : 'dark');
});

// Language Toggle (Placeholder for future i18n)
const langToggle = document.getElementById('lang-toggle');
langToggle.addEventListener('click', () => {
  alert('Seletor de idiomas será implementado em breve para suportar EN/ES.');
});

// 3D Orbit Animation for Pillars
const orbiters = document.querySelectorAll('.pillar-orbiter');
const orbitRing = document.querySelector('.orbit-ring');

if (orbiters.length > 0 && orbitRing) {
  // Position the pillars in a circle with 3D tilts
  const numPillars = orbiters.length;
  const radiusX = window.innerWidth > 1024 ? 480 : 200; // Increased to 480 for larger orbit
  const radiusZ = window.innerWidth > 1024 ? 150 : 80;  // Creates the elliptical depth perspective
  
  orbiters.forEach((orbiter, i) => {
    const angle = (i / numPillars) * Math.PI * 2;
    // Set initial position in 3D space
    gsap.set(orbiter, {
      rotationY: (angle * 180) / Math.PI,
    });
    
    // Set the content to counter-rotate so it faces the screen
    const content = orbiter.querySelector('.pillar-content');
    gsap.set(content, {
      xPercent: -50,
      yPercent: -50,
      z: radiusX, // Push out to edge of ring
      rotationY: -(angle * 180) / Math.PI // Counter rotate
    });
  });

  // Create the continuous rotation timeline
  const orbitTl = gsap.timeline({ repeat: -1, defaults: { ease: "none" } });
  
  // Rotate the ring, tilting it slightly to look like Saturn's rings
  gsap.set(orbitRing, { rotationX: -15, rotationZ: 5, xPercent: -50, yPercent: -50 });
  
  // Counter-tilt the couple so they stay upright while inside the tilted ring
  gsap.set('.orbit-center', { rotationX: 15, rotationZ: -5, xPercent: -50, yPercent: -50 });
  
  orbitTl.to(orbiters, {
    rotationY: "+=360",
    duration: 30,
  }, 0);


  
  // Counter rotate the content to keep text readable
  orbiters.forEach(orbiter => {
    const content = orbiter.querySelector('.pillar-content');
    orbitTl.to(content, {
      rotationY: "-=360",
      duration: 30,
      duration: 30,
    }, 0);
  });
}

// Hero Notification Animation
const heroNotif = document.querySelector('.hero__notification');
if (heroNotif) {
  const notifTl = gsap.timeline({ delay: 1 });
  
  notifTl.to(heroNotif, {
    opacity: 1,
    x: 0,
    scale: 1,
    duration: 1,
    ease: "back.out(1.7)"
  });
  
  // Note: using camelCase for GSAP properties is safer in some environments
  notifTl.to('.notif__icon svg path', {
    strokeDashoffset: 0,
    duration: 0.6,
    ease: "power2.out"
  }, "-=0.3");
  
  // Continuous floating animation
  gsap.to(heroNotif, {
    y: "-=15",
    duration: 3,
    repeat: -1,
    yoyo: true,
    ease: "sine.inOut"
  });
}
