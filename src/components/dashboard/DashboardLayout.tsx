import { ReactNode, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { ChevronDown, ChevronRight as ChevronRightIcon, LogOut } from "lucide-react";
import {
  LayoutDashboard, FileText, FilePlus, Database, BarChart3,
  Compass, CalendarClock, Users2, Search, Send, ClipboardList,
  Wrench, MessageCircle, CreditCard, Settings, TrendingUp,
  Lightbulb, Presentation, PlusCircle, FolderOpen,
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

interface SidebarItem {
  title: string;
  url: string;
  icon: any;
}

interface SidebarSection {
  label: string;
  collapsible: boolean;
  items: SidebarItem[];
}

const sidebarSections: SidebarSection[] = [
  {
    label: "",
    collapsible: false,
    items: [{ title: "Dashboard", url: "/dashboard", icon: LayoutDashboard }],
  },
  {
    label: "My Research",
    collapsible: true,
    items: [
      { title: "Generate Paper", url: "/dashboard/generate-paper", icon: FilePlus },
      { title: "My Papers", url: "/dashboard/my-papers", icon: FileText },
      { title: "Pro Tip", url: "/dashboard/pro-tip", icon: Lightbulb },
    ],
  },
  {
    label: "Data & Analysis",
    collapsible: true,
    items: [
      { title: "Dataset Explorer", url: "/dashboard/data/explorer", icon: Database },
      { title: "Dataset Analyzer", url: "/dashboard/data/analyzer", icon: BarChart3 },
    ],
  },
  {
    label: "Publishing",
    collapsible: true,
    items: [
      { title: "Submit Manuscript", url: "/dashboard/publishing/submit", icon: Send },
      { title: "Track Submissions", url: "/dashboard/publishing/track", icon: ClipboardList },
    ],
  },
  {
    label: "Intelligence Hub",
    collapsible: true,
    items: [
      { title: "Journals", url: "/dashboard/intelligence?tab=journals", icon: Compass },
      { title: "Conferences", url: "/dashboard/intelligence?tab=conferences", icon: CalendarClock },
      { title: "Stakeholders", url: "/dashboard/intelligence?tab=stakeholders", icon: Users2 },
      { title: "Research Gaps", url: "/dashboard/intelligence?tab=gaps", icon: Search },
      { title: "Trends", url: "/dashboard/intelligence?tab=trends", icon: TrendingUp },
    ],
  },
  {
    label: "Instrument Studio",
    collapsible: true,
    items: [
      { title: "Create Instrument", url: "/dashboard/instrument-studio", icon: PlusCircle },
      { title: "My Instruments", url: "/dashboard/instrument-studio/my", icon: FolderOpen },
      { title: "AI Slide Builder", url: "/dashboard/instrument-studio/slides", icon: Presentation },
    ],
  },
  {
    label: "",
    collapsible: false,
    items: [
      { title: "Community", url: "/dashboard/community", icon: MessageCircle },
      { title: "Billing & Credits", url: "/dashboard/billing", icon: CreditCard },
      { title: "Settings", url: "/dashboard/settings", icon: Settings },
    ],
  },
];

function CollapsibleSidebarGroup({ section, collapsed }: { section: SidebarSection; collapsed: boolean }) {
  const location = useLocation();
  const isActive = section.items.some((item) => {
    if (item.url.includes("?")) {
      return location.pathname === item.url.split("?")[0];
    }
    return location.pathname === item.url || location.pathname.startsWith(item.url + "/");
  });
  const [open, setOpen] = useState(isActive);

  return (
    <Collapsible open={open} onOpenChange={setOpen}>
      <SidebarGroup>
        <CollapsibleTrigger className="w-full">
          <SidebarGroupLabel className="text-sidebar-foreground/50 text-[10px] uppercase tracking-widest cursor-pointer flex items-center justify-between w-full hover:text-sidebar-foreground/70 transition-colors font-semibold">
            <span>{section.label}</span>
            {!collapsed && (
              <ChevronDown className={`h-3 w-3 transition-transform ${open ? "" : "-rotate-90"}`} />
            )}
          </SidebarGroupLabel>
        </CollapsibleTrigger>
        <CollapsibleContent>
          <SidebarGroupContent>
            <SidebarMenu>
              {section.items.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild>
                    <NavLink
                      to={item.url}
                      end={item.url === "/dashboard"}
                      className="text-sidebar-foreground/70 hover:bg-sidebar-accent hover:text-sidebar-accent-foreground text-[13px] py-1.5"
                      activeClassName="bg-sidebar-accent text-accent font-semibold"
                    >
                      <item.icon className="h-4 w-4 mr-2 shrink-0" />
                      {!collapsed && <span>{item.title}</span>}
                    </NavLink>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
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

  return (
    <Sidebar collapsible="icon" className="border-r border-sidebar-border">
      <div className="h-16 flex items-center px-4 border-b border-sidebar-border">
        {!collapsed && (
          <Link to="/" className="flex items-center gap-1">
            <span className="text-lg font-bold">
              <span className="text-accent">Afrika</span>
              <span className="text-sidebar-foreground">Scholar</span>
            </span>
          </Link>
        )}
        {collapsed && (
          <span className="text-lg font-bold text-accent mx-auto">A</span>
        )}
      </div>
      <SidebarContent className="pt-2 overflow-y-auto">
        {sidebarSections.map((section, gi) => {
          if (section.collapsible && section.label) {
            return <CollapsibleSidebarGroup key={gi} section={section} collapsed={collapsed} />;
          }
          return (
            <SidebarGroup key={gi}>
              {section.label && (
                <SidebarGroupLabel className="text-sidebar-foreground/50 text-[10px] uppercase tracking-widest font-semibold">
                  {section.label}
                </SidebarGroupLabel>
              )}
              <SidebarGroupContent>
                <SidebarMenu>
                  {section.items.map((item) => (
                    <SidebarMenuItem key={item.title}>
                      <SidebarMenuButton asChild>
                        <NavLink
                          to={item.url}
                          end={item.url === "/dashboard"}
                          className="text-sidebar-foreground/70 hover:bg-sidebar-accent hover:text-sidebar-accent-foreground text-[13px] py-1.5"
                          activeClassName="bg-sidebar-accent text-accent font-semibold"
                        >
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
          <div className="flex items-center gap-2">
            <div className="h-8 w-8 rounded-full bg-accent flex items-center justify-center text-accent-foreground text-sm font-bold">
              D
            </div>
            <div className="text-xs">
              <p className="font-semibold text-sidebar-foreground">Defi</p>
              <p className="text-sidebar-foreground/50">Pro plan</p>
            </div>
          </div>
        </div>
      )}
    </Sidebar>
  );
}

export default function DashboardLayout({ children }: { children: ReactNode }) {
  const [showLogout, setShowLogout] = useState(false);
  const navigate = useNavigate();

  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full bg-secondary">
        <AppSidebar />
        <div className="flex-1 flex flex-col min-w-0">
          <header className="h-16 flex items-center justify-between border-b border-border bg-background px-4 lg:px-6 sticky top-0 z-30">
            <SidebarTrigger className="mr-2" />
            <div className="flex items-center gap-3 ml-auto">
              <Link to="/dashboard/billing" className="text-xs font-medium text-accent hover:underline hidden sm:block">
                Pro Credits: 55
              </Link>
              <Badge variant="outline" className="text-xs font-medium border-accent text-accent">
                Pro (Trial)
              </Badge>
              <NotificationsPanel />
              <DropdownMenu>
                <DropdownMenuTrigger className="flex items-center gap-1">
                  <div className="h-8 w-8 rounded-full bg-primary flex items-center justify-center text-primary-foreground text-sm font-bold">
                    D
                  </div>
                  <ChevronDown className="h-3 w-3 text-muted-foreground" />
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem asChild><Link to="/dashboard/settings">Settings</Link></DropdownMenuItem>
                  <DropdownMenuItem asChild><Link to="/dashboard/billing">Billing</Link></DropdownMenuItem>
                  <DropdownMenuItem onClick={() => setShowLogout(true)} className="text-destructive">
                    <LogOut className="h-3 w-3 mr-2" /> Sign Out
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </header>
          <main className="flex-1 overflow-auto p-4 lg:p-8">
            {children}
          </main>
        </div>
      </div>

      {/* Logout confirmation */}
      <Dialog open={showLogout} onOpenChange={setShowLogout}>
        <DialogContent className="max-w-sm">
          <DialogHeader><DialogTitle>Are you sure you want to sign out?</DialogTitle></DialogHeader>
          <p className="text-sm text-muted-foreground">You will be redirected to the login page.</p>
          <div className="flex gap-2 mt-3">
            <Button variant="outline" size="sm" className="flex-1" onClick={() => setShowLogout(false)}>Cancel</Button>
            <Button variant="destructive" size="sm" className="flex-1" onClick={() => { setShowLogout(false); navigate("/auth/login"); }}>Continue</Button>
          </div>
        </DialogContent>
      </Dialog>
    </SidebarProvider>
  );
}
