import type { ResumeData } from "@/lib/resume-types";

export const Page = ({ children, style }: { children: React.ReactNode; style?: React.CSSProperties }) => (
  <div
    style={{
      width: "794px",
      minHeight: "1123px",
      background: "#fff",
      color: "#111",
      fontFamily: "Inter, system-ui, sans-serif",
      fontSize: "11px",
      lineHeight: 1.5,
      ...style,
    }}
  >
    {children}
  </div>
);

export const SectionTitle = ({ children, color = "#111", border = true }: { children: React.ReactNode; color?: string; border?: boolean }) => (
  <h2
    style={{
      fontSize: "12px",
      fontWeight: 700,
      letterSpacing: "0.08em",
      textTransform: "uppercase",
      color,
      margin: "16px 0 8px",
      paddingBottom: border ? "4px" : 0,
      borderBottom: border ? `1px solid ${color}` : "none",
    }}
  >
    {children}
  </h2>
);

export const Bullets = ({ items }: { items: string[] }) => (
  <ul style={{ margin: "4px 0 0 16px", padding: 0 }}>
    {items.filter(Boolean).map((b, i) => (
      <li key={i} style={{ marginBottom: "3px" }}>{b}</li>
    ))}
  </ul>
);

export type TplProps = { data: ResumeData };
