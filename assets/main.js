
// Theme toggle with localStorage
(() => {
  const root = document.documentElement;
  const themeToggle = document.getElementById('themeToggle');
  const themePreference = window.matchMedia('(prefers-color-scheme: dark)');
  const savedTheme = localStorage.getItem('theme');

  if (savedTheme === 'light' || savedTheme === 'dark') {
    root.setAttribute('data-theme', savedTheme);
  }

  function updateThemeControl() {
    if (!themeToggle) return;
    const isDark = root.getAttribute('data-theme')
      ? root.getAttribute('data-theme') === 'dark'
      : themePreference.matches;
    themeToggle.setAttribute('aria-pressed', String(isDark));
    themeToggle.setAttribute('aria-label', isDark ? 'Helles Farbschema aktivieren' : 'Dunkles Farbschema aktivieren');
    themeToggle.title = isDark ? 'Helles Farbschema aktivieren' : 'Dunkles Farbschema aktivieren';
  }

  updateThemeControl();
  themeToggle?.addEventListener('click', () => {
    const currentTheme = root.getAttribute('data-theme') || (themePreference.matches ? 'dark' : 'light');
    const nextTheme = currentTheme === 'dark' ? 'light' : 'dark';
    root.setAttribute('data-theme', nextTheme);
    localStorage.setItem('theme', nextTheme);
    updateThemeControl();
  });

  const menuToggle = document.querySelector('.nav-toggle');
  const menu = document.getElementById('menu');

  function closeMenu() {
    menu?.classList.remove('open');
    menuToggle?.setAttribute('aria-expanded', 'false');
    menuToggle?.setAttribute('aria-label', 'Menü öffnen');
    if (menuToggle) menuToggle.title = 'Menü öffnen';
  }

  menuToggle?.addEventListener('click', () => {
    const isOpen = menu?.classList.toggle('open') ?? false;
    menuToggle.setAttribute('aria-expanded', String(isOpen));
    menuToggle.setAttribute('aria-label', isOpen ? 'Menü schließen' : 'Menü öffnen');
    menuToggle.title = isOpen ? 'Menü schließen' : 'Menü öffnen';
  });

  menu?.querySelectorAll('a').forEach((link) => link.addEventListener('click', closeMenu));
  document.addEventListener('keydown', (event) => {
    if (event.key === 'Escape') closeMenu();
  });

  const networkVisual = document.querySelector('.network-visual');
  const networkDetail = document.getElementById('network-detail');
  const networkDetails = {
    wlan: 'Access Points verbinden deine Geräte; Roaming und Gäste-WLAN richten sich nach Wohnung und Hardware.',
    'smart-home': 'Home Assistant bündelt Integrationen; Sensoren und Automationen werden passend zum Setup eingebunden.',
    homelab: 'NAS und Proxmox profitieren von stabiler Anbindung und einem durchdachten Backup-Weg.'
  };

  networkVisual?.querySelectorAll('.network-endpoint').forEach((button) => {
    button.addEventListener('click', () => {
      const target = button.dataset.networkTarget;
      if (!target || !networkDetail || !networkDetails[target]) return;

      networkVisual.dataset.activeTarget = target;
      networkVisual.querySelectorAll('.network-endpoint').forEach((endpoint) => {
        endpoint.setAttribute('aria-pressed', String(endpoint === button));
      });
      networkDetail.textContent = networkDetails[target];
    });
  });
})();
