/* Small, optional enhancements. All resume content lives in index.html. */
(() => {
  "use strict";

  const root = document.documentElement;
  const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
  const mobileViewport = window.matchMedia("(max-width: 767px)");
  const menuToggle = document.querySelector(".menu-toggle");
  const navigation = document.querySelector("#primary-nav");
  const motionToggle = document.querySelector("#motion-toggle");
  const motionLabel = motionToggle?.querySelector(".motion-label");
  const revealElements = [...document.querySelectorAll(".reveal")];
  const storageKey = "bryson-motion-preference";
  let savedMotion = null;
  let revealObserver = null;

  try {
    const preference = window.localStorage.getItem(storageKey);
    if (preference === "paused" || preference === "running") savedMotion = preference;
  } catch {
    // Storage may be unavailable for local files or private browsing.
  }

  const revealAll = () => {
    revealObserver?.disconnect();
    revealElements.forEach((element) => {
      element.classList.add("is-visible");
      element.classList.remove("reveal-ready");
    });
  };

  const applyMotion = (preference) => {
    const paused = reducedMotion.matches || preference === "paused";
    root.dataset.motion = paused ? "paused" : "running";
    if (motionToggle) {
      motionToggle.setAttribute("aria-pressed", String(paused));
      motionToggle.disabled = reducedMotion.matches;
      motionToggle.title = reducedMotion.matches
        ? "Motion is paused by your system's reduced-motion preference."
        : "Pause or resume decorative motion";
    }
    if (motionLabel) motionLabel.textContent = paused ? "Motion paused" : "Pause motion";
    if (paused) revealAll();
  };

  applyMotion(savedMotion);

  if (motionToggle) {
    motionToggle.hidden = false;
    motionToggle.addEventListener("click", () => {
      savedMotion = root.dataset.motion === "paused" ? "running" : "paused";
      try {
        window.localStorage.setItem(storageKey, savedMotion);
      } catch {
        // The control still works when its preference cannot be saved.
      }
      applyMotion(savedMotion);
    });
  }

  const listenForMediaChange = (query, handler) => {
    if (query.addEventListener) query.addEventListener("change", handler);
    else query.addListener(handler);
  };

  listenForMediaChange(reducedMotion, () => applyMotion(savedMotion));

  if (menuToggle && navigation) {
    const closeMenu = (restoreFocus = false) => {
      document.body.classList.remove("menu-open");
      menuToggle.setAttribute("aria-expanded", "false");
      if (restoreFocus) menuToggle.focus();
    };

    menuToggle.setAttribute("aria-controls", navigation.id);
    menuToggle.setAttribute("aria-expanded", "false");
    menuToggle.hidden = false;
    menuToggle.addEventListener("click", () => {
      if (!mobileViewport.matches) return;
      const open = menuToggle.getAttribute("aria-expanded") !== "true";
      menuToggle.setAttribute("aria-expanded", String(open));
      document.body.classList.toggle("menu-open", open);
    });

    navigation.addEventListener("click", (event) => {
      if (event.target instanceof Element && event.target.closest("a")) closeMenu();
    });

    document.addEventListener("keydown", (event) => {
      if (event.key === "Escape" && menuToggle.getAttribute("aria-expanded") === "true") {
        closeMenu(true);
      }
    });

    document.addEventListener("click", (event) => {
      if (
        menuToggle.getAttribute("aria-expanded") === "true" &&
        event.target instanceof Node &&
        !navigation.contains(event.target) &&
        !menuToggle.contains(event.target)
      ) closeMenu();
    });

    listenForMediaChange(mobileViewport, () => closeMenu());
  }

  // Apply the enhanced navigation class only after its controls are connected.
  root.classList.add("js");

  if ("IntersectionObserver" in window) {
    if (root.dataset.motion !== "paused") {
      revealObserver = new IntersectionObserver((entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;
          entry.target.classList.add("is-visible");
          revealObserver.unobserve(entry.target);
          // Retain the transition class until the entrance has completed.
          window.setTimeout(() => entry.target.classList.remove("reveal-ready"), 800);
        });
      }, { threshold: 0.06, rootMargin: "0px 0px 24px 0px" });

      revealElements.forEach((element) => {
        element.classList.add("reveal-ready");
        revealObserver.observe(element);
      });
    }

    const navLinks = [...(navigation?.querySelectorAll('a[href^="#"]') || [])];
    const sections = [...document.querySelectorAll("section[data-nav-section][id]")];
    const footer = document.querySelector(".site-footer");
    const setActiveSection = () => {
      const targetLine = window.innerHeight * 0.3;
      let activeId = "";
      let closestDistance = Infinity;

      sections.forEach((section) => {
        const bounds = section.getBoundingClientRect();
        if (bounds.bottom <= window.innerHeight * 0.15 || bounds.top >= window.innerHeight * 0.7) return;
        const distance = bounds.top <= targetLine && bounds.bottom >= targetLine
          ? 0
          : Math.min(Math.abs(bounds.top - targetLine), Math.abs(bounds.bottom - targetLine));
        if (distance < closestDistance) {
          closestDistance = distance;
          activeId = section.id;
        }
      });

      // The final section cannot always reach the activation line on short screens.
      // Seeing the footer means Contact is the last visible destination.
      if (footer && footer.getBoundingClientRect().top < window.innerHeight && sections.length) {
        activeId = sections[sections.length - 1].id;
      }

      navLinks.forEach((link) => {
        if (link.getAttribute("href") === `#${activeId}`) {
          link.setAttribute("aria-current", "location");
        } else {
          link.removeAttribute("aria-current");
        }
      });
    };

    if (navLinks.length && sections.length) {
      let sectionObserver = null;
      let resizeFrame = null;
      const observeSections = () => {
        sectionObserver?.disconnect();
        // Percentage root margins resolve against width, including vertical ones.
        // Pixels keep this activation region proportional to viewport height.
        const topMargin = Math.round(window.innerHeight * 0.15);
        const bottomMargin = Math.round(window.innerHeight * 0.3);
        sectionObserver = new IntersectionObserver(setActiveSection, {
          rootMargin: `-${topMargin}px 0px -${bottomMargin}px 0px`,
          threshold: [0, 0.1, 0.25, 0.5, 0.75, 1],
        });
        sections.forEach((section) => sectionObserver.observe(section));
        setActiveSection();
      };

      observeSections();
      window.addEventListener("resize", () => {
        if (resizeFrame !== null) return;
        resizeFrame = window.requestAnimationFrame(() => {
          resizeFrame = null;
          observeSections();
        });
      });

      if (footer) {
        const footerObserver = new IntersectionObserver(setActiveSection, { threshold: [0, 0.1, 1] });
        footerObserver.observe(footer);
      }
    }
  } else {
    revealAll();
  }

  document.querySelectorAll("[data-year]").forEach((element) => {
    element.textContent = String(new Date().getFullYear());
  });
})();
