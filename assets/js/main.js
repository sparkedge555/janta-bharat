/* ===================================================================
   JANTA BHARAT AAWASIYA VIDYALAYA — GLOBAL SCRIPT
   File: assets/js/main.js
   This single script is shared by EVERY page of the site.
   Each section below is wrapped in its own function and only runs
   if the relevant elements exist on the current page, so this file
   can be safely included everywhere without errors.

   Sections:
     1. Mobile navigation toggle
     2. Sticky header scroll state
     3. Active nav link highlighting
     4. Footer current-year injection
     5. SparkEdge services popup modal
     6. Scroll-reveal animations (IntersectionObserver)
     7. Animated stat counters
     8. Testimonial / achievements carousel
     9. Gallery lightbox
     10. Accordion / FAQ expand-collapse
     11. Click-to-copy with toast notification
     12. Form validation helpers
     13. Hero parallax effect
   =================================================================== */

document.addEventListener('DOMContentLoaded', function () {
  initMobileNav();
  initStickyHeader();
  initActiveNavLink();
  initFooterYear();
  initSparkEdgeModal();
  initScrollReveal();
  initStatCounters();
  initCarousel();
  initLightbox();
  initAccordions();
  initCopyToClipboard();
  initHeroParallax();
});


/* ===================================================================
   1. MOBILE NAVIGATION TOGGLE
   Opens/closes the slide-in nav menu on small screens, and closes
   the menu automatically when a link is clicked or when the user
   clicks/taps outside of it.
   =================================================================== */
function initMobileNav() {
  var toggle = document.querySelector('.nav-toggle');
  var menu = document.querySelector('.nav-menu');

  if (!toggle || !menu) return;

  function closeMenu() {
    menu.classList.remove('is-open');
    toggle.setAttribute('aria-expanded', 'false');
  }

  function openMenu() {
    menu.classList.add('is-open');
    toggle.setAttribute('aria-expanded', 'true');
  }

  toggle.addEventListener('click', function (e) {
    e.stopPropagation();
    if (menu.classList.contains('is-open')) {
      closeMenu();
    } else {
      openMenu();
    }
  });

  // Close menu when any nav link is clicked (mobile)
  menu.querySelectorAll('a').forEach(function (link) {
    link.addEventListener('click', closeMenu);
  });

  // Close menu when clicking outside of it
  document.addEventListener('click', function (e) {
    if (menu.classList.contains('is-open') && !menu.contains(e.target) && !toggle.contains(e.target)) {
      closeMenu();
    }
  });

  // Close on Escape key
  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape' && menu.classList.contains('is-open')) {
      closeMenu();
    }
  });
}


/* ===================================================================
   2. STICKY HEADER SCROLL STATE
   Adds a shadow/background change to the header once the page has
   scrolled past a small threshold, for visual depth.
   =================================================================== */
function initStickyHeader() {
  var header = document.querySelector('.site-header');
  if (!header) return;

  var threshold = 12;

  function onScroll() {
    if (window.scrollY > threshold) {
      header.classList.add('site-header--scrolled');
    } else {
      header.classList.remove('site-header--scrolled');
    }
  }

  onScroll();
  window.addEventListener('scroll', onScroll, { passive: true });
}


/* ===================================================================
   3. ACTIVE NAV LINK HIGHLIGHTING
   Compares each nav link's href against the current page filename
   and adds an "active" class for visual highlighting + underline.
   =================================================================== */
function initActiveNavLink() {
  var links = document.querySelectorAll('.nav-menu a');
  if (!links.length) return;

  var currentPage = window.location.pathname.split('/').pop() || 'index.html';

  links.forEach(function (link) {
    var linkPage = link.getAttribute('href').split('/').pop();
    if (linkPage === currentPage) {
      link.classList.add('active');
      link.setAttribute('aria-current', 'page');
    }
  });
}


/* ===================================================================
   4. FOOTER CURRENT-YEAR INJECTION
   Replaces the contents of any element with [data-current-year]
   with the visitor's current year, so the copyright stays correct
   without manual edits.
   =================================================================== */
function initFooterYear() {
  var yearEls = document.querySelectorAll('[data-current-year]');
  if (!yearEls.length) return;

  var year = new Date().getFullYear();
  yearEls.forEach(function (el) {
    el.textContent = year;
  });
}


/* ===================================================================
   5. SPARKEDGE SERVICES POPUP MODAL
   Clicking the "SparkEdge" credit in the footer opens a small modal
   card that pitches web design/development services to visitors,
   with a link through to the SparkEdge agency website.
   =================================================================== */
function initSparkEdgeModal() {
  var openBtn = document.querySelector('[data-sparkedge-open]');
  var modal = document.querySelector('[data-sparkedge-modal]');
  if (!openBtn || !modal) return;

  var closeBtn = modal.querySelector('[data-sparkedge-close]');

  function openModal() {
    modal.classList.add('is-open');
    document.body.style.overflow = 'hidden';
    if (closeBtn) closeBtn.focus();
  }

  function closeModal() {
    modal.classList.remove('is-open');
    document.body.style.overflow = '';
    openBtn.focus();
  }

  openBtn.addEventListener('click', openModal);

  if (closeBtn) {
    closeBtn.addEventListener('click', closeModal);
  }

  // Close when clicking the dark overlay (outside the card)
  modal.addEventListener('click', function (e) {
    if (e.target === modal) closeModal();
  });

  // Close on Escape key
  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape' && modal.classList.contains('is-open')) {
      closeModal();
    }
  });
}


/* ===================================================================
   6. SCROLL-REVEAL ANIMATIONS
   Uses IntersectionObserver to add "is-visible" to any element with
   class "reveal" once it scrolls into the viewport, triggering the
   fade/slide-up transition defined in main.css.
   =================================================================== */
function initScrollReveal() {
  var revealEls = document.querySelectorAll('.reveal');
  if (!revealEls.length) return;

  // If IntersectionObserver isn't supported, just show everything
  if (!('IntersectionObserver' in window)) {
    revealEls.forEach(function (el) { el.classList.add('is-visible'); });
    return;
  }

  var observer = new IntersectionObserver(function (entries) {
    entries.forEach(function (entry) {
      if (entry.isIntersecting) {
        entry.target.classList.add('is-visible');
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.15 });

  revealEls.forEach(function (el) {
    observer.observe(el);
  });
}


/* ===================================================================
   7. ANIMATED STAT COUNTERS
   Animates numbers from 0 up to their target value (defined via
   [data-count-to]) when the stats section scrolls into view.
   =================================================================== */
function initStatCounters() {
  var counters = document.querySelectorAll('[data-count-to]');
  if (!counters.length) return;

  function animateCounter(el) {
    var target = parseInt(el.getAttribute('data-count-to'), 10) || 0;
    var suffix = el.getAttribute('data-count-suffix') || '';
    var duration = 1400; // ms
    var startTime = null;

    function step(timestamp) {
      if (!startTime) startTime = timestamp;
      var progress = Math.min((timestamp - startTime) / duration, 1);
      // Ease-out for a natural deceleration toward the target number
      var eased = 1 - Math.pow(1 - progress, 3);
      var current = Math.floor(eased * target);
      el.textContent = current + suffix;

      if (progress < 1) {
        window.requestAnimationFrame(step);
      } else {
        el.textContent = target + suffix;
      }
    }

    window.requestAnimationFrame(step);
  }

  if (!('IntersectionObserver' in window)) {
    counters.forEach(animateCounter);
    return;
  }

  var observer = new IntersectionObserver(function (entries) {
    entries.forEach(function (entry) {
      if (entry.isIntersecting) {
        animateCounter(entry.target);
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.4 });

  counters.forEach(function (el) {
    observer.observe(el);
  });
}


/* ===================================================================
   8. TESTIMONIAL / ACHIEVEMENTS CAROUSEL
   A lightweight auto-rotating carousel with prev/next buttons, dot
   navigation, swipe support on touch devices, and pause-on-hover.
   =================================================================== */
function initCarousel() {
  var carousel = document.querySelector('.carousel');
  if (!carousel) return;

  var track = carousel.querySelector('.carousel__slides');
  var slides = carousel.querySelectorAll('.carousel__slide');
  var prevBtn = carousel.querySelector('.carousel__prev');
  var nextBtn = carousel.querySelector('.carousel__next');
  var dotsWrap = carousel.querySelector('.carousel__dots');

  if (!track || !slides.length) return;

  var index = 0;
  var autoplayDelay = 5500;
  var autoplayTimer = null;

  // Build dot navigation dynamically based on slide count
  var dots = [];
  if (dotsWrap) {
    slides.forEach(function (_, i) {
      var dot = document.createElement('button');
      dot.className = 'carousel__dot';
      dot.setAttribute('aria-label', 'Go to slide ' + (i + 1));
      if (i === 0) dot.classList.add('is-active');
      dot.addEventListener('click', function () {
        goTo(i);
        restartAutoplay();
      });
      dotsWrap.appendChild(dot);
      dots.push(dot);
    });
  }

  function update() {
    track.style.transform = 'translateX(-' + (index * 100) + '%)';
    dots.forEach(function (dot, i) {
      dot.classList.toggle('is-active', i === index);
    });
  }

  function goTo(i) {
    index = (i + slides.length) % slides.length;
    update();
  }

  function next() { goTo(index + 1); }
  function prev() { goTo(index - 1); }

  function startAutoplay() {
    autoplayTimer = setInterval(next, autoplayDelay);
  }

  function stopAutoplay() {
    if (autoplayTimer) clearInterval(autoplayTimer);
  }

  function restartAutoplay() {
    stopAutoplay();
    startAutoplay();
  }

  if (nextBtn) nextBtn.addEventListener('click', function () { next(); restartAutoplay(); });
  if (prevBtn) prevBtn.addEventListener('click', function () { prev(); restartAutoplay(); });

  // Pause on hover/focus for readability
  carousel.addEventListener('mouseenter', stopAutoplay);
  carousel.addEventListener('mouseleave', startAutoplay);

  // Basic swipe support for touch devices
  var touchStartX = 0;
  track.addEventListener('touchstart', function (e) {
    touchStartX = e.touches[0].clientX;
    stopAutoplay();
  }, { passive: true });

  track.addEventListener('touchend', function (e) {
    var touchEndX = e.changedTouches[0].clientX;
    var delta = touchEndX - touchStartX;
    if (Math.abs(delta) > 40) {
      if (delta < 0) next(); else prev();
    }
    startAutoplay();
  }, { passive: true });

  update();
  startAutoplay();
}


/* ===================================================================
   9. GALLERY LIGHTBOX
   Opens a full-screen overlay when a gallery image is clicked, with
   next/prev navigation, keyboard arrow/escape support, and basic
   swipe support on touch devices.
   =================================================================== */
function initLightbox() {
  var items = document.querySelectorAll('[data-lightbox-src]');
  var lightbox = document.querySelector('.lightbox');
  if (!items.length || !lightbox) return;

  var imageEl = lightbox.querySelector('.lightbox__image-wrap img');
  var captionEl = lightbox.querySelector('.lightbox__caption');
  var closeBtn = lightbox.querySelector('.lightbox__close');
  var prevBtn = lightbox.querySelector('.lightbox__prev');
  var nextBtn = lightbox.querySelector('.lightbox__next');

  var images = Array.prototype.map.call(items, function (el) {
    return {
      src: el.getAttribute('data-lightbox-src'),
      caption: el.getAttribute('data-lightbox-caption') || ''
    };
  });

  var currentIndex = 0;

  function show(i) {
    currentIndex = (i + images.length) % images.length;
    var item = images[currentIndex];
    if (imageEl) {
      imageEl.src = item.src;
      imageEl.alt = item.caption || 'School gallery photo';
    }
    if (captionEl) captionEl.textContent = item.caption;
  }

  function open(i) {
    show(i);
    lightbox.classList.add('is-open');
    document.body.style.overflow = 'hidden';
  }

  function close() {
    lightbox.classList.remove('is-open');
    document.body.style.overflow = '';
  }

  items.forEach(function (el, i) {
    el.addEventListener('click', function () { open(i); });
    el.addEventListener('keydown', function (e) {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        open(i);
      }
    });
  });

  if (closeBtn) closeBtn.addEventListener('click', close);
  if (nextBtn) nextBtn.addEventListener('click', function () { show(currentIndex + 1); });
  if (prevBtn) prevBtn.addEventListener('click', function () { show(currentIndex - 1); });

  lightbox.addEventListener('click', function (e) {
    if (e.target === lightbox) close();
  });

  document.addEventListener('keydown', function (e) {
    if (!lightbox.classList.contains('is-open')) return;
    if (e.key === 'Escape') close();
    if (e.key === 'ArrowRight') show(currentIndex + 1);
    if (e.key === 'ArrowLeft') show(currentIndex - 1);
  });

  // Swipe support
  var touchStartX = 0;
  lightbox.addEventListener('touchstart', function (e) {
    touchStartX = e.touches[0].clientX;
  }, { passive: true });

  lightbox.addEventListener('touchend', function (e) {
    var delta = e.changedTouches[0].clientX - touchStartX;
    if (Math.abs(delta) > 40) {
      if (delta < 0) show(currentIndex + 1); else show(currentIndex - 1);
    }
  }, { passive: true });
}


/* ===================================================================
   10. ACCORDION / FAQ EXPAND-COLLAPSE
   Toggles ".is-open" on click, animating max-height for a smooth
   expand/collapse. Used on pages such as fee.html and admission.html.
   =================================================================== */
function initAccordions() {
  var triggers = document.querySelectorAll('.accordion-trigger');
  if (!triggers.length) return;

  triggers.forEach(function (trigger) {
    trigger.addEventListener('click', function () {
      var item = trigger.closest('.accordion-item');
      var panel = item.querySelector('.accordion-panel');
      var isOpen = item.classList.contains('is-open');

      if (isOpen) {
        panel.style.maxHeight = null;
        item.classList.remove('is-open');
        trigger.setAttribute('aria-expanded', 'false');
      } else {
        panel.style.maxHeight = panel.scrollHeight + 'px';
        item.classList.add('is-open');
        trigger.setAttribute('aria-expanded', 'true');
      }
    });
  });
}


/* ===================================================================
   11. CLICK-TO-COPY WITH TOAST NOTIFICATION
   Copies text from [data-copy-value] (or the element's own text) to
   the clipboard and shows a brief toast confirmation. Used for bank
   details on fee.html.
   =================================================================== */
function initCopyToClipboard() {
  var copyEls = document.querySelectorAll('[data-copy-value]');
  var toast = document.querySelector('.toast');
  if (!copyEls.length) return;

  copyEls.forEach(function (el) {
    el.addEventListener('click', function () {
      var value = el.getAttribute('data-copy-value') || el.textContent.trim();

      if (navigator.clipboard && navigator.clipboard.writeText) {
        navigator.clipboard.writeText(value).then(function () {
          showToast('Copied to clipboard');
        }).catch(function () {
          showToast('Could not copy — please copy manually');
        });
      } else {
        showToast('Could not copy — please copy manually');
      }
    });
  });

  function showToast(message) {
    if (!toast) return;
    var textNode = toast.querySelector('[data-toast-text]');
    if (textNode) textNode.textContent = message;
    toast.classList.add('is-visible');
    clearTimeout(toast._timer);
    toast._timer = setTimeout(function () {
      toast.classList.remove('is-visible');
    }, 2400);
  }
}


/* ===================================================================
   12. FORM VALIDATION HELPERS
   Small reusable helpers for admission/contact forms. Adds a basic
   "was-validated" state and shows inline error messages for required
   and pattern-mismatched fields. Individual pages call
   window.SchoolForms.validate(form) on submit.
   =================================================================== */
window.SchoolForms = (function () {

  function validate(form) {
    var valid = true;
    var fields = form.querySelectorAll('[required]');

    fields.forEach(function (field) {
      var errorEl = form.querySelector('[data-error-for="' + field.name + '"]');
      var fieldValid = field.checkValidity();

      if (!fieldValid) {
        valid = false;
        field.setAttribute('aria-invalid', 'true');
        if (errorEl) errorEl.style.display = 'block';
      } else {
        field.removeAttribute('aria-invalid');
        if (errorEl) errorEl.style.display = 'none';
      }
    });

    return valid;
  }

  return { validate: validate };
})();


/* ===================================================================
   13. HERO PARALLAX EFFECT
   Subtly shifts the hero background media on scroll for a gentle
   parallax feel. Disabled automatically for reduced-motion users via
   the prefers-reduced-motion check below.
   =================================================================== */
function initHeroParallax() {
  var media = document.querySelector('.hero__media');
  if (!media) return;

  var prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (prefersReducedMotion) return;

  function onScroll() {
    var offset = window.scrollY * 0.25;
    media.style.transform = 'translateY(' + offset + 'px)';
  }

  window.addEventListener('scroll', onScroll, { passive: true });
}