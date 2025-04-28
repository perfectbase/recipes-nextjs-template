"use client";

import { useEffect, useState } from "react";
import { authClient } from "@/lib/auth/client";
import { AuthModal } from "@/components/auth/AuthModal";
import CircularProgress from "@/components/base/CircularProgress";
import { Container } from "@/components/base/Container";
import { Navbar } from "@/components/Navbar";

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
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const checkSession = async () => {
      try {
        const result = await authClient.getSession();
        setSession(result.data);
        setError(null);
      } catch (error) {
        console.error("Error checking session:", error);
        setSession(null);
        setError("Failed to check authentication status");
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
      setError(null);
    } catch (error) {
      console.error("Error signing out:", error);
      setError("Failed to sign out");
    }
  };

  const handleAuthSuccess = (sessionData: any) => {
    setSession(sessionData);
    setError(null);
  };

  const handleOpenModal = (mode: "login" | "signup") => {
    setModalState({ isOpen: true, mode });
  };

  return (
    <Container>
      <Navbar
        isLoading={isLoading}
        session={session}
        onSignOut={handleSignOut}
        onOpenModal={handleOpenModal}
      />
      <main className="row-start-2 flex flex-col items-center gap-[32px] sm:items-start">
        {isLoading ? (
          <CircularProgress />
        ) : error ? (
          <p className="text-3xl font-medium text-red-500">{error}</p>
        ) : (
          <p className="text-3xl font-medium">
            {`Home | You are${session ? " " : " not "}logged in`}
          </p>
        )}
      </main>
      <AuthModal
        isOpen={modalState.isOpen}
        mode={modalState.mode}
        onClose={() => setModalState({ ...modalState, isOpen: false })}
        onSuccess={handleAuthSuccess}
      />
    </Container>
  );
}
