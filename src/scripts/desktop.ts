const desktop = document.querySelector<HTMLElement>(".portal-center");
const launchers = [
  ...document.querySelectorAll<HTMLAnchorElement>("[data-open-window]"),
];
const tasks = [...document.querySelectorAll<HTMLButtonElement>("[data-task]")];
const compact = window.matchMedia("(max-width: 760px), (max-height: 500px)");
const windows = [
  ...document.querySelectorAll<HTMLElement>("[data-window]"),
].map((element) => ({
  element,
  id: element.dataset.window!,
  title: element.dataset.title!,
  open: !element.hidden,
  minimized: false,
  maximized: false,
  order: 1,
}));
type DesktopWindow = (typeof windows)[number];
let order = 1;
let active = windows[0]?.id ?? "";

function sync() {
  windows.forEach((win) => {
    win.element.hidden = !win.open || win.minimized;
    win.element.classList.toggle("is-active", win.id === active);
    win.element.classList.toggle("is-maximized", win.maximized);
    win.element.style.zIndex = String(win.order);
    const maximize = win.element.querySelector<HTMLButtonElement>(
      '[data-action="maximize"]',
    );
    maximize?.setAttribute("aria-pressed", String(win.maximized));
    maximize?.setAttribute(
      "aria-label",
      `${win.maximized ? "Restore" : "Maximize"} ${win.title}`,
    );
    if (maximize) maximize.title = win.maximized ? "Restore" : "Maximize";
  });
  launchers.forEach((link) => {
    const win = windows.find((win) => win.id === link.dataset.openWindow)!;
    link.setAttribute("aria-controls", `window-${win.id}`);
    link.setAttribute("aria-expanded", String(win.open && !win.minimized));
    if (active === win.id) link.setAttribute("aria-current", "true");
    else link.removeAttribute("aria-current");
  });
  tasks.forEach((task) => {
    const win = windows.find((win) => win.id === task.dataset.task)!;
    task.hidden = !win.open;
    task.setAttribute(
      "aria-pressed",
      String(active === win.id && !win.minimized),
    );
    task.setAttribute(
      "aria-label",
      `${win.minimized ? "Restore" : "Switch to"} ${win.title}`,
    );
  });
}

function focusWindow(win: DesktopWindow) {
  active = win.id;
  win.order = ++order;
  sync();
}

function openWindow(id: string, updateHistory = true) {
  const win = windows.find((win) => win.id === id);
  if (!win) return;
  win.open = true;
  win.minimized = false;
  focusWindow(win);
  win.element
    .querySelector<HTMLElement>(".window-content")
    ?.focus({ preventScroll: true });
  if (updateHistory && location.hash !== `#${id}`)
    history.pushState(null, "", `#${id}`);
}

function hideWindow(win: DesktopWindow, close = false) {
  if (close) win.open = false;
  else win.minimized = true;
  if (active === win.id) {
    const next = windows
      .filter((other) => other.open && !other.minimized)
      .sort((a, b) => b.order - a.order)[0];
    active = next?.id ?? "";
    if (next)
      next.element
        .querySelector<HTMLElement>(".window-content")
        ?.focus({ preventScroll: true });
    else
      launchers
        .find((link) => link.dataset.openWindow === win.id)
        ?.focus({ preventScroll: true });
    history.replaceState(null, "", `#${active || "desktop"}`);
  }
  sync();
}

function moveWindow(win: DesktopWindow, left: number, top: number) {
  if (!desktop || win.maximized || compact.matches) return;
  win.element.style.left = `${Math.max(0, Math.min(left, desktop.clientWidth - win.element.offsetWidth))}px`;
  win.element.style.top = `${Math.max(0, Math.min(top, desktop.clientHeight - win.element.offsetHeight))}px`;
}

launchers.forEach((link) =>
  link.addEventListener("click", (event) => {
    if (event.ctrlKey || event.metaKey || event.shiftKey || event.altKey)
      return;
    event.preventDefault();
    openWindow(link.dataset.openWindow!);
  }),
);

tasks.forEach((task) =>
  task.addEventListener("click", () => {
    const win = windows.find((win) => win.id === task.dataset.task)!;
    if (win.id === active && !win.minimized) hideWindow(win);
    else openWindow(win.id);
  }),
);

windows.forEach((win) => {
  const handle = win.element.querySelector<HTMLElement>("[data-drag-handle]")!;
  win.element.addEventListener("pointerdown", () => focusWindow(win));
  win.element.addEventListener("focusin", () => {
    if (active !== win.id) focusWindow(win);
  });
  win.element
    .querySelectorAll<HTMLButtonElement>("[data-action]")
    .forEach((button) => {
      button.addEventListener("click", () => {
        if (button.dataset.action === "close") hideWindow(win, true);
        else if (button.dataset.action === "minimize") hideWindow(win);
        else {
          win.maximized = !win.maximized;
          focusWindow(win);
        }
      });
    });
  handle.addEventListener("dblclick", (event) => {
    if ((event.target as HTMLElement).closest("button") || compact.matches)
      return;
    win.maximized = !win.maximized;
    focusWindow(win);
  });
  handle.addEventListener("keydown", (event) => {
    if (
      event.target !== handle ||
      !["ArrowUp", "ArrowDown", "ArrowLeft", "ArrowRight"].includes(event.key)
    )
      return;
    event.preventDefault();
    const step = event.shiftKey ? 20 : 4;
    moveWindow(
      win,
      win.element.offsetLeft +
        (event.key === "ArrowLeft"
          ? -step
          : event.key === "ArrowRight"
            ? step
            : 0),
      win.element.offsetTop +
        (event.key === "ArrowUp"
          ? -step
          : event.key === "ArrowDown"
            ? step
            : 0),
    );
  });
  let drag: {
    pointer: number;
    x: number;
    y: number;
    left: number;
    top: number;
  } | null = null;
  handle.addEventListener("pointerdown", (event) => {
    if (
      event.button !== 0 ||
      compact.matches ||
      win.maximized ||
      (event.target as HTMLElement).closest("button")
    )
      return;
    drag = {
      pointer: event.pointerId,
      x: event.clientX,
      y: event.clientY,
      left: win.element.offsetLeft,
      top: win.element.offsetTop,
    };
    handle.setPointerCapture(event.pointerId);
    event.preventDefault();
  });
  handle.addEventListener("pointermove", (event) => {
    if (drag)
      moveWindow(
        win,
        drag.left + event.clientX - drag.x,
        drag.top + event.clientY - drag.y,
      );
  });
  const stopDrag = () => {
    drag = null;
  };
  handle.addEventListener("pointerup", stopDrag);
  handle.addEventListener("pointercancel", stopDrag);
  handle.addEventListener("lostpointercapture", stopDrag);
});

document.querySelector("#show-desktop")?.addEventListener("click", () => {
  windows.forEach((win) => {
    if (win.open) win.minimized = true;
  });
  active = "";
  sync();
  history.pushState(null, "", "#desktop");
});

function restoreHash() {
  const id = location.hash.slice(1).replace(/^window-/, "");
  if (id === "desktop") {
    windows.forEach((win) => {
      if (win.open) win.minimized = true;
    });
    active = "";
    sync();
  } else if (["education", "skills"].includes(id)) {
    if (compact.matches) openWindow("profile", false);
    const target = document.getElementById(
      `${id}-${compact.matches ? "mobile" : "sidebar"}`,
    );
    target?.scrollIntoView({ block: "nearest" });
    target?.focus({ preventScroll: true });
  } else
    openWindow(windows.some((win) => win.id === id) ? id : "profile", false);
}
window.addEventListener("hashchange", restoreHash);
window.addEventListener("popstate", restoreHash);
window.addEventListener("resize", () =>
  windows.forEach((win) => {
    if (win.open && !win.minimized)
      moveWindow(win, win.element.offsetLeft, win.element.offsetTop);
  }),
);
document.body.dataset.desktopReady = "true";
restoreHash();
