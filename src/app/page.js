"use client";

import { useSession } from "next-auth/react";
import Dashboard from "@/components/Dashboard";
import SignInPage from "@/components/SignInPage";

export default function Home() {
  const { status } = useSession();

  if (status === "loading") {
    return (
      <div className="bg-slate-900 min-h-screen text-white flex items-center justify-center">
        <p className="animate-pulse">Loading...</p>
      </div>
    );
  }

  if (status === "authenticated") {
    return <Dashboard />;
  }

  return <SignInPage />;
}
