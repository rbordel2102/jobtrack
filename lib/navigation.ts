import type { IconName } from "@/components/icon";

export type NavigationItemId =
  | "dashboard"
  | "applications"
  | "analytics"
  | "settings";

export interface NavigationItem {
  id: NavigationItemId;
  label: string;
  icon: IconName;
  href?: string;
}

export const navigationItems = [
  { id: "dashboard", label: "Panel", icon: "grid", href: "/" },
  {
    id: "applications",
    label: "Candidaturas",
    icon: "briefcase",
    href: "/applications",
  },
  { id: "analytics", label: "Analíticas", icon: "chart" },
  { id: "settings", label: "Configuración", icon: "settings" },
] satisfies readonly NavigationItem[];
