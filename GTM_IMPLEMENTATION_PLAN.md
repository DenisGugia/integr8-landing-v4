# 📊 Plano de Implementação: Google Tag Manager + Tracking de Eventos
## Integr8 Landing Page - Página de Vendas

---

## 📋 RESUMO EXECUTIVO

**Objetivo:** Adicionar rastreamento de eventos de vendas via GTM com dataLayer estruturada
**Arquivo alvo:** `index.html`
**Tempo estimado:** 20-30 min
**Dependências:** ID do GTM (será fornecido)

---

## 🎯 FASE 1: Identificar Pontos de Rastreamento

### CTAs (Call-to-Action) Identificados:

| ID | Tipo | Localização | Texto | Observação |
|---|---|---|---|---|
| 1 | Hero CTA | Linha 92 | "Começar Minha Transformação" | Link âncora para #oferta |
| 2 | Navbar CTA | Linha 70 | "Comece Agora" | Link âncora para #checkout |
| 3 | Final CTA | Linha 511 | "Começar o Protocolo" | Link âncora para #oferta |
| 4 | Checkout CTA | Linha 467 | "Quero Iniciar Meu Protocolo" | Link vazio (#) - SERÁ STRIPE |

### Seções de Rastreamento:

| Evento | Elemento | ID/Seletor | Ação |
|---|---|---|---|
| `view_pricing` | Section Oferta | `id="oferta"` | Disparar ao entrar na viewport |
| `begin_checkout` | Botão Stripe | `.offer__card .btn-primary` (linha 467) | Disparar ao clicar |
| `cta_click` | Todos os CTAs | `.btn-primary`, `a.btn-primary` | Disparar ao clicar |

---

## 🔧 FASE 2: Estrutura do GTM + dataLayer

### 2.1 - dataLayer (Antes do GTM)
**Posição:** Topo do `<head>`, antes de qualquer outro script
**Conteúdo:**
```javascript
<script>
  window.dataLayer = window.dataLayer || [];
  window.dataLayer.push({
    'page_type': 'sales_page',
    'page_title': 'Integr8 - O Método Magnético',
    'site_section': 'homepage'
  });

  // Função auxiliar para enviar eventos ao GTM
  function trackEvent(eventName, eventData) {
    window.dataLayer.push({
      'event': eventName,
      ...eventData,
      'timestamp': new Date().toISOString()
    });
  }
</script>
```

### 2.2 - Google Tag Manager Snippets

**Snippet 1 (HEAD)** - Posição: Linhas 4-5 (após meta viewport, antes de Google Fonts)
```html
<!-- Google Tag Manager -->
<script>
  (function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
  new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
  j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
  'https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
  })(window,document,'script','dataLayer','GTM-XXXXXX');
</script>
<!-- End Google Tag Manager -->
```
*⚠️ Substituir `GTM-XXXXXX` pelo ID fornecido pelo usuário*

**Snippet 2 (BODY)** - Posição: Linha 26 (imediatamente após `<body>`)
```html
<!-- Google Tag Manager (noscript) -->
<noscript>
  <iframe src="https://www.googletagmanager.com/ns.html?id=GTM-XXXXXX" height="0" width="0" style="display:none;visibility:hidden"></iframe>
</noscript>
<!-- End Google Tag Manager (noscript) -->
```
*⚠️ Substituir `GTM-XXXXXX` pelo ID fornecido pelo usuário*

---

## 🎬 FASE 3: Implementar Rastreamento de Eventos

### 3.1 - Script de Tracking (Novo arquivo ou no `app.js`)
**Arquivo:** `js/gtm-events.js`
**Posição:** Importar antes de `app.js` no final do HTML

```javascript
// ============================================
// GTM EVENT TRACKING
// ============================================

document.addEventListener('DOMContentLoaded', function() {
  
  // ✓ EVENTO 1: CTA CLICK
  // Rastreia todos os cliques em botões de CTA
  const ctaButtons = document.querySelectorAll('.btn-primary, a.btn-primary');
  
  ctaButtons.forEach(button => {
    button.addEventListener('click', function(e) {
      const buttonText = this.textContent.trim() || this.innerText.trim();
      const buttonClass = this.className;
      
      trackEvent('cta_click', {
        'button_text': buttonText,
        'button_class': buttonClass,
        'button_location': this.closest('section')?.id || 'unknown'
      });
    });
  });

  // ✓ EVENTO 2: VIEW PRICING
  // Rastreia quando o usuário vê a seção de preços
  const pricingSection = document.getElementById('oferta');
  
  if (pricingSection) {
    const observerOptions = {
      threshold: 0.5 // Disparar quando 50% da seção estiver visível
    };
    
    const observer = new IntersectionObserver(function(entries) {
      entries.forEach(entry => {
        if (entry.isIntersecting && !entry.target.dataset.priceViewTracked) {
          trackEvent('view_pricing', {
            'section': 'offer',
            'price_displayed': '$49.90 CAD/mês',
            'billing_cycle': '16 semanas'
          });
          
          // Marcar como já rastreado para não disparar novamente
          entry.target.dataset.priceViewTracked = 'true';
        }
      });
    }, observerOptions);
    
    observer.observe(pricingSection);
  }

  // ✓ EVENTO 3: BEGIN CHECKOUT
  // Rastreia cliques no botão de checkout (Stripe)
  const checkoutButton = document.querySelector('.offer__card .btn-primary');
  
  if (checkoutButton) {
    checkoutButton.addEventListener('click', function(e) {
      trackEvent('begin_checkout', {
        'product': 'Protocolo INTEGR8',
        'price': '$49.90 CAD',
        'currency': 'CAD',
        'billing_period': '16 semanas'
      });
      
      // Nota: Aqui você redirecionará para Stripe
      // setTimeout(() => { window.location.href = 'https://stripe.link/...'; }, 100);
    });
  }

  console.log('✓ GTM Events initialized successfully');
});
```

---

## 📝 FASE 4: Checklist de Implementação

### Modificações no `index.html`:

**[ ] 1. Adicionar dataLayer + função helper**
- Posição: Linha 4-5, dentro do `<head>`, logo após `<meta name="viewport">`
- Arquivo: Copiar script do **2.1**

**[ ] 2. Adicionar GTM Head Snippet**
- Posição: Linha 6, imediatamente após dataLayer
- Arquivo: Copiar script do **2.2 Snippet 1**
- ⚠️ Substituir `GTM-XXXXXX`

**[ ] 3. Adicionar GTM Body Snippet**
- Posição: Linha 26, imediatamente após `<body class="dark-theme">`
- Arquivo: Copiar script do **2.2 Snippet 2**
- ⚠️ Substituir `GTM-XXXXXX`

**[ ] 4. Criar novo arquivo `js/gtm-events.js`**
- Copiar conteúdo do **3.1**
- Salvar em `js/gtm-events.js`

**[ ] 5. Importar script de tracking**
- Adicionar antes de `<script src="js/app.js"></script>` (última linha antes de `</body>`):
```html
<script src="js/gtm-events.js"></script>
```

### Verificação Final:

**[ ] Ordem correta dos scripts:**
1. dataLayer (topo do head)
2. GTM Head Snippet (head)
3. GTM Body Snippet (logo após body)
4. gtm-events.js (antes de app.js)
5. app.js

**[ ] Validação de IDs:**
- [ ] `GTM-XXXXXX` substituído em ambas as posições (Head + Body)
- [ ] Links de checkout apontam para Stripe (será integrado depois)

**[ ] Testes:**
- [ ] Abrir DevTools → Network → verificar requisição para `googletagmanager.com`
- [ ] Abrir DevTools → Console → verificar se não há erros
- [ ] Clicar em CTAs e verificar se eventos aparecem em `window.dataLayer`

---

## 🚀 EXECUÇÃO RECOMENDADA

### Opção 1: VSCode + Edição Manual (Mais Rápido)
```
1. Abrir index.html no VSCode
2. Posicionar cursor no <head> (linha 4)
3. Adicionar dataLayer script
4. Adicionar GTM Head Snippet
5. Posicionar cursor no <body> (linha 26)
6. Adicionar GTM Body Snippet
7. Criar arquivo js/gtm-events.js com o código
8. Adicionar <script src="js/gtm-events.js"></script> antes de </body>
9. Salvar tudo (Ctrl+S)
10. Abrir no navegador e testar (F12 → Console)
```

### Opção 2: PowerShell Script (Automático)
*Será fornecido se necessário*

---

## 📌 PRÓXIMOS PASSOS

1. **Forneça o ID do GTM** (format: `GTM-XXXXXX`)
2. **Configure triggers no GTM Dashboard:**
   - Trigger: "CTA Click" → Fire on: Click - All Elements (contém classe `.btn-primary`)
   - Trigger: "View Pricing" → Fire on: Page View (quando atinge seção #oferta)
   - Trigger: "Begin Checkout" → Fire on: Click (botão de checkout)
3. **Configure tags:**
   - Tag Google Analytics 4 para cada evento acima
4. **Teste em modo Preview do GTM** antes de publicar

---

## 📊 Dados Esperados no dataLayer

Após implementação, cada evento terá esta estrutura:

```javascript
// CTA Click
{
  'event': 'cta_click',
  'button_text': 'Começar Minha Transformação',
  'button_class': 'btn-primary magnetic',
  'button_location': 'hero',
  'timestamp': '2026-05-01T10:30:45.123Z'
}

// View Pricing
{
  'event': 'view_pricing',
  'section': 'offer',
  'price_displayed': '$49.90 CAD/mês',
  'billing_cycle': '16 semanas',
  'timestamp': '2026-05-01T10:32:10.456Z'
}

// Begin Checkout
{
  'event': 'begin_checkout',
  'product': 'Protocolo INTEGR8',
  'price': '$49.90 CAD',
  'currency': 'CAD',
  'billing_period': '16 semanas',
  'timestamp': '2026-05-01T10:35:30.789Z'
}
```

---

## ⚠️ IMPORTANTE

- Não committes o arquivo `index.html` com GTM-XXXXXX. Espere pelo ID real.
- Teste em ambiente de staging antes de publicar.
- Garanta que todos os scripts estão minificados em produção.
- Configure CORS corretamente se o domínio mudar.

---

**Status:** 🟡 Aguardando ID do GTM para execução final
**Prioridade:** Alta
**Bloqueador:** ID do GTM (GTM-XXXXXX)