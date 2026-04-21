import { Page, SectionTitle, Bullets, type TplProps } from "./_shared";

export function ElegantTemplate({ data }: TplProps) {
  const c = "#7c3aed";
  return (
    <Page style={{ padding: "40px 50px", fontFamily: "Georgia, serif" }}>
      <h1 style={{ fontSize: "32px", margin: 0, fontWeight: 400, color: c, letterSpacing: "-0.01em" }}>{data.fullName || "Your Name"}</h1>
      <div style={{ fontSize: "12px", color: "#666", marginTop: 4, letterSpacing: "0.15em", textTransform: "uppercase" }}>{data.title}</div>
      <div style={{ fontSize: "10px", marginTop: 8, color: "#444" }}>
        {[data.email, data.phone, data.location, data.website].filter(Boolean).join("  /  ")}
      </div>
      <div style={{ height: 1, background: c, margin: "20px 0", opacity: 0.3 }} />
      {data.summary && <p style={{ fontStyle: "italic", color: "#333", margin: "0 0 12px" }}>{data.summary}</p>}
      {data.experiences.length > 0 && (<><SectionTitle color={c} border={false}>Experience</SectionTitle>
        {data.experiences.map((e) => (
          <div key={e.id} style={{ marginBottom: 14, paddingLeft: 12, borderLeft: `2px solid ${c}` }}>
            <div style={{ fontWeight: 600 }}>{e.role}</div>
            <div style={{ fontSize: "10px", color: "#666" }}>{e.company} · {e.startDate} – {e.endDate}</div>
            <Bullets items={e.bullets} />
          </div>
        ))}</>)}
      {data.skills.length > 0 && (<><SectionTitle color={c} border={false}>Expertise</SectionTitle>
        <p style={{ margin: 0 }}>{data.skills.join(" · ")}</p></>)}
      {data.educations.length > 0 && (<><SectionTitle color={c} border={false}>Education</SectionTitle>
        {data.educations.map((e) => (<div key={e.id} style={{ marginBottom: 4 }}><strong>{e.degree}</strong>, {e.school} <span style={{ color: "#666" }}>({e.startDate}–{e.endDate})</span></div>))}</>)}
      {data.projects.length > 0 && (<><SectionTitle color={c} border={false}>Projects</SectionTitle>
        {data.projects.map((p) => (<div key={p.id} style={{ marginBottom: 4 }}><strong>{p.name}</strong> — {p.description}</div>))}</>)}
    </Page>
  );
}
