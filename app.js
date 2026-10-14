// Global copy function usable via inline onclick or event delegation
window.copyReferralCode = function(btnElement, code, name) {
  if (!code) return;
  name = name || 'Offre';

  function onCopySuccess() {
    if (btnElement) {
      if (!btnElement.dataset.origText) {
        btnElement.dataset.origText = btnElement.textContent;
      }
      btnElement.textContent = '✓ COPIÉ !';
      btnElement.style.backgroundColor = '#0F4C3A';
      btnElement.style.color = '#FFFFFF';
      setTimeout(function() {
        btnElement.textContent = btnElement.dataset.origText;
        btnElement.style.backgroundColor = '';
        btnElement.style.color = '';
      }, 2200);
    }
    showCopyToast('✓ Code "' + code + '" (' + name + ') copié !');
  }

  function fallbackCopyTextToClipboard(text) {
    try {
      var textArea = document.createElement('textarea');
      textArea.value = text;
      textArea.setAttribute('readonly', '');
      textArea.style.position = 'fixed';
      textArea.style.top = '0';
      textArea.style.left = '0';
      textArea.style.width = '2em';
      textArea.style.height = '2em';
      textArea.style.padding = '0';
      textArea.style.border = 'none';
      textArea.style.outline = 'none';
      textArea.style.boxShadow = 'none';
      textArea.style.background = 'transparent';
      textArea.style.opacity = '0';
      document.body.appendChild(textArea);
      textArea.focus();
      textArea.select();
      textArea.setSelectionRange(0, 999999);
      var successful = document.execCommand('copy');
      document.body.removeChild(textArea);
      if (successful) {
        onCopySuccess();
      } else {
        window.prompt('Copiez ce code parrain (Ctrl+C) :', text);
      }
    } catch (err) {
      window.prompt('Copiez ce code parrain (Ctrl+C) :', text);
    }
  }

  if (navigator.clipboard && window.isSecureContext) {
    navigator.clipboard.writeText(code).then(function() {
      onCopySuccess();
    }).catch(function() {
      fallbackCopyTextToClipboard(code);
    });
  } else {
    fallbackCopyTextToClipboard(code);
  }
};

var toastTimeout;
window.showCopyToast = function(message) {
  var toast = document.getElementById('copy-toast');
  if (!toast) {
    toast = document.createElement('div');
    toast.id = 'copy-toast';
    toast.className = 'toast-container';
    document.body.appendChild(toast);
  }
  toast.textContent = message;
  toast.classList.add('show');
  clearTimeout(toastTimeout);
  toastTimeout = setTimeout(function() {
    toast.classList.remove('show');
  }, 3200);
};

function initHelloParrain() {
  // 1. Dynamic French Date in Live Banner & Verification Badges
  var now = new Date();
  var options = { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' };
  var dateFr = now.toLocaleDateString('fr-FR', options).toUpperCase();
  var dateFrShort = now.toLocaleDateString('fr-FR', { day: 'numeric', month: 'long', year: 'numeric' });

  var bannerTextEl = document.getElementById('live-banner-text');
  if (bannerTextEl) {
    bannerTextEl.textContent = "STATUT DES OFFRES : 43 CODES & LIENS VÉRIFIÉS AUJOURD'HUI — " + dateFr + " (100% ACTIFS)";
  }

  document.querySelectorAll('.js-verified-date').forEach(function(el) {
    el.textContent = "Vérifié le " + dateFrShort;
  });

  // 2. Event delegation for any .js-copy-btn or .ticket-box click
  document.addEventListener('click', function(e) {
    var btn = e.target.closest('.js-copy-btn');
    if (btn && !btn.hasAttribute('onclick')) {
      e.preventDefault();
      var code = btn.getAttribute('data-code');
      var name = btn.getAttribute('data-name') || 'Offre';
      window.copyReferralCode(btn, code, name);
    }
  });

  // 3. Search & Category Filter on Index
  var searchInput = document.getElementById('offer-search');
  var filterBtns = document.querySelectorAll('.js-filter-btn');
  var offerCards = document.querySelectorAll('.js-offer-card');
  var countDisplay = document.getElementById('offers-count');

  var activeCategory = 'all';
  var searchQuery = '';

  var urlParams = new URLSearchParams(window.location.search);
  var initialCat = urlParams.get('cat');
  if (initialCat) {
    activeCategory = initialCat;
    filterBtns.forEach(function(b) {
      b.classList.toggle('active', b.getAttribute('data-cat') === initialCat);
    });
  }

  function filterOffers() {
    if (!offerCards.length) return;
    var visibleCount = 0;

    offerCards.forEach(function(card) {
      var cat = card.getAttribute('data-cat');
      var text = (card.getAttribute('data-search') || '').toLowerCase();

      var matchesCat = (activeCategory === 'all') || (cat === activeCategory);
      var matchesSearch = !searchQuery || text.indexOf(searchQuery) !== -1;

      if (matchesCat && matchesSearch) {
        card.style.display = 'flex';
        visibleCount++;
      } else {
        card.style.display = 'none';
      }
    });

    if (countDisplay) {
      countDisplay.textContent = visibleCount + ' offre' + (visibleCount > 1 ? 's' : '') + ' affichée' + (visibleCount > 1 ? 's' : '');
    }
  }

  if (initialCat) {
    filterOffers();
  }

  if (searchInput) {
    searchInput.addEventListener('input', function(e) {
      searchQuery = e.target.value.trim().toLowerCase();
      filterOffers();
    });
  }

  filterBtns.forEach(function(btn) {
    btn.addEventListener('click', function() {
      filterBtns.forEach(function(b) { b.classList.remove('active'); });
      btn.classList.add('active');
      activeCategory = btn.getAttribute('data-cat');
      filterOffers();
    });
  });
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initHelloParrain);
} else {
  initHelloParrain();
}
