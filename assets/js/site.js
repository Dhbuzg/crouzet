const legalDialog = document.querySelector('#mentions-legales');

// Measure usable width without containment on the scrolling root.
function updateUsableViewportWidth() {
  document.documentElement.style.setProperty('--usable-viewport-width', `${document.documentElement.clientWidth}px`);
}
updateUsableViewportWidth();
window.addEventListener('resize', updateUsableViewportWidth);
window.addEventListener('pageshow', updateUsableViewportWidth);

const mobileLayout = matchMedia('(max-width: 760px)');
const reducedMotion = matchMedia('(prefers-reduced-motion: reduce)');

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

// Animated mouse cursor; touch and keyboard retain normal navigation.
const hero = document.querySelector('#accueil');
const cursorPointer = matchMedia('(hover:hover) and (pointer:fine)');
const heroCursor = document.createElement('span');
heroCursor.className = 'hero-cursor';
heroCursor.setAttribute('aria-hidden', 'true');
const cursorShape = document.createElement('img');
cursorShape.className = 'cursor-shape';
cursorShape.src = new URL('../illustrations/cursor.svg', document.currentScript.src).href;
cursorShape.alt = '';
heroCursor.append(cursorShape);
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
    cursorShape.style.transform = `rotate(${cursorAngle}deg)`;
    if (progress < 1) cursorFrame = requestAnimationFrame(step);
  }
  cursorFrame = requestAnimationFrame(step);
}
function updateHeroCursor() {
  const rect = hero.getBoundingClientRect();
  const underPointer = document.elementFromPoint(cursorX, cursorY);
  cursorVisible = mousePresent && cursorPointer.matches && !!underPointer && !legalDialog.open;
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

// Suppress native long-press content menus while retaining taps and scrolling.
document.addEventListener('contextmenu', event => {
  if (mobileLayout.matches && !event.target.closest('input,textarea,[contenteditable=true]')) event.preventDefault();
});

// The legal sheet scrolls independently; upward overscroll lowers it back to the site.
const legalScroll = legalDialog.querySelector('.legal-scroll');
const legalTrigger = document.querySelector('.footer-link');
let legalOffset = 0;
let legalAnimation;
let legalMoving = false;
let legalTouchY = null;
let legalReturnFocus;

function positionLegalSheet(offset) {
  legalOffset = Math.max(0, Math.min(window.innerHeight, offset));
  legalDialog.style.transform = `translateY(${legalOffset}px)`;
}

function animateLegalSheet(destination, duration, finish = () => {}) {
  cancelAnimationFrame(legalAnimation);
  const origin = legalOffset;
  const started = performance.now();
  legalMoving = true;
  function frame(now) {
    const progress = reducedMotion.matches ? 1 : Math.min(1, (now - started) / duration);
    positionLegalSheet(origin + (destination - origin) * easeInOutCubic(progress));
    if (progress < 1) legalAnimation = requestAnimationFrame(frame);
    else {
      legalMoving = false;
      finish();
    }
  }
  legalAnimation = requestAnimationFrame(frame);
}

function finishLegalClose() {
  cancelAnimationFrame(legalAnimation);
  legalMoving = false;
  legalTouchY = null;
  legalDialog.close();
  document.documentElement.classList.remove('legal-open');
  legalReturnFocus?.focus({ preventScroll: true });
  updateHeroCursor();
}

function closeLegalSheet() {
  animateLegalSheet(window.innerHeight, 400, finishLegalClose);
}

legalTrigger.addEventListener('click', event => {
  if (event.button !== 0 || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;
  event.preventDefault();
  if (legalDialog.open) return;
  cancelNavigation();
  legalReturnFocus = document.activeElement;
  legalDialog.style.width = `${window.innerWidth}px`;
  document.documentElement.classList.add('legal-open');
  positionLegalSheet(window.innerHeight);
  legalDialog.showModal();
  legalScroll.scrollTop = 0;
  legalScroll.focus({ preventScroll: true });
  updateHeroCursor();
  animateLegalSheet(0, 750);
});

function dragLegalSheet(distance) {
  positionLegalSheet(legalOffset + distance);
  if (legalOffset >= window.innerHeight) finishLegalClose();
}

legalDialog.addEventListener('wheel', event => {
  if (event.ctrlKey || Math.abs(event.deltaX) > Math.abs(event.deltaY)) return;
  if (legalMoving) {
    event.preventDefault();
    return;
  }
  if (legalOffset > 0 || (legalScroll.scrollTop <= 0 && event.deltaY < 0)) {
    event.preventDefault();
    const unit = event.deltaMode === 1 ? 16 : event.deltaMode === 2 ? window.innerHeight : 1;
    dragLegalSheet(-event.deltaY * unit);
  }
}, { passive: false });

legalScroll.addEventListener('touchstart', event => {
  legalTouchY = event.touches.length === 1 ? event.touches[0].clientY : null;
}, { passive: true });

legalScroll.addEventListener('touchmove', event => {
  if (!legalDialog.open || legalTouchY === null || event.touches.length !== 1) return;
  const currentY = event.touches[0].clientY;
  const distance = currentY - legalTouchY;
  legalTouchY = currentY;
  if (legalMoving || legalOffset > 0 || (legalScroll.scrollTop <= 0 && distance > 0)) {
    event.preventDefault();
    if (!legalMoving) dragLegalSheet(distance);
  }
}, { passive: false });

function releaseLegalTouch() {
  legalTouchY = null;
  if (!legalDialog.open || legalMoving || legalOffset === 0) return;
  if (legalOffset >= window.innerHeight * .25) closeLegalSheet();
  else animateLegalSheet(0, 250);
}
legalScroll.addEventListener('touchend', releaseLegalTouch);
legalScroll.addEventListener('touchcancel', releaseLegalTouch);

legalDialog.addEventListener('cancel', event => {
  event.preventDefault();
  closeLegalSheet();
});
legalDialog.querySelector('.legal-close').addEventListener('click', closeLegalSheet);
legalScroll.addEventListener('keydown', event => {
  if (event.target !== legalScroll || legalMoving) return;
  const distance = event.key === 'ArrowUp' ? 40 : event.key === 'PageUp' ? window.innerHeight * .8 : 0;
  if (distance && legalScroll.scrollTop <= 0) {
    event.preventDefault();
    dragLegalSheet(distance);
  }
});

window.addEventListener('resize', () => {
  if (!legalDialog.open) return;
  cancelAnimationFrame(legalAnimation);
  legalMoving = false;
  legalDialog.style.width = `${window.innerWidth}px`;
  positionLegalSheet(0);
});
