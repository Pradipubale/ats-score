import type { ResumeData } from "@/lib/resume-types";
import { ModernTemplate } from "./templates/Modern";
import { ClassicTemplate } from "./templates/Classic";
import { ElegantTemplate } from "./templates/Elegant";
import { MinimalTemplate } from "./templates/Minimal";
import { CreativeTemplate } from "./templates/Creative";
import { ExecutiveTemplate } from "./templates/Executive";
import { TechnicalTemplate } from "./templates/Technical";
import { CompactTemplate } from "./templates/Compact";
import { TwoColumnTemplate } from "./templates/TwoColumn";
import { BoldTemplate } from "./templates/Bold";

import { ProfessionalTemplate } from "./templates/Professional";

export type TemplateId =
  | "modern" | "classic" | "elegant" | "minimal" | "creative"
  | "executive" | "technical" | "compact" | "twocolumn" | "bold" | "professional";

export const TEMPLATES: { id: TemplateId; name: string; tagline: string; accent: string }[] = [
  { id: "professional", name: "Professional", tagline: "Premium tech layout", accent: "#1a0dab" },
  { id: "modern", name: "Modern", tagline: "Clean indigo header", accent: "#4f46e5" },
  { id: "classic", name: "Classic", tagline: "Traditional serif", accent: "#1f2937" },
  { id: "elegant", name: "Elegant", tagline: "Refined editorial", accent: "#7c3aed" },
  { id: "minimal", name: "Minimal", tagline: "Pure typography", accent: "#000000" },
  { id: "creative", name: "Creative", tagline: "Vibrant accent bar", accent: "#ec4899" },
  { id: "executive", name: "Executive", tagline: "Premium centered", accent: "#0f172a" },
  { id: "technical", name: "Technical", tagline: "Engineer-friendly", accent: "#0ea5e9" },
  { id: "compact", name: "Compact", tagline: "Dense single-page", accent: "#059669" },
  { id: "twocolumn", name: "Two-Column", tagline: "Sidebar layout", accent: "#6366f1" },
  { id: "bold", name: "Bold", tagline: "Statement header", accent: "#dc2626" },
];

export function TemplateRenderer({ id, data }: { id: string; data: ResumeData }) {
  switch (id) {
    case "classic": return <ClassicTemplate data={data} />;
    case "elegant": return <ElegantTemplate data={data} />;
    case "minimal": return <MinimalTemplate data={data} />;
    case "creative": return <CreativeTemplate data={data} />;
    case "executive": return <ExecutiveTemplate data={data} />;
    case "technical": return <TechnicalTemplate data={data} />;
    case "compact": return <CompactTemplate data={data} />;
    case "twocolumn": return <TwoColumnTemplate data={data} />;
    case "bold": return <BoldTemplate data={data} />;
    case "professional": return <ProfessionalTemplate data={data} />;
    default: return <ModernTemplate data={data} />;
  }
}
