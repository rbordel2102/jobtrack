import type { ReactNode } from "react";

interface ApplicationsLayoutProps {
  children: ReactNode;
}

export default function ApplicationsLayout({
  children,
}: ApplicationsLayoutProps) {
  return children;
}
