import type { ResumeData } from "./resume-types";

const STOP = new Set([
  "the","a","an","and","or","but","of","to","in","on","at","for","with","by","from","is","are","was","were","be","been","being","have","has","had","do","does","did","will","would","could","should","may","might","can","this","that","these","those","i","you","he","she","it","we","they","as","if","than","then","so","not","no","yes","our","your","their","his","her","its","my","me","us","them","also","just","more","most","much","very","too","over","under","into","about","through","during","before","after","above","below","between","out","off","up","down","further","once",
]);

const ACTION_VERBS = [
  "led","built","designed","developed","launched","shipped","architected","implemented","optimized","reduced","increased","improved","mentored","managed","drove","created","delivered","scaled","automated","migrated","established","spearheaded","streamlined",
];

const ROLE_KEYWORDS: Record<string, string[]> = {
  "software engineer": ["react", "node", "javascript", "typescript", "sql", "git", "api", "docker", "aws", "agile", "tdd", "ci/cd"],
  "frontend developer": ["react", "css", "html", "javascript", "typescript", "tailwind", "figma", "redux", "next.js"],
  "backend developer": ["node", "express", "sql", "postgresql", "mongodb", "redis", "python", "go", "java", "microservices"],
  "designer": ["figma", "ui", "ux", "adobe", "photoshop", "illustrator", "prototyping", "wireframing", "typography"],
  "data scientist": ["python", "sql", "r", "machine learning", "pandas", "numpy", "scikit-learn", "tensorflow", "pytorch", "statistics"],
  "project manager": ["agile", "scrum", "jira", "roadmap", "stakeholders", "budgeting", "risk management", "planning"],
};

export { ROLE_KEYWORDS };

export function tokenize(text: string): string[] {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9+#./\s-]/g, " ")
    .split(/\s+/)
    .filter((w) => w.length > 1 && !STOP.has(w));
}

export function keywordSet(text: string): Set<string> {
  return new Set(tokenize(text));
}

export function resumeToText(r: ResumeData): string {
  const parts = [
    r.fullName, r.title, r.summary, r.skills.join(" "),
    ...r.experiences.flatMap((e) => [e.role, e.company, ...e.bullets]),
    ...r.educations.flatMap((e) => [e.degree, e.school, e.details ?? ""]),
    ...r.projects.flatMap((p) => [p.name, p.description, p.tech ?? ""]),
  ];
  return parts.join("\n");
}

export type AtsResult = {
  score: number;
  breakdown: { label: string; score: number; max: number; note: string }[];
  suggestions: { level: "high" | "medium" | "low"; category?: string; text: string }[];
  jdMatch?: {
    score: number;
    matched: string[];
    missing: string[];
  };
};

export function analyzeResume(data: ResumeData, jd?: string, role?: string): AtsResult {
  const breakdown: AtsResult["breakdown"] = [];
  const suggestions: AtsResult["suggestions"] = [];
  const text = resumeToText(data);
  const wordCount = text.split(/\s+/).filter(Boolean).length;
  const lowerText = text.toLowerCase();

  // 1. Role-based Keyword Match (If no JD provided)
  let keywordScore = 0;
  let matchedKeys: string[] = [];
  let missingKeys: string[] = [];
  
  const targetRole = (role || "").toLowerCase();
  const roleEntry = Object.keys(ROLE_KEYWORDS).find(k => targetRole.includes(k));
  
  if (roleEntry && (!jd || jd.trim().length < 10)) {
     const keys = ROLE_KEYWORDS[roleEntry];
     keys.forEach(k => {
        if (lowerText.includes(k)) matchedKeys.push(k);
        else missingKeys.push(k);
     });
     keywordScore = Math.round((matchedKeys.length / keys.length) * 20);
     if (missingKeys.length > 0) {
        suggestions.push({ level: "medium", text: `Your resume is missing critical ${roleEntry} keywords: ${missingKeys.slice(0, 4).join(", ")}.` });
     }
  } else {
     keywordScore = Math.min(20, (data.skills.length / 10) * 20);
  }
  breakdown.push({ label: "Technical Keywords", score: Math.round(keywordScore), max: 20, note: "Industry-standard skill match" });

  // 2. Contact (10)
  const hasEmail = /@/.test(data.email);
  const hasPhone = data.phone.replace(/\D/g, "").length >= 7;
  const hasLoc = data.location.trim().length > 0;
  const contact = (hasEmail ? 4 : 0) + (hasPhone ? 3 : 0) + (hasLoc ? 3 : 0);
  breakdown.push({ label: "Contact info", score: contact, max: 10, note: "Email, phone, location" });
  if (!hasEmail) suggestions.push({ level: "high", text: "Add a professional email address." });
  if (!hasPhone) suggestions.push({ level: "medium", text: "Add a phone number with country code." });

  // 3. Summary (10)
  const sumLen = data.summary.trim().split(/\s+/).filter(Boolean).length;
  const summary = sumLen >= 30 && sumLen <= 80 ? 10 : sumLen >= 15 ? 6 : sumLen > 0 ? 3 : 0;
  breakdown.push({ label: "Professional summary", score: summary, max: 10, note: `${sumLen} words (30–80 target)` });

  // 4. Experience depth (25)
  const expCount = data.experiences.length;
  const allBullets = data.experiences.flatMap((e) => e.bullets).filter((b) => b.trim());
  const bulletAvg = allBullets.length / Math.max(1, expCount);
  let exp = Math.min(15, expCount * 5) + Math.min(10, bulletAvg * 3);
  breakdown.push({ label: "Experience detail", score: Math.min(25, Math.round(exp)), max: 25, note: `${expCount} roles listed` });

  // 5. Quantified impact (15)
  const numericBullets = allBullets.filter((b) => /\d+(%|k|m|x|\+)?/i.test(b)).length;
  const quant = Math.min(15, Math.round((numericBullets / Math.max(1, allBullets.length)) * 15));
  breakdown.push({ label: "Quantified impact", score: quant, max: 15, note: "Usage of metrics and numbers" });

  // 6. Action verbs (10)
  const verbBullets = allBullets.filter((b) => ACTION_VERBS.some((v) => b.toLowerCase().includes(v)));
  const verbs = Math.min(10, Math.round((verbBullets.length / Math.max(1, allBullets.length)) * 10));
  breakdown.push({ label: "Action-oriented", score: verbs, max: 10, note: "Usage of strong verbs" });

  // 7. Length & Format (10)
  const lenScore = wordCount >= 300 && wordCount <= 800 ? 10 : wordCount >= 150 ? 6 : wordCount > 0 ? 4 : 0;
  breakdown.push({ label: "Length & Layout", score: lenScore, max: 10, note: `${wordCount} words` });

  let total = breakdown.reduce((s, b) => s + b.score, 0);
  total = Math.min(100, Math.round(total));

  let jdMatch: AtsResult["jdMatch"];
  if (jd && jd.trim().length > 20) {
    const jdKeys = keywordSet(jd);
    const resumeKeys = keywordSet(text);
    const matched: string[] = [];
    const missing: string[] = [];
    jdKeys.forEach((k) => {
      if (resumeKeys.has(k)) matched.push(k);
      else missing.push(k);
    });
    const ratio = matched.length / Math.max(1, jdKeys.size);
    const jdScore = Math.round(ratio * 100);
    jdMatch = {
      score: jdScore,
      matched: matched.sort().slice(0, 40),
      missing: missing.sort((a, b) => b.length - a.length).slice(0, 25),
    };
  }

  return { score: total, breakdown, suggestions, jdMatch };
}
