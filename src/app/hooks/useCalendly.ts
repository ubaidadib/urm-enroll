import { useState, useCallback } from 'react';
import loadCalendly, { initPopupWidget, initBadgeWidget, createInlineWidget } from '../utils/calendly-embed';

export function useCalendly() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const load = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const cal = await loadCalendly();
      return cal;
    } catch (err) {
      setError(err as Error);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  return {
    load,
    loading,
    error,
    initPopup: initPopupWidget,
    initBadge: initBadgeWidget,
    createInline: createInlineWidget,
  } as const;
}

export default useCalendly;
