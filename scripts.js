document.addEventListener('DOMContentLoaded', () => {
  gsap.registerPlugin(ScrollTrigger);

  /* ── Lenis smooth scroll ── */
  const lenis = new Lenis({ duration: 1.4, easing: (t) => 1 - Math.pow(1 - t, 3) });
  lenis.on('scroll', ScrollTrigger.update);
  gsap.ticker.add((t) => lenis.raf(t * 1000));
  gsap.ticker.lagSmoothing(0);

  /* ── Three.js hero particles ── */
  const canvas = document.getElementById('heroCanvas');
  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
  const renderer = new THREE.WebGLRenderer({ canvas, alpha: true, antialias: true });
  renderer.setSize(window.innerWidth, window.innerHeight);
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

  const count = 1800;
  const positions = new Float32Array(count * 3);
  const sizes = new Float32Array(count);
  const speeds = [];

  for (let i = 0; i < count; i++) {
    positions[i*3] = (Math.random() - 0.5) * 20;
    positions[i*3+1] = (Math.random() - 0.5) * 15;
    positions[i*3+2] = (Math.random() - 0.5) * 15;
    sizes[i] = Math.random() * 2 + 0.5;
    speeds.push(Math.random() * 0.2 + 0.05);
  }

  const geometry = new THREE.BufferGeometry();
  geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
  geometry.setAttribute('size', new THREE.BufferAttribute(sizes, 1));

  const material = new THREE.PointsMaterial({
    color: 0x27ae60,
    size: 0.04,
    transparent: true,
    opacity: 0.6,
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
      pos[i*3+1] -= speeds[i] * 0.003;
      if (pos[i*3+1] < -7.5) pos[i*3+1] = 7.5;
    }
    particles.geometry.attributes.position.needsUpdate = true;
    particles.rotation.x += (mouseY * 0.00005 - particles.rotation.x) * 0.01;
    particles.rotation.y += (mouseX * 0.00005 - particles.rotation.y) * 0.01;
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

  /* ── Hero animations ── */
  const heroTL = gsap.timeline({ defaults: { ease: 'power3.out' } });
  heroTL
    .from('.hero-badge', { y: 30, opacity: 0, duration: 0.8 })
    .from('.line-1', { y: 50, opacity: 0, duration: 0.8 }, '-=0.4')
    .from('.line-2', { y: 50, opacity: 0, duration: 0.8 }, '-=0.5')
    .from('.hero-desc', { y: 30, opacity: 0, duration: 0.8 }, '-=0.4')
    .from('.hero-actions a', { y: 20, opacity: 0, duration: 0.6, stagger: 0.15 }, '-=0.4')
    .from('.ring-wrap', { scale: 0.8, opacity: 0, duration: 1 }, '-=0.8');

  /* ── Scroll-triggered reveals ── */
  gsap.utils.toArray('.intro-grid, .section-header, .services-grid, .steps, .cta-grid, .footer-grid').forEach(el => {
    gsap.from(el, {
      y: 60, opacity: 0, duration: 1.2,
      ease: 'power3.out',
      scrollTrigger: { trigger: el, start: 'top 80%', toggleActions: 'play none none none' }
    });
  });

  /* ── Service cards stagger ── */
  gsap.from('.service-card', {
    y: 40, opacity: 0, duration: 0.8, stagger: 0.15,
    ease: 'power3.out',
    scrollTrigger: { trigger: '.services-grid', start: 'top 80%' }
  });

  /* ── Steps stagger ── */
  gsap.from('.step', {
    y: 30, opacity: 0, duration: 0.7, stagger: 0.2,
    ease: 'power3.out',
    scrollTrigger: { trigger: '.steps', start: 'top 80%' }
  });

  /* ── Intro cards stagger ── */
  gsap.from('.intro-card', {
    x: -20, opacity: 0, duration: 0.6, stagger: 0.1,
    ease: 'power3.out',
    scrollTrigger: { trigger: '.intro-cards', start: 'top 85%' }
  });

  /* ── Marquee animation ── */
  gsap.to('.marquee-track', {
    xPercent: -50,
    duration: 30,
    repeat: -1,
    ease: 'none',
  });

  /* ── Service card 3D tilt ── */
  document.querySelectorAll('[data-tilt]').forEach(card => {
    card.addEventListener('mousemove', (e) => {
      const rect = card.getBoundingClientRect();
      const x = (e.clientX - rect.left) / rect.width - 0.5;
      const y = (e.clientY - rect.top) / rect.height - 0.5;
      gsap.to(card, {
        rotationY: x * 8,
        rotationX: -y * 8,
        duration: 0.4,
        ease: 'power2.out',
        transformPerspective: 1000,
      });
    });
    card.addEventListener('mouseleave', () => {
      gsap.to(card, { rotationY: 0, rotationX: 0, duration: 0.4, ease: 'power2.out' });
    });
  });

  /* ── Navbar links smooth scroll ── */
  document.querySelectorAll('a[href^="#"]').forEach(a => {
    a.addEventListener('click', (e) => {
      const href = a.getAttribute('href');
      if (href === '#') return;
      const target = document.querySelector(href);
      if (target) {
        e.preventDefault();
        lenis.scrollTo(target, { offset: -60 });
      }
    });
  });

  /* ── Mobile menu ── */
  const toggle = document.getElementById('navToggle');
  const navRight = document.querySelector('.nav-right');
  if (toggle) {
    toggle.addEventListener('click', () => navRight.classList.toggle('open'));
    navRight.querySelectorAll('a').forEach(a =>
      a.addEventListener('click', () => navRight.classList.remove('open'))
    );
  }

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
        form.querySelectorAll('input, textarea').forEach(el => el.value = '');
      }, 3000);
    });
  }
});
