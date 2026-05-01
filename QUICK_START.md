# 🚀 GTM Implementation - Quick Start Guide

## O Que Você Solicitou

```
✓ Adicionar Google Tag Manager (GTM)
✓ Implementar dataLayer
✓ Rastrear 3 eventos obrigatórios:
  - cta_click (cliques em botões)
  - view_pricing (visualização da seção de preços)
  - begin_checkout (clique no botão de checkout)
```

---

## 📦 Arquivos Criados

| Arquivo | Propósito | Localização |
|---------|-----------|-------------|
| **GTM_IMPLEMENTATION_PLAN.md** | Plano detalhado com instruções | `./.claude/` |
| **implement-gtm.ps1** | Script automático (PowerShell) | `./.claude/` |
| **QUICK_START.md** | Este arquivo (guia rápido) | `./.claude/` |

---

## ⚡ Como Executar (3 Opções)

### **OPÇÃO 1: Automático via PowerShell (RECOMENDADO)** ⭐

1. **Abra PowerShell** na pasta raiz do projeto
2. **Execute:**
   ```powershell
   .\implement-gtm.ps1
   ```
3. **Quando pedido, forneça seu GTM ID** (formato: `GTM-XXXXXX`)
   - Se ainda não tem: use um ID de teste como `GTM-TEST123456`
4. **Pronto!** Backup automático criado, arquivos injetados

**Tempo:** ~30 segundos

---

### **OPÇÃO 2: Manual via VSCode**

#### Passo 1: Adicionar dataLayer (Posição: linha 5)
Abra `index.html` e localize esta linha:
```html
<meta name="viewport" content="width=device-width, initial-scale=1.0">
```

Cole isto logo depois (antes do Google Fonts):
```html
<!-- Google Analytics Data Layer -->
<script>
  window.dataLayer = window.dataLayer || [];
  window.dataLayer.push({
    'page_type': 'sales_page',
    'page_title': 'Integr8 - O Método Magnético',
    'site_section': 'homepage'
  });

  function trackEvent(eventName, eventData) {
    window.dataLayer.push({
      'event': eventName,
      ...eventData,
      'timestamp': new Date().toISOString()
    });
  }
</script>
```

#### Passo 2: Adicionar GTM Head Snippet (Posição: linha 6)
Cole isto ANTES de `<!-- Google Fonts -->`:
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
⚠️ **Substituir `GTM-XXXXXX` pelo seu ID real**

#### Passo 3: Adicionar GTM Body Snippet (Posição: linha 26)
Localize `<body class="dark-theme">` e cole logo depois:
```html
<!-- Google Tag Manager (noscript) -->
<noscript>
  <iframe src="https://www.googletagmanager.com/ns.html?id=GTM-XXXXXX" height="0" width="0" style="display:none;visibility:hidden"></iframe>
</noscript>
<!-- End Google Tag Manager (noscript) -->
```

#### Passo 4: Criar arquivo `js/gtm-events.js`
Novo arquivo em `js/gtm-events.js` com conteúdo em **GTM_IMPLEMENTATION_PLAN.md** (Seção 3.1)

#### Passo 5: Adicionar importação
Localize `<script src="js/app.js"></script>` (final do arquivo)
Cole ANTES dela:
```html
<script src="js/gtm-events.js"></script>
```

**Tempo:** ~5 min

---

### **OPÇÃO 3: Copiar/Colar (Se preferir Ctrl+C/Ctrl+V)**

Abra `./.claude/GTM_IMPLEMENTATION_PLAN.md` e siga a **FASE 2** e **FASE 3**

**Tempo:** ~10 min

---

## 🧪 Como Testar (Após Implementação)

### Teste 1: Verificar dataLayer
1. **Abra sua página** no navegador (F5 para recarregar)
2. **Pressione F12** (DevTools)
3. **Vá à aba Console**
4. **Digite:** `window.dataLayer` e pressione Enter
5. **Deve mostrar:** Array com seus eventos

### Teste 2: Rastrear CTA Click
1. **Console aberto** (F12)
2. **Clique em qualquer botão CTA** (ex: "Começar Minha Transformação")
3. **Veja aparecer no dataLayer** um evento com:
   ```javascript
   {
     event: "cta_click",
     button_text: "Começar Minha Transformação",
     button_location: "hero",
     timestamp: "2026-05-01T..."
   }
   ```

### Teste 3: Rastrear View Pricing
1. **Scroll para a seção de Preços** (Protocolo INTEGR8)
2. **Quando a seção entra na tela**, aparece no dataLayer:
   ```javascript
   {
     event: "view_pricing",
     section: "offer",
     price_displayed: "$49.90 CAD/mês"
   }
   ```

### Teste 4: Rastrear Begin Checkout
1. **Clique no botão** "Quero Iniciar Meu Protocolo"
2. **Aparece no dataLayer:**
   ```javascript
   {
     event: "begin_checkout",
     product: "Protocolo INTEGR8",
     price: "$49.90 CAD"
   }
   ```

---

## 🔗 Próximos Passos (Após Implementação)

### 1. Configurar GTM Dashboard
- Acesse: https://tagmanager.google.com
- Criar **Triggers** para cada evento
- Criar **Tags** Google Analytics 4 para cada trigger

### 2. Configurar Triggers (No GTM)
```
Trigger 1: CTA Click
├─ Type: Click
├─ Condition: Click Classes contains "btn-primary"
└─ Fire on: All Clicks

Trigger 2: View Pricing
├─ Type: Element Visibility
├─ Element ID: "oferta"
├─ Trigger: When element becomes visible
└─ Fire on: First time only

Trigger 3: Begin Checkout
├─ Type: Click
├─ Selector: ".offer__card .btn-primary"
└─ Fire on: First time only
```

### 3. Criar Tags GA4
- Tag Type: Google Analytics: GA4 Event
- Event Name: `cta_click` / `view_pricing` / `begin_checkout`
- Measurement ID: Seu ID do GA4
- Associate com trigger correspondente

### 4. Publicar
- Modo Preview (testar antes)
- Depois Publish (para produção)

---

## ❓ Dúvidas Frequentes

### P: Onde está o ID do GTM?
**R:** No Google Tag Manager Dashboard
```
Conta > Container > Copiar ID (formato: GTM-XXXXXX)
```

### P: Posso testar sem ter o ID real?
**R:** Sim! Use um ID fictício como `GTM-TEST123456` para testes locais.

### P: Preciso editar algo depois?
**R:** Sim, quando tiver o ID real, substitua `GTM-XXXXXX` pelos snippets no `index.html`

### P: E se clicar cancel no checkout?
**R:** O evento `begin_checkout` dispara no clique. Se quiser rastrear checkout concluído, vai precisar de uma tag adicional no Stripe (webhook).

### P: Posso testar sem publicar no GTM?
**R:** Sim! Modo Preview do GTM permite testar sem afetar visitantes reais.

---

## 📊 Estrutura de Dados Esperada

Após implementação, seu `dataLayer` terá esta estrutura:

```javascript
[
  // Dados iniciais da página
  {
    page_type: 'sales_page',
    page_title: 'Integr8 - O Método Magnético',
    site_section: 'homepage'
  },
  
  // Evento: Usuário vê preços
  {
    event: 'view_pricing',
    section: 'offer',
    price_displayed: '$49.90 CAD/mês',
    billing_cycle: '16 semanas',
    timestamp: '2026-05-01T10:32:10.456Z'
  },
  
  // Evento: Usuário clica em CTA
  {
    event: 'cta_click',
    button_text: 'Começar Minha Transformação',
    button_location: 'hero',
    timestamp: '2026-05-01T10:35:30.789Z'
  },
  
  // Evento: Usuário tenta fazer checkout
  {
    event: 'begin_checkout',
    product: 'Protocolo INTEGR8',
    price: '$49.90 CAD',
    currency: 'CAD',
    billing_period: '16 semanas',
    timestamp: '2026-05-01T10:37:45.123Z'
  }
]
```

---

## 🎯 Checklist Final

- [ ] Arquivo `index.html` modificado com dataLayer
- [ ] GTM Head Snippet injetado no `<head>`
- [ ] GTM Body Snippet injetado após `<body>`
- [ ] Arquivo `js/gtm-events.js` criado
- [ ] Script de eventos importado no HTML
- [ ] Testado no navegador (F12 → Console → window.dataLayer)
- [ ] GTM ID fornecido e substituído
- [ ] Triggers configurados no GTM Dashboard
- [ ] Tags GA4 criadas para cada evento
- [ ] Publicado em Preview (test) antes de produção

---

## 📞 Suporte

Se encontrar problemas:

1. **Verificar backup:** arquivo `.backup.YYYYMMDD-HHMMSS` foi criado
2. **Validar HTML:** Use https://validator.w3.org/
3. **Verificar console:** F12 → Console → erros em vermelho
4. **GTM Preview:** Modo Preview mostra o que está sendo rastreado

---

**Status:** ✅ Pronto para implementação
**Tempo estimado:** 30 segundos (automático) ou 5-10 min (manual)
**Bloqueador:** GTM ID (fornecido por você após setup no Google)