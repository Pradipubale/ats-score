import { Page, Bullets, type TplProps } from "./_shared";

const H = ({ children, c }: { children: React.ReactNode; c: string }) => (
  <h2 style={{ fontSize: "10px", fontWeight: 700, textTransform: "uppercase", color: c, margin: "10px 0 4px", borderBottom: `1px solid ${c}`, paddingBottom: 2 }}>{children}</h2>
);

export function CompactTemplate({ data }: TplProps) {
  const c = "#059669";
  return (
    <Page style={{ padding: "24px 32px", fontSize: "9.5px", lineHeight: 1.4 }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end", borderBottom: `2px solid ${c}`, paddingBottom: 6 }}>
        <div>
          <h1 style={{ fontSize: "20px", margin: 0 }}>{data.fullName || "Your Name"}</h1>
          <div style={{ color: c, fontSize: "11px" }}>{data.title}</div>
        </div>
        <div style={{ fontSize: "9px", textAlign: "right" }}>
          {[data.email, data.phone, data.location, data.website].filter(Boolean).map((x, i) => (<div key={i}>{x}</div>))}
        </div>
      </div>
      {data.summary && (<><H c={c}>Summary</H><p style={{ margin: 0 }}>{data.summary}</p></>)}
      {data.skills.length > 0 && (<><H c={c}>Skills</H><p style={{ margin: 0 }}>{data.skills.join(" · ")}</p></>)}
      {data.experiences.length > 0 && (<><H c={c}>Experience</H>
        {data.experiences.map((e) => (
          <div key={e.id} style={{ marginBottom: 6 }}>
            <div><strong>{e.role}</strong>, {e.company} <span style={{ float: "right", color: "#666" }}>{e.startDate}–{e.endDate}</span></div>
            <Bullets items={e.bullets} />
          </div>
        ))}</>)}
      {data.educations.length > 0 && (<><H c={c}>Education</H>
        {data.educations.map((e) => (<div key={e.id}><strong>{e.degree}</strong>, {e.school} ({e.startDate}–{e.endDate})</div>))}</>)}
      {data.projects.length > 0 && (<><H c={c}>Projects</H>
        {data.projects.map((p) => (<div key={p.id}><strong>{p.name}</strong> — {p.description}</div>))}</>)}
    </Page>
  );
}
