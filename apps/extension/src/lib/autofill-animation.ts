const ANIMATABLE_INPUT_TYPES = new Set([
  'email',
  'text',
  'password',
  'number',
  'tel',
  'url',
]);

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

  element.classList.add('mocko-animated-fill');

  setTimeout(() => {
    element.classList.remove('mocko-animated-fill');
  }, 200);
}
