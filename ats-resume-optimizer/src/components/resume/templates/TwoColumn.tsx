import { Page, Bullets, type TplProps } from "./_shared";

const SH = ({ children, color }: { children: React.ReactNode; color?: string }) => (
  <h2 style={{ fontSize: "11px", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.1em", color: color ?? "#fff", margin: "14px 0 6px" }}>{children}</h2>
);

export function TwoColumnTemplate({ data }: TplProps) {
  const c = "#6366f1";
  return (
    <Page style={{ display: "flex", padding: 0 }}>
      <div style={{ width: 240, background: c, color: "#fff", padding: "32px 24px" }}>
        <h1 style={{ fontSize: "22px", margin: 0, lineHeight: 1.2 }}>{data.fullName || "Your Name"}</h1>
        <div style={{ fontSize: "11px", marginTop: 4, opacity: 0.9 }}>{data.title}</div>
        <SH>Contact</SH>
        <div style={{ fontSize: "9.5px", lineHeight: 1.6 }}>
          {data.email && <div>{data.email}</div>}
          {data.phone && <div>{data.phone}</div>}
          {data.location && <div>{data.location}</div>}
          {data.website && <div>{data.website}</div>}
        </div>
        {data.skills.length > 0 && (<><SH>Skills</SH>
          <div style={{ fontSize: "9.5px" }}>{data.skills.map((s, i) => (<div key={i} style={{ marginBottom: 2 }}>• {s}</div>))}</div></>)}
        {data.educations.length > 0 && (<><SH>Education</SH>
          {data.educations.map((e) => (<div key={e.id} style={{ fontSize: "9.5px", marginBottom: 6 }}>
            <strong>{e.degree}</strong><div>{e.school}</div><div style={{ opacity: 0.85 }}>{e.startDate}–{e.endDate}</div>
          </div>))}</>)}
      </div>
      <div style={{ flex: 1, padding: "32px 30px" }}>
        {data.summary && (<><SH color={c}>Profile</SH><p style={{ margin: 0 }}>{data.summary}</p></>)}
        {data.experiences.length > 0 && (<><SH color={c}>Experience</SH>
          {data.experiences.map((e) => (
            <div key={e.id} style={{ marginBottom: 12 }}>
              <div style={{ fontWeight: 700 }}>{e.role}</div>
              <div style={{ fontSize: "10px", color: c }}>{e.company} · {e.startDate}–{e.endDate}</div>
              <Bullets items={e.bullets} />
            </div>
          ))}</>)}
        {data.projects.length > 0 && (<><SH color={c}>Projects</SH>
          {data.projects.map((p) => (<div key={p.id} style={{ marginBottom: 6 }}><strong>{p.name}</strong> — {p.description}</div>))}</>)}
      </div>
    </Page>
  );
}
