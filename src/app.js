document.documentElement.classList.replace('no-js', 'js');

// Mobile navigation uses the native link order and retains keyboard navigation.
const toggle = document.querySelector('.menu-toggle');
const nav = document.querySelector('#main-nav');
const closeMenu = () => { toggle.setAttribute('aria-expanded', 'false'); nav.classList.remove('is-open'); };
toggle.addEventListener('click', () => {
  const expanded = toggle.getAttribute('aria-expanded') === 'true';
  toggle.setAttribute('aria-expanded', String(!expanded));
  nav.classList.toggle('is-open', !expanded);
});
nav.addEventListener('click', event => { if (event.target.closest('a')) closeMenu(); });
document.addEventListener('keydown', event => { if (event.key === 'Escape') closeMenu(); });
document.addEventListener('click', event => { if (!event.target.closest('.header-inner')) closeMenu(); });

function filterButtons(selector, action) {
  const buttons = [...document.querySelectorAll(selector)];
  buttons.forEach(button => button.addEventListener('click', () => {
    buttons.forEach(other => other.setAttribute('aria-pressed', String(other === button)));
    action(button);
  }));
}

filterButtons('[data-project-filter]', button => {
  const filter = button.dataset.projectFilter;
  let count = 0;
  document.querySelectorAll('[data-category]').forEach(card => {
    card.hidden = filter !== 'all' && card.dataset.category !== filter;
    if (!card.hidden) count++;
  });
  document.querySelector('#project-status').textContent = `Počet zobrazených projektů a aktivit: ${count}.`;
});

filterButtons('[data-year]', button => {
  let count = 0;
  document.querySelectorAll('[data-timeline-year]').forEach(item => {
    item.hidden = button.dataset.year !== 'all' && item.dataset.timelineYear !== button.dataset.year;
    if (!item.hidden) count++;
  });
  document.querySelector('#timeline-status').textContent = `Počet zobrazených milníků: ${count}.`;
});

const profiles = {
  morning: { label: 'ranní špička', values: [155,160,154,162,145,148,131,100,52,45,78,54,90,115,103,118,127,106,119,112,136,126,143,148,146] },
  steady: { label: 'stálý provoz', values: [112,106,114,111,105,110,107,101,105,110,104,109,103,106,111,104,109,105,111,102,108,105,113,110,108] },
  evening: { label: 'večerní špička', values: [158,162,156,160,152,156,143,148,144,151,147,139,142,130,112,91,53,32,55,42,79,108,130,147,155] }
};
filterButtons('[data-profile]', button => {
  const profile = profiles[button.dataset.profile];
  const path = profile.values.map((y, i) => `${i?'L':'M'}${i * 20} ${y}`).join(' ');
  document.querySelector('#energy-line').setAttribute('d', path);
  document.querySelector('#energy-area').setAttribute('d', `${path}V200H0Z`);
  document.querySelector('#chart-desc').textContent = `Smyšlená data: ${profile.label}. Autorská ilustrace tématu, nikoli výstup soutěžního projektu.`;
  document.querySelector('#chart-status').textContent = `Ilustrační profil: ${profile.label}. Nejde o skutečná soutěžní data.`;
});

let dialogTrigger;
document.querySelectorAll('[data-dialog]').forEach(trigger => {
  const dialog = document.getElementById(trigger.dataset.dialog);
  trigger.addEventListener('click', event => {
    if (typeof dialog.showModal !== 'function') return;
    event.preventDefault();
    dialogTrigger = trigger;
    dialog.showModal();
    document.body.classList.add('dialog-open');
  });
});
document.querySelectorAll('dialog').forEach(dialog => {
  dialog.querySelector('.close-dialog').addEventListener('click', () => dialog.close());
  dialog.addEventListener('click', event => {
    const rect = dialog.getBoundingClientRect();
    if (event.target === dialog && (event.clientX < rect.left || event.clientX > rect.right || event.clientY < rect.top || event.clientY > rect.bottom)) dialog.close();
  });
  dialog.addEventListener('close', () => {
    document.body.classList.remove('dialog-open');
    dialogTrigger?.focus();
  });
});

// Source citations open their disclosure and retain a meaningful URL fragment.
function openSource(hash, focus = false) {
  if (!hash.startsWith('#zdroj-')) return;
  const source = document.getElementById(hash.slice(1));
  if (!(source instanceof HTMLDetailsElement)) return;
  source.open = true;
  if (focus) source.querySelector('summary').focus({ preventScroll: true });
}
document.querySelectorAll('.refs a').forEach(link => link.addEventListener('click', event => {
  event.preventDefault();
  if (location.hash !== link.hash) history.pushState(null, '', link.hash);
  openSource(link.hash, true);
  document.getElementById(link.hash.slice(1)).scrollIntoView({ block: 'start' });
}));
window.addEventListener('hashchange', () => openSource(location.hash, true));
openSource(location.hash);

// Motion is decorative. All content is visible by default, including without JS.
if ('IntersectionObserver' in window) {
  const sections = [...document.querySelectorAll('main > section[id]')];
  const observer = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (!entry.isIntersecting) return;
      document.querySelectorAll('#main-nav a').forEach(link => {
        if (link.hash === `#${entry.target.id}`) link.setAttribute('aria-current', 'location');
        else link.removeAttribute('aria-current');
      });
    });
  }, { rootMargin: '-15% 0px -65% 0px' });
  sections.forEach(section => observer.observe(section));
}
