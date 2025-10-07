import { useState, useEffect } from 'react';
import { db, DatabaseMocko } from './lib/db';
import {
  MockoCard,
  MockoType,
  ExportStatus,
  Button,
  ExportButtons,
  CopyIcon,
  FillInputIcon,
  type ActionButtonConfig,
} from '@mocko/ui';
import { X } from 'lucide-react';
import {
  MockoFactory,
  hasRuntimeVariables,
  getRuntimeVariables,
} from '@mocko/core';
import { API_BASE_URL, WEB_BASE_URL } from './lib/api';

export default function App() {
  const [mockos, setMockos] = useState<DatabaseMocko[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeActionIndex, setActiveActionIndex] = useState<number | null>(
    null
  );
  const [fillStatus, setFillStatus] = useState<ExportStatus>(
    ExportStatus.Inactive
  );
  const [copyStatus, setCopyStatus] = useState<ExportStatus>(
    ExportStatus.Inactive
  );
  const [showVariablesModal, setShowVariablesModal] = useState(false);
  const [currentMocko, setCurrentMocko] = useState<DatabaseMocko | null>(null);
  const [variableValues, setVariableValues] = useState<Record<string, string>>(
    {}
  );
  const [actionType, setActionType] = useState<'fill' | 'copy'>('fill');

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

    const messageListener = (message: { type: string }) => {
      if (message.type === 'MOCKOS_UPDATED') {
        console.log('Received MOCKOS_UPDATED message, reloading...');
        loadMockos();
      }
    };

    chrome.runtime.onMessage.addListener(messageListener);

    return () => {
      chrome.runtime.onMessage.removeListener(messageListener);
    };
  }, []);

  const handleMockoClick = (
    dbMocko: DatabaseMocko,
    index: number,
    action: 'fill' | 'copy'
  ): void => {
    const variables = getRuntimeVariables(dbMocko.content);

    if (variables.length > 0) {
      setCurrentMocko(dbMocko);
      setActiveActionIndex(index);
      setVariableValues({});
      setActionType(action);
      setShowVariablesModal(true);
    } else {
      if (action === 'fill') {
        generateAndFillInput(dbMocko, index);
      } else {
        generateAndCopy(dbMocko, index);
      }
    }
  };

  const handleVariablesSubmit = (e: React.FormEvent): void => {
    e.preventDefault();
    if (currentMocko) {
      const index = mockos.findIndex((m) => m.id === currentMocko.id);
      if (actionType === 'fill') {
        generateAndFillInput(currentMocko, index, variableValues);
      } else {
        generateAndCopy(currentMocko, index, variableValues);
      }
      setShowVariablesModal(false);
      setCurrentMocko(null);
      setVariableValues({});
    }
  };

  const generateAndFillInput = async (
    dbMocko: DatabaseMocko,
    index: number,
    runtimeValues?: Record<string, string>
  ): Promise<void> => {
    setActiveActionIndex(index);
    setFillStatus(ExportStatus.Loading);

    try {
      const factory = new MockoFactory({ apiBaseUrl: API_BASE_URL });
      const mocko = factory.fromDatabaseMocko(dbMocko);

      const options = runtimeValues
        ? { runtimeValues: new Map(Object.entries(runtimeValues)) }
        : undefined;

      const content = await mocko.generateOne(options);

      const [tab] = await chrome.tabs.query({
        active: true,
        currentWindow: true,
      });

      if (tab.id) {
        console.log('[Mocko Extension] Sending AUTOFILL_FIELD message with content:', content);

        chrome.tabs.sendMessage(
          tab.id,
          {
            type: 'AUTOFILL_FIELD',
            value: content,
          },
          (response) => {
            if (chrome.runtime.lastError) {
              console.error('[Mocko Extension] Error sending message:', chrome.runtime.lastError);
              setFillStatus(ExportStatus.Error);
            } else if (response?.success) {
              console.log('[Mocko Extension] Autofill successful');
              setFillStatus(ExportStatus.Success);
            } else {
              console.error('[Mocko Extension] Autofill failed:', response?.error);
              setFillStatus(ExportStatus.Error);
            }
          }
        );
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

  const generateAndCopy = async (
    dbMocko: DatabaseMocko,
    index: number,
    runtimeValues?: Record<string, string>
  ): Promise<void> => {
    setActiveActionIndex(index);
    setCopyStatus(ExportStatus.Loading);

    try {
      const factory = new MockoFactory({ apiBaseUrl: API_BASE_URL });
      const mocko = factory.fromDatabaseMocko(dbMocko);

      const options = runtimeValues
        ? { runtimeValues: new Map(Object.entries(runtimeValues)) }
        : undefined;

      const content = await mocko.generateOne(options);

      await navigator.clipboard.writeText(content);
      setCopyStatus(ExportStatus.Success);
    } catch (error) {
      console.error('Error generating mocko:', error);
      setCopyStatus(ExportStatus.Error);
    } finally {
      setTimeout(() => {
        setCopyStatus(ExportStatus.Inactive);
        setActiveActionIndex(null);
      }, 1000);
    }
  };

  const openMockoWebsite = (): void => {
    chrome.tabs.create({ url: WEB_BASE_URL });
  };

  const handleEditMocko = (mocko: DatabaseMocko): void => {
    const editUrl = `${WEB_BASE_URL}/mockos/new?edit=${encodeURIComponent(
      JSON.stringify(mocko)
    )}`;
    chrome.tabs.create({ url: editUrl });
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
        <div className="flex flex-col items-center gap-3 overflow-auto scrollbar-hide">
          {mockos.map((mocko, index) => (
            <MockoCard
              key={mocko.id}
              name={mocko.name}
              type={mocko.type}
              hasRuntimeVariables={hasRuntimeVariables(mocko.content)}
              onEdit={() => handleEditMocko(mocko)}
            >
              <ExportButtons
                buttons={[
                  {
                    onClick: () => handleMockoClick(mocko, index, 'copy'),
                    status:
                      activeActionIndex === index
                        ? copyStatus
                        : ExportStatus.Inactive,
                    label: 'Copy to clipboard',
                    icon: <CopyIcon />,
                  },
                  {
                    onClick: () => handleMockoClick(mocko, index, 'fill'),
                    status:
                      activeActionIndex === index
                        ? fillStatus
                        : ExportStatus.Inactive,
                    label: 'Fill first input',
                    icon: <FillInputIcon />,
                  },
                ]}
                disabled={
                  activeActionIndex === index &&
                  (fillStatus === ExportStatus.Loading ||
                    copyStatus === ExportStatus.Loading)
                }
              />
            </MockoCard>
          ))}
        </div>
      )}

      {showVariablesModal && currentMocko && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-80 max-w-full mx-4">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-lg font-semibold">
                Variables for {currentMocko.name}
              </h2>
              <button
                onClick={() => {
                  setShowVariablesModal(false);
                  setCurrentMocko(null);
                  setVariableValues({});
                  setActiveActionIndex(null);
                }}
                className="text-gray-500 hover:text-gray-700"
              >
                <X size={20} />
              </button>
            </div>
            <form onSubmit={handleVariablesSubmit} className="space-y-4">
              {getRuntimeVariables(currentMocko.content).map((variable) => (
                <div key={variable}>
                  <label
                    htmlFor={variable}
                    className="block text-sm font-medium mb-1"
                  >
                    {variable}
                  </label>
                  <input
                    id={variable}
                    type="text"
                    value={variableValues[variable] || ''}
                    onChange={(e) =>
                      setVariableValues({
                        ...variableValues,
                        [variable]: e.target.value,
                      })
                    }
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    required
                  />
                </div>
              ))}
              <Button type="submit" className="w-full">
                Generate
              </Button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
