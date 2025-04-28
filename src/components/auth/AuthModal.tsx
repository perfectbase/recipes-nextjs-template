"use client";

import { useEffect, useRef, useState } from "react";
import { authClient } from "@/lib/auth/client";
import { Button } from "@/components/base/Button";
import { Input } from "@/components/base/Input";

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  mode: "login" | "signup";
  onSuccess?: (session: any) => void;
}

export function AuthModal({
  isOpen,
  onClose,
  mode,
  onSuccess,
}: AuthModalProps) {
  const modalRef = useRef<HTMLDivElement>(null);
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    name: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    setFormData({
      email: "",
      password: "",
      name: "",
    });
    setError(null);
  }, [mode]);

  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };

    const handleClickOutside = (e: MouseEvent) => {
      if (modalRef.current && !modalRef.current.contains(e.target as Node)) {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener("keydown", handleEscape);
      document.addEventListener("mousedown", handleClickOutside);
      document.body.style.overflow = "hidden";
    }

    return () => {
      document.removeEventListener("keydown", handleEscape);
      document.removeEventListener("mousedown", handleClickOutside);
      document.body.style.overflow = "unset";
    };
  }, [isOpen, onClose]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError(null);

    try {
      if (mode === "signup") {
        console.log("Signup request data:", {
          email: formData.email,
          password: formData.password,
          name: formData.name,
        });
        const response = await authClient.signUp.email({
          email: formData.email,
          password: formData.password,
          name: formData.name,
        });
        console.log("Signup response:", response);

        if (response.error) {
          console.error("Signup error details:", response.error);
          throw new Error(response.error.message || "Failed to sign up");
        }

        // Get the session after successful signup
        const session = await authClient.getSession();
        onSuccess?.(session.data);
      } else {
        const response = await authClient.signIn.email({
          email: formData.email,
          password: formData.password,
        });
        console.log("Login response:", response);

        if (response.error) {
          console.error("Login error details:", response.error);
          throw new Error(response.error.message || "Failed to log in");
        }

        // Get the session after successful login
        const session = await authClient.getSession();
        onSuccess?.(session.data);
      }
      onClose();
    } catch (error) {
      console.error("Authentication error:", error);
      if (error instanceof Error) {
        setError(error.message);
      } else if (
        typeof error === "object" &&
        error !== null &&
        "message" in error
      ) {
        setError(String(error.message));
      } else {
        setError("An error occurred during authentication");
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
      <div
        ref={modalRef}
        className="bg-background w-full max-w-md rounded-lg p-6 shadow-lg"
      >
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-xl font-semibold">
            {mode === "login" ? "Login" : "Sign up"}
          </h2>
          <Button
            variant="ghost"
            size="sm"
            onClick={onClose}
            className="text-muted-foreground hover:text-foreground"
          >
            ✕
          </Button>
        </div>
        <form onSubmit={handleSubmit} className="space-y-4">
          {error && (
            <div className="rounded-md bg-red-50 p-3 text-sm text-red-500">
              {error}
            </div>
          )}
          <Input
            id="email"
            name="email"
            type="email"
            label="Email"
            value={formData.email}
            onChange={handleChange}
            placeholder="Enter your email"
            autoComplete="email"
            required
          />
          <Input
            id="password"
            name="password"
            type="password"
            label="Password"
            value={formData.password}
            onChange={handleChange}
            placeholder="Enter your password"
            autoComplete={
              mode === "login" ? "current-password" : "new-password"
            }
            required
          />
          {mode === "signup" && (
            <Input
              id="name"
              name="name"
              type="text"
              label="Name"
              value={formData.name}
              onChange={handleChange}
              placeholder="Enter your name"
              autoComplete="name"
              required
            />
          )}
          <Button type="submit" isLoading={isSubmitting} className="w-full">
            {mode === "login" ? "Login" : "Sign up"}
          </Button>
        </form>
      </div>
    </div>
  );
}
