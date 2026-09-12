const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');

// Content stays visible if JavaScript or IntersectionObserver is unavailable.
if ('IntersectionObserver' in window && !reducedMotion.matches) {
  const observer = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.remove('reveal-pending');
        entry.target.classList.add('active');
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.05 });
  document.querySelectorAll('.reveal').forEach(item => {
    if (item.getBoundingClientRect().top >= window.innerHeight) {
      observer.observe(item);
      item.classList.add('reveal-pending');
    }
  });
}

// Accessible registration dialog with keyboard focus restoration.
const openModalBtn = document.querySelector('.open-modal');
const registerModal = document.getElementById('registerModal');
const closeModalBtn = document.querySelector('.close-modal');
if (openModalBtn && registerModal && closeModalBtn) {
  let previousOverflow;
  const closeModal = () => {
    registerModal.classList.remove('active');
    registerModal.setAttribute('aria-hidden', 'true');
    document.body.style.overflow = previousOverflow;
    openModalBtn.focus();
  };
  openModalBtn.addEventListener('click', event => {
    event.preventDefault();
    previousOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    registerModal.classList.add('active');
    registerModal.setAttribute('aria-hidden', 'false');
    closeModalBtn.focus();
  });
  closeModalBtn.addEventListener('click', closeModal);
  registerModal.addEventListener('click', event => {
    if (event.target === registerModal) closeModal();
  });
  registerModal.addEventListener('keydown', event => {
    if (event.key === 'Escape') { event.preventDefault(); closeModal(); }
    if (event.key === 'Tab') {
      const items = [...registerModal.querySelectorAll('a[href], button')];
      const first = items[0], last = items[items.length - 1];
      if (event.shiftKey && document.activeElement === first) { event.preventDefault(); last.focus(); }
      else if (!event.shiftKey && document.activeElement === last) { event.preventDefault(); first.focus(); }
    }
  });
}

// COUNT UP ON SCROLL
document.addEventListener("DOMContentLoaded", function () {
  const statsSection = document.querySelector(".stats-section");
  const stats = document.querySelectorAll(".stat-number");
  let counted = false;

  function countUp(element, endValue) {
    let startValue = 0;
    const duration = 5000;
    const increment = endValue / (duration / 16);

    const counter = setInterval(function () {
      startValue += increment;

      if (startValue >= endValue) {
        element.textContent = endValue + "+";
        clearInterval(counter);
      } else {
        element.textContent = Math.floor(startValue) + "+";
      }
    }, 16);
  }

  function startCounterOnScroll() {
    if (!statsSection || counted || reducedMotion.matches) return;

    const sectionTop = statsSection.getBoundingClientRect().top;
    const windowHeight = window.innerHeight;

    if (sectionTop < windowHeight - 150) {
      stats.forEach(function (stat) {
        const endValue = parseInt(stat.textContent);
        countUp(stat, endValue);
      });

      counted = true;
    }
  }

  window.addEventListener("scroll", startCounterOnScroll);
  window.addEventListener("load", startCounterOnScroll);
});


// MULTIPLE IMAGE SLIDERS
document.addEventListener("DOMContentLoaded", function () {
  const sliders = document.querySelectorAll(".image-slider-wrap");

  sliders.forEach(function (slider) {
    const images = slider.querySelectorAll(".slider-image");
    const dots = slider.querySelectorAll(".dot");
    let currentIndex = 0;

    if (!images.length || !dots.length) return;

    function showSlide(index) {
      images.forEach(function (image) {
        image.classList.remove("active");
      });

      dots.forEach(function (dot) {
        dot.classList.remove("active");
      });

      images[index].classList.add("active");
      dots[index].classList.add("active");
    }

    function nextSlide() {
      currentIndex++;

      if (currentIndex >= images.length) {
        currentIndex = 0;
      }

      showSlide(currentIndex);
    }

    dots.forEach(function (dot, index) {
      dot.setAttribute('role', 'button');
      dot.tabIndex = 0;
      dot.setAttribute('aria-label', (index + 1) + '-ci şəkli göstər');
      dot.addEventListener('keydown', event => {
        if (event.key === 'Enter' || event.key === ' ') { event.preventDefault(); dot.click(); }
      });
      dot.addEventListener("click", function () {
        currentIndex = index;
        showSlide(currentIndex);
      });
    });

    showSlide(currentIndex);
    if (!reducedMotion.matches) {
      setInterval(() => {
        if (!reducedMotion.matches && !slider.matches(':hover') && !slider.contains(document.activeElement)) nextSlide();
      }, 5000);
    }
  });
});
// SCROLL TO TOP BUTTON
document.addEventListener("DOMContentLoaded", function () {
  const scrollTopBtn = document.getElementById("scrollTopBtn");

  if (!scrollTopBtn) return;

  window.addEventListener("scroll", function () {
    if (window.scrollY > 300) {
      scrollTopBtn.classList.add("show");
    } else {
      scrollTopBtn.classList.remove("show");
    }
  });

  scrollTopBtn.addEventListener("click", function () {
    window.scrollTo({
      top: 0,
      behavior: reducedMotion.matches ? "instant" : "smooth"
    });
  });
});
const hamburger = document.querySelector('.hamburger');
const nav = document.querySelector('.main-nav');
if (hamburger && nav) {
  const mobile = window.matchMedia('(max-width: 768px)');
  const setOpen = open => {
    nav.classList.toggle('active', open);
    hamburger.setAttribute('aria-expanded', String(open));
    hamburger.setAttribute('aria-label', open ? 'Menyunu bağla' : 'Menyunu aç');
    nav.inert = mobile.matches && !open;
  };
  hamburger.addEventListener('click', () => setOpen(hamburger.getAttribute('aria-expanded') !== 'true'));
  document.addEventListener('keydown', event => {
    if (event.key === 'Escape' && nav.classList.contains('active')) { setOpen(false); hamburger.focus(); }
  });
  document.addEventListener('click', event => {
    if (!nav.contains(event.target) && !hamburger.contains(event.target)) setOpen(false);
  });
  nav.addEventListener('click', event => { if (event.target.closest('a')) setOpen(false); });
  document.addEventListener('focusin', event => {
    if (!nav.contains(event.target) && !hamburger.contains(event.target)) setOpen(false);
  });
  mobile.addEventListener('change', () => setOpen(false));
  document.documentElement.classList.add('nav-ready');
  setOpen(false);
}

// Header activity menu: the label and arrow act as one menu trigger.
document.querySelectorAll('.activity-menu').forEach(menu => {
  const toggle = menu.querySelector('.activity-menu-toggle');
  const label = menu.querySelector('.activity-menu-label');
  const setOpen = open => {
    menu.classList.toggle('open', open);
    toggle.setAttribute('aria-expanded', String(open));
  };
  const toggleMenu = event => {
    event.preventDefault();
    setOpen(toggle.getAttribute('aria-expanded') !== 'true');
  };
  toggle.addEventListener('click', toggleMenu);
  label?.addEventListener('click', toggleMenu);
  toggle.addEventListener('keydown', event => {
    if (event.key === 'Escape') setOpen(false);
  });
  menu.addEventListener('mouseleave', () => {
    if (window.matchMedia('(hover: hover)').matches) setOpen(false);
  });
  document.addEventListener('click', event => {
    if (!menu.contains(event.target)) setOpen(false);
  });
});

const heroVideo = document.querySelector('.hero-bg-video');
const videoToggle = document.querySelector('.video-toggle');
if (heroVideo && videoToggle) {
  const syncVideo = () => {
    const label = heroVideo.paused ? 'Videonu oynat' : 'Videonu dayandır';
    videoToggle.textContent = label;
    videoToggle.setAttribute('aria-label', label);
  };
  heroVideo.addEventListener('play', syncVideo);
  heroVideo.addEventListener('pause', syncVideo);
  videoToggle.addEventListener('click', () => {
    if (heroVideo.paused) heroVideo.play().catch(syncVideo);
    else heroVideo.pause();
  });
  reducedMotion.addEventListener('change', () => { if (reducedMotion.matches) heroVideo.pause(); });
  // Mobile and data-saving visitors receive the lightweight poster first.
  if (!reducedMotion.matches && !navigator.connection?.saveData && window.matchMedia('(min-width: 769px)').matches) {
    heroVideo.play().catch(syncVideo);
  }
}

// Server-free content feed. New events and announcements are edited in data/site-content.json.
const escapeHtml = value => String(value).replace(/[&<>'"]/g, character => ({
  '&': '&amp;', '<': '&lt;', '>': '&gt;', "'": '&#39;', '"': '&quot;'
}[character]));

const formatEventDate = date => new Intl.DateTimeFormat('az-AZ', {
  day: 'numeric', month: 'long', year: 'numeric', hour: '2-digit', minute: '2-digit'
}).format(new Date(date));

const startCountdown = card => {
  if (!card) return;
  const target = new Date(card.dataset.eventDate).getTime();
  const update = () => {
    const distance = Math.max(0, target - Date.now());
    const values = {
      days: Math.floor(distance / 86400000),
      hours: Math.floor((distance % 86400000) / 3600000),
      minutes: Math.floor((distance % 3600000) / 60000)
    };
    Object.entries(values).forEach(([key, value]) => {
      const field = card.querySelector(`[data-count="${key}"]`);
      if (field) field.textContent = String(value).padStart(2, '0');
    });
  };
  update();
  window.setInterval(update, 60000);
};

const renderContentFeed = async () => {
  const eventsContainer = document.getElementById('upcoming-events');
  const newsContainer = document.getElementById('news-list');
  if (!eventsContainer && !newsContainer) return;

  try {
    const response = await fetch('data/site-content.json', { cache: 'no-cache' });
    if (!response.ok) throw new Error('Məlumatlar yüklənmədi');
    const content = await response.json();

    if (eventsContainer) {
      const event = (content.events || []).find(item => new Date(item.date).getTime() > Date.now());
      eventsContainer.innerHTML = event
        ? `<article class="upcoming-card" data-event-date="${escapeHtml(event.date)}">
            <div class="upcoming-date"><span>${escapeHtml(event.category)}</span><strong>${escapeHtml(formatEventDate(event.date))}</strong></div>
            <div class="upcoming-copy"><h3>${escapeHtml(event.title)}</h3><p>${escapeHtml(event.description)}</p><span><i class="fa-solid fa-location-dot" aria-hidden="true"></i> ${escapeHtml(event.location)}</span></div>
            <div class="countdown" aria-label="Tədbirə qalan vaxt"><div><strong data-count="days">–</strong><span>gün</span></div><div><strong data-count="hours">–</strong><span>saat</span></div><div><strong data-count="minutes">–</strong><span>dəqiqə</span></div></div>
            <a href="${escapeHtml(event.url)}" class="upcoming-link">Ətraflı bax <i class="fa-solid fa-arrow-right" aria-hidden="true"></i></a>
          </article>`
        : '<p class="empty-content">Hazırda elan edilmiş yeni tədbir yoxdur. Yeniliklər üçün bizi izləyin.</p>';
      startCountdown(eventsContainer.querySelector('[data-event-date]'));
    }

    if (newsContainer) {
      newsContainer.innerHTML = (content.news || []).map(item => `
        <article class="news-card"><span class="news-tag">${escapeHtml(item.tag)}</span><h3>${escapeHtml(item.title)}</h3><p>${escapeHtml(item.description)}</p><a href="${escapeHtml(item.url)}">Ətraflı oxu <i class="fa-solid fa-arrow-right" aria-hidden="true"></i></a></article>`).join('')
        || '<p class="empty-content">Yeni elan yoxdur.</p>';
    }
  } catch {
    const message = '<p class="empty-content">Məlumatlar hazırda yüklənmir. Zəhmət olmasa bir az sonra yenidən yoxlayın.</p>';
    if (eventsContainer) eventsContainer.innerHTML = message;
    if (newsContainer) newsContainer.innerHTML = message;
  }
};

renderContentFeed();

// Reusable category filters for activities, courses and photos.
document.querySelectorAll('[data-filter-group]').forEach(group => {
  const scope = group.closest('section')?.parentElement || document;
  const controls = [...group.querySelectorAll('[data-filter]')];
  const items = [...scope.querySelectorAll('.filter-item')];
  controls.forEach(control => control.addEventListener('click', () => {
    const filter = control.dataset.filter;
    controls.forEach(button => {
      const active = button === control;
      button.classList.toggle('active', active);
      button.setAttribute('aria-pressed', String(active));
    });
    items.forEach(item => { item.hidden = filter !== 'all' && item.dataset.category !== filter; });
  }));
});

// Accessible full-screen image view for the activity gallery.
const lightbox = document.getElementById('gallery-lightbox');
if (lightbox) {
  const image = lightbox.querySelector('img');
  const caption = lightbox.querySelector('p');
  const closeButton = lightbox.querySelector('.lightbox-close');
  let previousFocus;
  const closeLightbox = () => {
    lightbox.classList.remove('active');
    lightbox.setAttribute('aria-hidden', 'true');
    document.body.style.overflow = '';
    previousFocus?.focus();
  };
  document.querySelectorAll('.gallery-item').forEach(item => item.addEventListener('click', () => {
    previousFocus = item;
    image.src = item.dataset.image;
    image.alt = item.querySelector('img')?.alt || '';
    caption.textContent = item.dataset.caption || '';
    lightbox.classList.add('active');
    lightbox.setAttribute('aria-hidden', 'false');
    document.body.style.overflow = 'hidden';
    closeButton.focus();
  }));
  closeButton.addEventListener('click', closeLightbox);
  lightbox.addEventListener('click', event => { if (event.target === lightbox) closeLightbox(); });
  document.addEventListener('keydown', event => { if (event.key === 'Escape' && lightbox.classList.contains('active')) closeLightbox(); });
}

// A separate fast contact option that does not modify the site's existing links.
const quickWhatsApp = document.createElement('a');
quickWhatsApp.className = 'quick-whatsapp';
quickWhatsApp.href = 'https://wa.me/994504452719?text=Salam%2C%20Wise%20Intellectual%20Teachers%20haqq%C4%B1nda%20m%C9%99lumat%20almaq%20ist%C9%99yir%C9%99m.';
quickWhatsApp.target = '_blank';
quickWhatsApp.rel = 'noopener noreferrer';
quickWhatsApp.setAttribute('aria-label', 'WhatsApp vasitəsilə bizə yazın');
quickWhatsApp.innerHTML = '<i class="fa-brands fa-whatsapp" aria-hidden="true"></i><span>Bizə yazın</span>';
document.body.append(quickWhatsApp);
