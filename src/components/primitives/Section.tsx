import { cn } from '@/lib/cn';

type Props = {
  children: React.ReactNode;
  className?: string;
  tone?: 'paper' | 'porcelain' | 'ink' | 'mist';
  fullBleed?: boolean;
};

const toneClass: Record<NonNullable<Props['tone']>, string> = {
  paper: 'bg-paper text-ink',
  porcelain: 'bg-porcelain text-ink',
  ink: 'bg-ink text-paper',
  mist: 'bg-mist text-ink',
};

export function Section({ children, className, tone = 'paper', fullBleed = false }: Props) {
  return (
    <section
      className={cn(
        'relative w-full py-[clamp(4rem,8vw,10rem)]',
        toneClass[tone],
        !fullBleed && '',
        className,
      )}
    >
      {children}
    </section>
  );
}
