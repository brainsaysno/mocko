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

  const delay = (ms: number): Promise<void> => {
    return new Promise(resolve => setTimeout(resolve, ms));
  };

  const inferInputType = (input: HTMLInputElement | HTMLTextAreaElement): string => {
    if (input instanceof HTMLInputElement) {
      const inputType = input.type.toLowerCase();

      if (inputType === 'number' || inputType === 'range') {
        return 'number';
      }
      if (inputType === 'email') {
        return 'email';
      }
      if (inputType === 'tel') {
        return 'phone';
      }
      if (inputType === 'date' || inputType === 'datetime-local') {
        return 'date';
      }
      if (inputType === 'checkbox') {
        return 'boolean';
      }
    }

    return 'string';
  };

  const detectFormStructure = (): Record<string, string> | null => {
    const form = document.querySelector('form');
    if (!form) {
      return null;
    }

    const structure: Record<string, string> = {};
    const inputs = form.querySelectorAll<HTMLInputElement | HTMLTextAreaElement>(
      'input:not([disabled]):not([readonly]):not([type="hidden"]):not([type="submit"]):not([type="button"]), textarea:not([disabled]):not([readonly])'
    );

    inputs.forEach((input) => {
      const key = input.id || input.name;
      if (key) {
        structure[key] = inferInputType(input);
      }
    });

    return Object.keys(structure).length > 0 ? structure : null;
  };

  chrome.runtime.onMessage.addListener((message, _sender, sendResponse) => {
    if (message.type === 'DETECT_FORM') {
      const structure = detectFormStructure();
      sendResponse({ hasForm: structure !== null, structure });
      return true;
    }

    if (message.type === 'AUTOFILL_FIELD') {
      const { value } = message;

      if (isJsonObject(value)) {
        const jsonData = JSON.parse(value);
        const keys = Object.keys(jsonData);

        const matchedElements: Array<{
          element: HTMLInputElement | HTMLTextAreaElement;
          value: string;
        }> = [];

        for (const key of keys) {
          const element = findInputByIdOrName(key);
          if (element) {
            matchedElements.push({
              element,
              value: String(jsonData[key])
            });
          }
        }

        if (matchedElements.length > 0) {
          const allElements = [
            ...document.querySelectorAll<HTMLInputElement | HTMLTextAreaElement>(
              'input:not([disabled]):not([readonly]), textarea:not([disabled]):not([readonly])'
            )
          ];

          matchedElements.sort((a, b) => {
            return allElements.indexOf(a.element) - allElements.indexOf(b.element);
          });

          (async () => {
            for (let i = 0; i < matchedElements.length; i++) {
              if (i > 0) {
                await delay(50);
              }
              const { element, value } = matchedElements[i];
              fillInput(element, value);
            }
            sendResponse({ success: true });
          })();

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
