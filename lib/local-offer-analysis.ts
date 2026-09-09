import type {
  JobOfferAnalysis,
  OfferSeniority,
  OfferWorkMode,
} from "@/types/offer-analysis";

interface DetectionRule {
  label: string;
  pattern: RegExp;
}

const technologyRules: readonly DetectionRule[] = [
  { label: "JavaScript", pattern: /\bjavascript\b/ },
  { label: "TypeScript", pattern: /\btypescript\b/ },
  { label: "React", pattern: /\breact(?:\.js)?\b/ },
  { label: "Next.js", pattern: /\bnext(?:\.js|js)\b/ },
  { label: "Angular", pattern: /\bangular\b/ },
  { label: "Vue", pattern: /\bvue(?:\.js)?\b/ },
  { label: "Node.js", pattern: /\bnode(?:\.js|js)\b/ },
  { label: "Express", pattern: /\bexpress(?:\.js)?\b/ },
  { label: "PHP", pattern: /\bphp\b/ },
  { label: "Laravel", pattern: /\blaravel\b/ },
  { label: "Java", pattern: /\bjava\b/ },
  { label: "Spring", pattern: /\bspring\b/ },
  { label: "Python", pattern: /\bpython\b/ },
  { label: "Django", pattern: /\bdjango\b/ },
  { label: "Flask", pattern: /\bflask\b/ },
  { label: "C#", pattern: /(?:^|[^a-z0-9])c#(?:$|[^a-z0-9])/ },
  {
    label: ".NET",
    pattern: /(?:\.net|dotnet)\b/,
  },
  { label: "SQL", pattern: /\bsql\b/ },
  { label: "MySQL", pattern: /\bmysql\b/ },
  { label: "PostgreSQL", pattern: /\bpostgres(?:ql)?\b/ },
  { label: "MongoDB", pattern: /\bmongodb\b/ },
  { label: "Prisma", pattern: /\bprisma\b/ },
  { label: "Docker", pattern: /\bdocker\b/ },
  { label: "Kubernetes", pattern: /\bkubernetes\b|\bk8s\b/ },
  { label: "Git", pattern: /\bgit\b/ },
  { label: "GitHub", pattern: /\bgithub\b/ },
  { label: "AWS", pattern: /\baws\b/ },
  { label: "Azure", pattern: /\bazure\b/ },
  { label: "REST", pattern: /\brest\b/ },
  { label: "GraphQL", pattern: /\bgraphql\b/ },
  { label: "HTML", pattern: /\bhtml\b/ },
  { label: "CSS", pattern: /\bcss\b/ },
  { label: "Tailwind CSS", pattern: /\btailwind\s+css\b/ },
  { label: "Jest", pattern: /\bjest\b/ },
  { label: "Vitest", pattern: /\bvitest\b/ },
  { label: "Playwright", pattern: /\bplaywright\b/ },
  { label: "Cypress", pattern: /\bcypress\b/ },
];

const seniorityRules: readonly {
  value: OfferSeniority;
  patterns: readonly RegExp[];
}[] = [
  {
    value: "intern",
    patterns: [
      /\bpracticas\b/,
      /\bbecari[oa]\b/,
      /\binternship\b/,
      /\bintern\b/,
    ],
  },
  {
    value: "junior",
    patterns: [/\bjunior\b/, /\bentry[\s-]+level\b/],
  },
  {
    value: "mid",
    patterns: [/\bmid(?:[\s-]+level)?\b/, /\bintermediate\b/],
  },
  {
    value: "senior",
    patterns: [/\bsenior\b/],
  },
  {
    value: "lead",
    patterns: [/\btech[\s-]+lead\b/, /\blead\b/],
  },
];

const workModeRules: readonly {
  value: OfferWorkMode;
  patterns: readonly RegExp[];
}[] = [
  {
    value: "remote",
    patterns: [/\bremoto\b/, /\bteletrabajo\b/, /\bremote\b/],
  },
  {
    value: "hybrid",
    patterns: [/\bhibrido\b/, /\bhybrid\b/],
  },
  {
    value: "onsite",
    patterns: [/\bpresencial\b/, /\bon[\s-]?site\b/],
  },
];

const keywordRules: readonly DetectionRule[] = [
  {
    label: "REST API",
    pattern: /\b(?:rest\s+api|api\s+rest)\b/,
  },
  { label: "Testing", pattern: /\b(?:test|tests|testing|prueba|pruebas)\b/ },
  {
    label: "CI/CD",
    pattern: /\bci\s*\/\s*cd\b|\b(?:continuous|integracion continua)\b/,
  },
  { label: "Agile", pattern: /\bagile\b|\bagil\b/ },
  { label: "Scrum", pattern: /\bscrum\b/ },
  { label: "Git", pattern: /\bgit(?:hub)?\b/ },
  {
    label: "Clean Code",
    pattern: /\bclean\s+code\b|\bcodigo\s+limpio\b/,
  },
  { label: "SOLID", pattern: /\bsolid\b/ },
  {
    label: "Microservices",
    pattern: /\bmicroservices?\b|\bmicroservicios\b/,
  },
  { label: "Cloud", pattern: /\bcloud\b|\bnube\b/ },
  { label: "Docker", pattern: /\bdocker\b/ },
  {
    label: "Teamwork",
    pattern: /\bteamwork\b|\btrabajo\s+en\s+equipo\b|\bcolaboracion\b/,
  },
  {
    label: "Communication",
    pattern: /\bcommunication\b|\bcomunicacion\b/,
  },
  { label: "English", pattern: /\benglish\b|\bingles\b/ },
];

const seniorityLabels: Record<OfferSeniority, string> = {
  intern: "de prácticas",
  junior: "junior",
  mid: "intermedio",
  senior: "senior",
  lead: "lead",
  unknown: "técnico",
};

const workModeLabels: Record<OfferWorkMode, string> = {
  remote: "remota",
  hybrid: "híbrida",
  onsite: "presencial",
  unknown: "no determinada",
};

function foldText(text: string): string {
  return text
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase();
}

function joinNatural(items: readonly string[]): string {
  if (items.length <= 1) {
    return items[0] ?? "";
  }

  if (items.length === 2) {
    return `${items[0]} y ${items[1]}`;
  }

  return `${items.slice(0, -1).join(", ")} y ${items.at(-1)}`;
}

function detectTechnologyNames(text: string): string[] {
  const detected = technologyRules
    .filter(({ pattern }) => pattern.test(text))
    .map(({ label }) => label);

  if (detected.includes("Tailwind CSS")) {
    return detected.filter((technology) => technology !== "CSS");
  }

  return detected;
}

function detectUniqueValue<T extends string>(
  text: string,
  rules: readonly { value: T; patterns: readonly RegExp[] }[],
): T | "unknown" {
  const detected = rules.filter(({ patterns }) =>
    patterns.some((pattern) => pattern.test(text)),
  );

  return detected.length === 1 ? detected[0].value : "unknown";
}

function detectKeywords(text: string): string[] {
  return keywordRules
    .filter(({ pattern }) => pattern.test(text))
    .map(({ label }) => label);
}

function createSummary(
  seniority: OfferSeniority,
  technologies: readonly string[],
  keywords: readonly string[],
  workMode: OfferWorkMode,
): string {
  const sentences = [
    `Oferta orientada a un perfil ${seniorityLabels[seniority]} de desarrollo de software.`,
  ];

  if (technologies.length > 0) {
    sentences.push(`Destacan ${joinNatural(technologies.slice(0, 5))}.`);
  }

  if (keywords.length > 0) {
    sentences.push(`También se mencionan ${joinNatural(keywords.slice(0, 4))}.`);
  }

  if (workMode !== "unknown") {
    sentences.push(`La modalidad indicada es ${workModeLabels[workMode]}.`);
  }

  return sentences.join(" ");
}

function createHighlights(
  seniority: OfferSeniority,
  technologies: readonly string[],
  keywords: readonly string[],
  workMode: OfferWorkMode,
): string[] {
  const highlights = technologies
    .slice(0, 3)
    .map((technology) => `Destacar proyectos realizados con ${technology}.`);

  for (const keyword of keywords) {
    if (highlights.length >= 5) {
      break;
    }

    highlights.push(`Mencionar conocimientos de ${keyword}.`);
  }

  if (highlights.length < 2 && seniority !== "unknown") {
    highlights.push(
      `Alinear la experiencia presentada con un nivel ${seniorityLabels[seniority]}.`,
    );
  }

  if (highlights.length < 2 && workMode !== "unknown") {
    highlights.push(
      `Explicar experiencia trabajando en modalidad ${workModeLabels[workMode]}.`,
    );
  }

  while (highlights.length < 2) {
    highlights.push(
      "Aportar ejemplos concretos de los requisitos descritos en la oferta.",
    );
  }

  return highlights.slice(0, 5);
}

export function analyzeLocalOffer(offerText: string): JobOfferAnalysis {
  const normalizedText = foldText(offerText);
  const technologies = detectTechnologyNames(normalizedText);
  const seniority = detectUniqueValue(normalizedText, seniorityRules);
  const workMode = detectUniqueValue(normalizedText, workModeRules);
  const keywords = detectKeywords(normalizedText);

  return {
    summary: createSummary(seniority, technologies, keywords, workMode),
    seniority,
    technologies,
    keywords,
    workMode,
    applicationHighlights: createHighlights(
      seniority,
      technologies,
      keywords,
      workMode,
    ),
  };
}
