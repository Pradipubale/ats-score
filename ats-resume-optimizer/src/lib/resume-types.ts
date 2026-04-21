export type Experience = {
  id: string;
  company: string;
  role: string;
  location?: string;
  startDate: string;
  endDate: string;
  bullets: string[];
};

export type Education = {
  id: string;
  school: string;
  degree: string;
  startDate: string;
  endDate: string;
  details?: string;
};

export type Project = {
  id: string;
  name: string;
  description: string;
  link?: string;
  tech?: string;
};

export type ResumeData = {
  fullName: string;
  title: string;
  email: string;
  phone: string;
  location: string;
  website: string;
  summary: string;
  skills: string[];
  experiences: Experience[];
  educations: Education[];
  projects: Project[];
};

export type Resume = {
  id: string;
  userId: string;
  name: string;
  templateId: string;
  data: ResumeData;
  updatedAt: number;
  versions: { at: number; data: ResumeData }[];
};

export const emptyResume = (): ResumeData => ({
  fullName: "",
  title: "",
  email: "",
  phone: "",
  location: "",
  website: "",
  summary: "",
  skills: [],
  experiences: [],
  educations: [],
  projects: [],
});

export const sampleResume = (name = "Alex Morgan"): ResumeData => ({
  fullName: name,
  title: "Senior Software Engineer",
  email: "alex@example.com",
  phone: "+1 555 0134",
  location: "San Francisco, CA",
  website: "alexmorgan.dev",
  summary:
    "Full-stack engineer with 7+ years building scalable web platforms. Expert in React, TypeScript, Node.js and cloud architecture. Shipped products used by millions.",
  skills: ["React", "TypeScript", "Node.js", "PostgreSQL", "AWS", "Docker", "GraphQL", "Redis"],
  experiences: [
    {
      id: "1",
      company: "Acme Corp",
      role: "Senior Software Engineer",
      location: "Remote",
      startDate: "2022-01",
      endDate: "Present",
      bullets: [
        "Led migration to microservices, reducing latency by 45% and infra cost by 30%.",
        "Mentored 6 engineers and established code review standards adopted org-wide.",
        "Shipped real-time analytics dashboard processing 2M events/day.",
      ],
    },
    {
      id: "2",
      company: "Lumen Labs",
      role: "Software Engineer",
      location: "NYC",
      startDate: "2019-06",
      endDate: "2021-12",
      bullets: [
        "Built design system used across 12 products, accelerating UI delivery by 3x.",
        "Implemented CI/CD pipeline cutting deploy time from 40 min to 6 min.",
      ],
    },
  ],
  educations: [
    {
      id: "1",
      school: "UC Berkeley",
      degree: "B.S. Computer Science",
      startDate: "2015",
      endDate: "2019",
      details: "GPA 3.8 — Dean's List",
    },
  ],
  projects: [
    {
      id: "1",
      name: "OpenATS",
      description: "Open-source ATS scoring engine, 4k GitHub stars.",
      link: "github.com/openats",
      tech: "TypeScript, Node",
    },
  ],
});
