// Download highlighting and copy buttons. Neither depends on the motion code.

// Returns 'mac', 'windows', or null. Phones and tablets get null, since the
// desktop apps do not run there.
export function detectOS() {
  const ua = navigator.userAgent || '';
  if (/iPhone|iPad|iPod|Android/i.test(ua)) return null;
  // Some iPads report a Mac user agent. Real Macs have no touch screen.
  if (/Macintosh/.test(ua) && navigator.maxTouchPoints > 1) return null;

  const platform = navigator.userAgentData?.platform || navigator.platform || '';
  if (/^mac/i.test(platform) || /Macintosh/.test(ua)) return 'mac';
  if (/^win/i.test(platform) || /Windows/.test(ua)) return 'windows';
  return null;
}

// Marks the matching platform. Both platforms stay visible and clickable.
export function setupDownloads() {
  const os = detectOS();
  if (!os) return;

  const platform = document.querySelector(`[data-platform="${os}"]`);
  if (!platform) return;

  platform.classList.add('is-yours');
  platform.querySelector('.tag').hidden = false;
  platform.closest('.downloads')?.classList.add('has-match');
}

export function setupCopyButtons() {
  const status = document.getElementById('copy-status');

  document.querySelectorAll('[data-copy-target]').forEach((button) => {
    button.addEventListener('click', async () => {
      const source = document.getElementById(button.dataset.copyTarget);
      if (!source) return;

      // The motion code types into the config snippet, so it stores the full text here.
      const text = source.dataset.copy ?? source.textContent;
      const copied = await copyText(text);

      button.textContent = copied ? 'Copied' : 'Copy failed';
      if (status) status.textContent = copied ? 'Copied to the clipboard.' : 'Copy failed. Select the text and copy it by hand.';

      clearTimeout(button.resetTimer);
      button.resetTimer = setTimeout(() => {
        button.textContent = 'Copy';
      }, 1800);
    });
  });
}

async function copyText(text) {
  try {
    await navigator.clipboard.writeText(text);
    return true;
  } catch {
    // Fallback for browsers or pages that block the Clipboard API.
    const field = document.createElement('textarea');
    field.value = text;
    field.setAttribute('readonly', '');
    field.style.position = 'fixed';
    field.style.opacity = '0';
    document.body.append(field);
    field.select();
    const copied = document.execCommand('copy');
    field.remove();
    return copied;
  }
}
