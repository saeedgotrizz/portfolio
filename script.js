/* =====================================================
   MUHAMMAD SAEED — PORTFOLIO JS
   Three.js 3D background, tilt cards, reveals & more
   ===================================================== */

document.addEventListener('DOMContentLoaded', () => {
  'use strict';

  /* ============ PRELOADER ============ */
  const preloader = document.getElementById('preloader');
  window.addEventListener('load', () => {
    setTimeout(() => preloader.classList.add('hidden'), 500);
  });
  // Fallback in case load already fired or assets hang
  setTimeout(() => preloader.classList.add('hidden'), 3500);

  /* ============ YEAR ============ */
  const yearEl = document.getElementById('year');
  if (yearEl) yearEl.textContent = new Date().getFullYear();

  /* ============ CUSTOM CURSOR ============ */
  const cursor = document.getElementById('cursor');
  const cursorDot = document.getElementById('cursorDot');
  if (cursor && cursorDot && window.matchMedia('(pointer: fine)').matches) {
    let mx = 0, my = 0, cx = 0, cy = 0;
    document.addEventListener('mousemove', (e) => {
      mx = e.clientX; my = e.clientY;
      cursorDot.style.left = mx + 'px';
      cursorDot.style.top = my + 'px';
    });
    (function loopCursor() {
      cx += (mx - cx) * 0.16;
      cy += (my - cy) * 0.16;
      cursor.style.left = cx + 'px';
      cursor.style.top = cy + 'px';
      requestAnimationFrame(loopCursor);
    })();
    document.querySelectorAll('a, button, .tilt, .project-card, input, textarea').forEach((el) => {
      el.addEventListener('mouseenter', () => cursor.classList.add('hovering'));
      el.addEventListener('mouseleave', () => cursor.classList.remove('hovering'));
    });
  }

  /* ============ NAVBAR ============ */
  const navbar = document.getElementById('navbar');
  const hamburger = document.getElementById('hamburger');
  const navLinks = document.getElementById('navLinks');
  const links = document.querySelectorAll('.nav-link');

  const onScrollNav = () => {
    navbar.classList.toggle('scrolled', window.scrollY > 40);
  };
  onScrollNav();
  window.addEventListener('scroll', onScrollNav, { passive: true });

  hamburger.addEventListener('click', () => {
    hamburger.classList.toggle('open');
    navLinks.classList.toggle('open');
  });
  links.forEach((link) =>
    link.addEventListener('click', () => {
      hamburger.classList.remove('open');
      navLinks.classList.remove('open');
    })
  );

  /* --- Active link on scroll --- */
  const sections = document.querySelectorAll('section[id]');
  const setActiveLink = () => {
    const pos = window.scrollY + 140;
    let current = 'home';
    sections.forEach((sec) => {
      if (pos >= sec.offsetTop) current = sec.id;
    });
    links.forEach((l) =>
      l.classList.toggle('active', l.getAttribute('href') === '#' + current)
    );
  };
  setActiveLink();
  window.addEventListener('scroll', setActiveLink, { passive: true });
  /* ============ TYPEWRITER ============ */
  const typedEl = document.getElementById('typed');
  const phrases = [
    'WordPress websites.',
    'custom plugins.',
    'WooCommerce stores.',
    'multi-vendor platforms.',
    'fast, SEO-ready sites.'
  ];
  let pIndex = 0, cIndex = 0, deleting = false;
  const typeLoop = () => {
    const phrase = phrases[pIndex];
    typedEl.textContent = phrase.substring(0, cIndex);
    if (!deleting) {
      cIndex++;
      if (cIndex > phrase.length) {
        deleting = true;
        setTimeout(typeLoop, 1800);
        return;
      }
      setTimeout(typeLoop, 75);
    } else {
      cIndex--;
      if (cIndex < 0) {
        deleting = false;
        cIndex = 0;
        pIndex = (pIndex + 1) % phrases.length;
        setTimeout(typeLoop, 350);
        return;
      }
      setTimeout(typeLoop, 38);
    }
  };
  if (typedEl) typeLoop();

  /* ============ SCROLL REVEAL ============ */
  const revealEls = document.querySelectorAll('.reveal');
  const revealObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          const delay = parseInt(entry.target.dataset.delay || '0', 10);
          setTimeout(() => entry.target.classList.add('visible'), delay);
          revealObserver.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.12 }
  );
  revealEls.forEach((el) => revealObserver.observe(el));

  /* ============ SKILL BARS ============ */
  const skillBars = document.querySelectorAll('.skill-bar');
  const barObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        const bar = entry.target;
        const level = parseInt(bar.dataset.level, 10);
        const fill = bar.querySelector('.bar-fill');
        const pct = bar.querySelector('.skill-pct');
        fill.style.width = level + '%';
        let n = 0;
        const step = Math.max(1, Math.round(level / 60));
        const counter = setInterval(() => {
          n = Math.min(level, n + step);
          pct.textContent = n + '%';
          if (n >= level) clearInterval(counter);
        }, 22);
        barObserver.unobserve(bar);
      });
    },
    { threshold: 0.4 }
  );
  skillBars.forEach((b) => barObserver.observe(b));

  /* ============ COUNTERS ============ */
  const counters = document.querySelectorAll('.stat-num');
  const counterObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        const el = entry.target;
        const target = parseInt(el.dataset.target, 10);
        const dur = 1600;
        const start = performance.now();
        const tick = (now) => {
          const p = Math.min((now - start) / dur, 1);
          const eased = 1 - Math.pow(1 - p, 3);
          el.textContent = Math.round(target * eased);
          if (p < 1) requestAnimationFrame(tick);
        };
        requestAnimationFrame(tick);
        counterObserver.unobserve(el);
      });
    },
    { threshold: 0.5 }
  );
  counters.forEach((c) => counterObserver.observe(c));
  /* ============ 3D TILT CARDS ============ */
  const isFinePointer = window.matchMedia('(pointer: fine)').matches;
  if (isFinePointer) {
    document.querySelectorAll('.tilt').forEach((card) => {
      card.style.transition = 'transform .25s ease';
      card.addEventListener('mousemove', (e) => {
        const r = card.getBoundingClientRect();
        const px = (e.clientX - r.left) / r.width;
        const py = (e.clientY - r.top) / r.height;
        const rx = (0.5 - py) * 10;
        const ry = (px - 0.5) * 12;
        card.style.transform =
          `perspective(800px) rotateX(${rx}deg) rotateY(${ry}deg) translateY(-4px)`;
        card.style.setProperty('--mx', px * 100 + '%');
        card.style.setProperty('--my', py * 100 + '%');
      });
      card.addEventListener('mouseleave', () => {
        card.style.transform = '';
      });
    });
  }

  /* ============ PROJECT CARDS — tap to flip (touch) ============ */
  if (!isFinePointer) {
    document.querySelectorAll('.project-card').forEach((card) => {
      card.addEventListener('click', () => card.classList.toggle('flipped'));
    });
  }

  /* ============ CONTACT FORM ============ */
  const form = document.getElementById('contactForm');
  const status = document.getElementById('formStatus');
  if (form) {
    form.addEventListener('submit', (e) => {
      e.preventDefault();
      const name = form.elements['name'].value.trim();
      const email = form.elements['email'].value.trim();
      const subject = form.elements['subject'].value.trim();
      const message = form.elements['message'].value.trim();
      const emailOk = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

      if (!name || !emailOk || !subject || !message) {
        status.textContent = 'Please fill in all fields with a valid email.';
        status.className = 'form-status error';
        return;
      }

      status.textContent = `Thanks, ${name}! Your message has been sent — I'll reply within 24 hours.`;
      status.className = 'form-status success';
      form.reset();
    });
  }

  /* ============ THREE.JS 3D PARTICLE WAVE ============ */
  initBackground3D();
  function initBackground3D() {
    if (typeof THREE === 'undefined') return;
    const canvas = document.getElementById('bg3d');
    if (!canvas) return;

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(
      60,
      window.innerWidth / window.innerHeight,
      1,
      2000
    );
    camera.position.set(0, 120, 340);
    camera.lookAt(0, 0, 0);

    const renderer = new THREE.WebGLRenderer({
      canvas,
      antialias: true,
      alpha: true
    });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.setSize(window.innerWidth, window.innerHeight);

    /* --- Particle grid (wave) --- */
    const SEPARATION = 22;
    const AMOUNTX = 60;
    const AMOUNTY = 60;
    const count = AMOUNTX * AMOUNTY;

    const positions = new Float32Array(count * 3);
    let i = 0;
    for (let ix = 0; ix < AMOUNTX; ix++) {
      for (let iy = 0; iy < AMOUNTY; iy++) {
        positions[i] = ix * SEPARATION - ((AMOUNTX - 1) * SEPARATION) / 2;
        positions[i + 1] = 0;
        positions[i + 2] = iy * SEPARATION - ((AMOUNTY - 1) * SEPARATION) / 2;
        i += 3;
      }
    }

    const geometry = new THREE.BufferGeometry();
    geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));

    const material = new THREE.PointsMaterial({
      color: 0x8b5cf6,
      size: 2.6,
      transparent: true,
      opacity: 0.85,
      sizeAttenuation: true
    });

    const points = new THREE.Points(geometry, material);
    points.rotation.x = -Math.PI / 2.6;
    scene.add(points);

    /* --- Floating wireframe shapes --- */
    const shapes = [];
    const shapeGeos = [
      new THREE.IcosahedronGeometry(26, 0),
      new THREE.OctahedronGeometry(20, 0),
      new THREE.TetrahedronGeometry(18, 0)
    ];
    const wireMat = new THREE.MeshBasicMaterial({
      color: 0x22d3ee,
      wireframe: true,
      transparent: true,
      opacity: 0.28
    });
    for (let s = 0; s < 7; s++) {
      const mesh = new THREE.Mesh(
        shapeGeos[s % shapeGeos.length],
        wireMat.clone()
      );
      mesh.material.color.setHex(s % 2 === 0 ? 0x22d3ee : 0x8b5cf6);
      mesh.position.set(
        (Math.random() - 0.5) * 600,
        (Math.random() - 0.5) * 300,
        (Math.random() - 0.5) * 400 - 100
      );
      mesh.userData = {
        rx: (Math.random() - 0.5) * 0.01,
        ry: (Math.random() - 0.5) * 0.01,
        floatSpeed: 0.4 + Math.random() * 0.6,
        floatOffset: Math.random() * Math.PI * 2,
        baseY: mesh.position.y
      };
      scene.add(mesh);
      shapes.push(mesh);
    }

    /* --- Mouse parallax --- */
    let targetX = 0, targetY = 0;
    document.addEventListener('mousemove', (e) => {
      targetX = (e.clientX / window.innerWidth - 0.5) * 40;
      targetY = (e.clientY / window.innerHeight - 0.5) * 25;
    });

    /* --- Animate --- */
    const clock = new THREE.Clock();
    const posAttr = geometry.getAttribute('position');

    const animate = () => {
      const t = clock.getElapsedTime();

      for (let ix = 0; ix < AMOUNTX; ix++) {
        for (let iy = 0; iy < AMOUNTY; iy++) {
          const idx = ix * AMOUNTY + iy;
          posAttr.array[idx * 3 + 1] =
            Math.sin((ix + t) * 0.32) * 11 +
            Math.sin((iy + t) * 0.28) * 11;
        }
      }
      posAttr.needsUpdate = true;

      shapes.forEach((mesh) => {
        mesh.rotation.x += mesh.userData.rx;
        mesh.rotation.y += mesh.userData.ry;
        mesh.position.y =
          mesh.userData.baseY +
          Math.sin(t * mesh.userData.floatSpeed + mesh.userData.floatOffset) * 16;
      });

      camera.position.x += (targetX - camera.position.x) * 0.04;
      camera.position.y += (120 - targetY - camera.position.y) * 0.04;
      camera.lookAt(0, 0, 0);

      renderer.render(scene, camera);
      requestAnimationFrame(animate);
    };
    animate();

    /* --- Resize --- */
    window.addEventListener('resize', () => {
      camera.aspect = window.innerWidth / window.innerHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(window.innerWidth, window.innerHeight);
    });
  }



});
