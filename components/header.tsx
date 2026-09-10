import { LogoutButton } from "@/components/logout-button";

interface HeaderProps {
  description?: string;
  eyebrow: string;
  title: string;
  userName: string;
}

function getFirstName(name: string): string {
  return name.trim().split(/\s+/).filter(Boolean)[0] || "Usuario";
}

function getUserInitials(name: string): string {
  const initials = name
    .trim()
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part.charAt(0))
    .join("")
    .toUpperCase();

  return initials || "U";
}

export function Header({
  description,
  eyebrow,
  title,
  userName,
}: HeaderProps) {
  const firstName = getFirstName(userName);

  return (
    <header className="border-b border-slate-200 bg-white">
      <div className="mx-auto flex min-h-[88px] w-full max-w-[1500px] items-center justify-between gap-4 px-4 py-5 sm:gap-6 sm:px-6 lg:px-8">
        <div className="min-w-0">
          <p className="text-[10px] font-semibold uppercase tracking-[0.2em] text-slate-400">
            {eyebrow}
          </p>
          <h1 className="mt-1 text-2xl font-semibold tracking-tight text-slate-950 sm:text-[28px]">
            {title}
          </h1>
          {description ? (
            <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-500">
              {description}
            </p>
          ) : null}
        </div>

        <div className="flex shrink-0 items-center gap-2 sm:gap-4">
          <div className="min-w-0 max-w-24 text-right sm:max-w-32">
            <p className="truncate text-sm font-semibold text-slate-950">
              {firstName}
            </p>
          </div>
          <span
            aria-label={`Perfil de ${userName}`}
            className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-slate-950 text-xs font-semibold text-white"
            title={userName}
          >
            {getUserInitials(userName)}
          </span>
          <LogoutButton />
        </div>
      </div>
    </header>
  );
}
