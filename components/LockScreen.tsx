
import React, { useState, useEffect } from 'react';

interface LockScreenProps {
  onUnlock: () => void;
}

const LockScreen: React.FC<LockScreenProps> = ({ onUnlock }) => {
  const [currentTime, setCurrentTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  const formatTime = (date: Date) => {
    const hours = date.getHours().toString().padStart(2, '0');
    const minutes = date.getMinutes().toString().padStart(2, '0');
    return `${hours}:${minutes}`;
  };

  const formatDate = (date: Date) => {
    return date.toLocaleDateString('en-US', {
      month: 'long',
      day: 'numeric',
      year: 'numeric',
    });
  };

  const formatDay = (date: Date) => {
    return date.toLocaleDateString('en-US', { weekday: 'long' }).toUpperCase();
  };

  return (
    <div className="fixed inset-0 z-[100] bg-yellow-400 flex flex-col items-center justify-center p-4 overflow-hidden">
      {/* Background Halftone Pattern */}
      <div className="absolute inset-0 opacity-20 pointer-events-none halftone"></div>
      
      {/* Sunburst effect behind clock */}
      <div className="absolute w-[150%] h-[150%] bg-[radial-gradient(circle,_#fbbf24_20%,_transparent_20%)] bg-[length:40px_40px] animate-pulse"></div>

      {/* Main Content Card */}
      <div className="relative z-10 flex flex-col items-center space-y-8 max-w-2xl w-full text-center">
        
        {/* Day Header */}
        <div className="bg-black text-white px-6 py-2 transform -rotate-2 comic-border">
          <h2 className="comic-text text-3xl md:text-5xl">{formatDay(currentTime)}</h2>
        </div>

        {/* Big Clock */}
        <div className="bg-white comic-border p-8 md:p-12 transform rotate-1 shadow-[12px_12px_0px_0px_rgba(0,0,0,1)]">
          <h1 className="comic-text text-8xl md:text-[12rem] leading-none text-black selection:bg-yellow-200">
            {formatTime(currentTime)}
          </h1>
        </div>

        {/* Date Panel */}
        <div className="bg-red-600 text-white px-8 py-4 comic-border transform rotate-2 shadow-[8px_8px_0px_0px_rgba(0,0,0,1)]">
          <h3 className="marker-text text-2xl md:text-4xl">
            {formatDate(currentTime)}
          </h3>
        </div>

        {/* Unlock Button */}
        <button
          onClick={onUnlock}
          className="mt-12 bg-black text-white px-12 py-6 comic-text text-3xl md:text-5xl hover:bg-gray-800 active:scale-95 transition-all comic-border animate-bounce"
        >
          ENTER STUDIO!
        </button>

        <p className="marker-text text-xl text-black mt-4">
          CAPTAIN SYNTAX IS WAITING...
        </p>
      </div>

      {/* Floating Action Elements for flavor */}
      <div className="absolute top-10 left-10 comic-text text-4xl text-blue-600 transform -rotate-12 opacity-50">POW!</div>
      <div className="absolute bottom-20 right-10 comic-text text-4xl text-red-600 transform rotate-12 opacity-50">BAM!</div>
      <div className="absolute top-1/4 right-20 comic-text text-4xl text-green-600 transform rotate-45 opacity-50">WHAM!</div>
    </div>
  );
};

export default LockScreen;
