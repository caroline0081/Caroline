// === Sticky Nav ===
const nav = document.querySelector('.nav');
window.addEventListener('scroll', () => {
if (nav) nav.classList.toggle('scrolled', window.scrollY > 20);
}, { passive: true });

// === Mobile Navigation ===
const hamburger = document.querySelector('.nav-hamburger');
const navMobile = document.querySelector('.nav-mobile');
if (hamburger && navMobile) {
hamburger.addEventListener('click', () => {
hamburger.classList.toggle('open');
navMobile.classList.toggle('open');
});
}

// Close mobile nav on link click
document.querySelectorAll('.nav-mobile a').forEach(link => {
link.addEventListener('click', () => {
hamburger?.classList.remove('open');
navMobile?.classList.remove('open');
});
});

// === Active nav link ===
const currentPage = window.location.pathname.split('/').pop() || 'index.html';
document.querySelectorAll('.nav-links a, .nav-mobile a').forEach(link => {
const href = link.getAttribute('href');
if (href === currentPage || (currentPage === '' && href === 'index.html')) {
link.classList.add('active');
}
});

// === Open/Closed Status ===
function updateOpenStatus() {
const badge = document.getElementById('open-status');
if (!badge) return;
const now = new Date();
const day = now.getDay(); // 0=Sun, 1=Mon
const mins = now.getHours() * 60 + now.getMinutes();
let isOpen = false;
if (day === 0) isOpen = mins >= 780 && mins < 1200; // Sun 13:00-20:00
else if (day >= 2 && day <= 6) isOpen = mins >= 600 && mins < 1200; // Tue-Sat 10:00-20:00
// Monday always closed

if (isOpen) {
badge.innerHTML = '<span class="dot"></span> Open';
} else {
badge.innerHTML = '<span class="dot" style="background:#f87171;animation:none"></span> Gesloten';
badge.style.background = 'rgba(239,68,68,0.18)';
badge.style.color = '#fca5a5';
}
}
updateOpenStatus();

// === Scroll Animations ===
const fadeEls = document.querySelectorAll('.fade-up');
if (fadeEls.length && 'IntersectionObserver' in window) {
const observer = new IntersectionObserver(entries => {
entries.forEach(entry => {
if (entry.isIntersecting) {
entry.target.classList.add('visible');
observer.unobserve(entry.target);
}
});
}, { threshold: 0.1 });
fadeEls.forEach(el => observer.observe(el));
} else {
fadeEls.forEach(el => el.classList.add('visible'));
}

// === Booking Modal ===
const modalOverlay = document.getElementById('modal-overlay');
const openBtns = document.querySelectorAll('[data-open-modal]');
const closeBtn = document.getElementById('modal-close');

function openModal() {
if (modalOverlay) {
modalOverlay.classList.add('active');
document.body.style.overflow = 'hidden';
}
}
function closeModal() {
if (modalOverlay) {
modalOverlay.classList.remove('active');
document.body.style.overflow = '';
}
}

openBtns.forEach(btn => btn.addEventListener('click', e => { e.preventDefault(); openModal(); }));
closeBtn?.addEventListener('click', closeModal);
modalOverlay?.addEventListener('click', e => { if (e.target === modalOverlay) closeModal(); });
document.addEventListener('keydown', e => { if (e.key === 'Escape') closeModal(); });

// === Booking Request Form (sends via WhatsApp) ===
const bookingForm = document.getElementById('booking-form');
if (bookingForm) {
bookingForm.addEventListener('submit', e => {
e.preventDefault();
const val = name => bookingForm.querySelector(`[name="${name}"]`)?.value.trim() || '';

const naam = val('naam');
const telefoon = val('telefoon');
const behandeling = val('behandeling');
const datum = val('datum');
const tijd = val('tijd');
const opmerkingen = val('opmerkingen');

let datumStr = datum;
if (datum) {
try {
datumStr = new Date(datum).toLocaleDateString('nl-NL', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' });
} catch {}
}

const lines = [
'Hallo Minie! ',
'',
'Ik wil graag een afspraak maken:',
'',
` Naam: ${naam}`,
` Telefoon: ${telefoon}`,
` Behandeling: ${behandeling}`,
];
if (datumStr) lines.push(` Gewenste datum: ${datumStr}`);
if (tijd) lines.push(` Gewenste tijd: ${tijd}`);
if (opmerkingen) lines.push(` Opmerkingen: ${opmerkingen}`);
lines.push('', 'Graag hoor ik van u!');

const url = `https://wa.me/31685044588?text=${encodeURIComponent(lines.join('\n'))}`;
window.open(url, '_blank');

const successEl = document.getElementById('form-success');
if (successEl) {
bookingForm.style.display = 'none';
successEl.style.display = 'block';
}
});
}
