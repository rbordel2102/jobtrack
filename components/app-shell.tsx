import type { ReactNode } from "react";

import { Header } from "@/components/header";
import { MobileNav } from "@/components/mobile-nav";
import { Sidebar } from "@/components/sidebar";

interface AppShellProps {
  children: ReactNode;
}

export function AppShell({ children }: AppShellProps) {
  return (
    <div className="min-h-screen bg-[#f7f8fa] text-slate-950 lg:flex">
      <Sidebar />
      <div className="min-w-0 flex-1">
        <MobileNav />
        <Header />
        <main className="mx-auto w-full max-w-[1500px] px-4 py-7 sm:px-6 sm:py-8 lg:px-8 lg:py-10">
          {children}
        </main>
      </div>
    </div>
  );
}
