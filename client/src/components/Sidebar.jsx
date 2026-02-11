import React from "react";

export default function Sidebar({ 
  rooms, 
  activeRoom, 
  isSidebarOpen, 
  onRoomSelect, 
  onClose,
  onBackToHome 
}) {
  return (
    <>
      {/* Sidebar Overlay for Mobile */}
      {isSidebarOpen && (
        <div 
          className="fixed inset-0 bg-black/50 z-40 lg:hidden"
          onClick={onClose}
        />
      )}

      {/* Sidebar */}
      <div 
        className={`
          fixed lg:relative inset-y-0 left-0 z-50
          w-72 bg-white border-r border-gray-200
          flex flex-col
          transform transition-transform duration-300 ease-in-out
          ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
        `}
      >
        {/* Sidebar Header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-gray-200">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center shadow-md">
              <svg className="w-6 h-6" viewBox="0 0 24 24" fill="white">
                <path d="M20 2H4C2.9 2 2 2.9 2 4V22L6 18H20C21.1 18 22 17.1 22 16V4C22 2.9 21.1 2 20 2ZM20 16H6L4 18V4H20V16Z"/>
              </svg>
            </div>
            <span className="text-lg font-bold text-gray-900">My Rooms</span>
          </div>
          <button
            onClick={onClose}
            className="lg:hidden w-9 h-9 rounded-lg bg-gray-100 hover:bg-gray-200 flex items-center justify-center text-gray-600 transition-colors"
          >
            <svg className="w-6 h-6" viewBox="0 0 24 24" fill="currentColor">
              <path d="M19 6.41L17.59 5L12 10.59L6.41 5L5 6.41L10.59 12L5 17.59L6.41 19L12 13.41L17.59 19L19 17.59L13.41 12L19 6.41Z"/>
            </svg>
          </button>
        </div>

        {/* Rooms List */}
        <div className="flex-1 overflow-y-auto py-2">
          {rooms.map((room) => (
            <div
              key={room.id}
              onClick={() => onRoomSelect(room)}
              className={`
                flex items-center gap-3 px-5 py-3 cursor-pointer
                transition-all duration-200
                hover:bg-gray-50
                ${activeRoom?.id === room.id ? 'border-l-4' : 'border-l-4 border-transparent'}
              `}
              style={{
                backgroundColor: activeRoom?.id === room.id ? `${room.color}10` : 'transparent',
                borderLeftColor: activeRoom?.id === room.id ? room.color : 'transparent',
              }}
            >
              <div 
                className="w-11 h-11 rounded-xl flex items-center justify-center text-xl shadow-sm flex-shrink-0"
                style={{
                  background: `linear-gradient(135deg, ${room.color} 0%, ${room.color}dd 100%)`,
                }}
              >
                {room.emoji}
              </div>
              <div className="flex-1 min-w-0">
                <div className="font-semibold text-gray-900 text-sm truncate">
                  {room.name}
                </div>
                <div className="flex items-center gap-1.5 text-xs text-gray-600 mt-0.5">
                  <div className="w-1.5 h-1.5 rounded-full bg-emerald-500"></div>
                  <span>{room.online} online</span>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Sidebar Footer */}
        <div className="p-5 border-t border-gray-200">
          <button
            onClick={onBackToHome}
            className="w-full px-4 py-3 rounded-xl bg-gray-100 hover:bg-gray-200 text-gray-700 font-semibold text-sm flex items-center justify-center gap-2 transition-colors"
          >
            <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
              <path d="M10 20V14H14V20H19V12H22L12 3L2 12H5V20H10Z"/>
            </svg>
            <span>Back to Home</span>
          </button>
        </div>
      </div>
    </>
  );
}