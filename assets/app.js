function copyText(text, label) {
  if (!navigator.clipboard) {
    const ta = document.createElement("textarea"); ta.value = text; document.body.appendChild(ta); ta.select(); document.execCommand("copy"); document.body.removeChild(ta); showToast(label || "Copié !"); return;
  }
  navigator.clipboard.writeText(text).then(() => showToast(label || "✅ Copié : " + text));
}
function showToast(message) {
  let toast = document.getElementById("copy-toast");
  if (!toast) { toast = document.createElement("div"); toast.id = "copy-toast"; document.body.appendChild(toast); }
  toast.textContent = message; toast.classList.add("show");
  clearTimeout(window._toastTimer); window._toastTimer = setTimeout(() => toast.classList.remove("show"), 2600);
}

window.onscroll = function() {scrollFunction()};
function scrollFunction() {
  let btn = document.getElementById("scrollToTopBtn");
  if (!btn) return;
  if (document.body.scrollTop > 300 || document.documentElement.scrollTop > 300) {
    btn.style.display = "block";
  } else {
    btn.style.display = "none";
  }
}
function topFunction() {
  window.scrollTo({top: 0, behavior: 'smooth'});
}

document.addEventListener("DOMContentLoaded", () => {
  const now = new Date();
  const dateFr = now.toLocaleDateString('fr-FR', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' }).toUpperCase();
  const shortDateFr = now.toLocaleDateString('fr-FR', { day: 'numeric', month: 'long', year: 'numeric' });
  const bannerDateEl = document.getElementById("live-date-display");
  if (bannerDateEl) bannerDateEl.textContent = dateFr;
  document.querySelectorAll(".dynamic-verify-date").forEach(el => el.textContent = shortDateFr);
  
  const searchInput = document.getElementById("service-search");
  if (searchInput) {
    searchInput.addEventListener("input", (e) => {
      const q = e.target.value.toLowerCase().trim();
      document.querySelectorAll(".card[data-search]").forEach((card) => {
        const hay = card.getAttribute("data-search").toLowerCase();
        card.style.display = hay.includes(q) ? "flex" : "none";
      });
      document.querySelectorAll(".cat-section[data-cat-section]").forEach((sec) => {
        const visible = sec.querySelectorAll('.card[data-search]:not([style*="display: none"])').length;
        sec.style.display = visible > 0 ? "block" : "none";
      });
    });
  }
});
