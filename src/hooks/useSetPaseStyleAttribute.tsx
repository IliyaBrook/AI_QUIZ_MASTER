import { useEffect } from 'react';

import type { AppPagesVariants, QuizScreen } from '@/settings';

export const useSetPageStyleAttribute = (
  page: AppPagesVariants | QuizScreen
) => {
  useEffect(() => {
    document.body.setAttribute('page', page);
    return () => {
      document.body.removeAttribute('page');
    };
  }, [page]);
};
