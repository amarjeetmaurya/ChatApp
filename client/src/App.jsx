import React, { useState, useEffect, useRef, useCallback } from "react";
import Home from "./pages/Home";
import Chat from "./pages/Chat";
import { dummyRooms } from "./data/rooms";
import { getUserId, getUsername } from "./utils/helpers";
import { useWebSocket } from "./hooks/useWebSocket";

export default function App() {
  const [currentView, setCurrentView] = useState("home");
  const [activeRoom, setActiveRoom] = useState(null);
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [currentUser, setCurrentUser] = useState(null);
  const [onlineCount, setOnlineCount] = useState(0);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  
  const chatRef = useRef(null);
  const inputRef = useRef(null);

  // Initialize user
  useEffect(() => {
    const id = getUserId();
    const username = getUsername(id);
    setCurrentUser({ id, username });
  }, []);

  // Handle WebSocket messages
  const handleMessage = useCallback((data) => {
    console.log(data)
    if (data.type === "userCount") {
      setOnlineCount(data.count || 0);
    } else if (data.type === "message") {
      addMessage(data);
    } else {
      addMessage(data);
    }
  }, []);

  // WebSocket connection
  const { isConnected, sendMessage } = useWebSocket(currentUser, handleMessage);

  // Add message to chat
  const addMessage = (msg) => {
    console.log(msg);
    setMessages((prev) => [...prev, msg]);
    console.log(messages)
    setTimeout(() => {
      if (chatRef.current) {
        chatRef.current.scrollTop = chatRef.current.scrollHeight;
      }
    }, 50);
  };

  // Join a room
  const joinRoom = (room) => {
    setActiveRoom(room);
    setCurrentView("chat");
    setMessages([]);
    setIsSidebarOpen(false);
  };

  // Leave room and go back to home
  const leaveRoom = () => {
    setCurrentView("home");
    setActiveRoom(null);
    setIsSidebarOpen(false);
  };

  // Send chat message
  const handleSendMessage = () => {
    if (!input.trim() || !isConnected) return;

    sendMessage({
      type: "chat",
      message: input,
      username: currentUser.username,
      userId: currentUser.id,
      timestamp: Date.now(),
    });

    setInput("");
    inputRef.current?.focus();
  };

  // Render appropriate view
  if (currentView === "home") {
    return (
      <Home 
        rooms={dummyRooms}
        currentUser={currentUser}
        onJoinRoom={joinRoom}
      />
    );
  }

  return (
    <Chat
      rooms={dummyRooms}
      activeRoom={activeRoom}
      messages={messages}
      input={input}
      setInput={setInput}
      currentUser={currentUser}
      isConnected={isConnected}
      onlineCount={onlineCount}
      isSidebarOpen={isSidebarOpen}
      setIsSidebarOpen={setIsSidebarOpen}
      onRoomSelect={joinRoom}
      onBackToHome={leaveRoom}
      onSendMessage={handleSendMessage}
      chatRef={chatRef}
      inputRef={inputRef}
    />
  );
}