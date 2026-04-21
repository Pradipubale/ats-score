import { Page, SectionTitle, Bullets, type TplProps } from "./_shared";

export function ClassicTemplate({ data }: TplProps) {
  return (
    <Page style={{ fontFamily: "Georgia, 'Times New Roman', serif", padding: "40px 50px" }}>
      <div style={{ textAlign: "center", borderBottom: "2px solid #1f2937", paddingBottom: 12 }}>
        <h1 style={{ fontSize: "26px", margin: 0, letterSpacing: "0.05em" }}>{data.fullName || "Your Name"}</h1>
        <div style={{ fontSize: "12px", marginTop: 4, fontStyle: "italic" }}>{data.title}</div>
        <div style={{ fontSize: "10px", marginTop: 6 }}>
          {[data.email, data.phone, data.location, data.website].filter(Boolean).join(" • ")}
        </div>
      </div>
      {data.summary && (<><SectionTitle>Summary</SectionTitle><p style={{ margin: 0 }}>{data.summary}</p></>)}
      {data.experiences.length > 0 && (
        <>
          <SectionTitle>Experience</SectionTitle>
          {data.experiences.map((e) => (
            <div key={e.id} style={{ marginBottom: 12 }}>
              <div style={{ display: "flex", justifyContent: "space-between", fontWeight: 700 }}>
                <span>{e.company}</span><span>{e.startDate} – {e.endDate}</span>
              </div>
              <div style={{ fontStyle: "italic" }}>{e.role}{e.location ? `, ${e.location}` : ""}</div>
              <Bullets items={e.bullets} />
            </div>
          ))}
        </>
      )}
      {data.educations.length > 0 && (<><SectionTitle>Education</SectionTitle>
        {data.educations.map((e) => (
          <div key={e.id} style={{ marginBottom: 6 }}>
            <strong>{e.school}</strong> — {e.degree} <span style={{ float: "right" }}>{e.startDate} – {e.endDate}</span>
            {e.details && <div style={{ fontStyle: "italic" }}>{e.details}</div>}
          </div>
        ))}</>)}
      {data.skills.length > 0 && (<><SectionTitle>Skills</SectionTitle><p style={{ margin: 0 }}>{data.skills.join(" • ")}</p></>)}
      {data.projects.length > 0 && (<><SectionTitle>Projects</SectionTitle>
        {data.projects.map((p) => (<div key={p.id} style={{ marginBottom: 6 }}><strong>{p.name}</strong>: {p.description}</div>))}</>)}
    </Page>
  );
}
