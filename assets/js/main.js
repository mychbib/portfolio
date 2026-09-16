document.addEventListener("DOMContentLoaded", () => {
  const toggle = document.querySelector(".nav-toggle");
  const links = document.querySelector(".nav-links");

  toggle?.addEventListener("click", () => {
    const open = links.classList.toggle("open");
    toggle.setAttribute("aria-expanded", String(open));
  });

  document.querySelectorAll(".nav-links a").forEach((link) => {
    link.addEventListener("click", () => {
      links?.classList.remove("open");
      toggle?.setAttribute("aria-expanded", "false");
    });
  });

  const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  if (!reduceMotion && "IntersectionObserver" in window) {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("is-visible");
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.12 });
    document.querySelectorAll(".reveal").forEach((el) => observer.observe(el));
  } else {
    document.querySelectorAll(".reveal").forEach((el) => el.classList.add("is-visible"));
  }

  function showMissing(element) {
    const frame = element.closest(".media-frame");
    if (!frame || frame.classList.contains("missing")) return;
    const filename = element.dataset.media || element.getAttribute("src") || "media file";
    frame.classList.add("missing");
    element.remove();
    frame.insertAdjacentHTML("beforeend", `
      <div class="missing-media-message">
        <strong>Media à ajouter</strong>
        Place <code>${filename}</code> dans <code>assets/media/</code>.
      </div>
    `);
  }

  document.querySelectorAll("img[data-media]").forEach((img) => {
    if (img.complete && img.naturalWidth === 0) showMissing(img);
    img.addEventListener("error", () => showMissing(img), { once: true });
  });

  document.querySelectorAll("video[data-media]").forEach((video) => {
    const source = video.querySelector("source");
    const fail = () => showMissing(video);
    video.addEventListener("error", fail, { once: true });
    source?.addEventListener("error", fail, { once: true });
  });

  document.querySelectorAll("[data-year]").forEach((el) => {
    el.textContent = new Date().getFullYear();
  });
});
