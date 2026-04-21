import { Page, SectionTitle, Bullets, type TplProps } from "./_shared";

export function ProfessionalTemplate({ data }: TplProps) {
  const c = "#1a0dab"; // Classic Google Link Blue
  return (
    <Page>
      <div style={{ padding: "40px", fontFamily: '"Inter", "Roboto", sans-serif' }}>
        <div style={{ borderBottom: "2px solid #eee", paddingBottom: "20px", marginBottom: "20px" }}>
          <h1 style={{ fontSize: "32px", margin: 0, fontWeight: 800, color: "#111", letterSpacing: "-0.02em" }}>
            {data.fullName || "Your Name"}
          </h1>
          <div style={{ fontSize: "16px", color: c, fontWeight: 600, marginTop: "4px" }}>{data.title}</div>
          <div style={{ fontSize: "11px", color: "#666", marginTop: "12px", display: "flex", flexWrap: "wrap", gap: "15px" }}>
            {data.email && <span>{data.email}</span>}
            {data.phone && <span>{data.phone}</span>}
            {data.location && <span>{data.location}</span>}
            {data.website && <span style={{ color: c }}>{data.website}</span>}
          </div>
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "1fr", gap: "25px" }}>
          {data.summary && (
            <section>
              <div style={{ textTransform: "uppercase", fontSize: "11px", fontWeight: 700, color: "#999", letterSpacing: "0.1em", marginBottom: "8px" }}>Profile</div>
              <p style={{ margin: 0, fontSize: "13px", lineHeight: "1.6", color: "#333" }}>{data.summary}</p>
            </section>
          )}

          {data.experiences.length > 0 && (
            <section>
              <div style={{ textTransform: "uppercase", fontSize: "11px", fontWeight: 700, color: "#999", letterSpacing: "0.1em", marginBottom: "12px" }}>Experience</div>
              <div style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
                {data.experiences.map((e) => (
                  <div key={e.id}>
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline" }}>
                      <span style={{ fontSize: "15px", fontWeight: 700 }}>{e.role}</span>
                      <span style={{ fontSize: "11px", color: "#666" }}>{e.startDate} – {e.endDate}</span>
                    </div>
                    <div style={{ fontSize: "13px", color: c, fontWeight: 600, marginBottom: "8px" }}>{e.company} {e.location && `· ${e.location}`}</div>
                    <Bullets items={e.bullets} />
                  </div>
                ))}
              </div>
            </section>
          )}

          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "25px" }}>
             {data.skills.length > 0 && (
              <section>
                <div style={{ textTransform: "uppercase", fontSize: "11px", fontWeight: 700, color: "#999", letterSpacing: "0.1em", marginBottom: "10px" }}>Expertise</div>
                <div style={{ display: "flex", flexWrap: "wrap", gap: "5px" }}>
                  {data.skills.map((s, i) => (
                    <span key={i} style={{ background: "#f1f3f4", color: "#3c4043", padding: "4px 10px", borderRadius: "4px", fontSize: "11px", fontWeight: 500 }}>{s}</span>
                  ))}
                </div>
              </section>
            )}

            {data.educations.length > 0 && (
              <section>
                <div style={{ textTransform: "uppercase", fontSize: "11px", fontWeight: 700, color: "#999", letterSpacing: "0.1em", marginBottom: "10px" }}>Education</div>
                {data.educations.map((e) => (
                  <div key={e.id} style={{ marginBottom: "10px" }}>
                    <div style={{ fontSize: "13px", fontWeight: 700 }}>{e.degree}</div>
                    <div style={{ fontSize: "12px", color: "#555" }}>{e.school}</div>
                    <div style={{ fontSize: "11px", color: "#888" }}>{e.startDate} – {e.endDate}</div>
                  </div>
                ))}
              </section>
            )}
          </div>

          {data.projects.length > 0 && (
            <section>
              <div style={{ textTransform: "uppercase", fontSize: "11px", fontWeight: 700, color: "#999", letterSpacing: "0.1em", marginBottom: "10px" }}>Key Projects</div>
              <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
                {data.projects.map((p) => (
                  <div key={p.id}>
                    <div style={{ display: "flex", justifyContent: "space-between" }}>
                      <span style={{ fontSize: "13px", fontWeight: 700 }}>{p.name}</span>
                      {p.tech && <span style={{ fontSize: "11px", color: "#666" }}>{p.tech}</span>}
                    </div>
                    <div style={{ fontSize: "12px", color: "#333", marginTop: "2px" }}>{p.description}</div>
                  </div>
                ))}
              </div>
            </section>
          )}
        </div>
      </div>
    </Page>
  );
}
