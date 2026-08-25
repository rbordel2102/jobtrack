import Link from "next/link";

import { Icon } from "@/components/icon";
import {
  navigationItems,
  type NavigationItem,
  type NavigationItemId,
} from "@/lib/navigation";

const baseItemClasses =
  "flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-colors";

interface NavigationLinkProps {
  activeNavigationItem: NavigationItemId;
  item: NavigationItem;
}

function NavigationLink({ activeNavigationItem, item }: NavigationLinkProps) {
  const isActive = item.id === activeNavigationItem;

  if (item.href) {
    return (
      <Link
        aria-current={isActive ? "page" : undefined}
        className={`${baseItemClasses} ${isActive ? "bg-slate-100 text-slate-950" : "text-slate-500 hover:bg-slate-50 hover:text-slate-950"}`}
        href={item.href}
      >
        <Icon className="h-[18px] w-[18px]" name={item.icon} />
        <span>{item.label}</span>
      </Link>
    );
  }

  return (
    <span
      aria-disabled="true"
      className={`${baseItemClasses} cursor-default text-slate-400`}
    >
      <Icon className="h-[18px] w-[18px]" name={item.icon} />
      <span>{item.label}</span>
      <span className="ml-auto text-[10px] font-semibold uppercase tracking-[0.12em] text-slate-300">
        Próximamente
      </span>
    </span>
  );
}

interface SidebarProps {
  activeNavigationItem: NavigationItemId;
}

export function Sidebar({ activeNavigationItem }: SidebarProps) {
  return (
    <aside
      aria-label="Barra lateral"
      className="sticky top- hidden h-screen w-70 shrink-0 flex-col border-r border-slate-200 bg-white lg:flex"
    >
      <div className="flex h-full flex-col px-4 py-5">
        <Link
          className="flex items-center gap-3 rounded-xl px-3 py-2 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-slate-950"
          href="/"
        >
          <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-slate-950 text-sm font-bold text-white">
            J
          </span>
          <span className="text-lg font-semibold tracking-tight text-slate-950">
            JobTrack
          </span>
        </Link>

        <nav aria-label="Navegación principal" className="mt-10">
          <p className="px-3 text-[10px] font-semibold uppercase tracking-[0.18em] text-slate-400">
            Espacio de trabajo
          </p>
          <ul className="mt-3 space-y-1">
            {navigationItems.map((item) => (
              <li key={item.label}>
                <NavigationLink
                  activeNavigationItem={activeNavigationItem}
                  item={item}
                />
              </li>
            ))}
          </ul>
        </nav>

        <div className="mt-auto rounded-2xl border border-slate-200 bg-slate-50 p-4">
          <p className="text-xs font-semibold text-slate-950">Tu espacio de trabajo</p>
          <p className="mt-1 text-xs leading-5 text-slate-500">
            Mantén todas tus oportunidades en movimiento.
          </p>
        </div>
      </div>
    </aside>
  );
}
