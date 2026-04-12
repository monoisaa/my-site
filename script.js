// ===== Language Switcher =====
(function () {
  const toggle = document.querySelector('.lang-toggle');
  const options = toggle.querySelectorAll('.lang-toggle__option');
  const translatables = document.querySelectorAll('[data-ru][data-en]');

  function setLang(lang) {
    document.documentElement.lang = lang;
    translatables.forEach(function (el) {
      el.textContent = el.getAttribute('data-' + lang);
    });
    options.forEach(function (opt) {
      opt.classList.toggle('lang-toggle__option--active', opt.dataset.lang === lang);
    });
    localStorage.setItem('lang', lang);
  }

  toggle.addEventListener('click', function () {
    var current = localStorage.getItem('lang') || 'ru';
    setLang(current === 'ru' ? 'en' : 'ru');
  });

  // Restore saved language
  var saved = localStorage.getItem('lang');
  if (saved && saved !== 'ru') {
    setLang(saved);
  }
})();

// ===== Burger Menu =====
(function () {
  var burger = document.querySelector('.burger');
  var navLinks = document.querySelector('.nav__links');

  burger.addEventListener('click', function () {
    var isOpen = burger.classList.toggle('burger--open');
    navLinks.classList.toggle('nav__links--open', isOpen);
    burger.setAttribute('aria-expanded', isOpen);
  });

  // Close menu on link click
  navLinks.querySelectorAll('a').forEach(function (link) {
    link.addEventListener('click', function () {
      burger.classList.remove('burger--open');
      navLinks.classList.remove('nav__links--open');
      burger.setAttribute('aria-expanded', 'false');
    });
  });
})();

// ===== Scroll Reveal =====
(function () {
  var reveals = document.querySelectorAll('.anim-reveal');
  var observer = new IntersectionObserver(function (entries) {
    entries.forEach(function (entry) {
      if (entry.isIntersecting) {
        entry.target.classList.add('is-visible');
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.1 });

  reveals.forEach(function (el) { observer.observe(el); });
})();

// ===== Timeline Scroll Draw =====
(function () {
  var timeline = document.querySelector('[data-timeline]');
  if (!timeline) return;

  var observer = new IntersectionObserver(function (entries) {
    entries.forEach(function (entry) {
      if (entry.isIntersecting) {
        timeline.classList.add('timeline--visible');
        observer.unobserve(timeline);
        window.addEventListener('scroll', drawLine, { passive: true });
        drawLine();
      }
    });
  }, { threshold: 0.05 });

  function drawLine() {
    var rect = timeline.getBoundingClientRect();
    var windowH = window.innerHeight;
    var timelineH = rect.height;

    // How far the viewport bottom has traveled into the timeline
    var progress = (windowH - rect.top) / (timelineH + windowH * 0.5);
    progress = Math.max(0, Math.min(1, progress));

    timeline.style.setProperty('--timeline-height', (progress * 100) + '%');

    if (progress >= 1) {
      window.removeEventListener('scroll', drawLine);
    }
  }

  observer.observe(timeline);
})();
