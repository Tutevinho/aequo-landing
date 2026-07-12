document.addEventListener('DOMContentLoaded', () => {

  /* ── Navbar scroll effect ── */
  const navbar = document.getElementById('navbar');
  const hero = document.getElementById('hero');

  function updateNav() {
    if (window.scrollY > 60) {
      navbar.classList.add('scrolled');
    } else {
      navbar.classList.remove('scrolled');
    }
  }

  window.addEventListener('scroll', updateNav, { passive: true });

  /* ── Mobile menu ── */
  const toggle = document.getElementById('navToggle');
  const navRight = document.querySelector('.nav-right');

  toggle?.addEventListener('click', () => {
    navRight.classList.toggle('open');
  });

  /* ── Close mobile menu on link click ── */
  document.querySelectorAll('.nav-link, .nav-cta').forEach(link => {
    link.addEventListener('click', () => {
      navRight.classList.remove('open');
    });
  });

  /* ── Reveal animations with Intersection Observer ── */
  const revealElements = document.querySelectorAll('.reveal');

  const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        revealObserver.unobserve(entry.target);
      }
    });
  }, {
    threshold: 0.15,
    rootMargin: '0px 0px -50px 0px'
  });

  revealElements.forEach(el => revealObserver.observe(el));

  /* ── Animated counters ── */
  const counters = document.querySelectorAll('.stat-num');

  const counterObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const el = entry.target;
        const target = parseInt(el.getAttribute('data-target'));
        if (!target) return;

        let current = 0;
        const duration = 2000;
        const step = Math.ceil(target / (duration / 16));
        const suffix = el.querySelector('.suffix');

        function update() {
          current += step;
          if (current >= target) {
            if (suffix) {
              el.innerHTML = target + '<span class="suffix">' + suffix.textContent + '</span>';
            } else {
              el.textContent = target;
            }
            counterObserver.unobserve(el);
            return;
          }
          if (suffix) {
            el.innerHTML = current + '<span class="suffix">' + suffix.textContent + '</span>';
          } else {
            el.textContent = current;
          }
          requestAnimationFrame(update);
        }

        /* small delay before starting */
        setTimeout(update, 200);
        counterObserver.unobserve(el);
      }
    });
  }, { threshold: 0.5 });

  counters.forEach(c => {
    const target = parseInt(c.getAttribute('data-target'));
    if (target) {
      counterObserver.observe(c);
    }
  });

  /* ── Parallax effect on hero elements ── */
  const heroCircle = document.querySelector('.hero-circle-wrap');
  const heroContent = document.querySelector('.hero-text');
  const heroGlow = document.querySelector('.hero-glow');

  if (heroCircle || heroContent) {
    window.addEventListener('mousemove', (e) => {
      const x = (e.clientX / window.innerWidth - 0.5) * 2;
      const y = (e.clientY / window.innerHeight - 0.5) * 2;

      if (heroCircle) {
        heroCircle.style.transform = `translate(${x * 15}px, ${y * 15}px)`;
      }

      if (heroGlow) {
        heroGlow.style.transform = `translate(${x * -20}px, ${y * -20}px)`;
      }
    }, { passive: true });
  }

  /* ── Smooth scroll offset for fixed navbar ── */
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
      const href = this.getAttribute('href');
      if (href === '#') return;
      const target = document.querySelector(href);
      if (target) {
        e.preventDefault();
        const offset = 80;
        const targetPos = target.getBoundingClientRect().top + window.pageYOffset - offset;
        window.scrollTo({ top: targetPos, behavior: 'smooth' });
      }
    });
  });

  /* ── Form handling ── */
  const form = document.getElementById('contactForm');
  form?.addEventListener('submit', function (e) {
    e.preventDefault();
    const btn = this.querySelector('button[type="submit"]');
    const original = btn.textContent;
    btn.textContent = '✓ Mensaje enviado';
    btn.style.background = '#27ae60';
    setTimeout(() => {
      btn.textContent = original;
      btn.style.background = '';
      this.reset();
    }, 3000);
  });

  console.log('Aequo landing page loaded');
});
