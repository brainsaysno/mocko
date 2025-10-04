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
}
