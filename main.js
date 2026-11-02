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

for (const b of document.querySelectorAll('.copy')) {
  b.addEventListener('click', async () => {
    try {
      await navigator.clipboard.writeText(b.parentElement.querySelector('code').textContent);
      b.textContent = 'Copied';
    } catch {
      b.textContent = 'Select it';
    }
    setTimeout(() => { b.textContent = 'Copy'; }, 1800);
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
