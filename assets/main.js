
// Theme toggle with localStorage
(function() {
  const root = document.documentElement;
  const stored = localStorage.getItem('theme');
  if (stored) root.setAttribute('data-theme', stored);
  const btn = document.getElementById('themeToggle');
  if (btn) {
    updateBtn();
    btn.addEventListener('click', () => {
      const current = root.getAttribute('data-theme') === 'dark' ? 'light' : 'dark';
      root.setAttribute('data-theme', current);
      localStorage.setItem('theme', current);
      updateBtn();
    });
  }
  function updateBtn() {
    const t = root.getAttribute('data-theme') || (window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light');
    const sun = '☀️', moon = '🌙';
    const btn = document.getElementById('themeToggle');
    if (btn) btn.textContent = t === 'dark' ? sun : moon;
  }

  // mobile menu
  const toggle = document.querySelector('.nav-toggle');
  const menu = document.getElementById('menu');
  if (toggle && menu) {
    toggle.addEventListener('click', () => {
      const open = menu.classList.toggle('open');
      toggle.setAttribute('aria-expanded', String(open));
    });
  }

  // contact form
  const form = document.getElementById('contactForm');
  if (form) {
    form.addEventListener('submit', async (e) => {
      e.preventDefault();
      const data = Object.fromEntries(new FormData(form).entries());
      const status = document.getElementById('formStatus');
      const valid = validate(form);
      if (!valid) return;
      // Demo endpoint: replace with your backend
      await new Promise(r => setTimeout(r, 600));
      status.textContent = '✅ Thanks! Your message was “sent” (demo). Replace with your API endpoint.';
      form.reset();
    });
    ['input','blur','change'].forEach(evt => form.addEventListener(evt, () => validate(form), true));
  }

  function validate(form) {
    let ok = true;
    form.querySelectorAll('.field').forEach((wrap) => {
      const input = wrap.querySelector('input, textarea');
      const small = wrap.querySelector('.error');
      if (!input) return;
      let msg = '';
      if (input.hasAttribute('required') && !input.value.trim()) msg = 'Required';
      if (!msg && input.type === 'email' && !/^\S+@\S+\.\S+$/.test(input.value)) msg = 'Enter a valid email';
      if (!msg && input.hasAttribute('minlength') && input.value.length < Number(input.getAttribute('minlength'))) {
        msg = `Must be at least ${input.getAttribute('minlength')} characters`;
      }
      small.textContent = msg;
      if (msg) ok = false;
    });
    return ok;
  }
})();

// --- Interaktiver Molekül-Hintergrund ---
document.addEventListener('DOMContentLoaded', () => {
  // Canvas einfügen
  const canvas = document.createElement('canvas');
  canvas.id = 'bg-molecules';
  canvas.style.position = 'fixed';
  canvas.style.top = 0;
  canvas.style.left = 0;
  canvas.style.width = '100vw';
  canvas.style.height = '100vh';
  canvas.style.zIndex = '-1';
  canvas.style.pointerEvents = 'none';
  document.body.prepend(canvas);

  const ctx = canvas.getContext('2d');
  let width = window.innerWidth;
  let height = window.innerHeight;
  canvas.width = width;
  canvas.height = height;

  window.addEventListener('resize', () => {
    width = window.innerWidth;
    height = window.innerHeight;
    canvas.width = width;
    canvas.height = height;
  });

  // Partikel/Moleküle
  let MOLECULES = 70;
  const molecules = [];
  function spawnMolecule(x, y) {
    molecules.push({
      x: x !== undefined ? x : Math.random() * width,
      y: y !== undefined ? y : Math.random() * height,
      vx: (Math.random() - 0.5) * 0.5, // träger
      vy: (Math.random() - 0.5) * 0.5,
      r: 2 + Math.random() * 1.5,
      alpha: 1
    });
  }
  for (let i = 0; i < MOLECULES; i++) spawnMolecule();

  // Maus-Tracking
  let mouse = { x: width/2, y: height/2, active: false };
  window.addEventListener('mousemove', e => {
    mouse.x = e.clientX;
    mouse.y = e.clientY;
    mouse.active = true;
  });
  window.addEventListener('mouseout', () => { mouse.active = false; });

  function animate() {
    ctx.clearRect(0, 0, width, height);
    // Moleküle bewegen
    for (let m of molecules) {
      // Magnetismus zur Maus
      if (mouse.active) {
        const dx = mouse.x - m.x;
        const dy = mouse.y - m.y;
        const dist = Math.sqrt(dx*dx + dy*dy);
        if (dist < 340) { // Reichweite noch etwas erhöht
          // Anziehungskraft
          const force = (340 - dist) / 340 * 0.08;
          m.vx += force * dx / dist;
          m.vy += force * dy / dist;
        }
      }
      // Bewegung dämpfen (träger)
      m.vx *= 0.93;
      m.vy *= 0.93;
      m.x += m.vx;
      m.y += m.vy;
      // Ränder
      if (m.x < m.r) { m.x = m.r; m.vx *= -0.7; }
      if (m.x > width - m.r) { m.x = width - m.r; m.vx *= -0.7; }
      if (m.y < m.r) { m.y = m.r; m.vy *= -0.7; }
      if (m.y > height - m.r) { m.y = height - m.r; m.vy *= -0.7; }
    }

    // Moleküle verschwinden lassen, wenn zu viele auf einer Stelle
    for (let i = molecules.length - 1; i >= 0; i--) {
      let count = 0;
      for (let j = 0; j < molecules.length; j++) {
        if (i === j) continue;
        const dx = molecules[i].x - molecules[j].x;
        const dy = molecules[i].y - molecules[j].y;
        const dist = Math.sqrt(dx*dx + dy*dy);
        if (dist < 18) count++;
      }
      if (count > 3) {
        molecules[i].alpha -= 0.01 * (count-2); // schneller bei mehr Überlappung
        if (molecules[i].alpha <= 0) molecules.splice(i, 1);
      } else if (molecules[i].alpha < 1) {
        molecules[i].alpha += 0.01;
        if (molecules[i].alpha > 1) molecules[i].alpha = 1;
      }
    }

    // Neue Moleküle spawnen, wo keine sind
    if (molecules.length < MOLECULES) {
      // Finde leere Stellen
      let tries = 0;
      while (molecules.length < MOLECULES && tries < 10) {
        const x = Math.random() * width;
        const y = Math.random() * height;
        let tooClose = false;
        for (let m of molecules) {
          const dx = m.x - x, dy = m.y - y;
          if (Math.sqrt(dx*dx + dy*dy) < 18) { tooClose = true; break; }
        }
        if (!tooClose) spawnMolecule(x, y);
        tries++;
      }
    }

    // Moleküle zeichnen
    for (let m of molecules) {
      ctx.save();
      ctx.globalAlpha = m.alpha;
      ctx.beginPath();
      ctx.arc(m.x, m.y, m.r, 0, 2 * Math.PI);
      ctx.fillStyle = 'rgba(80,160,255,0.18)';
      ctx.fill();
      ctx.strokeStyle = 'rgba(80,160,255,0.35)';
      ctx.lineWidth = 1.2;
      ctx.stroke();
      ctx.restore();
    }
    requestAnimationFrame(animate);
  }
  animate();
});
