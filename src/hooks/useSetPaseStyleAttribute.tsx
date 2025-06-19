import { useEffect } from 'react';

import type { AppPagesVariants } from '@/settings';

export const useSetPageStyleAttribute = (page: AppPagesVariants) => {
  useEffect(() => {
    document.body.setAttribute('page', page);
    return () => {
      document.body.removeAttribute('page');
    };
  }, [page]);
};
