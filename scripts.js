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

  const count = 2000;
  const positions = new Float32Array(count * 3);
  const sizes = new Float32Array(count);
  const speeds = [];
  const randoms = [];

  for (let i = 0; i < count; i++) {
    positions[i*3] = (Math.random() - 0.5) * 22;
    positions[i*3+1] = (Math.random() - 0.5) * 18;
    positions[i*3+2] = (Math.random() - 0.5) * 18;
    sizes[i] = Math.random() * 2.5 + 0.3;
    speeds.push(Math.random() * 0.3 + 0.05);
    randoms.push(Math.random() * Math.PI * 2);
  }

  const geometry = new THREE.BufferGeometry();
  geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
  geometry.setAttribute('size', new THREE.BufferAttribute(sizes, 1));

  const material = new THREE.PointsMaterial({
    color: 0x27ae60,
    size: 0.035,
    transparent: true,
    opacity: 0.5,
    blending: THREE.AdditiveBlending,
    sizeAttenuation: true,
  });

  const particles = new THREE.Points(geometry, material);
  scene.add(particles);
  camera.position.z = 8;

  let mouseX = 0, mouseY = 0;

  function animateParticles() {
    const pos = particles.geometry.attributes.position.array;
    for (let i = 0; i < count; i++) {
      pos[i*3+1] -= speeds[i] * 0.004;
      pos[i*3] += Math.sin(randoms[i] + Date.now() * 0.0003 * speeds[i]) * 0.002;
      if (pos[i*3+1] < -9) { pos[i*3+1] = 9; pos[i*3] = (Math.random() - 0.5) * 22; }
    }
    particles.geometry.attributes.position.needsUpdate = true;
    particles.rotation.x += (mouseY * 0.00004 - particles.rotation.x) * 0.01;
    particles.rotation.y += (mouseX * 0.00004 - particles.rotation.y) * 0.01;
    renderer.render(scene, camera);
    requestAnimationFrame(animateParticles);
  }
  animateParticles();

  window.addEventListener('mousemove', (e) => {
    mouseX = (e.clientX / window.innerWidth - 0.5) * 2;
    mouseY = (e.clientY / window.innerHeight - 0.5) * 2;
  }, { passive: true });

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

  /* ── Hero stagger ── */
  const heroTL = gsap.timeline({ defaults: { ease: 'power3.out', duration: 1 } });
  heroTL
    .from('.hero-badge', { y: 30, opacity: 0, duration: 0.7 })
    .from('.line-1', { y: 40, opacity: 0 }, '-=0.3')
    .from('.line-2', { y: 40, opacity: 0 }, '-=0.4')
    .from('.hero-desc', { y: 25, opacity: 0 }, '-=0.3')
    .from('.hero-actions a', { y: 20, opacity: 0, stagger: 0.1 }, '-=0.3')
    .from('.ring-wrap', { scale: 0.8, opacity: 0, duration: 1.2 }, '-=0.8');

  /* ── Section header reveal ── */
  gsap.utils.toArray('.section-header').forEach(el => {
    gsap.from(el.querySelector('h2'), {
      y: 40, opacity: 0, duration: 1,
      ease: 'power3.out',
      scrollTrigger: { trigger: el, start: 'top 85%' }
    });
    gsap.from(el.querySelector('.label'), {
      y: 15, opacity: 0, duration: 0.6,
      ease: 'power3.out',
      scrollTrigger: { trigger: el, start: 'top 88%' }
    });
  });

  /* ── Intro section ── */
  gsap.from('.intro-text', {
    y: 40, opacity: 0, duration: 1,
    ease: 'power3.out',
    scrollTrigger: { trigger: '.intro-grid', start: 'top 80%' }
  });
  gsap.from('.intro-card', {
    x: -20, opacity: 0, duration: 0.6, stagger: 0.1,
    ease: 'power3.out',
    scrollTrigger: { trigger: '.intro-cards', start: 'top 85%' }
  });

  /* ── Animated counters ── */
  gsap.utils.toArray('[data-count]').forEach(el => {
    const target = parseInt(el.dataset.count);
    if (!target) return;
    const obj = { val: 0 };
    gsap.to(obj, {
      val: target, duration: 2, ease: 'power2.out',
      scrollTrigger: { trigger: el.closest('.stat-item, .intro-card') || el, start: 'top 88%' },
      onUpdate: () => { el.textContent = Math.floor(obj.val).toLocaleString(); }
    });
  });

  /* ── Stats stagger ── */
  gsap.from('.stat-item', {
    y: 30, opacity: 0, duration: 0.6, stagger: 0.08,
    ease: 'power3.out',
    scrollTrigger: { trigger: '.stats-row', start: 'top 85%' }
  });

  /* ── Service cards ── */
  gsap.from('.service-card', {
    y: 40, opacity: 0, duration: 0.7, stagger: 0.1,
    ease: 'power3.out',
    scrollTrigger: { trigger: '.services-grid', start: 'top 80%' }
  });

  document.querySelectorAll('[data-tilt]').forEach(card => {
    card.addEventListener('mousemove', (e) => {
      const rect = card.getBoundingClientRect();
      const x = (e.clientX - rect.left) / rect.width - 0.5;
      const y = (e.clientY - rect.top) / rect.height - 0.5;
      gsap.to(card, {
        rotationY: x * 8, rotationX: -y * 8,
        duration: 0.4, ease: 'power2.out',
        transformPerspective: 1000,
        scale: 1.02,
      });
      card.style.setProperty('--mx', `${e.clientX - rect.left}px`);
      card.style.setProperty('--my', `${e.clientY - rect.top}px`);
    });
    card.addEventListener('mouseleave', () => {
      gsap.to(card, { rotationY: 0, rotationX: 0, scale: 1, duration: 0.4, ease: 'power2.out' });
    });
  });

  /* ── Trusted stagger ── */
  gsap.from('.trusted-item', {
    y: 20, opacity: 0, duration: 0.5, stagger: 0.06,
    ease: 'power3.out',
    scrollTrigger: { trigger: '.trusted-grid', start: 'top 85%' }
  });

  /* ── Steps stagger ── */
  gsap.from('.step', {
    y: 30, opacity: 0, duration: 0.6, stagger: 0.15,
    ease: 'power3.out',
    scrollTrigger: { trigger: '.steps', start: 'top 80%' }
  });

  /* ── CTA section ── */
  gsap.from('.cta-text', {
    y: 40, opacity: 0, duration: 1,
    ease: 'power3.out',
    scrollTrigger: { trigger: '.cta-grid', start: 'top 80%' }
  });
  gsap.from('.cta-form', {
    y: 40, opacity: 0, duration: 0.8,
    ease: 'power3.out',
    scrollTrigger: { trigger: '.cta-grid', start: 'top 80%' }
  });

  /* ── Marquee ── */
  gsap.to('.marquee-track', {
    xPercent: -50,
    duration: 25,
    repeat: -1,
    ease: 'none',
  });

  /* ── Smooth scroll nav ── */
  document.querySelectorAll('a[href^="#"]').forEach(a => {
    a.addEventListener('click', (e) => {
      const href = a.getAttribute('href');
      if (href === '#') return;
      const target = document.querySelector(href);
      if (target) {
        e.preventDefault();
        const top = target.getBoundingClientRect().top + window.scrollY - 80;
        window.scrollTo({ top, behavior: 'smooth' });
      }
    });
  });

  /* ── Mobile menu ── */
  const toggle = document.getElementById('navToggle');
  const navRight = document.querySelector('.nav-right');
  if (toggle) {
    toggle.addEventListener('click', () => {
      navRight.classList.toggle('open');
      toggle.classList.toggle('open');
    });
    navRight.querySelectorAll('a').forEach(a =>
      a.addEventListener('click', () => {
        navRight.classList.remove('open');
        toggle.classList.remove('open');
      })
    );
  }

  /* ── Form ── */
  const form = document.getElementById('contactForm');
  if (form) {
    form.querySelectorAll('input, textarea').forEach(el => {
      el.setAttribute('placeholder', ' ');
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
