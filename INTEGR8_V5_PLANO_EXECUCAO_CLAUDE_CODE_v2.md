# INTEGR8 V5 — Plano de Execução para Claude Code

**Documento de orientação completa para reformulação da landing page Integr8.**
**Versão alvo:** v5-copy-overhaul
**Repositório:** `DenisGugia/integr8-landing-v4` (branch nova `v5-copy-overhaul`)
**Domínio em produção:** `www.integr8-hub.com`

---

## ÍNDICE

1. Decisão estratégica: novo repositório vs. branch nova
2. Modelo Claude a usar em cada fase
3. Arquitetura final da página (13 seções + pop-up exit-intent)
4. Plano de execução em 7 fases
5. Especificação visual completa por seção
6. Sistema de animação (escolha de stack)
7. Acessibilidade e performance
8. Checklist de aceite final

---

## 1. DECISÃO ESTRATÉGICA: REPOSITÓRIO

**Recomendação: trabalhar em branch nova no repo atual, NÃO criar repo novo.**

### Motivos

- O domínio `www.integr8-hub.com` já está apontado para `DenisGugia/integr8-landing-v4` via Vercel (deploy migrou do Netlify para Vercel)
- GTM (`GTM-MBTJFZ7W`) e GA4 (`G-VPQ9WK05EV`) já estão configurados e funcionando
- O sistema CSS atual (variáveis dark/light, idiomas PT/EN/ES, fontes Barlow, scroll reveal) representa cerca de 80% de código que continua válido
- Mudar para repo novo significa reapontar DNS, reconfigurar Vercel, possivelmente rebuildar GTM
- Branch nova gera deploy preview automático no Vercel para testar antes de subir para produção
- Branch permite rollback imediato se algo der errado

### Setup de branch

```bash
# No diretório local C:\Users\denis\Desktop\Brain\integr8-landing-v4
git checkout main
git pull origin main
git checkout -b v5-copy-overhaul
git push -u origin v5-copy-overhaul
```

A partir daí, todo trabalho do Claude Code acontece nessa branch. O Vercel gera deploy preview automaticamente ao fazer push. A URL de preview aparece no painel do Vercel e no PR do GitHub — confirme o formato exato no painel antes de usar. Quando aprovado, merge na main → deploy automático para produção.

---

## 2. MODELO CLAUDE POR FASE

A reformulação envolve 7 fases. Cada uma tem natureza diferente: algumas exigem raciocínio profundo (planejamento de arquitetura), outras exigem execução cuidadosa (escrita de HTML/CSS), outras exigem revisão crítica (acessibilidade, QA). Use o modelo certo para cada fase.

| Fase | Tarefa | Modelo recomendado | Justificativa |
|---|---|---|---|
| 1 | Setup branch + estrutura de arquivos | Claude Sonnet 4.6 | Tarefa mecânica e direta, não exige raciocínio complexo |
| 2 | Refatoração do CSS (variáveis, novos componentes) | Claude Sonnet 4.6 | Trabalho técnico bem definido, com referências claras |
| 3 | Implementação das seções 1 a 5 (Hero até Pilares) | Claude Sonnet 4.6 | Execução com plano detalhado disponível |
| 4 | Implementação das seções 6 a 9 (App até Audience) | Claude Sonnet 4.6 | Mesma natureza da fase anterior |
| 5 | Implementação da Seção 10 (Projeção Temporal) + Oferta + FAQ + Footer | Claude Sonnet 4.6 | Inclui componentes mais sensíveis (CTA principal, garantia) |
| 6 | Implementação do pop-up de exit-intent | Claude Sonnet 4.6 | Lógica JS isolada, baixa complexidade |
| 7 | Revisão final: acessibilidade, performance, responsividade, A/B test setup | Opus (modelo mais recente disponível) | Revisão crítica exige raciocínio profundo e olhar de design senior |

**Observação sobre modelos:** Sonnet 4.6 é mais econômico em tokens e suficiente para fases de execução. Opus deve ser reservado para fase 7 (revisão crítica) e para qualquer momento em que o Claude Code precise debugar algo não trivial. Não use Opus para escrever HTML repetitivo — desperdício.

---

## 3. ARQUITETURA FINAL DA PÁGINA

A página tem 13 seções verticais, na seguinte ordem:

| # | Seção | ID | Função |
|---|---|---|---|
| 1 | Hero | `#hero` | Promessa central + CTA de entrada |
| 2 | Marquee | `#marquee` | Reforço subliminar da promessa |
| 3 | Identificação | `#problem` | Por que outros planos falharam |
| 4 | Método C.O.R.E. 8 | `#method` | Como o protocolo funciona |
| 5 | Pilares (8 áreas) | `#pillars` | O que é acompanhado |
| 6 | App em uso | `#app` | A ferramenta na prática |
| 7 | Diferenciais | `#diferenciais` | Por que escolher Integr8 |
| 8 | Coach (Denis) | `#coach` | Quem está por trás |
| 9 | Para quem é + Objeções | `#audience` | Identificação final + quebra de objeções |
| 10 | Projeção Temporal | `#projection` | Pausa cinematográfica antes do CTA |
| 11 | Oferta + Garantia | `#cta` | Decisão de compra |
| 12 | FAQ | `#faq` | Resolução final de dúvidas |
| 13 | Footer + Headline final | `#footer` | Encerramento |

**Componente adicional:** Pop-up de exit-intent disparado por mouseleave na borda superior da viewport (apenas desktop), mostrando a mesma mensagem da Seção 10 + CTA + opção de fechar.

---

## 4. PLANO DE EXECUÇÃO EM 7 FASES

### FASE 1 — Setup e estrutura de arquivos (~30 min)

**Objetivo:** Preparar a branch, organizar estrutura de pastas se necessário, configurar arquivos de referência.

**Tarefas:**

1. Confirmar branch `v5-copy-overhaul` ativa
2. Verificar estrutura atual de `/IMAGENS/` e listar todos os assets visuais existentes
3. Criar pasta `/IMAGENS/v5/` para receber novos assets gerados (foto hero nova, fotos coach, mockups app)
4. Criar arquivo `COPY_V5.md` na raiz do projeto contendo todas as copies finais (servirá como fonte única de verdade durante implementação)
5. Criar arquivo `ANIMACOES_V5.md` documentando cada efeito de animação esperado por seção
6. Verificar se o arquivo principal continua sendo `integr8-landing-rebuild.html` ou se há outro nome ativo na produção

**Comando para o Claude Code:**

> "Estamos na branch `v5-copy-overhaul`. Antes de qualquer modificação no HTML, faça um inventário completo de: (a) estrutura atual de pastas, (b) todos os arquivos HTML existentes e qual deles é o ativo em produção via Vercel, (c) todos os assets dentro de `/IMAGENS/`, (d) qual é o arquivo principal que recebe deploy. Devolva esse inventário antes de qualquer outra ação."

---

### FASE 2 — Refatoração do CSS (~1h30)

**Objetivo:** Atualizar variáveis CSS, eliminar estilos não utilizados, adicionar novas classes necessárias para a Seção 10 e pop-up.

**Tarefas:**

1. **Atualizar `<title>` da página:** de `INTEGR8 — Protocolo 16 Semanas` para `INTEGR8 — Protocolo C.O.R.E. 8`
2. **Atualizar `<meta description>`:** remover menção a 16 semanas, descrever protocolo adaptativo
3. **Atualizar variável `--eyebrowText` no JS:** trocar referência de "16-Week Protocol" para "Protocolo C.O.R.E. 8" nos 3 idiomas
4. **Adicionar novas classes CSS:**
   - `.projection-section` — estilos da Seção 10 (full-width, padding generoso, fundo dark sólido)
   - `.projection-line` — cada linha do bloco principal
   - `.projection-fineprint` — última linha em italic, 18px, opacity 0.6
   - `.exit-modal-overlay` — backdrop do pop-up
   - `.exit-modal-box` — caixa central do pop-up
   - `.exit-modal-eyebrow` — texto pequeno em neon
   - `.exit-modal-headline` — frase central
   - `.exit-modal-actions` — container dos 2 botões
5. **Adicionar novos keyframes CSS:**
   - `@keyframes pulseSubtle` — pulse leve no botão CTA principal (scale 1 → 1.02 → 1, loop 4s)
   - `@keyframes fadeUpSlow` — fadeUp mais lento para Seção 10 (1.2s em vez de 0.7s) — efeito cinematográfico
6. **Eliminar referências a "16 semanas" em todo o CSS:** classe `.week-badge` deve continuar existindo mas o texto interno será "PROTOCOLO C.O.R.E. 8" em vez de "16 semanas · 2 macrociclos"
7. **Garantir que prefers-reduced-motion seja respeitado:** adicionar bloco `@media (prefers-reduced-motion: reduce)` que neutraliza animações para usuários com essa preferência ativada

**Comando para o Claude Code:**

> "Aplique as 7 atualizações de CSS listadas no plano. Não toque em HTML ainda. Após terminar, mostre o diff do arquivo CSS para revisão."

---

### FASE 3 — Implementação das Seções 1 a 5 (~3h)

**Objetivo:** Implementar Hero, Marquee, Identificação, Método C.O.R.E. 8 e Pilares.

**Por seção, o Claude Code deve:**
1. Ler a especificação visual da seção correspondente neste documento
2. Aplicar a copy correspondente do arquivo `COPY_V5.md`
3. Implementar HTML na branch
4. Adicionar/ajustar estilos CSS necessários
5. Aplicar animações conforme especificação
6. Testar no Netlify preview
7. Pedir aprovação antes de avançar para próxima seção

**Comando para o Claude Code:**

> "Implemente as seções 1 a 5 da página, uma de cada vez. Para cada seção, siga rigorosamente a especificação visual e a copy fornecidas. Após implementar cada seção, mostre o resultado no preview e aguarde aprovação antes de avançar para a próxima. Não trabalhe em modo paralelo — uma seção por vez."

---

### FASE 4 — Implementação das Seções 6 a 9 (~2h30)

**Objetivo:** Implementar App mockups, Diferenciais, Coach e Audience+Objeções.

**Mesma metodologia da Fase 3.**

**Comando para o Claude Code:**

> "Continue da seção 6 até a 9, uma por vez, com aprovação entre cada. Mesmo método da fase anterior."

---

### FASE 5 — Implementação das Seções 10 a 13 (~2h)

**Objetivo:** Implementar Projeção Temporal (NOVA), Oferta+Garantia, FAQ, Footer com headline final.

**Atenção especial à Seção 10:** é uma seção nova que não existe no HTML atual. Vai exigir criação de bloco completo.

**Atenção especial à Oferta:** atualizar lista de inclusões removendo "vídeo de execução" e "16 semanas", inserir bloco de garantia abaixo do CTA, ajustar headline.

**Comando para o Claude Code:**

> "Seções 10, 11, 12 e 13. Atenção redobrada na 10 (criação do zero) e na 11 (atualização sensível do CTA principal). Aprovação entre cada."

---

### FASE 6 — Pop-up de exit-intent (~1h)

**Objetivo:** Implementar o componente de saída.

**Especificação técnica:**

- Trigger: `document.addEventListener('mouseleave', handler)` com checagem `e.clientY <= 0`
- Disparar uma vez por sessão, controle via `localStorage.setItem('integr8-exit-shown', 'true')`
- Não disparar se usuário já passou pela Seção 10 (verificar via IntersectionObserver flag)
- Não disparar em mobile (sem mouseleave equivalente confiável)
- Animar entrada: backdrop com fadeIn 0.3s, box com scale 0.92 → 1 em 0.4s ease-out
- Fechar via: clique no botão "Continuar lendo", clique no backdrop, ou tecla Esc
- Se clicar em "COMEÇAR MEU PROTOCOLO →", scroll suave até `#cta`

**Comando para o Claude Code:**

> "Implemente o pop-up de exit-intent conforme especificação técnica do plano. Inclua todos os triggers, controles de sessão, animações de entrada/saída e acessibilidade (foco no botão primário ao abrir, ESC para fechar, aria-modal=true)."

---

### FASE 7 — Revisão final (~2h, USAR CLAUDE OPUS)

**Objetivo:** Auditoria completa antes do merge na main.

**Checklist:**

#### Acessibilidade

- [ ] Todos os botões têm `aria-label` descritivo quando o texto visível não é suficiente
- [ ] Contrast ratio mínimo 4.5:1 para texto normal, 3:1 para texto large no dark mode E light mode
- [ ] Foco visível em todos os elementos interativos (sem `outline: none` sem alternativa)
- [ ] Pop-up exit-intent é acessível por teclado (Tab navega entre botões, Esc fecha)
- [ ] FAQ accordion é navegável por teclado e tem `aria-expanded` correto
- [ ] Marquee não causa problema para leitores de tela (usar `aria-hidden` se for puramente decorativo)
- [ ] `prefers-reduced-motion` desativa animações intensas
- [ ] Imagens com `alt` text descritivo
- [ ] Hierarquia de headings respeitada (h1 único, h2 para seções, h3 para subseções)

#### Performance

- [ ] Imagens em WebP com fallback JPG quando suporte for crítico
- [ ] Imagens com `loading="lazy"` exceto Hero
- [ ] Imagens do Hero com `fetchpriority="high"`
- [ ] CSS crítico inline no `<head>` se Lighthouse acusar render-blocking
- [ ] Fontes Barlow com `font-display: swap`
- [ ] JS inline no final do `<body>` (já está)
- [ ] Lighthouse score mínimo: Performance 85, Accessibility 95, Best Practices 95, SEO 95

#### Responsividade

- [ ] Testar em viewports: 360px (mobile pequeno), 414px (mobile médio), 768px (tablet), 1024px (desktop pequeno), 1440px (desktop padrão), 1920px (desktop grande)
- [ ] Hero não quebra com a tipografia gigante em mobile (clamp já cuida, mas confirmar)
- [ ] Pop-up exit-intent não dispara em mobile
- [ ] Marquee continua legível em mobile
- [ ] Grid de 8 pilares vira coluna única em mobile pequeno (já configurado, validar)
- [ ] Foto Hero (3 cenários) mantém o casal nítido mesmo em viewport pequeno

#### Cross-browser

- [ ] Chrome, Firefox, Safari, Edge — desktop e mobile
- [ ] Validar que `backdrop-filter` no nav tem fallback para Firefox antigo
- [ ] Validar que `clamp()` na tipografia não quebra em browsers antigos (já tem fallback no projeto)

#### Analytics

- [ ] GTM `GTM-MBTJFZ7W` continua presente no `<head>` e `<body>`
- [ ] Eventos personalizados disparados nos pontos certos:
  - Click no CTA Hero (primário e ghost)
  - Click no CTA da Seção 11 (Oferta)
  - Click no CTA do Footer
  - Abertura do pop-up exit-intent
  - Click no CTA do pop-up
  - Scroll depth: 25%, 50%, 75%, 100%
  - Tempo na página: 30s, 60s, 120s

#### A/B Test setup (preparação)

- [ ] Headline Hero está estruturada em variável CSS / classe que permite swap fácil para teste A/B futuro
- [ ] Texto do Marquee está em variável que permite swap

**Comando para o Claude Code (com Opus):**

> "Execute a auditoria final completa conforme checklist da Fase 7. Para cada item, indique status (passou / falhou / não testado) e ação necessária. Quando tudo estiver verde, prepare PR description detalhada para merge na main."

---

## 5. ESPECIFICAÇÃO VISUAL COMPLETA POR SEÇÃO

### SEÇÃO 1 — HERO

**Layout:** Grid 2 colunas (1fr 1fr) em desktop, stack vertical em mobile. Min-height 100vh.

**Elementos da coluna esquerda (de cima para baixo):**

1. **Eyebrow pill**
   - Texto: `Denis Gugia · Protocolo C.O.R.E. 8`
   - Estilo: pill com border neon-dim, background neon-dim, padding 8px 16px, font-size 10px, letter-spacing 0.25em, uppercase, color neon
   - Dot pulse à esquerda (já implementado)
   - Animação de entrada: fadeUp delay 0.1s

2. **Headline principal**
   - 3 linhas com tratamentos tipográficos diferentes:
     - Linha 1 (texto neon): `VOCÊ NÃO PRECISA DE MAIS TEMPO.`
     - Linha 2 (outline com `-webkit-text-stroke`): `PRECISA DE UM PLANO`
     - Linha 3 (texto cheio var(--text)): `QUE CAIBA NO QUE VOCÊ TEM.`
   - Font: Barlow Condensed Black Italic, clamp(64px, 9vw, 110px), line-height 0.92
   - Animação: fadeUp delay 0.25s

3. **Subheadline**
   - `Um protocolo montado para a sua rotina real, o seu equipamento disponível e o tempo que você tem. Com ajuste contínuo baseado na sua realidade, não em suposições.`
   - Font: Barlow Light 17px, line-height 1.75, max-width 460px, color var(--mid)
   - Animação: fadeUp delay 0.4s

4. **Stats (3 blocos horizontais)**
   - Manter os 3 blocos que já existem no HTML atual (números + label)
   - Animação: fadeUp delay 0.5s

5. **Botões (2)**
   - Primário (neon): `COMEÇAR MEU PROTOCOLO →`
   - Ghost (border sutil): `VER COMO FUNCIONA`
   - Animação: fadeUp delay 0.6s

**Coluna direita:**

- Foto do casal com 3 cenários atrás (especificação detalhada no JSON do diretor de foto, já fornecido em conversa anterior)
- Filtro: drop-shadow neon sutil (já implementado)
- Glow radial neon abaixo do casal (já implementado)
- Animação: fadeIn delay 0.3s
- **Animação adicional:** parallax sutil no scroll. Implementar via IntersectionObserver + `transform: translateY(${scrollY * 0.15}px)` para que a foto se mova mais devagar que o scroll, criando profundidade

**Hero fade-bottom:** gradient 140px do bottom para cima, transitando para a cor da próxima seção (já implementado)

---

### SEÇÃO 2 — MARQUEE

**Layout:** Faixa horizontal full-width, altura ~120px.

**Conteúdo:**
- Texto repetido em loop: `Treino bom é o treino que você consegue fazer.` separado por pontos médios `·`
- Font: Barlow Condensed Black Italic, ~80px, line-height 1, letter-spacing -0.01em
- Cor: var(--text) com var(--neon) destacando uma palavra-chave por iteração (sugestão: "Treino bom" em neon)

**Animação:**
- CSS `@keyframes marquee` com `transform: translateX(-50%)` em loop infinito
- Velocidade: 60s por ciclo completo (lento o suficiente para ler)
- Duplicar o conteúdo para que o loop seja contínuo sem gap visível
- Pausar no hover (`animation-play-state: paused`)

**Acessibilidade:**
- `aria-hidden="true"` no contêiner do marquee (decorativo)
- Respeitar `prefers-reduced-motion`: parar a animação

---

### SEÇÃO 3 — IDENTIFICAÇÃO (Problem)

**Layout:** Container 1200px. Padding vertical 100px.

**Cabeçalho da seção (centralizado à esquerda):**

1. **Eyebrow**: `O QUE NÃO ESTÁ FUNCIONANDO`
   - Estilo `.s-label` (já existe): font-size 10px, letter-spacing 0.3em, uppercase, color neon

2. **Headline**:
   ```
   PORQUE PLANOS GENÉRICOS NÃO SOBREVIVEM
   A ROTINAS REAIS.
   ```
   - Estilo `.s-title`: Barlow Condensed Black Italic, clamp(38px, 5vw, 64px), line-height 0.92
   - Sugestão de tratamento: "PLANOS GENÉRICOS" em outline, "ROTINAS REAIS" em neon

3. **Divider neon**: 48px linha horizontal var(--neon), 2px (já existe)

4. **Subheadline**:
   `Quando a rotina aperta, é normal priorizar o urgente e deixar o treino de lado. Isso não é falta de foco. É ser um adulto com responsabilidades. O problema começa quando o plano te obriga a escolher entre a sua vida e a sua saúde. Se ele te força a essa escolha, nasceu errado.`
   - Estilo `.s-body`: 16px, max-width 560px, color var(--mid)

**Grid de 3 cards (abaixo do cabeçalho):**

- Grid 3 colunas em desktop, 1 coluna em mobile
- Margem-top: 64px do cabeçalho
- Cada card:
  - Background var(--prob-card-bg)
  - Padding 40px 32px
  - Número grande de fundo no canto superior direito (data-n="01" etc, já implementado)
  - Título h3: Barlow Condensed Bold 22px uppercase
  - Texto p: 14px, color var(--muted), line-height 1.75
  - Hover: barra neon na base cresce de 0% para 100% em 0.4s

**Cards:**

1. **O plano não sobrevive à sua vida** — `Foi feito para uma rotina que você não tem. Aí surge um trabalho imprevisto, uma semana com os filhos, uma viagem. O plano vai pelo ralo e você fica achando que falhou. Quem falhou foi o plano.`

2. **Sem dados, sem direção** — `Sem registro do que você fez, sem como saber se está progredindo. Quando o resultado demora a aparecer, vem a sensação de que não funciona e você desiste. Mesmo quando o caminho estava certo. O problema não foi você. Foi tentar acertar sem saber onde estava errando.`

3. **Força de vontade não sustenta** — `Você tentou só na base da disciplina. Mas força de vontade acaba quando o dia foi pesado. Quando você decide o que comer com fome, cansaço e pressa, a escolha já está perdida antes de você abrir a geladeira.`

**Animações:**
- Cabeçalho: fadeUp ao entrar viewport
- Cards: stagger reveal (delay 0.1s entre cada card)
- Hover dos cards: barra neon na base + leve brightness up

---

### SEÇÃO 4 — MÉTODO C.O.R.E. 8

**Layout:** Container 1200px. Grid 2 colunas (1fr 1fr) em desktop, gap 80px. Stack vertical em mobile.

**Coluna esquerda — texto + steps:**

1. **Eyebrow**: `O Protocolo C.O.R.E. 8`

2. **Headline**:
   ```
   A ESTRUTURA
   POR TRÁS DO RESULTADO.
   ```
   Sugestão: "A ESTRUTURA" em outline, "RESULTADO" em neon

3. **Divider neon**

4. **Subheadline**:
   `A maioria dos planos até funciona no começo. Você até vê alguma mudança. Mas aí a vida acontece, a rotina aperta, e o plano não dá conta. O Protocolo C.O.R.E. 8 olha para o que importa para você: ter mais energia, dormir melhor, se sentir bem no próprio corpo. Suas informações e o seu objetivo são analisados pelo coach. O programa é desenhado em cima da sua realidade.`

5. **4 Steps (margin-top 48px):**

   Cada step:
   - Layout: flex horizontal, gap 24px
   - Número à esquerda: Barlow Condensed Black 40px em neon
   - Texto à direita: h4 (Barlow Condensed Bold 18px uppercase) + p (14px, color muted, line-height 1.7)
   - Border-bottom 1px sutil entre steps
   - Hover: padding-left 8px (efeito de "abrir")

   **Step 01 — Entendemos a sua rotina real**
   `Rotina, objetivo, histórico, limitações, equipamento e dias possíveis de treino. O programa é montado para a sua vida, não para uma versão idealizada dela.`

   **Step 02 — Plano que se ajusta quando a vida aperta**
   `A semana foi pesada? O plano da próxima já sai ajustado. Sem recomeçar do zero. Sem culpa. Sem ter que fingir que é segunda-feira de novo na quarta.`

   **Step 03 — Acompanhamento das 8 áreas**
   `Treino, sono, alimentação, hidratação, movimento, peso, medidas e fotos. São coisas que já fazem parte do seu dia. A diferença é que aqui elas são acompanhadas, e o coach consegue ver onde está o ponto de ajuste para você continuar avançando.`

   **Step 04 — Planejamento com ciclos definidos**
   `O programa é estruturado em ciclos com começo, meio e fim claros. No final de cada ciclo, você sabe exatamente onde está e o que faz sentido para o próximo passo. Sem virar cobaia de programa eterno.`

**Coluna direita — visual:**

1. **Símbolo infinito ∞**
   - Wrap 300px x 200px
   - Font Barlow Condensed Black 180px
   - Color transparent com `-webkit-text-stroke: 2px var(--neon)`
   - Filter: drop-shadow var(--neon-glow)
   - Animação: keyframe `glow-pulse` 3s loop (já implementado)

2. **Badge abaixo**
   - Background var(--card)
   - Border 1px var(--border-neon)
   - Padding 20px 40px
   - Texto: `PROTOCOLO C.O.R.E. 8` (em vez do badge "16 semanas · 2 macrociclos")
   - Font: Barlow Condensed Black 24px em neon, letter-spacing 0.05em

3. **Foto coaching (opcional)**
   - Max-width 340px
   - Border 1px var(--border)
   - Sem border-radius (manter linha brutal/editorial)

**Animações:**
- Coluna esquerda: fadeUp ao entrar viewport
- Steps: stagger reveal
- Coluna direita: fadeUp delay 0.2s
- ∞: glow-pulse contínuo (já implementado)

---

### SEÇÃO 5 — PILARES (8 áreas)

**Layout:** Container 1200px. Cabeçalho centralizado à esquerda + grid 4 colunas (4x2 em desktop, 2x4 em tablet, 1x8 em mobile).

**Cabeçalho:**

1. **Eyebrow**: `As 8 áreas`

2. **Headline**:
   ```
   8 ÁREAS ACOMPANHADAS.
   RESULTADO QUE VAI ALÉM DA BALANÇA.
   ```
   Sugestão: "8 ÁREAS" em neon, "BALANÇA" em outline

3. **Divider neon**

4. **Subheadline**:
   `A maior parte dessas áreas já faz parte do seu dia. Você já dorme, já come, já se movimenta. A diferença aqui é que essas coisas passam a ser acompanhadas, e o coach mostra para você como cada uma está evoluindo. Resultado deixa de ser só "quanto a balança marcou" e passa a ser quanta energia você tem, como o sono melhorou, como a roupa está caindo.`

**Grid 4x2 (8 cards):**

Cada card:
- Background var(--pillar-bg)
- Padding 32px 24px
- Position relative, overflow hidden
- Hover: background var(--pillar-hover) + barra neon na base + ícone glow up

**Estrutura de cada card:**
- Ícone SVG no topo (44x44px, padding 10px, background neon-dim, border 1px neon, border-radius 10px)
- Título h4: Barlow Condensed Bold 16px uppercase, letter-spacing 0.05em
- Texto p: 13px, color var(--muted), line-height 1.65

**Os 8 cards:**

1. **Treino personalizado**
   - Ícone SVG: dumbbell (já existe no HTML, manter)
   - `Montado para o seu equipamento, tempo disponível e objetivo. Você abre o app e o treino do dia já está lá. Sem ter que decidir nada na hora.`

2. **Alimentação que cabe na sua vida**
   - Ícone SVG: prato com talheres ou maçã (escolher um adequado)
   - `Calorias e macros ajustados para o seu objetivo. Sem alimentos proibidos, sem cardápio difícil de seguir. A alimentação é construída em cima do que você já come no dia a dia.`

3. **Sono acompanhado**
   - Ícone SVG: lua / Z
   - `Você já dorme. Aqui o sono passa a ser um indicador. Quando a noite foi ruim, isso entra na conta para o coach ajustar o seu programa.`

4. **Hidratação**
   - Ícone SVG: gota de água
   - `Quanta água você bebe ao longo do dia. Parece pequeno, mas pesa direto na disposição, na fome e na recuperação do treino.`

5. **Movimento do dia**
   - Ícone SVG: pegadas / passos
   - `Quantos passos você dá fora do treino. É o que diferencia uma pessoa que treina 1h e fica sentada o resto do dia de uma pessoa que treina 1h e se movimenta naturalmente.`

6. **Peso por tendência, não por dia**
   - Ícone SVG: balança ou gráfico de linha
   - `Não importa o número de um dia específico. Importa para onde a tendência está indo. O coach lê o histórico e ajusta o plano antes de você se desesperar com a balança.`

7. **Medidas corporais**
   - Ícone SVG: fita métrica
   - `Periodicamente, medidas dos pontos que importam. É o que comprova que você está mudando mesmo quando a balança parece travada.`

8. **Fotos de comparação**
   - Ícone SVG: câmera
   - `A maior parte da evolução real aparece na foto antes de aparecer na balança. Comparações periódicas para você ver o que estava acontecendo o tempo todo.`

**Animação:**
- Cabeçalho: fadeUp
- Cards: stagger reveal com delay 0.05s entre eles (8 cards = ~0.4s total para revelar todos)
- Hover: barra neon na base + ícone com glow

---

### SEÇÃO 6 — APP MOCKUPS

**Layout:** Container 1200px. Cabeçalho centralizado + 3 phones lado a lado (side / center / side).

**Cabeçalho (text-align: center):**

1. **Eyebrow**: `O app na prática`

2. **Headline**:
   ```
   ACOMPANHA TUDO
   EM TEMPO REAL.
   ```
   Sugestão: "ACOMPANHA TUDO" em outline, "EM TEMPO REAL" em neon

3. **Divider neon centralizado**

**3 phones (margin-top 64px):**

- Layout: flex align-items center, justify-content center, gap 16px
- Phone center: width 220px, border 3px solid var(--neon), box-shadow neon glow
- Phones laterais: width 180px, opacity 0.55, transform scale(0.92)

**Texto abaixo de cada mockup:**

- Título h4: Barlow Condensed Bold 18px uppercase
- Texto p: 14px, color muted, line-height 1.6, max-width 280px

**Mockup 1 (centro) — Treino que evolui com você:**
`Cada informação do seu treino fica registrada no app. Você sabe exatamente onde parou e por onde continuar. Sem depender da memória do que fez na semana passada.`

**Mockup 2 (lado esquerdo) — Comer bem sem inventar cardápio:**
`Sua alimentação ajustada para o seu objetivo. Sem alimentos proibidos, sem cardápio difícil de seguir. Tudo é construído em cima do que você já come no dia a dia.`

**Mockup 3 (lado direito) — O app coleta. O coach ajusta:**
`Cada registro é uma informação para o coach entender como ajustar o seu programa. Sono, peso, fome, falta de ânimo: tudo entra na conta para você continuar avançando rumo ao seu objetivo.`

**Animações:**
- Cabeçalho: fadeUp
- Phones: reveal com leve translateY (laterais começam mais baixos, central começa central) — efeito de "subir do chão"
- Hover individual: translateY -8px

---

### SEÇÃO 7 — DIFERENCIAIS

**Layout:** Container 1200px. Cabeçalho + grid 2x2 de cards.

**Cabeçalho:**

1. **Eyebrow**: `Por que a Integr8 funciona`

2. **Headline**:
   ```
   DESENVOLVIDO PARA QUEM
   QUER SAÚDE ALÉM DE RESULTADOS.
   ```
   Sugestão: "SAÚDE" em neon

3. **Divider neon**

**Grid 2x2 de cards:**

Cada card:
- Background var(--card)
- Padding 36px 32px
- Border 1px var(--border)
- Hover: border-color var(--border-neon) + leve translateY -4px

**Estrutura de cada card:**
- Título h4: Barlow Condensed Bold 22px uppercase, color var(--text)
- Texto p: 15px, color var(--mid), line-height 1.7

**Os 4 cards:**

1. **Programa personalizado**
   `Cada minuto do seu treino tem foco definido. Sem exercícios aleatórios, sem treino genérico. Tudo é programado para o seu nível, o seu objetivo e o equipamento que você tem.`

2. **Pouco tempo não é um problema**
   `O sistema foi feito para funcionar mesmo quando a semana está complicada. Viagem, reunião, filho doente. O plano se adapta ao que é possível, não cobra o que deveria ter sido.`

3. **Ciência voltada para saúde e resultado**
   `Sem invenções. Sem método da moda. Ajustes constantes para minimizar risco de lesões e maximizar evolução.`

4. **Informação a seu favor**
   `Os dados mostram a realidade. O coach interpreta e ajusta. Você tem um acompanhamento individual que adapta o programa à sua realidade e define o próximo passo com precisão. Não é algoritmo. É estratégia humana focada em você.`

**Animações:**
- Cabeçalho: fadeUp
- Cards: stagger reveal (delay 0.1s entre cada)
- Hover: border-color transition + translateY

---

### SEÇÃO 8 — COACH (Denis Gugia)

**Layout:** Container 1200px. Grid 2 colunas (1fr 1fr), gap 80px.

**Coluna esquerda — foto:**

- Foto profissional do Denis (formato retrato, max-width 480px)
- Border 1px var(--border)
- Sem border-radius (linha editorial)
- Filter neutro (sem drop-shadow neon — manter sóbrio para essa seção)

**Coluna direita — texto:**

1. **Eyebrow**: `Quem está por trás`

2. **Headline**: `Denis Gugia`
   - Font: Barlow Condensed Black Italic, 56px, line-height 1
   - Não em uppercase (nome próprio)

3. **Divider neon**

4. **Parágrafo 1:**
   `Mais de 25 anos na linha de frente da saúde e do movimento. Anos de atuação técnica em uma das maiores redes de academias do Brasil, onde ficou claro que o modelo tradicional de treino raramente sobrevive à rotina de um adulto com responsabilidades reais. Ex-atleta, formado Educador Físico, com múltiplas certificações internacionais pela ISSA: Personal Trainer, Nutrition Coach, Corrective Exercise, Strength & Conditioning e Exercise Effect. Coordenou centros de treinamento e hoje atua diretamente com cada cliente da Integr8.`

5. **Parágrafo 2:**
   `O Método Integr8 nasceu disso. O objetivo não é performance atlética fora da sua realidade. É devolver o vigor para você estar realmente presente no fim de um dia longo, no que importa, e voltar a estar no comando do próprio corpo. O esforço é seu. A estratégia evita lesões, melhora o seu metabolismo e respeita o seu tempo.`

6. **Badges ISSA (5 inline)**
   - Container flex horizontal, gap 12px, margin-top 32px
   - Cada badge: pill com border-neon-dim, background neon-dim, padding 6px 14px, font 11px uppercase
   - Texto: `PERSONAL TRAINER` `NUTRITION COACH` `CORRECTIVE EXERCISE` `STRENGTH & COND.` `EXERCISE EFFECT`

**Animações:**
- Foto: fadeIn + leve translateX (-20px → 0)
- Texto: fadeUp delay 0.2s
- Badges: stagger reveal (delay 0.05s entre cada)

---

### SEÇÃO 9 — PARA QUEM É + OBJEÇÕES

**Layout:** Container 1200px. Grid 2 colunas (1fr 1fr), gap 80px.

**Coluna esquerda — Para quem é:**

1. **Eyebrow**: `Para quem é`

2. **Headline**:
   ```
   FEITO PARA QUEM
   TEM VIDA REAL.
   ```
   Sugestão: "VIDA REAL" em neon

3. **Divider neon**

4. **Lista de identificação (5 itens, ul.check-list):**

   Cada item:
   - Marcador `▶` em neon — **implementar via CSS `::before`, não como caractere inline no HTML.** O caractere U+25B6 pode renderizar como emoji colorido em iOS e Android recentes, ignorando a cor CSS. Usar:
     ```css
     .check-list li::before {
       content: '▶';
       color: var(--neon);
       font-family: 'Barlow Condensed', sans-serif;
       margin-right: 12px;
     }
     ```
   - Texto 15px, color rgba(text, 0.8), line-height 1.6

   Itens:
   - `Você tem entre 35 e 55 anos, trabalha 8 a 12 horas por dia e já tentou outras coisas que funcionaram por um tempo, mas não duraram.`
   - `Sua rotina é imprevisível: trabalho, filhos, viagens. Precisa de um sistema que se adapte quando a semana vai mal, não um plano que vai pelo ralo no primeiro imprevisto.`
   - `Você não quer só perder peso. Quer energia para estar presente para os filhos às 19h depois de um dia cheio. Quer parar de acordar já negociando com o próprio corpo.`
   - `Está cansado(a) de tentar e não manter. O fracasso não foi de conhecimento. Foi de continuidade. Você precisa de estrutura, não de motivação.`
   - `Consegue pagar por serviço especializado, mas avalia com critério porque já gastou dinheiro antes com coisas que não funcionaram.`

**Coluna direita — Objeções comuns:**

1. **Eyebrow**: `Objeções comuns`

2. **Lista de objeções (4 itens, sem accordion — exibidos abertos):**

   Cada item:
   - Q em italic, color var(--muted), font 13px
   - A em texto normal, color var(--mid), font 14px, line-height 1.7
   - Border-bottom sutil entre cada

   **Q1:** `"Não tenho tempo. Tenho filhos, trabalho, casa."`
   **A1:** `O tempo disponível é a primeira informação coletada no diagnóstico. O programa é montado dentro do que você tem. 30 minutos três vezes por semana gera resultado menor do que 1 hora cinco vezes, mas gera resultado real dentro da vida real.`

   **Q2:** `"Já tentei várias coisas e nada durou. Por que isso seria diferente?"`
   **A2:** `Não vou prometer que desta vez vai ser diferente. Vou mostrar especificamente onde as tentativas anteriores falharam: o plano não cabia na rotina, ninguém mapeou a sua vida antes de prescrever, não havia acompanhamento real. A Integr8 começa exatamente onde as outras falharam.`

   **Q3:** `"Não sei se vou conseguir manter a consistência."`
   **A3:** `A consistência pedida não é perfeição. É registro. Um dia com log imperfeito vale mais do que um dia sem log. Um treino de 20 minutos feito vale mais do que um de 1 hora planejado. O sistema funciona com a consistência real de quem tem rotina de alta pressão.`

   **Q4:** `"Contar caloria é impossível de manter."`
   **A4:** `Registrar o que vai comer no dia, no app com código de barras, leva poucos minutos. A decisão fica mais fácil quando você decide com cabeça fria, não no momento da fome. Isso não é força de vontade. É arquitetura de decisão.`

**Animações:**
- Lista esquerda: stagger reveal (cada `<li>` com delay 0.08s)
- Objeções direita: stagger reveal (delay 0.1s entre objeções)

---

### SEÇÃO 10 — PROJEÇÃO TEMPORAL (NOVA)

**Layout:** Full-width. Background var(--dark) sólido, sem foto, sem textura. Padding vertical 160px. Text-align center.

**Sem eyebrow. Sem CTA. Sem divider.** A força da seção é a sobriedade.

**Bloco principal (5 linhas com tratamentos tipográficos diferentes):**

Font para todas as linhas: Barlow Condensed Black Italic, clamp(48px, 7vw, 96px), line-height 0.95, letter-spacing -0.01em, uppercase, text-align center.

- **Linha 1** (texto cheio var(--text)): `OS PRÓXIMOS MESES VÃO PASSAR`
- **Linha 2** (outline neon): `COM VOCÊ CUIDANDO DA SUA SAÚDE`
- **Linha 3** (texto cheio com palavra "OU NÃO" em neon): `OU NÃO.`
- **Espaço de respiração** (~64px)
- **Linha 4** (texto cheio): `COMO VOCÊ QUER ESTAR`
- **Linha 5** (texto cheio): `QUANDO ELES PASSAREM?`

**Linha final (margin-top ~64px, separada visualmente):**

`A diferença não é o tempo. É a escolha.`

- Font: Barlow Light Italic, 18px, color var(--mid) com opacity 0.6, max-width 460px, margin auto, text-align center

**Animação:**

- Cada linha entra com fadeUpSlow (1.2s) sequencial, com delay de 0.25s entre cada
- A linha final entra com delay extra (~0.5s após a última linha do bloco principal)
- Sem efeitos cíclicos, sem pulsação, sem brilho — a imobilidade é o efeito

**Background:**
- Fundo dark sólido sem nenhum elemento decorativo
- Considerar adicionar uma fina linha horizontal neon de ~80px no topo e bottom da seção (separadores cinematográficos), opcional

**Acessibilidade:**
- Respeitar prefers-reduced-motion: anular a animação fadeUpSlow

---

### SEÇÃO 11 — OFERTA + GARANTIA

**Layout:** Container 1200px com seção full-width. Background var(--dark) com radial gradient sutil neon no centro. Fade top + fade bottom para separar das seções vizinhas.

**Cabeçalho (text-align center):**

1. **Eyebrow**: `Protocolo C.O.R.E. 8`

2. **Headline grande (cta-big, ainda maior que .s-title):**
   ```
   COMECE A MELHORAR
   SUA SAÚDE AGORA.
   ```
   - Font: Barlow Condensed Black Italic, clamp(56px, 10vw, 120px), line-height 0.88, uppercase
   - Sugestão: "SUA SAÚDE AGORA" em neon

3. **Subheadline:**
   `Agende sua call de diagnóstico para mapear sua rotina, objetivo e limitações. A partir daí, ciclos de acompanhamento com ajustes baseados nos seus dados.`
   - Estilo .s-body, max-width 520px, margin auto, text-align center

**Card de oferta (margin-top 48px, max-width 600px, margin auto):**

Estrutura:
- Background var(--card)
- Border 1px var(--border-neon)
- Padding 48px

**Conteúdo do card:**

1. **Label**: `O que está incluído` (font 10px, letter-spacing 0.25em, uppercase, color muted)

2. **Bloco de preço:**
   - Preço: `Em breve` (placeholder) ou `CAD $49.90 /mês`
   - Font: Barlow Condensed Black 48px, color neon
   - Note abaixo: `Acompanhamento contínuo · Vagas limitadas por ciclo`
   - Border-bottom 1px var(--border) separando do próximo bloco

3. **Lista de inclusões (7 itens, ul.offer-includes):**
   Cada item:
   - Marcador `→` em neon
   - Texto 14px, color rgba(text, 0.8), line-height 1.55

   - `Call de diagnóstico inicial: rotina, objetivo, histórico, limitações`
   - `Plano de treino personalizado no app`
   - `Metas de nutrição (calorias e macros) ajustadas continuamente`
   - `Acompanhamento de sono, hidratação e movimento`
   - `Check-in regular com análise e ajuste do plano`
   - `Suporte direto via chat com o coach Denis Gugia`
   - `Visão clara da evolução ao longo do programa`

4. **CTA principal (full-width):**
   - Botão neon, padding 20px, font 13px uppercase, letter-spacing 0.15em
   - Texto: `COMEÇAR MEU PROTOCOLO →`
   - Hover: brightness up + translateY -2px + shadow neon
   - **Animação adicional:** subtle pulse loop a cada 4s (scale 1 → 1.02 → 1) para chamar atenção

5. **Garantia (abaixo do CTA, font menor):**
   `Garantia de 21 dias. Se nos primeiros 21 dias você concluir que isso não é para você, devolvemos o valor integral da assinatura. Apenas as taxas cobradas pela plataforma de pagamento ficam fora.`
   - Font 12px, color var(--mid), text-align center, margin-top 16px, line-height 1.5

6. **Scarcity (abaixo da garantia):**
   `Atendimento 1:1 com ajuste real ao longo do tempo. Vagas limitadas por ciclo.`
   - Font 12px, color var(--muted), text-align center, italic, margin-top 12px

**Animações:**
- Cabeçalho: fadeUp
- Card: fadeUp delay 0.2s
- Botão CTA: pulseSubtle loop infinito

---

### SEÇÃO 12 — FAQ

**Layout:** Container 1200px. Cabeçalho + lista accordion max-width 780px.

**Cabeçalho:**

1. **Eyebrow**: `FAQ`

2. **Headline**: `PERGUNTAS FREQUENTES.`
   - Estilo .s-title

**Accordion (8 perguntas):**

Cada item:
- Border-bottom 1px var(--border)
- Pergunta clicável (`.faq-q`): padding 24px 0, Barlow Condensed Bold 20px uppercase
- Indicador `+` à direita que rotaciona 45° quando aberto (vira `×`)
- Resposta (`.faq-a`): max-height 0 → expandida ao abrir, font 15px, color muted, line-height 1.75
- Apenas uma aberta por vez

**JavaScript do accordion (obrigatório):**

```javascript
document.querySelectorAll('.faq-q').forEach(btn => {
  btn.addEventListener('click', () => {
    const item = btn.closest('.faq-item');
    const wasOpen = item.classList.contains('open');
    // Fecha todas antes de abrir
    document.querySelectorAll('.faq-item.open').forEach(i => {
      i.classList.remove('open');
      i.querySelector('.faq-q').setAttribute('aria-expanded', 'false');
    });
    // Abre a clicada (se estava fechada)
    if (!wasOpen) {
      item.classList.add('open');
      btn.setAttribute('aria-expanded', 'true');
    }
  });
});
```

Cada `.faq-q` precisa ter `aria-expanded="false"` por padrão no HTML.

**As 8 perguntas:**

1. **Q:** `O treino é personalizado de verdade ou um plano genérico?`
   **A:** `Começa com um diagnóstico real da sua rotina, objetivo, histórico e limitações. O plano é montado para o seu equipamento, número de dias e foco atual. E ajustado de forma contínua com base nos seus dados.`

2. **Q:** `O que acontece quando minha semana vai mal?`
   **A:** `Essa é exatamente a diferença. O check-in existe para capturar isso. Se a semana foi caótica, o plano da próxima já sai ajustado. Sem recomeçar do zero.`

3. **Q:** `Posso fazer em casa, sem academia?`
   **A:** `Sim. O plano é adaptado ao equipamento disponível: academia completa, home gym ou apenas peso do corpo. Isso é definido na call de diagnóstico inicial.`

4. **Q:** `Como funciona a parte da nutrição?`
   **A:** `Você recebe metas de calorias e macros ajustadas ao seu objetivo e rotina. Sem proibições, sem listas rígidas. Ajuste contínuo baseado na tendência de peso e adesão real.`

5. **Q:** `Quanto tempo de treino por dia eu preciso ter disponível?`
   **A:** `O programa é construído em cima do tempo que você tem, não do tempo que deveria ter. Tem apenas 30 minutos duas a três vezes por semana? Já é suficiente para gerar resultado real. Se tem mais tempo, vai gerar mais. Mas a ideia é começar com o que cabe na sua semana real.`

6. **Q:** `A nutrição vai exigir que eu corte tudo que gosto?`
   **A:** `Não. Não há alimentos proibidos nem listas rígidas. A alimentação é construída em cima do que você já come, ajustando quantidades para o seu objetivo. Ajuste contínuo baseado em peso e adesão real, não em culpa.`

7. **Q:** `Quanto tempo até começar a ver resultado?`
   **A:** `Energia, sono e disposição mudam nas primeiras 2 a 3 semanas. Mudanças visíveis no corpo dependem do ponto de partida e da adesão, mas a maior parte das pessoas vê diferença real entre semana 4 e 8.`

8. **Q:** `O contato com o coach é diário ou semanal?`
   **A:** `O acompanhamento é assíncrono. Você registra os dados no app, faz check-in periódico, e pode enviar mensagens quando precisar dentro do próprio app. O coach responde dentro do prazo combinado. Periodicamente, o seu programa é ajustado com base nessas informações.`

**Animação:**
- Cabeçalho: fadeUp
- Lista: stagger reveal (delay 0.05s entre items)
- Abertura/fechamento: max-height transition 0.4s ease

---

### SEÇÃO 13 — FOOTER + HEADLINE FINAL

**Headline final (acima do footer):**

Bloco full-width, padding vertical 100px, text-align center.

- **Headline**: `SEU RESULTADO COMEÇA QUANDO O SISTEMA COMEÇA A TE OUVIR.`
  - Font: Barlow Condensed Black Italic, clamp(36px, 5vw, 64px), line-height 1.05, uppercase
  - Sugestão: "SISTEMA COMEÇA A TE OUVIR" em neon

- **CTA abaixo (margin-top 32px):**
  - Botão primário: `COMEÇAR AGORA →`
  - Mesmo estilo do botão Hero

**Footer propriamente dito:**

- Background var(--dark)
- Border-top 1px var(--border)
- Padding 48px 80px
- Layout flex space-between

**Conteúdo:**

- Esquerda:
  - Logo `INTEGR8` em Barlow Condensed Black 32px, letter-spacing 0.12em, neon
  - Tagline abaixo: `© 2026 Integr8 · Denis Gugia · Todos os direitos reservados` (font 12px, muted)

- Direita:
  - Botão pequeno secundário: `COMEÇAR AGORA →` (font 11px, padding 12px 28px, neon)

**Animação:**
- Headline final: fadeUp ao entrar viewport
- Resto: sem animação

---

### COMPONENTE — POP-UP DE EXIT-INTENT

**Trigger:**

> **Snippet canônico — usar este, não redeclarar em outro lugar do código.**

```javascript
// Estado global do exit-intent — declarado uma única vez
const exitShown = localStorage.getItem('integr8-exit-shown') === 'true';
let projectionPassed = false; // flag setada pelo IntersectionObserver da Seção 10

document.addEventListener('mouseleave', (e) => {
  if (e.clientY <= 0 && !exitShown && !projectionPassed && window.innerWidth >= 768) {
    showExitModal();
    localStorage.setItem('integr8-exit-shown', 'true');
  }
});
```

**Estrutura HTML:**

```html
<div class="exit-modal-overlay" id="exitModal" aria-hidden="true">
  <div class="exit-modal-box" role="dialog" aria-modal="true" aria-labelledby="exitModalTitle">
    <button class="exit-modal-close" aria-label="Fechar">×</button>
    <span class="exit-modal-eyebrow">ANTES DE FECHAR</span>
    <h2 class="exit-modal-headline" id="exitModalTitle">
      Os próximos meses vão passar com você cuidando da sua saúde ou não.<br>
      Como você quer estar quando eles passarem?
    </h2>
    <div class="exit-modal-actions">
      <a href="#cta" class="btn-primary exit-modal-cta">COMEÇAR MEU PROTOCOLO →</a>
      <button class="btn-ghost exit-modal-dismiss">Continuar lendo</button>
    </div>
  </div>
</div>
```

**Estilo:**

- Overlay: position fixed, inset 0, background rgba(0,0,0,0.85), backdrop-filter blur(8px), z-index 9999, display none por padrão
- Box: max-width 560px, padding 48px, background var(--card), border 1px var(--border-neon), centralizada
- Eyebrow: font 10px, letter-spacing 0.3em, uppercase, color neon, margin-bottom 24px
- Headline: Barlow Condensed Black Italic, 32px, line-height 1.1, color var(--text)
- Actions: flex column gap 12px, margin-top 32px

**Animações:**
- Entrada: overlay fadeIn 0.3s + box scale 0.92 → 1 em 0.4s ease-out (delay 0.1s para entrar depois do backdrop)
- Saída: overlay fadeOut 0.2s + box scale 1 → 0.95 em 0.2s

**Comportamento:**
- ESC fecha
- Click no backdrop fecha
- Click no "COMEÇAR MEU PROTOCOLO →" fecha o modal e scroll smooth até `#cta`
- Click no "Continuar lendo" fecha o modal
- Foco automático no botão primário ao abrir
- Trap de foco enquanto aberto (Tab cicla apenas entre os 3 elementos focáveis: close, primary, dismiss)

---

## 6. SISTEMA DE ANIMAÇÃO — STACK DEFINITIVO

### Camadas de animação

A página tem 3 camadas de animação, cada uma com sua própria stack:

#### Camada 1 — Animações ambiente (sempre rodando)

**Stack: CSS keyframes puro**

- Marquee (translateX loop)
- Glow pulse no símbolo ∞
- Pulse subtle no botão CTA principal
- Dot pulse no eyebrow Hero

Não exigem dependências. Já estão majoritariamente implementadas no CSS atual.

#### Camada 2 — Reveal on scroll

**Stack: IntersectionObserver + CSS transitions**

Já implementado na página atual via `.reveal` e `.reveal.visible`. Mantém. Aplicar a:

- Cabeçalhos de seção
- Cards (com stagger via reveal-delay-1, reveal-delay-2, reveal-delay-3)
- Steps numerados
- Pillars
- Lista de check-list
- Objeções
- Linhas da Seção 10 (com fadeUpSlow especial)

**Não precisa de GSAP nem Motion para isso.** O IntersectionObserver é nativo e leve.

#### Camada 3 — Micro-interações (hover, click, focus)

**Stack: CSS transitions**

- Hover dos botões (translateY, brightness, shadow)
- Hover dos cards (border-color change, padding-left grow)
- Accordion open/close (max-height transition)
- Pop-up enter/exit (transform + opacity)

Tudo CSS. Sem JS além do toggle de classe.

### Quando considerar upgrades

**GSAP ScrollTrigger (opcional, futuro):**
- Se quiser timeline scroll-coordinated complexa, tipo "elemento A entra enquanto B sai e C rotaciona conforme scroll progride"
- Para essa V5, NÃO PRECISA. Adicionar GSAP só aumentaria bundle size sem ganho real.

**Lottie (opcional, futuro):**
- Se quiser ilustrações vetoriais animadas (tipo logo animado, ícone com micro-animação cíclica)
- Para essa V5, NÃO PRECISA. Os 8 ícones SVG dos pilares são estáticos com hover glow — suficiente.

**Motion (Framer Motion):**
- Apenas se a página migrar para React. Como continua HTML/CSS vanilla, não se aplica.

### Sobre Remotion

**Remotion não se aplica a essa página.**

Remotion é um framework para gerar VÍDEO programaticamente (export MP4/WebM) usando React. Serve para casos como "gerar trailer de vídeo automaticamente a partir de dados de uma campanha". Não é uma biblioteca de animação web.

Se você quiser inserir um vídeo animado em algum momento da página (por exemplo, um vídeo de 8 segundos mostrando os 8 pilares se conectando em uma diagrama), você poderia usar Remotion para gerar esse vídeo, exportar como MP4 ou WebM, e incorporar como elemento `<video>` na página. Mas isso é uma decisão separada do trabalho de landing page propriamente dita.

**Recomendação para essa V5:** não usar Remotion. Manter foco em CSS + IntersectionObserver, que entrega tudo que a página precisa com performance superior e zero dependência adicional.

---

## 7. ACESSIBILIDADE E PERFORMANCE

### Acessibilidade — checklist

- **Hierarquia de headings:** H1 único na página (Hero). H2 para títulos de seção. H3 para subtítulos. H4 para títulos de cards.
- **Foco visível:** todos os elementos interativos têm focus state distinto. Não usar `outline: none` sem alternativa visível.
- **Skip link:** adicionar `<a href="#hero" class="skip-link">Pular para o conteúdo</a>` no início do `<body>`, visível ao receber foco.
- **Aria attributes:**
  - Pop-up modal: `role="dialog"`, `aria-modal="true"`, `aria-labelledby`
  - FAQ: `aria-expanded` no botão de pergunta
  - Botões com ícone (close button): `aria-label`
  - Marquee decorativo: `aria-hidden="true"`
- **Contraste:** verificar com Lighthouse e ferramenta tipo WebAIM Contrast Checker. Mínimo 4.5:1 para texto normal, 3:1 para texto large.
  - Atenção especial ao light mode: `--neon: #4d7a00` precisa ter contraste adequado contra `--bg: #f2f2ee`.
- **prefers-reduced-motion:** adicionar bloco CSS que neutraliza animações cíclicas (marquee, glow-pulse, pulse-subtle):
  ```css
  @media (prefers-reduced-motion: reduce) {
    *, *::before, *::after {
      animation-duration: 0.01ms !important;
      animation-iteration-count: 1 !important;
      transition-duration: 0.01ms !important;
      scroll-behavior: auto !important;
    }
  }
  ```
- **Texto alt:** todas as imagens com `alt` descritivo. Imagens decorativas com `alt=""`.

### Performance — checklist

- **Imagens:**
  - Hero: WebP com fallback JPG, `<picture>` com `<source>`, `fetchpriority="high"`
  - Mockups app: WebP, lazy loading
  - Foto coach: WebP, lazy loading
  - Tamanhos: hero ~200KB max, mockups ~60KB cada, coach ~120KB max
- **Fontes:** preconnect já implementado. Adicionar `font-display: swap` no @font-face se for self-hosted (atualmente vem do Google Fonts, swap já é padrão).
- **CSS:** mover crítico para inline `<style>` no `<head>` se Lighthouse acusar render-blocking. Como o CSS atual está todo inline no `<head>`, isso já é resolvido.
- **JS:** continuar inline no final do `<body>`. Sem dependências externas.
- **Total page weight target:** < 1.5MB (excluindo imagens lazy-loaded abaixo do fold).
- **First Contentful Paint target:** < 1.5s em conexão 4G.
- **Largest Contentful Paint target:** < 2.5s.

---

## 8. CHECKLIST DE ACEITE FINAL

Antes de fazer merge na main:

### Conteúdo

- [ ] Todas as 13 seções estão presentes na ordem correta
- [ ] Todas as copies foram aplicadas conforme `COPY_V5.md`
- [ ] Nenhuma menção a "16 semanas" em nenhum lugar (HTML, CSS, JS, meta tags)
- [ ] Nenhuma menção a "vídeo de execução" em nenhum lugar
- [ ] Nenhuma menção a "quinzenal" ou "semanal" em frequência (sempre "contínuo", "regular", "constante", "periódico")
- [ ] Nenhum travessão `—` no texto visível ao usuário
- [ ] Eyebrow do nav: `Denis Gugia · Protocolo C.O.R.E. 8`
- [ ] Title da página: `INTEGR8 — Protocolo C.O.R.E. 8`
- [ ] Versões PT, EN e ES atualizadas (se mantendo multilíngue)

### Visual

- [ ] Hero com 3 cenários atrás do casal (após geração da imagem)
- [ ] Headline Hero com tratamento tipográfico de 3 linhas (neon / outline / cheio)
- [ ] Símbolo ∞ presente no método com glow pulse
- [ ] Badge `PROTOCOLO C.O.R.E. 8` substituiu o badge anterior
- [ ] Grid 4x2 de pilares com 8 cards corretos (ícones revisados)
- [ ] 3 phones na seção App
- [ ] Foto Denis presente
- [ ] Seção 10 (Projeção Temporal) implementada com fundo dark sólido
- [ ] Pop-up exit-intent funcional

### Comportamento

- [ ] Pop-up dispara apenas uma vez por sessão
- [ ] Pop-up não dispara em mobile
- [ ] Pop-up não dispara se usuário já passou pela Seção 10
- [ ] Pop-up fechável via Esc, click no backdrop, ou botão "Continuar lendo"
- [ ] CTAs do Hero, Oferta e Footer apontam para `#cta`
- [ ] Scroll smooth em links âncora (exceto quando `prefers-reduced-motion: reduce` está ativo — nesse caso scroll é instantâneo por design)
- [ ] Toggle dark/light mode funcionando
- [ ] Toggle de idioma funcionando

### Animação

- [ ] FadeUp sequencial no Hero (eyebrow → título → corpo → stats → botões)
- [ ] Reveal on scroll em todas as seções
- [ ] Stagger nos cards
- [ ] Marquee em loop contínuo
- [ ] Glow pulse no ∞
- [ ] Pulse subtle no botão CTA principal
- [ ] Animações respeitam prefers-reduced-motion

### Acessibilidade

- [ ] Lighthouse Accessibility ≥ 95
- [ ] Hierarquia de headings correta
- [ ] Foco visível em todos os interativos
- [ ] Aria attributes no modal e FAQ
- [ ] Contraste suficiente em dark e light modes

### Performance

- [ ] Lighthouse Performance ≥ 85 (mobile)
- [ ] LCP < 2.5s
- [ ] FCP < 1.5s
- [ ] Imagens otimizadas (WebP + lazy)

### Analytics

- [ ] GTM presente
- [ ] Eventos personalizados disparando nos CTAs
- [ ] Scroll depth tracking

### Cross-browser e responsivo

- [ ] Chrome, Firefox, Safari, Edge — desktop
- [ ] Chrome Android, Safari iOS — mobile
- [ ] Viewports: 360, 414, 768, 1024, 1440, 1920px

---

## RESUMO PARA INICIAR NO CLAUDE CODE

Quando você abrir o Claude Code na pasta do projeto local, comece com este prompt:

> "Estamos iniciando a versão 5 da landing page Integr8. Toda orientação está no documento `INTEGR8_V5_PLANO_EXECUCAO_CLAUDE_CODE.md`. Por favor leia o documento inteiro primeiro, depois execute a Fase 1 (setup e inventário) e me devolva o resultado antes de prosseguir para a Fase 2."

A partir daí, siga as fases na ordem, com aprovação entre elas. Use Sonnet nas fases 1 a 6 e o modelo Opus mais recente disponível na fase 7 (revisão crítica final). Confirme os identificadores de modelo disponíveis com `/model` antes de iniciar.
