"use client";

import { useEffect, useState } from "react";
import { authClient } from "@/lib/auth/client";
import type { Session, User } from "@/server/db/schema";
import { AuthModal } from "@/components/auth/AuthModal";
import CircularProgress from "@/components/base/CircularProgress";
import { Container } from "@/components/base/Container";
import { Navbar } from "@/components/Navbar";

interface AuthSession {
  data: {
    user: Pick<User, "name" | "email">;
    session: Session;
  } | null;
}

export default function Home() {
  const [modalState, setModalState] = useState<{
    isOpen: boolean;
    mode: "login" | "signup";
  }>({
    isOpen: false,
    mode: "login",
  });

  const [isLoading, setIsLoading] = useState(true);
  const [session, setSession] = useState<AuthSession | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const checkSession = async () => {
      try {
        const result = await authClient.getSession();
        setSession(result as AuthSession);
        setError(null);
      } catch (error) {
        setSession(null);
        setError(`Failed to check authentication status: ${error instanceof Error ? error.message : String(error)}`);
      } finally {
        setIsLoading(false);
      }
    };

    void checkSession();
  }, []);

  const handleSignOut = async () => {
    try {
      await authClient.signOut();
      setSession(null);
      setError(null);
    } catch (error) {
      setError(`Failed to sign out: ${error instanceof Error ? error.message : String(error)}`);
    }
  };

  const handleAuthSuccess = (sessionData: AuthSession["data"]) => {
    setSession({ data: sessionData });
    setError(null);
  };

  const handleOpenModal = (mode: "login" | "signup") => {
    setModalState({ isOpen: true, mode });
  };

  return (
    <Container>
      <Navbar
        isLoading={isLoading}
        session={session?.data?.session ?? null}
        onSignOut={handleSignOut}
        onOpenModal={handleOpenModal}
      />
      <main className="row-start-2 flex flex-col items-center gap-[32px] sm:items-start">
        {isLoading ? (
          <CircularProgress />
        ) : error ? (
          <p className="text-3xl font-medium text-red-500">{error}</p>
        ) : (
          <p className="text-2xl font-medium md:text-3xl">
            {`Home | You are${session?.data ? " " : " not "}logged in`}
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
