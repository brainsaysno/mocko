import { emailMocko } from '@/lib/api';
import { Mocko, MockoExportOptions, MockoType } from '@/model/mocko';
import { PropsWithChildren, useCallback, useRef, useState } from 'react';
import { Popover, PopoverContent } from './ui/popover';
import { Input } from './ui/input';
import { PopoverTrigger } from '@radix-ui/react-popover';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from './ui/form';
import { useForm } from 'react-hook-form';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from './ui/dialog';
import { cn } from '@/lib/utils';
import { Button } from './ui/button';

const prefixes: Record<MockoType, string> = {
  [MockoType.AIStructured]: 'AI Structured',
  [MockoType.AIProse]: 'AI Prose',
  [MockoType.Deterministic]: 'Deterministic',
  [MockoType.Fixed]: 'Fixed',
};

type MockoCardProps = {
  mocko: Mocko;
  disabled?: boolean;
  afterGenerate?: () => void;
  onGenerate?: () => void;
};

enum ExportAction {
  Generate = 'generate',
  Copy = 'copy',
  Email = 'email',
}

enum ExportStatus {
  Inactive = 'inactive',
  Loading = 'loading',
  Success = 'success',
}

export default function MockoCard({
  mocko,
  disabled = false,
  afterGenerate,
  onGenerate,
}: MockoCardProps) {
  const [exportAction, setExportAction] = useState(ExportAction.Generate);

  const recipientRef = useRef<string>();

  const [isEmailPopoverOpen, setIsEmailPopoverOpen] = useState(false);
  const [dialogContent, setDialogContent] = useState<string | null>(null);

  const [isInputingRuntimeVariables, setIsInputingRuntimeVariables] =
    useState(false);

  const [exportStatus, setExportStatus] = useState<ExportStatus>(
    ExportStatus.Inactive
  );

  const onExportClick = useCallback(
    async (action?: ExportAction) => {
      if (action) setExportAction(action);
      if (action == ExportAction.Email && !recipientRef.current) {
        return setIsEmailPopoverOpen(true);
      }

      if (mocko.runtimeVariables.length > 0)
        setIsInputingRuntimeVariables(true);
      else exportMocko(action ?? exportAction);
    },
    [mocko]
  );

  const exportActionCallbacks: Record<
    ExportAction,
    (mockData: string) => void
  > = {
    [ExportAction.Generate]: (m) => {
      setDialogContent(m);
    },
    [ExportAction.Copy]: (m) => {
      copyContent(m);
    },
    [ExportAction.Email]: (m) => {
      if (recipientRef.current) {
        emailMocko(recipientRef.current, m);
        recipientRef.current = undefined;
      }
    },
  };

  const copyContent = (content: string) => {
    navigator.clipboard.writeText(content);
  };

  const exportMocko = async (
    action: ExportAction,
    options?: MockoExportOptions
  ) => {
    onGenerate?.();
    setExportStatus(ExportStatus.Loading);
    const mockData = await mocko.generateOne(options);
    exportActionCallbacks[action](mockData);
    setExportStatus(ExportStatus.Success);
    setTimeout(() => {
      setExportStatus(ExportStatus.Inactive);
    }, 1000);
    afterGenerate?.();
  };

  const sendEmailSchema = z.object({
    recipient: z.string().email(),
  });

  type SendEmailSchema = z.infer<typeof sendEmailSchema>;

  const emailForm = useForm<SendEmailSchema>({
    resolver: zodResolver(sendEmailSchema),
  });

  const onEmailClose = useCallback(() => {
    setExportStatus(ExportStatus.Inactive);
    setIsEmailPopoverOpen(false);
  }, []);

  const onDialogClose = () => {
    setDialogContent(null);
    setIsInputingRuntimeVariables(false);
  };

  const runtimeVariablesForm = useForm<Record<string, string>>();

  const onRuntimeVariablesSubmit = async (
    runtimeValuesObject: Record<string, string>
  ) => {
    setIsInputingRuntimeVariables(false);
    const runtimeValues = new Map();
    Object.entries(runtimeValuesObject).map(([k, v]) =>
      runtimeValues.set(k, v)
    );
    exportMocko(exportAction, { runtimeValues });
  };

  return (
    <Dialog
      open={!!dialogContent || isInputingRuntimeVariables}
      onOpenChange={(o) => o || onDialogClose()}
    >
      <DialogTrigger asChild>
        <div>
          <Popover
            open={isEmailPopoverOpen}
            onOpenChange={(o) => o || onEmailClose()}
          >
            <PopoverTrigger asChild>
              <div className="w-72 h-40 rounded-md overflow-clip border-2 border-black mocko-card">
                <div className="h-2/3 bg-slate-100 flex justify-center items-center border-b-2 border-black">
                  <div>
                    <p>{prefixes[mocko.type]}</p>
                    <h4 className="text-3xl font-medium">{mocko.name}</h4>
                  </div>
                </div>
                <ExportButtons
                  onExport={onExportClick}
                  status={exportStatus}
                  activeAction={exportAction}
                  disabled={disabled}
                />
              </div>
            </PopoverTrigger>
            <PopoverContent className="box-shadow-xl w-full mx-auto">
              <Form {...emailForm}>
                <form
                  onSubmit={emailForm.handleSubmit(({ recipient }) => {
                    recipientRef.current = recipient;
                    setIsEmailPopoverOpen(false);
                    onExportClick(ExportAction.Email);
                  })}
                >
                  <FormField
                    control={emailForm.control}
                    name="recipient"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Recipient</FormLabel>
                        <FormControl>
                          <Input placeholder="example@email.com" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </form>
              </Form>
            </PopoverContent>
          </Popover>
        </div>
      </DialogTrigger>
      {isInputingRuntimeVariables ? (
        <DialogContent>
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              Variables for {mocko.name}:
            </DialogTitle>
          </DialogHeader>
          <div>
            <Form {...runtimeVariablesForm}>
              <form
                id="tour-mocko-form"
                onSubmit={runtimeVariablesForm.handleSubmit(
                  onRuntimeVariablesSubmit
                )}
                className="md:w-2/3 space-y-6 mx-auto"
              >
                {mocko.runtimeVariables.map((v) => (
                  <FormField
                    control={runtimeVariablesForm.control}
                    name={v}
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>{v}</FormLabel>
                        <FormControl>
                          <Input {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                ))}
                <Button>Generate</Button>
              </form>
            </Form>
          </div>
        </DialogContent>
      ) : (
        <DialogContent>
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <span>{mocko.name}</span>{' '}
              <span onClick={() => copyContent(dialogContent ?? '')}>
                <CopyIcon />
              </span>
            </DialogTitle>
            <DialogDescription className="whitespace-pre-wrap break-words">
              {dialogContent}
            </DialogDescription>
          </DialogHeader>
        </DialogContent>
      )}
    </Dialog>
  );
}

function ExportButtons({
  onExport,
  activeAction,
  status,
  disabled,
}: {
  onExport: (action: ExportAction) => void;
  activeAction: ExportAction;
  status: ExportStatus;
  disabled: boolean;
}) {
  return (
    <div
      className="h-1/3 flex justify-center items-center gap-4 bg-white"
      id="tour-export-buttons"
    >
      <ActionButton
        action={() => onExport(ExportAction.Generate)}
        exportStatus={
          activeAction == ExportAction.Generate ? status : ExportStatus.Inactive
        }
        disabled={disabled}
        label="Generate Mocko"
      >
        <GenerateIcon />
      </ActionButton>
      <ActionButton
        action={() => onExport(ExportAction.Copy)}
        exportStatus={
          activeAction == ExportAction.Copy ? status : ExportStatus.Inactive
        }
        disabled={disabled}
        label="Copy Mocko"
      >
        <CopyIcon />
      </ActionButton>
      <ActionButton
        action={() => onExport(ExportAction.Email)}
        exportStatus={
          activeAction == ExportAction.Email ? status : ExportStatus.Inactive
        }
        disabled={disabled}
        label="Email Mocko"
      >
        <EmailIcon />
      </ActionButton>
    </div>
  );
}

function GenerateIcon() {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      viewBox="0 0 24 24"
      strokeWidth={1.5}
      stroke="currentColor"
      className="size-5"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="m7.49 12-3.75 3.75m0 0 3.75 3.75m-3.75-3.75h16.5V4.499"
      />
    </svg>
  );
}

function CopyIcon() {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      viewBox="0 0 24 24"
      strokeWidth={1.5}
      stroke="currentColor"
      className="size-5"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M15.75 17.25v3.375c0 .621-.504 1.125-1.125 1.125h-9.75a1.125 1.125 0 0 1-1.125-1.125V7.875c0-.621.504-1.125 1.125-1.125H6.75a9.06 9.06 0 0 1 1.5.124m7.5 10.376h3.375c.621 0 1.125-.504 1.125-1.125V11.25c0-4.46-3.243-8.161-7.5-8.876a9.06 9.06 0 0 0-1.5-.124H9.375c-.621 0-1.125.504-1.125 1.125v3.5m7.5 10.375H9.375a1.125 1.125 0 0 1-1.125-1.125v-9.25m12 6.625v-1.875a3.375 3.375 0 0 0-3.375-3.375h-1.5a1.125 1.125 0 0 1-1.125-1.125v-1.5a3.375 3.375 0 0 0-3.375-3.375H9.75"
      />
    </svg>
  );
}

function EmailIcon() {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      viewBox="0 0 24 24"
      strokeWidth={1.5}
      stroke="currentColor"
      className="size-5"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M16.5 12a4.5 4.5 0 1 1-9 0 4.5 4.5 0 0 1 9 0Zm0 0c0 1.657 1.007 3 2.25 3S21 13.657 21 12a9 9 0 1 0-2.636 6.364M16.5 12V8.25"
      />
    </svg>
  );
}

function CheckIcon() {
  return (
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
  );
}

function ActionButton({
  children,
  exportStatus,
  action,
  disabled,
  label,
}: PropsWithChildren<{
  action: () => void;
  exportStatus: ExportStatus;
  disabled: boolean;
  label: string;
}>) {
  return (
    <div
      className={cn(
        'w-8 h-8 bg-slate-200 rounded-sm flex justify-center items-center border border-black',
        disabled ? 'cursor-wait' : 'cursor-pointer'
      )}
      onClick={disabled ? undefined : action}
      role="button"
      aria-label={label}
    >
      {exportStatus == ExportStatus.Loading && <Spinner />}
      {exportStatus == ExportStatus.Success && <CheckIcon />}
      {exportStatus == ExportStatus.Inactive && children}
    </div>
  );
}

function Spinner() {
  return <div className="animate-spin">~</div>;
}
