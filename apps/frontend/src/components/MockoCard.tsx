import { emailMocko } from '@/lib/api';
import { Mocko, MockoType } from '@/model/mocko';
import { PropsWithChildren, useCallback, useState } from 'react';
import { Popover, PopoverContent } from './ui/popover';
import { Input } from './ui/input';
import { PopoverTrigger } from '@radix-ui/react-popover';
import { Label } from './ui/label';
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
import { SubmitHandler, useForm } from 'react-hook-form';

const prefixes: Record<MockoType, string> = {
  [MockoType.AIStructured]: 'AI Structured',
  [MockoType.AIProse]: 'AI Prose',
  [MockoType.Deterministic]: 'Deterministic',
  [MockoType.Fixed]: 'Fixed',
};

export default function MockoCard({ mocko }: { mocko: Mocko }) {
  const [isLoadingGenerate, setIsLoadingGenerate] = useState(false);
  const [isLoadingCopy, setIsLoadingCopy] = useState(false);
  const [isLoadingEmail, setIsLoadingEmail] = useState(false);

  const [isSuccessGenerate, setIsSuccessGenerate] = useState(false);
  const [isSuccessCopy, setIsSuccessCopy] = useState(false);
  const [isSuccessEmail, setIsSuccessEmail] = useState(false);

  const [isEmailPopoverOpen, setIsEmailPopoverOpen] = useState(false);

  const onGenerate = useCallback(async () => {
    setIsLoadingGenerate(true);
    const mockData = await mocko.generateOne();

    alert(mockData);
    setIsLoadingGenerate(false);
    setIsSuccessGenerate(true);
    setTimeout(() => {
      setIsSuccessGenerate(false);
    }, 1000);
  }, [mocko]);

  const sendEmailSchema = z.object({
    recipient: z.string().email(),
  });

  type SendEmailSchema = z.infer<typeof sendEmailSchema>;

  const emailForm = useForm<SendEmailSchema>({
    resolver: zodResolver(sendEmailSchema),
  });

  const onEmail = useCallback(async () => {
    setIsLoadingEmail(true);
    setIsEmailPopoverOpen(true);
  }, [mocko]);

  const onSendEmail = useCallback<SubmitHandler<SendEmailSchema>>(
    async ({ recipient }) => {
      setIsEmailPopoverOpen(false);
      const mockData = await mocko.generateOne();
      await emailMocko(recipient, mockData);
      setIsLoadingEmail(false);
      setIsSuccessEmail(true);
      setTimeout(() => {
        setIsSuccessEmail(false);
      }, 1000);
    },
    []
  );

  const onEmailClose = useCallback(() => {
    setIsLoadingEmail(false);
    setIsEmailPopoverOpen(false);
  }, []);

  const onCopy = useCallback(async () => {
    setIsLoadingCopy(true);
    const mockData = await mocko.generateOne();

    navigator.clipboard.writeText(mockData);
    setIsLoadingCopy(false);
    setIsSuccessCopy(true);
    setTimeout(() => {
      setIsSuccessCopy(false);
    }, 1000);
  }, [mocko]);

  return (
    <Popover
      open={isEmailPopoverOpen}
      onOpenChange={(o) => o || onEmailClose()}
    >
      <PopoverTrigger asChild>
        <div className="w-72 h-40 rounded-md overflow-clip border-2 border-black">
          <div className="h-2/3 bg-slate-100 flex justify-center items-center border-b-2 border-black">
            <div>
              <p>{prefixes[mocko.type]}</p>
              <h4 className="text-3xl font-medium">{mocko.name}</h4>
            </div>
          </div>
          <div className="h-1/3 flex justify-center items-center gap-4 bg-white">
            <ActionButton
              action={onGenerate}
              isLoading={isLoadingGenerate}
              isSuccess={isSuccessGenerate}
            >
              <GenerateIcon />
            </ActionButton>
            <ActionButton
              action={onCopy}
              isLoading={isLoadingCopy}
              isSuccess={isSuccessCopy}
            >
              <CopyIcon />
            </ActionButton>
            <ActionButton
              action={onEmail}
              isLoading={isLoadingEmail}
              isSuccess={isSuccessEmail}
            >
              <EmailIcon />
            </ActionButton>
          </div>
        </div>
      </PopoverTrigger>
      <PopoverContent className="box-shadow-xl w-full mx-auto">
        <Form {...emailForm}>
          <form onSubmit={emailForm.handleSubmit(onSendEmail)}>
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
  isLoading,
  isSuccess,
  action,
}: PropsWithChildren<{
  action: () => void;
  isLoading: boolean;
  isSuccess: boolean;
}>) {
  return (
    <div
      className="cursor-pointer w-8 h-8 bg-slate-200 rounded-sm flex justify-center items-center border border-black"
      onClick={action}
      role="button"
    >
      {isLoading ? <Spinner /> : isSuccess ? <CheckIcon /> : children}
    </div>
  );
}

function Spinner() {
  return <div className="animate-spin">~</div>;
}
