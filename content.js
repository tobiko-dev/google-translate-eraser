(() => {
  const SHORTCUT_CODE = "Backquote";

  function isEditableTarget(target) {
    return Boolean(
      target?.closest?.(
        "input, textarea, [contenteditable='true'], [contenteditable='plaintext-only']"
      )
    );
  }

  function normalizedText(el) {
    return [
      el.getAttribute?.("aria-label"),
      el.getAttribute?.("title"),
      el.getAttribute?.("data-tooltip"),
      el.textContent
    ]
      .filter(Boolean)
      .join(" ")
      .replace(/\s+/g, " ")
      .trim()
      .toLowerCase();
  }

  function isImageMode() {
    if (new URL(location.href).searchParams.get("op") === "images") return true;

    return [...document.querySelectorAll("a, button, [role='tab'], [role='button']")].some((el) => {
      const text = normalizedText(el);
      if (!/\bimages?\b/.test(text)) return false;

      return (
        el.getAttribute("aria-selected") === "true" ||
        el.getAttribute("aria-current") === "page" ||
        el.classList.contains("active")
      );
    });
  }

  function alreadyEmpty() {
    const bodyText = document.body?.innerText?.toLowerCase() || "";
    return (
      bodyText.includes("drag and drop") &&
      (bodyText.includes("paste from clipboard") || bodyText.includes("browse your files"))
    );
  }

  function findClearButton() {
    const candidates = [...document.querySelectorAll("button, [role='button']")];

    const strong = candidates.find((el) => {
      const text = normalizedText(el);
      return /(?:clear|remove|close|delete).{0,18}(?:image|translation)|(?:image|translation).{0,18}(?:clear|remove|close|delete)/i.test(text);
    });
    if (strong) return strong;

    return candidates
      .filter((el) => /\b(close|clear|remove)\b/i.test(normalizedText(el)))
      .filter((el) => {
        const r = el.getBoundingClientRect();
        return (
          r.width > 0 &&
          r.height > 0 &&
          r.top > 100 &&
          r.top < 450 &&
          r.left > window.innerWidth * 0.55
        );
      })
      .sort((a, b) => b.getBoundingClientRect().left - a.getBoundingClientRect().left)[0] || null;
  }

  function showToast(message) {
    let toast = document.getElementById("gt-image-clear-toast");
    if (!toast) {
      toast = document.createElement("div");
      toast.id = "gt-image-clear-toast";
      document.documentElement.appendChild(toast);
    }

    toast.textContent = message;
    toast.classList.remove("show");
    void toast.offsetWidth;
    toast.classList.add("show");

    clearTimeout(showToast._timer);
    showToast._timer = setTimeout(() => toast.classList.remove("show"), 900);
  }

  function clearCurrentImage() {
    if (!isImageMode()) return false;

    if (alreadyEmpty()) {
      showToast("Ready for a new image");
      return true;
    }

    const clearButton = findClearButton();
    if (clearButton) {
      clearButton.click();

      setTimeout(() => {
        if (!alreadyEmpty()) location.reload();
      }, 450);

      return true;
    }

    location.reload();
    return true;
  }

  document.addEventListener(
    "keydown",
    (event) => {
      if (
        event.code !== SHORTCUT_CODE ||
        event.ctrlKey ||
        event.altKey ||
        event.metaKey ||
        event.repeat
      ) {
        return;
      }

      if (isEditableTarget(event.target)) return;

      if (clearCurrentImage()) {
        event.preventDefault();
        event.stopImmediatePropagation();
      }
    },
    true
  );
})();
