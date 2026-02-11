import React from "react";

export default function RoomCard({ room, onJoin }) {
  return (
    <div
      onClick={() => onJoin(room)}
      className="group bg-white rounded-2xl p-6 border-2 cursor-pointer transition-all duration-300 hover:-translate-y-1 hover:shadow-xl"
      style={{
        background: `linear-gradient(135deg, ${room.color}15 0%, ${room.color}05 100%)`,
        borderColor: `${room.color}30`,
      }}
    >
      {/* Top Section */}
      <div className="flex items-start justify-between mb-4">
        <div 
          className="w-14 h-14 rounded-2xl flex items-center justify-center text-3xl shadow-md"
          style={{
            background: `linear-gradient(135deg, ${room.color} 0%, ${room.color}dd 100%)`,
          }}
        >
          {room.emoji}
        </div>
        <div className="flex items-center gap-1.5 px-3 py-1.5 bg-emerald-50 rounded-xl">
          <div className="w-2 h-2 rounded-full bg-emerald-500"></div>
          <span className="text-xs font-semibold text-emerald-600">
            {room.online} online
          </span>
        </div>
      </div>

      {/* Room Info */}
      <h3 className="text-xl font-bold text-gray-900 mb-2">
        {room.name}
      </h3>
      <p className="text-sm text-gray-600 mb-5 line-clamp-2">
        {room.description}
      </p>

      {/* Footer */}
      <div className="flex items-center justify-between pt-4 border-t border-gray-200">
        <div className="flex items-center gap-1.5 text-sm text-gray-600">
          <svg className="w-4 h-4 opacity-60" viewBox="0 0 24 24" fill="currentColor">
            <path d="M16 11C17.66 11 18.99 9.66 18.99 8C18.99 6.34 17.66 5 16 5C14.34 5 13 6.34 13 8C13 9.66 14.34 11 16 11ZM8 11C9.66 11 10.99 9.66 10.99 8C10.99 6.34 9.66 5 8 5C6.34 5 5 6.34 5 8C5 9.66 6.34 11 8 11ZM8 13C5.67 13 1 14.17 1 16.5V19H15V16.5C15 14.17 10.33 13 8 13ZM16 13C15.71 13 15.38 13.02 15.03 13.05C16.19 13.89 17 15.02 17 16.5V19H23V16.5C23 14.17 18.33 13 16 13Z"/>
          </svg>
          <span className="font-medium">{room.members} members</span>
        </div>
        <button
          className="px-6 py-2.5 rounded-xl text-white font-semibold text-sm shadow-md transition-all duration-200 hover:scale-105 hover:shadow-lg"
          style={{ background: room.color }}
        >
          Join
        </button>
      </div>
    </div>
  );
}