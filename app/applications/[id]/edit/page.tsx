import Link from "next/link";

import { updateApplicationAction } from "@/app/applications/actions";
import { ApplicationForm } from "@/components/application-form";
import { AppShell } from "@/components/app-shell";
import { getApplication } from "@/lib/application-data";
import { getApplicationFormValues } from "@/lib/application-validation";
import { requireSession } from "@/lib/auth-utils";
import type { Application } from "@/types/application";

export const dynamic = "force-dynamic";

interface EditApplicationRouteProps {
  params: Promise<{ id: string }>;
}

interface ApplicationMessageProps {
  description: string;
  title: string;
}

function ApplicationMessage({
  description,
  title,
}: ApplicationMessageProps) {
  return (
    <section
      aria-labelledby="application-message-heading"
      className="mx-auto max-w-2xl rounded-2xl border border-slate-200 bg-white px-5 py-14 text-center sm:px-6"
    >
      <h2
        className="text-lg font-semibold text-slate-950"
        id="application-message-heading"
      >
        {title}
      </h2>
      <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-slate-500">
        {description}
      </p>
      <Link
        className="mt-6 inline-flex min-h-11 items-center justify-center rounded-xl bg-slate-950 px-4 text-sm font-semibold text-white transition-colors hover:bg-slate-800"
        href="/applications"
      >
        Volver a candidaturas
      </Link>
    </section>
  );
}

export default async function EditApplicationRoute({
  params,
}: EditApplicationRouteProps) {
  const session = await requireSession();
  const { id } = await params;
  let application: Application | null = null;
  let loadError = false;

  try {
    application = await getApplication(id, session.user.id);
  } catch {
    loadError = true;
  }

  return (
    <AppShell
      activeNavigationItem="applications"
      headerDescription="Revisa y actualiza la información de esta oportunidad."
      headerEyebrow="Proceso"
      headerTitle="Editar candidatura"
      userEmail={session.user.email}
      userName={session.user.name}
    >
      {loadError ? (
        <ApplicationMessage
          description="No se ha podido cargar la candidatura. Inténtalo de nuevo más tarde."
          title="No se ha podido cargar la candidatura"
        />
      ) : application ? (
        <ApplicationForm
          action={updateApplicationAction.bind(null, application.id)}
          initialValues={getApplicationFormValues(application)}
          mode="edit"
        />
      ) : (
        <ApplicationMessage
          description="Puede que la candidatura ya no exista o que el enlace no sea válido."
          title="No se ha encontrado la candidatura"
        />
      )}
    </AppShell>
  );
}
