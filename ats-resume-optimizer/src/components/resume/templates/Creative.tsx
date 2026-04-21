import { Page, SectionTitle, Bullets, type TplProps } from "./_shared";

export function CreativeTemplate({ data }: TplProps) {
  const c = "#ec4899";
  return (
    <Page style={{ padding: "0", display: "flex" }}>
      <div style={{ width: 8, background: `linear-gradient(180deg, ${c}, #8b5cf6)` }} />
      <div style={{ padding: "40px 40px", flex: 1 }}>
        <h1 style={{ fontSize: "30px", margin: 0, fontWeight: 800 }}>{data.fullName || "Your Name"}</h1>
        <div style={{ fontSize: "13px", color: c, fontWeight: 600, marginTop: 2 }}>{data.title}</div>
        <div style={{ fontSize: "10px", marginTop: 8, color: "#555" }}>
          {[data.email, data.phone, data.location, data.website].filter(Boolean).join(" · ")}
        </div>
        {data.summary && (<><SectionTitle color={c}>Hello</SectionTitle><p style={{ margin: 0 }}>{data.summary}</p></>)}
        {data.experiences.length > 0 && (<><SectionTitle color={c}>Experience</SectionTitle>
          {data.experiences.map((e) => (
            <div key={e.id} style={{ marginBottom: 12 }}>
              <div style={{ fontWeight: 700 }}>{e.role} <span style={{ color: c }}>@ {e.company}</span></div>
              <div style={{ fontSize: "10px", color: "#666" }}>{e.startDate} – {e.endDate}{e.location ? ` · ${e.location}` : ""}</div>
              <Bullets items={e.bullets} />
            </div>
          ))}</>)}
        {data.skills.length > 0 && (<><SectionTitle color={c}>Toolkit</SectionTitle>
          <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
            {data.skills.map((s, i) => (<span key={i} style={{ background: "#fce7f3", color: "#9d174d", padding: "3px 10px", borderRadius: 4, fontSize: "10px", fontWeight: 600 }}>{s}</span>))}
          </div></>)}
        {data.projects.length > 0 && (<><SectionTitle color={c}>Projects</SectionTitle>
          {data.projects.map((p) => (<div key={p.id} style={{ marginBottom: 6 }}><strong>{p.name}</strong> — {p.description}</div>))}</>)}
        {data.educations.length > 0 && (<><SectionTitle color={c}>Education</SectionTitle>
          {data.educations.map((e) => (<div key={e.id}><strong>{e.degree}</strong>, {e.school} ({e.startDate}–{e.endDate})</div>))}</>)}
      </div>
    </Page>
  );
}
