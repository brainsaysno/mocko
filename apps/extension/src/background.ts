import { db, dbMockoSchema } from './lib/db';

async function syncData(data: unknown[]): Promise<{ success: boolean; count?: number; error?: string }> {
  try {
    await db.mockos.clear();

    const validatedData = data.map((item: unknown) => dbMockoSchema.parse(item));

    await db.mockos.bulkAdd(validatedData);

    chrome.runtime.sendMessage({ type: 'MOCKOS_UPDATED' }).catch(() => {});

    return { success: true, count: validatedData.length };
  } catch (error) {
    console.error('Error syncing data:', error);
    return { success: false, error: String(error) };
  }
}

chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message.type === 'SYNC_INDEXEDDB') {
    syncData(message.data).then(sendResponse);
    return true;
  }
});
