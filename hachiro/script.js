// Sticky nav background on scroll
  const nav = document.getElementById('siteNav');
  window.addEventListener('scroll', () => {
    nav.classList.toggle('scrolled', window.scrollY > 40);
  });

  // Mobile menu toggle
  const burger = document.getElementById('burgerBtn');
  const navLinks = document.getElementById('navLinks');
  burger.addEventListener('click', () => {
    navLinks.classList.toggle('mobile-open');
  });
  navLinks.querySelectorAll('a').forEach(a => {
    a.addEventListener('click', () => navLinks.classList.remove('mobile-open'));
  });

  // Scroll reveal
  const revealEls = document.querySelectorAll('.reveal');
  const io = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('in');
        io.unobserve(entry.target);
      }
    });
  }, { threshold: 0.15 });
  revealEls.forEach(el => io.observe(el));

  // Time Table data, grouped by category
  const timetableData = {
    ol: {
      title: 'O/L Japanese — Time Table',
      subtitle: 'Class days and times for Ordinary Level Japanese.',
      classes: [
        { name: 'Grade 10', rows: [{ day: 'Saturday', time: '1.00 PM – 3.00 PM' }] },
        { name: 'Grade 11', rows: [{ day: 'Friday', time: '3.00 PM – 5.00 PM' }] }
      ]
    },
    al: {
      title: 'A/L Japanese — Time Table',
      subtitle: 'Class days and times for Advanced Level Japanese.',
      classes: [
        { name: 'Grade 12 (2028 A/L)', rows: [
          { day: 'Sunday · Group A', time: '2.30 PM – 4.30 PM' },
          { day: 'Thursday · Group B', time: '3.30 PM – 5.30 PM' }
        ]},
        { name: 'Grade 13 (2027 A/L) — Theory & Revision', rows: [
          { day: 'Thursday', time: '9.00 AM – 2.00 PM' }
        ]}
      ]
    },
    jlpt: {
      title: 'JLPT / NAT N5, N4 & N3 — Time Table',
      subtitle: 'Class days and times for JLPT/NAT preparation.',
      classes: [
        { name: 'N5 Class', rows: [
          { day: 'Sunday', time: '9.00 AM – 1.00 PM' },
          { day: 'Saturday', time: '1.00 PM – 3.00 PM' }
        ]},
        { name: 'N4 Class', rows: [
          { day: 'Sunday', time: '6.00 PM – 8.00 PM' }
        ]}
      ]
    },
    kids: {
      title: 'Japanese for Kids — Time Table',
      subtitle: 'Class days and times for our young learners.',
      classes: [
        { name: 'Kids Class', rows: [{ day: 'Saturday', time: '11.00 AM – 12.30 PM' }] }
      ]
    }
  };

  function renderTimetableCard(cls) {
    const rowsHtml = cls.rows.map(r => `
      <div class="schedule-row">
        <span class="schedule-day">${r.day}</span>
        <span class="schedule-time">${r.time}</span>
      </div>`).join('');
    return `
      <div class="timetable-card">
        <h3><span class="dot"></span>${cls.name}</h3>
        ${rowsHtml}
      </div>`;
  }

  // Time Table modal
  const timetableModal = document.getElementById('timetableModal');
  const timetableModalTitle = document.getElementById('timetableModalTitle');
  const timetableModalSubtitle = document.getElementById('timetableModalSubtitle');
  const timetableModalGrid = document.getElementById('timetableModalGrid');

  document.querySelectorAll('.open-timetable').forEach(btn => btn.addEventListener('click', (e) => {
    e.preventDefault();
    const category = btn.dataset.category;
    const data = timetableData[category];
    if (!data) return;
    timetableModalTitle.textContent = data.title;
    timetableModalSubtitle.textContent = data.subtitle;
    timetableModalGrid.innerHTML = data.classes.map(renderTimetableCard).join('');
    timetableModal.classList.add('open');
  }));
  document.getElementById('closeTimetableModal').addEventListener('click', () => timetableModal.classList.remove('open'));
  timetableModal.addEventListener('click', (e) => { if (e.target === timetableModal) timetableModal.classList.remove('open'); });
  document.addEventListener('keydown', (e) => { if (e.key === 'Escape') timetableModal.classList.remove('open'); });

  // Testimonial carousel
  const track = document.getElementById('testiTrack');
  const slides = track.querySelectorAll('.testi-slide');
  const dotsWrap = document.getElementById('testiDots');
  let current = 0;
  let autoTimer;

  slides.forEach((_, i) => {
    const dot = document.createElement('button');
    if (i === 0) dot.classList.add('active');
    dot.addEventListener('click', () => goTo(i));
    dotsWrap.appendChild(dot);
  });
  const dots = dotsWrap.querySelectorAll('button');

  function goTo(index) {
    current = (index + slides.length) % slides.length;
    track.style.transform = `translateX(-${current * 100}%)`;
    dots.forEach((d, i) => d.classList.toggle('active', i === current));
    resetAuto();
  }
  function resetAuto() {
    clearInterval(autoTimer);
    autoTimer = setInterval(() => goTo(current + 1), 6000);
  }
  document.getElementById('testiNext').addEventListener('click', () => goTo(current + 1));
  document.getElementById('testiPrev').addEventListener('click', () => goTo(current - 1));
  resetAuto();

  // basic swipe support
  let touchStartX = 0;
  track.addEventListener('touchstart', (e) => { touchStartX = e.touches[0].clientX; }, {passive:true});
  track.addEventListener('touchend', (e) => {
    const dx = e.changedTouches[0].clientX - touchStartX;
    if (Math.abs(dx) > 40) goTo(current + (dx < 0 ? 1 : -1));
  }, {passive:true});