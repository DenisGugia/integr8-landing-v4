# INTEGR8 V5 — Especificação Mobile-First

**Documento complementar ao `INTEGR8_V5_PLANO_EXECUCAO_CLAUDE_CODE.md`**
Leia os dois juntos. Este cobre o que o principal não cobre: comportamento por dispositivo, adaptações de componente, UX gestual e performance mobile.

---

## PRINCÍPIO CENTRAL

**Mobile-first não é só media query.** É uma postura de design: o comportamento mobile é a base. O desktop é o upgrade.

Todo CSS começa sem media query (= mobile). Os `@media (min-width: X)` adicionam complexidade progressivamente para telas maiores. Nenhuma adaptação mobile é "fallback" — ela é o padrão.

---

## BREAKPOINTS DO SISTEMA

```css
/* Mobile S — telas pequenas: SE, Android compacto */
/* base CSS sem media query — 320px a 374px */

/* Mobile M — maioria dos smartphones */
@media (min-width: 375px) { }

/* Mobile L — iPhones grandes, Android top */
@media (min-width: 414px) { }

/* Tablet — iPad, Android tablet */
@media (min-width: 768px) { }

/* Desktop S — laptops menores, desktop compacto */
@media (min-width: 1024px) { }

/* Desktop M — padrão de referência */
@media (min-width: 1280px) { }

/* Desktop L — telas grandes */
@media (min-width: 1440px) { }
```

**Nomenclatura usada neste documento:**

| Rótulo | Viewport | Exemplos |
|---|---|---|
| Mobile S | 320–374px | iPhone SE (1ª e 2ª gen) |
| Mobile M | 375–413px | iPhone 12 Mini, maioria Android |
| Mobile L | 414–767px | iPhone 14 Pro Max, Android XL |
| Tablet | 768–1023px | iPad, iPad Mini, Android tablet |
| Desktop S | 1024–1279px | MacBook Air 13", laptops |
| Desktop M | 1280–1439px | MacBook Pro 14", monitores padrão |
| Desktop L | 1440px+ | monitores externos, iMac |

---

## REGRAS GLOBAIS MOBILE

Aplicam em toda a página, antes de qualquer seção específica.

### Tipografia responsiva

```css
/* Escala base mobile */
body {
  font-size: 16px; /* não usar menos que isso em body */
  line-height: 1.65;
}

/* Labels e eyebrows */
.s-label {
  font-size: 10px;
  letter-spacing: 0.28em;
}

/* Títulos de seção */
.s-title {
  font-size: clamp(32px, 8vw, 48px); /* mobile */
}
@media (min-width: 1024px) {
  .s-title {
    font-size: clamp(48px, 5vw, 72px);
  }
}

/* Corpo de texto */
.s-body {
  font-size: 15px; /* mínimo em mobile — não usar 14px em texto corrido */
}
@media (min-width: 1024px) {
  .s-body {
    font-size: 16px;
  }
}
```

### Espaçamentos

```css
/* Padding lateral da página */
.container {
  padding-left: 20px;
  padding-right: 20px;
}
@media (min-width: 375px) {
  .container { padding-left: 24px; padding-right: 24px; }
}
@media (min-width: 768px) {
  .container { padding-left: 48px; padding-right: 48px; }
}
@media (min-width: 1024px) {
  .container { padding-left: 80px; padding-right: 80px; max-width: 1200px; margin: auto; }
}

/* Padding vertical das seções */
.section {
  padding-top: 72px;
  padding-bottom: 72px;
}
@media (min-width: 768px) {
  .section { padding-top: 96px; padding-bottom: 96px; }
}
@media (min-width: 1024px) {
  .section { padding-top: 120px; padding-bottom: 120px; }
}
```

### Tap targets

Todo elemento interativo deve ter área mínima de toque de 44x44px (Apple HIG) ou 48x48px (Google Material).

```css
/* Aplicar em qualquer elemento clicável */
.tap-target {
  min-height: 44px;
  min-width: 44px;
  display: flex;
  align-items: center;
  justify-content: center;
}

/* Botões — nunca menos que isso */
.btn-primary,
.btn-ghost {
  min-height: 52px;
  padding: 14px 28px;
}

/* Itens de FAQ */
.faq-q {
  min-height: 52px;
  padding: 16px 0;
}

/* Links do nav */
nav a {
  min-height: 44px;
  padding: 10px 16px;
}
```

### Desativar efeitos de performance em mobile

```css
/* Parallax — desativar em telas menores que desktop */
@media (max-width: 1023px) {
  .hero-photo,
  [data-parallax] {
    transform: none !important;
    transition: none;
  }
}

/* Animações complexas — simplificar em mobile mid/low */
@media (max-width: 767px) {
  .reveal {
    transition-duration: 0.4s; /* mais rápido que desktop (0.7s) */
  }
}

/* Reduced motion */
@media (prefers-reduced-motion: reduce) {
  *, *::before, *::after {
    animation-duration: 0.01ms !important;
    animation-iteration-count: 1 !important;
    transition-duration: 0.01ms !important;
  }
  .marquee-track { animation: none; }
  .glow-pulse { animation: none; }
  .pulse-subtle { animation: none; }
}
```

### Hover states em mobile

**Regra:** nenhum estado visual crítico pode depender exclusivamente de hover.

```css
/* Barra neon na base dos cards — desktop: aparece no hover */
@media (min-width: 1024px) {
  .card::after {
    content: '';
    position: absolute;
    bottom: 0;
    left: 0;
    width: 0;
    height: 2px;
    background: var(--neon);
    transition: width 0.4s ease;
  }
  .card:hover::after { width: 100%; }
}

/* Mobile: barra visível permanentemente com opacity reduzida */
@media (max-width: 1023px) {
  .card::after {
    content: '';
    position: absolute;
    bottom: 0;
    left: 0;
    width: 100%;
    height: 1px;
    background: var(--neon);
    opacity: 0.25;
  }
}
```

---

## NAV EM MOBILE

**Decisão:** logo à esquerda + botão CTA à direita. Sem menu hambúrguer. Sem links de navegação em mobile.

**Justificativa:** landing page não entrega navegação real. Hambúrguer cria expectativa que não pode ser satisfeita. O único destino que importa é o CTA.

**CSS do backdrop-filter com fallback (Firefox antigo não suportava):**

```css
.site-nav {
  /* Fallback opaco para browsers sem backdrop-filter */
  background: rgba(var(--dark-rgb), 0.97);
}

@supports (backdrop-filter: blur(12px)) {
  .site-nav {
    background: rgba(var(--dark-rgb), 0.7);
    backdrop-filter: blur(12px);
    -webkit-backdrop-filter: blur(12px);
  }
}
```

**Nota:** `--dark-rgb` precisa ser declarada como tripla RGB (ex: `--dark-rgb: 10, 10, 10`) para usar em `rgba()`. Adicionar essa variável ao `:root` se não existir.

**HTML do nav:**

```html
<nav class="site-nav">
  <a href="#" class="nav-logo" aria-label="INTEGR8 — início da página">INTEGR8</a>

  <!-- Mobile: apenas CTA -->
  <a href="#cta" class="btn-primary nav-cta-mobile">COMEÇAR →</a>

  <!-- Desktop: links + CTA -->
  <ul class="nav-links" aria-label="Navegação principal">
    <li><a href="#method">Método</a></li>
    <li><a href="#pillars">Pilares</a></li>
    <li><a href="#coach">Coach</a></li>
    <li><a href="#faq">FAQ</a></li>
  </ul>
  <a href="#cta" class="btn-primary nav-cta-desktop">COMEÇAR AGORA</a>

  <!-- Toggle tema e idioma — visíveis em ambos -->
  <div class="nav-controls">
    <button class="theme-toggle" aria-label="Alternar tema claro/escuro">◐</button>
    <button class="lang-toggle" aria-label="Idioma">PT</button>
  </div>
</nav>
```

```css
.nav-links { display: none; }
.nav-cta-desktop { display: none; }

@media (min-width: 1024px) {
  .nav-links { display: flex; gap: 32px; list-style: none; }
  .nav-cta-desktop { display: flex; }
  .nav-cta-mobile { display: none; }
}
```

**Comportamento do nav:**
- Altura: 64px mobile, 72px desktop
- Background: var(--dark) com backdrop-filter — ver nota de fallback abaixo
- Sticky no topo (position: fixed)
- Esconde ao scrollar para baixo (>50px), reaparece ao scrollar para cima

**JavaScript do nav hide/show (obrigatório):**

```javascript
let lastScroll = 0;
const nav = document.querySelector('.site-nav');

window.addEventListener('scroll', () => {
  const current = window.scrollY;
  if (current > lastScroll && current > 50) {
    nav.classList.add('nav-hidden');
  } else {
    nav.classList.remove('nav-hidden');
  }
  lastScroll = Math.max(0, current); // evita valor negativo em iOS overscroll
}, { passive: true });
```

```css
.site-nav {
  transition: transform 0.3s ease;
  z-index: 1000;
}
.site-nav.nav-hidden {
  transform: translateY(-100%);
}
```

---

## STICKY CTA BAR — MOBILE ONLY

**Decisão:** barra fixa no bottom, aparece após Hero sair do viewport, some quando Seção 11 (Oferta) entra no viewport.

```html
<div class="sticky-cta-bar" id="stickyCTA" aria-hidden="true">
  <a href="#cta" class="sticky-cta-link">
    <span class="sticky-cta-text">COMEÇAR MEU PROTOCOLO</span>
    <span class="sticky-cta-arrow" aria-hidden="true">→</span>
  </a>
</div>
```

```css
.sticky-cta-bar {
  display: none; /* escondido em desktop */
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  height: calc(60px + env(safe-area-inset-bottom, 0px)); /* evita corte pelo home indicator */
  background: var(--dark);
  border-top: 1px solid var(--border-neon);
  z-index: 900; /* abaixo do nav (z: 1000) */
  transform: translateY(100%);
  transition: transform 0.35s cubic-bezier(0.4, 0, 0.2, 1);
  padding-bottom: env(safe-area-inset-bottom, 0px); /* empurra o link para cima do home indicator */
}
.sticky-cta-bar.visible {
  transform: translateY(0);
}
.sticky-cta-link {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 12px;
  height: 100%;
  color: var(--neon);
  font-family: 'Barlow Condensed', sans-serif;
  font-weight: 900;
  font-size: 13px;
  letter-spacing: 0.15em;
  text-decoration: none;
}

@media (max-width: 1023px) {
  .sticky-cta-bar { display: flex; }
}
```

```javascript
// Lógica de aparição/desaparecimento
const stickyCTA = document.getElementById('stickyCTA');
const hero = document.getElementById('hero');
const oferta = document.getElementById('cta');

const stickyObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.target === hero) {
      // Aparece quando hero sai do viewport
      if (!entry.isIntersecting) {
        stickyCTA.classList.add('visible');
        stickyCTA.setAttribute('aria-hidden', 'false');
      } else {
        stickyCTA.classList.remove('visible');
        stickyCTA.setAttribute('aria-hidden', 'true');
      }
    }
    if (entry.target === oferta) {
      // Some quando a seção de oferta entra no viewport
      if (entry.isIntersecting) {
        stickyCTA.classList.remove('visible');
        stickyCTA.setAttribute('aria-hidden', 'true');
      }
    }
  });
}, { threshold: 0.1 });

stickyObserver.observe(hero);
stickyObserver.observe(oferta);

// Compensar altura da barra no scroll das seções para não cortar conteúdo
// Adicionar padding-bottom: 60px no body apenas em mobile
```

**Atenção:** a sticky bar ocupa `calc(60px + env(safe-area-inset-bottom))` do viewport. Em mobile, o conteúdo do footer não pode ficar escondido atrás dela. Adicionar `padding-bottom: calc(60px + env(safe-area-inset-bottom, 0px))` no `<body>` apenas quando a barra está visível.

**Requisito no `<meta name="viewport">`:** adicionar `viewport-fit=cover` para que `env(safe-area-inset-bottom)` funcione em iPhones com notch/Dynamic Island:
```html
<meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover">
```

---

## SEÇÃO 1 — HERO MOBILE

**Decisão:** foto como fundo full-width com overlay de texto em mobile. Grid 2 colunas em desktop. **Usar marcação HTML única que funciona em ambos.**

### HTML canônico (único para mobile e desktop)

```html
<section class="hero" id="hero">
  <!-- Foto: absolute em mobile, grid item em desktop -->
  <picture>
    <source
      media="(max-width: 767px)"
      srcset="/IMAGENS/v5/hero-mobile.webp 767w, /IMAGENS/v5/hero-mobile@2x.webp 1534w"
      sizes="100vw"
      type="image/webp">
    <source
      media="(min-width: 768px)"
      srcset="/IMAGENS/v5/hero-desktop.webp 1200w, /IMAGENS/v5/hero-desktop@2x.webp 2400w"
      sizes="50vw"
      type="image/webp">
    <img
      class="hero-bg-photo"
      src="/IMAGENS/v5/hero-desktop.webp"
      alt="Denis Gugia e parceira de treino em academia, home gym e academia de prédio"
      fetchpriority="high"
      decoding="async"
      width="1200"
      height="800">
  </picture>

  <!-- Overlay: visível em mobile, oculto em desktop -->
  <div class="hero-overlay" aria-hidden="true"></div>

  <!-- Conteúdo: sobre o overlay em mobile, coluna esquerda em desktop -->
  <div class="hero-content">
    <!-- eyebrow, headline, subheadline, stats, botões -->
  </div>
</section>
```

### CSS (mobile-first)

```css
/* Mobile: foto como background absolute */
.hero {
  position: relative;
  min-height: 100vh; /* fallback */
  min-height: 100svh;
  display: flex;
  flex-direction: column;
  justify-content: flex-end;
  overflow: hidden;
}

.hero-bg-photo {
  position: absolute;
  inset: 0;
  width: 100%;
  height: 100%;
  object-fit: cover;
  object-position: center top;
  z-index: 0;
}

.hero-overlay {
  position: absolute;
  inset: 0;
  background: linear-gradient(
    to bottom,
    rgba(0,0,0,0.1) 0%,
    rgba(0,0,0,0.2) 35%,
    rgba(0,0,0,0.75) 65%,
    rgba(0,0,0,0.90) 100%
  );
  z-index: 1;
}

.hero-content {
  position: relative;
  z-index: 2;
  padding: 0 24px 80px;
}

/* Desktop: grid 2 colunas, foto ocupa coluna direita */
@media (min-width: 1024px) {
  .hero {
    display: grid;
    grid-template-columns: 1fr 1fr;
    min-height: 100vh;
    align-items: stretch;
    /* justify-content: flex-end removido — não se aplica a grid */
  }

  .hero-bg-photo {
    position: static; /* sai do absolute, entra no flow do grid */
    inset: auto;
    width: 100%;
    height: 100%;
    object-fit: cover;
    grid-column: 2;
    grid-row: 1;
    z-index: auto;
  }

  .hero-overlay {
    display: none; /* sem overlay em desktop */
  }

  .hero-content {
    grid-column: 1;
    grid-row: 1;
    align-self: center;
    padding: 80px;
    position: static;
    z-index: auto;
  }
}
```

### Notas sobre o CSS do Hero

O hero usa `min-height: 100svh` (small viewport height) para evitar o problema do Safari mobile que inclui a barra de endereços no cálculo de `100vh`. O fallback `100vh` garante compatibilidade com browsers anteriores ao suporte de `svh` (iOS < 15.4, Chrome < 108).

O CSS correto (já incluído no bloco acima):
```css
.hero {
  min-height: 100vh;   /* fallback */
  min-height: 100svh;  /* sobrescreve em browsers modernos */
}
```

### Headline mobile
.hero-line-1 {
  font-size: clamp(36px, 9vw, 52px);
  color: var(--neon);
  -webkit-text-stroke: 0; /* sem stroke na linha cheio */
}

/* Linha 2 — outline */
.hero-line-2 {
  font-size: clamp(36px, 9vw, 52px);
  color: transparent;
  -webkit-text-stroke: 2.5px var(--neon); /* mais espesso em mobile */
}

/* Linha 3 — texto cheio */
.hero-line-3 {
  font-size: clamp(36px, 9vw, 52px);
  color: var(--text);
  -webkit-text-stroke: 0;
}

@media (min-width: 1024px) {
  .hero-line-1,
  .hero-line-2,
  .hero-line-3 {
    font-size: clamp(64px, 9vw, 110px);
  }
  .hero-line-2 {
    -webkit-text-stroke: 1.5px var(--neon); /* mais fino em desktop — tela maior, mais refinado */
  }
}
```

### Stats mobile

Em mobile, os 3 stats ficam em uma linha horizontal com scroll horizontal se necessário, ou reorganizados em 2+1.

```css
.hero-stats {
  display: flex;
  gap: 24px;
  margin-top: 24px;
  overflow-x: auto;
  scrollbar-width: none;
}
.hero-stats::-webkit-scrollbar { display: none; }

.stat-item {
  flex-shrink: 0; /* não comprime */
  min-width: 80px;
}

@media (min-width: 768px) {
  .hero-stats {
    overflow-x: visible;
    gap: 40px;
  }
}
```

### Botões mobile

Em mobile, botões empilhados em coluna. Ghost fica abaixo do primário.

```css
.hero-buttons {
  display: flex;
  flex-direction: column;
  gap: 12px;
  margin-top: 28px;
}
.hero-buttons .btn-primary,
.hero-buttons .btn-ghost {
  width: 100%;
  justify-content: center;
  min-height: 52px;
}

@media (min-width: 768px) {
  .hero-buttons {
    flex-direction: row;
    width: auto;
  }
  .hero-buttons .btn-primary,
  .hero-buttons .btn-ghost {
    width: auto;
  }
}
```

### Eyebrow mobile

```css
.eyebrow-pill {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  margin-bottom: 20px;
  font-size: 9px; /* ligeiramente menor em mobile */
  letter-spacing: 0.22em;
}
@media (min-width: 375px) {
  .eyebrow-pill { font-size: 10px; }
}
```

### Parallax

Desativado em mobile — implementado apenas via JavaScript com checagem de viewport.

```javascript
// Parallax: apenas desktop, com requestAnimationFrame para evitar jank
if (window.innerWidth >= 1024) {
  const heroPhoto = document.querySelector('.hero-bg-photo'); // cacheado fora do loop
  let ticking = false;

  window.addEventListener('scroll', () => {
    if (!ticking) {
      requestAnimationFrame(() => {
        heroPhoto.style.transform = `translateY(${window.scrollY * 0.15}px)`;
        ticking = false;
      });
      ticking = true;
    }
  }, { passive: true });
}
```

---

## SEÇÃO 2 — MARQUEE MOBILE

```css
.marquee-text {
  font-size: clamp(48px, 12vw, 80px); /* menor em mobile */
  white-space: nowrap;
}
```

Velocidade de animação: **mobile 80s, desktop 60s**. Em mobile o viewport é menor — o texto visível passa pelo frame mais rápido, então usar duration maior deixa a velocidade percebida equivalente à do desktop. Duration menor em mobile (ex: 45s) tornaria o texto mais rápido, não mais lento — o oposto do efeito desejado.

```css
.marquee-track {
  animation: marquee 80s linear infinite; /* mobile: mais lento */
}
@media (min-width: 1024px) {
  .marquee-track { animation-duration: 60s; } /* desktop: mais rápido */
}
```

---

## SEÇÃO 3 — IDENTIFICAÇÃO MOBILE

### Cards mobile

```css
/* Grid mobile: coluna única */
.problem-grid {
  display: grid;
  grid-template-columns: 1fr;
  gap: 16px;
}

@media (min-width: 768px) {
  .problem-grid {
    grid-template-columns: repeat(3, 1fr);
    gap: 24px;
  }
}
```

### Número decorativo de fundo

Em mobile, o número decorativo grande (01, 02, 03) pode ocupar o card de forma diferente. Manter, mas ajustar tamanho:

```css
.prob-card::before {
  font-size: 96px; /* desktop: 140px */
  opacity: 0.04;
  top: -20px;
  right: -10px;
}
@media (min-width: 1024px) {
  .prob-card::before { font-size: 140px; }
}
```

---

## SEÇÃO 4 — MÉTODO C.O.R.E. 8 MOBILE

### Layout mobile

```css
.method-grid {
  display: grid;
  grid-template-columns: 1fr;
  gap: 48px;
}

@media (min-width: 1024px) {
  .method-grid {
    grid-template-columns: 1fr 1fr;
    gap: 80px;
    align-items: start;
  }
}
```

**Ordem em mobile:** steps primeiro (esquerda no desktop), visual do ∞ e badge depois. O usuário lê a lógica antes de ver o símbolo.

```html
<!-- Mobile: steps primeiro, visual depois -->
<!-- Desktop: via CSS order ou grid-column -->
<div class="method-grid">
  <div class="method-steps" style="order: 1">...</div>
  <div class="method-visual" style="order: 2">...</div>
</div>
```

### Símbolo ∞ mobile

```css
.infinity-symbol {
  font-size: 120px; /* desktop: 180px */
  line-height: 1;
  text-align: center;
}
@media (min-width: 1024px) {
  .infinity-symbol { font-size: 180px; text-align: left; }
}
```

### Foto de coaching mobile

Ocultar em mobile para reduzir scroll. A foto do Denis aparece completa na Seção 8.

```css
.method-photo { display: none; }
@media (min-width: 1024px) {
  .method-photo { display: block; }
}
```

---

## SEÇÃO 5 — PILARES (8 ÁREAS) MOBILE

**Decisão:** carrossel horizontal com 2 cards visíveis por vez via CSS scroll-snap. Sem JS.

### HTML do carrossel

```html
<div class="pillars-carousel" role="region" aria-label="Os 8 pilares do protocolo">
  <div class="pillars-track">
    <div class="pillar-card">...</div>
    <div class="pillar-card">...</div>
    <!-- 8 cards no total -->
  </div>
  <!-- Dots de navegação -->
  <div class="carousel-dots" aria-hidden="true">
    <span class="dot active"></span>
    <span class="dot"></span>
    <span class="dot"></span>
    <span class="dot"></span>
  </div>
</div>
```

### CSS scroll-snap (sem JS)

```css
/* Mobile: carrossel */
.pillars-track {
  display: flex;
  gap: 16px;
  overflow-x: auto;
  scroll-snap-type: x mandatory;
  scroll-padding-left: 24px;
  padding-left: 24px;
  padding-right: 24px;
  padding-bottom: 16px; /* espaço para scrollbar se aparecer */
  scrollbar-width: none;
  -webkit-overflow-scrolling: touch;
}
.pillars-track::-webkit-scrollbar { display: none; }

.pillar-card {
  flex: 0 0 calc(50% - 8px); /* 2 cards visíveis */
  scroll-snap-align: start;
  min-height: 180px;
}

/* Mobile S: 1 card e meio visível para indicar que tem mais */
@media (max-width: 374px) {
  .pillar-card { flex: 0 0 calc(85% - 8px); }
}

/* Tablet: 3 cards visíveis */
@media (min-width: 768px) {
  .pillar-card { flex: 0 0 calc(33.333% - 12px); }
}

/* Desktop: grid estático 4x2 */
@media (min-width: 1024px) {
  .pillars-track {
    display: grid;
    grid-template-columns: repeat(4, 1fr);
    gap: 20px;
    overflow-x: visible;
    scroll-snap-type: none;
    padding: 0;
  }
  .pillar-card { flex: none; }
  .carousel-dots { display: none; }
}
```

### Dots de indicação

Os dots visuais são decorativos — não clicáveis nessa implementação CSS-only. Para dots funcionais com scroll programático, adicionar ~30 linhas de JS:

```javascript
// Atualizar dot ativo conforme posição do scroll
const track = document.querySelector('.pillars-track');
const dots = document.querySelectorAll('.carousel-dots .dot'); // .carousel-dots, não .pillar-dots

track.addEventListener('scroll', () => {
  const cardWidth = track.querySelector('.pillar-card').offsetWidth + 16;
  const cardsPerPage = 2; // 2 cards por "página" visível
  const activeIndex = Math.round(track.scrollLeft / (cardWidth * cardsPerPage));
  dots.forEach((d, i) => d.classList.toggle('active', i === activeIndex));
}, { passive: true });
```

### Indicador visual de scroll horizontal

Adicionar sombra no lado direito do carrossel para sinalizar que há mais conteúdo:

```css
.pillars-carousel {
  position: relative;
}
.pillars-carousel::after {
  content: '';
  position: absolute;
  top: 0;
  right: 0;
  width: 48px;
  height: calc(100% - 32px); /* exclui dots */
  background: linear-gradient(to left, var(--dark) 0%, transparent 100%);
  pointer-events: none;
  z-index: 1;
}
@media (min-width: 1024px) {
  .pillars-carousel::after { display: none; }
}
```

---

## SEÇÃO 6 — APP MOCKUPS MOBILE

**Decisão:** carrossel horizontal swipeable com scroll-snap. 1 phone por vez.

### HTML

```html
<div class="app-phones-carousel" role="region" aria-label="O app na prática">
  <div class="app-phones-track">

    <!-- Phone 1: centro no desktop -->
    <div class="phone-slide phone-center">
      <div class="phone-mockup">
        <img src="/IMAGENS/app-treino.webp" alt="Tela de treino do app Integr8" loading="lazy" width="220" height="440">
      </div>
      <div class="phone-caption">
        <h4 class="phone-title">Treino que evolui com você</h4>
        <p class="phone-body">Cada informação do seu treino fica registrada no app. Você sabe exatamente onde parou e por onde continuar. Sem depender da memória do que fez na semana passada.</p>
      </div>
    </div>

    <!-- Phone 2: lateral esquerda no desktop -->
    <div class="phone-slide phone-side">
      <div class="phone-mockup">
        <img src="/IMAGENS/app-nutricao.webp" alt="Tela de nutrição do app Integr8" loading="lazy" width="220" height="440">
      </div>
      <div class="phone-caption">
        <h4 class="phone-title">Comer bem sem inventar cardápio</h4>
        <p class="phone-body">Sua alimentação ajustada para o seu objetivo. Sem alimentos proibidos, sem cardápio difícil de seguir. Tudo é construído em cima do que você já come no dia a dia.</p>
      </div>
    </div>

    <!-- Phone 3: lateral direita no desktop -->
    <div class="phone-slide phone-side">
      <div class="phone-mockup">
        <img src="/IMAGENS/app-dashboard.webp" alt="Dashboard do app Integr8" loading="lazy" width="220" height="440">
      </div>
      <div class="phone-caption">
        <h4 class="phone-title">O app coleta. O coach ajusta.</h4>
        <p class="phone-body">Cada registro é uma informação para o coach entender como ajustar o seu programa. Sono, peso, fome, falta de ânimo: tudo entra na conta para você continuar avançando rumo ao seu objetivo.</p>
      </div>
    </div>

  </div>

  <!-- Dots -->
  <div class="app-dots" aria-hidden="true">
    <span class="dot active"></span>
    <span class="dot"></span>
    <span class="dot"></span>
  </div>
</div>
```

### CSS

```css
/* Mobile: 1 phone por vez, centralizado */
.app-phones-track {
  display: flex;
  overflow-x: auto;
  scroll-snap-type: x mandatory;
  gap: 24px;
  padding: 0 24px;
  scrollbar-width: none;
  -webkit-overflow-scrolling: touch;
}
.app-phones-track::-webkit-scrollbar { display: none; }

.phone-slide {
  flex: 0 0 calc(100% - 48px); /* 1 phone por vez, com margens laterais */
  scroll-snap-align: center;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 24px;
}

.phone-mockup img {
  max-width: 200px;
  border-radius: 24px;
}

.phone-caption {
  text-align: center;
  max-width: 320px;
}

/* Desktop: 3 phones lado a lado */
@media (min-width: 1024px) {
  .app-phones-track {
    overflow-x: visible;
    scroll-snap-type: none;
    justify-content: center;
    align-items: center;
    gap: 16px;
    padding: 0;
  }
  .phone-slide {
    flex: 0 0 auto;
    flex-direction: column;
  }
  .phone-side {
    opacity: 0.55;
    transform: scale(0.92);
  }
  .phone-center {
    order: 2;
  }
  /* ATENÇÃO: não usar :first-of-type/:last-of-type com classes — seleciona por tipo HTML, não por classe.
     Usar :nth-child() para reordenamento confiável. */
  .phone-slide:nth-child(2) { order: 1; } /* primeiro phone-side → coluna esquerda */
  .phone-slide:nth-child(3) { order: 3; } /* segundo phone-side → coluna direita */

  .phone-mockup img { max-width: 220px; }
  .phone-caption { text-align: left; }
  .app-dots { display: none; }
}
```

---

## SEÇÃO 7 — DIFERENCIAIS MOBILE

```css
/* Mobile: 1 coluna */
.diferenciais-grid {
  display: grid;
  grid-template-columns: 1fr;
  gap: 16px;
}

/* Tablet: 2 colunas */
@media (min-width: 768px) {
  .diferenciais-grid {
    grid-template-columns: repeat(2, 1fr);
    gap: 20px;
  }
}
```

---

## SEÇÃO 8 — COACH MOBILE

### Layout

```css
/* Mobile: foto acima, texto abaixo */
.coach-grid {
  display: grid;
  grid-template-columns: 1fr;
  gap: 32px;
}

/* Desktop: foto esquerda, texto direita */
@media (min-width: 1024px) {
  .coach-grid {
    grid-template-columns: 1fr 1fr;
    gap: 80px;
    align-items: start;
  }
}
```

### Foto mobile

```css
.coach-photo {
  width: 100%;
  max-width: 480px;
  margin: 0 auto; /* centraliza em mobile */
}

@media (min-width: 1024px) {
  .coach-photo {
    margin: 0; /* alinha à esquerda em desktop */
    max-width: none;
  }
}
```

### Badges ISSA mobile

Em mobile, os badges fazem wrap em 2 linhas organicamente:

```css
.coach-badges {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  margin-top: 24px;
}
.coach-badge {
  padding: 6px 12px;
  font-size: 9px; /* menor em mobile */
  white-space: nowrap;
}

@media (min-width: 375px) {
  .coach-badge { font-size: 10px; padding: 6px 14px; }
}
@media (min-width: 1024px) {
  .coach-badge { font-size: 11px; }
}
```

---

## SEÇÃO 9 — PARA QUEM É + OBJEÇÕES MOBILE

### Layout

```css
/* Mobile: para quem é primeiro, objeções depois (stack) */
.audience-grid {
  display: grid;
  grid-template-columns: 1fr;
  gap: 48px;
}

@media (min-width: 1024px) {
  .audience-grid {
    grid-template-columns: 1fr 1fr;
    gap: 80px;
    align-items: start;
  }
}
```

### Objeções mobile

Em mobile, as 4 objeções ficam em accordion (abrir/fechar ao tocar) em vez de exibidas todas abertas como no desktop. Isso reduz o scroll desta seção que já é longa.

```css
/* Desktop: tudo aberto — sem animação de accordion */
@media (min-width: 1024px) {
  .objection-answer {
    max-height: none;
    overflow: visible;
    opacity: 1;
    transition: none; /* evita flash de fade-in ao carregar */
    padding-bottom: 16px;
  }
  .objection-toggle { display: none; }
}

/* Mobile: accordion */
.objection-item {
  border-bottom: 1px solid var(--border);
  padding: 4px 0;
}
.objection-question {
  display: flex;
  justify-content: space-between;
  align-items: center;
  cursor: pointer;
  padding: 16px 0;
  min-height: 52px;
  font-style: italic;
  font-size: 14px;
  color: var(--muted);
  gap: 16px;
}
```

**JavaScript do accordion de objeções:**

```javascript
document.querySelectorAll('.objection-question').forEach(btn => {
  btn.setAttribute('aria-expanded', 'false'); // estado inicial
  btn.addEventListener('click', () => {
    const item = btn.closest('.objection-item');
    const isOpen = item.classList.toggle('open');
    btn.setAttribute('aria-expanded', isOpen ? 'true' : 'false');
  });
});
```

Cada `.objection-question` deve ter `aria-expanded="false"` no HTML inicial. Múltiplas objeções podem estar abertas ao mesmo tempo (diferente do FAQ, que permite apenas uma).
.objection-toggle {
  flex-shrink: 0;
  font-size: 20px;
  color: var(--neon);
  transition: transform 0.3s;
  line-height: 1;
}
.objection-item.open .objection-toggle {
  transform: rotate(45deg);
}
.objection-answer {
  max-height: 0;
  overflow: hidden;
  transition: max-height 0.4s ease, opacity 0.3s ease;
  opacity: 0;
  font-size: 15px;
  line-height: 1.7;
  color: var(--mid);
  padding-bottom: 0;
}
.objection-item.open .objection-answer {
  max-height: 400px;
  opacity: 1;
  padding-bottom: 20px;
}
```

---

## SEÇÃO 10 — PROJEÇÃO TEMPORAL MOBILE

**Decisão:** scroll-triggered por frase (cada linha aparece conforme o usuário rola).

### Tipografia e espaçamento mobile

```css
.projection-section {
  padding-top: 80px; /* desktop: 160px */
  padding-bottom: 80px;
  text-align: center;
}

@media (min-width: 1024px) {
  .projection-section { padding-top: 160px; padding-bottom: 160px; }
}

.projection-line {
  font-size: clamp(32px, 8vw, 56px); /* menor que desktop */
  line-height: 1.05;
  display: block;
  margin-bottom: 8px;
  opacity: 0; /* começa invisível */
  transform: translateY(24px);
  transition: opacity 0.8s ease, transform 0.8s ease;
}
.projection-line.visible {
  opacity: 1;
  transform: translateY(0);
}

@media (min-width: 1024px) {
  .projection-line {
    font-size: clamp(48px, 7vw, 96px);
    margin-bottom: 0;
  }
}

/* Espaço de respiração entre os dois blocos */
.projection-break {
  display: block;
  height: 32px; /* desktop: 64px */
}
@media (min-width: 1024px) {
  .projection-break { height: 64px; }
}

.projection-fineprint {
  opacity: 0;
  transition: opacity 1s ease 0.4s;
  font-size: 16px; /* um pouco maior em mobile para garantir legibilidade */
  font-style: italic;
  color: var(--mid);
  margin-top: 40px;
}
.projection-fineprint.visible {
  opacity: 0.6;
}
```

### IntersectionObserver por linha

```javascript
const projectionLines = document.querySelectorAll('.projection-line, .projection-fineprint');

const projectionObs = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('visible');
      projectionObs.unobserve(entry.target); // só anima uma vez
    }
  });
}, {
  threshold: 0.3, // linha precisa estar 30% visível
  rootMargin: '0px 0px -10% 0px' // dispara um pouco antes de sair do viewport
});

projectionLines.forEach(line => projectionObs.observe(line));

// Flag para desativar exit-intent após usuário ver essa seção
const projectionSection = document.getElementById('projection');
const projectionSectionObs = new IntersectionObserver((entries) => {
  if (entries[0].isIntersecting) {
    projectionPassed = true; // variável usada pelo exit-intent
  }
}, { threshold: 0.5 });
projectionSectionObs.observe(projectionSection);
```

---

## SEÇÃO 11 — OFERTA MOBILE

```css
/* Card sem limite de largura em mobile */
.offer-card {
  width: 100%;
  padding: 32px 24px; /* desktop: 48px */
}

@media (min-width: 768px) {
  .offer-card {
    max-width: 600px;
    margin: 0 auto;
    padding: 48px;
  }
}

/* Lista de inclusões: espaçamento menor em mobile */
.offer-includes li {
  padding: 10px 0; /* desktop: 14px */
  font-size: 14px;
  gap: 12px;
}

/* Garantia e scarcity: fonte menor */
.offer-guarantee {
  font-size: 12px;
  line-height: 1.55;
}
.offer-scarcity {
  font-size: 11px;
}
```

---

## SEÇÃO 12 — FAQ MOBILE

O FAQ já usa accordion em desktop e mobile. Apenas ajustes de espaçamento:

```css
.faq-q {
  padding: 16px 0; /* desktop: 24px */
  font-size: clamp(16px, 4vw, 20px);
}
.faq-a {
  font-size: 15px; /* não menos que isso em mobile */
  padding-bottom: 16px;
}
```

---

## SEÇÃO 13 — FOOTER MOBILE

```css
/* Mobile: stack vertical, centralizado */
.footer-inner {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 20px;
  text-align: center;
  padding: 48px 24px;
}

/* Desktop: space-between */
@media (min-width: 768px) {
  .footer-inner {
    flex-direction: row;
    justify-content: space-between;
    text-align: left;
    padding: 48px 80px;
  }
}

/* Headline final antes do footer */
.pre-footer {
  padding: 72px 24px; /* desktop: 100px */
  text-align: center;
}
.pre-footer .pre-footer-title {
  font-size: clamp(28px, 7vw, 64px);
}
```

---

## POP-UP EXIT-INTENT — MOBILE

**Decisão confirmada:** não dispara em mobile. O pop-up só aparece em viewport >= 768px.

A sticky CTA bar cumpre o mesmo papel em mobile (permanece visível durante todo o scroll).

```javascript
// NÃO redeclarar exitShown aqui. Usar o snippet canônico definido na seção do pop-up
// do PLANO_EXECUCAO.md. O código abaixo é apenas o listener — a variável já existe no escopo.
document.addEventListener('mouseleave', (e) => {
  // Garantia dupla: clientY E largura de viewport
  if (e.clientY <= 0 && window.innerWidth >= 768 && !exitShown && !projectionPassed) {
    showExitModal();
    localStorage.setItem('integr8-exit-shown', 'true');
  }
});
```

---

## ACESSIBILIDADE MOBILE

### Focus trap no modal (exit-intent)

```javascript
function trapFocus(element) {
  const focusableEls = element.querySelectorAll(
    'a[href], button:not([disabled]), textarea, input, select, [tabindex]:not([tabindex="-1"])'
  );
  const firstFocusable = focusableEls[0];
  const lastFocusable = focusableEls[focusableEls.length - 1];

  element.addEventListener('keydown', (e) => {
    if (e.key !== 'Tab') return;
    if (e.shiftKey) {
      if (document.activeElement === firstFocusable) {
        lastFocusable.focus();
        e.preventDefault();
      }
    } else {
      if (document.activeElement === lastFocusable) {
        firstFocusable.focus();
        e.preventDefault();
      }
    }
  });
}
```

### Carrosséis acessíveis

```html
<!-- Carrossel de pilares -->
<div class="pillars-carousel" 
     role="region" 
     aria-label="Os 8 pilares do protocolo — deslize para ver todos">
```

```html
<!-- Instrução de swipe para leitores de tela -->
<p class="sr-only">Use as setas do teclado para navegar entre os cards.</p>
```

### Skip link

```html
<!-- Primeiro elemento após <body> -->
<a href="#hero" class="skip-link">Pular para o conteúdo principal</a>
```

```css
.skip-link {
  position: absolute;
  top: -100%;
  left: 24px;
  background: var(--neon);
  color: var(--dark);
  padding: 12px 20px;
  font-weight: 700;
  text-decoration: none;
  z-index: 9999;
  transition: top 0.2s;
}
.skip-link:focus {
  top: 16px;
}
```

---

## PERFORMANCE MOBILE

### Imagens responsivas com srcset

```html
<!-- Hero photo -->
<picture>
  <source 
    media="(max-width: 767px)" 
    srcset="/IMAGENS/v5/hero-mobile.webp 767w,
            /IMAGENS/v5/hero-mobile@2x.webp 1534w"
    sizes="100vw"
    type="image/webp">
  <source 
    media="(min-width: 768px)" 
    srcset="/IMAGENS/v5/hero-desktop.webp 1200w,
            /IMAGENS/v5/hero-desktop@2x.webp 2400w"
    sizes="50vw"
    type="image/webp">
  <img 
    src="/IMAGENS/v5/hero-desktop.webp" 
    alt="Denis Gugia e sua parceira de treino em academia, em casa e em academia de prédio"
    fetchpriority="high"
    decoding="async"
    width="1200"
    height="800">
</picture>
```

**Tamanhos de export das imagens:**

| Asset | Mobile (1x) | Mobile (2x) | Desktop (1x) | Desktop (2x) | Formato |
|---|---|---|---|---|---|
| Hero | 767x1024px | 1534x2048px | 1200x800px | 2400x1600px | WebP |
| Coach | 480x600px | 960x1200px | 600x750px | 1200x1500px | WebP |
| App mockup | 200x400px | 400x800px | 220x440px | 440x880px | WebP |

### Preload do hero

```html
<head>
  <!-- Preload apenas da imagem hero — a mais crítica -->
  <link rel="preload" 
        as="image" 
        href="/IMAGENS/v5/hero-mobile.webp" 
        imagesrcset="/IMAGENS/v5/hero-mobile.webp 767w, /IMAGENS/v5/hero-mobile@2x.webp 1534w"
        imagesizes="100vw"
        media="(max-width: 767px)">
  <link rel="preload" 
        as="image" 
        href="/IMAGENS/v5/hero-desktop.webp"
        media="(min-width: 768px)">
</head>
```

### Lazy loading sistemático

```html
<!-- Tudo abaixo do Hero: loading="lazy" -->
<img src="..." loading="lazy" decoding="async" width="..." height="...">
```

**Regra:** sempre declarar `width` e `height` em todas as imagens. Evita layout shift (CLS) que é um dos maiores problemas de performance em mobile.

### Fontes

```html
<head>
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <!-- Carregar apenas os pesos necessários -->
  <link href="https://fonts.googleapis.com/css2?family=Barlow+Condensed:ital,wght@0,300;0,700;0,900;1,300;1,700;1,900&display=swap" rel="stylesheet">
</head>
```

### Metas de performance por dispositivo

| Métrica | Mobile (4G) | Mobile (3G) | Desktop |
|---|---|---|---|
| FCP | < 1.8s | < 3s | < 1s |
| LCP | < 2.5s | < 4s | < 1.5s |
| CLS | < 0.1 | < 0.1 | < 0.05 |
| FID / INP | < 100ms | < 200ms | < 50ms |
| Total weight | < 800KB | < 500KB | < 1.5MB |

**Como medir:** Lighthouse no Chrome DevTools com throttling "Mobile, Slow 4G". Testar sempre em modo incógnito para evitar cache distorcido.

---

## CHECKLIST DE TESTES POR DISPOSITIVO

### Dispositivos físicos prioritários (ou emulação exata)

| Dispositivo | Viewport | SO | Prioridade |
|---|---|---|---|
| iPhone SE (2ª gen) | 375x667px | iOS | Alta — menor iPhone com suporte ativo |
| iPhone 14 | 390x844px | iOS | Alta — mais vendido no público-alvo |
| iPhone 14 Pro Max | 430x932px | iOS | Média |
| Samsung Galaxy S22 | 360x780px | Android | Alta — referência Android |
| Pixel 7 | 412x915px | Android (puro) | Média |
| iPad (10ª gen) | 820x1180px | iPadOS | Média |
| MacBook Air M2 | 1280px | macOS Safari | Alta — comum no público-alvo |

### Checklist por seção em mobile

- [ ] Nav: logo visível + CTA acessível em 320px sem overflow horizontal
- [ ] Hero: foto cobre a tela inteira, texto sobre overlay legível
- [ ] Hero: headline de 3 linhas sem quebra indesejada em 320px
- [ ] Hero: botões em coluna, ambos com tap target >= 44px
- [ ] Hero: sticky CTA bar não sobrepõe nenhum conteúdo importante
- [ ] Marquee: legível, não corta palavras
- [ ] Identificação: 3 cards em coluna, sem overflow horizontal
- [ ] Método: steps legíveis, ∞ visível e centrado
- [ ] Pilares: carrossel desliza, dots atualizados, shadow de "mais conteúdo" visível
- [ ] App: carrossel de phones funciona, 1 phone centralizado por vez
- [ ] App: captions abaixo de cada phone legíveis
- [ ] Diferenciais: 1 coluna, cards com espaçamento adequado
- [ ] Coach: foto no topo, badges em wrap limpo
- [ ] Para quem é: lista com marcadores neon legível
- [ ] Objeções: accordion abre/fecha com tap, texto legível
- [ ] Projeção temporal: linhas aparecem conforme scroll, espaçamento adequado
- [ ] Oferta: card full-width, lista de inclusões sem corte
- [ ] CTA: botão full-width, garantia e scarcity legíveis em 12px
- [ ] FAQ: accordion toca facilmente, resposta anima suavemente
- [ ] Footer: stack vertical centralizado, sem overflow
- [ ] Sticky CTA: aparece após Hero, some na seção de oferta
- [ ] Exit-intent: NÃO dispara em mobile (confirmar via DevTools com UA mobile)
- [ ] Reduced motion: testar com configuração ativada no iOS/Android
- [ ] Rotação: landscape em iPhone mantém a página utilizável
- [ ] Zoom: página funciona com zoom a 150% (acessibilidade)
- [ ] Teclado virtual: ao abrir (em eventual campo de input futuro), conteúdo não fica escondido

---

## COMO USAR ESTE DOCUMENTO NO CLAUDE CODE

Envie os dois documentos juntos ao iniciar cada fase de implementação:

1. `INTEGR8_V5_PLANO_EXECUCAO_CLAUDE_CODE.md` — estrutura geral, copies, animações desktop
2. `INTEGR8_V5_MOBILE_SPEC.md` — este documento — comportamento por dispositivo

O Claude Code deve ler os dois antes de implementar qualquer seção e implementar sempre mobile-first: escrever o CSS base (sem media query) para mobile, depois adicionar `@media (min-width: X)` para desktop.

**Prompt de inicialização para o Claude Code:**

> "Leia os dois documentos: `INTEGR8_V5_PLANO_EXECUCAO_CLAUDE_CODE.md` e `INTEGR8_V5_MOBILE_SPEC.md`. Toda implementação deve seguir a abordagem mobile-first: CSS base para mobile, media queries para desktop. Para cada seção, implemente primeiro o comportamento mobile e confirme que funciona antes de adicionar o layout desktop. Comece pela Fase 1 do plano principal."
