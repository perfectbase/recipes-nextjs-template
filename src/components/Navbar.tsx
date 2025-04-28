"use client";

import { Button } from "@/components/base/Button";
import { Link } from "@/components/base/Link";
import type { Session } from "@/server/db/schema";
import { usePathname } from "next/navigation";

interface NavbarProps {
  isLoading: boolean;
  session: Session | null;
  onSignOut: () => void;
  onOpenModal: (mode: "login" | "signup") => void;
}

export function Navbar(props: NavbarProps) {
  const pathname = usePathname();
  const className = "fixed top-0 w-full p-4 flex justify-between";

  if (props.isLoading) {
    return <nav className={className} />;
  }

  return (
    <nav className={className}>
      {props.session ? (
        <>
          <Button onClick={props.onSignOut} variant="outline">
            Sign out
          </Button>
          <Link href={pathname === "/" ? "/account" : "/"}>
            {pathname === "/" ? "Account" : "Home"}
          </Link>
        </>
      ) : (
        <div className="ml-auto flex gap-4">
          <Button
            variant="outline"
            onClick={() => props.onOpenModal("login")}
          >
            Login
          </Button>
          <Button
            onClick={() => props.onOpenModal("signup")}
          >
            Sign up
          </Button>
        </div>
      )}
    </nav>
  );
}
