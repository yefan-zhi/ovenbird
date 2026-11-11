// Copy BibTeX to clipboard when clicking a .bibtex-copy link, then show a toast.
// Uses event delegation so it keeps working with navigation.instant.
(function () {
  function showToast(message) {
    var toast = document.createElement("div");
    toast.className = "bibtex-toast";
    toast.textContent = message;
    document.body.appendChild(toast);
    requestAnimationFrame(function () { toast.classList.add("show"); });
    setTimeout(function () {
      toast.classList.remove("show");
      setTimeout(function () { toast.remove(); }, 300);
    }, 2000);
  }

  function fallbackCopy(text) {
    var ta = document.createElement("textarea");
    ta.value = text;
    ta.style.position = "fixed";
    ta.style.top = "0";
    ta.style.opacity = "0";
    document.body.appendChild(ta);
    ta.focus({ preventScroll: true });
    ta.select();
    var ok = false;
    try { ok = document.execCommand("copy"); } catch (e) {}
    ta.remove();
    return ok;
  }

  function handle(e) {
    var link = e.target.closest && e.target.closest(".bibtex-copy");
    if (!link) return;
    if (e.type === "keydown" && e.key !== "Enter" && e.key !== " ") return;
    e.preventDefault();
    var text = link.getAttribute("data-bibtex");
    var done = function () { showToast("BibTeX copied to clipboard"); };
    var fail = function () {
      if (fallbackCopy(text)) done();
      else showToast("Failed to copy BibTeX");
    };
    if (navigator.clipboard && window.isSecureContext) {
      navigator.clipboard.writeText(text).then(done, fail);
    } else {
      fail();
    }
  }

  document.addEventListener("click", handle);
  document.addEventListener("keydown", handle);
})();
