import { useEffect, useState, useCallback } from "react";

export type NetworkMembershipStatus = "none" | "pending" | "approved";

const KEY = "afrika.network.membership";
const TS_KEY = "afrika.network.membership.ts";
const EVENT = "afrika:network-membership-changed";
const APPROVAL_DELAY_MS = 30_000;

function read(): NetworkMembershipStatus {
  if (typeof window === "undefined") return "none";
  const v = localStorage.getItem(KEY);
  return v === "pending" || v === "approved" ? v : "none";
}
function write(v: NetworkMembershipStatus) {
  if (v === "none") localStorage.removeItem(KEY);
  else localStorage.setItem(KEY, v);
  window.dispatchEvent(new CustomEvent(EVENT));
}

export function useNetworkMembership() {
  const [status, setStatus] = useState<NetworkMembershipStatus>(() => read());

  useEffect(() => {
    const sync = () => setStatus(read());
    window.addEventListener(EVENT, sync);
    window.addEventListener("storage", sync);
    return () => {
      window.removeEventListener(EVENT, sync);
      window.removeEventListener("storage", sync);
    };
  }, []);

  const setMembershipStatus = useCallback((s: NetworkMembershipStatus) => {
    write(s);
    if (s === "pending") localStorage.setItem(TS_KEY, String(Date.now()));
  }, []);

  return { status, setMembershipStatus };
}

export function scheduleNetworkAutoApproval(onApprove: () => void) {
  const startedAt = Number(localStorage.getItem(TS_KEY) || Date.now());
  const remaining = Math.max(0, APPROVAL_DELAY_MS - (Date.now() - startedAt));
  setTimeout(() => {
    if (read() === "pending") {
      write("approved");
      onApprove();
    }
  }, remaining);
}

export function bootResumeNetworkApproval(onApprove: () => void) {
  if (read() === "pending") scheduleNetworkAutoApproval(onApprove);
}