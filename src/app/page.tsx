"use client";

import Image from "next/image";
import { AuthModal } from "@/components/AuthModal";
import { useState, useEffect } from "react";
import { authClient } from "@/lib/auth/client";

export default function Home() {
  const [modalState, setModalState] = useState<{
    isOpen: boolean;
    mode: "login" | "signup";
  }>({
    isOpen: false,
    mode: "login",
  });

  const [isLoading, setIsLoading] = useState(true);
  const [session, setSession] = useState<null | any>(null);

  useEffect(() => {
    const checkSession = async () => {
      console.log("Checking session...");
      try {
        const result = await authClient.getSession();
        console.log("Session result:", result);
        // Check if we have actual session data
        setSession(result.data);
      } catch (error) {
        console.error("Error checking session:", error);
        setSession(null);
      } finally {
        setIsLoading(false);
      }
    };

    checkSession();
  }, []);

  const handleSignOut = async () => {
    try {
      await authClient.signOut();
      setSession(null);
    } catch (error) {
      console.error("Error signing out:", error);
    }
  };

  console.log("Current state - isLoading:", isLoading, "session:", session);

  return (
    <div className="grid min-h-screen grid-rows-[20px_1fr_20px] items-center justify-items-center gap-16 p-8 pb-20 font-[family-name:var(--font-geist-sans)] sm:p-20">
      <AuthModal
        isOpen={modalState.isOpen}
        mode={modalState.mode}
        onClose={() => setModalState({ ...modalState, isOpen: false })}
      />
      <main className="row-start-2 flex flex-col items-center gap-[32px] sm:items-start">
        <div className="flex flex-col items-center gap-4 sm:flex-row">
          {isLoading ? (
            <div className="h-10 w-20 animate-pulse bg-gray-200 rounded-full"></div>
          ) : session ? (
            <button
              onClick={handleSignOut}
              className="bg-foreground text-background flex h-10 items-center justify-center rounded-full border border-solid border-transparent px-4 text-sm font-medium transition-colors hover:bg-[#383838] dark:hover:bg-[#ccc] cursor-pointer"
            >
              Sign out
            </button>
          ) : (
            <>
              <button
                onClick={() => setModalState({ isOpen: true, mode: "login" })}
                className="flex h-10 items-center justify-center rounded-full border border-solid border-black/[.08] px-4 text-sm font-medium transition-colors hover:border-transparent hover:bg-[#f2f2f2] dark:border-white/[.145] dark:hover:bg-[#1a1a1a] cursor-pointer"
              >
                Login
              </button>
              <button
                onClick={() => setModalState({ isOpen: true, mode: "signup" })}
                className="bg-foreground text-background flex h-10 items-center justify-center rounded-full border border-solid border-transparent px-4 text-sm font-medium transition-colors hover:bg-[#383838] dark:hover:bg-[#ccc] cursor-pointer"
              >
                Sign up
              </button>
            </>
          )}
        </div>
      </main>
    </div>
  );
}
