"use client";

import { useEffect, useState } from "react";
import { authClient } from "@/lib/auth/client";
import Link from "next/link";

export default function AccountPage() {
  const [user, setUser] = useState<{
    email: string;
    name: string;
  } | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const session = await authClient.getSession();
        if (session.data?.user) {
          setUser({
            email: session.data.user.email,
            name: session.data.user.name,
          });
        }
      } catch (error) {
        console.error("Error fetching user data:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchUserData();
  }, []);

  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-gray-200 border-t-blue-600"></div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center gap-4">
        <p className="text-lg">You need to be logged in to view this page.</p>
        <Link
          href="/"
          className="text-blue-600 hover:underline"
        >
          Go back home
        </Link>
      </div>
    );
  }

  return (
    <div className="container mx-auto max-w-2xl px-4 py-8">
      <h1 className="mb-8 text-3xl font-bold">Your Account</h1>

      <div className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm">
        <div className="mb-4">
          <h2 className="text-lg font-medium text-gray-500">Name</h2>
          <p className="text-xl">{user.name}</p>
        </div>

        <div className="mb-4">
          <h2 className="text-lg font-medium text-gray-500">Email</h2>
          <p className="text-xl">{user.email}</p>
        </div>

        <div className="mt-6 flex justify-between">
          <Link
            href="/"
            className="text-blue-600 hover:underline"
          >
            Back to home
          </Link>
        </div>
      </div>
    </div>
  );
} 
