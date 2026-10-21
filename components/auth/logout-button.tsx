"use client";

import { signOut } from "next-auth/react";

export function LogoutButton({ className = "" }: { className?: string }) {
  return (
    <button
      type="button"
      onClick={() => void signOut({ callbackUrl: "/login" })}
      className={`rounded-md px-3 py-2 text-sm font-medium transition-colors hover:bg-white/10 hover:text-white ${className}`}
    >
      Выйти
    </button>
  );
}
