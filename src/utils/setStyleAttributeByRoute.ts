import type { TPageStyleAttribute } from '@/types';

export const setStyleAttributeByRoute = (page: TPageStyleAttribute) => {
  document.body.setAttribute('page', page);
};
