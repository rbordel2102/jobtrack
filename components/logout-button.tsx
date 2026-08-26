"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

import { authClient } from "@/lib/auth-client";

export function LogoutButton() {
  const router = useRouter();
  const [isPending, setIsPending] = useState(false);

  async function handleLogout() {
    setIsPending(true);

    try {
      await authClient.signOut();
      router.push("/login");
      router.refresh();
    } catch {
      setIsPending(false);
    }
  }

  return (
    <button
      className="inline-flex min-h-9 shrink-0 items-center justify-center rounded-lg px-2 text-xs font-semibold text-slate-500 transition-colors hover:bg-slate-50 hover:text-slate-950 disabled:cursor-wait disabled:opacity-60 sm:px-3"
      disabled={isPending}
      onClick={handleLogout}
      type="button"
    >
      {isPending ? "Saliendo..." : "Cerrar sesión"}
    </button>
  );
}
