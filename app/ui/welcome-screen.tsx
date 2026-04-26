"use client";

import { useEffect, useState } from "react";
import LoadingShoe from "./loading-shoe";

interface WelcomeScreenProps {
  onComplete: () => void;
}

export default function WelcomeScreen({ onComplete }: WelcomeScreenProps) {
  const [isLoading, setIsLoading] = useState(true);
  const [isMounted, setIsMounted] = useState(false);
  const [showWelcome, setShowWelcome] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  useEffect(() => {
    if (!isMounted) return;

    // First, show loading screen for 3.5 seconds
    const loadingTimer = setTimeout(() => {
      setIsLoading(false);
      setShowWelcome(true);
    }, 3500);

    return () => clearTimeout(loadingTimer);
  }, [isMounted]);

  // Create animations when welcome screen appears
  useEffect(() => {
    if (!showWelcome) return;

    // Create a style tag for animations
    const style = document.createElement("style");
    style.textContent = `
      @keyframes fadeInScale {
        0% {
          opacity: 0;
          transform: scale(0.8);
        }
        100% {
          opacity: 1;
          transform: scale(1);
        }
      }
      
      @keyframes fadeIn {
        0% {
          opacity: 0;
        }
        100% {
          opacity: 1;
        }
      }
      
      .animate-welcome-title {
        animation: fadeInScale 1s cubic-bezier(0.68, -0.55, 0.265, 1.55) forwards;
      }
      
      .animate-welcome-subtitle {
        animation: fadeIn 1.5s ease-out 0.5s forwards;
      }
      
      .animate-fade-out {
        animation: fadeOut 0.5s ease-in forwards;
      }
      
      @keyframes fadeOut {
        0% {
          opacity: 1;
        }
        100% {
          opacity: 0;
        }
      }
    `;
    document.head.appendChild(style);

    // Auto-redirect after 5 seconds on welcome screen
    const redirectTimer = setTimeout(() => {
      const container = document.querySelector(".welcome-container");
      if (container) {
        container.classList.add("animate-fade-out");
      }

      setTimeout(onComplete, 500);
    }, 5000);

    return () => {
      clearTimeout(redirectTimer);
      document.head.removeChild(style);
    };
  }, [showWelcome, onComplete]);

  if (!isMounted) {
    return null;
  }

  // Show loading screen first
  if (isLoading) {
    return <LoadingShoe />;
  }

  // Show welcome screen after loading
  return (
    <div className="welcome-container min-h-screen bg-gradient-to-br from-slate-950 via-blue-950 to-slate-900 flex flex-col items-center justify-center transition-opacity duration-500 relative overflow-hidden">
      {/* Animated background gradient circles */}
      <div className="absolute top-20 right-20 w-96 h-96 bg-blue-600 rounded-full mix-blend-screen filter blur-3xl opacity-20 animate-pulse"></div>
      <div className="absolute bottom-20 left-20 w-96 h-96 bg-cyan-600 rounded-full mix-blend-screen filter blur-3xl opacity-15 animate-pulse" style={{animationDelay: '0.5s'}}></div>
      <div className="absolute top-1/3 right-1/4 w-72 h-72 bg-indigo-600 rounded-full mix-blend-screen filter blur-3xl opacity-10 animate-pulse" style={{animationDelay: '1s'}}></div>

      {/* Main Content */}
      <div className="text-center z-10 px-4">


        {/* Welcome Title with Animation */}
        <h1 className="animate-welcome-title text-5xl md:text-7xl font-bold bg-gradient-to-r from-cyan-400 via-blue-400 to-cyan-400 bg-clip-text text-transparent mb-4 drop-shadow-lg">
          Welcome to StepUp
        </h1>

        {/* Subtitle with Animation */}
        <p className="animate-welcome-subtitle text-lg md:text-xl text-cyan-100/70 mb-16 max-w-xl mx-auto opacity-0 tracking-wide leading-relaxed">
          Premium Shoe Store Management System
        </p>

        {/* Feature highlights */}
        <div className="animate-welcome-subtitle grid grid-cols-3 gap-4 max-w-2xl mx-auto opacity-0" style={{animationDelay: '0.8s'}}>
          <div className="bg-gradient-to-br from-cyan-500/10 to-blue-500/10 rounded-lg p-4 border border-cyan-500/20 backdrop-blur-sm hover:border-cyan-500/40 transition-colors">
            <p className="text-cyan-400 font-semibold text-sm">⚡ Fast</p>
            <p className="text-cyan-100/60 text-xs mt-1">Quick & Responsive</p>
          </div>
          <div className="bg-gradient-to-br from-blue-500/10 to-cyan-500/10 rounded-lg p-4 border border-blue-500/20 backdrop-blur-sm hover:border-blue-500/40 transition-colors">
            <p className="text-blue-400 font-semibold text-sm">🔒 Secure</p>
            <p className="text-blue-100/60 text-xs mt-1">Your Data Safe</p>
          </div>
          <div className="bg-gradient-to-br from-cyan-500/10 to-blue-500/10 rounded-lg p-4 border border-cyan-500/20 backdrop-blur-sm hover:border-cyan-500/40 transition-colors">
            <p className="text-cyan-400 font-semibold text-sm">📊 Smart</p>
            <p className="text-cyan-100/60 text-xs mt-1">Smart Analytics</p>
          </div>
        </div>
      </div>
    </div>
  );
}
