import { Page, SectionTitle, Bullets, type TplProps } from "./_shared";

export function ExecutiveTemplate({ data }: TplProps) {
  const c = "#0f172a";
  return (
    <Page style={{ padding: "40px 55px", fontFamily: "Georgia, serif" }}>
      <div style={{ textAlign: "center" }}>
        <h1 style={{ fontSize: "30px", margin: 0, color: c, fontWeight: 700 }}>{data.fullName || "Your Name"}</h1>
        <div style={{ fontSize: "12px", letterSpacing: "0.3em", textTransform: "uppercase", color: "#475569", marginTop: 6 }}>{data.title}</div>
        <div style={{ height: 2, width: 80, background: c, margin: "12px auto" }} />
        <div style={{ fontSize: "10px" }}>{[data.email, data.phone, data.location, data.website].filter(Boolean).join("   |   ")}</div>
      </div>
      {data.summary && (<><SectionTitle color={c}>Executive Summary</SectionTitle><p style={{ margin: 0 }}>{data.summary}</p></>)}
      {data.experiences.length > 0 && (<><SectionTitle color={c}>Professional Experience</SectionTitle>
        {data.experiences.map((e) => (
          <div key={e.id} style={{ marginBottom: 14 }}>
            <div style={{ display: "flex", justifyContent: "space-between" }}>
              <strong style={{ fontSize: "12px" }}>{e.company}</strong><span>{e.startDate} – {e.endDate}</span>
            </div>
            <div style={{ fontStyle: "italic", color: "#475569" }}>{e.role}</div>
            <Bullets items={e.bullets} />
          </div>
        ))}</>)}
      {data.educations.length > 0 && (<><SectionTitle color={c}>Education</SectionTitle>
        {data.educations.map((e) => (<div key={e.id}><strong>{e.degree}</strong>, {e.school} — {e.startDate}–{e.endDate}{e.details ? ` · ${e.details}` : ""}</div>))}</>)}
      {data.skills.length > 0 && (<><SectionTitle color={c}>Core Competencies</SectionTitle><p style={{ margin: 0 }}>{data.skills.join("  •  ")}</p></>)}
    </Page>
  );
}
