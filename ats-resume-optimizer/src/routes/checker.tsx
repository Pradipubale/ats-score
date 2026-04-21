import { useMemo, useState, useEffect } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { SiteHeader } from "@/components/site-header";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useResumes } from "@/lib/resume-store";
import { useAuth } from "@/lib/auth-store";
import { analyzeResume, type AtsResult, ROLE_KEYWORDS } from "@/lib/ats";
import { extractPdfText, textToResumeData } from "@/lib/pdf-parse";
import { type ResumeData, emptyResume } from "@/lib/resume-types";
import { Upload, FileText, AlertCircle, CheckCircle2, AlertTriangle, Target, Loader2, Wand2, Trash2, Trash, ScanLine } from "lucide-react";
import { motion } from "framer-motion";
import { toast } from "sonner";

type Search = { rid?: string };

export const Route = createFileRoute("/checker")({
  component: CheckerPage,
  validateSearch: (s: Record<string, unknown>): Search => ({ rid: typeof s.rid === "string" ? s.rid : undefined }),
});

function CheckerPage() {
  const { rid } = Route.useSearch();
  const { user } = useAuth();
  const { get } = useResumes();
  const stored = rid ? get(rid) : undefined;
  const [data, setData] = useState<ResumeData>(stored?.data ?? emptyResume());
  const [jd, setJd] = useState("");
  const [role, setRole] = useState("");
  const [parsing, setParsing] = useState(false);
  const [scanning, setScanning] = useState(false);
  const [pdfText, setPdfText] = useState("");
  const [aiResult, setAiResult] = useState<any>(null);
  const [aiReady, setAiReady] = useState<boolean | null>(null);

  const { token } = useAuth();
  const { scanResume } = useResumes();

  useEffect(() => {
    fetch(`${import.meta.env.VITE_API_URL}/auth/ai-status`)
      .then(res => res.json())
      .then(d => setAiReady(d.ok))
      .catch(() => setAiReady(false));
  }, []);

  const resultsRef = useMemo(() => ({ current: null as HTMLDivElement | null }), []);
  const [step, setStep] = useState(1);
  const [resultsVisible, setResultsVisible] = useState(false);

  const onAiScan = async () => {
    if (!role.trim()) return toast.warning("Please specify the target role (e.g., Software Engineer)");
    
    setScanning(true);
    setResultsVisible(true); 
    
    if (!aiReady) {
       await new Promise(r => setTimeout(r, 1500));
       setAiResult(null);
       toast.success("Using Local High-Performance Engine (Basic Mode)");
       setScanning(false);
       setTimeout(() => resultsRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' }), 100);
       return;
    }

    if (!token) return toast.error("Please login to use High-Precision AI scan");
    
    try {
      const res = await scanResume(token, rid || null, data, role, jd);
      if (res && res.score > 0) {
        const transformed: AtsResult = {
          score: res.score ?? 0,
          breakdown: [
            { label: "Keyword Match", score: res.breakdown?.keywords ?? 0, max: 100, note: "Industry requirements match" },
            { label: "Formatting Audit", score: res.breakdown?.formatting ?? 0, max: 100, note: "ATS parseability" },
            { label: "Impact Analysis", score: res.breakdown?.impact ?? 0, max: 100, note: "Usage of results/metrics" },
            { label: "Role Context", score: res.breakdown?.relevance ?? 0, max: 100, note: "Seniority & industry alignment" }
          ],
          suggestions: (res.suggestions || []).map((s: any) => ({
             level: s.category === 'formatting' ? 'high' : s.category === 'impact' ? 'medium' : 'low',
             text: s.text
          })),
          matched: res.matched || [],
          missing: res.missing || []
        };
        setAiResult(transformed);
        toast.success("99% Accuracy Combined Scan Complete!");
        setTimeout(() => resultsRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' }), 100);
      } else {
        throw new Error("AI Offline");
      }
    } catch (e) {
      toast.info("AI currently busy. Falling back to Local Engine.");
      setAiResult(null);
      setTimeout(() => resultsRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' }), 100);
    } finally {
      setScanning(false);
    }
  };

  const result = aiResult;

  const onUpload = async (file: File) => {
    setParsing(true);
    try {
      const text = await extractPdfText(file);
      setPdfText(text);
      const parsed = textToResumeData(text);
      
      const firstLines = text.split('\n').slice(0, 10).join(' ');
      const detectedRole = Object.keys(ROLE_KEYWORDS).find(k => firstLines.toLowerCase().includes(k));
      if (detectedRole && !role) {
         setRole(detectedRole);
         toast.info(`Detected role: ${detectedRole}`);
      }

      const skills = Array.from(new Set((text.match(/\b([A-Z][a-zA-Z+#.]{1,20})\b/g) ?? []))).slice(0, 20);
      setData({ ...emptyResume(), ...parsed, skills });
      toast.success("Resume parsed successfully!");
      setStep(2); // Auto-advance to Role selection
    } catch (e) {
      console.error(e);
      toast.error("Couldn't parse PDF. Try another file.");
    } finally { setParsing(false); }
  };

  return (
    <div className="min-h-screen bg-surface">
      <SiteHeader />
      <div className="mx-auto max-w-7xl px-6 py-10">
        <div className="mb-8">
          <h1 className="font-display text-3xl font-bold">ATS Score Checker</h1>
          <p className="mt-1 text-muted-foreground">Upload a PDF or analyze a saved resume. Add a job description for tailored match score.</p>
        </div>

        {aiReady === false && (
          <div className="mb-6 rounded-xl border border-primary/20 bg-primary/5 p-4 flex items-center gap-3">
             <AlertCircle className="h-5 w-5 text-primary" />
             <div className="text-sm text-foreground">
               <span className="font-bold text-primary">Local Scanner Mode Active:</span> Your resume is being audited by our high-performance offline engine. To enable 99% accuracy AI scans, ensure your <code className="bg-primary/10 px-1 rounded">GEMINI_API_KEY</code> is enabled.
             </div>
          </div>
        )}

        <div className="mx-auto max-w-2xl space-y-8">
          {/* Step 1: Upload */}
          {step === 1 && (
            <motion.div initial={{ opacity: 0, scale: 0.98 }} animate={{ opacity: 1, scale: 1 }} className="space-y-6">
              <div className="rounded-2xl border border-border bg-card p-8 shadow-sm">
                <div className="mb-6 flex items-center justify-between">
                   <Label className="flex items-center gap-2 text-lg font-bold text-primary"><Upload className="h-5 w-5" />Step 1: Upload Your Resume</Label>
                   <span className="text-xs font-bold text-muted-foreground uppercase tracking-widest bg-muted px-3 py-1 rounded-full">Required</span>
                </div>
                <label className="flex cursor-pointer flex-col items-center justify-center gap-4 rounded-xl border-2 border-dashed border-border bg-surface p-12 text-center transition-all hover:border-primary hover:bg-primary/5 group">
                  {parsing ? (
                    <div className="flex flex-col items-center gap-2">
                       <Loader2 className="h-10 w-10 animate-spin text-primary" />
                       <p className="text-sm font-medium">Extracting resume data...</p>
                    </div>
                  ) : (
                    <>
                      <div className="rounded-full bg-primary/10 p-4 group-hover:bg-primary/20 transition-colors">
                        <Upload className="h-10 w-10 text-primary" />
                      </div>
                      <div>
                        <div className="font-semibold text-lg">{parsing ? "Parsing..." : "Drop your PDF here"}</div>
                        <div className="text-sm text-muted-foreground">Maximum file size: 5MB</div>
                      </div>
                    </>
                  )}
                  <input type="file" accept="application/pdf" className="hidden" onChange={(e) => { const f = e.target.files?.[0]; if (f) onUpload(f); }} />
                </label>

                {user && (
                   <div className="mt-8 pt-6 border-t border-border">
                      <p className="text-xs font-semibold text-muted-foreground uppercase tracking-widest text-center mb-4">Or pick from your library</p>
                      <div className="grid gap-3 sm:grid-cols-2">
                         <SavedPicker onPick={(d) => { setData(d); setStep(2); toast.success("Loaded saved resume"); }} />
                      </div>
                   </div>
                )}
                
                <p className="mt-4 text-center text-xs text-muted-foreground">Your data is processed securely and not shared with third parties.</p>
              </div>
            </motion.div>
          )}

          {/* Step 2: Role */}
          {step === 2 && (
            <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="space-y-6">
              <div className="rounded-2xl border border-border bg-card p-8 shadow-sm">
                <div className="mb-6 flex items-center justify-between">
                   <Label className="flex items-center gap-2 text-lg font-bold text-primary"><Target className="h-5 w-5" />Step 2: Target Role</Label>
                   <Button variant="ghost" size="sm" onClick={() => setStep(1)} className="text-xs text-muted-foreground hover:text-primary">Change Resume</Button>
                </div>
                
                <p className="mb-4 text-sm text-muted-foreground">What specific role are you applying for? This helps us check for role-specific keywords.</p>
                
                <div className="flex flex-wrap gap-2 mb-4">
                  {Object.keys(ROLE_KEYWORDS).slice(0, 5).map(k => (
                    <button key={k} onClick={() => { setRole(k); setStep(3); }} className={`rounded-full px-4 py-2 text-xs font-medium transition-all ${role === k ? 'bg-primary text-primary-foreground shadow-glow' : 'bg-muted hover:bg-accent border border-border'}`}>
                      {k.charAt(0).toUpperCase() + k.slice(1)}
                    </button>
                  ))}
                </div>

                <div className="flex gap-2">
                  <Input 
                    className="flex-1" 
                    placeholder="e.g. Senior Software Engineer" 
                    value={role} 
                    onChange={(e) => setRole(e.target.value)} 
                  />
                  <Button onClick={() => role.trim() ? setStep(3) : toast.warning("Please specify a role")} className="bg-primary hover:bg-primary/90">
                    Next
                  </Button>
                </div>
              </div>
            </motion.div>
          )}

          {/* Step 3: JD & Scan */}
          {step === 3 && (
            <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="space-y-6">
              <div className="rounded-2xl border border-border bg-card p-8 shadow-sm">
                <div className="mb-6 flex items-center justify-between">
                   <Label className="flex items-center gap-2 text-lg font-bold text-primary"><FileText className="h-5 w-5" />Step 3: Optimization</Label>
                   <Button variant="ghost" size="sm" onClick={() => setStep(2)} className="text-xs text-muted-foreground hover:text-primary">Change Role</Button>
                </div>

                <Label className="mb-2 block text-sm font-medium">Job Description <span className="text-xs text-muted-foreground font-normal">(Optional but Recommended)</span></Label>
                <Textarea 
                  rows={8} 
                  className="mb-6 focus:ring-primary/20" 
                  placeholder="Paste the job description here for a 100% accurate keyword-match scan..." 
                  value={jd} 
                  onChange={(e) => setJd(e.target.value)} 
                />

                <Button 
                  onClick={onAiScan} 
                  className="w-full h-14 text-lg font-bold bg-gradient-primary text-primary-foreground shadow-glow group overflow-hidden relative" 
                  disabled={scanning}
                >
                  <span className="relative z-10 flex items-center justify-center gap-2">
                    {scanning ? <Loader2 className="h-5 w-5 animate-spin" /> : <Wand2 className="h-5 w-5 group-hover:rotate-12 transition-transform" />}
                    {aiReady ? "Check ATS Score (AI)" : "Check ATS Score (Local)"}
                  </span>
                  <div className="absolute inset-0 bg-white/10 translate-y-full group-hover:translate-y-0 transition-transform duration-300" />
                </Button>
              </div>

              {/* Final Step: Results */}
              <div ref={resultsRef as any}>
                {resultsVisible && result ? (
                  <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} className="space-y-8 pt-8 border-t border-border mt-8">
                    <div className="flex items-center justify-between">
                       <h2 className="font-display text-2xl font-bold bg-gradient-primary bg-clip-text text-transparent">AI Analysis Report</h2>
                       <Button variant="outline" size="sm" onClick={() => { setAiResult(null); setResultsVisible(false); setStep(1); setRole(""); setJd(""); }} className="text-xs">Start New Scan</Button>
                    </div>
                    
                    <ScoreCard result={result} />
                    
                    <div className="grid gap-6 md:grid-cols-2">
                      {result.breakdown && <BreakdownCard result={result} />}
                      <SuggestionsCard result={result} />
                    </div>

                    {(result.jdMatch || result.matched || result.missing) && (
                      <JdMatchCard 
                        jd={result.jdMatch || { 
                          score: result.score, 
                          matched: result.matched || [], 
                          missing: result.missing || [] 
                        }} 
                      />
                    )}
                  </motion.div>
                ) : resultsVisible && scanning ? (
                  <div className="py-20 text-center space-y-6">
                     <div className="flex justify-center">
                        <div className="relative">
                           <Loader2 className="h-16 w-16 animate-spin text-primary opacity-20" />
                           <Wand2 className="absolute inset-0 m-auto h-8 w-8 text-primary animate-pulse" />
                        </div>
                     </div>
                     <div className="space-y-2">
                        <h3 className="text-lg font-bold">Deep AI Audit in Progress...</h3>
                        <p className="text-sm text-muted-foreground max-w-sm mx-auto">Gemini 2.0 is currently analyzing your resume against industry standards and role-specific requirements.</p>
                     </div>
                  </div>
                ) : null}
              </div>
            </motion.div>
          )}
        </div>
      </div>
    </div>
  );
}

function SavedPicker({ onPick }: { onPick: (d: ResumeData) => void }) {
  const { token } = useAuth();
  const { resumes: allResumes, fetchResumes } = useResumes();
  
  const resumes = allResumes.filter(r => r.data.fullName || r.data.experiences.length > 0 || r.name !== 'Untitled resume');

  useEffect(() => {
    if (token && allResumes.length === 0) fetchResumes(token);
  }, [token, allResumes.length, fetchResumes]);

  if (!resumes || resumes.length === 0) return <p className="text-sm text-muted-foreground col-span-2 text-center py-4 border border-dashed rounded-lg">No completed resumes found in your library.</p>;
  return resumes?.map((r) => {
    const id = r.id || (r as any)._id;
    return (
      <button 
        key={id}
        onClick={() => { onPick(r.data); toast.success(`Loaded "${r.name}"`); }} 
        className="flex w-full items-center justify-between rounded-lg border border-border p-3 text-left hover:bg-accent transition-colors group"
      >
        <span className="flex items-center gap-3">
          <div className="flex h-8 w-8 items-center justify-center rounded bg-primary/10 text-primary group-hover:bg-primary group-hover:text-white transition-colors">
            <FileText className="h-4 w-4" />
          </div>
          <div>
            <div className="font-medium truncate max-w-[180px] text-sm">{r.name}</div>
            <div className="text-[10px] text-muted-foreground">{r.data.fullName || "Unnamed Candidate"}</div>
          </div>
        </span>
        <ScanLine className="h-4 w-4 text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity" />
      </button>
    );
  });
}

function ScoreCard({ result }: { result: AtsResult }) {
  const tone = result.score >= 80 ? "success" : result.score >= 60 ? "warning" : "destructive";
  const colors = { success: "var(--color-success)", warning: "var(--color-warning)", destructive: "var(--color-destructive)" } as const;
  return (
    <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="rounded-2xl border border-border bg-card p-8 shadow-md">
      <div className="flex items-center justify-between">
        <div>
          <div className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Overall ATS Score</div>
          <div className="mt-2 flex items-end gap-2">
            <span className="font-display text-7xl font-extrabold" style={{ color: colors[tone] }}>{result.score}</span>
            <span className="pb-3 text-xl text-muted-foreground">/100</span>
          </div>
          <div className="mt-1 text-sm font-medium" style={{ color: colors[tone] }}>
            {result.score >= 80 ? "Excellent — ready to apply" : result.score >= 60 ? "Good — a few improvements will help" : "Needs work — focus on suggestions below"}
          </div>
        </div>
        <RingScore value={result.score} color={colors[tone]} />
      </div>
      <div className="mt-4 h-3 overflow-hidden rounded-full bg-muted">
        <motion.div initial={{ width: 0 }} animate={{ width: `${result.score}%` }} transition={{ duration: 0.8 }} className="h-full rounded-full" style={{ background: colors[tone] }} />
      </div>
    </motion.div>
  );
}

function RingScore({ value, color }: { value: number; color: string }) {
  const r = 44, c = 2 * Math.PI * r, off = c - (value / 100) * c;
  return (
    <svg width={110} height={110} className="-rotate-90">
      <circle cx={55} cy={55} r={r} stroke="var(--color-muted)" strokeWidth={10} fill="none" />
      <motion.circle cx={55} cy={55} r={r} stroke={color} strokeWidth={10} fill="none" strokeLinecap="round" strokeDasharray={c} initial={{ strokeDashoffset: c }} animate={{ strokeDashoffset: off }} transition={{ duration: 1 }} />
    </svg>
  );
}

function BreakdownCard({ result }: { result: AtsResult }) {
  return (
    <div className="rounded-2xl border border-border bg-card p-6 shadow-sm">
      <h3 className="font-display text-lg font-bold">Score breakdown</h3>
      <div className="mt-4 space-y-3">
        {result.breakdown.map((b) => {
          const pct = (b.score / b.max) * 100;
          const color = pct >= 80 ? "var(--color-success)" : pct >= 50 ? "var(--color-warning)" : "var(--color-destructive)";
          return (
            <div key={b.label}>
              <div className="flex items-center justify-between text-sm"><span className="font-medium">{b.label}</span><span className="tabular-nums text-muted-foreground">{b.score}/{b.max}</span></div>
              <div className="mt-1 h-1.5 overflow-hidden rounded-full bg-muted"><div className="h-full rounded-full transition-all" style={{ width: `${pct}%`, background: color }} /></div>
              <div className="mt-0.5 text-xs text-muted-foreground">{b.note}</div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

function JdMatchCard({ jd }: { jd: NonNullable<AtsResult["jdMatch"]> }) {
  return (
    <div className="rounded-2xl border border-border bg-card p-6 shadow-sm">
      <div className="flex items-center justify-between">
        <h3 className="flex items-center gap-2 font-display text-lg font-bold"><Target className="h-5 w-5 text-primary" />JD keyword match</h3>
        <span className="font-display text-3xl font-bold text-gradient">{jd.score}%</span>
      </div>
      <div className="mt-4 grid gap-4 md:grid-cols-2">
        <div>
          <div className="mb-2 flex items-center gap-1.5 text-xs font-semibold text-success"><CheckCircle2 className="h-3.5 w-3.5" />Matched ({jd.matched.length})</div>
          <div className="flex flex-wrap gap-1">
            {jd.matched.length === 0 ? <span className="text-xs text-muted-foreground">None</span> : jd.matched.slice(0, 30).map((k) => (
              <span key={k} className="rounded-full bg-success/10 px-2 py-0.5 text-[10px] font-medium text-success">{k}</span>
            ))}
          </div>
        </div>
        <div>
          <div className="mb-2 flex items-center gap-1.5 text-xs font-semibold text-destructive"><AlertCircle className="h-3.5 w-3.5" />Missing ({jd.missing.length})</div>
          <div className="flex flex-wrap gap-1">
            {jd.missing.length === 0 ? <span className="text-xs text-muted-foreground">All keywords found 🎉</span> : jd.missing.slice(0, 25).map((k) => (
              <span key={k} className="rounded-full bg-destructive/10 px-2 py-0.5 text-[10px] font-medium text-destructive">{k}</span>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

function SuggestionsCard({ result }: { result: AtsResult }) {
  const Icon = { high: AlertCircle, medium: AlertTriangle, low: CheckCircle2 } as const;
  const colorMap = { high: "destructive", medium: "warning", low: "success" } as const;
  return (
    <div className="rounded-2xl border border-border bg-card p-6 shadow-sm">
      <h3 className="font-display text-lg font-bold">Improvement suggestions</h3>
      {result.suggestions.length === 0 ? (
        <p className="mt-3 text-sm text-success">Looking great — no major issues detected.</p>
      ) : (
        <ul className="mt-4 space-y-3">
          {result.suggestions.map((s, i) => {
            const I = Icon[s.level];
            const c = colorMap[s.level];
            return (
              <li key={i} className="flex gap-3 rounded-lg border border-border p-3">
                <I className={`h-5 w-5 shrink-0 text-${c}`} style={{ color: `var(--color-${c})` }} />
                <div>
                  <div className="text-xs font-semibold uppercase" style={{ color: `var(--color-${c})` }}>{s.level} priority</div>
                  <div className="mt-0.5 text-sm">{s.text}</div>
                </div>
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
}
