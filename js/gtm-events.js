document.addEventListener('DOMContentLoaded', function() {
  const ctaButtons = document.querySelectorAll('.btn-primary, a.btn-primary');
  ctaButtons.forEach(button => {
    button.addEventListener('click', function(e) {
      window.dataLayer.push({
        'event': 'cta_click',
        'button_text': (this.textContent || this.innerText).trim(),
        'button_location': this.closest('section')?.id || 'unknown',
        'timestamp': new Date().toISOString()
      });
    });
  });

  const pricingSection = document.getElementById('oferta');
  if (pricingSection) {
    const observer = new IntersectionObserver(function(entries) {
      entries.forEach(entry => {
        if (entry.isIntersecting && !entry.target.dataset.priceViewTracked) {
          window.dataLayer.push({
            'event': 'view_pricing',
            'section': 'offer',
            'price_displayed': '.90 CAD/mês',
            'timestamp': new Date().toISOString()
          });
          entry.target.dataset.priceViewTracked = 'true';
        }
      });
    }, { threshold: 0.5 });
    observer.observe(pricingSection);
  }

  const checkoutButton = document.querySelector('.offer__card .btn-primary');
  if (checkoutButton) {
    checkoutButton.addEventListener('click', function() {
      window.dataLayer.push({
        'event': 'begin_checkout',
        'product': 'Protocolo INTEGR8',
        'price': '.90 CAD',
        'currency': 'CAD',
        'timestamp': new Date().toISOString()
      });
    });
  }
});
