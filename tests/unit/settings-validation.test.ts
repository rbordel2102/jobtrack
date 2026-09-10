import { describe, expect, it } from "vitest";

import { validateDisplayName } from "@/lib/settings-validation";

describe("settings validation", () => {
  it("recorta y acepta nombres con una longitud válida", () => {
    expect(validateDisplayName("  Ana García  ")).toEqual({
      value: "Ana García",
    });
  });

  it("rechaza nombres demasiado cortos o largos", () => {
    expect(validateDisplayName("A").error).toContain("entre 2 y 60");
    expect(validateDisplayName("a".repeat(61)).error).toContain("entre 2 y 60");
  });

  it("rechaza valores que no son texto", () => {
    expect(validateDisplayName(null).error).toContain("entre 2 y 60");
  });
});
