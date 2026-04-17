import { cn } from '@/lib/cn';

export function Container({
  children,
  className,
  as: Tag = 'div',
}: {
  children: React.ReactNode;
  className?: string;
  as?: keyof React.JSX.IntrinsicElements;
}) {
  const Component = Tag as keyof React.JSX.IntrinsicElements;
  return <Component className={cn('container-shell', className)}>{children}</Component>;
}
