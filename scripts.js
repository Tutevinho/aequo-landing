document.addEventListener('DOMContentLoaded', () => {
  gsap.registerPlugin(ScrollTrigger);

  /* ── Three.js hero particles ── */
  const canvas = document.getElementById('heroCanvas');
  if (canvas) {
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
    const renderer = new THREE.WebGLRenderer({ canvas, alpha: true, antialias: true });
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

    const count = 1500;
    const pos = new Float32Array(count * 3);
    const speeds = [];
    for (let i = 0; i < count; i++) {
      pos[i*3] = (Math.random() - 0.5) * 20;
      pos[i*3+1] = (Math.random() - 0.5) * 16;
      pos[i*3+2] = (Math.random() - 0.5) * 16;
      speeds.push(Math.random() * 0.3 + 0.05);
    }
    const geo = new THREE.BufferGeometry();
    geo.setAttribute('position', new THREE.BufferAttribute(pos, 3));
    const mat = new THREE.PointsMaterial({
      color: 0x27ae60, size: 0.025,
      transparent: true, opacity: 0.4,
      blending: THREE.AdditiveBlending, sizeAttenuation: true,
    });
    const pts = new THREE.Points(geo, mat);
    scene.add(pts);
    camera.position.z = 8;

    function anim() {
      const p = pts.geometry.attributes.position.array;
      for (let i = 0; i < count; i++) {
        p[i*3+1] -= speeds[i] * 0.003;
        p[i*3] += Math.sin(Date.now() * 0.0003 * speeds[i]) * 0.002;
        if (p[i*3+1] < -8) { p[i*3+1] = 8; p[i*3] = (Math.random() - 0.5) * 20; }
      }
      pts.geometry.attributes.position.needsUpdate = true;
      renderer.render(scene, camera);
      requestAnimationFrame(anim);
    }
    anim();

    window.addEventListener('resize', () => {
      camera.aspect = window.innerWidth / window.innerHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(window.innerWidth, window.innerHeight);
    }, { passive: true });
  }

  /* ── Navbar parallax reveal + scroll ── */
  const navbar = document.getElementById('navbar');
  gsap.from(navbar, { y: -30, opacity: 0, duration: 0.6, ease: 'power3.out' });
  ScrollTrigger.create({
    start: 'top -60px',
    onUpdate: (self) => navbar.classList.toggle('scrolled', self.progress > 0),
  });

  /* ── Hero entrance (staggered timeline) ── */
  const heroTl = gsap.timeline({ defaults: { ease: 'power3.out' } });
  heroTl
    .from('.hero-badge',  { y: 25, opacity: 0, duration: 0.5 })
    .from('.hero-title',   { y: 40, opacity: 0, duration: 0.8 }, '-=0.2')
    .from('.hero-title .text-green', { scale: 0.8, opacity: 0, duration: 0.6 }, '-=0.3')
    .from('.hero-desc',    { y: 25, opacity: 0, duration: 0.6 }, '-=0.3')
    .from('.hero-actions a', { y: 20, opacity: 0, duration: 0.5, stagger: 0.1 }, '-=0.3');

  /* ── Hero rings parallax on scroll ── */
  gsap.from('.hr', { scale: 0.7, opacity: 0, duration: 1.4, delay: 0.2, ease: 'power4.out' });
  gsap.utils.toArray('.hr').forEach((ring, i) => {
    const speed = 0.05 * (i + 1);
    gsap.to(ring, {
      y: () => window.innerHeight * speed,
      ease: 'none',
      scrollTrigger: { trigger: '.hero', start: 'top top', end: 'bottom top', scrub: true },
    });
  });

  /* ── Hero content parallax ── */
  gsap.to('.hero-content', {
    y: 60, opacity: 0.6, ease: 'none',
    scrollTrigger: { trigger: '.hero', start: 'top top', end: 'bottom top', scrub: 1 },
  });
  gsap.to('#heroCanvas', {
    y: 40, ease: 'none',
    scrollTrigger: { trigger: '.hero', start: 'top top', end: 'bottom top', scrub: 1 },
  });

  /* ── Logos infinite scroll ── */
  gsap.to('.logos-track', { xPercent: -50, duration: 20, repeat: -1, ease: 'none' });

  /* ── Stats stagger ── */
  const statsTl = gsap.timeline({
    scrollTrigger: { trigger: '.stats-grid', start: 'top 80%' },
    defaults: { ease: 'power3.out' },
  });
  statsTl
    .from('.stat-card', { y: 40, opacity: 0, duration: 0.5, stagger: 0.08 })
    .from('.stat-plus, .stat-pct, .stat-min', { opacity: 0, scale: 0, duration: 0.3, stagger: 0.1 }, '-=0.2');

  /* ── Counters with dramatic reveal ── */
  document.querySelectorAll('[data-count]').forEach(el => {
    const target = parseInt(el.dataset.count);
    if (!target) return;
    const obj = { val: 0 };
    gsap.to(obj, {
      val: target, duration: 2.2, ease: 'power2.out',
      scrollTrigger: { trigger: el.closest('.stat-card') || el, start: 'top 85%' },
      onUpdate: () => { el.textContent = Math.floor(obj.val).toLocaleString(); },
    });
  });

  /* ── Section head reveals ── */
  gsap.utils.toArray('.section-head').forEach(el => {
    const h2 = el.querySelector('h2');
    const label = el.querySelector('.label');
    if (!h2) return;
    gsap.from(h2, {
      y: 40, opacity: 0, duration: 0.9, ease: 'power4.out',
      scrollTrigger: { trigger: el, start: 'top 85%' },
    });
    h2.querySelectorAll('.text-green').forEach(span => {
      gsap.from(span, {
        scale: 0.85, opacity: 0, duration: 0.6, ease: 'back.out(1.7)',
        scrollTrigger: { trigger: el, start: 'top 82%' },
      });
    });
    if (label) {
      gsap.from(label, {
        y: 12, opacity: 0, duration: 0.5, ease: 'power3.out',
        scrollTrigger: { trigger: el, start: 'top 90%' },
      });
    }
  });

  /* ── Features stagger with alternating directions ── */
  gsap.utils.toArray('.feature').forEach((card, i) => {
    const fromX = i % 2 === 0 ? -30 : 30;
    gsap.from(card, {
      x: fromX, y: 30, opacity: 0, duration: 0.7, ease: 'power4.out',
      scrollTrigger: { trigger: card, start: 'top 85%' },
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
  gsap.utils.toArray('.step').forEach((step, i) => {
    gsap.from(step, {
      x: -30, opacity: 0, duration: 0.7, ease: 'power4.out',
      scrollTrigger: { trigger: step, start: 'top 85%' },
    });
  });

  /* ── Testimonials stagger ── */
  gsap.utils.toArray('.testimonial').forEach((card, i) => {
    const fromY = 30 + i * 10;
    gsap.from(card, {
      y: fromY, opacity: 0, duration: 0.6, ease: 'power4.out',
      scrollTrigger: { trigger: card, start: 'top 85%' },
    });
  });

  /* ── Testimonial card tilt ── */
  document.querySelectorAll('.testimonial').forEach(card => {
    card.addEventListener('mousemove', (e) => {
      const rect = card.getBoundingClientRect();
      const x = (e.clientX - rect.left) / rect.width - 0.5;
      const y = (e.clientY - rect.top) / rect.height - 0.5;
      gsap.to(card, { rotationX: y * -3, rotationY: x * 3, transformPerspective: 800, duration: 0.4, ease: 'power2.out' });
    });
    card.addEventListener('mouseleave', () => {
      gsap.to(card, { rotationX: 0, rotationY: 0, duration: 0.4, ease: 'power2.out' });
    });
  });

  /* ── FAQ stagger (alternating) ── */
  gsap.utils.toArray('.faq-item').forEach((item, i) => {
    gsap.from(item, {
      x: i % 2 === 0 ? -20 : 20, opacity: 0, duration: 0.5, ease: 'power4.out',
      scrollTrigger: { trigger: item, start: 'top 85%' },
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
