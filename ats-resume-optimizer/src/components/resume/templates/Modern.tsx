import { Page, SectionTitle, Bullets, type TplProps } from "./_shared";

export function ModernTemplate({ data }: TplProps) {
  const c = "#4f46e5";
  return (
    <Page>
      <div style={{ background: c, color: "#fff", padding: "32px 40px" }}>
        <h1 style={{ fontSize: "28px", margin: 0, fontWeight: 700 }}>{data.fullName || "Your Name"}</h1>
        <div style={{ fontSize: "13px", opacity: 0.9, marginTop: 4 }}>{data.title}</div>
        <div style={{ fontSize: "10px", marginTop: 10, opacity: 0.95 }}>
          {[data.email, data.phone, data.location, data.website].filter(Boolean).join("  •  ")}
        </div>
      </div>
      <div style={{ padding: "20px 40px 40px" }}>
        {data.summary && (<><SectionTitle color={c}>Summary</SectionTitle><p style={{ margin: 0 }}>{data.summary}</p></>)}
        {data.skills.length > 0 && (
          <>
            <SectionTitle color={c}>Skills</SectionTitle>
            <div style={{ display: "flex", flexWrap: "wrap", gap: "6px" }}>
              {data.skills.map((s, i) => (
                <span key={i} style={{ background: "#eef2ff", color: c, padding: "3px 10px", borderRadius: "12px", fontSize: "10px" }}>{s}</span>
              ))}
            </div>
          </>
        )}
        {data.experiences.length > 0 && (
          <>
            <SectionTitle color={c}>Experience</SectionTitle>
            {data.experiences.map((e) => (
              <div key={e.id} style={{ marginBottom: 12 }}>
                <div style={{ display: "flex", justifyContent: "space-between", fontWeight: 600 }}>
                  <span>{e.role} — {e.company}</span>
                  <span style={{ fontWeight: 400, fontSize: "10px" }}>{e.startDate} – {e.endDate}</span>
                </div>
                {e.location && <div style={{ fontSize: "10px", color: "#666" }}>{e.location}</div>}
                <Bullets items={e.bullets} />
              </div>
            ))}
          </>
        )}
        {data.projects.length > 0 && (
          <>
            <SectionTitle color={c}>Projects</SectionTitle>
            {data.projects.map((p) => (
              <div key={p.id} style={{ marginBottom: 8 }}>
                <strong>{p.name}</strong>{p.tech && <span style={{ color: "#666" }}> · {p.tech}</span>}
                <div>{p.description}</div>
              </div>
            ))}
          </>
        )}
        {data.educations.length > 0 && (
          <>
            <SectionTitle color={c}>Education</SectionTitle>
            {data.educations.map((e) => (
              <div key={e.id} style={{ marginBottom: 6, display: "flex", justifyContent: "space-between" }}>
                <span><strong>{e.degree}</strong> — {e.school}{e.details ? ` · ${e.details}` : ""}</span>
                <span style={{ fontSize: "10px" }}>{e.startDate} – {e.endDate}</span>
              </div>
            ))}
          </>
        )}
      </div>
    </Page>
  );
}
