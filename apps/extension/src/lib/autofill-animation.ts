const ANIMATABLE_INPUT_TYPES = new Set([
  'email',
  'text',
  'password',
  'number',
  'tel',
  'url',
]);

const ANIMATION_CLASS = 'com-mocko-browser-animated-fill';
const ANIMATION_DURATION = 200;

function isElementHidden(element: HTMLElement): boolean {
  const style = window.getComputedStyle(element);

  if (
    style.display === 'none' ||
    style.visibility === 'hidden' ||
    style.opacity === '0'
  ) {
    return true;
  }

  let parent = element.parentElement;
  while (parent) {
    const parentStyle = window.getComputedStyle(parent);
    if (parentStyle.opacity === '0') {
      return true;
    }
    parent = parent.parentElement;
  }

  return false;
}

export function triggerAutofillAnimation(element: HTMLElement): void {
  if (element instanceof HTMLInputElement) {
    if (!ANIMATABLE_INPUT_TYPES.has(element.type)) {
      return;
    }
  }

  if (isElementHidden(element)) {
    return;
  }

  element.classList.add(ANIMATION_CLASS);

  setTimeout(() => {
    element.classList.remove(ANIMATION_CLASS);
  }, ANIMATION_DURATION);
}

export function findFirstVisibleInput(): HTMLInputElement | HTMLTextAreaElement | null {
  const inputs = document.querySelectorAll<HTMLInputElement>(
    'input:not([disabled]):not([readonly])'
  );

  for (const input of inputs) {
    if (!isElementHidden(input)) {
      return input;
    }
  }

  const textareas = document.querySelectorAll<HTMLTextAreaElement>(
    'textarea:not([disabled]):not([readonly])'
  );

  for (const textarea of textareas) {
    if (!isElementHidden(textarea)) {
      return textarea;
    }
  }

  return null;
}
