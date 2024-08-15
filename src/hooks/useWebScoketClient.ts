import { useCallback, useEffect, useState } from 'react';
import { useWebSocket as useNextWs } from 'next-ws/client';

export interface PayloadContent {
  id: string;
  author: string;
  text: string;

}

export interface PayloadMessage {
  clientId?: string;
  roomId?: string;
  name?: string;
  token?: string;
  content?: PayloadContent;
}

export interface WebSocketMessage {
  type: string;
  payload: PayloadMessage;
}

interface UseWebSocketOptions {
  onMessage?: (message: WebSocketMessage) => void;
  onOpen?: () => void;
  onClose?: () => void;
  onError?: (error: Event) => void;
}

export function useWebSocketClient(options: UseWebSocketOptions) {
  const [clientId, setClientId] = useState<string | null>(null);
  const [roomId, setRoomId] = useState<string | null>(null);
  const { onMessage, onOpen, onClose, onError } = options || {};
  const [isConnected, setIsConnected] = useState(false);
  const ws = useNextWs();

  useEffect(() => {
    if (!ws) return;

    const handleOpen = () => {
      setIsConnected(true);
      onOpen?.();
    };

    const handleClose = () => {
      setIsConnected(false);
      onClose?.();
    };

    const handleError = (error: Event) => {
      onError?.(error);
    };

    const handleMessage = (event: MessageEvent) => {
      const message: WebSocketMessage = JSON.parse(event.data);
      if (message.type === "roomJoined") {
        setRoomId(message?.payload?.roomId!);
        setClientId(message?.payload?.clientId!);
      }
      onMessage?.(message);
    };

    ws.addEventListener('open', handleOpen);
    ws.addEventListener('close', handleClose);
    ws.addEventListener('error', handleError);
    ws.addEventListener('message', handleMessage);

    return () => {
      ws.removeEventListener('open', handleOpen);
      ws.removeEventListener('close', handleClose);
      ws.removeEventListener('error', handleError);
      ws.removeEventListener('message', handleMessage);
    };
  }, [ws, onOpen, onClose, onError, onMessage]);

  const sendMessage = useCallback(
    (message: WebSocketMessage) => {
      if (ws && isConnected) {
        ws.send(JSON.stringify(message));
      }
    },
    [ws, isConnected]
  );

  const subscribe = useCallback((name?: string) => {
    sendMessage({ type: "createOrJoinRoom", payload: { name } });
  }, [sendMessage]);
  const authenticate = (token: string) => sendMessage({ type: "authenticate", payload: { token } });

  return { clientId, roomId, sendMessage, isConnected, subscribe, authenticate };
}
