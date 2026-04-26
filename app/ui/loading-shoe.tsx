"use client";

import Image from "next/image";
import { useEffect, useState } from "react";

// Loading Shoe Component - Timeline Animation with Timer
// Beautiful timeline loading with default3.jpg shoe image
// Dark blue gradient background with smooth animations and timer
export default function LoadingShoe() {
  const [elapsed, setElapsed] = useState(0);
  const totalLoadTime = 3.5; // Total loading time in seconds

  // Add CSS animations when component loads
  useEffect(() => {
    // Create a style tag with animations
    const style = document.createElement("style");
    style.textContent = `
      /* Shoe float animation */
      @keyframes floatShoe {
        0%, 100% {
          transform: translateY(0px) scale(0.9);
          opacity: 0.7;
        }
        50% {
          transform: translateY(-20px) scale(1);
          opacity: 1;
        }
      }
      
      /* Timeline circle fill animation */
      @keyframes fillCircle {
        0% {
          stroke-dashoffset: 251;
        }
        100% {
          stroke-dashoffset: 0;
        }
      }
      
      /* Timeline dot pulse */
      @keyframes pulseDot {
        0%, 100% {
          r: 10;
          opacity: 1;
        }
        50% {
          r: 15;
          opacity: 0.6;
        }
      }
      
      /* Loading text animation */
      @keyframes fadeInOut {
        0%, 100% {
          opacity: 0.5;
        }
        50% {
          opacity: 1;
        }
      }
      
      /* Glow effect animation */
      @keyframes glowPulse {
        0%, 100% {
          filter: drop-shadow(0 0 20px rgba(59, 130, 246, 0.4));
        }
        50% {
          filter: drop-shadow(0 0 40px rgba(59, 130, 246, 0.8));
        }
      }
      
      .float-shoe {
        animation: floatShoe 3s ease-in-out infinite;
      }
      
      .glow-effect {
        animation: glowPulse 2s ease-in-out infinite;
      }
      
      .timeline-circle {
        animation: fillCircle 2s ease-in-out infinite;
        stroke-dasharray: 251;
      }
      
      .timeline-dot {
        animation: pulseDot 2s ease-in-out infinite;
      }
      
      .loading-text {
        animation: fadeInOut 2s ease-in-out infinite;
      }
    `;
    document.head.appendChild(style);

    // Update timer every 100ms
    const timerInterval = setInterval(() => {
      setElapsed((prev) => {
        if (prev >= totalLoadTime) {
          clearInterval(timerInterval);
          return totalLoadTime;
        }
        return prev + 0.1;
      });
    }, 100);

    // Clean up when component is removed
    return () => {
      clearInterval(timerInterval);
      document.head.removeChild(style);
    };
  }, []);

  // Calculate percentage
  const percentage = Math.min((elapsed / totalLoadTime) * 100, 100).toFixed(0);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-blue-950 to-slate-900 flex flex-col items-center justify-center relative overflow-hidden">
      {/* Animated background gradient circles */}
      <div className="absolute top-20 right-20 w-96 h-96 bg-blue-600 rounded-full mix-blend-screen filter blur-3xl opacity-20 animate-pulse"></div>
      <div className="absolute bottom-20 left-20 w-96 h-96 bg-cyan-600 rounded-full mix-blend-screen filter blur-3xl opacity-15 animate-pulse"></div>
      <div className="absolute top-1/2 left-1/3 w-72 h-72 bg-indigo-600 rounded-full mix-blend-screen filter blur-3xl opacity-10 animate-pulse" style={{animationDelay: '1s'}}></div>

      {/* Main content container */}
      <div className="text-center z-10">
        {/* Title */}
        <h1 className="text-5xl md:text-7xl font-bold bg-gradient-to-r from-cyan-400 via-blue-400 to-cyan-400 bg-clip-text text-transparent mb-4 drop-shadow-lg">
          StepUp
        </h1>

        {/* Subtitle */}
        <p className="text-lg md:text-xl text-cyan-100/80 mb-16 tracking-wide">
          Premium Shoe Store Management System
        </p>

        {/* Timeline Container */}
        <div className="relative flex flex-col items-center gap-12 mb-8">
          {/* Central Shoe Image with Glow */}
          <div>
            <div className="relative w-64 h-64 flex items-center justify-center">
              {/* Glowing background circle */}
              <div className="absolute inset-0 bg-gradient-to-r from-blue-400 to-cyan-400 rounded-full filter blur-2xl opacity-30 animate-pulse"></div>
              
              {/* Shoe image */}
              <Image
                src="/default4.jpeg"
                alt="Loading shoe"
                width={240}
                height={240}
                className="object-contain drop-shadow-2xl relative z-10 w-auto h-auto opacity-5"
                priority
              />
            </div>
          </div>

          {/* SVG Timeline */}
          <svg className="w-48 h-48 absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2" viewBox="0 0 200 200">
            {/* Outer circle animation */}
            <circle
              cx="100"
              cy="100"
              r="80"
              fill="none"
              stroke="url(#gradient)"
              strokeWidth="2"
              className="timeline-circle opacity-40"
            />
            
            {/* Middle circle */}
            <circle
              cx="100"
              cy="100"
              r="60"
              fill="none"
              stroke="rgba(59, 130, 246, 0.3)"
              strokeWidth="1"
              strokeDasharray="8,4"
            />
            
            {/* Center dot */}
            <circle
              cx="100"
              cy="100"
              r="10"
              fill="#3b82f6"
              className="timeline-dot"
            />
            
            {/* Top dot */}
            <circle cx="100" cy="20" r="6" fill="#06b6d4" opacity="0.6" />
            
            {/* Right dot */}
            <circle cx="180" cy="100" r="6" fill="#06b6d4" opacity="0.6" />
            
            {/* Bottom dot */}
            <circle cx="100" cy="180" r="6" fill="#06b6d4" opacity="0.6" />
            
            {/* Left dot */}
            <circle cx="20" cy="100" r="6" fill="#06b6d4" opacity="0.6" />
            
            {/* Gradient definition */}
            <defs>
              <linearGradient id="gradient" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" style={{ stopColor: '#3b82f6', stopOpacity: 1 }} />
                <stop offset="100%" style={{ stopColor: '#06b6d4', stopOpacity: 1 }} />
              </linearGradient>
            </defs>
          </svg>
        </div>

        {/* Loading stages */}
        <div className="flex justify-center gap-6 mb-12">
          <div className="flex flex-col items-center">
            <div className="w-3 h-3 bg-cyan-400 rounded-full mb-2 animate-pulse shadow-lg shadow-cyan-400/50"></div>
            <p className="text-sm text-cyan-300/80">Initializing</p>
          </div>
          <div className="w-8 h-0.5 bg-gradient-to-r from-cyan-400 to-blue-400 mt-4"></div>
          <div className="flex flex-col items-center">
            <div className="w-3 h-3 bg-blue-400 rounded-full mb-2 animate-pulse shadow-lg shadow-blue-400/50" style={{ animationDelay: '0.3s' }}></div>
            <p className="text-sm text-blue-300/80">Processing</p>
          </div>
          <div className="w-8 h-0.5 bg-gradient-to-r from-blue-400 to-cyan-400 mt-4"></div>
          <div className="flex flex-col items-center">
            <div className="w-3 h-3 bg-cyan-400 rounded-full mb-2 animate-pulse shadow-lg shadow-cyan-400/50" style={{ animationDelay: '0.6s' }}></div>
            <p className="text-sm text-cyan-300/80">Finalizing</p>
          </div>
        </div>

        {/* Loading text */}
        <div className="loading-text">
          <p className="text-cyan-100 text-sm font-semibold tracking-wider">
            Loading Your Shoe Store...
          </p>
        </div>

        {/* Timer Display */}
        <div className="mt-8 flex justify-center gap-8 px-8">
          <div className="text-center bg-gradient-to-br from-cyan-500/10 to-blue-500/10 rounded-lg p-4 border border-cyan-500/20 backdrop-blur-sm">
            <p className="text-cyan-400 text-xs font-mono mb-2 uppercase tracking-widest">Elapsed</p>
            <p className="text-3xl font-bold text-cyan-300 font-mono">
              {elapsed.toFixed(1)}s
            </p>
          </div>
          <div className="w-0.5 bg-gradient-to-b from-cyan-400 to-blue-400 opacity-50"></div>
          <div className="text-center bg-gradient-to-br from-blue-500/10 to-cyan-500/10 rounded-lg p-4 border border-blue-500/20 backdrop-blur-sm">
            <p className="text-blue-400 text-xs font-mono mb-2 uppercase tracking-widest">Progress</p>
            <p className="text-3xl font-bold text-blue-300 font-mono">
              {percentage}%
            </p>
          </div>
        </div>

        {/* Percentage bar */}
        <div className="mt-8 px-8 w-full max-w-md mx-auto">
          <div className="bg-slate-800/50 rounded-full p-1 border border-cyan-500/30">
            <div className="bg-gradient-to-r from-cyan-500 to-blue-500 rounded-full h-2 transition-all duration-300" style={{width: `${percentage}%`}}></div>
          </div>
          <p className="text-cyan-400/70 text-xs mt-3 font-mono text-center">
            {Array(Math.floor(percentage / 10)).fill('█').join('')}{Array(10 - Math.floor(percentage / 10)).fill('░').join('')}
          </p>
        </div>
      </div>
    </div>
  );
}
