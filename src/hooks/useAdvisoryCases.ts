import { useEffect, useState, useCallback } from "react";

export type AdvisoryType = "transcript" | "degree" | "study" | "institutional";
export type CaseStatus =
  | "pending"
  | "assigned"
  | "awaiting_documents"
  | "in_progress"
  | "processing_institution"
  | "completed";
export type DocStatus = "missing" | "submitted" | "under_review" | "approved" | "rejected";
export type PaymentStatus = "pending" | "partial" | "paid";

export interface RequiredDoc {
  id: string;
  name: string;
  status: DocStatus;
  fileName?: string;
  rejectionReason?: string;
  uploadedAt?: string;
}

export interface CaseMessage {
  id: string;
  from: "client" | "advisor" | "system";
  text: string;
  at: string;
  attachment?: { name: string };
}

export interface AdvisoryCase {
  id: string;
  type: AdvisoryType;
  title: string;
  description: string;
  status: CaseStatus;
  advisor?: { name: string; role: string };
  createdAt: string;
  updatedAt: string;
  fields: Record<string, string>;
  docs: RequiredDoc[];
  messages: CaseMessage[];
  fee: number;
  paymentStatus: PaymentStatus;
  urgency?: "low" | "medium" | "high";
}

const KEY = "afrika.advisory.cases.v1";
const EVENT = "afrika:advisory-cases-changed";

export const TYPE_LABEL: Record<AdvisoryType, string> = {
  transcript: "Transcript Advisory",
  degree: "Degree Advisory",
  study: "Study in Africa",
  institutional: "Institutional Advisory",
};

export const STATUS_LABEL: Record<CaseStatus, string> = {
  pending: "Pending",
  assigned: "Assigned",
  awaiting_documents: "Awaiting Documents",
  in_progress: "In Progress",
  processing_institution: "Processing with Institution",
  completed: "Completed",
};

export const STATUS_STAGE: Record<CaseStatus, number> = {
  pending: 1,
  assigned: 2,
  awaiting_documents: 3,
  in_progress: 4,
  processing_institution: 5,
  completed: 6,
};

const DEFAULT_DOCS: Record<AdvisoryType, string[]> = {
  transcript: ["Academic Transcript", "Government ID", "Graduation Certificate"],
  degree: ["CV / Resume", "Statement of Purpose"],
  study: ["CV / Resume", "Proof of Funding"],
  institutional: ["Authorisation Letter"],
};

const seed: AdvisoryCase[] = [
  {
    id: "ADV-2026-0041",
    type: "transcript",
    title: "Transcript verification — University of Ibadan",
    description: "Authentication and dispatch of BSc Economics transcript to McGill University.",
    status: "in_progress",
    advisor: { name: "Dr. Amina Yusuf", role: "Senior Transcript Advisor" },
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 72).toISOString(),
    updatedAt: new Date(Date.now() - 1000 * 60 * 60 * 2).toISOString(),
    fields: {
      "University": "University of Ibadan",
      "Year of Graduation": "2019",
      "Qualification": "BSc Economics",
      "Target Institution": "McGill University, Canada",
      "Purpose": "Further Study",
    },
    docs: [
      { id: "d1", name: "Academic Transcript", status: "approved", fileName: "transcript.pdf", uploadedAt: new Date().toISOString() },
      { id: "d2", name: "Government ID", status: "submitted", fileName: "passport.pdf", uploadedAt: new Date().toISOString() },
      { id: "d3", name: "Graduation Certificate", status: "missing" },
    ],
    messages: [
      { id: "m1", from: "advisor", text: "Hello! I've received your case and started verification. Please upload your graduation certificate when you can.", at: new Date(Date.now() - 1000 * 60 * 60 * 30).toISOString() },
      { id: "m2", from: "client", text: "Thanks! I'll upload it tonight.", at: new Date(Date.now() - 1000 * 60 * 60 * 28).toISOString() },
    ],
    fee: 25000,
    paymentStatus: "pending",
  },
];

function read(): AdvisoryCase[] {
  if (typeof window === "undefined") return seed;
  try {
    const raw = localStorage.getItem(KEY);
    if (!raw) {
      localStorage.setItem(KEY, JSON.stringify(seed));
      return seed;
    }
    return JSON.parse(raw);
  } catch {
    return seed;
  }
}
function write(list: AdvisoryCase[]) {
  localStorage.setItem(KEY, JSON.stringify(list));
  window.dispatchEvent(new CustomEvent(EVENT));
}

function nextCaseId(existing: AdvisoryCase[]): string {
  const year = new Date().getFullYear();
  const yearCases = existing.filter((c) => c.id.startsWith(`ADV-${year}-`));
  const max = yearCases.reduce((m, c) => {
    const n = Number(c.id.split("-")[2] || 0);
    return n > m ? n : m;
  }, 0);
  return `ADV-${year}-${String(max + 1).padStart(4, "0")}`;
}

export function useAdvisoryCases() {
  const [cases, setCases] = useState<AdvisoryCase[]>(() => read());

  useEffect(() => {
    const sync = () => setCases(read());
    window.addEventListener(EVENT, sync);
    window.addEventListener("storage", sync);
    return () => {
      window.removeEventListener(EVENT, sync);
      window.removeEventListener("storage", sync);
    };
  }, []);

  const createCase = useCallback(
    (input: { type: AdvisoryType; title: string; description: string; fields: Record<string, string>; fee?: number }) => {
      const list = read();
      const id = nextCaseId(list);
      const fee = input.fee ?? (input.type === "transcript" ? 25000 : 15000);
      const newCase: AdvisoryCase = {
        id,
        type: input.type,
        title: input.title,
        description: input.description,
        status: "pending",
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        fields: input.fields,
        docs: DEFAULT_DOCS[input.type].map((n, i) => ({ id: `d-${Date.now()}-${i}`, name: n, status: "missing" as DocStatus })),
        messages: [],
        fee,
        paymentStatus: "pending",
      };
      write([newCase, ...list]);
      return newCase;
    },
    []
  );

  const updateCase = useCallback((id: string, patch: Partial<AdvisoryCase>) => {
    const list = read().map((c) => (c.id === id ? { ...c, ...patch, updatedAt: new Date().toISOString() } : c));
    write(list);
  }, []);

  const uploadDoc = useCallback((caseId: string, docId: string, fileName: string) => {
    const list = read().map((c) => {
      if (c.id !== caseId) return c;
      return {
        ...c,
        updatedAt: new Date().toISOString(),
        docs: c.docs.map((d) => (d.id === docId ? { ...d, status: "submitted" as DocStatus, fileName, uploadedAt: new Date().toISOString(), rejectionReason: undefined } : d)),
      };
    });
    write(list);
  }, []);

  const sendMessage = useCallback((caseId: string, text: string) => {
    const list = read().map((c) => {
      if (c.id !== caseId) return c;
      const msg: CaseMessage = { id: `m-${Date.now()}`, from: "client", text, at: new Date().toISOString() };
      return { ...c, messages: [...c.messages, msg], updatedAt: new Date().toISOString() };
    });
    write(list);
  }, []);

  const payCase = useCallback((caseId: string) => {
    const list = read().map((c) => (c.id === caseId ? { ...c, paymentStatus: "paid" as PaymentStatus, updatedAt: new Date().toISOString() } : c));
    write(list);
  }, []);

  return { cases, createCase, updateCase, uploadDoc, sendMessage, payCase };
}

export function useAdvisoryCase(id: string | undefined) {
  const { cases, ...rest } = useAdvisoryCases();
  const c = cases.find((x) => x.id === id);
  return { case: c, ...rest };
}
