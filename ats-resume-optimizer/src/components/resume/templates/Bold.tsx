import { Page, SectionTitle, Bullets, type TplProps } from "./_shared";

export function BoldTemplate({ data }: TplProps) {
  const c = "#dc2626";
  return (
    <Page>
      <div style={{ background: "#000", color: "#fff", padding: "40px 40px" }}>
        <h1 style={{ fontSize: "40px", margin: 0, fontWeight: 900, letterSpacing: "-0.03em", textTransform: "uppercase" }}>
          {data.fullName || "Your Name"}
        </h1>
        <div style={{ height: 4, width: 60, background: c, margin: "10px 0" }} />
        <div style={{ fontSize: "13px", color: c, fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.2em" }}>{data.title}</div>
        <div style={{ fontSize: "10px", marginTop: 12, color: "#ccc" }}>
          {[data.email, data.phone, data.location, data.website].filter(Boolean).join(" / ")}
        </div>
      </div>
      <div style={{ padding: "24px 40px" }}>
        {data.summary && (<><SectionTitle color={c}>Statement</SectionTitle><p style={{ margin: 0, fontSize: "12px" }}>{data.summary}</p></>)}
        {data.experiences.length > 0 && (<><SectionTitle color={c}>Experience</SectionTitle>
          {data.experiences.map((e) => (
            <div key={e.id} style={{ marginBottom: 12 }}>
              <div style={{ fontWeight: 800, fontSize: "13px", textTransform: "uppercase" }}>{e.role}</div>
              <div style={{ fontSize: "10px", color: "#666" }}>{e.company} — {e.startDate} / {e.endDate}</div>
              <Bullets items={e.bullets} />
            </div>
          ))}</>)}
        {data.skills.length > 0 && (<><SectionTitle color={c}>Skills</SectionTitle>
          <div style={{ display: "flex", flexWrap: "wrap", gap: 4 }}>
            {data.skills.map((s, i) => (<span key={i} style={{ border: `1px solid ${c}`, color: c, padding: "2px 8px", fontSize: "10px", fontWeight: 700, textTransform: "uppercase" }}>{s}</span>))}
          </div></>)}
        {data.educations.length > 0 && (<><SectionTitle color={c}>Education</SectionTitle>
          {data.educations.map((e) => (<div key={e.id}><strong>{e.degree}</strong>, {e.school} ({e.startDate}–{e.endDate})</div>))}</>)}
        {data.projects.length > 0 && (<><SectionTitle color={c}>Projects</SectionTitle>
          {data.projects.map((p) => (<div key={p.id}><strong>{p.name}</strong> — {p.description}</div>))}</>)}
      </div>
    </Page>
  );
}
