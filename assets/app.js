// Copy to Clipboard & Instant Search Engine
function copyText(text, label) {
  if (!navigator.clipboard) {
    const textArea = document.createElement("textarea");
    textArea.value = text;
    document.body.appendChild(textArea);
    textArea.select();
    document.execCommand("copy");
    document.body.removeChild(textArea);
    showToast(label || "Copié dans le presse-papier !");
    return;
  }
  navigator.clipboard.writeText(text).then(() => {
    showToast(label || "✅ Code copié : " + text);
  });
}

function showToast(message) {
  let toast = document.getElementById("copy-toast");
  if (!toast) {
    toast = document.createElement("div");
    toast.id = "copy-toast";
    document.body.appendChild(toast);
  }
  toast.textContent = message;
  toast.classList.add("show");
  clearTimeout(window._toastTimer);
  window._toastTimer = setTimeout(() => {
    toast.classList.remove("show");
  }, 2600);
}

// Live Filter on Home Page
document.addEventListener("DOMContentLoaded", () => {
  const searchInput = document.getElementById("service-search");
  if (searchInput) {
    searchInput.addEventListener("input", (e) => {
      const q = e.target.value.toLowerCase().trim();
      const cards = document.querySelectorAll(".card[data-search]");
      cards.forEach((card) => {
        const hay = card.getAttribute("data-search").toLowerCase();
        card.style.display = hay.includes(q) ? "flex" : "none";
      });
      // Hide empty category sections
      document.querySelectorAll(".cat-section").forEach((sec) => {
        const visible = sec.querySelectorAll('.card[data-search]:not([style*="display: none"])').length;
        sec.style.display = visible > 0 ? "block" : "none";
      });
    });
  }
});
