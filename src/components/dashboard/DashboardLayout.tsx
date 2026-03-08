import { ReactNode, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { ChevronDown, LogOut, MessageCircle as MessagesIcon, Lock, Search, Sparkles, Bell } from "lucide-react";
import { useSubscriptionContext } from "@/contexts/SubscriptionContext";
import {
  LayoutDashboard, FileText, FilePlus, Database, BarChart3,
  Compass, CalendarClock, Users2, Send, ClipboardList,
  MessageCircle, CreditCard, Settings, TrendingUp,
  Lightbulb, Presentation, PlusCircle, FolderOpen,
  BookOpen, Globe, Handshake, Building2, User, Shield,
  Briefcase, Library,
} from "lucide-react";
import {
  Sidebar, SidebarContent, SidebarGroup, SidebarGroupContent,
  SidebarGroupLabel, SidebarMenu, SidebarMenuButton, SidebarMenuItem,
  SidebarProvider, SidebarTrigger, useSidebar,
} from "@/components/ui/sidebar";
import {
  Collapsible, CollapsibleContent, CollapsibleTrigger,
} from "@/components/ui/collapsible";
import {
  DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Dialog, DialogContent, DialogHeader, DialogTitle,
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { NavLink } from "@/components/NavLink";
import { NotificationsPanel } from "@/components/dashboard/NotificationsPanel";
import { useAuth, AppRole } from "@/contexts/AuthContext";
import { useModuleUnlocksContext } from "@/contexts/ModuleUnlocksContext";
import { ModuleType } from "@/hooks/useModuleUnlocks";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { Input } from "@/components/ui/input";

interface SidebarItem {
  title: string;
  url: string;
  icon: any;
  requiredRoles?: AppRole[];
  children?: SidebarItem[];
}

interface SidebarSection {
  label: string;
  collapsible: boolean;
  items: SidebarItem[];
  requiredRoles?: AppRole[];
  /** If set, this section is only visible when the module is unlocked */
  requiredModule?: ModuleType;
  /** If true, section shows as locked link to subscription when not subscribed */
  requiresSubscription?: boolean;
}

const ALL_ROLES: AppRole[] = ["researcher", "student", "reviewer", "institutional_admin"];
const RESEARCH_ROLES: AppRole[] = ["researcher", "institutional_admin"];
const NON_STUDENT: AppRole[] = ["researcher", "reviewer", "institutional_admin"];
const ADMIN_ONLY: AppRole[] = ["institutional_admin"];

const sidebarSections: SidebarSection[] = [
  // === CORE ===
  {
    label: "",
    collapsible: false,
    items: [
      { title: "Dashboard", url: "/dashboard", icon: LayoutDashboard },
    ],
  },

  // === ACTION-BASED MODULES (hidden until unlocked) ===
  {
    label: "My Research",
    collapsible: true,
    requiredModule: "my_research",
    items: [
      { title: "Generate Paper", url: "/dashboard/generate-paper", icon: FilePlus },
      { title: "My Papers", url: "/dashboard/my-papers", icon: FileText },
      { title: "Pro Tip", url: "/dashboard/pro-tip", icon: Lightbulb },
    ],
  },
  {
    label: "Publishing",
    collapsible: true,
    requiredModule: "publishing",
    requiredRoles: NON_STUDENT,
    items: [
      { title: "Overview", url: "/dashboard/publishing", icon: FileText },
      { title: "Submit Manuscript", url: "/dashboard/publishing/submit", icon: Send },
      { title: "My Submissions", url: "/dashboard/publishing/submissions", icon: ClipboardList },
      { title: "Editorial Workflow", url: "/dashboard/publishing/workflow", icon: CalendarClock },
      { title: "Journal Management", url: "/dashboard/publishing/journals", icon: BookOpen },
    ],
  },
  {
    label: "Research Intelligence",
    collapsible: true,
    requiredModule: "publeesh_ai",
    requiresSubscription: true,
    items: [
      { title: "Dataset Explorer", url: "/dashboard/data/explorer", icon: Database },
      { title: "Dataset Analyzer", url: "/dashboard/data/analyzer", icon: BarChart3 },
      { title: "Intelligence Hub", url: "/dashboard/intelligence?tab=journals", icon: Compass },
      {
        title: "Instrument Studio", url: "/dashboard/instrument-studio", icon: PlusCircle,
        children: [
          { title: "Create Instrument", url: "/dashboard/instrument-studio", icon: PlusCircle },
          { title: "AI Paper Generator", url: "/dashboard/ai-papers", icon: Sparkles },
          { title: "AI Slide Builder", url: "/dashboard/instrument-studio/slides", icon: Presentation },
        ],
      },
      { title: "Billing & Credits", url: "/dashboard/billing", icon: CreditCard },
    ],
  },
  {
    label: "Institutional Collaboration",
    collapsible: true,
    items: [
      { title: "Overview", url: "/dashboard/institutional", icon: Building2 },
      { title: "Talent Requests", url: "/dashboard/institutional/talent-requests", icon: Briefcase },
      { title: "Advisory Requests", url: "/dashboard/institutional/advisory", icon: ClipboardList },
      { title: "Lecturer Search", url: "/dashboard/institutional/lecturers", icon: Search },
      { title: "Collaborations", url: "/dashboard/institutional/collaborations", icon: Handshake },
      { title: "My Engagements", url: "/dashboard/institutional/engagements", icon: Users2 },
    ],
  },

  // === CORE LINKS (above settings) ===
  {
    label: "",
    collapsible: false,
    items: [
      { title: "Community", url: "/dashboard/community", icon: MessageCircle },
      { title: "Library", url: "/dashboard/library", icon: BookOpen },
      { title: "Network", url: "/dashboard/network", icon: Globe },
      { title: "Profile", url: "/dashboard/profile", icon: User },
    ],
  },

  // === SETTINGS ===
  {
    label: "",
    collapsible: false,
    items: [
      { title: "Settings", url: "/dashboard/settings", icon: Settings },
    ],
  },
];

function canAccess(role: AppRole | null, requiredRoles?: AppRole[]): boolean {
  if (!requiredRoles) return true;
  if (!role) return true;
  return requiredRoles.includes(role);
}

function NestedSidebarItem({ item, collapsed, getIsItemActive }: { item: SidebarItem; collapsed: boolean; getIsItemActive: (i: SidebarItem) => boolean }) {
  const childActive = item.children?.some((c) => getIsItemActive(c)) || false;
  const [open, setOpen] = useState(childActive);

  return (
    <SidebarMenuItem>
      <Collapsible open={open} onOpenChange={setOpen}>
        <CollapsibleTrigger className="w-full">
          <div className={`flex items-center text-[13px] py-1.5 px-2 rounded-md cursor-pointer transition-colors ${
            childActive ? "text-accent font-semibold" : "text-sidebar-foreground/70 hover:bg-sidebar-accent hover:text-sidebar-accent-foreground"
          }`}>
            <item.icon className="h-4 w-4 mr-2 shrink-0" />
            {!collapsed && (
              <>
                <span className="flex-1 text-left">{item.title}</span>
                <ChevronDown className={`h-3 w-3 transition-transform ${open ? "" : "-rotate-90"}`} />
              </>
            )}
          </div>
        </CollapsibleTrigger>
        <CollapsibleContent>
          <SidebarMenu className="ml-4 border-l border-sidebar-border pl-2 mt-1">
            {item.children?.map((child) => {
              const active = getIsItemActive(child);
              return (
                <SidebarMenuItem key={child.title}>
                  <SidebarMenuButton asChild>
                    <Link to={child.url}
                      className={`flex items-center text-[12px] py-1 px-2 rounded-md transition-colors ${
                        active ? "bg-sidebar-accent text-accent font-semibold" : "text-sidebar-foreground/60 hover:bg-sidebar-accent hover:text-sidebar-accent-foreground"
                      }`}>
                      <child.icon className="h-3.5 w-3.5 mr-2 shrink-0" />
                      {!collapsed && <span>{child.title}</span>}
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              );
            })}
          </SidebarMenu>
        </CollapsibleContent>
      </Collapsible>
    </SidebarMenuItem>
  );
}

function CollapsibleSidebarGroup({ section, collapsed, userRole }: { section: SidebarSection; collapsed: boolean; userRole: AppRole | null }) {
  const location = useLocation();
  const allItems = section.items.flatMap((item) => [item, ...(item.children || [])]);
  const isActive = allItems.some((item) => {
    if (item.url.includes("?")) return location.pathname === item.url.split("?")[0];
    return location.pathname === item.url || location.pathname.startsWith(item.url + "/");
  });
  const [open, setOpen] = useState(isActive);
  const sectionLocked = !canAccess(userRole, section.requiredRoles);

  const getIsItemActive = (item: SidebarItem) => {
    if (item.url.includes("?")) {
      const [path, query] = item.url.split("?");
      if (location.pathname !== path) return false;
      const params = new URLSearchParams(query);
      const searchParams = new URLSearchParams(location.search);
      for (const [key, value] of params.entries()) {
        if (searchParams.get(key) !== value) return false;
      }
      return true;
    }
    if (item.url === "/dashboard/instrument-studio") return location.pathname === item.url;
    return location.pathname === item.url || location.pathname.startsWith(item.url + "/");
  };

  return (
    <Collapsible open={open} onOpenChange={setOpen}>
      <SidebarGroup>
        <CollapsibleTrigger className="w-full">
          <SidebarGroupLabel className="text-sidebar-foreground/70 text-[13px] tracking-wide cursor-pointer flex items-center justify-between w-full hover:text-sidebar-foreground/70 transition-colors font-semibold px-2">
            <span className="flex items-center gap-1.5">
              {section.label}
              {sectionLocked && <Lock className="h-2.5 w-2.5 text-sidebar-foreground/30" />}
            </span>
            {!collapsed && (
              <ChevronDown className={`h-3 w-3 transition-transform ${open ? "" : "-rotate-90"}`} />
            )}
          </SidebarGroupLabel>
        </CollapsibleTrigger>
        <CollapsibleContent>
          <SidebarGroupContent>
            <SidebarMenu>
              {section.items.map((item) => {
                const active = getIsItemActive(item);
                const locked = !canAccess(userRole, item.requiredRoles);

                if (locked) {
                  return (
                    <SidebarMenuItem key={item.title}>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <div className="flex items-center text-[13px] py-1.5 px-2 rounded-md text-sidebar-foreground/30 cursor-not-allowed">
                            <item.icon className="h-4 w-4 mr-2 shrink-0" />
                            {!collapsed && <span>{item.title}</span>}
                            <Lock className="h-3 w-3 ml-auto" />
                          </div>
                        </TooltipTrigger>
                        <TooltipContent side="right"><p className="text-xs">Upgrade your role to access</p></TooltipContent>
                      </Tooltip>
                    </SidebarMenuItem>
                  );
                }

                if (item.children) {
                  return <NestedSidebarItem key={item.title} item={item} collapsed={collapsed} getIsItemActive={getIsItemActive} />;
                }

                return (
                  <SidebarMenuItem key={item.title}>
                    <SidebarMenuButton asChild>
                      <Link to={item.url}
                        className={`flex items-center text-[13px] py-1.5 px-2 rounded-md transition-colors ${
                          active ? "bg-sidebar-accent text-accent font-semibold" : "text-sidebar-foreground/70 hover:bg-sidebar-accent hover:text-sidebar-accent-foreground"
                        }`}>
                        <item.icon className="h-4 w-4 mr-2 shrink-0" />
                        {!collapsed && <span>{item.title}</span>}
                      </Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                );
              })}
            </SidebarMenu>
          </SidebarGroupContent>
        </CollapsibleContent>
      </SidebarGroup>
    </Collapsible>
  );
}

function AppSidebar() {
  const { state } = useSidebar();
  const collapsed = state === "collapsed";
  const { profile, role } = useAuth();
  const { isModuleUnlocked } = useModuleUnlocksContext();
  const { isActive: hasSubscription } = useSubscriptionContext();

  const displayName = profile?.display_name || "User";
  const initial = displayName.charAt(0).toUpperCase();
  const roleLabelMap: Record<string, string> = {
    researcher: "Researcher", student: "Student", reviewer: "Reviewer", institutional_admin: "Admin",
  };

  return (
    <Sidebar collapsible="icon" className="border-r border-sidebar-border">
      <div className="h-16 flex items-center px-4 border-b border-sidebar-border">
        {!collapsed ? (
          <Link to="/" className="flex items-center gap-1">
            <span className="text-lg font-bold">
              <span className="text-accent">Afrika</span>
              <span className="text-sidebar-foreground">Scholar</span>
            </span>
          </Link>
        ) : (
          <span className="text-lg font-bold text-accent mx-auto">A</span>
        )}
      </div>
      <SidebarContent className="pt-2 overflow-y-auto">
        {sidebarSections.map((section, gi) => {
          // Hide entire section if role doesn't match
          if (section.requiredRoles && !canAccess(role, section.requiredRoles)) return null;

          // If requires subscription and not subscribed, show locked link
          if (section.requiresSubscription && !hasSubscription) {
            if (section.requiredModule && !isModuleUnlocked(section.requiredModule)) return null;
            return (
              <SidebarGroup key={gi}>
                <SidebarGroupContent>
                  <SidebarMenu>
                    <SidebarMenuItem>
                      <SidebarMenuButton asChild>
                        <Link to="/publeesh/subscription"
                          className="flex items-center text-[13px] py-1.5 px-2 rounded-md text-sidebar-foreground/40 hover:text-sidebar-foreground/60 transition-colors">
                          <Lock className="h-4 w-4 mr-2 shrink-0" />
                          {!collapsed && <span>{section.label} (Locked)</span>}
                        </Link>
                      </SidebarMenuButton>
                    </SidebarMenuItem>
                  </SidebarMenu>
                </SidebarGroupContent>
              </SidebarGroup>
            );
          }

          // Hide section if module not yet unlocked
          if (section.requiredModule && !isModuleUnlocked(section.requiredModule)) return null;

          if (section.collapsible && section.label) {
            return <CollapsibleSidebarGroup key={gi} section={section} collapsed={collapsed} userRole={role} />;
          }
          return (
            <SidebarGroup key={gi}>
              {section.label && (
                <SidebarGroupLabel className="text-sidebar-foreground/70 text-[13px] tracking-wide font-semibold px-2">
                   {section.label}
                </SidebarGroupLabel>
              )}
              <SidebarGroupContent>
                <SidebarMenu>
                  {section.items.map((item) => (
                    <SidebarMenuItem key={item.title}>
                      <SidebarMenuButton asChild>
                        <NavLink to={item.url} end={item.url === "/dashboard"}
                          className="text-sidebar-foreground/70 hover:bg-sidebar-accent hover:text-sidebar-accent-foreground text-[13px] py-1.5"
                          activeClassName="bg-sidebar-accent text-accent font-semibold">
                          <item.icon className="h-4 w-4 mr-2 shrink-0" />
                          {!collapsed && <span>{item.title}</span>}
                        </NavLink>
                      </SidebarMenuButton>
                    </SidebarMenuItem>
                  ))}
                </SidebarMenu>
              </SidebarGroupContent>
            </SidebarGroup>
          );
        })}
      </SidebarContent>
      {!collapsed && (
        <div className="mt-auto border-t border-sidebar-border p-4">
          <Link to="/dashboard/profile" className="flex items-center gap-2 hover:opacity-80 transition-opacity">
            <div className="h-8 w-8 rounded-full bg-accent flex items-center justify-center text-accent-foreground text-sm font-bold">{initial}</div>
            <div className="text-xs">
              <p className="font-semibold text-sidebar-foreground">{displayName}</p>
              <p className="text-sidebar-foreground/50">{role ? roleLabelMap[role] || role : "Free"}</p>
            </div>
          </Link>
        </div>
      )}
    </Sidebar>
  );
}

export default function DashboardLayout({ children }: { children: ReactNode }) {
  const [showLogout, setShowLogout] = useState(false);
  const [globalSearch, setGlobalSearch] = useState("");
  const navigate = useNavigate();
  const { profile, role, signOut } = useAuth();

  const displayName = profile?.display_name || "User";
  const initial = displayName.charAt(0).toUpperCase();

  const handleSignOut = async () => {
    setShowLogout(false);
    await signOut();
    navigate("/auth/login");
  };

  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full bg-secondary">
        <AppSidebar />
        <div className="flex-1 flex flex-col min-w-0">
          <header className="h-16 flex items-center justify-between border-b border-border bg-background px-4 lg:px-6 sticky top-0 z-30">
            <div className="flex items-center gap-3">
              <SidebarTrigger />
              <div className="relative hidden md:block">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input placeholder="Search..." value={globalSearch} onChange={(e) => setGlobalSearch(e.target.value)}
                  className="pl-9 w-64 h-9 text-sm" />
              </div>
            </div>
            <div className="flex items-center gap-3 ml-auto">
              <Link to="/dashboard/billing" className="text-xs font-medium text-accent hover:underline hidden sm:block">
                AI Credits: 55
              </Link>
              <Link to="/dashboard/messages" className="relative">
                <MessagesIcon className="h-5 w-5 text-muted-foreground hover:text-foreground transition-colors" />
                <span className="absolute -top-1 -right-1 h-4 w-4 rounded-full bg-accent text-accent-foreground text-[10px] flex items-center justify-center font-bold">1</span>
              </Link>
              <Link to="/dashboard/notifications" className="relative p-2 rounded-md hover:bg-secondary transition-colors">
                <Bell className="h-5 w-5 text-muted-foreground" />
                <span className="absolute top-1 right-1 h-2.5 w-2.5 rounded-full bg-accent" />
              </Link>
              <DropdownMenu>
                <DropdownMenuTrigger className="flex items-center gap-1">
                  <div className="h-8 w-8 rounded-full bg-primary flex items-center justify-center text-primary-foreground text-sm font-bold">{initial}</div>
                  <ChevronDown className="h-3 w-3 text-muted-foreground" />
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-48">
                  <DropdownMenuItem asChild><Link to="/dashboard/profile">My Profile</Link></DropdownMenuItem>
                  <DropdownMenuItem asChild><Link to="/dashboard/settings">Settings</Link></DropdownMenuItem>
                  <DropdownMenuItem asChild><Link to="/dashboard/billing">Subscription</Link></DropdownMenuItem>
                  <DropdownMenuItem onClick={() => setShowLogout(true)} className="text-destructive">
                    <LogOut className="h-3 w-3 mr-2" /> Logout
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </header>
          <main className="flex-1 overflow-auto p-4 lg:p-8">{children}</main>
        </div>
      </div>

      <Dialog open={showLogout} onOpenChange={setShowLogout}>
        <DialogContent className="max-w-sm">
          <DialogHeader><DialogTitle>Are you sure you want to sign out?</DialogTitle></DialogHeader>
          <p className="text-sm text-muted-foreground">You will be redirected to the login page.</p>
          <div className="flex gap-2 mt-3">
            <Button variant="outline" size="sm" className="flex-1" onClick={() => setShowLogout(false)}>Cancel</Button>
            <Button variant="destructive" size="sm" className="flex-1" onClick={handleSignOut}>Continue</Button>
          </div>
        </DialogContent>
      </Dialog>
    </SidebarProvider>
  );
}
