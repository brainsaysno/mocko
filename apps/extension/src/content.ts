import { MOCKO_DB_NAME } from './lib/db';

const isTargetDomain =
  window.location.hostname === 'mocko.nrusso.dev' ||
  window.location.hostname === 'local.mocko.nrusso.dev';

console.log('isTargetDomain', isTargetDomain);
console.log(window.location.hostname, window.location.port);

if (isTargetDomain) {
  console.log('Mocko content script loaded on target domain');

  const syncDataToExtension = (data: unknown[]): void => {
    console.log('Syncing data to extension:', data);

    chrome.runtime.sendMessage(
      {
        type: 'SYNC_INDEXEDDB',
        data: data,
      },
      (response) => {
        if (chrome.runtime.lastError) {
          console.error('Error sending message:', chrome.runtime.lastError);
        } else {
          console.log('Data sync response:', response);
        }
      }
    );
  };

  const exportIndexedDBData = async (): Promise<void> => {
    try {
      const dbRequest = indexedDB.open(MOCKO_DB_NAME);

      dbRequest.onsuccess = (event) => {
        const db = (event.target as IDBOpenDBRequest).result;
        const transaction = db.transaction(['mockos'], 'readonly');
        const objectStore = transaction.objectStore('mockos');
        const getAllRequest = objectStore.getAll();

        getAllRequest.onsuccess = () => {
          const data = getAllRequest.result;
          console.log('Initial data export from web app:', data);
          syncDataToExtension(data);
        };

        getAllRequest.onerror = () => {
          console.error('Error reading IndexedDB:', getAllRequest.error);
        };
      };

      dbRequest.onerror = () => {
        console.error('Error opening IndexedDB:', dbRequest.error);
      };
    } catch (error) {
      console.error('Error exporting IndexedDB data:', error);
    }
  };

  exportIndexedDBData();

  window.addEventListener('message', (event) => {
    if (
      event.source === window &&
      event.data?.type === 'MOCKO_DATA_CHANGED' &&
      event.data?.source === 'mocko-web-app'
    ) {
      console.log('Received data change notification from web app');
      syncDataToExtension(event.data.data);
    }
  });
} else {
  console.log('Mocko content script loaded on non-target domain');

  chrome.runtime.onMessage.addListener((message, _sender, sendResponse) => {
    if (message.type === 'AUTOFILL_FIELD') {
      console.log('[Mocko Autofill] Received AUTOFILL_FIELD message:', message);

      const { value } = message;
      const input = document.querySelector('input:not([disabled]):not([readonly])') as HTMLInputElement;

      console.log('[Mocko Autofill] Found input:', input);
      console.log('[Mocko Autofill] Input details:', {
        tagName: input?.tagName,
        type: input?.type,
        id: input?.id,
        className: input?.className,
        placeholder: input?.placeholder,
        currentValue: input?.value,
        isVisible: input ? window.getComputedStyle(input).display !== 'none' : false,
        isInViewport: input ? input.getBoundingClientRect().height > 0 : false
      });

      if (input) {
        console.log('[Mocko Autofill] Attempting to autofill with value:', value);

        input.click();
        input.focus();
        console.log('[Mocko Autofill] Clicked and focused input');

        // Use the native setter to ensure frameworks detect the change
        const nativeInputValueSetter = Object.getOwnPropertyDescriptor(
          window.HTMLInputElement.prototype,
          'value'
        )?.set;

        if (nativeInputValueSetter) {
          console.log('[Mocko Autofill] Using native setter');
          nativeInputValueSetter.call(input, value);
        } else {
          console.log('[Mocko Autofill] Using direct value assignment');
          input.value = value;
        }

        console.log('[Mocko Autofill] Value after setting:', input.value);

        // Dispatch events that Material UI and similar frameworks listen for
        input.dispatchEvent(new InputEvent('input', { bubbles: true, cancelable: true }));
        input.dispatchEvent(new Event('change', { bubbles: true }));
        input.dispatchEvent(new KeyboardEvent('keydown', { bubbles: true }));
        input.dispatchEvent(new KeyboardEvent('keyup', { bubbles: true }));
        console.log('[Mocko Autofill] Dispatched all events');

        // Blur and refocus to trigger validation
        input.blur();
        input.focus();
        console.log('[Mocko Autofill] Blurred and refocused');

        console.log('[Mocko Autofill] Final value:', input.value);
        console.log('[Mocko Autofill] Final visual check:', {
          display: window.getComputedStyle(input).display,
          visibility: window.getComputedStyle(input).visibility,
          parentClasses: input.parentElement?.className
        });

        sendResponse({ success: true });
      } else {
        console.error('[Mocko Autofill] No input found');
        sendResponse({ success: false, error: 'No input found' });
      }
    }
    return true;
  });
}
