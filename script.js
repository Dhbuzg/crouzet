const cards = [...document.querySelectorAll('.platter')];
const gallery = document.querySelector('.platter-gallery');
const gallerySection = document.querySelector('#plateaux');
const mobileLayout = matchMedia('(max-width: 760px)');
let selectedCard = null;
let lastPointerX = null;
function selectCard(card) {
  selectedCard = card;
  for (const item of cards) {
    const active = item === card;
    item.classList.toggle('is-active', active);
    item.querySelector('button').setAttribute('aria-expanded', String(active || matchMedia('(max-width: 760px)').matches));
    item.querySelector('.platter-info').setAttribute('aria-hidden', String(!active && !matchMedia('(max-width: 760px)').matches));
  }
}

// Use one stable surface: overlapping cards must never decide which card is active.
// The section includes the empty space above, below and between the photographs.
function selectAtPosition(clientX, stabilize = true) {
  const bounds = gallery.getBoundingClientRect();
  const x = Math.max(0, Math.min(bounds.width - 1, clientX - bounds.left));
  const zoneWidth = bounds.width / cards.length;
  const index = Math.floor(x / zoneWidth);
  const current = cards.indexOf(selectedCard);
  // A small dead band prevents flicker when the pointer rests at a boundary.
  if (stabilize && current >= 0 && Math.abs(index - current) === 1) {
    const boundary = Math.max(index, current) * zoneWidth;
    if (Math.abs(x - boundary) < 8) return;
  }
  if (cards[index] !== selectedCard) selectCard(cards[index]);
}
gallerySection.addEventListener('pointermove', event => {
  if (event.pointerType !== 'mouse' || mobileLayout.matches) return;
  if (lastPointerX !== null && Math.abs(event.clientX - lastPointerX) < 2) return;
  lastPointerX = event.clientX;
  selectAtPosition(event.clientX);
});
gallerySection.addEventListener('pointerleave', () => { lastPointerX = null; });
gallery.addEventListener('pointerdown', event => {
  if (event.pointerType !== 'mouse' || mobileLayout.matches) return;
  // Do not focus a different underlying card when clicking through the stack.
  event.preventDefault();
  selectAtPosition(event.clientX, false);
});
cards.forEach(card => {
  card.querySelector('button').addEventListener('focus', () => selectCard(card));
  card.querySelector('button').addEventListener('click', event => {
    if (event.detail && !mobileLayout.matches && event.pointerType === 'mouse') {
      selectAtPosition(event.clientX, false);
    } else selectCard(card);
  });
  card.querySelector('button').addEventListener('keydown', event => {
    if (!['ArrowLeft', 'ArrowRight', 'Home', 'End'].includes(event.key)) return;
    event.preventDefault();
    let index = cards.indexOf(card);
    index = event.key === 'Home' ? 0 : event.key === 'End' ? cards.length - 1 : (index + (event.key === 'ArrowRight' ? 1 : -1) + cards.length) % cards.length;
    cards[index].querySelector('button').focus({preventScroll:true});
    if (matchMedia('(max-width: 760px)').matches) cards[index].scrollIntoView({behavior:matchMedia('(prefers-reduced-motion: reduce)').matches?'instant':'smooth',block:'nearest',inline:'center'});
  });
});
selectCard(cards.at(-1));
mobileLayout.addEventListener('change', () => {
  lastPointerX = null;
  selectCard(selectedCard);
});

// Observe a stationary marker, not the translated caption, so unfolding cannot
// change the intersection geometry or trigger the animation prematurely.
const reducedMotion = matchMedia('(prefers-reduced-motion: reduce)');
if ('IntersectionObserver' in window && !reducedMotion.matches) {
  const captionObserver = new IntersectionObserver(entries => {
    for (const entry of entries) {
      if (!entry.isIntersecting) continue;
      const caption = entry.target.parentElement.querySelector('figcaption');
      caption.classList.remove('caption-pending');
      caption.classList.add('caption-revealed');
      captionObserver.unobserve(entry.target);
      entry.target.remove();
    }
  }, { rootMargin: '0px 0px -40px 0px', threshold: 0 });
  document.querySelectorAll('.hero-photo figcaption, .history-content figcaption').forEach(caption => {
    caption.classList.add('caption-pending');
    const marker = document.createElement('span');
    marker.className = 'caption-trigger';
    marker.setAttribute('aria-hidden', 'true');
    caption.parentElement.append(marker);
    captionObserver.observe(marker);
  });
  reducedMotion.addEventListener('change', event => {
    if (!event.matches) return;
    captionObserver.disconnect();
    document.querySelectorAll('.caption-pending').forEach(caption => caption.classList.remove('caption-pending'));
    document.querySelectorAll('.caption-trigger').forEach(marker => marker.remove());
  });
}

// Align thin rules to physical pixels, including after fonts load or zoom changes.
const headingRules = [...document.querySelectorAll('.heading-line')];
function alignHeadingRules() {
  const ratio = window.devicePixelRatio || 1;
  for (const line of headingRules) {
    line.style.transform = 'none';
    const y = line.getBoundingClientRect().top + window.scrollY;
    line.style.height = `${Math.max(1, Math.round(ratio)) / ratio}px`;
    line.style.transform = `translateY(${Math.round(y * ratio) / ratio - y}px)`;
  }
}
let rulesFrame;
function scheduleRuleAlignment() {
  cancelAnimationFrame(rulesFrame);
  rulesFrame = requestAnimationFrame(alignHeadingRules);
}
window.addEventListener('resize', scheduleRuleAlignment);
if ('ResizeObserver' in window) {
  const rulesObserver = new ResizeObserver(scheduleRuleAlignment);
  document.querySelectorAll('main, main > section, .hero-photo').forEach(node => rulesObserver.observe(node));
}
document.fonts.ready.then(scheduleRuleAlignment);
scheduleRuleAlignment();

// A deliberate navigation duration, independent of the browser's smooth scroll.
let navigationFrame;
function cancelNavigation() {
  cancelAnimationFrame(navigationFrame);
  navigationFrame = null;
}
for (const type of ['wheel', 'touchstart', 'pointerdown']) {
  window.addEventListener(type, cancelNavigation, { passive: true });
}
window.addEventListener('keydown', event => {
  if (['ArrowUp', 'ArrowDown', 'PageUp', 'PageDown', 'Home', 'End', ' ', 'Escape', 'Tab'].includes(event.key)) cancelNavigation();
});
window.addEventListener('popstate', cancelNavigation);
window.addEventListener('resize', cancelNavigation);
reducedMotion.addEventListener('change', cancelNavigation);
document.querySelectorAll('header nav a[href^="#"]').forEach(link => {
  link.addEventListener('click', event => {
    if (event.button !== 0 || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;
    const target = document.querySelector(link.hash);
    if (!target) return;
    event.preventDefault();
    cancelNavigation();
    const start = window.scrollY;
    const padding = parseFloat(getComputedStyle(document.documentElement).scrollPaddingTop) || 0;
    const end = Math.max(0, Math.min(target.getBoundingClientRect().top + start - padding,
      document.documentElement.scrollHeight - window.innerHeight));
    if (location.hash !== link.hash) history.pushState(null, '', link.hash);
    const finish = () => {
      window.scrollTo({ top: end, behavior: 'instant' });
      const hadTabIndex = target.hasAttribute('tabindex');
      if (!hadTabIndex) target.setAttribute('tabindex', '-1');
      target.focus({ preventScroll: true });
      if (!hadTabIndex) target.addEventListener('blur', () => target.removeAttribute('tabindex'), { once: true });
      navigationFrame = null;
    };
    if (reducedMotion.matches || Math.abs(end - start) < 1) { finish(); return; }
    const duration = Math.min(1200, 800 + Math.abs(end - start) * .08);
    const began = performance.now();
    const step = now => {
      const progress = Math.min(1, (now - began) / duration);
      const eased = 1 - Math.pow(1 - progress, 3);
      window.scrollTo({ top: start + (end - start) * eased, behavior: 'instant' });
      if (progress < 1) navigationFrame = requestAnimationFrame(step);
      else finish();
    };
    navigationFrame = requestAnimationFrame(step);
  });
});
