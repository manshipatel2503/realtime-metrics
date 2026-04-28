import type { DataPoint } from '../types';

export type StreamErrorCode =
  | 'CONNECTION_FAILED'   
  | 'PARSE_ERROR'      
  | 'SERVER_ERROR';

export interface StreamError {
  code: StreamErrorCode;
  message: string;
}

export interface StreamHandlers {
  onMessage: (point: DataPoint) => void;
  onError: (error: StreamError) => void;
  onOpen?: () => void;
}

export function createStream(url: string, handlers: StreamHandlers): () => void {
  const es = new EventSource(url);

  es.addEventListener('open', () => {
    handlers.onOpen?.();
  });

  es.addEventListener('message', (event: MessageEvent<string>) => {
    try {
      const point = JSON.parse(event.data) as DataPoint;
      handlers.onMessage(point);
    } catch {
      handlers.onError({
        code: 'PARSE_ERROR',
        message: `Failed to parse message: ${event.data}`,
      });
    }
  });

  es.addEventListener('error', () => {
    const code: StreamErrorCode =
      es.readyState === EventSource.CLOSED
        ? 'SERVER_ERROR'
        : 'CONNECTION_FAILED';

    handlers.onError({
      code,
      message:
        code === 'SERVER_ERROR'
          ? 'Server closed the connection unexpectedly.'
          : 'Could not connect to the data stream. Is the server running?',
    });
  });

  return () => es.close();
}
