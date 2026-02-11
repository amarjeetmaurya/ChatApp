import React from "react";

export default function ChatHeader({ 
  activeRoom, 
  isConnected, 
  onlineCount, 
  onToggleSidebar 
}) {
  return (
    <div className="bg-white border-b border-gray-200 px-5 py-3 flex items-center justify-between shadow-sm">
      <div className="flex items-center gap-3 flex-1 min-w-0">
        {/* Hamburger Menu */}
        <button
          onClick={onToggleSidebar}
          className="lg:hidden w-10 h-10 rounded-xl bg-gray-100 hover:bg-gray-200 flex items-center justify-center text-gray-600 transition-colors flex-shrink-0"
        >
          <svg className="w-6 h-6" viewBox="0 0 24 24" fill="currentColor">
            <path d="M3 18H21V16H3V18ZM3 13H21V11H3V13ZM3 6V8H21V6H3Z"/>
          </svg>
        </button>

        {/* Room Icon */}
        <div 
          className="w-12 h-12 rounded-xl flex items-center justify-center text-2xl shadow-md flex-shrink-0"
          style={{
            background: `linear-gradient(135deg, ${activeRoom?.color} 0%, ${activeRoom?.color}dd 100%)`,
          }}
        >
          {activeRoom?.emoji}
        </div>

        {/* Room Info */}
        <div className="flex-1 min-w-0">
          <h2 className="text-lg font-bold text-gray-900 truncate">
            {activeRoom?.name}
          </h2>
          <p className="text-xs text-gray-600 flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
            {isConnected ? `${onlineCount || activeRoom?.online || 0} online` : "Connecting..."}
          </p>
        </div>
      </div>

      {/* Header Actions */}
      <div className="flex items-center gap-2 flex-shrink-0">
        <button className="w-10 h-10 rounded-xl bg-gray-100 hover:bg-gray-200 flex items-center justify-center text-gray-600 transition-colors">
          <svg className="w-6 h-6" viewBox="0 0 24 24" fill="currentColor">
            <path d="M15.5 14H14.71L14.43 13.73C15.41 12.59 16 11.11 16 9.5C16 5.91 13.09 3 9.5 3C5.91 3 3 5.91 3 9.5C3 13.09 5.91 16 9.5 16C11.11 16 12.59 15.41 13.73 14.43L14 14.71V15.5L19 20.49L20.49 19L15.5 14ZM9.5 14C7.01 14 5 11.99 5 9.5C5 7.01 7.01 5 9.5 5C11.99 5 14 7.01 14 9.5C14 11.99 11.99 14 9.5 14Z"/>
          </svg>
        </button>
        <button className="w-10 h-10 rounded-xl bg-gray-100 hover:bg-gray-200 flex items-center justify-center text-gray-600 transition-colors">
          <svg className="w-6 h-6" viewBox="0 0 24 24" fill="currentColor">
            <path d="M12 8C13.1 8 14 7.1 14 6C14 4.9 13.1 4 12 4C10.9 4 10 4.9 10 6C10 7.1 10.9 8 12 8ZM12 10C10.9 10 10 10.9 10 12C10 13.1 10.9 14 12 14C13.1 14 14 13.1 14 12C14 10.9 13.1 10 12 10ZM12 16C10.9 16 10 16.9 10 18C10 19.1 10.9 20 12 20C13.1 20 14 19.1 14 18C14 16.9 13.1 16 12 16Z"/>
          </svg>
        </button>
      </div>
    </div>
  );
}