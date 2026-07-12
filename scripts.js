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
  heroTl
    .from('.hero-circle', { scale: 0.6, opacity: 0, duration: 1.4 })
    .from('.hero-title', { y: 50, opacity: 0, duration: 1 }, '-=0.8')
    .from('.hero-title .text-green', { scale: 0.85, opacity: 0, duration: 0.7 }, '-=0.4')
    .from('.hero-desc', { y: 20, opacity: 0, duration: 0.6 }, '-=0.3')
    .from('.hero-actions a', { y: 15, opacity: 0, duration: 0.5, stagger: 0.1 }, '-=0.3');

  /* ── Navbar ── */
  const navbar = document.getElementById('navbar');
  gsap.from(navbar, { y: -30, opacity: 0, duration: 0.6, ease: 'power3.out' });
  ScrollTrigger.create({
    start: 'top -60px',
    onUpdate: (self) => navbar.classList.toggle('scrolled', self.progress > 0),
  });

  /* ── Section head reveals ── */
  gsap.utils.toArray('.section-head').forEach(el => {
    const h2 = el.querySelector('h2');
    const label = el.querySelector('.label');
    if (!h2) return;
    gsap.set(h2, { y: 30, opacity: 0 });
    gsap.to(h2, {
      y: 0, opacity: 1, duration: 0.9, ease: 'power4.out',
      scrollTrigger: { trigger: el, start: 'top 85%' },
    });
    h2.querySelectorAll('.text-green').forEach(span => {
      gsap.set(span, { scale: 0.85, opacity: 0 });
      gsap.to(span, {
        scale: 1, opacity: 1, duration: 0.6, ease: 'back.out(1.7)',
        scrollTrigger: { trigger: el, start: 'top 82%' },
      });
    });
    if (label) {
      gsap.set(label, { y: 10, opacity: 0 });
      gsap.to(label, {
        y: 0, opacity: 1, duration: 0.5, ease: 'power3.out',
        scrollTrigger: { trigger: el, start: 'top 90%' },
      });
    }
  });

  /* ── Features stagger ── */
  gsap.utils.toArray('.feature').forEach((card, i) => {
    const dir = i % 2 === 0 ? -20 : 20;
    gsap.set(card, { x: dir, y: 20, opacity: 0 });
    gsap.to(card, {
      x: 0, y: 0, opacity: 1, duration: 0.7, ease: 'power4.out',
      scrollTrigger: { trigger: card, start: 'top 88%' },
    });
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

  /* ── Steps stagger ── */
  gsap.utils.toArray('.step').forEach((step) => {
    gsap.set(step, { x: -20, opacity: 0 });
    gsap.to(step, {
      x: 0, opacity: 1, duration: 0.7, ease: 'power4.out',
      scrollTrigger: { trigger: step, start: 'top 88%' },
    });
  });

  /* ── FAQ stagger ── */
  gsap.utils.toArray('.faq-item').forEach((item, i) => {
    const dx = i % 2 === 0 ? -20 : 20;
    gsap.set(item, { x: dx, opacity: 0 });
    gsap.to(item, {
      x: 0, opacity: 1, duration: 0.5, ease: 'power4.out',
      scrollTrigger: { trigger: item, start: 'top 88%' },
    });
  });

  /* ── Trust stagger ── */
  gsap.from('.trust-item', {
    y: 15, opacity: 0, duration: 0.4, stagger: 0.05, ease: 'power3.out',
    scrollTrigger: { trigger: '.trust-bar', start: 'top 85%' },
  });

  /* ── CTA reveal ── */
  gsap.from('.cta-box', {
    y: 50, opacity: 0, duration: 0.8, ease: 'power4.out',
    scrollTrigger: { trigger: '.cta-box', start: 'top 80%' },
  });
  gsap.from('.cta-form .input-group', {
    y: 20, opacity: 0, duration: 0.5, stagger: 0.06, ease: 'power3.out',
    scrollTrigger: { trigger: '.cta-box', start: 'top 75%' },
  });

  /* ── Floating CTA ── */
  const fab = document.getElementById('fab');
  if (fab) {
    ScrollTrigger.create({
      start: 'top 300px',
      onUpdate: (self) => fab.classList.toggle('visible', self.progress > 0 && window.innerWidth < 600),
    });
    window.addEventListener('resize', () => {
      if (window.innerWidth >= 600) fab.classList.remove('visible');
    });
  }

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
    gsap.set('.nav-links a', { x: 20, opacity: 0 });
    toggle.addEventListener('click', () => {
      const open = links.classList.toggle('open');
      toggle.classList.toggle('open');
      toggle.setAttribute('aria-expanded', open);
      toggle.setAttribute('aria-label', open ? 'Cerrar menú' : 'Abrir menú');
      document.body.style.overflow = open ? 'hidden' : '';
      if (open) {
        gsap.to('.nav-links a', { x: 0, opacity: 1, duration: 0.4, stagger: 0.05, ease: 'power3.out' });
      } else {
        gsap.set('.nav-links a', { x: 20, opacity: 0 });
      }
    });
    links.querySelectorAll('a').forEach(a => a.addEventListener('click', () => {
      links.classList.remove('open');
      toggle.classList.remove('open');
      toggle.setAttribute('aria-expanded', 'false');
      toggle.setAttribute('aria-label', 'Abrir menú');
      document.body.style.overflow = '';
      gsap.set('.nav-links a', { x: 20, opacity: 0 });
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
