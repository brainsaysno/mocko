import { useState, useEffect } from 'react';
import { db } from './lib/db';

export default function App() {
  const [mockos, setMockos] = useState<unknown[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadMockos = async (): Promise<void> => {
      try {
        const data = await db.mockos.toArray();
        setMockos(data);
      } catch (error) {
        console.error('Error loading mockos:', error);
      } finally {
        setLoading(false);
      }
    };

    loadMockos();
  }, []);

  return (
    <div style={{ padding: '20px', fontFamily: 'monospace' }}>
      <h1>Mocko Extension</h1>
      {loading ? (
        <p>Loading...</p>
      ) : (
        <pre style={{ fontSize: '12px', overflow: 'auto', maxHeight: '400px' }}>
          {JSON.stringify(mockos, null, 2)}
        </pre>
      )}
    </div>
  );
}
