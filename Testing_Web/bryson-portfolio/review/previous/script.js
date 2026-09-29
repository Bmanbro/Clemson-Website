(() => {
  'use strict';

  const year = document.querySelector('[data-year]');
  if (year) year.textContent = String(new Date().getFullYear());

  const copyButton = document.querySelector('[data-copy-email]');
  const status = document.querySelector('.copy-status');
  if (!copyButton || !status) return;

  // Email and all navigation remain usable when JavaScript is unavailable.
  copyButton.hidden = false;
  copyButton.addEventListener('click', async () => {
    const email = copyButton.dataset.copyEmail;
    copyButton.disabled = true;
    let copied = false;
    let restoreFocus = false;
    try {
      if (navigator.clipboard && window.isSecureContext) {
        await navigator.clipboard.writeText(email);
        copied = true;
      } else {
        // Supports static sites served over HTTP, where Clipboard API is unavailable.
        const field = document.createElement('textarea');
        field.value = email;
        field.setAttribute('aria-label', 'Email address to copy');
        field.style.cssText = 'position:fixed;left:-10000px;top:0;font-size:16px';
        document.body.append(field);
        field.select();
        try { copied = document.execCommand('copy'); }
        finally { field.remove(); restoreFocus = true; }
      }
    } catch {
      copied = false;
    } finally {
      copyButton.disabled = false;
      if (restoreFocus) copyButton.focus({ preventScroll: true });
    }
    status.textContent = copied ? 'Email address copied. Say hello when you’re ready.' : 'Select the email address and copy it, or click it to open your mail app.';
    copyButton.textContent = copied ? 'COPIED' : 'COPY';
  });

  const sleeveNote = document.querySelector('.sleeve-sticker');
  document.addEventListener('keydown', (event) => {
    if (event.key === 'Escape' && sleeveNote?.open) {
      const containedFocus = sleeveNote.contains(document.activeElement);
      sleeveNote.open = false;
      if (containedFocus) sleeveNote.querySelector('summary').focus({ preventScroll: true });
    }
  });
})();
