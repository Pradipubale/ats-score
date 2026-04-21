import * as pdfjs from "pdfjs-dist";
import workerSrc from "pdfjs-dist/build/pdf.worker.min.mjs?url";

pdfjs.GlobalWorkerOptions.workerSrc = workerSrc;

export async function extractPdfText(file: File): Promise<string> {
  const buf = await file.arrayBuffer();
  const pdf = await pdfjs.getDocument({ data: buf }).promise;
  let out = "";
  for (let i = 1; i <= pdf.numPages; i++) {
    const page = await pdf.getPage(i);
    const content = await page.getTextContent();
    out += content.items.map((it) => ("str" in it ? (it as { str: string }).str : "")).join(" ") + "\n";
  }
  return out;
}

export function textToResumeData(text: string) {
  const lines = text.split(/\n|\r/).map((l) => l.trim()).filter(Boolean);
  const emailMatch = text.match(/[\w.+-]+@[\w-]+\.[\w.-]+/);
  const phoneMatch = text.match(/(\+?\d[\d\s().-]{7,})/);
  const fullName = lines[0] ?? "";
  return {
    fullName,
    title: lines[1] ?? "",
    email: emailMatch?.[0] ?? "",
    phone: phoneMatch?.[0] ?? "",
    location: "",
    website: "",
    summary: lines.slice(2, 6).join(" ").slice(0, 600),
    skills: [],
    experiences: [],
    educations: [],
    projects: [],
  };
}
