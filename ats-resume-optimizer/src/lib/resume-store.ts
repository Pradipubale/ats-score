import { create } from "zustand";
import { type Resume, type ResumeData, emptyResume } from "./resume-types";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000/api";

type ResumeState = {
  resumes: (Resume & { atsScore?: number })[];
  loading: boolean;
  fetchResumes: (token: string) => Promise<void>;
  create: (token: string, name: string, templateId?: string, data?: ResumeData) => Promise<Resume | null>;
  update: (token: string, id: string, patch: Partial<Pick<Resume, "name" | "templateId" | "data">>) => Promise<void>;
  remove: (token: string, id: string) => Promise<void>;
  scanResume: (token: string, id: string | null, data: ResumeData, role: string, jd?: string) => Promise<any>;
  get: (id: string) => (Resume & { atsScore?: number }) | undefined;
};

import { persist } from "zustand/middleware";

export const useResumes = create<ResumeState>()(
  persist(
    (set, get) => ({
  resumes: [],
  loading: false,
  fetchResumes: async (token) => {
    set({ loading: true });
    try {
      const res = await fetch(`${API_URL}/resumes`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (res.ok) {
        const data = await res.json();
        set({ resumes: Array.isArray(data) ? data : [] });
      }
    } catch (err) {
      console.error("Fetch resumes failed", err);
    } finally {
      set({ loading: false });
    }
  },
  create: async (token, name, templateId = "modern", data = emptyResume()) => {
    if (token === "guest-token") {
      const newResume = { id: crypto.randomUUID(), name, templateId, data, updatedAt: new Date().toISOString() } as any;
      set((s) => ({ resumes: [newResume, ...s.resumes] }));
      return newResume;
    }
    try {
      const res = await fetch(`${API_URL}/resumes`, {
        method: "POST",
        headers: { 
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}` 
        },
        body: JSON.stringify({ name, templateId, data }),
      });
      if (res.ok) {
        const newResume = await res.json();
        set((s) => ({ resumes: [newResume, ...s.resumes] }));
        return newResume;
      }
    } catch (err) {
      console.error("Create resume failed", err);
    }
    return null;
  },
  update: async (token, id, patch) => {
    if (token === "guest-token") {
      set((s) => ({ resumes: s.resumes.map((r) => (r.id === id ? { ...r, ...patch, updatedAt: new Date().toISOString() } : r)) }));
      return;
    }
    try {
      const res = await fetch(`${API_URL}/resumes/${id}`, {
        method: "PUT",
        headers: { 
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}` 
        },
        body: JSON.stringify(patch),
      });
      if (res.ok) {
        const updated = await res.json();
        set((s) => ({
          resumes: s.resumes.map((r) => (r.id === id ? updated : r)),
        }));
      }
    } catch (err) {
      console.error("Update resume failed", err);
    }
  },
  remove: async (token, id) => {
    if (token === "guest-token") {
      set((s) => ({ resumes: s.resumes.filter((r) => r.id !== id) }));
      return;
    }
    try {
      const res = await fetch(`${API_URL}/resumes/${id}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });
      if (res.ok) {
        set((s) => ({ resumes: s.resumes.filter((r) => r.id !== id) }));
      }
    } catch (err) {
      console.error("Delete resume failed", err);
    }
  },
  scanResume: async (token, id, resumeData, role, jobDescription = "") => {
    try {
      const res = await fetch(`${API_URL}/resumes/scan`, {
        method: "POST",
        headers: { 
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}` 
        },
        body: JSON.stringify({ id, resumeData, role, jobDescription }),
      });
      if (res.ok) {
        const result = await res.json();
        // Update local score if scanning a saved resume
        if (id) {
          set((s) => ({
            resumes: s.resumes.map((r) => ((r.id === id || (r as any)._id === id) ? { ...r, atsScore: result.score } : r))
          }));
        }
        return result;
      }
    } catch (err) {
      console.error("Scan resume failed", err);
    }
    return null;
  },
  get: (id) => get().resumes.find((r) => r.id === id || (r as any)._id === id),
}), { name: "resumeats-resumes" }));
