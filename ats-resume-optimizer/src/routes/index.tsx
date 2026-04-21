import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { SiteHeader } from "@/components/site-header";
import { TEMPLATES } from "@/components/resume/templates";
import { ScanLine, FileText, Target, Sparkles, CheckCircle2, ArrowRight, Layers } from "lucide-react";

import { useEffect } from "react";
import { useAuth } from "@/lib/auth-store";

export const Route = createFileRoute("/")({
  component: Landing,
});

function Landing() {
  const { user } = useAuth();
  const nav = useNavigate();

  useEffect(() => {
    if (user) nav({ to: "/dashboard" });
  }, [user, nav]);

  return (
    <div className="min-h-screen">
      <SiteHeader />

      {/* Hero */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-hero opacity-70" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_10%,oklch(0.92_0.08_268/0.4),transparent_50%)]" />
        <div className="relative mx-auto max-w-7xl px-6 py-24 md:py-32">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }} className="mx-auto max-w-3xl text-center">
            <div className="mx-auto mb-6 inline-flex items-center gap-2 rounded-full border border-border bg-surface-elevated px-4 py-1.5 text-xs font-medium text-muted-foreground shadow-sm">
              <Sparkles className="h-3.5 w-3.5 text-primary" />
              From draft to dream job — in one place
            </div>
            <h1 className="font-display text-5xl font-extrabold leading-[1.05] tracking-tight md:text-7xl">
              Build resumes that <span className="text-gradient">beat the ATS</span>.
            </h1>
            <p className="mx-auto mt-6 max-w-2xl text-lg text-muted-foreground md:text-xl">
              Pick from 10 polished templates, score your resume instantly, and get specific, actionable suggestions to land more interviews.
            </p>
            <div className="mt-10 flex flex-col items-center justify-center gap-3 sm:flex-row">
              <Link to="/signup">
                <Button size="lg" className="bg-gradient-primary text-primary-foreground shadow-glow hover:opacity-95">
                  Create your resume <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </Link>
              <Link to="/checker">
                <Button size="lg" variant="outline">
                  <ScanLine className="mr-2 h-4 w-4" /> Check your ATS score
                </Button>
              </Link>
            </div>
            <div className="mt-8 flex flex-wrap items-center justify-center gap-x-6 gap-y-2 text-sm text-muted-foreground">
              {["10 ATS-friendly templates", "Instant scoring", "PDF export", "Job description matching"].map((t) => (
                <div key={t} className="flex items-center gap-1.5"><CheckCircle2 className="h-4 w-4 text-success" />{t}</div>
              ))}
            </div>
          </motion.div>

          {/* Mockup */}
          <motion.div initial={{ opacity: 0, y: 40 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8, delay: 0.2 }} className="relative mx-auto mt-16 max-w-5xl">
            <div className="rounded-2xl border border-border bg-surface-elevated p-2 shadow-lg">
              <div className="grid gap-3 rounded-xl bg-gradient-mesh p-6 md:grid-cols-5">
                <div className="md:col-span-2 space-y-3">
                  <div className="rounded-lg bg-card p-4 shadow-md">
                    <div className="text-xs font-semibold text-muted-foreground">ATS SCORE</div>
                    <div className="mt-1 flex items-end gap-2">
                      <span className="font-display text-5xl font-bold text-gradient">87</span>
                      <span className="pb-2 text-sm text-muted-foreground">/100</span>
                    </div>
                    <div className="mt-3 h-2 rounded-full bg-muted">
                      <div className="h-2 rounded-full bg-gradient-primary" style={{ width: "87%" }} />
                    </div>
                  </div>
                  <div className="rounded-lg bg-card p-4 shadow-md">
                    <div className="text-xs font-semibold text-muted-foreground">TOP SUGGESTION</div>
                    <p className="mt-1 text-sm">Add 2 more quantified bullets to your last role.</p>
                  </div>
                </div>
                <div className="rounded-lg bg-card p-6 shadow-md md:col-span-3">
                  <div className="border-b pb-2">
                    <div className="font-display text-xl font-bold">Alex Morgan</div>
                    <div className="text-xs text-primary">Senior Software Engineer</div>
                  </div>
                  <div className="mt-3 space-y-2">
                    <div className="h-2 w-full rounded bg-muted" />
                    <div className="h-2 w-5/6 rounded bg-muted" />
                    <div className="h-2 w-4/6 rounded bg-muted" />
                    <div className="mt-3 flex flex-wrap gap-1">
                      {["React", "TypeScript", "AWS", "Node", "GraphQL"].map((s) => (
                        <span key={s} className="rounded-full bg-accent px-2 py-0.5 text-[10px] text-accent-foreground">{s}</span>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Features */}
      <section id="features" className="mx-auto max-w-7xl px-6 py-24">
        <div className="mx-auto max-w-2xl text-center">
          <h2 className="font-display text-4xl font-bold">Everything you need, nothing you don't</h2>
          <p className="mt-3 text-muted-foreground">Built for job seekers who want results, not fluff.</p>
        </div>
        <div className="mt-16 grid gap-6 md:grid-cols-3">
          {[
            { icon: FileText, title: "10 polished templates", desc: "From minimal to bold — every layout is ATS-parseable and visually crafted." },
            { icon: ScanLine, title: "Instant ATS scoring", desc: "8-point breakdown across contact, skills, impact, action verbs and more." },
            { icon: Target, title: "JD matching", desc: "Paste any job description to see keyword overlap and missing terms." },
            { icon: Layers, title: "Multiple resumes", desc: "Tailor different versions per role — all saved to your dashboard." },
            { icon: Sparkles, title: "Smart suggestions", desc: "Prioritized fixes ranked high → low so you know what to tackle first." },
            { icon: CheckCircle2, title: "PDF export", desc: "One-click export to a pixel-perfect PDF, ready for any application." },
          ].map((f) => (
            <div key={f.title} className="rounded-2xl border border-border bg-surface-elevated p-6 transition-all hover:shadow-lg">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-accent text-accent-foreground">
                <f.icon className="h-5 w-5" />
              </div>
              <h3 className="mt-4 font-display text-lg font-bold">{f.title}</h3>
              <p className="mt-1 text-sm text-muted-foreground">{f.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Templates */}
      <section id="templates" className="bg-surface py-24">
        <div className="mx-auto max-w-7xl px-6">
          <div className="mx-auto max-w-2xl text-center">
            <h2 className="font-display text-4xl font-bold">10 templates. One you'll love.</h2>
            <p className="mt-3 text-muted-foreground">Switch styles anytime — your content stays intact.</p>
          </div>
          <div className="mt-12 grid grid-cols-2 gap-4 md:grid-cols-5">
            {TEMPLATES.map((t) => (
              <div key={t.id} className="group cursor-default rounded-xl border border-border bg-card p-4 transition-all hover:-translate-y-1 hover:shadow-lg">
                <div className="aspect-[3/4] overflow-hidden rounded-md border border-border" style={{ background: `linear-gradient(180deg, ${t.accent}15, white)` }}>
                  <div className="h-1.5" style={{ background: t.accent }} />
                  <div className="space-y-1.5 p-3">
                    <div className="h-2 w-2/3 rounded bg-foreground/60" />
                    <div className="h-1 w-1/2 rounded" style={{ background: t.accent }} />
                    {Array.from({ length: 8 }).map((_, i) => (<div key={i} className="h-1 rounded bg-foreground/15" style={{ width: `${50 + ((i * 7) % 45)}%` }} />))}
                  </div>
                </div>
                <div className="mt-3"><div className="text-sm font-bold">{t.name}</div><div className="text-xs text-muted-foreground">{t.tagline}</div></div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How it works */}
      <section id="how" className="mx-auto max-w-7xl px-6 py-24">
        <div className="mx-auto max-w-2xl text-center">
          <h2 className="font-display text-4xl font-bold">From blank page to interview, in 3 steps</h2>
        </div>
        <div className="mt-12 grid gap-6 md:grid-cols-3">
          {[
            { n: "01", t: "Build", d: "Pick a template and fill in the form. Live preview shows changes instantly." },
            { n: "02", t: "Score", d: "Run the ATS check. See your weighted score across 8 categories." },
            { n: "03", t: "Refine", d: "Apply prioritized suggestions. Match to specific job descriptions. Export PDF." },
          ].map((s) => (
            <div key={s.n} className="rounded-2xl border border-border bg-gradient-mesh p-8">
              <div className="font-display text-5xl font-extrabold text-gradient">{s.n}</div>
              <h3 className="mt-3 font-display text-xl font-bold">{s.t}</h3>
              <p className="mt-1 text-sm text-muted-foreground">{s.d}</p>
            </div>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="mx-auto max-w-7xl px-6 pb-24">
        <div className="rounded-3xl bg-gradient-primary p-12 text-center text-primary-foreground shadow-glow md:p-16">
          <h2 className="font-display text-4xl font-bold md:text-5xl">Ready to get hired?</h2>
          <p className="mx-auto mt-3 max-w-xl opacity-90">Free to use. No credit card. Your resume stays private on your device.</p>
          <Link to="/signup"><Button size="lg" variant="secondary" className="mt-8">Create your free account <ArrowRight className="ml-2 h-4 w-4" /></Button></Link>
        </div>
      </section>

      <footer className="border-t border-border py-8 text-center text-sm text-muted-foreground">
        © {new Date().getFullYear()} ResumeATS. Built with care.
      </footer>
    </div>
  );
}
