import { useState, useEffect } from 'react';
import { db, DatabaseMocko } from './lib/db';
import {
  MockoCard,
  ExportButtons,
  MockoType,
  ExportStatus,
  Button,
} from '@mocko/ui';
import { Copy } from 'lucide-react';

export default function App() {
  const [mockos, setMockos] = useState<DatabaseMocko[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeActionIndex, setActiveActionIndex] = useState<number | null>(
    null
  );
  const [actionStatus, setActionStatus] = useState<ExportStatus>(
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

  const fillFirstInput = async (
    content: string,
    index: number
  ): Promise<void> => {
    setActiveActionIndex(index);
    setActionStatus(ExportStatus.Loading);

    try {
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
        setActionStatus(ExportStatus.Success);
      }
    } catch (error) {
      setActionStatus(ExportStatus.Error);
    } finally {
      setTimeout(() => {
        setActionStatus(ExportStatus.Inactive);
        setActiveActionIndex(null);
      }, 1000);
    }
  };

  const copyContent = async (content: string, index: number): Promise<void> => {
    setActiveActionIndex(index);
    setActionStatus(ExportStatus.Loading);

    try {
      await navigator.clipboard.writeText(content);
      setActionStatus(ExportStatus.Success);
    } catch (error) {
      setActionStatus(ExportStatus.Error);
    } finally {
      setTimeout(() => {
        setActionStatus(ExportStatus.Inactive);
        setActiveActionIndex(null);
      }, 1000);
    }
  };

  const openMockoWebsite = (): void => {
    chrome.tabs.create({ url: 'https://mocko.nrusso.dev' });
  };

  const mapTypeToMockoType = (type: string): MockoType => {
    switch (type) {
      case 'ai_json':
        return MockoType.AIJson;
      case 'ai_prose':
        return MockoType.AIProse;
      case 'deterministic':
        return MockoType.Deterministic;
      case 'fixed':
        return MockoType.Fixed;
      default:
        return MockoType.Fixed;
    }
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
        <div className="flex flex-col gap-3 max-h-[500px] overflow-auto">
          {mockos.map((mocko, index) => (
            <MockoCard
              key={mocko.id}
              name={mocko.name}
              type={mapTypeToMockoType(mocko.type)}
            >
              <ExportButtons
                onGenerate={() => fillFirstInput(mocko.content, index)}
                onCopy={() => copyContent(mocko.content, index)}
                generateStatus={
                  activeActionIndex === index
                    ? actionStatus
                    : ExportStatus.Inactive
                }
                copyStatus={ExportStatus.Inactive}
                emailStatus={ExportStatus.Inactive}
              />
            </MockoCard>
          ))}
        </div>
      )}
    </div>
  );
}
