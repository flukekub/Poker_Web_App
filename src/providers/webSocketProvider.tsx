"use client";

import React, { createContext, useContext, useEffect, useState } from "react";
import { Client } from "@stomp/stompjs";
import SockJS from "sockjs-client";

interface WebSocketContextType {
  client: Client | null;
  isConnected: boolean;
}

const WebSocketContext = createContext<WebSocketContextType>({
  client: null,
  isConnected: false,
});

export const WebSocketProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const [stompClient, setStompClient] = useState<Client | null>(null);
  const [isConnected, setIsConnected] = useState(false);

  useEffect(() => {
    const client = new Client({
      webSocketFactory: () => new SockJS("http://localhost:8080/ws"),
      onConnect: () => {
        console.log("Global WebSocket Connected");
        setStompClient(client);
        setIsConnected(true);
      },
      onDisconnect: () => {
        console.log("Disconnected");
        setIsConnected(false);
      },
      // heartbeatIncoming: 4000, // Optional: Keep connection alive
      // heartbeatOutgoing: 4000,
    });

    client.activate();
    

    return () => {
      client.deactivate();
    };
  }, []);

  return (
    <WebSocketContext.Provider value={{ client: stompClient, isConnected }}>
      {children}
    </WebSocketContext.Provider>
  );
};

// Custom hook for easy access in pages
export const useWebSocket = () => useContext(WebSocketContext);
