"use client";

import { useState, FormEvent } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useAuth } from "@/context/auth-context";
import { ApiClientError } from "@/lib/api";
import Button from "@/components/ui/button";

export default function AdminLoginPage() {
  const router = useRouter();
  const { loginAdmin } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError("");

    if (!email || !password) {
      setError("Email and password are required");
      return;
    }

    setLoading(true);
    try {
      await loginAdmin(email, password);
      router.push("/");
    } catch (err) {
      if (err instanceof ApiClientError) {
        setError(err.message);
      } else {
        setError("Something went wrong. Please try again.");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center px-6">
      <div className="w-full max-w-sm">
        <div className="mb-10 text-center">
          <Link
            href="/"
            className="text-lg font-semibold tracking-tight text-neutral-900"
          >
            TravelBook Admin
          </Link>
          <h1 className="mt-6 text-2xl font-semibold tracking-tight text-neutral-900">
            Admin Login
          </h1>
          <p className="mt-2 text-sm text-neutral-500">
            Sign in to the admin panel
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          {error && (
            <div className="rounded-lg bg-red-50 px-4 py-3 text-sm text-red-600">
              {error}
            </div>
          )}

          <div>
            <label
              htmlFor="email"
              className="mb-1.5 block text-sm font-medium text-neutral-700"
            >
              Email
            </label>
            <input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="admin@example.com"
              className="w-full rounded-lg bg-neutral-100 px-4 py-2.5 text-sm text-neutral-900 outline-none placeholder:text-neutral-400 focus:bg-neutral-200"
              autoComplete="email"
            />
          </div>

          <div>
            <label
              htmlFor="password"
              className="mb-1.5 block text-sm font-medium text-neutral-700"
            >
              Password
            </label>
            <input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter your password"
              className="w-full rounded-lg bg-neutral-100 px-4 py-2.5 text-sm text-neutral-900 outline-none placeholder:text-neutral-400 focus:bg-neutral-200"
              autoComplete="current-password"
            />
          </div>

          <Button type="submit" className="w-full" disabled={loading}>
            {loading ? "Signing in..." : "Sign in as Admin"}
          </Button>
        </form>

        <p className="mt-8 text-center text-sm text-neutral-500">
          <Link
            href="/login"
            className="font-medium text-neutral-900 hover:underline"
          >
            Back to user login
          </Link>
        </p>
      </div>
    </div>
  );
}
