import { useAuth } from "@/contexts/AuthContext";

/**
 * Academic capability eligibility:
 * Only researchers and lecturers may apply to be reviewers/editors,
 * join the academic network, etc.
 * Institutions and Advisory Clients are excluded entirely.
 */
export function useAcademicEligibility() {
  const { accountType, userType } = useAuth();
  // Allow when accountType is researcher/lecturer.
  // Fallback: if no accountType (legacy), allow when userType is researcher/academic.
  const eligible =
    accountType === "researcher" ||
    accountType === "lecturer" ||
    (!accountType && (userType === "researcher" || userType === "academic"));
  return { eligible };
}
