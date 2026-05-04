import { useEffect } from "react";
import { bootResumePendingApprovals } from "@/hooks/usePublishingRoles";
import { bootResumeNetworkApproval } from "@/hooks/useNetworkMembership";
import { useAppNotifications } from "@/hooks/useAppNotifications";

/**
 * Mounted once at app shell. Resumes any in-progress timed approvals
 * and emits the corresponding approval notifications.
 */
export default function ApprovalBoot() {
  const { add } = useAppNotifications();

  useEffect(() => {
    bootResumePendingApprovals((role) => {
      if (role === "reviewer") {
        add({
          category: "Approval",
          title: "Reviewer access approved",
          description: "You've been approved as a Reviewer. You can now start reviewing.",
          link: "/dashboard/publishing/reviews",
        });
      } else {
        add({
          category: "Approval",
          title: "Editor access approved",
          description: "You've been approved as an Editor. You can now manage journal submissions.",
          link: "/dashboard/publishing/journals",
        });
      }
    });
    bootResumeNetworkApproval(() => {
      add({
        category: "Network",
        title: "Welcome to the Academic Network",
        description: "Your application has been approved. Complete your academic profile to get matched with opportunities.",
        link: "/dashboard/network",
      });
    });
  }, [add]);

  return null;
}