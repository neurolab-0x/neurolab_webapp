
import { useEffect, useRef, useState, useCallback } from 'react';
import { WebSocketMessage, Message } from '../types';

// This is a mock WebSocket implementation for the demo
// In a real app, you'd connect to a real WebSocket server
export const useWebSocket = () => {
  const [connected, setConnected] = useState(false);
  const [messages, setMessages] = useState<Message[]>([{
    id: "msg-init",
    sender: "NeuralAssistant",
    content: "Hello! I'm your NeuralAssistant. How can I help you interpret your EEG data today?",
    timestamp: new Date().toISOString(),
    isUser: false
  }]);
  const [error, setError] = useState<string | null>(null);
  
  // In a real implementation, this would be a WebSocket instance
  const socketRef = useRef<any>(null);
  
  // Connect to the WebSocket server
  const connect = useCallback(() => {
    // Simulate connection
    setTimeout(() => {
      setConnected(true);
      console.log("WebSocket connected");
    }, 1000);
  }, []);
  
  // Disconnect from the WebSocket server
  const disconnect = useCallback(() => {
    // Simulate disconnection
    setTimeout(() => {
      setConnected(false);
      console.log("WebSocket disconnected");
    }, 500);
  }, []);
  
  // Send a message through the WebSocket
  const sendMessage = useCallback((content: string) => {
    if (!connected) {
      setError("Not connected to WebSocket server");
      return;
    }
    
    const newMessage: Message = {
      id: `msg-${Date.now()}`,
      sender: "User",
      content,
      timestamp: new Date().toISOString(),
      isUser: true
    };
    
    setMessages(prevMessages => [...prevMessages, newMessage]);
    
    // Simulate receiving a response after a short delay
    setTimeout(() => {
      const responseMessage: Message = {
        id: `msg-${Date.now() + 1}`,
        sender: "NeuralAssistant",
        content: `I've received your message: "${content}". How else can I assist you with your neural data?`,
        timestamp: new Date().toISOString(),
        isUser: false
      };
      
      setMessages(prevMessages => [...prevMessages, responseMessage]);
    }, 1500);
  }, [connected]);
  
  // Connect on component mount
  useEffect(() => {
    connect();
    
    return () => {
      disconnect();
    };
  }, [connect, disconnect]);
  
  return {
    connected,
    messages,
    sendMessage,
    error,
    connect,
    disconnect
  };
};

export default useWebSocket;
