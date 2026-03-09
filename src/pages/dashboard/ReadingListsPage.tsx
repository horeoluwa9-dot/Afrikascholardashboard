import { useState } from "react";
import { Link } from "react-router-dom";
import DashboardLayout from "@/components/dashboard/DashboardLayout";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Dialog, DialogContent, DialogHeader, DialogTitle,
} from "@/components/ui/dialog";
import {
  ChevronRight, BookOpen, Plus, FileText, Trash2,
  ExternalLink, Clock,
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface ReadingListItem {
  id: number;
  title: string;
  authors: string;
  journal: string;
  year: number;
}

interface ReadingList {
  id: number;
  name: string;
  description: string;
  items: ReadingListItem[];
  updatedAt: string;
}

const initialLists: ReadingList[] = [
  {
    id: 1, name: "Agricultural Economics Literature",
    description: "Key papers on agricultural credit and productivity in developing nations.",
    updatedAt: "2026-03-04",
    items: [
      { id: 101, title: "Agricultural Credit and Smallholder Productivity: A Meta-Analysis", authors: "Okonkwo, A. & Mensah, K.", journal: "Journal of African Economies", year: 2025 },
      { id: 102, title: "Panel Data Methods for Agricultural Research", authors: "Adeyemi, T.", journal: "African Journal of Agricultural Research", year: 2024 },
    ],
  },
  {
    id: 2, name: "Digital Library Management",
    description: "Resources on digital transformation in academic libraries.",
    updatedAt: "2026-02-20",
    items: [
      { id: 201, title: "Digital Resource Management in Medical Libraries", authors: "Fresource, N.", journal: "Library & Information Science Research", year: 2025 },
    ],
  },
  {
    id: 3, name: "Climate Policy Research",
    description: "Literature on climate adaptation and policy frameworks in Africa.",
    updatedAt: "2026-02-15",
    items: [],
  },
];

const ReadingListsPage = () => {
  const [lists, setLists] = useState(initialLists);
  const [expandedId, setExpandedId] = useState<number | null>(null);
  const [showCreate, setShowCreate] = useState(false);
  const [newName, setNewName] = useState("");
  const [newDesc, setNewDesc] = useState("");
  const { toast } = useToast();

  const handleCreate = () => {
    if (!newName.trim()) return;
    const newList: ReadingList = {
      id: Date.now(), name: newName, description: newDesc,
      items: [], updatedAt: new Date().toISOString().split("T")[0],
    };
    setLists((prev) => [newList, ...prev]);
    setNewName(""); setNewDesc("");
    setShowCreate(false);
    toast({ title: "Reading list created!" });
  };

  const handleDeleteList = (id: number) => {
    setLists((prev) => prev.filter((l) => l.id !== id));
    toast({ title: "Reading list deleted" });
  };

  const handleRemoveItem = (listId: number, itemId: number) => {
    setLists((prev) => prev.map((l) =>
      l.id === listId ? { ...l, items: l.items.filter((i) => i.id !== itemId) } : l
    ));
    toast({ title: "Item removed from list" });
  };

  return (
    <DashboardLayout>
      <div className="max-w-5xl mx-auto space-y-6">
        <div className="flex items-center gap-1 text-xs text-muted-foreground">
          <Link to="/dashboard" className="hover:text-foreground">Dashboard</Link>
          <ChevronRight className="h-3 w-3" />
          <span className="text-foreground font-medium">Reading Lists</span>
        </div>

        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-foreground">Reading Lists</h1>
            <p className="text-sm text-muted-foreground mt-1">Organize papers and articles into curated reading lists.</p>
          </div>
          <Button variant="afrika" size="sm" className="gap-1.5" onClick={() => setShowCreate(true)}>
            <Plus className="h-3.5 w-3.5" /> New List
          </Button>
        </div>

        <Dialog open={showCreate} onOpenChange={setShowCreate}>
          <DialogContent className="max-w-md">
            <DialogHeader><DialogTitle>Create Reading List</DialogTitle></DialogHeader>
            <div className="space-y-3 mt-2">
              <Input placeholder="List name" value={newName} onChange={(e) => setNewName(e.target.value)} />
              <Textarea placeholder="Description (optional)" value={newDesc} onChange={(e) => setNewDesc(e.target.value)} className="min-h-[60px]" />
              <div className="flex gap-2 justify-end">
                <Button variant="outline" size="sm" onClick={() => setShowCreate(false)}>Cancel</Button>
                <Button variant="afrika" size="sm" onClick={handleCreate} disabled={!newName.trim()}>Create</Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>

        <div className="space-y-4">
          {lists.length === 0 ? (
            <div className="bg-card rounded-xl border border-border p-12 text-center">
              <BookOpen className="h-10 w-10 mx-auto text-muted-foreground/30" />
              <p className="text-sm font-semibold text-foreground mt-3">No reading lists yet</p>
              <p className="text-xs text-muted-foreground mt-1">Create a list to organize your research reading.</p>
              <Button variant="afrika" size="sm" className="mt-3 gap-1" onClick={() => setShowCreate(true)}>
                <Plus className="h-3 w-3" /> New List
              </Button>
            </div>
          ) : (
            lists.map((list) => (
              <div key={list.id} className="bg-card rounded-xl border border-border overflow-hidden">
                <button
                  onClick={() => setExpandedId(expandedId === list.id ? null : list.id)}
                  className="w-full p-5 flex items-center justify-between text-left hover:bg-secondary/30 transition-colors"
                >
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <BookOpen className="h-4 w-4 text-accent shrink-0" />
                      <h3 className="text-sm font-bold text-foreground">{list.name}</h3>
                      <Badge variant="outline" className="text-[10px]">{list.items.length} item{list.items.length !== 1 ? "s" : ""}</Badge>
                    </div>
                    {list.description && (
                      <p className="text-xs text-muted-foreground mt-1 ml-6">{list.description}</p>
                    )}
                  </div>
                  <div className="flex items-center gap-2 ml-3 shrink-0">
                    <span className="text-[10px] text-muted-foreground flex items-center gap-1"><Clock className="h-3 w-3" /> {list.updatedAt}</span>
                    <ChevronRight className={`h-4 w-4 text-muted-foreground transition-transform ${expandedId === list.id ? "rotate-90" : ""}`} />
                  </div>
                </button>

                {expandedId === list.id && (
                  <div className="border-t border-border px-5 pb-5">
                    {list.items.length === 0 ? (
                      <p className="text-xs text-muted-foreground italic py-4">No items in this list yet.</p>
                    ) : (
                      <div className="divide-y divide-border">
                        {list.items.map((item) => (
                          <div key={item.id} className="flex items-center justify-between py-3">
                            <div className="flex-1 min-w-0">
                              <p className="text-sm font-medium text-foreground truncate">{item.title}</p>
                              <div className="flex items-center gap-2 mt-0.5 text-[10px] text-muted-foreground">
                                <span>{item.authors}</span>
                                <span>·</span>
                                <span>{item.journal}</span>
                                <span>·</span>
                                <span>{item.year}</span>
                              </div>
                            </div>
                            <Button variant="ghost" size="sm" className="h-7 w-7 p-0 text-destructive hover:text-destructive shrink-0 ml-2"
                              onClick={() => handleRemoveItem(list.id, item.id)}>
                              <Trash2 className="h-3.5 w-3.5" />
                            </Button>
                          </div>
                        ))}
                      </div>
                    )}
                    <div className="flex gap-2 mt-3">
                      <Link to="/dashboard/library">
                        <Button variant="afrikaOutline" size="sm" className="text-xs gap-1">
                          <Plus className="h-3 w-3" /> Add from Library
                        </Button>
                      </Link>
                      <Button variant="ghost" size="sm" className="text-xs gap-1 text-destructive hover:text-destructive ml-auto"
                        onClick={() => handleDeleteList(list.id)}>
                        <Trash2 className="h-3 w-3" /> Delete List
                      </Button>
                    </div>
                  </div>
                )}
              </div>
            ))
          )}
        </div>
      </div>
    </DashboardLayout>
  );
};

export default ReadingListsPage;