import { useEffect } from 'react';
import { useLocation } from 'react-router';

export const useSetPageStyleAttribute = () => {
  const pathname = useLocation();

  const routeName = pathname.pathname.split('/')[1];

  useEffect(() => {
    document.body.setAttribute('page', routeName || 'home');
  }, [routeName]);
};
