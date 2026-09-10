// Solvaris Energy — shared site behaviour
document.addEventListener('DOMContentLoaded', function () {

  // Mobile nav toggle
  var toggle = document.querySelector('.nav-toggle');
  var nav = document.querySelector('.main-nav');
  if (toggle && nav) {
    toggle.addEventListener('click', function () {
      var open = nav.classList.toggle('open');
      toggle.setAttribute('aria-expanded', open ? 'true' : 'false');
    });
  }

  // Mobile-only accordion behaviour for dropdown menus
  document.querySelectorAll('.has-drop > .nav-link').forEach(function (link) {
    link.addEventListener('click', function (e) {
      if (window.innerWidth <= 900) {
        e.preventDefault();
        var li = link.parentElement;
        var wasOpen = li.classList.contains('open');
        document.querySelectorAll('.has-drop.open').forEach(function (el) { el.classList.remove('open'); });
        if (!wasOpen) li.classList.add('open');
      }
    });
  });

  // Close mobile nav when a real link is followed
  document.querySelectorAll('.main-nav a:not(.has-drop > .nav-link)').forEach(function (a) {
    a.addEventListener('click', function () {
      if (window.innerWidth <= 900 && nav) nav.classList.remove('open');
    });
  });

  // FAQ accordion
  document.querySelectorAll('.faq-q').forEach(function (btn) {
    btn.addEventListener('click', function () {
      var item = btn.closest('.faq-item');
      item.classList.toggle('open');
    });
  });

  // FAQ category filter
  var filterBtns = document.querySelectorAll('.faq-filter button');
  if (filterBtns.length) {
    filterBtns.forEach(function (btn) {
      btn.addEventListener('click', function () {
        filterBtns.forEach(function (b) { b.classList.remove('active'); });
        btn.classList.add('active');
        var cat = btn.getAttribute('data-cat');
        document.querySelectorAll('.faq-item').forEach(function (item) {
          var show = cat === 'all' || item.getAttribute('data-cat') === cat;
          item.style.display = show ? '' : 'none';
        });
      });
    });
  }

  // Header shadow on scroll
  var header = document.querySelector('.site-header');
  if (header) {
    var onScroll = function () {
      header.style.boxShadow = window.scrollY > 8 ? '0 1px 0 rgba(20,38,33,0.08)' : 'none';
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();
  }

  // Static contact form — prevents submission, shows inline confirmation
  var form = document.querySelector('.contact-form');
  if (form) {
    form.addEventListener('submit', function (e) {
      e.preventDefault();
      var note = form.querySelector('.form-confirm');
      if (note) {
        note.hidden = false;
        note.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
      }
      form.reset();
    });
  }

  // Animate stat numbers into view once
  var stats = document.querySelectorAll('[data-count]');
  if (stats.length && 'IntersectionObserver' in window) {
    var seen = new WeakSet();
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting && !seen.has(entry.target)) {
          seen.add(entry.target);
          var el = entry.target;
          var end = parseFloat(el.getAttribute('data-count'));
          var suffix = el.getAttribute('data-suffix') || '';
          var dur = 1100, start = null;
          function step(ts) {
            if (!start) start = ts;
            var p = Math.min((ts - start) / dur, 1);
            var eased = 1 - Math.pow(1 - p, 3);
            var val = end < 100 ? (end * eased).toFixed(1) : Math.round(end * eased);
            el.textContent = val + suffix;
            if (p < 1) requestAnimationFrame(step);
          }
          requestAnimationFrame(step);
        }
      });
    }, { threshold: 0.5 });
    stats.forEach(function (el) { io.observe(el); });
  }
});
