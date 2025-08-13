(function () {
  const STORAGE_KEY = "spoilers";
  // Read persisted state ASAP; apply class before paint to avoid flashes
  const initialOn = (typeof localStorage !== "undefined" && localStorage.getItem(STORAGE_KEY) === "on");
  if (initialOn) document.documentElement.classList.add("spoilers-on");

  function setAriaHiddenForSpoilers(on) {
    document.querySelectorAll(".spoiler").forEach(el => {
      // hidden from AT when OFF, exposed when ON
      el.setAttribute("aria-hidden", on ? "false" : "true");
    });
  }

  function apply(on, btn) {
    document.documentElement.classList.toggle("spoilers-on", on);
    try { localStorage.setItem(STORAGE_KEY, on ? "on" : "off"); } catch (_) {}
    if (btn) {
      btn.setAttribute("aria-pressed", on ? "true" : "false");
      btn.textContent = on ? "Hide spoilers" : "Show spoilers";
    }
    setAriaHiddenForSpoilers(on);
  }

  // Defer DOM work
  document.addEventListener("DOMContentLoaded", () => {
    // If a toggle already exists in your markup, reuse it; otherwise create one
    let btn = document.getElementById("toggleSpoilers");
    if (!btn) {
      btn = document.createElement("button");
      btn.id = "toggleSpoilers";
      btn.type = "button";
      btn.className = "spoiler-toggle";
      // place it into the nav if present, else pin to top
      const spoiler_span = document.querySelector("span.spoiler");
      const nav = document.querySelector("div.spoiler_btn");
      if (nav && spoiler_span) {
        // a subtle separator
        const sep = document.createElement("span");
        sep.textContent = " ";
        nav.appendChild(sep);
        nav.appendChild(btn);
      } 
    }

    // Initialize button state/label
    btn.setAttribute("aria-pressed", initialOn ? "true" : "false");
    btn.setAttribute("aria-label", "Toggle spoilers visibility");
    btn.textContent = initialOn ? "Hide spoilers" : "Show spoilers";

    // Ensure current spoilers have correct aria-hidden
    setAriaHiddenForSpoilers(initialOn);

    // Click handler
    btn.addEventListener("click", () => {
      const on = !document.documentElement.classList.contains("spoilers-on");
      apply(on, btn);
    });
  });
})();
