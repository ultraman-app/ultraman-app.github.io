// The page works without this: it only picks your system's command, copies it, and plays the run once.
// (index.html marks the page with .js in its head, before anything is drawn.)

const install = document.querySelector('.install');
const tabs = [...document.querySelectorAll('.oses [role="tab"]')];

function pick(os, focus) {
  install.dataset.os = os;
  for (const t of tabs) {
    const on = t.dataset.os === os;
    t.setAttribute('aria-selected', String(on));
    t.tabIndex = on ? 0 : -1;
    if (on && focus) t.focus();
  }
}

const platform = (navigator.userAgentData?.platform || navigator.platform || '').toLowerCase();
pick(platform.includes('win') ? 'windows' : platform.includes('linux') ? 'linux' : 'mac', false);

for (const t of tabs) {
  t.addEventListener('click', () => pick(t.dataset.os, false));
  // Arrow keys move between the tabs, as in any tab list.
  t.addEventListener('keydown', e => {
    const step = e.key === 'ArrowRight' ? 1 : e.key === 'ArrowLeft' ? -1 : 0;
    if (!step) return;
    e.preventDefault();
    pick(tabs[(tabs.indexOf(t) + step + tabs.length) % tabs.length].dataset.os, true);
  });
}

// The copy icon turns into a check for a moment. If the browser won't copy, the command gets selected for Ctrl+C.
const CHECK = '<svg viewBox="0 0 24 24" width="16" height="16" aria-hidden="true"><path d="M5 12l5 5L20 7"/></svg>';
for (const b of document.querySelectorAll('.copy')) {
  const icon = b.innerHTML, label = b.getAttribute('aria-label');
  b.addEventListener('click', async () => {
    const code = b.previousElementSibling; // each Copy follows its own line
    try {
      await navigator.clipboard.writeText(code.textContent);
      b.innerHTML = CHECK;
      b.setAttribute('aria-label', 'Copied');
    } catch {
      getSelection().selectAllChildren(code);
    }
    setTimeout(() => { b.innerHTML = icon; b.setAttribute('aria-label', label); }, 1800);
  });
}

// Each line shows up after the previous one, a little slower than the real run so it can be followed: the run and
// the mock, each when it comes into view.
for (const run of document.querySelectorAll('.narrated')) {
  [...run.querySelectorAll('.line')].forEach((l, i) => l.style.setProperty('--at', `${180 + i * 140}ms`));
  new IntersectionObserver((entries, o) => {
    if (entries.some(e => e.isIntersecting)) { run.classList.add('played'); o.disconnect(); }
  }, { threshold: .4 }).observe(run);
}

// The diagram runs once, like the window shows a run, when most of it is in view.
const diagram = document.querySelector('.diagram');
new IntersectionObserver((entries, o) => {
  if (entries.some(e => e.isIntersecting)) { diagram.classList.add('played'); o.disconnect(); }
}, { threshold: .6 }).observe(diagram);
