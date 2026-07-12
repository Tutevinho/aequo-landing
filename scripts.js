document.addEventListener('DOMContentLoaded', () => {
  gsap.registerPlugin(ScrollTrigger);

  /* ── Hero parallax ── */
  gsap.to('.hero-circle', {
    y: -120, scale: 1.15, ease: 'none',
    scrollTrigger: { trigger: '.hero', start: 'top top', end: 'bottom top', scrub: 1 },
  });
  gsap.to('.hero-content', {
    y: 80, opacity: 0.4, ease: 'none',
    scrollTrigger: { trigger: '.hero', start: 'top top', end: 'bottom top', scrub: 1 },
  });

  /* ── Hero entrance ── */
  const heroTl = gsap.timeline({ defaults: { ease: 'power4.out' } });
  gsap.set('.hero-circle', { scale: 0.6, opacity: 0 });
  gsap.set('.hero-title', { y: 50, opacity: 0 });
  gsap.set('.hero-title .text-green', { scale: 0.85, opacity: 0 });
  gsap.set('.hero-desc', { y: 20, opacity: 0 });
  gsap.set('.hero-actions a', { y: 15, opacity: 0 });
  heroTl
    .to('.hero-circle', { scale: 1, opacity: 1, duration: 1.4 })
    .to('.hero-title', { y: 0, opacity: 1, duration: 1 }, '-=0.8')
    .to('.hero-title .text-green', { scale: 1, opacity: 1, duration: 0.7 }, '-=0.4')
    .to('.hero-desc', { y: 0, opacity: 1, duration: 0.6 }, '-=0.3')
    .to('.hero-actions a', { y: 0, opacity: 1, duration: 0.5, stagger: 0.1 }, '-=0.3');

  /* ── Navbar ── */
  const navbar = document.getElementById('navbar');
  ScrollTrigger.create({
    start: 'top -60px',
    onUpdate: (self) => navbar.classList.toggle('scrolled', self.progress > 0),
  });

  /* ── Feature card tilt on hover ── */
  document.querySelectorAll('.feature').forEach(card => {
    card.addEventListener('mousemove', (e) => {
      const rect = card.getBoundingClientRect();
      const x = (e.clientX - rect.left) / rect.width - 0.5;
      const y = (e.clientY - rect.top) / rect.height - 0.5;
      gsap.to(card, { rotationX: y * -4, rotationY: x * 4, transformPerspective: 800, duration: 0.4, ease: 'power2.out' });
    });
    card.addEventListener('mouseleave', () => {
      gsap.to(card, { rotationX: 0, rotationY: 0, duration: 0.4, ease: 'power2.out' });
    });
  });

  /* ── Smooth scroll nav links ── */
  document.querySelectorAll('a[href^="#"]').forEach(a => {
    a.addEventListener('click', (e) => {
      const href = a.getAttribute('href');
      if (href === '#') return;
      const target = document.querySelector(href);
      if (target) {
        e.preventDefault();
        window.scrollTo({ top: target.getBoundingClientRect().top + window.scrollY - 80, behavior: 'smooth' });
      }
    });
  });

  /* ── Mobile menu ── */
  const toggle = document.getElementById('navToggle');
  const links = document.getElementById('navLinks');
  if (toggle && links) {
    toggle.addEventListener('click', () => {
      const open = links.classList.toggle('open');
      toggle.classList.toggle('open');
      toggle.setAttribute('aria-expanded', open);
      toggle.setAttribute('aria-label', open ? 'Cerrar menú' : 'Abrir menú');
      document.body.style.overflow = open ? 'hidden' : '';
    });
    links.querySelectorAll('a').forEach(a => a.addEventListener('click', () => {
      links.classList.remove('open');
      toggle.classList.remove('open');
      toggle.setAttribute('aria-expanded', 'false');
      toggle.setAttribute('aria-label', 'Abrir menú');
      document.body.style.overflow = '';
    }));
  }

  /* ── Form ── */
  const form = document.getElementById('contactForm');
  if (form) {
    form.querySelectorAll('input, textarea').forEach(el => {
      el.addEventListener('focus', () => el.parentElement.classList.add('focused'));
      el.addEventListener('blur', () => {
        if (!el.value) el.parentElement.classList.remove('focused');
      });
    });

    form.addEventListener('submit', (e) => {
      e.preventDefault();
      let valid = true;
      form.querySelectorAll('[required]').forEach(el => {
        const group = el.parentElement;
        const error = group.querySelector('.input-error');
        if (!el.value.trim()) {
          group.classList.add('error');
          valid = false;
          const label = group.querySelector('label');
          error.textContent = label ? `El ${label.textContent.toLowerCase()} es obligatorio` : 'Campo obligatorio';
        } else if (el.type === 'email' && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(el.value)) {
          group.classList.add('error');
          valid = false;
          error.textContent = 'Introduce un email válido';
        } else {
          group.classList.remove('error');
          error.textContent = '';
        }
      });

      if (!valid) {
        const firstError = form.querySelector('.error input, .error textarea');
        if (firstError) firstError.focus();
        return;
      }

      const btn = document.getElementById('submitBtn');
      const orig = btn.textContent;
      btn.textContent = '✓ Enviado';
      btn.disabled = true;
      setTimeout(() => {
        btn.textContent = orig;
        btn.disabled = false;
        form.querySelectorAll('input, textarea').forEach(el => el.value = '');
        form.querySelectorAll('.input-group').forEach(g => g.classList.remove('focused', 'error'));
        form.querySelectorAll('.input-error').forEach(e => e.textContent = '');
      }, 3000);
    });
  }
});
