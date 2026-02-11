import React from "react";
import { formatTime } from "../utils/helpers";

export default function MessageBubble({ message, currentUserId, showAvatar }) {
  const isOwnMessage = message.userId === currentUserId;

  if (message.type === "system") {
    return (
      <div className="text-center py-2 px-4 my-2 text-xs text-gray-600 italic">
        {message.text}
      </div>
    );
  }

  return (
    <div 
      className={`flex items-end gap-2 ${isOwnMessage ? 'justify-end' : 'justify-start'} ${showAvatar ? 'mt-4' : 'mt-0.5'}`}
    >
      {!isOwnMessage && showAvatar && (
        <div className="w-10 h-10 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-white font-semibold text-sm flex-shrink-0">
          {message.username?.charAt(0).toUpperCase() || "U"}
        </div>
      )}
      {!isOwnMessage && !showAvatar && (
        <div className="w-10 flex-shrink-0"></div>
      )}
      
      <div 
        className={`max-w-[70%] ${isOwnMessage ? 'rounded-2xl rounded-br-sm' : 'rounded-2xl rounded-bl-sm'} px-4 py-2.5`}
        style={{
          background: isOwnMessage 
            ? 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)'
            : 'white',
          color: isOwnMessage ? 'white' : '#212529',
          boxShadow: !isOwnMessage ? '0 1px 2px rgba(0,0,0,0.08)' : 'none',
        }}
      >
        {!isOwnMessage && showAvatar && (
          <div className="text-xs font-semibold mb-1 text-indigo-600">
            {message.username}
          </div>
        )}
        <div className="text-sm leading-relaxed break-words mb-1">
          {message.message || message.text}
        </div>
        <div className={`text-[10px] text-right ${isOwnMessage ? 'text-white/70' : 'text-black/50'}`}>
          {formatTime(message.timestamp)}
        </div>
      </div>
    </div>
  );
}