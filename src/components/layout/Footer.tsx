import { CinematicFooter } from '@/features/home/CinematicFooter';
import type { Locale } from '@/domain/i18n/config';

type Props = {
  locale: Locale;
};

export function Footer(_props: Props) {
  return <CinematicFooter />;
}
