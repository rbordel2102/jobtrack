import Link from "next/link";

import { Icon, type IconName } from "@/components/icon";

interface MobileNavigationItem {
  label: string;
  icon: IconName;
  href?: string;
  active?: boolean;
}

const navigationItems = [
  { label: "Panel", icon: "grid", href: "/", active: true },
  { label: "Candidaturas", icon: "briefcase" },
  { label: "Analíticas", icon: "chart" },
  { label: "Configuración", icon: "settings" },
] satisfies readonly MobileNavigationItem[];

export function MobileNav() {
  return (
    <nav
      aria-label="Navegación principal móvil"
      className="border-b border-slate-200 bg-white lg:hidden"
    >
      <ul className="mx-auto flex max-w-2xl items-stretch justify-between gap-1 overflow-x-auto px-3 py-2 sm:px-6">
        {navigationItems.map((item) => (
          <li className="min-w-0 flex-1" key={item.label}>
            {item.href ? (
              <Link
                aria-current={item.active ? "page" : undefined}
                className="flex min-h-14 flex-col items-center justify-center gap-1 rounded-xl bg-slate-100 px-2 text-[11px] font-semibold text-slate-950"
                href={item.href}
              >
                <Icon className="h-4 w-4" name={item.icon} />
                <span>{item.label}</span>
              </Link>
            ) : (
              <span
                aria-disabled="true"
                className="flex min-h-14 cursor-default flex-col items-center justify-center gap-1 rounded-xl px-2 text-[11px] font-semibold text-slate-400"
              >
                <Icon className="h-4 w-4" name={item.icon} />
                <span>{item.label}</span>
              </span>
            )}
          </li>
        ))}
      </ul>
    </nav>
  );
}
