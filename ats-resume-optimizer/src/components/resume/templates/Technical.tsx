import { Page, SectionTitle, Bullets, type TplProps } from "./_shared";

export function TechnicalTemplate({ data }: TplProps) {
  const c = "#0ea5e9";
  return (
    <Page style={{ padding: "30px 40px", fontFamily: "'JetBrains Mono', 'Fira Code', monospace", fontSize: "10.5px" }}>
      <div style={{ borderTop: `4px solid ${c}`, paddingTop: 16 }}>
        <h1 style={{ fontSize: "24px", margin: 0, fontWeight: 700 }}>{data.fullName || "Your Name"}</h1>
        <div style={{ color: c, fontSize: "12px" }}>// {data.title}</div>
        <div style={{ fontSize: "9px", marginTop: 6, color: "#555" }}>
          {[data.email, data.phone, data.location, data.website].filter(Boolean).map((x, i) => (<span key={i}>{i > 0 && " | "}{x}</span>))}
        </div>
      </div>
      {data.summary && (<><SectionTitle color={c}>$ whoami</SectionTitle><p style={{ margin: 0 }}>{data.summary}</p></>)}
      {data.skills.length > 0 && (<><SectionTitle color={c}>$ stack</SectionTitle>
        <div style={{ display: "flex", flexWrap: "wrap", gap: 4 }}>
          {data.skills.map((s, i) => (<span key={i} style={{ background: "#0f172a", color: "#7dd3fc", padding: "2px 8px", borderRadius: 3, fontSize: "9.5px" }}>{s}</span>))}
        </div></>)}
      {data.experiences.length > 0 && (<><SectionTitle color={c}>$ experience</SectionTitle>
        {data.experiences.map((e) => (
          <div key={e.id} style={{ marginBottom: 10 }}>
            <div><strong>{e.company}</strong> :: {e.role} <span style={{ color: "#666", float: "right" }}>{e.startDate} → {e.endDate}</span></div>
            <Bullets items={e.bullets} />
          </div>
        ))}</>)}
      {data.projects.length > 0 && (<><SectionTitle color={c}>$ projects</SectionTitle>
        {data.projects.map((p) => (<div key={p.id} style={{ marginBottom: 4 }}><strong>{p.name}</strong>{p.tech ? ` [${p.tech}]` : ""} — {p.description}</div>))}</>)}
      {data.educations.length > 0 && (<><SectionTitle color={c}>$ education</SectionTitle>
        {data.educations.map((e) => (<div key={e.id}>{e.school} — {e.degree} ({e.startDate}–{e.endDate})</div>))}</>)}
    </Page>
  );
}
