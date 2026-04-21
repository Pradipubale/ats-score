import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useAuth } from "@/lib/auth-store";
import { SiteHeader } from "@/components/site-header";
import { toast } from "sonner";
import { HelpCircle } from "lucide-react";

export const Route = createFileRoute("/login")({ component: LoginPage });

function LoginPage() {
  const { login, setGuestMode } = useAuth();
  const nav = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [err, setErr] = useState("");

  return (
    <div className="min-h-screen bg-gradient-mesh">
      <SiteHeader />
      <div className="mx-auto flex max-w-md flex-col px-6 py-16">
        <div className="rounded-2xl border border-border bg-surface-elevated p-8 shadow-lg">
          <h1 className="font-display text-3xl font-bold">Welcome back</h1>
          <p className="mt-1 text-sm text-muted-foreground">Sign in to continue building.</p>
          <form
            className="mt-6 space-y-4"
            onSubmit={async (e) => {
              e.preventDefault();
              setErr("");
              const r = await login(email, password);
              if (!r.ok) setErr(r.error ?? "Login failed");
              else { toast.success("Welcome back!"); nav({ to: "/dashboard" }); }
            }}
          >
            <div className="space-y-1.5"><Label htmlFor="email">Email</Label><Input id="email" type="email" required value={email} onChange={(e) => setEmail(e.target.value)} /></div>
            <div className="space-y-1.5"><Label htmlFor="password">Password</Label><Input id="password" type="password" required value={password} onChange={(e) => setPassword(e.target.value)} /></div>
            {err && <p className="text-sm text-destructive">{err}</p>}
            <Button type="submit" className="w-full bg-gradient-primary text-primary-foreground shadow-glow">Sign in</Button>
          </form>
          <p className="mt-6 text-center text-sm text-muted-foreground">
            No account? <Link to="/signup" className="font-medium text-primary hover:underline">Sign up</Link>
          </p>
          <div className="relative my-6">
            <div className="absolute inset-0 flex items-center"><span className="w-full border-t border-border" /></div>
            <div className="relative flex justify-center text-xs uppercase"><span className="bg-surface-elevated px-2 text-muted-foreground">Or bypass database</span></div>
          </div>
          <Button variant="outline" className="w-full" onClick={() => { setGuestMode(true); toast.success("Welcome, Guest!"); nav({ to: "/dashboard" }); }}>
            <HelpCircle className="mr-2 h-4 w-4" /> Continue as Guest (Offline)
          </Button>
        </div>
      </div>
    </div>
  );
}
