// Global nav, galleries and scroll reveals. No dependencies.

const root = document.documentElement;
const desktop = window.matchMedia("(min-width: 834px)");
const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");

/* Global nav -------------------------------------------------------------- */

function initGlobalNav() {
  const nav = document.querySelector(".gn");
  if (!nav) return;
  const curtain = document.querySelector(".gn-curtain");
  const menuTrigger = nav.querySelector(".gn-menu-trigger");
  const menus = [...nav.querySelectorAll("[data-gn-menu]")].map((item) => ({
    item,
    link: item.querySelector(".gn-link"),
    trigger: item.querySelector(".gn-submenu-trigger"),
    flyout: item.querySelector(".gn-flyout"),
    back: item.querySelector(".gn-back"),
  }));

  let open = null;
  let openTimer = 0;
  let closeTimer = 0;
  let lastPointer = "mouse";

  const clearTimers = () => {
    clearTimeout(openTimer);
    clearTimeout(closeTimer);
  };

  function show(menu) {
    clearTimers();
    if (open === menu) return;
    if (open) hide({ keepCurtain: true });
    open = menu;
    menu.item.classList.add("is-open");
    menu.trigger.setAttribute("aria-expanded", "true");
    if (desktop.matches) {
      nav.style.setProperty("--gn-flyout-h", `${menu.flyout.offsetHeight}px`);
      root.classList.add("gn-flyout-open");
    }
  }

  function hide({ keepCurtain = false } = {}) {
    clearTimers();
    if (!open) return;
    open.item.classList.remove("is-open");
    open.trigger.setAttribute("aria-expanded", "false");
    open = null;
    if (!keepCurtain) {
      nav.style.setProperty("--gn-flyout-h", "0px");
      root.classList.remove("gn-flyout-open");
    }
  }

  const scheduleClose = (delay = 120) => {
    clearTimeout(openTimer);
    clearTimeout(closeTimer);
    closeTimer = setTimeout(hide, delay);
  };

  function setMenuOpen(isOpen) {
    root.classList.toggle("gn-menu-open", isOpen);
    menuTrigger.setAttribute("aria-expanded", String(isOpen));
    if (!isOpen) hide();
  }

  nav.addEventListener("pointerdown", (event) => { lastPointer = event.pointerType; });

  for (const menu of menus) {
    // Desktop: hover opens, after a short pause so passing over the bar doesn't flash menus.
    menu.item.addEventListener("pointerenter", (event) => {
      if (!desktop.matches || event.pointerType === "touch") return;
      clearTimeout(closeTimer);
      if (open) show(menu);
      else openTimer = setTimeout(() => show(menu), 120);
    });

    menu.link.addEventListener("click", (event) => {
      // Small screens: the link opens its submenu instead of navigating.
      if (!desktop.matches) {
        event.preventDefault();
        show(menu);
        menu.back.focus();
        return;
      }
      // Touch on a large screen: first tap opens the flyout, second tap follows the link.
      if (lastPointer === "touch" && open !== menu) {
        event.preventDefault();
        show(menu);
      }
    });

    menu.trigger.addEventListener("click", () => {
      if (open === menu) return hide();
      show(menu);
      menu.flyout.querySelector("a")?.focus();
    });

    menu.back.addEventListener("click", () => {
      hide();
      menu.link.focus();
    });

    // Close a keyboard-opened flyout once focus leaves it.
    menu.item.addEventListener("focusout", (event) => {
      if (desktop.matches && open === menu && !menu.item.contains(event.relatedTarget)) hide();
    });
  }

  // Hovering the logo or About closes any flyout, as does leaving the nav.
  for (const item of nav.querySelectorAll(".gn-item:not([data-gn-menu])")) {
    item.addEventListener("pointerenter", (event) => {
      if (desktop.matches && event.pointerType !== "touch" && open) scheduleClose(80);
    });
  }
  nav.addEventListener("pointerleave", (event) => {
    if (desktop.matches && event.pointerType !== "touch") scheduleClose();
  });
  nav.addEventListener("pointerenter", () => clearTimeout(closeTimer));
  curtain?.addEventListener("click", () => hide());

  menuTrigger.addEventListener("click", () => setMenuOpen(!root.classList.contains("gn-menu-open")));

  document.addEventListener("keydown", (event) => {
    if (event.key !== "Escape") return;
    if (open) {
      const menu = open;
      hide();
      (desktop.matches ? menu.trigger : menu.link).focus();
    } else if (root.classList.contains("gn-menu-open")) {
      setMenuOpen(false);
      menuTrigger.focus();
    }
  });

  // Moving between the menu and the bar resets everything.
  desktop.addEventListener("change", () => setMenuOpen(false));
  window.addEventListener("pageshow", () => setMenuOpen(false));
}

/* Galleries --------------------------------------------------------------- */

function initGalleries() {
  for (const gallery of document.querySelectorAll("[data-gallery]")) {
    const track = gallery.querySelector("[data-gallery-track]");
    const prev = gallery.querySelector("[data-gallery-prev]");
    const next = gallery.querySelector("[data-gallery-next]");
    const step = () => {
      const card = track.firstElementChild;
      const gap = parseFloat(getComputedStyle(track).columnGap) || 0;
      return card ? card.offsetWidth + gap : track.clientWidth;
    };
    const update = () => {
      prev.disabled = track.scrollLeft <= 1;
      next.disabled = track.scrollLeft + track.clientWidth >= track.scrollWidth - 1;
    };
    const behavior = () => (reducedMotion.matches ? "auto" : "smooth");
    prev.addEventListener("click", () => track.scrollBy({ left: -step(), behavior: behavior() }));
    next.addEventListener("click", () => track.scrollBy({ left: step(), behavior: behavior() }));
    track.addEventListener("scroll", update, { passive: true });
    window.addEventListener("resize", update);
    update();
  }
}

/* Scroll reveal ----------------------------------------------------------- */

function initReveal() {
  const items = document.querySelectorAll(".reveal");
  if (reducedMotion.matches || !("IntersectionObserver" in window)) {
    items.forEach((el) => el.classList.add("is-visible"));
    return;
  }
  const observer = new IntersectionObserver(
    (entries) => {
      for (const entry of entries) {
        if (!entry.isIntersecting) continue;
        entry.target.classList.add("is-visible");
        observer.unobserve(entry.target);
      }
    },
    { rootMargin: "0px 0px -8% 0px" },
  );
  items.forEach((el) => observer.observe(el));
}

initGlobalNav();
initGalleries();
initReveal();
