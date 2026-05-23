/**
 * useInstagramContent Hook
 * Manages fetching, caching, and error handling for Instagram media
 *
 * Usage:
 * const { data, error, isLoading, refetch, retryAfter } = useInstagramContent();
 */

import { useEffect, useState, useCallback, useRef } from 'react';
import {
  fetchInstagramContent,
  clearInstagramCache,
  getInstagramCacheStatus,
} from '@/lib/instagram-content';

interface InstagramContentItem {
  id?: string | number;
  instagramUrl: string;
  mediaUrl?: string;
  [key: string]: unknown;
}

interface UseInstagramContentOptions {
  limit?: number;
  autoRefreshInterval?: number; // milliseconds, 0 to disable
  onError?: (error: Error) => void;
}

interface UseInstagramContentReturn<T extends object> {
  data: T[] | null;
  error: Error | null;
  isLoading: boolean;
  isRefreshing: boolean;
  refetch: () => Promise<void>;
  clearCache: () => void;
  cacheStatus: ReturnType<typeof getInstagramCacheStatus>;
  retryAfter?: number; // seconds until retry recommended
}

export function useInstagramContent(
  options?: UseInstagramContentOptions
): UseInstagramContentReturn<InstagramContentItem>;

export function useInstagramContent<T extends object>(
  options: UseInstagramContentOptions
): UseInstagramContentReturn<T>;

export function useInstagramContent<T extends object = InstagramContentItem>(
  options: UseInstagramContentOptions = {}
): UseInstagramContentReturn<T> {
  const {
    limit = 12,
    autoRefreshInterval = 0,
    onError,
  } = options;

  const [data, setData] = useState<T[] | null>(null);
  const [error, setError] = useState<Error | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [retryAfter, setRetryAfter] = useState<number>();
  const refreshIntervalRef = useRef<ReturnType<typeof setInterval>>();
  const retryTimeoutRef = useRef<ReturnType<typeof setTimeout>>();
  const isMountedRef = useRef(true);
  const retryCountRef = useRef(0);
  const onErrorRef = useRef(onError);
  const lastErrorTimeRef = useRef(0);
  const MAX_RETRIES = 2;
  const RETRY_DELAY_MS = 3000; // Wait 3 seconds before retrying

  useEffect(() => {
    onErrorRef.current = onError;
  }, [onError]);

  // Fetch Instagram content with retry limits
  const fetch = useCallback(
    async (forceRefresh = false) => {
      try {
        if (forceRefresh) {
          setIsRefreshing(true);
          setError(null);
        } else {
          setIsLoading(true);
        }

        const result = (await fetchInstagramContent({
          limit,
          forceRefresh,
          timeout: 15000,
        })) as T[];

        if (isMountedRef.current) {
          setData(result);
          setError(null);
          setRetryAfter(undefined);
          retryCountRef.current = 0; // Reset retry count on success
        }
      } catch (err) {
        const error = err instanceof Error ? err : new Error(String(err));

        if (isMountedRef.current) {
          // Only retry limited times with exponential backoff
          if (retryCountRef.current < MAX_RETRIES) {
            retryCountRef.current++;
            const delayMs = RETRY_DELAY_MS * Math.pow(2, retryCountRef.current - 1);
            console.warn(
              `[useInstagramContent] Retry attempt ${retryCountRef.current}/${MAX_RETRIES} after ${delayMs}ms`,
              error.message
            );

            // Schedule retry after delay
            if (retryTimeoutRef.current) {
              clearTimeout(retryTimeoutRef.current);
            }

            retryTimeoutRef.current = setTimeout(() => {
              if (isMountedRef.current) {
                fetch(forceRefresh);
              }
            }, delayMs);

            return; // Don't set error yet, retrying
          }

          // Max retries exceeded, show error
          setError(error);
          setData(null);
          setRetryAfter(60); // Suggest retry after 60 seconds
          lastErrorTimeRef.current = Date.now();

          if (onErrorRef.current) {
            onErrorRef.current(error);
          }

          console.error('[useInstagramContent] Max retries exceeded:', error.message);
        }
      } finally {
        if (isMountedRef.current) {
          setIsLoading(false);
          setIsRefreshing(false);
        }
      }
    },
    [limit]
  );

  // Initial load - only try once, don't retry automatically
  useEffect(() => {
    isMountedRef.current = true;
    retryCountRef.current = 0;
    fetch(false);

    return () => {
      isMountedRef.current = false;
      if (retryTimeoutRef.current) {
        clearTimeout(retryTimeoutRef.current);
      }
      if (refreshIntervalRef.current) {
        clearInterval(refreshIntervalRef.current);
      }
    };
  }, [fetch]);

  // Auto-refresh interval - ONLY if no error
  useEffect(() => {
    if (autoRefreshInterval > 0 && !error) {
      refreshIntervalRef.current = setInterval(() => {
        if (isMountedRef.current) {
          retryCountRef.current = 0; // Reset retry count for new fetch cycle
          fetch(true);
        }
      }, autoRefreshInterval);

      return () => {
        if (refreshIntervalRef.current) {
          clearInterval(refreshIntervalRef.current);
        }
      };
    }

    return undefined;
  }, [autoRefreshInterval, error, fetch]);

  // Manual refetch
  const refetch = useCallback(async () => {
    retryCountRef.current = 0; // Reset on manual retry
    await fetch(true);
  }, [fetch]);

  // Clear cache
  const handleClearCache = useCallback(() => {
    clearInstagramCache();
    retryCountRef.current = 0; // Reset retry count
    fetch(true);
  }, [fetch]);

  return {
    data,
    error,
    isLoading,
    isRefreshing,
    refetch,
    clearCache: handleClearCache,
    cacheStatus: getInstagramCacheStatus(),
    retryAfter,
  };
}
