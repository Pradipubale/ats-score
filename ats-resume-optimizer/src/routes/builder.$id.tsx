import { useEffect, useMemo, useRef, useState } from "react";
import { createFileRoute, useParams, Link, useNavigate } from "@tanstack/react-router";
import { SiteHeader } from "@/components/site-header";
import { RequireAuth } from "@/components/require-auth";
import { useResumes } from "@/lib/resume-store";
import { TemplateRenderer, TEMPLATES } from "@/components/resume/templates";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Download, Plus, Trash2, ScanLine, Wand2, History, Save } from "lucide-react";
import { exportElementToPdf } from "@/lib/export-pdf";
import { sampleResume, type Experience, type Education, type Project } from "@/lib/resume-types";
import { toast } from "sonner";

export const Route = createFileRoute("/builder/$id")({ component: BuilderRoute });

function BuilderRoute() {
  return (<RequireAuth><Builder /></RequireAuth>);
}

import { useAuth } from "@/lib/auth-store";

function Builder() {
  const { id } = useParams({ from: "/builder/$id" });
  const { token } = useAuth();
  const { resumes, get, update, fetchResumes } = useResumes();
  
  useEffect(() => {
    if (token && resumes.length === 0) fetchResumes(token);
  }, [token, resumes.length, fetchResumes]);

  const resume = get(id);
  const [name, setName] = useState(resume?.name ?? "");
  const [templateId, setTemplateId] = useState(resume?.templateId ?? "modern");
  const [data, setData] = useState(resume?.data);
  const previewRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!resume) {
      const r = get(id);
      if (r) {
        setName(r.name);
        setTemplateId(r.templateId);
        setData(r.data);
      }
    }
  }, [resume, id, get]);

  useEffect(() => {
    if (!data || !token) return;
    const t = setTimeout(() => update(token, id, { name, templateId, data }), 500);
    return () => clearTimeout(t);
  }, [name, templateId, data, id, update, token]);

  if (!resume || !data) {
    return (
      <div className="min-h-screen bg-surface">
        <SiteHeader />
        <div className="mx-auto max-w-2xl px-6 py-20 text-center">
          <h1 className="font-display text-2xl font-bold">Resume not found</h1>
          <Link to="/dashboard"><Button className="mt-4">Back to dashboard</Button></Link>
        </div>
      </div>
    );
  }

  const set = <K extends keyof typeof data>(k: K, v: (typeof data)[K]) => setData({ ...data, [k]: v });
  const exportPdf = async () => {
    if (!previewRef.current) return;
    toast.promise(exportElementToPdf(previewRef.current, `${name || "resume"}.pdf`), { loading: "Generating PDF...", success: "Downloaded!", error: "Export failed" });
  };

  return (
    <div className="min-h-screen bg-surface">
      <SiteHeader />
      <div className="mx-auto max-w-[1600px] px-4 py-6">
        <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <Input value={name} onChange={(e) => setName(e.target.value)} className="h-9 w-64 font-semibold" />
            <span className="text-xs text-muted-foreground">Auto-saved</span>
          </div>
          <div className="flex flex-wrap gap-2">
            <Button variant="outline" size="sm" onClick={() => setData(sampleResume())}><Wand2 className="mr-1.5 h-4 w-4" />Load sample</Button>
            <Link to="/checker" search={{ rid: id }}><Button variant="outline" size="sm"><ScanLine className="mr-1.5 h-4 w-4" />Check ATS</Button></Link>
            <Button size="sm" variant="secondary" onClick={() => { update(token!, id, { name, templateId, data }); toast.success("Saved successfully!"); nav({ to: "/dashboard" }); }}><Save className="mr-1.5 h-4 w-4" />Save & Exit</Button>
            <Button size="sm" onClick={exportPdf} className="bg-gradient-primary text-primary-foreground"><Download className="mr-1.5 h-4 w-4" />Export PDF</Button>
          </div>
        </div>

        <div className="grid gap-6 lg:grid-cols-[440px_1fr]">
          {/* Editor */}
          <div className="rounded-2xl border border-border bg-card p-4 shadow-sm lg:max-h-[calc(100vh-160px)] lg:overflow-y-auto">
            <Tabs defaultValue="template">
              <TabsList className="grid w-full grid-cols-5">
                <TabsTrigger value="template">Style</TabsTrigger>
                <TabsTrigger value="basics">Basics</TabsTrigger>
                <TabsTrigger value="exp">Work</TabsTrigger>
                <TabsTrigger value="edu">Edu</TabsTrigger>
                <TabsTrigger value="proj">More</TabsTrigger>
              </TabsList>

              <TabsContent value="template" className="mt-4 space-y-3">
                <Label>Pick a template</Label>
                <div className="grid grid-cols-2 gap-2">
                  {TEMPLATES.map((t) => (
                    <button key={t.id} onClick={() => setTemplateId(t.id)}
                      className={`rounded-lg border-2 p-2 text-left transition-all ${templateId === t.id ? "border-primary shadow-glow" : "border-border hover:border-primary/40"}`}>
                      <div className="aspect-[3/4] overflow-hidden rounded" style={{ background: `linear-gradient(180deg, ${t.accent}15, white)` }}>
                        <div className="h-1" style={{ background: t.accent }} />
                        <div className="space-y-0.5 p-1.5">
                          <div className="h-1 w-2/3 rounded bg-foreground/60" />
                          {Array.from({ length: 5 }).map((_, i) => <div key={i} className="h-0.5 rounded bg-foreground/15" style={{ width: `${50 + i * 8}%` }} />)}
                        </div>
                      </div>
                      <div className="mt-1.5 text-xs font-semibold">{t.name}</div>
                    </button>
                  ))}
                </div>
              </TabsContent>

              <TabsContent value="basics" className="mt-4 space-y-3">
                {(["fullName","title","email","phone","location","website"] as const).map((f) => (
                  <div key={f} className="space-y-1"><Label className="capitalize text-xs">{f.replace(/([A-Z])/g," $1")}</Label>
                    <Input value={data[f]} onChange={(e) => set(f, e.target.value)} /></div>
                ))}
                <div className="space-y-1"><Label className="text-xs">Summary</Label>
                  <Textarea rows={4} value={data.summary} onChange={(e) => set("summary", e.target.value)} placeholder="A 30–80 word professional summary..." /></div>
                <div className="space-y-1"><Label className="text-xs">Skills (comma separated)</Label>
                  <Textarea rows={2} value={data.skills.join(", ")} onChange={(e) => set("skills", e.target.value.split(",").map((s) => s.trim()).filter(Boolean))} /></div>
              </TabsContent>

              <TabsContent value="exp" className="mt-4 space-y-3">
                {data.experiences.map((e, idx) => (
                  <div key={e.id} className="rounded-lg border border-border p-3 space-y-2">
                    <div className="flex items-center justify-between"><span className="text-xs font-semibold text-muted-foreground">Role #{idx+1}</span>
                      <Button size="sm" variant="ghost" onClick={() => set("experiences", data.experiences.filter((x) => x.id !== e.id))}><Trash2 className="h-3.5 w-3.5 text-destructive" /></Button></div>
                    {(["role","company","location","startDate","endDate"] as const).map((f) => (
                      <Input key={f} placeholder={f} value={(e as Experience)[f] ?? ""} onChange={(ev) => {
                        const next = data.experiences.map((x) => x.id === e.id ? { ...x, [f]: ev.target.value } : x); set("experiences", next);
                      }} />
                    ))}
                    <Textarea rows={4} placeholder="• Bullet 1&#10;• Bullet 2" value={e.bullets.join("\n")}
                      onChange={(ev) => set("experiences", data.experiences.map((x) => x.id === e.id ? { ...x, bullets: ev.target.value.split("\n").map((s) => s.replace(/^[•\-*]\s*/, "")) } : x))} />
                  </div>
                ))}
                <Button size="sm" variant="outline" className="w-full" onClick={() => set("experiences", [...data.experiences, { id: crypto.randomUUID(), company: "", role: "", startDate: "", endDate: "", bullets: [""] }])}>
                  <Plus className="mr-1.5 h-4 w-4" />Add experience
                </Button>
              </TabsContent>

              <TabsContent value="edu" className="mt-4 space-y-3">
                {data.educations.map((e) => (
                  <div key={e.id} className="rounded-lg border border-border p-3 space-y-2">
                    <div className="flex justify-end"><Button size="sm" variant="ghost" onClick={() => set("educations", data.educations.filter((x) => x.id !== e.id))}><Trash2 className="h-3.5 w-3.5 text-destructive" /></Button></div>
                    {(["school","degree","startDate","endDate","details"] as const).map((f) => (
                      <Input key={f} placeholder={f} value={(e as Education)[f] ?? ""} onChange={(ev) => set("educations", data.educations.map((x) => x.id === e.id ? { ...x, [f]: ev.target.value } : x))} />
                    ))}
                  </div>
                ))}
                <Button size="sm" variant="outline" className="w-full" onClick={() => set("educations", [...data.educations, { id: crypto.randomUUID(), school: "", degree: "", startDate: "", endDate: "" }])}><Plus className="mr-1.5 h-4 w-4" />Add education</Button>
              </TabsContent>

              <TabsContent value="proj" className="mt-4 space-y-3">
                <div className="text-xs font-semibold text-muted-foreground">Projects</div>
                {data.projects.map((p) => (
                  <div key={p.id} className="rounded-lg border border-border p-3 space-y-2">
                    <div className="flex justify-end"><Button size="sm" variant="ghost" onClick={() => set("projects", data.projects.filter((x) => x.id !== p.id))}><Trash2 className="h-3.5 w-3.5 text-destructive" /></Button></div>
                    {(["name","tech","link"] as const).map((f) => (
                      <Input key={f} placeholder={f} value={(p as Project)[f] ?? ""} onChange={(ev) => set("projects", data.projects.map((x) => x.id === p.id ? { ...x, [f]: ev.target.value } : x))} />
                    ))}
                    <Textarea rows={2} placeholder="Description" value={p.description} onChange={(ev) => set("projects", data.projects.map((x) => x.id === p.id ? { ...x, description: ev.target.value } : x))} />
                  </div>
                ))}
                <Button size="sm" variant="outline" className="w-full" onClick={() => set("projects", [...data.projects, { id: crypto.randomUUID(), name: "", description: "" }])}><Plus className="mr-1.5 h-4 w-4" />Add project</Button>

                {resume.versions?.length > 0 && (
                  <div className="mt-6 rounded-lg border border-border p-3">
                    <div className="mb-2 flex items-center gap-2 text-xs font-semibold text-muted-foreground"><History className="h-3.5 w-3.5" />Version history</div>
                    {resume.versions?.map((v, i) => (
                      <div key={i} className="flex items-center justify-between py-1 text-xs">
                        <span>{new Date(v.at).toLocaleString()}</span>
                        <Button size="sm" variant="ghost" onClick={() => { setData(v.data); toast.success("Version restored"); }}>Restore</Button>
                      </div>
                    ))}
                  </div>
                )}
              </TabsContent>
            </Tabs>
          </div>

          {/* Preview */}
          <div className="lg:max-h-[calc(100vh-160px)] lg:overflow-y-auto">
            <PreviewArea innerRef={previewRef}>
              <TemplateRenderer id={templateId} data={data} />
            </PreviewArea>
          </div>
        </div>
      </div>
    </div>
  );
}

function PreviewArea({ children, innerRef }: { children: React.ReactNode; innerRef: React.RefObject<HTMLDivElement | null> }) {
  const [zoom, setZoom] = useState(0.78);
  const containerW = useMemo(() => 794 * zoom + 40, [zoom]);
  return (
    <div className="rounded-2xl border border-border bg-gradient-mesh p-6">
      <div className="mb-3 flex items-center gap-2 text-xs">
        <span className="text-muted-foreground">Zoom</span>
        <input type="range" min={0.5} max={1.2} step={0.02} value={zoom} onChange={(e) => setZoom(parseFloat(e.target.value))} className="flex-1 max-w-xs" />
        <span className="font-medium">{Math.round(zoom * 100)}%</span>
      </div>
      <div className="mx-auto" style={{ width: containerW }}>
        <div style={{ width: 794 * zoom, height: 1123 * zoom, overflow: "hidden", boxShadow: "var(--shadow-lg)" }}>
          <div ref={innerRef} style={{ transform: `scale(${zoom})`, transformOrigin: "top left", width: 794 }}>
            {children}
          </div>
        </div>
      </div>
    </div>
  );
}
