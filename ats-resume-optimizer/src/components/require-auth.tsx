import { useEffect } from "react";
import { useNavigate } from "@tanstack/react-router";
import { useAuth } from "@/lib/auth-store";

export function RequireAuth({ children }: { children: React.ReactNode }) {
  const { user } = useAuth();
  const nav = useNavigate();
  useEffect(() => {
    if (!user) nav({ to: "/login" });
  }, [user, nav]);
  if (!user) return null;
  return <>{children}</>;
}
