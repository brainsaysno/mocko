export function notifyExtensionChange(): void {
  if (typeof window !== 'undefined') {
    window.dispatchEvent(new CustomEvent('mockoDataChanged'));
  }
}
