"use client";

import Link from "next/link";
import { useAuth } from "@/context/auth-context";
import Button from "@/components/ui/button";

export default function Navbar() {
  const { user, isLoading, logout } = useAuth();

  return (
    <header className="mx-auto flex max-w-6xl items-center justify-between px-6 py-5">
      <Link
        href="/"
        className="text-lg font-semibold tracking-tight text-neutral-900"
      >
        TravelBook
      </Link>
      <nav className="flex items-center gap-6">
        <Link
          href="#"
          className="hidden text-sm text-neutral-600 transition-colors hover:text-neutral-900 sm:block"
        >
          Destinations
        </Link>
        <Link
          href="#"
          className="hidden text-sm text-neutral-600 transition-colors hover:text-neutral-900 sm:block"
        >
          Offers
        </Link>
        <Link
          href="#"
          className="hidden text-sm text-neutral-600 transition-colors hover:text-neutral-900 sm:block"
        >
          About
        </Link>

        {isLoading ? null : user ? (
          <div className="flex items-center gap-4">
            {user.role === "admin" && (
              <Link
                href="/admin"
                className="text-sm font-medium text-neutral-600 transition-colors hover:text-neutral-900"
              >
                Dashboard
              </Link>
            )}
            <span className="text-sm text-neutral-600">{user.name}</span>
            <button
              onClick={logout}
              className="text-sm text-neutral-500 transition-colors hover:text-neutral-900"
            >
              Logout
            </button>
          </div>
        ) : (
          <div className="flex items-center gap-3">
            <Link href="/login">
              <Button variant="ghost" size="sm">
                Login
              </Button>
            </Link>
            <Link href="/register">
              <Button size="sm">Register</Button>
            </Link>
            <Link
              href="/admin/login"
              className="text-xs text-neutral-400 transition-colors hover:text-neutral-600"
            >
              Admin
            </Link>
          </div>
        )}
      </nav>
    </header>
  );
}
