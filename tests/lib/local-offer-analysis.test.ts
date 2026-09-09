import { describe, expect, it } from "vitest";

import { analyzeLocalOffer } from "@/lib/local-offer-analysis";

describe("local offer analysis", () => {
  it("detecta las tecnologías principales de forma case-insensitive", () => {
    const result = analyzeLocalOffer(
      "Buscamos experiencia con REACT, typescript, node.js, PostgreSQL y Docker.",
    );

    expect(result.technologies).toEqual([
      "TypeScript",
      "React",
      "Node.js",
      "PostgreSQL",
      "Docker",
    ]);
  });

  it("evita duplicados y falsos positivos obvios", () => {
    const result = analyzeLocalOffer(
      "React react REACT, JavaScript y Java, GitHub y Git, Tailwind CSS y CSS.",
    );

    expect(result.technologies).toEqual([
      "JavaScript",
      "React",
      "Java",
      "Git",
      "GitHub",
      "Tailwind CSS",
    ]);
    expect(new Set(result.technologies).size).toBe(result.technologies.length);
  });

  it("detecta C# y .NET en nombres habituales", () => {
    const result = analyzeLocalOffer("Experiencia con ASP.NET y C#.");

    expect(result.technologies).toEqual(["C#", ".NET"]);
  });

  it("detecta junior y senior cuando la evidencia es clara", () => {
    expect(analyzeLocalOffer("Buscamos un perfil junior entry level.").seniority).toBe(
      "junior",
    );
    expect(analyzeLocalOffer("Necesitamos una persona senior.").seniority).toBe(
      "senior",
    );
  });

  it("devuelve unknown ante un nivel ambiguo o ausente", () => {
    expect(analyzeLocalOffer("Buscamos un perfil junior o senior.").seniority).toBe(
      "unknown",
    );
    expect(analyzeLocalOffer("Buscamos experiencia profesional.").seniority).toBe(
      "unknown",
    );
  });

  it("detecta las modalidades remota, híbrida y presencial", () => {
    expect(analyzeLocalOffer("Puesto remoto con teletrabajo.").workMode).toBe("remote");
    expect(analyzeLocalOffer("Modalidad hybrid dos días.").workMode).toBe("hybrid");
    expect(analyzeLocalOffer("Trabajo presencial en oficina.").workMode).toBe("onsite");
  });

  it("devuelve unknown cuando no puede determinar la modalidad", () => {
    expect(analyzeLocalOffer("La modalidad se acordará con el equipo.").workMode).toBe(
      "unknown",
    );
  });

  it("extrae keywords de una lista controlada", () => {
    const result = analyzeLocalOffer(
      "Se requiere REST API, testing, CI/CD, Agile, Scrum, Clean Code, SOLID, microservices, cloud, teamwork, communication e English.",
    );

    expect(result.keywords).toEqual([
      "REST API",
      "Testing",
      "CI/CD",
      "Agile",
      "Scrum",
      "Clean Code",
      "SOLID",
      "Microservices",
      "Cloud",
      "Teamwork",
      "Communication",
      "English",
    ]);
  });

  it("genera un resumen determinista y highlights acotados", () => {
    const result = analyzeLocalOffer(
      "Buscamos una persona junior con React y TypeScript para un equipo hybrid con testing.",
    );

    expect(result.summary).toContain("perfil junior");
    expect(result.summary).toContain("TypeScript y React");
    expect(result.summary).toContain("híbrida");
    expect(result.applicationHighlights.length).toBeGreaterThanOrEqual(2);
    expect(result.applicationHighlights.length).toBeLessThanOrEqual(5);
    expect(result.applicationHighlights[0]).toContain("TypeScript");
  });

  it("devuelve highlights aunque no encuentre tecnologías conocidas", () => {
    const result = analyzeLocalOffer(
      "Buscamos una persona para colaborar en las responsabilidades descritas.",
    );

    expect(result.technologies).toEqual([]);
    expect(result.applicationHighlights.length).toBeGreaterThanOrEqual(2);
  });
});
