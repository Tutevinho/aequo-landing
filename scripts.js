document.addEventListener('DOMContentLoaded', () => {
  gsap.registerPlugin(ScrollTrigger);

  /* ── Three.js hero particles ── */
  const canvas = document.getElementById('heroCanvas');
  if (!canvas) return;
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

  /* ── Navbar ── */
  const navbar = document.getElementById('navbar');
  ScrollTrigger.create({
    start: 'top -60px',
    onUpdate: (self) => navbar.classList.toggle('scrolled', self.progress > 0),
  });

  /* ── Hero entrance ── */
  gsap.from('.hero-badge', { y: 20, opacity: 0, duration: 0.6 });
  gsap.from('.hero-title', { y: 30, opacity: 0, duration: 0.8, delay: 0.15 });
  gsap.from('.hero-desc', { y: 20, opacity: 0, duration: 0.6, delay: 0.3 });
  gsap.from('.hero-actions a', { y: 15, opacity: 0, duration: 0.5, stagger: 0.1, delay: 0.45 });

  /* ── Rings entrance ── */
  gsap.from('.hr', { scale: 0.6, opacity: 0, duration: 1.2, delay: 0.3, ease: 'power3.out' });

  /* ── Section head reveals ── */
  gsap.utils.toArray('.section-head').forEach(el => {
    gsap.from(el.querySelector('h2'), {
      y: 30, opacity: 0, duration: 0.8, ease: 'power3.out',
      scrollTrigger: { trigger: el, start: 'top 85%' }
    });
    gsap.from(el.querySelector('.label'), {
      y: 10, opacity: 0, duration: 0.5, ease: 'power3.out',
      scrollTrigger: { trigger: el, start: 'top 90%' }
    });
  });

  /* ── Features stagger ── */
  gsap.from('.feature', {
    y: 30, opacity: 0, duration: 0.6, stagger: 0.08,
    ease: 'power3.out',
    scrollTrigger: { trigger: '.features', start: 'top 80%' }
  });

  /* ── Counters ── */
  document.querySelectorAll('[data-count]').forEach(el => {
    const target = parseInt(el.dataset.count);
    if (!target) return;
    const obj = { val: 0 };
    gsap.to(obj, {
      val: target, duration: 1.8, ease: 'power2.out',
      scrollTrigger: { trigger: el.closest('.feature-stats') || el, start: 'top 85%' },
      onUpdate: () => { el.textContent = Math.floor(obj.val).toLocaleString(); }
    });
  });

  /* ── Steps stagger ── */
  gsap.from('.step', {
    y: 20, opacity: 0, duration: 0.6, stagger: 0.12,
    ease: 'power3.out',
    scrollTrigger: { trigger: '.steps', start: 'top 80%' }
  });

  /* ── Testimonials stagger ── */
  gsap.from('.testimonial', {
    y: 20, opacity: 0, duration: 0.5, stagger: 0.08,
    ease: 'power3.out',
    scrollTrigger: { trigger: '.testimonials', start: 'top 85%' }
  });

  /* ── CTA ── */
  gsap.from('.cta-text', {
    y: 30, opacity: 0, duration: 0.8, ease: 'power3.out',
    scrollTrigger: { trigger: '.cta-box', start: 'top 80%' }
  });
  gsap.from('.cta-form', {
    y: 30, opacity: 0, duration: 0.6, ease: 'power3.out',
    scrollTrigger: { trigger: '.cta-box', start: 'top 80%' }
  });

  /* ── Logos scroll ── */
  gsap.to('.logos-track', {
    xPercent: -50, duration: 20, repeat: -1, ease: 'none',
  });

  /* ── Nav scroll ── */
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
  const links = document.querySelector('.nav-links');
  if (toggle) {
    toggle.addEventListener('click', () => {
      links.classList.toggle('open');
      toggle.classList.toggle('open');
    });
    links.querySelectorAll('a').forEach(a => a.addEventListener('click', () => {
      links.classList.remove('open');
      toggle.classList.remove('open');
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
      const btn = form.querySelector('button');
      const orig = btn.textContent;
      btn.textContent = '✓ Enviado';
      btn.style.background = '#27ae60';
      setTimeout(() => {
        btn.textContent = orig;
        btn.style.background = '';
        form.querySelectorAll('input, textarea').forEach(el => el.value = '');
      }, 3000);
    });
  }
});
