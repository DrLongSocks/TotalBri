import { CinematicFooter } from '@/features/home/CinematicFooter';
import type { Locale } from '@/domain/i18n/config';

type Props = {
  locale: Locale;
  heading?: string;
};

export function Footer({ heading }: Props) {
  return <CinematicFooter heading={heading} />;
}
