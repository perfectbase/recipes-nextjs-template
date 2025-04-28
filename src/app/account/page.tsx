"use client";

import CircularProgress from "@/components/base/CircularProgress";
import { Container } from "@/components/base/Container";
import { Navbar } from "@/components/Navbar";
import { authClient } from "@/lib/auth/client";
import type { Session, User } from "@/server/db/schema";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

interface AuthSession {
  data: {
    user: Pick<User, "name" | "email">;
    session: Session;
  } | null;
}

export default function AccountPage() {
  const router = useRouter();
  const [session, setSession] = useState<AuthSession | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const result = await authClient.getSession();
        if (result.data) {
          setSession(result as AuthSession);
        } else {
          setError("No user found in session");
        }
      } catch (error) {
        setError(`Failed to fetch user data: ${error}`);
      } finally {
        setIsLoading(false);
      }
    };

    void fetchUserData();
  }, []);

  const handleSignOut = async () => {
    try {
      await authClient.signOut();
      setSession(null);
      router.push("/");
    } catch (error) {
      setError("Failed to sign out");
    }
  };

  const handleOpenModal = (_: "login" | "signup") => {
    // No-op since we don't need modal on account page
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
          <p className="text-2xl md:text-3xl font-medium text-red-500">{error}</p>
        ) : session?.data?.user ? (
          <>
            <p className="text-2xl md:text-3xl font-medium">
              {"Account | You are logged in"}
            </p>
            <p className="text-2xl md:text-3xl font-medium">
              {`${session.data.user.name} (${session.data.user.email})`}
            </p>
          </>
        ) : null}
      </main>
    </Container>
  );
}
