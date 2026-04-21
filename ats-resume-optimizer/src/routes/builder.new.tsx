import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useAuth } from "@/lib/auth-store";
import { useResumes } from "@/lib/resume-store";
import { useEffect } from "react";

export const Route = createFileRoute("/builder/new")({ component: NewResume });

function NewResume() {
  const { user } = useAuth();
  const { create } = useResumes();
  const nav = useNavigate();
  useEffect(() => {
    if (!user) { nav({ to: "/login" }); return; }
    const r = create(user.id, "Untitled resume", "modern");
    nav({ to: "/builder/$id", params: { id: r.id }, replace: true });
  }, [user, create, nav]);
  return null;
}
