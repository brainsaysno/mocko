import { db, dbMockoSchema } from './lib/db';

console.log('BACKGROUND SCRIPT LOADED SUCCESSFULLY');

async function syncData(data: unknown[]): Promise<{ success: boolean; count?: number; error?: string }> {
  try {
    await db.mockos.clear();
    console.log('Cleared existing data from extension IndexedDB');

    const validatedData = data.map((item: unknown) => dbMockoSchema.parse(item));

    await db.mockos.bulkAdd(validatedData);
    console.log('Successfully synced data to extension IndexedDB');

    const allData = await db.mockos.toArray();
    console.log('Current data in extension IndexedDB:', allData);

    chrome.runtime.sendMessage({ type: 'MOCKOS_UPDATED' }).catch(() => {
      console.log('No popup open to notify');
    });

    return { success: true, count: validatedData.length };
  } catch (error) {
    console.error('Error syncing data:', error);
    return { success: false, error: String(error) };
  }
}

chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message.type === 'SYNC_INDEXEDDB') {
    console.log('Received sync request with data:', message.data);
    syncData(message.data).then(sendResponse);
    return true;
  }
});
