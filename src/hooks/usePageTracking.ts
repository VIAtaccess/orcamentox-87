import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';

// Gera um ID de sessão único por visita
const getSessionId = () => {
  let sessionId = sessionStorage.getItem('session_id');
  if (!sessionId) {
    sessionId = crypto.randomUUID();
    sessionStorage.setItem('session_id', sessionId);
  }
  return sessionId;
};

export const usePageTracking = () => {
  const location = useLocation();

  useEffect(() => {
    const trackPageAccess = async () => {
      try {
        const sessionId = getSessionId();
        const url = window.location.href;
        const userAgent = navigator.userAgent;
        const referrer = document.referrer || null;

        await supabase
          .from('acessos')
          .insert({
            url,
            user_agent: userAgent,
            referrer,
            session_id: sessionId
          });

        console.log('Page access tracked:', url);
      } catch (error) {
        console.error('Error tracking page access:', error);
      }
    };

    // Delay pequeno para garantir que a página foi carregada
    const timer = setTimeout(trackPageAccess, 100);

    return () => clearTimeout(timer);
  }, [location.pathname, location.search]);
};

export default usePageTracking;