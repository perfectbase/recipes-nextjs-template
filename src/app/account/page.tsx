"use client";

import CircularProgress from "@/components/base/CircularProgress";
import { Container } from "@/components/base/Container";
import { Navbar } from "@/components/Navbar";
import { authClient } from "@/lib/auth/client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

export default function AccountPage() {
  const router = useRouter();
  const [session, setSession] = useState<null | any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const session = await authClient.getSession();

        if (session.data) {
          setSession(session);
        } else {
          setError("No user found in session");
        }
      } catch (error) {
        console.error("Error fetching user data:", error);
        setError(error as string);
      } finally {
        setIsLoading(false);
      }
    };

    fetchUserData();
  }, []);

  const handleSignOut = async () => {
    try {
      await authClient.signOut();
      setSession(null);
      router.push("/");
    } catch (error) {
      console.error("Error signing out:", error);
    }
  };

  const handleOpenModal = (_: "login" | "signup") => {
    // No-op since we don't need modal on account page
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
        ) : session?.data?.user ? (
          <p className="text-3xl font-medium">
            {`Account | You are logged in as ${session.data.user.name} (${session.data.user.email})`}
          </p>
        ) : null}
      </main>
    </Container>
  );
}
