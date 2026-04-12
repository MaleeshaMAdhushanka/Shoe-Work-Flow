"use client";

import { Suspense, useState, useEffect } from "react";
import Login from "./ui/login-form";
import WelcomeScreen from "./ui/welcome-screen";

export default function Home() {
  const [showLogin, setShowLogin] = useState(false);
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  if (!isMounted) {
    return null;
  }

  return (
    <main>
      {!showLogin ? (
        <WelcomeScreen onComplete={() => setShowLogin(true)} />
      ) : (
        <Suspense fallback={<div className="min-h-screen" />}>
          <Login />
        </Suspense>
      )}
    </main>
  );
}
