import { useEffect, useState, useCallback } from "react";

export type PublishingRoleStatus = "none" | "pending" | "approved";

const STORAGE_KEYS = {
  reviewer: "afrika.publishing.reviewer",
  editor: "afrika.publishing.editor",
} as const;

const EVENT = "afrika:publishing-roles-changed";

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

  const setReviewerStatus = useCallback((s: PublishingRoleStatus) => write(STORAGE_KEYS.reviewer, s), []);
  const setEditorStatus = useCallback((s: PublishingRoleStatus) => write(STORAGE_KEYS.editor, s), []);

  return { reviewer, editor, setReviewerStatus, setEditorStatus };
}
