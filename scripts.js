document.addEventListener('DOMContentLoaded', () => {

  /* ── Grain texture ── */
  const grain = document.getElementById('grain');
  if (grain) {
    const ctx = grain.getContext('2d');
    let w, h;

    function resize() {
      w = grain.width = window.innerWidth;
      h = grain.height = window.innerHeight;
    }
    resize();
    window.addEventListener('resize', resize);

    function noise() {
      const id = ctx.createImageData(w, h);
      const d = id.data;
      for (let i = 0; i < d.length; i += 4) {
        const v = (Math.random() * 255) | 0;
        d[i] = d[i+1] = d[i+2] = v;
        d[i+3] = 255;
      }
      ctx.putImageData(id, 0, 0);
      requestAnimationFrame(noise);
    }
    noise();
  }

  /* ── Navbar ── */
  const navbar = document.getElementById('navbar');
  window.addEventListener('scroll', () => {
    navbar.classList.toggle('scrolled', window.scrollY > 50);
  }, { passive: true });

  /* ── Mobile menu ── */
  const toggle = document.getElementById('navToggle');
  const navRight = document.querySelector('.nav-right');
  if (toggle) {
    toggle.addEventListener('click', () => navRight.classList.toggle('open'));
    navRight.querySelectorAll('a').forEach(a =>
      a.addEventListener('click', () => navRight.classList.remove('open'))
    );
  }

  /* ── Reveal ── */
  const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        revealObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });

  document.querySelectorAll('.reveal').forEach(el => revealObserver.observe(el));

  /* ── Parallax on hero rings ── */
  const rings = document.querySelector('.hero-ring-wrap');
  const glow = document.querySelector('.hero-glow');
  if (rings) {
    window.addEventListener('mousemove', (e) => {
      const x = (e.clientX / window.innerWidth - 0.5) * 2;
      const y = (e.clientY / window.innerHeight - 0.5) * 2;
      rings.style.transform = `translate(${x * 12}px, ${y * 12}px)`;
      if (glow) glow.style.transform = `translate(${x * -25}px, ${y * -25}px)`;
    }, { passive: true });
  }

  /* ── Smooth scroll ── */
  document.querySelectorAll('a[href^="#"]').forEach(a => {
    a.addEventListener('click', (e) => {
      const href = a.getAttribute('href');
      if (href === '#') return;
      const target = document.querySelector(href);
      if (target) {
        e.preventDefault();
        const top = target.getBoundingClientRect().top + window.pageYOffset - 80;
        window.scrollTo({ top, behavior: 'smooth' });
      }
    });
  });

  /* ── Form ── */
  const form = document.getElementById('contactForm');
  if (form) {
    form.addEventListener('submit', (e) => {
      e.preventDefault();
      const btn = form.querySelector('button');
      const orig = btn.textContent;
      btn.textContent = '✓ Enviado';
      btn.style.background = '#27ae60';
      setTimeout(() => {
        btn.textContent = orig;
        btn.style.background = '';
        form.reset();
      }, 3000);
    });
  }

});
