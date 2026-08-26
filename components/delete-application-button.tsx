"use client";

import type { FormEvent } from "react";

import { deleteApplicationAction } from "@/app/applications/actions";

interface DeleteApplicationButtonProps {
  applicationId: string;
}

export function DeleteApplicationButton({
  applicationId,
}: DeleteApplicationButtonProps) {
  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    if (!window.confirm("¿Quieres eliminar esta candidatura?")) {
      event.preventDefault();
    }
  }

  return (
    <form action={deleteApplicationAction} onSubmit={handleSubmit}>
      <input name="applicationId" type="hidden" value={applicationId} />
      <button
        className="inline-flex min-h-9 items-center justify-center rounded-lg px-3 text-xs font-semibold text-rose-600 transition-colors hover:bg-rose-50"
        type="submit"
      >
        Eliminar
      </button>
    </form>
  );
}
