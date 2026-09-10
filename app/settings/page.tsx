import { AppShell } from "@/components/app-shell";
import { SettingsForm } from "@/components/settings-form";
import { requireSession } from "@/lib/auth-utils";
import { updateProfileAction } from "@/app/settings/actions";

export const dynamic = "force-dynamic";

export default async function SettingsPage() {
  const session = await requireSession();

  return (
    <AppShell
      activeNavigationItem="settings"
      headerDescription="Mantén actualizados los datos básicos de tu cuenta."
      headerEyebrow="Cuenta"
      headerTitle="Configuración"
      userName={session.user.name}
    >
      <div className="mx-auto max-w-3xl">
        <SettingsForm
          action={updateProfileAction}
          email={session.user.email}
          initialName={session.user.name}
        />
      </div>
    </AppShell>
  );
}
