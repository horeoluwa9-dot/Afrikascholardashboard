import { useEffect, useState, useCallback } from "react";

export type PublishingRoleStatus = "none" | "pending" | "approved";

const STORAGE_KEYS = {
  reviewer: "afrika.publishing.reviewer",
  editor: "afrika.publishing.editor",
  reviewerTs: "afrika.publishing.reviewer.ts",
  editorTs: "afrika.publishing.editor.ts",
} as const;

const EVENT = "afrika:publishing-roles-changed";
const APPROVAL_DELAY_MS = 30_000;

function read(key: string): PublishingRoleStatus {
  if (typeof window === "undefined") return "none";
  const v = localStorage.getItem(key);
  return (v === "pending" || v === "approved") ? v : "none";
}
function write(key: string, value: PublishingRoleStatus) {
  if (value === "none") localStorage.removeItem(key);
  else localStorage.setItem(key, value);
  window.dispatchEvent(new CustomEvent(EVENT));
}

export function usePublishingRoles() {
  const [reviewer, setReviewer] = useState<PublishingRoleStatus>(() => read(STORAGE_KEYS.reviewer));
  const [editor, setEditor] = useState<PublishingRoleStatus>(() => read(STORAGE_KEYS.editor));

  useEffect(() => {
    const sync = () => {
      setReviewer(read(STORAGE_KEYS.reviewer));
      setEditor(read(STORAGE_KEYS.editor));
    };
    window.addEventListener(EVENT, sync);
    window.addEventListener("storage", sync);
    return () => {
      window.removeEventListener(EVENT, sync);
      window.removeEventListener("storage", sync);
    };
  }, []);

  const setReviewerStatus = useCallback((s: PublishingRoleStatus) => {
    write(STORAGE_KEYS.reviewer, s);
    if (s === "pending") localStorage.setItem(STORAGE_KEYS.reviewerTs, String(Date.now()));
  }, []);
  const setEditorStatus = useCallback((s: PublishingRoleStatus) => {
    write(STORAGE_KEYS.editor, s);
    if (s === "pending") localStorage.setItem(STORAGE_KEYS.editorTs, String(Date.now()));
  }, []);

  return {
    reviewer, editor, setReviewerStatus, setEditorStatus,
    can_review: reviewer === "approved",
    can_edit: editor === "approved",
  };
}

/**
 * Schedules auto-approval after 30 seconds for a given role.
 * Triggers an in-app notification on approval.
 */
export function scheduleAutoApproval(role: "reviewer" | "editor", onApprove: () => void) {
  const tsKey = role === "reviewer" ? STORAGE_KEYS.reviewerTs : STORAGE_KEYS.editorTs;
  const stKey = role === "reviewer" ? STORAGE_KEYS.reviewer : STORAGE_KEYS.editor;
  const startedAt = Number(localStorage.getItem(tsKey) || Date.now());
  const remaining = Math.max(0, APPROVAL_DELAY_MS - (Date.now() - startedAt));
  setTimeout(() => {
    if (read(stKey) === "pending") {
      write(stKey, "approved");
      onApprove();
    }
  }, remaining);
}

/**
 * On app boot, recover any pending applications and resume their approval timers.
 */
export function bootResumePendingApprovals(onApprove: (role: "reviewer" | "editor") => void) {
  (["reviewer", "editor"] as const).forEach((role) => {
    const stKey = role === "reviewer" ? STORAGE_KEYS.reviewer : STORAGE_KEYS.editor;
    if (read(stKey) === "pending") {
      scheduleAutoApproval(role, () => onApprove(role));
    }
  });
}
