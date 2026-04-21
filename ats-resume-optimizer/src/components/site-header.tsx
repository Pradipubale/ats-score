import { Link, useNavigate, useRouterState } from "@tanstack/react-router";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/lib/auth-store";
import { FileText, LayoutDashboard, ScanLine, LogOut, Sparkles, Plus } from "lucide-react";
import { useResumes } from "@/lib/resume-store";

export function SiteHeader() {
  const { user, token, logout } = useAuth();
  const { create } = useResumes();
  const nav = useNavigate();
  const path = useRouterState({ select: (s) => s.location.pathname });
  const isApp = path.startsWith("/dashboard") || path.startsWith("/builder") || path.startsWith("/checker");

  const onNew = async () => {
    if (!token) return;
    const r = await create(token, `Untitled resume`, "modern");
    if (r) {
      const id = r.id || (r as any)._id;
      nav({ to: "/builder/$id", params: { id } });
    }
  };

  return (
    <header className="sticky top-0 z-40 border-b border-border bg-background/80 backdrop-blur-xl">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-6">
        <Link to="/" className="flex items-center gap-2 font-display text-lg font-bold">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-primary shadow-glow">
            <Sparkles className="h-4 w-4 text-primary-foreground" />
          </div>
          <span>ResumeATS</span>
        </Link>
        {isApp && user ? (
          <nav className="hidden items-center gap-1 md:flex">
            <Link to="/dashboard"><Button variant={path === "/dashboard" ? "secondary" : "ghost"} size="sm"><LayoutDashboard className="mr-2 h-4 w-4" />Dashboard</Button></Link>
            <Button onClick={onNew} variant="ghost" size="sm" className="text-primary hover:bg-primary/5 hover:text-primary"><Plus className="mr-2 h-4 w-4" />New Resume</Button>
            <Link to="/checker"><Button variant={path === "/checker" ? "secondary" : "ghost"} size="sm"><ScanLine className="mr-2 h-4 w-4" />ATS Checker</Button></Link>
          </nav>
        ) : (
          <nav className="hidden items-center gap-6 text-sm md:flex">
            <a href="#features" className="text-muted-foreground hover:text-foreground">Features</a>
            <a href="#templates" className="text-muted-foreground hover:text-foreground">Templates</a>
            <a href="#how" className="text-muted-foreground hover:text-foreground">How it works</a>
          </nav>
        )}
        <div className="flex items-center gap-2">
          {user ? (
            <>
              <span className="hidden text-sm text-muted-foreground sm:inline">{user.name}</span>
              <Button size="sm" variant="ghost" onClick={() => { logout(); nav({ to: "/" }); }}><LogOut className="h-4 w-4" /></Button>
            </>
          ) : (
            <>
              <Link to="/login"><Button size="sm" variant="ghost">Sign in</Button></Link>
              <Link to="/signup"><Button size="sm" className="bg-gradient-primary text-primary-foreground shadow-glow hover:opacity-90">Get started</Button></Link>
            </>
          )}
        </div>
      </div>
    </header>
  );
}
