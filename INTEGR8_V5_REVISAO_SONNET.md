Vou ler os dois documentos na íntegra antes de emitir qualquer julgamento.Leitura completa dos dois documentos. Vou agora emitir o relatório de revisão real — sem presupor que está correto, sem elogiar o que funciona.

---

## RELATÓRIO DE REVISÃO — PRIMEIRA PASSAGEM (Sonnet 4.6)

---

### CRÍTICOS — impedem implementação correta ou causam erro em produção

---

**C1. Contradição de deploy: Netlify vs. Vercel**
`PLANO_EXECUCAO.md`, linha 29 e linha 46.

O documento afirma que o domínio está apontado via Netlify e que o Netlify gerará deploy preview. Mas nas memórias do projeto há uma nota explícita: *"Deploy do projeto integr8-landing-v4 mudou de Netlify para Vercel. Não usar mais Netlify."*

O Claude Code vai tentar configurar preview no Netlify e vai falhar. O documento inteiro precisa substituir todas as referências a "Netlify" por "Vercel", incluindo o formato da URL de preview (que no Vercel é `v5-copy-overhaul.integr8-hub.vercel.app` ou similar, não `--integr8-hub.netlify.app`).

**Correção:** trocar linha 29, 46 e qualquer outra menção a Netlify pelo equivalente Vercel. Verificar no Vercel qual é o formato exato da URL de branch preview para esse projeto antes de documentar.

---

**C2. CSS da Seção 9 tem problema estrutural de especificidade**
`MOBILE_SPEC.md`, linhas 1007–1015.

O código CSS das objeções coloca o estado "desktop aberto" dentro de uma media query `@media (min-width: 1024px)`, com `max-height: none` e `overflow: visible`. Mas o estado mobile (accordion fechado) está sem media query — portanto é o CSS base. Isso está correto em mobile-first.

O problema está em `opacity: 1` e `max-height: none` no desktop sem considerar que o estado inicial `.objection-answer` tem `opacity: 0` e `max-height: 0` no CSS base. Em desktop, o `max-height: none` sobrescreve a transição, mas o `opacity: 1` é propriedade diferente — a especificidade dos seletores precisa garantir que em desktop a resposta nunca comece com `opacity: 0`. O CSS atual não garante isso explicitamente.

**Correção:** adicionar no bloco desktop:
```css
@media (min-width: 1024px) {
  .objection-answer {
    max-height: none;
    overflow: visible;
    opacity: 1;
    transition: none; /* desativa a transição de accordion em desktop */
    padding-bottom: 16px; /* sempre visível */
  }
  .objection-toggle { display: none; }
}
```

---

**C3. Parallax do Hero usa `scrollY` em vez de `scrollTop` — pode não funcionar**
`MOBILE_SPEC.md`, linha 536.

```javascript
photo.style.transform = `translateY(${window.scrollY * 0.15}px)`;
```

`window.scrollY` funciona na maioria dos browsers modernos, mas em alguns contextos de iframe ou quando o scroll está num elemento pai em vez do `window`, retorna 0 sempre. Mais grave: o listener está em `window.addEventListener('scroll')`, mas se o CSS do Hero tiver `overflow: hidden` no container pai, o scroll pode não ser detectado no `window`.

O documento não especifica onde o scroll acontece — no `window` ou num container. Se a página atual do projeto usa scroll num container específico (padrão em alguns templates), esse código nunca dispara.

**Correção:** adicionar verificação explícita no documento:
```javascript
// Verificar antes de implementar: o scroll da página acontece em window
// ou em um elemento container? Inspecionar o HTML atual antes de codar.
const scrollEl = document.scrollingElement || document.documentElement;
```

---

**C4. Exit-intent usa `exitShown` como valor de localStorage antes de converter para boolean**
`PLANO_EXECUCAO.md`, linha 931; `MOBILE_SPEC.md`, linha 1254.

```javascript
let exitShown = localStorage.getItem('integr8-exit-shown');
```

`localStorage.getItem` retorna a string `"true"` ou `null`. A condição `!exitShown` avalia `null` como falsy (correto) mas também avalia `""` como falsy. Se por algum motivo o valor for gravado como string vazia, o modal dispara novamente.

Mas o problema real está na variável `exitShown` declarada no plano principal e depois redeclarada no mobile spec como comportamento diferente. O plano diz `let exitShown = localStorage.getItem(...)` e usa `!exitShown` na condição. O mobile spec declara a mesma lógica mas com `exitShown = true` após disparar. Se os dois snippets forem mesclados pelo Claude Code sem perceber a duplicação, a variável pode ser sobrescrita incorretamente.

**Correção:** consolidar em um único snippet canônico no documento:
```javascript
const exitShown = localStorage.getItem('integr8-exit-shown') === 'true';
```
E remover a redeclaração no mobile spec — apontar para o snippet do plano principal.

---

**C5. Dots do carrossel de pilares apontam para seletor errado**
`MOBILE_SPEC.md`, linha 739.

```javascript
const dots = document.querySelectorAll('.pillar-dots .dot');
```

O HTML do carrossel na linha 674 usa a classe `.carousel-dots`, não `.pillar-dots`:
```html
<div class="carousel-dots" aria-hidden="true">
```

Esse seletor JS vai retornar `NodeList` vazia. Os dots nunca vão atualizar. O carrossel funciona (CSS scroll-snap é independente de JS), mas o indicador visual fica sempre no primeiro dot.

**Correção:** mudar o seletor para `.carousel-dots .dot` ou padronizar o nome da classe no HTML e JS.

---

**C6. Hero desktop mantém layout de 2 colunas mas mobile spec redefine como full-width com overlay**
`PLANO_EXECUCAO.md`, linha 278; `MOBILE_SPEC.md`, linhas 371–416.

O plano principal descreve o Hero como "Grid 2 colunas (1fr 1fr) em desktop, stack vertical em mobile". O mobile spec redefine o Hero mobile como "foto como fundo full-width com overlay de texto".

São duas estruturas HTML diferentes, não apenas CSS diferente:
- Desktop 2 colunas: `<div class="hero-col-text">` + `<div class="hero-col-image">`
- Mobile full-width overlay: `<img class="hero-photo" style="position:absolute">` + overlay + texto sobre

Você não consegue fazer a mesma marcação HTML funcionar como grid de 2 colunas no desktop E como foto de fundo absoluta no mobile sem JavaScript ou duplicação de elemento de imagem.

O documento não resolve essa contradição. O Claude Code vai ter que inventar uma solução, e dependendo da escolha, pode quebrar o desktop ou o mobile.

**Correção necessária:** definir explicitamente a marcação HTML única que funciona em ambos. A solução mais limpa:

```html
<section class="hero" id="hero">
  <img class="hero-bg-photo" src="..." alt="..."> <!-- sempre absolute, mas desktop: ocupa coluna direita via clip ou transform -->
  <div class="hero-content">...</div>
</section>
```

Com CSS:
```css
/* Mobile: foto é background absolute */
.hero { position: relative; }
.hero-bg-photo { position: absolute; inset: 0; object-fit: cover; }

/* Desktop: foto ocupa metade direita, texto metade esquerda */
@media (min-width: 1024px) {
  .hero { display: grid; grid-template-columns: 1fr 1fr; }
  .hero-bg-photo { position: static; inset: auto; width: 100%; height: 100%; object-fit: cover; }
}
```

Isso precisa estar especificado no documento antes da implementação.

---

### IMPORTANTES — causam retrabalho ou degradação de UX

---

**I1. `100svh` no Hero mobile sem fallback para browsers que não suportam `svh`**
`MOBILE_SPEC.md`, linha 373.

```css
min-height: 100svh;
```

`svh` (small viewport height) tem suporte desde iOS 15.4 e Chrome 108. Usuários com Android anterior ao Chrome 108 e iOS anterior a 15.4 não vão ter esse comportamento. O documento não inclui fallback.

**Correção:**
```css
.hero {
  min-height: 100vh; /* fallback */
  min-height: 100svh; /* browsers modernos sobrescrevem */
}
```

---

**I2. Sticky CTA bar e Nav mobile podem conflitar em z-index**
`MOBILE_SPEC.md`, linhas 300 e 271.

Nav: `z-index: 1000` (inferido do texto "abaixo do nav z: 1000").
Sticky CTA bar: `z-index: 900`.

Mas o documento não define o z-index do Nav explicitamente no CSS fornecido. O Claude Code pode definir qualquer valor. Se o Nav tiver z-index menor que 900, a sticky bar vai aparecer sobre ele quando o usuário scrolla rápido e os dois ficam visíveis simultaneamente.

**Correção:** adicionar ao documento CSS do Nav:
```css
.site-nav {
  z-index: 1000;
  position: fixed;
  top: 0;
}
```
E confirmar a hierarquia: Nav (1000) > Pop-up exit-intent (9999) > Sticky CTA (900).

Espera — o pop-up está em 9999 mas o Nav em 1000. Se o pop-up abrir, o Nav vai aparecer sobre ele em alguns browsers porque o Nav tem `position: fixed` e pode criar novo stacking context. O documento não resolve esse conflito.

**Correção adicional:** o pop-up overlay precisa ter `z-index: 9999` E o Nav precisa ter `z-index: 9998` quando o modal estiver aberto, ou o modal precisa ser filho do `<body>` fora de qualquer container com `transform` ou `filter` que criaria stacking context local.

---

**I3. Plano principal Seção 9 diz "4 objeções exibidas abertas" mas mobile spec diz "accordion"**
`PLANO_EXECUCAO.md`, linha 704; `MOBILE_SPEC.md`, linha 1004.

Contradição clara. O plano principal: *"Lista de objeções (4 itens, sem accordion — exibidos abertos)"*. O mobile spec: *"Em mobile, as 4 objeções ficam em accordion"*.

Sem contradição real de decisão (accordion em mobile é correto), mas o JS para fazer o accordion em mobile e tudo aberto no desktop precisa existir — e nenhum dos dois documentos fornece esse JS para o comportamento de toggle. O CSS está presente mas o JavaScript que adiciona/remove a classe `.open` no `.objection-item` não está especificado em nenhum dos dois documentos.

**Correção:** adicionar no documento o snippet JS do accordion de objeções:
```javascript
document.querySelectorAll('.objection-question').forEach(btn => {
  btn.addEventListener('click', () => {
    const item = btn.closest('.objection-item');
    item.classList.toggle('open');
  });
});
```

---

**I4. Carrossel de pilares: 4 dots para 8 cards com 2 por vez é matematicamente incorreto**
`MOBILE_SPEC.md`, linha 674.

O HTML declara 4 dots para 8 cards com 2 visíveis por vez. Isso sugere 4 "páginas" de 2 cards cada — matematicamente correto (8 ÷ 2 = 4). Mas o JS de atualização dos dots na linha 742 divide por 2:

```javascript
const activeIndex = Math.round(track.scrollLeft / cardWidth / 2);
```

A divisão por 2 não faz sentido aqui. O cálculo correto para saber qual "página" está visível com 2 cards por vez é:
```javascript
const cardsPerPage = 2;
const activeIndex = Math.round(track.scrollLeft / (cardWidth * cardsPerPage));
```

Como está, o dot ativo vai progredir na metade da velocidade correta — o dot 2 só vai ativar quando você estiver no card 5, não no card 3.

**Correção:** substituir o snippet do JS dos dots pelo cálculo correto acima.

---

**I5. Desktop da Seção 9: objeções sem `padding-bottom` explícito no estado aberto**
`MOBILE_SPEC.md`, linhas 1008–1015.

O CSS desktop define `padding-bottom: 0` implicitamente (sem declaração), mas o estado mobile aberto (`.objection-item.open .objection-answer`) define `padding-bottom: 20px`. Em desktop, onde o accordion está sempre "aberto", esse padding precisa existir também para o espaçamento entre objeções ser adequado.

**Correção:** adicionar `padding-bottom: 16px` no bloco desktop da `.objection-answer`.

---

**I6. `COPY_V5.md` e `ANIMACOES_V5.md` são referenciados mas não existem**
`PLANO_EXECUCAO.md`, linhas 103–104.

O plano instrui o Claude Code a criar esses dois arquivos na Fase 1. O conteúdo do `COPY_V5.md` está distribuído ao longo do plano principal (cada seção tem sua copy). Mas o documento nunca diz explicitamente ao Claude Code como montar o `COPY_V5.md` — se deve extrair as copies do próprio documento ou se você vai fornecer um arquivo separado.

Se o Claude Code tentar criar o `COPY_V5.md` a partir do plano, pode organizar diferente do que você espera e criar inconsistências.

**Correção:** ou fornecer o `COPY_V5.md` como arquivo pronto para commit, ou eliminar a instrução de criá-lo e apontar o Claude Code diretamente para as seções do plano durante a implementação. A segunda opção é mais simples.

---

**I7. Modelos citados (`claude-opus-4.6`, `claude-opus-4.7`) podem não existir**
`PLANO_EXECUCAO.md`, linha 62.

O documento menciona "Claude Opus 4.6 ou 4.7". No Claude Code, os identificadores de modelo têm formato específico (`claude-opus-4-5`, etc.). Os nomes "4.6" e "4.7" foram gerados como suposição — não há verificação de que esses são os identificadores reais disponíveis hoje.

**Correção:** verificar no Claude Code quais modelos estão disponíveis com `/model` antes de iniciar. O documento deve dizer "use o modelo Opus mais recente disponível" em vez de nomear versões específicas.

---

### MENORES — não bloqueiam, mas devem ser corrigidos

---

**m1. Copyright no footer diz `© 2025` mas o ano atual é 2026**
`PLANO_EXECUCAO.md`, linha 916.

**Correção:** `© 2026 Integr8 · Denis Gugia · Todos os direitos reservados`

---

**m2. `imagesrcset` e `imagesizes` no `<link rel="preload">` têm suporte limitado**
`MOBILE_SPEC.md`, linhas 1375–1377.

Os atributos `imagesrcset` e `imagesizes` no elemento `<link rel="preload">` têm suporte desde Chrome 73, mas Safari só adicionou suporte em versão 17 (2023). Em browsers mais antigos, o preload vai carregar sempre a imagem do `href` (desktop) mesmo em mobile.

Isso não quebra a página — é apenas um preload ineficiente em Safari antigo. Mas o documento apresenta como "o jeito certo" sem mencionar a limitação.

**Correção:** adicionar nota: *"Atenção: `imagesrcset` em `<link rel="preload">` tem suporte limitado em Safari < 17. A imagem carrega corretamente via `<picture>`, mas o preload pode não ser otimizado em iOS mais antigo."*

---

**m3. `COPY_V5.md` mencionado no prompt de inicialização do Claude Code mas não existe como arquivo**

O prompt final do documento diz ao Claude Code para ler `COPY_V5.md`, mas esse arquivo não é fornecido. O Claude Code vai reportar erro de arquivo não encontrado ou vai criar um arquivo vazio.

**Correção:** remover a referência a `COPY_V5.md` do prompt de inicialização ou criar o arquivo antes de iniciar.

---

**m4. Seção 5 (Pilares): o plano principal diz "2x4 em tablet" mas o mobile spec diz "3 cards visíveis em tablet"**
`PLANO_EXECUCAO.md`, linha 465; `MOBILE_SPEC.md`, linha 714.

Plano principal: *"4x2 em desktop, 2x4 em tablet, 1x8 em mobile"* — implica 2 colunas no tablet.
Mobile spec: *"Tablet: 3 cards visíveis"* — implica 3 colunas no tablet.

Contradição menor (ambas são defensáveis), mas o Claude Code vai ter que escolher uma. Deve estar explícito.

**Correção:** definir 3 colunas no tablet (mais generoso visualmente, evita cards muito largos em 768px).

---

**m5. Estimativas de tempo das fases não têm base declarada**
`PLANO_EXECUCAO.md`, linhas 94, 113, 143, 162, 168, 172.

"~30 min", "~1h30", "~3h", "~2h30", "~2h", "~1h" são estimativas sem base. Em sessões de Claude Code, o tempo real depende de quantos tokens por resposta, quantas idas e vindas para aprovação, e velocidade do modelo. Podem ser 3x maiores.

O problema real: se o Claude Code usa essas estimativas para planejar execução em modo autônomo, pode encerrar uma sessão prematuramente achando que "acabou o tempo" de uma fase.

**Correção:** remover as estimativas de tempo dos títulos de fase, ou substituir por "estimativa de sessões: Fase X = 1-2 sessões de Claude Code".

---

## SUMÁRIO EXECUTIVO

| Categoria | Quantidade | Mais crítico |
|---|---|---|
| Críticos | 6 | C1 (Netlify vs Vercel) e C6 (HTML hero incompatível entre mobile e desktop) |
| Importantes | 7 | I2 (z-index conflito nav/modal) e I3 (JS do accordion ausente) |
| Menores | 5 | m1 (ano 2025) e m4 (tablet grid inconsistente) |

---

## PRÓXIMOS PASSOS

**Antes de levar para o Claude Code:**

1. Corrigir C1 (Netlify → Vercel) nos dois documentos
2. Corrigir C6 (definir HTML canônico do Hero que funciona em mobile overlay e desktop grid)
3. Corrigir C5 (seletor `.pillar-dots` → `.carousel-dots`)
4. Corrigir C4 (consolidar snippet exit-intent em um único lugar)
5. Adicionar I3 (JS do accordion de objeções)
6. Corrigir I4 (cálculo dos dots do carrossel)
7. Corrigir m1 (ano do copyright)

**Para o Opus no Claude Code:**

Leve os dois documentos originais mais este relatório. Peça ao Opus para verificar independentemente se os 6 críticos procedem e para identificar problemas que esta passagem pode ter deixado passar, especialmente em:
- Conflitos de stacking context no pop-up (I2 expandido)
- Comportamento do carrossel de phones no desktop quando `phone-side:first-of-type` e `phone-side:last-of-type` usam `:first-of-type` — isso seleciona pelo tipo de elemento HTML, não pela classe. Se os três `phone-slide` forem todos `<div>`, `:first-of-type` vai selecionar o primeiro `<div>` da página inteira, não o primeiro `.phone-side`. Pode ser um bug silencioso que só aparece no browser.