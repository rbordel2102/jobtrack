import { Icon } from "@/components/icon";

interface HeaderProps {
  description?: string;
  eyebrow: string;
  title: string;
}

export function Header({ description, eyebrow, title }: HeaderProps) {
  return (
    <header className="border-b border-slate-200 bg-white">
      <div className="mx-auto flex min-h-[88px] w-full max-w-[1500px] items-center justify-between gap-6 px-4 py-5 sm:px-6 lg:px-8">
        <div>
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

        <div className="flex items-center gap-3 sm:gap-5">
          <div
            aria-hidden="true"
            className="hidden h-10 items-center gap-2 rounded-xl border border-slate-200 bg-slate-50 px-3 text-sm text-slate-400 md:flex"
          >
            <Icon className="h-4 w-4" name="search" />
            <span>Buscar</span>
            <kbd className="ml-5 rounded-md border border-slate-200 bg-white px-1.5 py-0.5 text-[10px] font-medium text-slate-400">
              ⌘ K
            </kbd>
          </div>
          <span
            aria-label="Perfil"
            className="flex h-9 w-9 items-center justify-center rounded-full bg-slate-950 text-xs font-semibold text-white"
            title="Perfil"
          >
            JD
          </span>
        </div>
      </div>
    </header>
  );
}
