import { ReactNode, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { ChevronDown } from "lucide-react";
import {
  LayoutDashboard,
  FileText,
  FilePlus,
  Database,
  BarChart3,
  Compass,
  CalendarClock,
  Users2,
  Search,
  Send,
  ClipboardList,
  Wrench,
  MessageCircle,
  CreditCard,
  Settings,
} from "lucide-react";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarProvider,
  SidebarTrigger,
  useSidebar,
} from "@/components/ui/sidebar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Badge } from "@/components/ui/badge";
import { NavLink } from "@/components/NavLink";
import { NotificationsPanel } from "@/components/dashboard/NotificationsPanel";

const sidebarGroups = [
  {
    label: "",
    items: [{ title: "Dashboard", url: "/dashboard", icon: LayoutDashboard }],
  },
  {
    label: "My Research",
    items: [
      { title: "Generate Paper", url: "/dashboard/generate-paper", icon: FilePlus },
      { title: "My Papers", url: "/dashboard/my-papers", icon: FileText },
    ],
  },
  {
    label: "Data & Analysis",
    items: [
      { title: "Dataset Explorer", url: "/dashboard/data/explorer", icon: Database },
      { title: "Dataset Analyzer", url: "/dashboard/data/analyzer", icon: BarChart3 },
    ],
  },
  {
    label: "Intelligence Hub",
    items: [
      { title: "Journal Recommender", url: "/dashboard/intelligence/journals", icon: Compass },
      { title: "Conference Alerts", url: "/dashboard/intelligence/conferences", icon: CalendarClock },
      { title: "Stakeholders", url: "/dashboard/intelligence/stakeholders", icon: Users2 },
      { title: "Research Gaps", url: "/dashboard/intelligence/gaps", icon: Search },
    ],
  },
  {
    label: "Publishing",
    items: [
      { title: "Submit Manuscript", url: "/dashboard/publishing/submit", icon: Send },
      { title: "Track Submissions", url: "/dashboard/publishing/track", icon: ClipboardList },
    ],
  },
  {
    label: "",
    items: [
      { title: "Instrument Studio", url: "/dashboard/instrument-studio", icon: Wrench },
      { title: "Community", url: "/dashboard/community", icon: MessageCircle },
      { title: "Billing & Credits", url: "/dashboard/billing", icon: CreditCard },
      { title: "Settings", url: "/dashboard/settings", icon: Settings },
    ],
  },
];

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
              <span className="text-sidebar-foreground">scholar</span>
            </span>
          </Link>
        )}
        {collapsed && (
          <span className="text-lg font-bold text-accent mx-auto">A</span>
        )}
      </div>
      <SidebarContent className="pt-2">
        {sidebarGroups.map((group, gi) => (
          <SidebarGroup key={gi}>
            {group.label && (
              <SidebarGroupLabel className="text-sidebar-foreground/50 text-[10px] uppercase tracking-widest">
                {group.label}
              </SidebarGroupLabel>
            )}
            <SidebarGroupContent>
              <SidebarMenu>
                {group.items.map((item) => (
                  <SidebarMenuItem key={item.title}>
                    <SidebarMenuButton asChild>
                      <NavLink
                        to={item.url}
                        end={item.url === "/dashboard"}
                        className="text-sidebar-foreground/70 hover:bg-sidebar-accent hover:text-sidebar-accent-foreground"
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
        ))}
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
  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full bg-secondary">
        <AppSidebar />
        <div className="flex-1 flex flex-col min-w-0">
          <header className="h-16 flex items-center justify-between border-b border-border bg-background px-4 lg:px-6 sticky top-0 z-30">
            <SidebarTrigger className="mr-2" />
            <div className="flex items-center gap-3 ml-auto">
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
                  <DropdownMenuItem asChild><Link to="/auth/login">Sign Out</Link></DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </header>
          <main className="flex-1 overflow-auto p-4 lg:p-8">
            {children}
          </main>
        </div>
      </div>
    </SidebarProvider>
  );
}
