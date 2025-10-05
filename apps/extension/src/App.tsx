import { useState, useEffect } from 'react';
import { db, DatabaseMocko } from './lib/db';

export default function App() {
  const [mockos, setMockos] = useState<DatabaseMocko[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadMockos = async (): Promise<void> => {
      try {
        const data = await db.mockos.toArray();
        data.reverse();
        setMockos(data);
      } catch (error) {
        console.error('Error loading mockos:', error);
      } finally {
        setLoading(false);
      }
    };

    loadMockos();
  }, []);

  const fillFirstInput = async (content: string): Promise<void> => {
    const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });

    if (tab.id) {
      await chrome.scripting.executeScript({
        target: { tabId: tab.id },
        func: (contentToFill: string) => {
          const input = document.querySelector('input');
          if (input) {
            input.value = contentToFill;
            input.dispatchEvent(new Event('input', { bubbles: true }));
            input.dispatchEvent(new Event('change', { bubbles: true }));
          }
        },
        args: [content],
      });
    }
  };

  const openMockoWebsite = (): void => {
    chrome.tabs.create({ url: 'https://mocko.nrusso.dev' });
  };

  return (
    <div style={{ padding: '20px', fontFamily: 'sans-serif' }}>
      <h1 style={{ fontSize: '18px', marginBottom: '16px' }}>Mocko Extension</h1>
      {loading ? (
        <p>Loading...</p>
      ) : mockos.length === 0 ? (
        <div style={{ textAlign: 'center' }}>
          <p style={{ marginBottom: '16px' }}>No mockos found</p>
          <button
            onClick={openMockoWebsite}
            style={{
              padding: '10px 20px',
              backgroundColor: '#007bff',
              color: 'white',
              border: 'none',
              borderRadius: '4px',
              cursor: 'pointer',
              fontSize: '14px',
              marginBottom: '8px',
            }}
          >
            Open Mocko Website
          </button>
          <p style={{ fontSize: '12px', color: '#666', margin: '8px 0 0 0' }}>
            If your mockos are not coming through, reload the page
          </p>
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', maxHeight: '500px', overflow: 'auto' }}>
          {mockos.map((mocko) => (
            <div
              key={mocko.id}
              style={{
                border: '1px solid #ddd',
                borderRadius: '8px',
                padding: '12px',
                backgroundColor: '#f9f9f9',
              }}
            >
              <h3 style={{ margin: '0 0 8px 0', fontSize: '14px', fontWeight: 'bold' }}>
                {mocko.name}
              </h3>
              <p style={{ margin: '0 0 8px 0', fontSize: '12px', color: '#666' }}>
                Type: {mocko.type}
              </p>
              <p style={{ margin: '0 0 12px 0', fontSize: '12px', color: '#333' }}>
                {mocko.content}
              </p>
              <button
                onClick={() => fillFirstInput(mocko.content)}
                style={{
                  padding: '6px 12px',
                  backgroundColor: '#007bff',
                  color: 'white',
                  border: 'none',
                  borderRadius: '4px',
                  cursor: 'pointer',
                  fontSize: '12px',
                }}
              >
                Fill Input
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
