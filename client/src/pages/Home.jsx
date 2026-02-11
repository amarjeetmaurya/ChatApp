import React from "react";
import RoomCard from "../components/RoomCard";

export default function Home({ rooms, currentUser, onJoinRoom }) {
  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-200">
      {/* Header */}
      <div className="sticky top-0 z-50 bg-white border-b border-gray-200 shadow-sm">
        <div className="px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center shadow-lg">
              <svg className="w-8 h-8" viewBox="0 0 24 24" fill="white">
                <path d="M20 2H4C2.9 2 2 2.9 2 4V22L6 18H20C21.1 18 22 17.1 22 16V4C22 2.9 21.1 2 20 2ZM20 16H6L4 18V4H20V16Z"/>
              </svg>
            </div>
            <h1 className="text-2xl font-bold bg-gradient-to-r from-indigo-500 to-purple-600 bg-clip-text text-transparent">
              ChatRooms
            </h1>
          </div>
          <div className="flex items-center gap-3 px-4 py-2 bg-gray-50 rounded-full">
            <div className="w-9 h-9 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-white font-semibold text-sm">
              {currentUser?.username?.charAt(0).toUpperCase()}
            </div>
            <span className="font-semibold text-gray-800 text-sm">
              {currentUser?.username}
            </span>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-7xl mx-auto px-6 py-10">
        {/* Welcome Section */}
        <div className="text-center mb-12">
          <h2 className="text-4xl font-extrabold text-gray-900 mb-3">
            Discover Rooms
          </h2>
          <p className="text-lg text-gray-600">
            Join a conversation and connect with others
          </p>
        </div>

        {/* Rooms Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {rooms.map((room) => (
            <RoomCard key={room.id} room={room} onJoin={onJoinRoom} />
          ))}
        </div>
      </div>
    </div>
  );
}