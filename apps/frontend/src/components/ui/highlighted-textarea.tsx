import * as React from 'react';
import { cn } from '@/lib/utils';

const VARIABLE_REGEX = /{{\s?(\w+)\s?}}/g;

export interface HighlightedTextareaProps
  extends React.TextareaHTMLAttributes<HTMLTextAreaElement> { }

const HighlightedTextarea = React.forwardRef<
  HTMLTextAreaElement,
  HighlightedTextareaProps
>(({ className, value, ...props }, ref) => {
  const [scrollTop, setScrollTop] = React.useState(0);
  const [scrollLeft, setScrollLeft] = React.useState(0);
  const backdropRef = React.useRef<HTMLDivElement>(null);

  const handleScroll = (e: React.UIEvent<HTMLTextAreaElement>) => {
    const target = e.target as HTMLTextAreaElement;
    setScrollTop(target.scrollTop);
    setScrollLeft(target.scrollLeft);
  };

  React.useEffect(() => {
    if (backdropRef.current) {
      backdropRef.current.scrollTop = scrollTop;
      backdropRef.current.scrollLeft = scrollLeft;
    }
  }, [scrollTop, scrollLeft]);

  const highlightVariables = (text: string) => {
    if (!text) return '';

    const parts: React.ReactNode[] = [];
    let lastIndex = 0;

    const matches = Array.from(text.matchAll(VARIABLE_REGEX));

    matches.forEach((match, index) => {
      const matchStart = match.index!;
      const matchEnd = matchStart + match[0].length;

      if (matchStart > lastIndex) {
        parts.push(
          <span key={`text-${index}`}>{text.slice(lastIndex, matchStart)}</span>
        );
      }

      parts.push(
        <span key={`var-${index}`} className="text-yellow-600">
          {match[0]}
        </span>
      );

      lastIndex = matchEnd;
    });

    if (lastIndex < text.length) {
      parts.push(<span key="text-end">{text.slice(lastIndex)}</span>);
    }

    return parts;
  };

  const textValue = (value ?? '') as string;

  return (
    <div className="relative">
      <div
        ref={backdropRef}
        className={cn(
          'absolute inset-0 w-full rounded-md border border-transparent px-3 py-2 text-sm whitespace-pre-wrap break-words overflow-hidden pointer-events-none',
          className
        )}
        style={{
          minHeight: '80px',
        }}
      >
        {highlightVariables(textValue)}
      </div>
      <textarea
        className={cn(
          'relative flex min-h-[80px] w-full rounded-md border border-input bg-transparent px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 resize-none',
          'text-transparent caret-black selection:bg-blue-200 selection:text-transparent',
          className
        )}
        ref={ref}
        value={value}
        onScroll={handleScroll}
        {...props}
      />
    </div>
  );
});

HighlightedTextarea.displayName = 'HighlightedTextarea';

export { HighlightedTextarea };
