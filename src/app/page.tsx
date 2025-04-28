"use client";

import { AuthModal } from "@/components/AuthModal";
import { Button } from "@/components/Button";
import { authClient } from "@/lib/auth/client";
import Link from "next/link";
import { useEffect, useState } from "react";

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

  return (
    <div className="grid min-h-screen grid-rows-[20px_1fr_20px] items-center justify-items-center gap-16 p-8 pb-20 font-[family-name:var(--font-geist-sans)] sm:p-20">
      <nav className="fixed top-0 right-0 p-4 flex gap-4">
        {isLoading ? (
          <div className="h-10 w-20 animate-pulse bg-gray-200 rounded-full"></div>
        ) : session ? (
          <div className="flex gap-4">
            <Link
              href="/account"
              className="flex h-10 items-center justify-center rounded-full border border-solid border-black/[.08] px-4 text-sm font-medium transition-colors hover:border-transparent hover:bg-[#f2f2f2] dark:border-white/[.145] dark:hover:bg-[#1a1a1a] cursor-pointer"
            >
              Account
            </Link>
            <Button onClick={handleSignOut}>
              Sign out
            </Button>
          </div>
        ) : (
          <>
            <Button
              variant="outline"
              onClick={() => setModalState({ isOpen: true, mode: "login" })}
            >
              Login
            </Button>
            <Button
              onClick={() => setModalState({ isOpen: true, mode: "signup" })}
            >
              Sign up
            </Button>
          </>
        )}
      </nav>
      <AuthModal
        isOpen={modalState.isOpen}
        mode={modalState.mode}
        onClose={() => setModalState({ ...modalState, isOpen: false })}
      />
      <main className="row-start-2 flex flex-col items-center gap-[32px] sm:items-start">
        <div className="flex flex-col items-center gap-4">
          {isLoading ? (
            <div className="h-10 w-20 animate-pulse bg-gray-200 rounded-full"></div>
          ) : (
            <div className="flex gap-4">
              <div>Session: {session ? JSON.stringify(session, null, 2) : "null"}</div>
              {session && (
                <Link
                  href="/account"
                  className="flex h-10 items-center justify-center rounded-full border border-solid border-black/[.08] px-4 text-sm font-medium transition-colors hover:border-transparent hover:bg-[#f2f2f2] dark:border-white/[.145] dark:hover:bg-[#1a1a1a] cursor-pointer"
                >
                  Account
                </Link>
              )}
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
