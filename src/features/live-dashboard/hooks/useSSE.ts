import { useCallback, useEffect, useRef, useState } from 'react';
import { createStream, type StreamError } from '../../../services/stream';
import { SSE_URL, MAX_HISTORY } from '../constants';
import type { DataPoint, ConnectionStatus } from '../../../types';

export const MAX_RETRIES = 3;
const RETRY_DELAY_MS = 3000;

export interface UseSSEResult {
  data: DataPoint[];
  status: ConnectionStatus;
  error: StreamError | null;
  retryCount: number;
  start: () => void;
  stop: () => void;
}

export function useSSE(): UseSSEResult {
  const [data, setData]             = useState<DataPoint[]>([]);
  const [status, setStatus]         = useState<ConnectionStatus>('connecting');
  const [error, setError]           = useState<StreamError | null>(null);
  const [retryCount, setRetryCount] = useState(0);

  const cleanupRef    = useRef<(() => void) | null>(null);
  const retryTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const retryCountRef = useRef(0);
  const stoppedRef    = useRef(false);
  const connectRef    = useRef<() => void>(() => {});

  const clearRetryTimer = () => {
    if (retryTimerRef.current) {
      clearTimeout(retryTimerRef.current);
      retryTimerRef.current = null;
    }
  };

  const closeStream = () => {
    cleanupRef.current?.();
    cleanupRef.current = null;
  };

  const connect = useCallback(() => {
    closeStream();
    clearRetryTimer();
    stoppedRef.current = false;

    cleanupRef.current = createStream(SSE_URL, {
      onOpen: () => {
        retryCountRef.current = 0;
        setRetryCount(0);
        setStatus('connected');
        setError(null);
      },

      onMessage: (point: DataPoint) => {
        setData(prev =>
          prev.length >= MAX_HISTORY
            ? [...prev.slice(1), point]
            : [...prev, point]
        );
      },

      onError: (streamError: StreamError) => {
        if (stoppedRef.current) return;

        setError(streamError);
        closeStream();

        if (retryCountRef.current < MAX_RETRIES) {
          retryCountRef.current += 1;
          setRetryCount(retryCountRef.current);
          setStatus('connecting');

          retryTimerRef.current = setTimeout(() => {
            if (!stoppedRef.current) connectRef.current();
          }, RETRY_DELAY_MS);
        } else {
          setStatus('error');
        }
      },
    });
  }, []);

  const start = useCallback(() => {
    retryCountRef.current = 0;
    setRetryCount(0);
    setStatus('connecting');
    setError(null);
    connect();
  }, [connect]);

  const stop = useCallback(() => {
    stoppedRef.current = true;
    closeStream();
    clearRetryTimer();
    setStatus('stopped');
    setError(null);
  }, []);

  useEffect(() => {
    connectRef.current = connect;
    connect();
    return () => {
      stoppedRef.current = true;
      closeStream();
      clearRetryTimer();
    };
  }, [connect]);

  return { data, status, error, retryCount, start, stop };
}
