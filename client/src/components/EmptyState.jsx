import React from "react";

export default function EmptyState({ activeRoom }) {
  return (
    <div className="h-full flex flex-col items-center justify-center text-center p-10">
      <div 
        className="w-32 h-32 rounded-3xl flex items-center justify-center mb-6"
        style={{
          background: `linear-gradient(135deg, ${activeRoom?.color}20 0%, ${activeRoom?.color}10 100%)`,
        }}
      >
        <span className="text-5xl">{activeRoom?.emoji}</span>
      </div>
      <h3 className="text-2xl font-bold text-gray-900 mb-2">
        Welcome to {activeRoom?.name}
      </h3>
      <p className="text-gray-600 mb-2">
        {activeRoom?.description}
      </p>
      <p className="text-sm text-gray-500">
        Be the first to send a message!
      </p>
    </div>
  );
}