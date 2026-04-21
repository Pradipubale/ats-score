import { Page, Bullets, type TplProps } from "./_shared";

const H = ({ children }: { children: React.ReactNode }) => (
  <h2 style={{ fontSize: "10px", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.2em", color: "#000", margin: "20px 0 8px" }}>{children}</h2>
);

export function MinimalTemplate({ data }: TplProps) {
  return (
    <Page style={{ padding: "50px 60px", fontSize: "10.5px" }}>
      <h1 style={{ fontSize: "24px", margin: 0, fontWeight: 300, letterSpacing: "0.05em" }}>{data.fullName || "Your Name"}</h1>
      <div style={{ fontSize: "11px", marginTop: 4, color: "#555" }}>{data.title}</div>
      <div style={{ fontSize: "9px", marginTop: 6, color: "#777" }}>
        {[data.email, data.phone, data.location, data.website].filter(Boolean).join("   ")}
      </div>
      {data.summary && (<><H>About</H><p style={{ margin: 0 }}>{data.summary}</p></>)}
      {data.experiences.length > 0 && (<><H>Work</H>
        {data.experiences.map((e) => (
          <div key={e.id} style={{ marginBottom: 10 }}>
            <div style={{ display: "flex", justifyContent: "space-between" }}>
              <span><strong>{e.role}</strong>, {e.company}</span><span style={{ color: "#999" }}>{e.startDate}—{e.endDate}</span>
            </div>
            <Bullets items={e.bullets} />
          </div>
        ))}</>)}
      {data.skills.length > 0 && (<><H>Skills</H><p style={{ margin: 0 }}>{data.skills.join(", ")}</p></>)}
      {data.educations.length > 0 && (<><H>Education</H>
        {data.educations.map((e) => (<div key={e.id}><strong>{e.school}</strong> — {e.degree} <span style={{ color: "#999" }}>({e.startDate}–{e.endDate})</span></div>))}</>)}
      {data.projects.length > 0 && (<><H>Projects</H>
        {data.projects.map((p) => (<div key={p.id} style={{ marginBottom: 4 }}><strong>{p.name}</strong> — {p.description}</div>))}</>)}
    </Page>
  );
}
