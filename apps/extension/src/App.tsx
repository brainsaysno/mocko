import { useState, useEffect } from 'react';
import { db, DatabaseMocko } from './lib/db';
import { MockoCard, MockoType, ExportStatus, Button } from '@mocko/ui';
import { TextCursorInput } from 'lucide-react';
import { MockoFactory, hasRuntimeVariables } from '@mocko/core';
import { API_BASE_URL } from './lib/api';

export default function App() {
  const [mockos, setMockos] = useState<DatabaseMocko[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeActionIndex, setActiveActionIndex] = useState<number | null>(
    null
  );
  const [fillStatus, setFillStatus] = useState<ExportStatus>(
    ExportStatus.Inactive
  );

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

  const generateAndFillInput = async (
    dbMocko: DatabaseMocko,
    index: number
  ): Promise<void> => {
    setActiveActionIndex(index);
    setFillStatus(ExportStatus.Loading);

    try {
      const factory = new MockoFactory({ apiBaseUrl: API_BASE_URL });
      const mocko = factory.fromDatabaseMocko(dbMocko);
      const content = await mocko.generateOne();

      const [tab] = await chrome.tabs.query({
        active: true,
        currentWindow: true,
      });

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
        setFillStatus(ExportStatus.Success);
      }
    } catch (error) {
      console.error('Error generating mocko:', error);
      setFillStatus(ExportStatus.Error);
    } finally {
      setTimeout(() => {
        setFillStatus(ExportStatus.Inactive);
        setActiveActionIndex(null);
      }, 1000);
    }
  };

  const openMockoWebsite = (): void => {
    chrome.tabs.create({ url: 'https://mocko.nrusso.dev' });
  };

  return (
    <div className="p-5 font-sans bg-pattern h-full">
      <h1 className="text-lg font-semibold mb-4">Mocko Extension</h1>
      {loading ? (
        <p>Loading...</p>
      ) : mockos.length === 0 ? (
        <div className="text-center">
          <p className="mb-4">No mockos found</p>
          <Button onClick={openMockoWebsite} className="mb-2">
            Open Mocko Website
          </Button>
          <p className="text-xs text-muted-foreground mt-2">
            If your mockos are not coming through, reload the page
          </p>
        </div>
      ) : (
        <div className="flex flex-col gap-3 overflow-auto">
          {mockos.map((mocko, index) => (
            <MockoCard
              key={mocko.id}
              name={mocko.name}
              type={mocko.type}
              hasRuntimeVariables={hasRuntimeVariables(mocko.content)}
            >
              <div className="h-1/3 flex justify-center items-center bg-white">
                <button
                  onClick={() => generateAndFillInput(mocko, index)}
                  disabled={
                    activeActionIndex === index &&
                    fillStatus === ExportStatus.Loading
                  }
                  className="w-8 h-8 bg-slate-200 rounded-sm flex justify-center items-center border border-black cursor-pointer hover:bg-slate-300 disabled:cursor-wait"
                  aria-label="Fill first input"
                >
                  {activeActionIndex === index &&
                    fillStatus === ExportStatus.Loading && (
                      <div className="animate-spin">~</div>
                    )}
                  {activeActionIndex === index &&
                    fillStatus === ExportStatus.Success && (
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                        strokeWidth={3}
                        className="size-5 stroke-green-600"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          d="m4.5 12.75 6 6 9-13.5"
                        />
                      </svg>
                    )}
                  {activeActionIndex === index &&
                    fillStatus === ExportStatus.Error && (
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                        strokeWidth={1.5}
                        stroke="currentColor"
                        className="size-5 stroke-red-600"
                      >
                        <circle cx="12" cy="12" r="10" strokeWidth={2} />
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M15 9l-6 6m0-6l6 6"
                        />
                      </svg>
                    )}
                  {(activeActionIndex !== index ||
                    fillStatus === ExportStatus.Inactive) && (
                    <TextCursorInput size={20} />
                  )}
                </button>
              </div>
            </MockoCard>
          ))}
        </div>
      )}
    </div>
  );
}
