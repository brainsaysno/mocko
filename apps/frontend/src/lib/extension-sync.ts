import { db } from './db';

export async function notifyExtensionOfChange(): Promise<void> {
  try {
    const allMockos = await db.mockos.toArray();

    window.postMessage(
      {
        type: 'MOCKO_DATA_CHANGED',
        source: 'mocko-web-app',
        data: allMockos,
      },
      window.location.origin
    );

    console.log('Notified extension of data change');
  } catch (error) {
    console.error('Error syncing to extension:', error);
  }
}
