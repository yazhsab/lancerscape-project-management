import { useEffect, useRef, useState } from 'react';
import { useQueryClient } from '@tanstack/react-query';

interface WebSocketMessage {
  type: 'project_update' | 'milestone_update' | 'proposal_update' | 'file_upload' | 'notification';
  data: any;
  timestamp: string;
}

export const useWebSocket = (userId: string) => {
  const [isConnected, setIsConnected] = useState(false);
  const [lastMessage, setLastMessage] = useState<WebSocketMessage | null>(null);
  const wsRef = useRef<WebSocket | null>(null);
  const queryClient = useQueryClient();
  const reconnectTimeoutRef = useRef<NodeJS.Timeout>();
  const reconnectAttempts = useRef(0);
  const maxReconnectAttempts = 5;

  const connect = () => {
    try {
      const wsUrl = `${import.meta.env.VITE_WS_URL || 'wss://api.lancerscape.in'}/ws?userId=${userId}`;
      wsRef.current = new WebSocket(wsUrl);

      wsRef.current.onopen = () => {
        console.log('WebSocket connected');
        setIsConnected(true);
        reconnectAttempts.current = 0;
      };

      wsRef.current.onmessage = (event) => {
        try {
          const message: WebSocketMessage = JSON.parse(event.data);
          setLastMessage(message);
          handleMessage(message);
        } catch (error) {
          console.error('Failed to parse WebSocket message:', error);
        }
      };

      wsRef.current.onclose = () => {
        console.log('WebSocket disconnected');
        setIsConnected(false);
        
        // Attempt to reconnect
        if (reconnectAttempts.current < maxReconnectAttempts) {
          reconnectAttempts.current++;
          const delay = Math.min(1000 * Math.pow(2, reconnectAttempts.current), 30000);
          
          reconnectTimeoutRef.current = setTimeout(() => {
            console.log(`Attempting to reconnect... (${reconnectAttempts.current}/${maxReconnectAttempts})`);
            connect();
          }, delay);
        }
      };

      wsRef.current.onerror = (error) => {
        console.error('WebSocket error:', error);
      };
    } catch (error) {
      console.error('Failed to connect to WebSocket:', error);
    }
  };

  const handleMessage = (message: WebSocketMessage) => {
    switch (message.type) {
      case 'project_update':
        queryClient.invalidateQueries({ queryKey: ['projects'] });
        queryClient.invalidateQueries({ queryKey: ['project', message.data.projectId] });
        break;
      
      case 'milestone_update':
        queryClient.invalidateQueries({ queryKey: ['milestones', message.data.projectId] });
        break;
      
      case 'proposal_update':
        queryClient.invalidateQueries({ queryKey: ['proposals', message.data.projectId] });
        break;
      
      case 'file_upload':
        queryClient.invalidateQueries({ queryKey: ['project-files', message.data.projectId] });
        break;
      
      case 'notification':
        queryClient.invalidateQueries({ queryKey: ['notifications'] });
        break;
    }
  };

  const sendMessage = (message: Omit<WebSocketMessage, 'timestamp'>) => {
    if (wsRef.current && wsRef.current.readyState === WebSocket.OPEN) {
      wsRef.current.send(JSON.stringify({
        ...message,
        timestamp: new Date().toISOString()
      }));
    }
  };

  useEffect(() => {
    if (userId) {
      connect();
    }

    return () => {
      if (reconnectTimeoutRef.current) {
        clearTimeout(reconnectTimeoutRef.current);
      }
      if (wsRef.current) {
        wsRef.current.close();
      }
    };
  }, [userId]);

  return {
    isConnected,
    lastMessage,
    sendMessage
  };
};