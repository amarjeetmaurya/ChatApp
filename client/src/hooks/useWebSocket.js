import { useEffect, useRef, useState } from "react";

export const useWebSocket = (currentUser, onMessage) => {
  const [isConnected, setIsConnected] = useState(false);
  const socketRef = useRef(null);

  useEffect(() => {
    if (!currentUser) return;

    // const ws = new WebSocket("ws://localhost:8080");
    const ws = new WebSocket(import.meta.env.VITE_WS_URL);
    socketRef.current = ws;

    ws.onopen = () => {
      setIsConnected(true);
      ws.send(JSON.stringify({ 
        type: "join", 
        id: currentUser.id, 
        username: currentUser.username 
      }));
    };

    ws.onmessage = (e) => {
      try {
        const data = JSON.parse(e.data);
        onMessage(data);
      } catch {
        onMessage({ type: "users", text: e.data, timestamp: Date.now() });
      }
    };

    ws.onclose = () => setIsConnected(false);
    ws.onerror = () => setIsConnected(false);

    return () => ws.close();
  }, [currentUser, onMessage]);

  const sendMessage = (message) => {
    if (socketRef.current && socketRef.current.readyState === WebSocket.OPEN) {
      socketRef.current.send(JSON.stringify(message));
    }
  };

  return { isConnected, sendMessage };
};