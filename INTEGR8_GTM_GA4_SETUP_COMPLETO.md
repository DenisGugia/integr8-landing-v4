# INTEGR8 Landing Page - GTM + GA4 Setup Completo

**Data de Implementação:** 01/05/2026  
**Status:** ✅ Implementado e Testado  
**Última Atualização:** 01/05/2026, 19:41

---

## 📋 ÍNDICE

1. [Credenciais e IDs](#credenciais-e-ids)
2. [Informações do Domínio](#informações-do-domínio)
3. [Configuração do GTM](#configuração-do-gtm)
4. [Configuração do GA4](#configuração-do-ga4)
5. [Eventos Rastreados](#eventos-rastreados)
6. [Estrutura do Projeto](#estrutura-do-projeto)
7. [Links Importantes](#links-importantes)
8. [Guias de Operação](#guias-de-operação)

---

## 🔑 Credenciais e IDs

### Google Tag Manager (GTM)

| Item | Valor |
|------|-------|
| **GTM ID** | `GTM-MBTJFZ7W` |
| **Conta** | INTEGR8-HUB |
| **Container** | integr8-landing-v4 |
| **Versão Atual** | 2 |
| **Status** | Publicado |
| **Data Publicação** | 01/05/2026, 19:41 |

### Google Analytics 4 (GA4)

| Item | Valor |
|------|-------|
| **Measurement ID** | `G-VPQ9WK05EV` |
| **Property Name** | Integr8 Landing Page |
| **Account ID** | a393343197p535554048 |
| **Stream Name** | Iintegr8-hub |
| **Stream URL** | https://www.integr8-hub.com |
| **Status** | Ativo e Rastreando |

---

## 🌐 Informações do Domínio

### Domínio Principal

| Item | Valor |
|------|-------|
| **Domínio** | `integr8-hub.com` |
| **URL Primária** | `https://www.integr8-hub.com` |
| **Registrador** | Cloudflare Registrar |
| **DNS Provider** | Cloudflare |
| **Hosting** | Netlify |
| **Status DNS** | ✅ Verificado |

### Configuração DNS

**CNAMEs Ativas:**

```
integr8-hub.com       → integr8-landing-v4.netlify.app
www.integr8-hub.com   → integr8-landing-v4.netlify.app
```

**Nameservers Cloudflare:**

```
darren.ns.cloudflare.com
diva.ns.cloudflare.com
```

### SSL/HTTPS

| Item | Valor |
|------|-------|
| **Certificado** | Let's Encrypt |
| **Status** | ✅ Válido |
| **Verificação DNS** | ✅ Bem-sucedida |
| **Protocolo** | HTTPS (Obrigatório) |

---

## 🏷️ Configuração do GTM

### Injeção GTM no Projeto Astro

**Localização:** `src/layouts/Layout.astro`

```astro
<!-- Google Tag Manager (noscript) -->
<noscript><iframe src="https://www.googletagmanager.com/ns.html?id=GTM-MBTJFZ7W"
height="0" width="0" style="display:none;visibility:hidden"></iframe></noscript>
<!-- End Google Tag Manager (noscript) -->
```

**No `<head>` da página:**

```html
<!-- Google Tag Manager -->
<script>
  window.dataLayer = window.dataLayer || [];
  function gtag(){dataLayer.push(arguments);}
  gtag('js', new Date());
  gtag('config', 'GTM-MBTJFZ7W');
</script>
<!-- End Google Tag Manager -->
```

### Eventos Implementados em `src/scripts/app.js`

**1. CTA Click**

```javascript
document.querySelectorAll('.btn-primary').forEach(btn => {
  btn.addEventListener('click', function() {
    window.dataLayer = window.dataLayer || [];
    dataLayer.push({
      'event': 'cta_click',
      'button_text': this.textContent,
      'button_class': this.className
    });
  });
});
```

**2. View Pricing**

```javascript
const observer = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting && entry.target.id === 'oferta') {
      window.dataLayer = window.dataLayer || [];
      dataLayer.push({
        'event': 'view_pricing',
        'timestamp': new Date().toISOString()
      });
    }
  });
}, { threshold: 0.5 });

const pricingSection = document.getElementById('oferta');
if (pricingSection) observer.observe(pricingSection);
```

**3. Begin Checkout**

```javascript
document.querySelectorAll('.offer__card .btn-primary').forEach(btn => {
  btn.addEventListener('click', function() {
    window.dataLayer = window.dataLayer || [];
    dataLayer.push({
      'event': 'begin_checkout',
      'offer_type': this.closest('.offer__card')?.getAttribute('data-offer-type'),
      'timestamp': new Date().toISOString()
    });
  });
});
```

### Tags GTM Publicadas

| Tag | Tipo | Trigger | Measurement ID | Status |
|-----|------|---------|-----------------|--------|
| Google Analytics evento do GA4 | GA4 Configuration | Initialization - All Pages | G-VPQ9WK05EV | ✅ Ativo |

---

## 📊 Configuração do GA4

### Fluxo de Dados (Data Stream)

| Propriedade | Valor |
|-------------|-------|
| **Nome do Fluxo** | Iintegr8-hub |
| **URL** | https://www.integr8-hub.com |
| **Código do Fluxo** | 14780233996 |
| **ID da Métrica** | G-VPQ9WK05EV |
| **Plataforma** | Web |
| **Status** | Ativo |

### Configurações Recomendadas GA4

- ✅ Enhanced Measurement ativado
- ✅ Page views rastreadas automaticamente
- ✅ Scrolls rastreados
- ✅ Outbound clicks rastreados
- ✅ Form interactions rastreadas

---

## 📡 Eventos Rastreados

### Evento 1: CTA Click

```json
{
  "event": "cta_click",
  "button_text": "Texto do botão",
  "button_class": "Classe CSS do botão"
}
```

**Seletores monitorados:** `.btn-primary`  
**Objetivo:** Rastrear cliques em botões de chamada para ação

### Evento 2: View Pricing

```json
{
  "event": "view_pricing",
  "timestamp": "2026-05-01T19:41:00Z"
}
```

**Gatilho:** IntersectionObserver quando seção `#oferta` fica 50% visível  
**Objetivo:** Rastrear quando usuário vê a seção de preços

### Evento 3: Begin Checkout

```json
{
  "event": "begin_checkout",
  "offer_type": "tipo_da_oferta",
  "timestamp": "2026-05-01T19:41:00Z"
}
```

**Seletores monitorados:** `.offer__card .btn-primary`  
**Objetivo:** Rastrear início do processo de checkout

---

## 📁 Estrutura do Projeto

```
integr8-landing-v4/
├── src/
│   ├── layouts/
│   │   └── Layout.astro          ← GTM injetado aqui
│   ├── pages/
│   │   └── index.astro
│   ├── scripts/
│   │   └── app.js                ← Eventos GTM
│   ├── sections/                 ← Componentes Astro
│   └── styles/                   ← CSS modular
├── dist/                         ← Build output (Netlify publish dir)
├── public/                       ← Assets estáticos
├── netlify.toml                  ← Configuração Netlify
├── astro.config.mjs              ← Configuração Astro
├── package.json
└── README.md
```

### Arquivos Críticos para GTM/GA4

- `src/layouts/Layout.astro` — Injeção do GTM Head/Noscript
- `src/scripts/app.js` — Eventos de rastreamento
- `netlify.toml` — Configuração de deploy

---

## 🔗 Links Importantes

### Dashboards

| Serviço | URL |
|---------|-----|
| **Site ao vivo** | https://www.integr8-hub.com |
| **GTM Dashboard** | https://tagmanager.google.com/ |
| **GA4 Dashboard** | https://analytics.google.com/ |
| **Netlify Deploy** | https://app.netlify.com/ |
| **GitHub Repo** | https://github.com/DenisGugia/integr8-landing-v4 |
| **Cloudflare DNS** | https://dash.cloudflare.com/ |

### GTM Preview Mode

Para testar tags antes de publicar:

1. Acesse: https://tagmanager.google.com/
2. Clique em seu container `GTM-MBTJFZ7W`
3. Clique em **"Preview"** (canto superior direito)
4. Cole URL: `https://www.integr8-hub.com`
5. Abra seu site em outra aba
6. Ver `dataLayer` em tempo real no console do navegador

---

## 📖 Guias de Operação

### 1. Fazer Deploy de Mudanças no Site

**Local:**

```powershell
cd C:\Users\denis\Desktop\Brain\integr8-landing-v4
git add .
git commit -m "Sua mensagem aqui"
git push origin main
```

**Netlify:** Deploy automático 1-2 min após push para `main`

### 2. Adicionar Novo Evento GTM

**Passo 1:** Adicionar listener em `src/scripts/app.js`

```javascript
document.querySelectorAll('.seu-seletor').forEach(elemento => {
  elemento.addEventListener('seu-evento', function() {
    dataLayer.push({
      'event': 'seu_evento_name',
      'propriedade1': valor1,
      'propriedade2': valor2
    });
  });
});
```

**Passo 2:** Fazer deploy (git push)

**Passo 3:** No GTM, criar nova tag GA4 com o evento

### 3. Testar Rastreamento em Tempo Real

**Google Analytics:**

1. Acesse: https://analytics.google.com/
2. Selecione propriedade `Integr8 Landing Page`
3. Vá para **"Relatórios"** → **"Tempo real"** → **"Páginas em tempo real"**
4. Acesse seu site: https://www.integr8-hub.com
5. Ver visualizações aparecendo em tempo real (2-5 segundos)

**GTM Preview:**

1. Abra: https://tagmanager.google.com/
2. Container `GTM-MBTJFZ7W` → **"Preview"**
3. Acesse seu site em outra aba
4. Na aba Preview, ver events sendo disparados em **"Tags Fired"**

### 4. Verificar Status do DNS

```powershell
nslookup www.integr8-hub.com
```

Resultado esperado:

```
Nome: integr8-landing-v4.netlify.app
Addresses: [IPs do Netlify]
```

### 5. Limpar Cache Netlify

Se o site não atualizar após push:

1. Acesse: https://app.netlify.com/
2. Clique em `integr8-landing-v4`
3. Vá para **"Deploys"**
4. Clique em **"Clear cache and retry latest deploy"**

### 6. Gerenciar Versões GTM

**Rollback para versão anterior:**

1. GTM Dashboard → **"Versões"**
2. Selecione versão anterior
3. Clique em **"Publicar"**

**Criar nova versão:**

1. Faça suas mudanças (tags, triggers, variáveis)
2. Clique em **"Enviar"** no topo
3. Preencha nome e descrição
4. Clique em **"Publicar"**

---

## 🔐 Informações de Acesso

| Serviço | Email | Status |
|---------|-------|--------|
| **Gmail** | Denis.gugia@gmail.com | Owner |
| **GTM Account** | Denis.gugia@gmail.com | Owner |
| **GA4 Account** | Denis.gugia@gmail.com | Owner |
| **Netlify** | Denis.gugia@gmail.com | Owner |
| **GitHub** | DenisGugia | Owner |
| **Cloudflare** | Denis.gugia@gmail.com | Owner |

---

## ✅ Checklist de Verificação

- [x] Domínio customizado apontando para Netlify
- [x] SSL/HTTPS ativo
- [x] GTM injetado no Layout.astro
- [x] Eventos implementados em app.js
- [x] GA4 stream criado
- [x] Tag GA4 criada e publicada no GTM
- [x] Dados chegando ao GA4 em tempo real
- [x] 3 eventos rastreando (cta_click, view_pricing, begin_checkout)
- [x] Documentação criada

---

## 🚀 Próximos Passos (Futuros)

### Sugeridos

- [ ] Criar A/B tests de headlines no GTM
- [ ] Implementar event tracking para scroll depth
- [ ] Configurar geo-redirect para BRL (Brasil)
- [ ] Adicionar lead magnet tracking
- [ ] Implementar custom events por seção
- [ ] Configurar conversão de "Gerar Lead" no GA4
- [ ] Criar dashboard customizado de análises

### Técnicos

- [ ] Adicionar Vue/React para componentes dinâmicos
- [ ] Implementar server-side tracking
- [ ] Configurar data layer mais granular
- [ ] Adicionar Google Signals
- [ ] Implementar conversion tracking via Stripe

---

## 📝 Notas Importantes

### Sobre Credenciais

**NUNCA compartilhar:**
- GTM-ID em públicos
- GA4 Measurement ID em código público
- URLs de preview do GTM

**SEMPRE usar:**
- Variáveis de ambiente para IDs sensíveis
- Controle de acesso no GTM
- Controle de acesso no GA4

### Sobre Mudanças

**Sempre fazer:**
1. Teste em modo Preview do GTM
2. Esperar 24h para GA4 processar dados
3. Documentar mudanças neste arquivo
4. Fazer backup de versões GTM antes de mudanças grandes

**Nunca fazer:**
- Publicar diretamente em produção sem teste
- Deletar versões antigas do GTM
- Compartilhar links de preview publicamente

---

## 📞 Contato e Suporte

**Conta Negócio:** +1(226)961-7351  
**Email:** Denis.gugia@gmail.com

---

**Documento criado em:** 01/05/2026  
**Última atualização:** 01/05/2026, 19:41  
**Versão:** 1.0
