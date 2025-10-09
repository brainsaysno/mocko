import { MOCKO_DB_NAME } from './lib/db';
import { triggerAutofillAnimation, findFirstVisibleInput } from './lib/autofill-animation';
import './autofill.css';

const isTargetDomain =
  window.location.hostname === 'mocko.nrusso.dev' ||
  window.location.hostname === 'local.mocko.nrusso.dev';

if (isTargetDomain) {
  const syncDataToExtension = (data: unknown[]): void => {
    chrome.runtime.sendMessage(
      {
        type: 'SYNC_INDEXEDDB',
        data: data,
      },
      (response) => {
        if (chrome.runtime.lastError) {
          console.error('Error sending message:', chrome.runtime.lastError);
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
      syncDataToExtension(event.data.data);
    }
  });
} else {
  const fillInput = (element: HTMLInputElement | HTMLTextAreaElement, value: string): void => {
    element.click();
    element.focus();

    if (element instanceof HTMLInputElement) {
      const nativeInputValueSetter = Object.getOwnPropertyDescriptor(
        window.HTMLInputElement.prototype,
        'value'
      )?.set;

      if (nativeInputValueSetter) {
        nativeInputValueSetter.call(element, value);
      } else {
        element.value = value;
      }
    } else {
      const nativeTextAreaValueSetter = Object.getOwnPropertyDescriptor(
        window.HTMLTextAreaElement.prototype,
        'value'
      )?.set;

      if (nativeTextAreaValueSetter) {
        nativeTextAreaValueSetter.call(element, value);
      } else {
        element.value = value;
      }
    }

    element.dispatchEvent(new InputEvent('input', { bubbles: true, cancelable: true }));
    element.dispatchEvent(new Event('change', { bubbles: true }));
    element.dispatchEvent(new KeyboardEvent('keydown', { bubbles: true }));
    element.dispatchEvent(new KeyboardEvent('keyup', { bubbles: true }));

    element.blur();
    element.focus();

    triggerAutofillAnimation(element);
  };

  const findInputByIdOrName = (key: string): HTMLInputElement | HTMLTextAreaElement | null => {
    const inputs = document.querySelectorAll<HTMLInputElement>(
      'input:not([disabled]):not([readonly])'
    );

    for (const input of inputs) {
      if (input.id === key || input.name === key) {
        return input;
      }
    }

    const textareas = document.querySelectorAll<HTMLTextAreaElement>(
      'textarea:not([disabled]):not([readonly])'
    );

    for (const textarea of textareas) {
      if (textarea.id === key || textarea.name === key) {
        return textarea;
      }
    }

    return null;
  };

  const isJsonObject = (value: string): boolean => {
    try {
      const parsed = JSON.parse(value);
      return typeof parsed === 'object' && parsed !== null && !Array.isArray(parsed);
    } catch {
      return false;
    }
  };

  chrome.runtime.onMessage.addListener((message, _sender, sendResponse) => {
    if (message.type === 'AUTOFILL_FIELD') {
      const { value } = message;

      if (isJsonObject(value)) {
        const jsonData = JSON.parse(value);
        const keys = Object.keys(jsonData);
        let foundAnyMatch = false;

        for (const key of keys) {
          const input = findInputByIdOrName(key);
          if (input) {
            foundAnyMatch = true;
            const fieldValue = String(jsonData[key]);
            fillInput(input, fieldValue);
          }
        }

        if (foundAnyMatch) {
          sendResponse({ success: true });
          return true;
        }
      }

      const input = findFirstVisibleInput();

      if (input) {
        fillInput(input, value);
        sendResponse({ success: true });
      } else {
        sendResponse({ success: false, error: 'No visible input found' });
      }
    }
    return true;
  });
}
