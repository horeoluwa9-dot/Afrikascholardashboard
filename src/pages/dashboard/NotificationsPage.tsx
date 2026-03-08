import { useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import DashboardLayout from "@/components/dashboard/DashboardLayout";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Check, Trash2, Bell, Send, Globe, Sparkles, Shield, Settings2 } from "lucide-react";
import { NotificationCard } from "@/components/notifications/NotificationCard";
import { NotificationEmptyState } from "@/components/notifications/NotificationEmptyState";
import { useNotifications, useNotificationPreferences } from "@/hooks/useNotifications";
import { toast } from "sonner";

const tabs = [
  { value: "all", label: "Overview", icon: Bell },
  { value: "publishing", label: "Publishing", icon: Send },
  { value: "network", label: "Network", icon: Globe },
  { value: "ai_credits", label: "AI Credits", icon: Sparkles },
  { value: "system", label: "System", icon: Shield },
  { value: "settings", label: "Settings", icon: Settings2 },
];

// Demo notifications for empty-state fallback
const demoNotifications = [
  { id: "demo-1", user_id: "", category: "publishing", title: "Reviewer Request", description: 'You have been invited to review a manuscript titled "Renewable Energy Policy Framework in West Africa" for African Energy Policy Review.', link: "/dashboard/publishing/track", read: false, created_at: new Date(Date.now() - 3600000).toISOString() },
  { id: "demo-2", user_id: "", category: "publishing", title: "Submission Update", description: 'Your manuscript "AI-Assisted Epidemiological Modeling" has moved to Peer Review stage.', link: "/dashboard/publishing/track", read: false, created_at: new Date(Date.now() - 7200000).toISOString() },
  { id: "demo-3", user_id: "", category: "network", title: "Connection Request", description: "Dr. Kofi Mensah wants to connect with you.", link: "/dashboard/network", read: false, created_at: new Date(Date.now() - 10800000).toISOString() },
  { id: "demo-4", user_id: "", category: "network", title: "Advisory Request", description: "Ministry of Energy Ghana requests policy advisory consultation on renewable energy strategies.", link: "/dashboard/network", read: true, created_at: new Date(Date.now() - 86400000).toISOString() },
  { id: "demo-5", user_id: "", category: "network", title: "Job Invitation", description: "You have been invited to apply for a Research Fellow position at University of Cape Town.", link: "/dashboard/network", read: false, created_at: new Date(Date.now() - 43200000).toISOString() },
  { id: "demo-6", user_id: "", category: "ai_credits", title: "Low Credits", description: "You have only 2 AI credits remaining. Top up to continue using AI features.", link: "/dashboard/billing", read: false, created_at: new Date(Date.now() - 14400000).toISOString() },
  { id: "demo-7", user_id: "", category: "ai_credits", title: "Credits Purchased", description: "10 AI credits have been added to your account.", link: "/dashboard/billing", read: true, created_at: new Date(Date.now() - 172800000).toISOString() },
  { id: "demo-8", user_id: "", category: "system", title: "Platform Update", description: "Afrika Scholar has released the Research Instrument Studio. Create surveys, tools, and simulations.", link: "/dashboard/instrument-studio", read: true, created_at: new Date(Date.now() - 259200000).toISOString() },
  { id: "demo-9", user_id: "", category: "system", title: "Scheduled Maintenance", description: "Platform maintenance scheduled for Saturday 10PM – 12AM WAT.", link: null, read: true, created_at: new Date(Date.now() - 345600000).toISOString() },
  { id: "demo-10", user_id: "", category: "publishing", title: "Reviewer Comments Available", description: 'Reviewer comments are available for "AI-Assisted Epidemiological Modeling". Please review and upload revisions.', link: "/dashboard/publishing/track", read: true, created_at: new Date(Date.now() - 172800000).toISOString() },
];

export default function NotificationsPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const activeTab = searchParams.get("tab") || "all";

  const category = activeTab === "all" || activeTab === "settings" ? undefined : activeTab;
  const { notifications: dbNotifications, isLoading, unreadCount, markAsRead, markAllRead, deleteNotification, clearAll } = useNotifications(category);

  // Use demo data when no real notifications exist
  const isDemo = dbNotifications.length === 0 && !isLoading;
  const allNotifications = isDemo ? demoNotifications : dbNotifications;
  const notifications = activeTab === "all" || activeTab === "settings"
    ? allNotifications
    : allNotifications.filter((n) => n.category === activeTab);

  const handleTabChange = (value: string) => {
    setSearchParams({ tab: value });
  };

  return (
    <DashboardLayout>
      <div className="max-w-4xl mx-auto">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-2xl font-bold text-foreground">Notifications</h1>
            <p className="text-sm text-muted-foreground mt-1">Your centralized activity center</p>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" size="sm" className="text-xs gap-1.5" onClick={() => { markAllRead(); toast.success("All marked as read"); }}>
              <Check className="h-3.5 w-3.5" /> Mark all read
            </Button>
            <Button variant="outline" size="sm" className="text-xs gap-1.5 text-destructive border-destructive/20 hover:bg-destructive/5" onClick={() => { clearAll(); toast.success("Notifications cleared"); }}>
              <Trash2 className="h-3.5 w-3.5" /> Clear all
            </Button>
          </div>
        </div>

        <Tabs value={activeTab} onValueChange={handleTabChange}>
          <TabsList className="bg-secondary/50 p-1 h-auto flex-wrap gap-1 mb-6">
            {tabs.map((tab) => (
              <TabsTrigger key={tab.value} value={tab.value} className="text-xs gap-1.5 data-[state=active]:bg-background data-[state=active]:shadow-sm">
                <tab.icon className="h-3.5 w-3.5" />
                {tab.label}
                {tab.value !== "settings" && tab.value !== "all" && (
                  <Badge variant="secondary" className="ml-1 text-[9px] h-4 min-w-4 px-1">
                    {allNotifications.filter((n) => n.category === tab.value && !n.read).length}
                  </Badge>
                )}
              </TabsTrigger>
            ))}
          </TabsList>

          {/* All tab views except settings */}
          {tabs.filter((t) => t.value !== "settings").map((tab) => (
            <TabsContent key={tab.value} value={tab.value}>
              <TabTitle tab={tab} />
              {notifications.length === 0 ? (
                <NotificationEmptyState message={getEmptyMessage(tab.value)} />
              ) : (
                <div className="space-y-3">
                  {notifications.map((n) => (
                    <NotificationCard
                      key={n.id}
                      notification={n}
                      onMarkRead={isDemo ? undefined : markAsRead}
                      onDelete={isDemo ? undefined : deleteNotification}
                      actions={getActions(n)}
                    />
                  ))}
                </div>
              )}
            </TabsContent>
          ))}

          <TabsContent value="settings">
            <NotificationSettings />
          </TabsContent>
        </Tabs>
      </div>
    </DashboardLayout>
  );
}

function TabTitle({ tab }: { tab: typeof tabs[number] }) {
  const titles: Record<string, { title: string; desc: string }> = {
    all: { title: "All Notifications", desc: "A centralized feed of all your activities." },
    publishing: { title: "Publishing Activity", desc: "Submissions, reviews, and manuscript updates." },
    network: { title: "Network Activity", desc: "Connections, advisory requests, and job invitations." },
    ai_credits: { title: "AI Credit Alerts", desc: "Credit usage, limits, and purchase confirmations." },
    system: { title: "System Alerts", desc: "Platform updates, maintenance, and security notifications." },
  };
  const t = titles[tab.value] || titles.all;
  return (
    <div className="mb-4">
      <h2 className="text-lg font-semibold text-foreground">{t.title}</h2>
      <p className="text-xs text-muted-foreground">{t.desc}</p>
    </div>
  );
}

function getActions(n: { category: string; title: string }) {
  if (n.category === "publishing" && n.title.includes("Reviewer")) {
    return (
      <div className="flex gap-2">
        <Button size="sm" className="h-7 text-xs bg-accent hover:bg-accent/90 text-accent-foreground">Accept Review</Button>
        <Button size="sm" variant="outline" className="h-7 text-xs">Decline</Button>
      </div>
    );
  }
  if (n.category === "publishing" && n.title.includes("Comments")) {
    return (
      <div className="flex gap-2">
        <Button size="sm" variant="outline" className="h-7 text-xs">View Comments</Button>
        <Button size="sm" className="h-7 text-xs bg-accent hover:bg-accent/90 text-accent-foreground">Upload Revision</Button>
      </div>
    );
  }
  if (n.category === "network" && n.title.includes("Connection")) {
    return (
      <div className="flex gap-2">
        <Button size="sm" className="h-7 text-xs bg-accent hover:bg-accent/90 text-accent-foreground">Accept</Button>
        <Button size="sm" variant="outline" className="h-7 text-xs">Ignore</Button>
      </div>
    );
  }
  if (n.category === "network" && n.title.includes("Advisory")) {
    return (
      <div className="flex gap-2">
        <Button asChild size="sm" variant="outline" className="h-7 text-xs"><Link to="/dashboard/network">View Request</Link></Button>
        <Button size="sm" variant="outline" className="h-7 text-xs">Message Institution</Button>
      </div>
    );
  }
  if (n.category === "ai_credits" && n.title.includes("Low")) {
    return (
      <Button asChild size="sm" className="h-7 text-xs bg-accent hover:bg-accent/90 text-accent-foreground"><Link to="/dashboard/billing">Buy Credits</Link></Button>
    );
  }
  if (n.category === "system" && n.title.includes("Update")) {
    return (
      <Button asChild size="sm" variant="outline" className="h-7 text-xs"><Link to="/dashboard/instrument-studio">Explore Feature</Link></Button>
    );
  }
  return null;
}

function getEmptyMessage(tab: string): string {
  const msgs: Record<string, string> = {
    all: "When activity occurs, updates will appear here.",
    publishing: "Publishing updates will appear here when you submit or review manuscripts.",
    network: "Network activity like connection requests and job invitations will appear here.",
    ai_credits: "AI credit alerts and usage notifications will appear here.",
    system: "Platform announcements and system updates will appear here.",
  };
  return msgs[tab] || msgs.all;
}

function NotificationSettings() {
  const { preferences, isLoading, updatePreferences } = useNotificationPreferences();

  const prefs = preferences || {
    email_notifications: true,
    dashboard_notifications: true,
    ai_alerts: true,
    publishing_updates: true,
    network_invitations: true,
  };

  const toggle = (key: string, value: boolean) => {
    updatePreferences({ [key]: value });
    toast.success("Preference updated");
  };

  const settings = [
    { key: "email_notifications", label: "Email Notifications", desc: "Receive notification emails" },
    { key: "dashboard_notifications", label: "Dashboard Notifications", desc: "Show notifications in your dashboard" },
    { key: "ai_alerts", label: "AI Alerts", desc: "Get notified about credit usage and limits" },
    { key: "publishing_updates", label: "Publishing Updates", desc: "Submission status and review notifications" },
    { key: "network_invitations", label: "Network Invitations", desc: "Connection requests and job invitations" },
  ];

  return (
    <div>
      <div className="mb-4">
        <h2 className="text-lg font-semibold text-foreground">Notification Preferences</h2>
        <p className="text-xs text-muted-foreground">Control what notifications you receive.</p>
      </div>
      <div className="space-y-1">
        {settings.map((s) => (
          <div key={s.key} className="flex items-center justify-between rounded-lg border border-border p-4 bg-card">
            <div>
              <Label className="text-sm font-medium">{s.label}</Label>
              <p className="text-xs text-muted-foreground">{s.desc}</p>
            </div>
            <Switch
              checked={(prefs as any)[s.key] ?? true}
              onCheckedChange={(checked) => toggle(s.key, checked)}
              disabled={isLoading}
            />
          </div>
        ))}
      </div>
    </div>
  );
}
