import { PropsWithChildren } from 'react';
import { cn } from './utils';
import { Ban, Edit, X } from 'lucide-react';
import { MockoType } from '@mocko/database';
import { MOCKO_TYPE_PREFIXES } from '@mocko/core';

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
            <span className="align-text-top">{MOCKO_TYPE_PREFIXES[type]}</span>
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

export interface ActionButtonConfig {
  onClick: () => void;
  status?: ExportStatus;
  label: string;
  icon: React.ReactNode;
}

export interface ExportButtonsProps {
  buttons: ActionButtonConfig[];
  disabled?: boolean;
  className?: string;
}

export function ExportButtons({
  buttons,
  disabled = false,
  className,
}: ExportButtonsProps) {
  return (
    <div
      className={cn(
        'h-1/3 flex justify-center items-center gap-4 bg-white',
        className
      )}
      id="tour-export-buttons"
    >
      {buttons.map((button, index) => (
        <ActionButton
          key={index}
          action={button.onClick}
          exportStatus={button.status ?? ExportStatus.Inactive}
          disabled={disabled}
          label={button.label}
        >
          {button.icon}
        </ActionButton>
      ))}
    </div>
  );
}

export function GenerateIcon() {
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

export function EmailIcon() {
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

export function FillInputIcon() {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      stroke="currentColor"
      stroke-width={1.5}
      className="size-5"
      fill="none"
    >
      <path d="M12 20h-1a2 2 0 0 1-2-2 2 2 0 0 1-2 2H6" />
      <path d="M13 8h7a2 2 0 0 1 2 2v4a2 2 0 0 1-2 2h-7" />
      <path d="M5 16H4a2 2 0 0 1-2-2v-4a2 2 0 0 1 2-2h1" />
      <path d="M6 4h1a2 2 0 0 1 2 2 2 2 0 0 1 2-2h1" />
      <path d="M9 6v12" />
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
