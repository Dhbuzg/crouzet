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

// Suppress native long-press content menus while retaining taps and scrolling.
document.addEventListener('contextmenu', event => {
  if (mobileLayout.matches && !event.target.closest('input,textarea,[contenteditable=true]')) event.preventDefault();
});
