import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { SiteHeader } from "@/components/site-header";
import { RequireAuth } from "@/components/require-auth";
import { useAuth } from "@/lib/auth-store";
import { useResumes } from "@/lib/resume-store";
import { Button } from "@/components/ui/button";
import { FileText, Plus, ScanLine, Trash2, Edit3, Calendar, Eye, Download } from "lucide-react";
import { TemplateRenderer, TEMPLATES } from "@/components/resume/templates";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { exportElementToPdf } from "@/lib/export-pdf";
import { sampleResume, type ResumeData } from "@/lib/resume-types";
import { toast } from "sonner";

export const Route = createFileRoute("/dashboard")({ component: DashboardRoute });

function DashboardRoute() {
  return (
    <RequireAuth>
      <Dashboard />
    </RequireAuth>
  );
}

import { useEffect, useState } from "react";

function Dashboard() {
  const { user, token } = useAuth();
  const { resumes: allResumes, fetchResumes, create, remove } = useResumes();
  const resumes = allResumes.filter(r => r.data.fullName || r.data.experiences.length > 0 || r.name !== 'Untitled resume');
  const nav = useNavigate();
  const [previewResume, setPreviewResume] = useState<any>(null);

  useEffect(() => {
    if (token) fetchResumes(token);
  }, [token, fetchResumes]);

  const onNew = async () => {
    if (!token) return;
    const r = await create(token, `Untitled resume`, "modern");
    if (r) {
      const id = r.id || (r as any)._id;
      nav({ to: "/builder/$id", params: { id } });
    }
  };

  const onSample = async () => {
    if (!token) return;
    const r = await create(token, `Sample resume`, "modern", sampleResume(user!.name));
    if (r) {
      const id = r.id || (r as any)._id;
      nav({ to: "/builder/$id", params: { id } });
    }
  };

  return (
    <div className="min-h-screen bg-surface">
      <SiteHeader />
      <div className="mx-auto max-w-7xl px-6 py-10">
        <div className="flex flex-col gap-2 md:flex-row md:items-end md:justify-between">
          <div>
            <h1 className="font-display text-3xl font-bold">Hi, {user?.name.split(" ")[0]} 👋</h1>
            <p className="mt-1 text-muted-foreground">Manage your resumes and run ATS checks.</p>
          </div>
          <div className="flex gap-2">
          </div>
        </div>

        {!resumes || resumes.length === 0 ? (
          <div className="mt-12 rounded-2xl border border-dashed border-border bg-surface-elevated p-12 text-center">
            <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-accent text-accent-foreground"><FileText className="h-6 w-6" /></div>
            <h2 className="mt-4 font-display text-xl font-bold">Your dashboard is empty</h2>
            <p className="mt-1 text-sm text-muted-foreground">Go to the Builder page to create your first resume.</p>
          </div>
        ) : (
          <div className="mt-8 grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {resumes?.map((r) => {
              const id = r.id || (r as any)._id;
              const tpl = TEMPLATES.find((t) => t.id === r.templateId) ?? TEMPLATES[0];
              return (
                <div key={id} className="group rounded-2xl border border-border bg-card p-5 shadow-sm transition-all hover:shadow-lg">
                  <div className="h-40 overflow-hidden rounded-lg border border-border bg-white transition-all group-hover:border-primary/30">
                    <div className="origin-top-left scale-[0.22] w-[794px]">
                      <TemplateRenderer id={r.templateId} data={r.data} />
                    </div>
                  </div>
                  <div className="mt-4 flex items-start justify-between">
                    <div>
                      <div className="font-semibold">{r.name}</div>
                      <div className="mt-0.5 flex items-center gap-1 text-xs text-muted-foreground"><Calendar className="h-3 w-3" />{new Date(r.updatedAt).toLocaleDateString()}</div>
                    </div>
                    <span className="rounded-full bg-accent px-2 py-0.5 text-[10px] font-medium text-accent-foreground">{tpl.name}</span>
                  </div>
                  {r.atsScore > 0 && (
                    <div className="mt-2 flex items-center gap-1.5">
                      <div className="h-1 flex-1 overflow-hidden rounded-full bg-muted">
                        <div className="h-full bg-primary transition-all" style={{ width: `${r.atsScore}%` }} />
                      </div>
                      <span className="text-[10px] font-bold text-primary">ATS: {r.atsScore}</span>
                    </div>
                  )}
                  <div className="mt-4 flex gap-2">
                    <Button size="sm" variant="ghost" onClick={() => setPreviewResume(r)}><Eye className="h-4 w-4" /></Button>
                    <Button size="sm" variant="ghost" onClick={() => {
                        const div = document.createElement('div');
                        div.style.position = 'absolute';
                        div.style.left = '-10000px';
                        div.style.top = '-10000px';
                        div.style.width = '794px';
                        document.body.appendChild(div);
                        
                        import('react-dom/client').then(m => {
                           const root = m.createRoot(div);
                           root.render(<TemplateRenderer id={r.templateId} data={r.data} />);
                           setTimeout(async () => {
                             await exportElementToPdf(div, `${r.name}.pdf`);
                             document.body.removeChild(div);
                             toast.success("Download started");
                           }, 500);
                        });
                    }}><Download className="h-4 w-4" /></Button>
                    <Link to="/builder/$id" params={{ id }} className="flex-1"><Button size="sm" variant="outline" className="w-full"><Edit3 className="mr-1.5 h-3.5 w-3.5" />Edit</Button></Link>
                    <Link to="/checker" search={{ rid: id }}><Button size="sm" variant="ghost" className="hover:text-primary"><ScanLine className="h-4 w-4" /></Button></Link>
                    <Button size="sm" variant="ghost" onClick={() => token && remove(token, id)}><Trash2 className="h-3.5 w-3.5 text-destructive" /></Button>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        <Dialog open={!!previewResume} onOpenChange={(o) => !o && setPreviewResume(null)}>
          <DialogContent className="max-w-4xl p-0 overflow-hidden bg-muted">
            <DialogHeader className="bg-background p-4 border-b">
              <DialogTitle className="flex items-center justify-between">
                <span>{previewResume?.name} Preview</span>
                <Link to="/builder/$id" params={{ id: previewResume?.id || previewResume?._id }}>
                   <Button size="sm"><Edit3 className="mr-2 h-4 w-4" />Edit Now</Button>
                </Link>
              </DialogTitle>
            </DialogHeader>
            <div className="max-h-[80vh] overflow-y-auto p-8 flex justify-center">
               <div className="shadow-2xl scale-[0.9] origin-top">
                 {previewResume && <TemplateRenderer id={previewResume.templateId} data={previewResume.data} />}
               </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
}
