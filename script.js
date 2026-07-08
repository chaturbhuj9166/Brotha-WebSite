/* ============================================================
   BROTHA INFOTECH — Interactions
   ============================================================ */
(function () {
  'use strict';

  /* ---------- Navbar shadow on scroll ---------- */
  const navbar = document.getElementById('navbar');
  const onScroll = () => navbar.classList.toggle('scrolled', window.scrollY > 20);
  onScroll();
  window.addEventListener('scroll', onScroll, { passive: true });

  /* ---------- Mobile menu toggle ---------- */
  const navToggle = document.getElementById('navToggle');
  const navLinks = document.getElementById('navLinks');
  const closeMenu = () => { navLinks.classList.remove('open'); navToggle.classList.remove('active'); };

  navToggle.addEventListener('click', () => {
    navLinks.classList.toggle('open');
    navToggle.classList.toggle('active');
  });
  navLinks.querySelectorAll('a').forEach((a) => a.addEventListener('click', closeMenu));

  /* ---------- Scroll reveal ---------- */
  const revealEls = document.querySelectorAll('.reveal');
  if ('IntersectionObserver' in window) {
    const io = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
          io.unobserve(entry.target);
        }
      });
    }, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });
    revealEls.forEach((el) => io.observe(el));
  } else {
    revealEls.forEach((el) => el.classList.add('visible'));
  }

  /* ---------- Animated counters ---------- */
  const counters = document.querySelectorAll('.stat-num');
  const runCounter = (el) => {
    const target = +el.dataset.count;
    const duration = 1400;
    const start = performance.now();
    const step = (now) => {
      const p = Math.min((now - start) / duration, 1);
      const eased = 1 - Math.pow(1 - p, 3); // easeOutCubic
      el.textContent = Math.round(eased * target);
      if (p < 1) requestAnimationFrame(step);
    };
    requestAnimationFrame(step);
  };
  if ('IntersectionObserver' in window && counters.length) {
    const cio = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) { runCounter(entry.target); cio.unobserve(entry.target); }
      });
    }, { threshold: 0.6 });
    counters.forEach((c) => cio.observe(c));
  }

  /* ---------- Footer year ---------- */
  const yearEl = document.getElementById('year');
  if (yearEl) yearEl.textContent = new Date().getFullYear();

  /* ---------- Portfolio filter ---------- */
  const filterWrap = document.getElementById('portfolioFilters');
  const workCards = document.querySelectorAll('.work-card');
  const portfolioEmpty = document.getElementById('portfolioEmpty');
  if (filterWrap && workCards.length) {
    filterWrap.addEventListener('click', (e) => {
      const btn = e.target.closest('.filter-btn');
      if (!btn) return;
      filterWrap.querySelectorAll('.filter-btn').forEach((b) => b.classList.remove('active'));
      btn.classList.add('active');
      const filter = btn.dataset.filter;
      let shown = 0;
      workCards.forEach((card) => {
        const match = filter === 'all' || card.dataset.cat === filter;
        card.style.display = match ? '' : 'none';
        if (match) shown++;
      });
      if (portfolioEmpty) portfolioEmpty.hidden = shown !== 0;
    });
  }

  /* ---------- Newsletter subscribe (blog) ---------- */
  const subForm = document.getElementById('subscribeForm');
  const subNote = document.getElementById('subscribeNote');
  if (subForm) {
    subForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const email = subForm.email.value.trim();
      const ok = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
      subNote.className = 'form-note';
      if (!ok) {
        subNote.textContent = 'Please enter a valid email address.';
        subNote.classList.add('err');
        return;
      }
      subNote.textContent = 'Thanks for subscribing! We’ll be in touch.';
      subNote.classList.add('ok');
      subForm.reset();
    });
  }

  /* ---------- Contact form (client-side + WhatsApp fallback) ---------- */
  const form = document.getElementById('contactForm');
  const note = document.getElementById('formNote');
  if (form) {
    form.addEventListener('submit', (e) => {
      e.preventDefault();
      const name = form.name.value.trim();
      const email = form.email.value.trim();
      const emailOk = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

      note.className = 'form-note';
      if (!name || !emailOk) {
        note.textContent = 'Please enter a valid name and email.';
        note.classList.add('err');
        return;
      }

      // reCAPTCHA check — must be completed before the enquiry is sent.
      if (typeof grecaptcha !== 'undefined') {
        const captcha = grecaptcha.getResponse();
        if (!captcha) {
          note.textContent = 'Please confirm you are not a robot.';
          note.classList.add('err');
          return;
        }
      }

      const phone = form.phone.value.trim();
      const service = form.service.value;
      const message = form.message.value.trim();

      // Open a pre-filled WhatsApp chat so the enquiry actually reaches the business.
      const text =
        `New Enquiry — Brotha Infotech%0A%0A` +
        `Name: ${encodeURIComponent(name)}%0A` +
        `Email: ${encodeURIComponent(email)}%0A` +
        `Phone: ${encodeURIComponent(phone || '-')}%0A` +
        `Service: ${encodeURIComponent(service || '-')}%0A` +
        `Message: ${encodeURIComponent(message || '-')}`;

      window.open(`https://wa.me/918302071826?text=${text}`, '_blank', 'noopener');

      note.textContent = 'Thank you! Opening WhatsApp to send your enquiry…';
      note.classList.add('ok');
      form.reset();
      if (typeof grecaptcha !== 'undefined') grecaptcha.reset();
    });
  }
})();
