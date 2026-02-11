import React from "react";

export default function MessageInput({ 
  input, 
  setInput, 
  onSend, 
  isConnected, 
  activeRoom,
  inputRef 
}) {
  const handleKeyPress = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      onSend();
    }
  };

  return (
    <div className="bg-white border-t border-gray-200 px-5 py-4">
      <div className="flex items-center gap-3 bg-gray-100 rounded-full px-4 py-2">
        <button className="w-9 h-9 rounded-full hover:bg-gray-200 flex items-center justify-center text-gray-600 transition-colors flex-shrink-0">
          <svg className="w-6 h-6" viewBox="0 0 24 24" fill="currentColor">
            <path d="M19 13H13V19H11V13H5V11H11V5H13V11H19V13Z"/>
          </svg>
        </button>
        
        <input
          ref={inputRef}
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyPress={handleKeyPress}
          placeholder={`Message ${activeRoom?.name}...`}
          disabled={!isConnected}
          className="flex-1 bg-transparent border-none outline-none text-sm text-gray-900 placeholder-gray-500"
        />
        
        <button className="w-9 h-9 rounded-full hover:bg-gray-200 flex items-center justify-center text-gray-600 transition-colors flex-shrink-0">
          <svg className="w-6 h-6" viewBox="0 0 24 24" fill="currentColor">
            <path d="M11.99 2C6.47 2 2 6.48 2 12C2 17.52 6.47 22 11.99 22C17.52 22 22 17.52 22 12C22 6.48 17.52 2 11.99 2ZM12 20C7.58 20 4 16.42 4 12C4 7.58 7.58 4 12 4C16.42 4 20 7.58 20 12C20 16.42 16.42 20 12 20ZM15.5 11C16.33 11 17 10.33 17 9.5C17 8.67 16.33 8 15.5 8C14.67 8 14 8.67 14 9.5C14 10.33 14.67 11 15.5 11ZM8.5 11C9.33 11 10 10.33 10 9.5C10 8.67 9.33 8 8.5 8C7.67 8 7 8.67 7 9.5C7 10.33 7.67 11 8.5 11ZM12 17.5C14.33 17.5 16.31 16.04 17.11 14H6.89C7.69 16.04 9.67 17.5 12 17.5Z"/>
          </svg>
        </button>
        
        <button
          onClick={onSend}
          disabled={!isConnected || !input.trim()}
          className="w-11 h-11 rounded-full flex items-center justify-center shadow-md transition-all duration-200 hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed flex-shrink-0"
          style={{
            background: isConnected ? `linear-gradient(135deg, ${activeRoom?.color} 0%, ${activeRoom?.color}dd 100%)` : '#ccc',
          }}
        >
          <svg className="w-6 h-6" viewBox="0 0 24 24" fill="white">
            <path d="M2.01 21L23 12L2.01 3L2 10L17 12L2 14L2.01 21Z"/>
          </svg>
        </button>
      </div>
    </div>
  );
}