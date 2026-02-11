import React, { useRef } from "react";
import Sidebar from "../components/Sidebar";
import ChatHeader from "../components/ChatHeader";
import MessageBubble from "../components/MessageBubble";
import MessageInput from "../components/MessageInput";
import EmptyState from "../components/EmptyState";

export default function Chat({ 
  rooms,
  activeRoom, 
  messages,
  input,
  setInput,
  currentUser,
  isConnected,
  onlineCount,
  isSidebarOpen,
  setIsSidebarOpen,
  onRoomSelect,
  onBackToHome,
  onSendMessage,
  chatRef,
  inputRef
}) {
  return (
    <div className="h-screen flex bg-gray-50 overflow-hidden">
      {/* Sidebar */}
      <Sidebar
        rooms={rooms}
        activeRoom={activeRoom}
        isSidebarOpen={isSidebarOpen}
        onRoomSelect={onRoomSelect}
        onClose={() => setIsSidebarOpen(false)}
        onBackToHome={onBackToHome}
      />

      {/* Main Chat Area */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Chat Header */}
        <ChatHeader
          activeRoom={activeRoom}
          isConnected={isConnected}
          onlineCount={onlineCount}
          onToggleSidebar={() => setIsSidebarOpen(!isSidebarOpen)}
        />

        {/* Messages Area */}
        <div ref={chatRef} className="flex-1 overflow-y-auto p-5">
          {messages.length === 0 ? (
            <EmptyState activeRoom={activeRoom} />
          ) : (
            messages.map((msg, i) => {
              const showAvatar = i === 0 || messages[i - 1]?.userId !== msg.userId;
              return (
                <MessageBubble
                  key={i}
                  message={msg}
                  currentUserId={currentUser?.id}
                  showAvatar={showAvatar}
                />
              );
            })
          )}
        </div>

        {/* Input Area */}
        <MessageInput
          input={input}
          setInput={setInput}
          onSend={onSendMessage}
          isConnected={isConnected}
          activeRoom={activeRoom}
          inputRef={inputRef}
        />
      </div>
    </div>
  );
}