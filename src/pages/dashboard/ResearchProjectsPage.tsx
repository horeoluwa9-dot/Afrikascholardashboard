import { useState } from "react";
import { Link } from "react-router-dom";
import DashboardLayout from "@/components/dashboard/DashboardLayout";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger,
} from "@/components/ui/dialog";
import {
  ChevronRight, FolderOpen, Plus, Users, Calendar,
  ArrowRight, Edit, Trash2, Clock,
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface ResearchProject {
  id: number;
  title: string;
  description: string;
  status: "active" | "completed" | "on-hold";
  collaborators: number;
  startDate: string;
  lastUpdated: string;
  researchArea: string;
}

const statusStyles: Record<string, string> = {
  active: "bg-afrika-green/10 text-afrika-green",
  completed: "bg-primary/10 text-primary",
  "on-hold": "bg-muted text-muted-foreground",
};

const initialProjects: ResearchProject[] = [
  {
    id: 1, title: "Urban Food Systems in West Africa",
    description: "A multi-city study examining food distribution, access, and sustainability in Lagos, Accra, and Dakar.",
    status: "active", collaborators: 3, startDate: "2026-01-15", lastUpdated: "2026-03-05", researchArea: "Food Security",
  },
  {
    id: 2, title: "Agricultural Credit Impact Analysis",
    description: "Longitudinal analysis of agricultural credit policies and their effects on smallholder productivity in Nigeria.",
    status: "active", collaborators: 1, startDate: "2025-09-01", lastUpdated: "2026-02-28", researchArea: "Agricultural Economics",
  },
  {
    id: 3, title: "Digital Library Management Framework",
    description: "Developing a performance evaluation framework for digital resource management in medical libraries.",
    status: "completed", collaborators: 2, startDate: "2025-06-01", lastUpdated: "2026-01-20", researchArea: "Library Science",
  },
];

const ResearchProjectsPage = () => {
  const [projects, setProjects] = useState(initialProjects);
  const [showCreate, setShowCreate] = useState(false);
  const [newTitle, setNewTitle] = useState("");
  const [newDesc, setNewDesc] = useState("");
  const [newArea, setNewArea] = useState("");
  const { toast } = useToast();

  const handleCreate = () => {
    if (!newTitle.trim()) return;
    const newProject: ResearchProject = {
      id: Date.now(), title: newTitle, description: newDesc,
      status: "active", collaborators: 0, startDate: new Date().toISOString().split("T")[0],
      lastUpdated: new Date().toISOString().split("T")[0], researchArea: newArea || "General",
    };
    setProjects((prev) => [newProject, ...prev]);
    setNewTitle(""); setNewDesc(""); setNewArea("");
    setShowCreate(false);
    toast({ title: "Project created!" });
  };

  const handleDelete = (id: number) => {
    setProjects((prev) => prev.filter((p) => p.id !== id));
    toast({ title: "Project deleted" });
  };

  return (
    <DashboardLayout>
      <div className="max-w-5xl mx-auto space-y-6">
        <div className="flex items-center gap-1 text-xs text-muted-foreground">
          <Link to="/dashboard" className="hover:text-foreground">Dashboard</Link>
          <ChevronRight className="h-3 w-3" />
          <span className="text-foreground font-medium">Research Projects</span>
        </div>

        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-foreground">Research Projects</h1>
            <p className="text-sm text-muted-foreground mt-1">Organize and track your ongoing research initiatives.</p>
          </div>
          <Button variant="afrika" size="sm" className="gap-1.5" onClick={() => setShowCreate(true)}>
            <Plus className="h-3.5 w-3.5" /> New Project
          </Button>
        </div>

        {/* Create Dialog */}
        <Dialog open={showCreate} onOpenChange={setShowCreate}>
          <DialogContent className="max-w-md">
            <DialogHeader><DialogTitle>Create Research Project</DialogTitle></DialogHeader>
            <div className="space-y-3 mt-2">
              <Input placeholder="Project title" value={newTitle} onChange={(e) => setNewTitle(e.target.value)} />
              <Input placeholder="Research area (e.g. Agricultural Economics)" value={newArea} onChange={(e) => setNewArea(e.target.value)} />
              <Textarea placeholder="Brief description..." value={newDesc} onChange={(e) => setNewDesc(e.target.value)} className="min-h-[80px]" />
              <div className="flex gap-2 justify-end">
                <Button variant="outline" size="sm" onClick={() => setShowCreate(false)}>Cancel</Button>
                <Button variant="afrika" size="sm" onClick={handleCreate} disabled={!newTitle.trim()}>Create</Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>

        {/* Projects List */}
        <div className="space-y-4">
          {projects.length === 0 ? (
            <div className="bg-card rounded-xl border border-border p-12 text-center">
              <FolderOpen className="h-10 w-10 mx-auto text-muted-foreground/30" />
              <p className="text-sm font-semibold text-foreground mt-3">No research projects yet</p>
              <p className="text-xs text-muted-foreground mt-1">Create a project to organize your research work.</p>
              <Button variant="afrika" size="sm" className="mt-3 gap-1" onClick={() => setShowCreate(true)}>
                <Plus className="h-3 w-3" /> New Project
              </Button>
            </div>
          ) : (
            projects.map((project) => (
              <div key={project.id} className="bg-card rounded-xl border border-border p-5 hover:shadow-sm transition-shadow">
                <div className="flex items-start justify-between">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <h3 className="text-sm font-bold text-foreground">{project.title}</h3>
                      <Badge className={`text-[10px] ${statusStyles[project.status]}`}>{project.status}</Badge>
                    </div>
                    <p className="text-xs text-muted-foreground mt-1 line-clamp-2">{project.description}</p>
                    <div className="flex items-center gap-4 mt-2 text-[10px] text-muted-foreground">
                      <Badge variant="outline" className="text-[10px]">{project.researchArea}</Badge>
                      <span className="flex items-center gap-1"><Users className="h-3 w-3" /> {project.collaborators} collaborator{project.collaborators !== 1 ? "s" : ""}</span>
                      <span className="flex items-center gap-1"><Calendar className="h-3 w-3" /> Started {project.startDate}</span>
                      <span className="flex items-center gap-1"><Clock className="h-3 w-3" /> Updated {project.lastUpdated}</span>
                    </div>
                  </div>
                  <div className="flex gap-1 ml-3 shrink-0">
                    <Button variant="ghost" size="sm" className="h-7 w-7 p-0"><Edit className="h-3.5 w-3.5" /></Button>
                    <Button variant="ghost" size="sm" className="h-7 w-7 p-0 text-destructive hover:text-destructive" onClick={() => handleDelete(project.id)}>
                      <Trash2 className="h-3.5 w-3.5" />
                    </Button>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </DashboardLayout>
  );
};

export default ResearchProjectsPage;