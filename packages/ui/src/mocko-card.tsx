import { PropsWithChildren } from 'react';
import { cn } from './utils';
import { Ban, Edit, X } from 'lucide-react';

export enum MockoType {
  AIJson = 'ai_json',
  AIProse = 'ai_prose',
  Deterministic = 'deterministic',
  Fixed = 'fixed',
}

const prefixes: Record<MockoType, string> = {
  [MockoType.AIJson]: 'AI JSON',
  [MockoType.AIProse]: 'AI Prose',
  [MockoType.Deterministic]: 'Deterministic',
  [MockoType.Fixed]: 'Fixed',
};

export enum ExportStatus {
  Inactive = 'inactive',
  Loading = 'loading',
  Success = 'success',
  Error = 'error',
}

export interface MockoCardProps {
  name: string;
  type: MockoType;
  hasRuntimeVariables?: boolean;
  onEdit?: () => void;
  onDelete?: () => void;
  disabled?: boolean;
  children?: React.ReactNode;
}

export function MockoCard({
  name,
  type,
  hasRuntimeVariables = false,
  onEdit,
  onDelete,
  disabled = false,
  children,
}: MockoCardProps) {
  return (
    <div
      className="relative w-72 h-40 rounded-md overflow-clip border-2 border-black mocko-card group"
      data-testid="mocko-card"
    >
      {onEdit && (
        <div
          className="absolute top-1.5 left-1.5 opacity-0 group-hover:opacity-100 transition-all cursor-pointer"
          onClick={onEdit}
          role="button"
        >
          <Edit size={18} className="stroke-black" />
        </div>
      )}
      {onDelete && (
        <div
          className="absolute top-1 right-1 opacity-0 group-hover:opacity-100 transition-all cursor-pointer"
          onClick={onDelete}
          role="button"
        >
          <X size={20} className="fill-red-600 stroke-red-600" />
        </div>
      )}
      <div className="h-2/3 bg-slate-100 flex justify-center items-center border-b-2 border-black">
        <div>
          <p>
            <span className="align-text-top">{prefixes[type]}</span>
            {hasRuntimeVariables && (
              <span className="text-yellow-500 font-bold align-middle ml-2">
                {'{ }'}
              </span>
            )}
          </p>
          <h4 className="text-3xl font-medium">{name}</h4>
        </div>
      </div>
      {children}
    </div>
  );
}

export interface ExportButtonsProps {
  onGenerate?: () => void;
  onCopy?: () => void;
  onEmail?: () => void;
  generateStatus?: ExportStatus;
  copyStatus?: ExportStatus;
  emailStatus?: ExportStatus;
  disabled?: boolean;
}

export function ExportButtons({
  onGenerate,
  onCopy,
  onEmail,
  generateStatus = ExportStatus.Inactive,
  copyStatus = ExportStatus.Inactive,
  emailStatus = ExportStatus.Inactive,
  disabled = false,
}: ExportButtonsProps) {
  return (
    <div
      className="h-1/3 flex justify-center items-center gap-4 bg-white"
      id="tour-export-buttons"
    >
      {onGenerate && (
        <ActionButton
          action={onGenerate}
          exportStatus={generateStatus}
          disabled={disabled}
          label="Generate Mocko"
        >
          <GenerateIcon />
        </ActionButton>
      )}
      {onCopy && (
        <ActionButton
          action={onCopy}
          exportStatus={copyStatus}
          disabled={disabled}
          label="Copy Mocko"
        >
          <CopyIcon />
        </ActionButton>
      )}
      {onEmail && (
        <ActionButton
          action={onEmail}
          exportStatus={emailStatus}
          disabled={disabled}
          label="Email Mocko"
        >
          <EmailIcon />
        </ActionButton>
      )}
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

export function CopyIcon() {
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
      {exportStatus == ExportStatus.Error && (
        <Ban size={20} className="stroke-[3] stroke-red-600" />
      )}
      {exportStatus == ExportStatus.Inactive && children}
    </div>
  );
}

function Spinner() {
  return <div className="animate-spin">~</div>;
}
