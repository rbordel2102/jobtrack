import Link from "next/link";

import { analyzeJobOfferAction } from "@/app/analytics/offer/actions";
import { AppShell } from "@/components/app-shell";
import { OfferAnalysisForm } from "@/components/offer-analysis-form";
import { requireSession } from "@/lib/auth-utils";
import { getOfferAnalysisProvider } from "@/lib/offer-analysis-service";

export const dynamic = "force-dynamic";

export default async function OfferAnalysisRoute() {
  const session = await requireSession();
  const provider = getOfferAnalysisProvider();

  return (
    <AppShell
      activeNavigationItem="analytics"
      headerDescription="Extrae información útil de una oferta antes de aplicar."
      headerEyebrow="Analíticas"
      headerTitle="Analizar oferta"
      userName={session.user.name}
    >
      <div className="mx-auto max-w-4xl">
        <Link
          className="mb-5 inline-flex min-h-9 items-center rounded-lg px-3 text-sm font-semibold text-slate-500 transition-colors hover:bg-white hover:text-slate-950"
          href="/analytics"
        >
          ← Volver a analíticas
        </Link>
        <OfferAnalysisForm action={analyzeJobOfferAction} provider={provider} />
      </div>
    </AppShell>
  );
}
