// ===== Theme Toggle =====
function toggleTheme() {
  var isDark = document.body.classList.toggle('dark');
  localStorage.setItem('theme', isDark ? 'dark' : 'light');
  updateThemeIcon();
}

function updateThemeIcon() {
  var icon = document.querySelector('.theme-toggle__icon');
  if (!icon) return;
  var isDark = document.body.classList.contains('dark');
  icon.textContent = isDark ? icon.dataset.dark : icon.dataset.light;
}

// Restore saved theme
(function () {
  if (localStorage.getItem('theme') === 'dark') {
    document.body.classList.add('dark');
  }
  updateThemeIcon();
})();

// ===== Language Toggle =====
var currentLang = localStorage.getItem('lang') || 'ru';

function toggleLang() {
  currentLang = currentLang === 'ru' ? 'en' : 'ru';
  setLang(currentLang);
}

function setLang(lang) {
  currentLang = lang;
  document.documentElement.lang = lang;
  document.querySelectorAll('[data-ru][data-en]').forEach(function (el) {
    el.textContent = el.getAttribute('data-' + lang);
  });
  // Update toggle highlight
  var ru = document.querySelector('.lang-toggle__ru');
  var en = document.querySelector('.lang-toggle__en');
  if (ru && en) {
    ru.classList.toggle('lang--active', lang === 'ru');
    en.classList.toggle('lang--active', lang === 'en');
  }
  localStorage.setItem('lang', lang);
}

// Restore saved language
(function () {
  var saved = localStorage.getItem('lang') || 'ru';
  setLang(saved);
})();

// ===== Burger Menu =====
(function () {
  var burger = document.querySelector('.burger');
  var navLinks = document.querySelector('.nav__links');
  if (!burger || !navLinks) return;

  burger.addEventListener('click', function () {
    var isOpen = burger.classList.toggle('burger--open');
    navLinks.classList.toggle('nav__links--open', isOpen);
    burger.setAttribute('aria-expanded', isOpen);
  });

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

  // Fit the SVG path to the actual timeline height
  var svgEl = timeline.querySelector('.timeline__line');
  var pathEl = timeline.querySelector('.timeline__line-path');

  function fitPath() {
    if (!svgEl || !pathEl) return;
    var h = timeline.scrollHeight;
    svgEl.setAttribute('viewBox', '0 0 12 ' + h);
    // Build a wavy path that spans the full height
    var d = 'M6 0';
    for (var y = 0; y < h; y += 40) {
      var cx = (y / 40) % 2 === 0 ? 3 : 9;
      var endY = Math.min(y + 40, h);
      d += ' Q' + cx + ' ' + (y + 20) + ',' + 6 + ' ' + endY;
    }
    pathEl.setAttribute('d', d);
  }

  var observer = new IntersectionObserver(function (entries) {
    entries.forEach(function (entry) {
      if (entry.isIntersecting) {
        fitPath();
        timeline.classList.add('timeline--visible');
        observer.unobserve(timeline);
        window.addEventListener('scroll', drawLine, { passive: true });
        window.addEventListener('resize', fitPath);
        drawLine();
      }
    });
  }, { threshold: 0.05 });

  function drawLine() {
    var rect = timeline.getBoundingClientRect();
    var windowH = window.innerHeight;
    var timelineH = rect.height;
    var progress = (windowH - rect.top) / (timelineH + windowH * 0.5);
    progress = Math.max(0, Math.min(1, progress));
    var clipBottom = (1 - progress) * 100;
    timeline.style.setProperty('--timeline-clip', clipBottom + '%');
    if (progress >= 1) {
      window.removeEventListener('scroll', drawLine);
    }
  }

  observer.observe(timeline);
})();

// ===== Watercolor Cursor (desktop only) =====
(function () {
  if (!window.matchMedia('(hover: hover)').matches) return;

  var pool = [];
  var MAX = 20;

  document.addEventListener('mousemove', function (e) {
    var dot = document.createElement('div');
    dot.style.cssText =
      'position:fixed;pointer-events:none;width:20px;height:20px;border-radius:50%;' +
      'background:radial-gradient(circle,rgba(61,59,142,0.08),transparent);' +
      'left:' + (e.clientX - 10) + 'px;top:' + (e.clientY - 10) + 'px;' +
      'opacity:1;transition:opacity 0.8s ease;z-index:9999;';
    document.body.appendChild(dot);
    pool.push(dot);

    requestAnimationFrame(function () { dot.style.opacity = '0'; });

    if (pool.length > MAX) {
      var old = pool.shift();
      old.remove();
    }

    setTimeout(function () {
      var idx = pool.indexOf(dot);
      if (idx !== -1) pool.splice(idx, 1);
      dot.remove();
    }, 800);
  });
})();
