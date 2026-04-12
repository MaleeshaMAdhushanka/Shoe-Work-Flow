"use client";

import { useEffect, useState } from "react";
import { Zap } from "lucide-react";

interface WelcomeScreenProps {
  onComplete: () => void;
}

export default function WelcomeScreen({ onComplete }: WelcomeScreenProps) {
  const [isLoading, setIsLoading] = useState(true);
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  useEffect(() => {
    if (!isMounted) return;
    
    // Auto-redirect after 3.5 seconds
    const timer = setTimeout(() => {
      setIsLoading(false);
      setTimeout(onComplete, 500); // Wait for fade out animation
    }, 3500);

    return () => clearTimeout(timer);
  }, [isMounted, onComplete]);

  if (!isMounted) {
    return null;
  }

  return (
    <div
      className={`min-h-screen bg-gradient-to-br from-purple-100 via-blue-50 to-white flex flex-col items-center justify-center transition-opacity duration-500 ${
        isLoading ? "opacity-100" : "opacity-0"
      }`}
    >
      {/* Main Content */}
      <div className="text-center">
        {/* Animated Icon */}
        <div className="flex justify-center mb-8 animate-bounce">
          <div className="relative w-20 h-20 bg-gradient-to-br from-purple-300 to-blue-300 rounded-lg flex items-center justify-center shadow-lg">
            <Zap className="w-10 h-10 text-white" />
          </div>
        </div>

        {/* Welcome Text */}
        <h1 className="text-5xl md:text-6xl font-bold bg-gradient-to-r from-purple-600 via-blue-600 to-purple-600 bg-clip-text text-transparent mb-6">
          Welcome to StepUp
        </h1>

        <p className="text-lg md:text-xl text-gray-600 mb-12 max-w-md mx-auto">
          Premium Shoe Store Management System
        </p>

        {/* Loading Dots */}
        <div className="flex justify-center gap-2 mb-8">
          <div className="w-3 h-3 bg-purple-400 rounded-full animate-bounce" style={{ animationDelay: "0s" }}></div>
          <div className="w-3 h-3 bg-blue-400 rounded-full animate-bounce" style={{ animationDelay: "0.2s" }}></div>
          <div className="w-3 h-3 bg-purple-300 rounded-full animate-bounce" style={{ animationDelay: "0.4s" }}></div>
        </div>

        {/* Loading Text */}
        <p className="text-sm text-gray-500">Loading system...</p>
      </div>

      {/* Decorative circles */}
      <div className="absolute top-10 left-10 w-24 h-24 bg-purple-200 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-pulse"></div>
      <div className="absolute bottom-10 right-10 w-32 h-32 bg-blue-200 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-pulse"></div>
      <div className="absolute top-1/2 right-20 w-28 h-28 bg-pink-100 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-pulse"></div>
    </div>
  );
}
