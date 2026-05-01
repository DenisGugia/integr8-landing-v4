# ============================================
# GTM Implementation Script for Integr8
# ============================================
# Run: .\implement-gtm.ps1

param(
    [Parameter(Mandatory=$false)]
    [string]$GTMId = ""
)

# Color codes for terminal output
$colors = @{
    Success = "Green"
    Error = "Red"
    Warning = "Yellow"
    Info = "Cyan"
    Highlight = "Magenta"
}

function Write-Status {
    param(
        [string]$Message,
        [string]$Type = "Info"
    )
    $color = $colors[$Type]
    Write-Host "[$Type] $Message" -ForegroundColor $color
}

function Confirm-Action {
    param([string]$Prompt)
    $response = Read-Host "$Prompt (S/N)"
    return $response -eq "S" -or $response -eq "s" -or $response -eq "Sim"
}

# ============================================
# INÍCIO DA EXECUÇÃO
# ============================================

Write-Host "`n╔════════════════════════════════════════╗" -ForegroundColor Magenta
Write-Host "║   GTM Implementation - Integr8 V4     ║" -ForegroundColor Magenta
Write-Host "╚════════════════════════════════════════╝`n" -ForegroundColor Magenta

# Step 1: Solicitar GTM ID se não fornecido
if (-not $GTMId) {
    Write-Status "Por favor, forneça seu Google Tag Manager ID (formato: GTM-XXXXXX)" "Info"
    $GTMId = Read-Host "GTM ID"
}

if ($GTMId -notmatch "^GTM-[A-Z0-9]+$") {
    Write-Status "❌ Formato inválido! Use formato GTM-XXXXXX" "Error"
    exit 1
}

Write-Status "✓ GTM ID aceito: $GTMId" "Success"

# Step 2: Verificar se arquivo existe
$indexPath = ".\index.html"
if (-not (Test-Path $indexPath)) {
    Write-Status "❌ Arquivo index.html não encontrado!" "Error"
    exit 1
}

Write-Status "✓ Arquivo index.html localizado" "Success"

# Step 3: Backup
Write-Status "Criando backup de segurança..." "Info"
$timestamp = (Get-Date).ToString("yyyyMMdd-HHmmss")
$backupPath = ".\index.html.backup.$timestamp"
Copy-Item $indexPath $backupPath
Write-Status "✓ Backup criado: $backupPath" "Success"

# Step 4: Ler conteúdo
Write-Status "Lendo arquivo HTML..." "Info"
$htmlContent = Get-Content $indexPath -Raw

# Step 5: Criar dataLayer Script
$dataLayerScript = @"
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
"@

# Step 6: Criar GTM Head Snippet
$gtmHeadSnippet = @"
  <!-- Google Tag Manager -->
  <script>
    (function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
    new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
    j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
    'https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
    })(window,document,'script','dataLayer','$GTMId');
  </script>
  <!-- End Google Tag Manager -->
"@

# Step 7: Criar GTM Body Snippet
$gtmBodySnippet = @"
  <!-- Google Tag Manager (noscript) -->
  <noscript>
    <iframe src="https://www.googletagmanager.com/ns.html?id=$GTMId" height="0" width="0" style="display:none;visibility:hidden"></iframe>
  </noscript>
  <!-- End Google Tag Manager (noscript) -->
"@

# Step 8: Injetar scripts no HTML
Write-Status "Injetando dataLayer no <head>..." "Info"

# Injetar após meta viewport
$htmlContent = $htmlContent -replace '(<meta name="viewport"[^>]*>)', "`$1`n$dataLayerScript"

# Injetar GTM Head antes do Google Fonts
$htmlContent = $htmlContent -replace '(\s+<!-- Google Fonts -->)', "`n$gtmHeadSnippet`n`$1"

# Injetar GTM Body logo após <body>
$htmlContent = $htmlContent -replace '(<body[^>]*>)', "`$1`n$gtmBodySnippet"

# Verificar se js/gtm-events.js já está importado
if ($htmlContent -notmatch '<script src="js/gtm-events.js"') {
    Write-Status "Adicionando importação de js/gtm-events.js..." "Info"
    $htmlContent = $htmlContent -replace '(<script src="js/app.js"><\/script>)', '<script src="js/gtm-events.js"></script>
  $1'
    Write-Status "✓ Script importado com sucesso" "Success"
} else {
    Write-Status "✓ js/gtm-events.js já estava importado" "Success"
}

# Step 9: Salvar HTML modificado
Write-Status "Salvando arquivo HTML modificado..." "Info"
$htmlContent | Set-Content $indexPath -Encoding UTF8
Write-Status "✓ Arquivo HTML atualizado" "Success"

# Step 10: Criar js/gtm-events.js se não existir
$jsPath = ".\js\gtm-events.js"
$jsContent = @"
// ============================================
// GTM EVENT TRACKING
// ============================================

document.addEventListener('DOMContentLoaded', function() {

  // ✓ EVENTO 1: CTA CLICK
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
  const pricingSection = document.getElementById('oferta');

  if (pricingSection) {
    const observerOptions = {
      threshold: 0.5
    };

    const observer = new IntersectionObserver(function(entries) {
      entries.forEach(entry => {
        if (entry.isIntersecting && !entry.target.dataset.priceViewTracked) {
          trackEvent('view_pricing', {
            'section': 'offer',
            'price_displayed': '${'$'}49.90 CAD/mês',
            'billing_cycle': '16 semanas'
          });

          entry.target.dataset.priceViewTracked = 'true';
        }
      });
    }, observerOptions);

    observer.observe(pricingSection);
  }

  // ✓ EVENTO 3: BEGIN CHECKOUT
  const checkoutButton = document.querySelector('.offer__card .btn-primary');

  if (checkoutButton) {
    checkoutButton.addEventListener('click', function(e) {
      trackEvent('begin_checkout', {
        'product': 'Protocolo INTEGR8',
        'price': '${'$'}49.90 CAD',
        'currency': 'CAD',
        'billing_period': '16 semanas'
      });
    });
  }

  console.log('✓ GTM Events initialized successfully');
});
"@

if (-not (Test-Path (Split-Path $jsPath))) {
    New-Item -ItemType Directory -Path (Split-Path $jsPath) -Force | Out-Null
}

Write-Status "Criando arquivo js/gtm-events.js..." "Info"
$jsContent | Set-Content $jsPath -Encoding UTF8
Write-Status "✓ Arquivo js/gtm-events.js criado" "Success"

# Step 11: Resumo e próximos passos
Write-Host "`n╔════════════════════════════════════════╗" -ForegroundColor Green
Write-Host "║     ✓ Implementação Concluída!       ║" -ForegroundColor Green
Write-Host "╚════════════════════════════════════════╝`n" -ForegroundColor Green

Write-Status "Resumo das mudanças:" "Highlight"
Write-Host "  ✓ dataLayer adicionado ao <head>" -ForegroundColor Green
Write-Host "  ✓ GTM Head Snippet injetado" -ForegroundColor Green
Write-Host "  ✓ GTM Body Snippet injetado" -ForegroundColor Green
Write-Host "  ✓ js/gtm-events.js criado" -ForegroundColor Green
Write-Host "  ✓ Importação de script configurada" -ForegroundColor Green
Write-Host ""

Write-Status "Backup salvo em: $backupPath" "Info"
Write-Status "GTM ID configurado: $GTMId" "Info"

Write-Host "`n╔════════════════════════════════════════╗" -ForegroundColor Cyan
Write-Host "║        Próximos Passos (Manual)      ║" -ForegroundColor Cyan
Write-Host "╚════════════════════════════════════════╝" -ForegroundColor Cyan
Write-Host "
1. Abra o navegador e acesse sua página
2. Pressione F12 para abrir DevTools
3. Vá à aba 'Console'
4. Clique nos botões de CTA para verificar eventos:
   window.dataLayer

5. Configure triggers e tags no GTM Dashboard:
   https://tagmanager.google.com

6. Crie triggers para:
   - cta_click
   - view_pricing
   - begin_checkout

7. Associe cada trigger a uma tag Google Analytics 4

8. Teste em modo Preview do GTM antes de publicar

" -ForegroundColor Cyan

Write-Status "Você pode agora abrir index.html no navegador e testar!" "Success"
Write-Host ""

# Oferecer para abrir navegador
if (Confirm-Action "Deseja abrir o arquivo no navegador?") {
    $fullPath = (Resolve-Path $indexPath).Path
    Start-Process "file:///$fullPath"
    Write-Status "Abrindo navegador..." "Info"
}

Write-Host "`n✨ Implementação finalizada com sucesso! ✨`n" -ForegroundColor Green
