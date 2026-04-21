import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useAuth } from "@/lib/auth-store";
import { SiteHeader } from "@/components/site-header";
import { toast } from "sonner";
import { HelpCircle } from "lucide-react";

export const Route = createFileRoute("/signup")({ component: SignupPage });

function SignupPage() {
  const { signup, setGuestMode } = useAuth();
  const nav = useNavigate();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [err, setErr] = useState("");

  return (
    <div className="min-h-screen bg-gradient-mesh">
      <SiteHeader />
      <div className="mx-auto flex max-w-md flex-col px-6 py-16">
        <div className="rounded-2xl border border-border bg-surface-elevated p-8 shadow-lg">
          <h1 className="font-display text-3xl font-bold">Create your account</h1>
          <p className="mt-1 text-sm text-muted-foreground">Free forever. Start building your career.</p>
          <form
            className="mt-6 space-y-4"
            onSubmit={async (e) => {
              e.preventDefault();
              setErr("");
              if (password.length < 6) return setErr("Password must be at least 6 characters");
              const r = await signup(name, email, password);
              if (!r.ok) setErr(r.error ?? "Signup failed");
              else { toast.success(`Welcome, ${name.split(" ")[0]}!`); nav({ to: "/dashboard" }); }
            }}
          >
            <div className="space-y-1.5"><Label htmlFor="name">Full name</Label><Input id="name" required value={name} onChange={(e) => setName(e.target.value)} /></div>
            <div className="space-y-1.5"><Label htmlFor="email">Email</Label><Input id="email" type="email" required value={email} onChange={(e) => setEmail(e.target.value)} /></div>
            <div className="space-y-1.5"><Label htmlFor="password">Password</Label><Input id="password" type="password" required value={password} onChange={(e) => setPassword(e.target.value)} /></div>
            {err && <p className="text-sm text-destructive">{err}</p>}
            <Button type="submit" className="w-full bg-gradient-primary text-primary-foreground shadow-glow">Create account</Button>
          </form>
          <p className="mt-6 text-center text-sm text-muted-foreground">
            Have an account? <Link to="/login" className="font-medium text-primary hover:underline">Sign in</Link>
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
