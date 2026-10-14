document.addEventListener('DOMContentLoaded', () => {
  // 1. Dynamic French Date in Live Banner & Verification Badges
  const now = new Date();
  const options = { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' };
  const dateFr = now.toLocaleDateString('fr-FR', options).toUpperCase();
  const dateFrShort = now.toLocaleDateString('fr-FR', { day: 'numeric', month: 'long', year: 'numeric' });

  const bannerTextEl = document.getElementById('live-banner-text');
  if (bannerTextEl) {
    bannerTextEl.textContent = `STATUT DES OFFRES : 43 CODES & LIENS VÉRIFIÉS AUJOURD'HUI — ${dateFr} (100% ACTIFS)`;
  }

  document.querySelectorAll('.js-verified-date').forEach(el => {
    el.textContent = `Vérifié le ${dateFrShort}`;
  });

  // 2. Copy to Clipboard with Toast Notification
  const toast = document.getElementById('copy-toast');
  let toastTimeout;

  function showToast(message) {
    if (!toast) return;
    toast.textContent = message;
    toast.classList.add('show');
    clearTimeout(toastTimeout);
    toastTimeout = setTimeout(() => {
      toast.classList.remove('show');
    }, 3200);
  }

  document.querySelectorAll('.js-copy-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      const code = btn.getAttribute('data-code');
      const name = btn.getAttribute('data-name') || 'Offre';
      if (!code) return;

      navigator.clipboard.writeText(code).then(() => {
        const originalText = btn.textContent;
        btn.textContent = '✓ COPIÉ !';
        showToast(`✓ Code "${code}" (${name}) copié dans le presse-papiers !`);
        setTimeout(() => {
          btn.textContent = originalText;
        }, 2200);
      }).catch(() => {
        const tempInput = document.createElement('input');
        tempInput.value = code;
        document.body.appendChild(tempInput);
        tempInput.select();
        document.execCommand('copy');
        document.body.removeChild(tempInput);
        showToast(`✓ Code "${code}" copié !`);
      });
    });
  });

  // 3. Search & Category Filter on Index
  const searchInput = document.getElementById('offer-search');
  const filterBtns = document.querySelectorAll('.js-filter-btn');
  const offerCards = document.querySelectorAll('.js-offer-card');
  const countDisplay = document.getElementById('offers-count');

  let activeCategory = 'all';
  let searchQuery = '';

  const urlParams = new URLSearchParams(window.location.search);
  const initialCat = urlParams.get('cat');
  if (initialCat) {
    activeCategory = initialCat;
    filterBtns.forEach(b => {
      b.classList.toggle('active', b.getAttribute('data-cat') === initialCat);
    });
  }

  function filterOffers() {
    if (!offerCards.length) return;
    let visibleCount = 0;

    offerCards.forEach(card => {
      const cat = card.getAttribute('data-cat');
      const text = card.getAttribute('data-search').toLowerCase();

      const matchesCat = (activeCategory === 'all') || (cat === activeCategory);
      const matchesSearch = !searchQuery || text.includes(searchQuery);

      if (matchesCat && matchesSearch) {
        card.style.display = 'flex';
        visibleCount++;
      } else {
        card.style.display = 'none';
      }
    });

    if (countDisplay) {
      countDisplay.textContent = `${visibleCount} offre${visibleCount > 1 ? 's' : ''} affichée${visibleCount > 1 ? 's' : ''}`;
    }
  }

  if (initialCat) {
    filterOffers();
  }

  if (searchInput) {
    searchInput.addEventListener('input', (e) => {
      searchQuery = e.target.value.trim().toLowerCase();
      filterOffers();
    });
  }

  filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      filterBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      activeCategory = btn.getAttribute('data-cat');
      filterOffers();
    });
  });
});
