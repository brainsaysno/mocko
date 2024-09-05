import GithubIcon from '@/assets/GithubIcon';
import { cn } from '@/lib/utils';

export default function Signature({ className }: { className?: string }) {
  return (
    <a
      href="https://github.com/brainsaysno/mocko"
      target="_blank"
      className={cn(
        'text-center text-sm flex items-center gap-2 w-fit mx-auto',
        className
      )}
    >
      <span>
        <GithubIcon />
      </span>
      x brainsaysno
    </a>
  );
}
