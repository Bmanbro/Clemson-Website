// Keep folder navigation independent of the desktop window manager.
const explorer = document.querySelector('.explorer-app');
const tabs = [...explorer.querySelectorAll('[data-job]')];
const documents = [...explorer.querySelectorAll('[data-job-document]')];
const documentPane = explorer.querySelector('.explorer-document');
const back = explorer.querySelector('[data-explorer-back]');
const forward = explorer.querySelector('[data-explorer-forward]');
const path = explorer.querySelector('[data-explorer-path]');
const status = explorer.querySelector('[data-explorer-status]');
const scrollPositions = new Map();
let current = tabs.find(tab => tab.getAttribute('aria-selected') === 'true').dataset.job;
const history = [current];
let position = 0;

function openFolder(id, recordHistory = true) {
  const index = tabs.findIndex(tab => tab.dataset.job === id);
  if (index < 0 || (recordHistory && current === id)) return;

  scrollPositions.set(current, documentPane.scrollTop);
  current = id;
  if (recordHistory) {
    history.splice(position + 1);
    history.push(id);
    position = history.length - 1;
  }

  documents.forEach(document => {
    document.hidden = document.dataset.jobDocument !== id;
  });
  tabs.forEach(tab => {
    const selected = tab.dataset.job === id;
    tab.setAttribute('aria-selected', String(selected));
    tab.tabIndex = selected ? 0 : -1;
  });
  back.disabled = position === 0;
  forward.disabled = position === history.length - 1;
  path.textContent = tabs[index].textContent.trim();
  status.textContent = `${index + 1} of ${tabs.length} work folders`;
  documentPane.scrollTo({ top: scrollPositions.get(id) ?? 0, behavior: 'instant' });
}

tabs.forEach((tab, index) => {
  tab.addEventListener('click', () => openFolder(tab.dataset.job));
  tab.addEventListener('keydown', event => {
    let next;
    switch (event.key) {
      case 'ArrowDown': next = (index + 1) % tabs.length; break;
      case 'ArrowUp': next = (index - 1 + tabs.length) % tabs.length; break;
      case 'Home': next = 0; break;
      case 'End': next = tabs.length - 1; break;
      default: return;
    }
    event.preventDefault();
    tabs[next].focus();
    openFolder(tabs[next].dataset.job);
  });
});

back.addEventListener('click', () => {
  if (position > 0) openFolder(history[--position], false);
});
forward.addEventListener('click', () => {
  if (position < history.length - 1) openFolder(history[++position], false);
});
document.querySelectorAll('[data-open-job]').forEach(link => {
  link.addEventListener('click', event => {
    if (event.ctrlKey || event.metaKey || event.shiftKey || event.altKey) return;
    openFolder(link.dataset.openJob);
  });
});
