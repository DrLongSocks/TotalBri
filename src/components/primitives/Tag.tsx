import { cn } from '@/lib/cn';

export function Tag({
  children,
  className,
  tone = 'default',
}: {
  children: React.ReactNode;
  className?: string;
  tone?: 'default' | 'sale' | 'ink';
}) {
  const toneClass = {
    default: 'bg-mist text-ink',
    sale: 'bg-sale text-paper',
    ink: 'bg-ink text-paper',
  }[tone];
  return (
    <span
      className={cn(
        'inline-flex items-center rounded-full px-2 py-0.5 text-[11px] font-medium uppercase tracking-[0.1em]',
        toneClass,
        className,
      )}
    >
      {children}
    </span>
  );
}
