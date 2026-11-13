import type { Partner } from '@gdg-wroclaw/ui';

const partner = (name: string, url: string, logo: string): Partner => ({
  name,
  logo: { src: logo },
  url,
});

/** Community partners; logos are self-hosted in `apps/events/public/partners`. */
export const PARTNERS: readonly Partner[] = [
  partner('meet.js', 'https://meetjs.pl/', '/partners/meetjs.svg'),
  partner('Sekurak', 'https://sekurak.pl/', '/partners/sekurak.jpg'),
  partner(
    'Machinekind',
    'https://machinekind.ai/',
    '/partners/machinekind.webp',
  ),
  partner('AI HUB @UEW', 'https://ai.uew.pl/', '/partners/aihub.webp'),
  partner('Solvro', 'https://solvro.pwr.edu.pl/pl', '/partners/solvro.webp'),
  partner('JS Poland', 'https://js-poland.pl/', '/partners/js-poland.webp'),
  partner('NG Poland', 'https://ng-poland.pl/', '/partners/ng-poland.webp'),
  partner('inQUBE', 'https://inqube.pl/', '/partners/inqube.webp'),
];
