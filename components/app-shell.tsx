import type { ReactNode } from "react";

import { Header } from "@/components/header";
import { MobileNav } from "@/components/mobile-nav";
import { Sidebar } from "@/components/sidebar";
import type { NavigationItemId } from "@/lib/navigation";

interface AppShellProps {
  children: ReactNode;
  activeNavigationItem: NavigationItemId;
  headerDescription?: string;
  headerEyebrow: string;
  headerTitle: string;
  userName: string;
}

export function AppShell({
  activeNavigationItem,
  children,
  headerDescription,
  headerEyebrow,
  headerTitle,
  userName,
}: AppShellProps) {
  return (
    <div className="min-h-screen bg-[#f7f8fa] text-slate-950 lg:flex">
      <Sidebar activeNavigationItem={activeNavigationItem} />
      <div className="min-w-0 flex-1">
        <MobileNav activeNavigationItem={activeNavigationItem} />
        <Header
          description={headerDescription}
          eyebrow={headerEyebrow}
          title={headerTitle}
          userName={userName}
        />
        <main className="mx-auto w-full max-w-[1500px] px-4 py-7 sm:px-6 sm:py-8 lg:px-8 lg:py-10">
          {children}
        </main>
      </div>
    </div>
  );
}
