const cards = [...document.querySelectorAll('.platter')];
const gallery = document.querySelector('.platter-gallery');
const gallerySection = document.querySelector('#plateaux');
const mobileLayout = matchMedia('(max-width: 760px)');
let selectedCard = null;
function selectCard(card) {
  selectedCard = card;
  const selectedIndex = cards.indexOf(card);
  for (const [index, item] of cards.entries()) {
    const active = item === card;
    // Stack each neighbour above the cards farther from the selected image.
    item.style.zIndex = String(cards.length - Math.abs(index - selectedIndex));
    item.classList.toggle('is-active', active);
    item.querySelector('button').setAttribute('aria-expanded', String(active));
    item.querySelector('.platter-info').setAttribute('aria-hidden', String(!active));
  }
}

// Resolve hover from the visible image stack, with a 24 px surrounding margin.
// Use the original stack order so raising an active card cannot cause flicker.
function selectAtPosition(clientX, clientY) {
  const bounds = cards.map(card => card.querySelector('button').getBoundingClientRect());
  const contains = (r, margin) => clientX >= r.left - margin && clientX <= r.right + margin && clientY >= r.top - margin && clientY <= r.bottom + margin;
  let index = bounds.findLastIndex(r => contains(r, 0));
  if (index < 0) {
    let distance = Infinity;
    bounds.forEach((r, i) => {
      if (!contains(r, 24)) return;
      const d = Math.hypot(Math.max(r.left - clientX, 0, clientX - r.right), Math.max(r.top - clientY, 0, clientY - r.bottom));
      if (d <= distance) { distance = d; index = i; }
    });
  }
  if (index >= 0 && cards[index] !== selectedCard) selectCard(cards[index]);
}

document.addEventListener('pointermove', event => {
  if (event.pointerType !== 'mouse' || mobileLayout.matches) return;
  selectAtPosition(event.clientX, event.clientY);
});

gallery.addEventListener('pointerdown', event => {
  if (event.pointerType !== 'mouse' || mobileLayout.matches) return;
  event.preventDefault();
  selectAtPosition(event.clientX, event.clientY);
});
cards.forEach(card => {
  card.querySelector('button').addEventListener('focus', () => selectCard(card));
  card.querySelector('button').addEventListener('click', event => {
    if (event.detail && !mobileLayout.matches && event.pointerType === 'mouse') {
      selectAtPosition(event.clientX, event.clientY);
    } else selectCard(card);
  });
  card.querySelector('button').addEventListener('keydown', event => {
    if (!['ArrowLeft', 'ArrowRight', 'Home', 'End'].includes(event.key)) return;
    event.preventDefault();
    let index = cards.indexOf(card);
    index = event.key === 'Home' ? 0 : event.key === 'End' ? cards.length - 1 : (index + (event.key === 'ArrowRight' ? 1 : -1) + cards.length) % cards.length;
    cards[index].querySelector('button').focus({preventScroll:true});

  });
});
selectCard(cards.at(-1));
mobileLayout.addEventListener('change', () => {
  selectCard(selectedCard);
});

const reducedMotion = matchMedia('(prefers-reduced-motion: reduce)');

// Align thin rules to physical pixels, including after fonts load or zoom changes.
const headingRules = [...document.querySelectorAll('.heading-line')];
function alignHeadingRules() {
  const ratio = window.devicePixelRatio || 1;
  for (const line of headingRules) {
    line.style.transform = 'none';
    const y = line.getBoundingClientRect().top + window.scrollY;
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

const easeInOutCubic = progress => progress < .5 ? 4 * progress ** 3 : 1 - (-2 * progress + 2) ** 3 / 2;

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
document.querySelectorAll('nav a[href^="#"]').forEach(link => {
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
    const duration = 750;
    const began = performance.now();
    const step = now => {
      const progress = Math.min(1, (now - began) / duration);
      const eased = easeInOutCubic(progress);
      window.scrollTo({ top: start + (end - start) * eased, behavior: 'instant' });
      if (progress < 1) navigationFrame = requestAnimationFrame(step);
      else finish();
    };
    navigationFrame = requestAnimationFrame(step);
  });
});

// Homepage-only mouse experiment; touch and keyboard retain normal navigation.
const hero = document.querySelector('#accueil');
const cursorPointer = matchMedia('(hover:hover) and (pointer:fine)');
const heroCursor = document.createElement('span');
heroCursor.className = 'hero-cursor';
heroCursor.setAttribute('aria-hidden', 'true');
heroCursor.innerHTML = '<span class="cursor-shape"></span>';
document.body.append(heroCursor);
let cursorX = -1, cursorY = -1, cursorAngle = 0, cursorTarget = 0, cursorFrame;
let cursorVisible = false, cursorDown = false, mousePresent = false;
function rotateHeroCursor(target) {
  if (cursorTarget === target) return;
  cursorTarget = target;
  cancelAnimationFrame(cursorFrame);
  const from = cursorAngle;
  const began = performance.now();
  function step(now) {
    const progress = reducedMotion.matches ? 1 : Math.min(1, (now - began) / 180);
    cursorAngle = from + (target - from) * easeInOutCubic(progress);
    heroCursor.firstElementChild.style.transform = `rotate(${cursorAngle}deg)`;
    if (progress < 1) cursorFrame = requestAnimationFrame(step);
  }
  cursorFrame = requestAnimationFrame(step);
}
function updateHeroCursor() {
  const rect = hero.getBoundingClientRect();
  const underPointer = document.elementFromPoint(cursorX, cursorY);
  cursorVisible = mousePresent && cursorPointer.matches && !!underPointer;
  cursorDown = cursorVisible && rect.top >= 60 && cursorX >= rect.left && cursorX <= rect.right &&
    cursorY >= rect.top + rect.height * .75 && cursorY <= window.innerHeight &&
    !underPointer.closest('a,button,input,textarea,select,[contenteditable]');
  heroCursor.hidden = !cursorVisible;
  document.documentElement.classList.toggle('has-custom-cursor', cursorVisible);
  heroCursor.style.transform = `translate3d(${cursorX}px,${cursorY}px,0)`;
  rotateHeroCursor(cursorDown ? -90 : 0);
}
heroCursor.hidden = true;
document.addEventListener('pointermove', event => {
  mousePresent = event.pointerType === 'mouse';
  cursorX = event.clientX; cursorY = event.clientY;
  updateHeroCursor();
});
function hideHeroCursor() { mousePresent = false; updateHeroCursor(); }
document.documentElement.addEventListener('pointerleave', hideHeroCursor);
window.addEventListener('blur', hideHeroCursor);
window.addEventListener('scroll', updateHeroCursor, {passive:true});
window.addEventListener('resize', updateHeroCursor);
cursorPointer.addEventListener('change', updateHeroCursor);
document.addEventListener('click', event => {
  if (event.button !== 0 || event.ctrlKey || event.metaKey || event.shiftKey || event.altKey ||
      !cursorDown || cursorAngle > -89 || event.target.closest('a,button')) return;
  event.preventDefault();
  document.querySelector('nav a[href="#histoire"]').click();
});
