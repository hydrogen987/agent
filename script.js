(() => {
  const root = document.documentElement;
  const header = document.querySelector(".site-header");
  const progressBar = document.getElementById("progress-bar");
  const navLinks = Array.from(document.querySelectorAll(".nav-links a"));
  const navSections = navLinks
    .map((link) => document.getElementById(link.getAttribute("href").slice(1)))
    .filter(Boolean);
  const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  if ("IntersectionObserver" in window && !reduceMotion) {
    root.classList.add("js-reveal");

    const revealObserver = new IntersectionObserver(
      (entries, observer) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;
          entry.target.classList.add("is-visible");
          observer.unobserve(entry.target);
        });
      },
      { threshold: 0.12, rootMargin: "0px 0px -6% 0px" }
    );

    document.querySelectorAll(".reveal").forEach((element) => {
      revealObserver.observe(element);
    });
  }

  let ticking = false;

  const setActiveNav = () => {
    if (!navSections.length) return;

    const marker = window.scrollY + window.innerHeight * 0.32;
    let activeSection = navSections[0];

    navSections.forEach((section) => {
      if (section.offsetTop <= marker) activeSection = section;
    });

    navLinks.forEach((link) => {
      const isActive =
        window.scrollY > 140 && link.getAttribute("href") === `#${activeSection.id}`;

      if (isActive) {
        link.setAttribute("aria-current", "page");
      } else {
        link.removeAttribute("aria-current");
      }
    });
  };

  const updatePageState = () => {
    ticking = false;

    if (header) {
      header.classList.toggle("is-scrolled", window.scrollY > 12);
    }

    if (progressBar) {
      const scrollable = document.documentElement.scrollHeight - window.innerHeight;
      const progress = scrollable > 0 ? Math.min(window.scrollY / scrollable, 1) : 0;
      progressBar.style.width = `${(progress * 100).toFixed(2)}%`;
    }

    setActiveNav();
  };

  const requestUpdate = () => {
    if (ticking) return;
    ticking = true;
    window.requestAnimationFrame(updatePageState);
  };

  window.addEventListener("scroll", requestUpdate, { passive: true });
  window.addEventListener("resize", requestUpdate);
  window.addEventListener("load", requestUpdate);
  updatePageState();
})();
