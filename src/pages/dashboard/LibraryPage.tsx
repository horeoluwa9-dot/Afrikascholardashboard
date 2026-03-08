import { useState, useEffect } from "react";
import { Link, useSearchParams } from "react-router-dom";
import DashboardLayout from "@/components/dashboard/DashboardLayout";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Progress } from "@/components/ui/progress";
import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter,
} from "@/components/ui/dialog";
import {
  BookOpen, Download, Search, FileText, List, FolderOpen,
  Plus, Trash2, Pencil, ExternalLink, Share2, ChevronRight,
  BookMarked, Clock, ArrowLeft, Bookmark, X,
} from "lucide-react";
import { useLibrary, type ReadingListItem } from "@/hooks/useLibrary";
import { format } from "date-fns";

const tabs = [
  { key: "overview", label: "Overview", icon: BookOpen },
  { key: "purchased", label: "Purchased Papers", icon: FileText },
  { key: "saved", label: "Saved Articles", icon: Bookmark },
  { key: "downloads", label: "Download History", icon: Download },
  { key: "lists", label: "Reading Lists", icon: List },
];

const LibraryPage = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const activeTab = searchParams.get("tab") || "overview";
  const listId = searchParams.get("list");
  const setActiveTab = (tab: string) => setSearchParams({ tab });

  const [search, setSearch] = useState("");
  const {
    purchased, saved, downloads, readingLists, loading, hasActivity,
    removeSavedArticle, createReadingList, deleteReadingList, updateReadingList,
    getListItems, addToReadingList, removeFromReadingList,
  } = useLibrary();

  // Reading list detail state
  const [listItems, setListItems] = useState<ReadingListItem[]>([]);
  const [loadingList, setLoadingList] = useState(false);
  const [selectedList, setSelectedList] = useState<typeof readingLists[0] | null>(null);

  // Dialogs
  const [createListDialog, setCreateListDialog] = useState(false);
  const [editListDialog, setEditListDialog] = useState(false);
  const [listForm, setListForm] = useState({ name: "", description: "" });
  const [saving, setSaving] = useState(false);

  // Load list items when viewing a specific list
  useEffect(() => {
    if (listId) {
      setLoadingList(true);
      const list = readingLists.find(l => l.id === listId);
      setSelectedList(list || null);
      getListItems(listId).then(items => {
        setListItems(items);
        setLoadingList(false);
      });
    }
  }, [listId, readingLists]);

  const filterBySearch = (title: string) =>
    !search || title.toLowerCase().includes(search.toLowerCase());

  // === READING LIST DETAIL VIEW ===
  if (listId) {
    return (
      <DashboardLayout>
        <div className="max-w-5xl mx-auto space-y-6">
          <div className="flex items-center gap-1 text-xs text-muted-foreground">
            <Link to="/dashboard" className="hover:text-foreground transition-colors">Dashboard</Link>
            <ChevronRight className="h-3 w-3" />
            <button onClick={() => setSearchParams({ tab: "lists" })} className="hover:text-foreground transition-colors">Library</button>
            <ChevronRight className="h-3 w-3" />
            <span className="text-foreground font-medium">{selectedList?.name || "Reading List"}</span>
          </div>

          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-foreground font-serif">{selectedList?.name || "Reading List"}</h1>
              {selectedList?.description && (
                <p className="text-sm text-muted-foreground mt-1">{selectedList.description}</p>
              )}
              <p className="text-xs text-muted-foreground mt-1">{listItems.length} papers</p>
            </div>
            <Button variant="outline" size="sm" className="gap-1.5" onClick={() => setSearchParams({ tab: "lists" })}>
              <ArrowLeft className="h-3 w-3" /> Back to Lists
            </Button>
          </div>

          {loadingList ? (
            <div className="space-y-3">
              {[1, 2, 3].map(i => <div key={i} className="h-20 bg-card rounded-xl border border-border animate-pulse" />)}
            </div>
          ) : listItems.length > 0 ? (
            <div className="space-y-3">
              {listItems.map(item => (
                <div key={item.id} className="bg-card rounded-xl border border-border p-5 flex items-start justify-between gap-4">
                  <div className="flex-1 min-w-0">
                    <h3 className="text-sm font-semibold text-foreground">{item.title}</h3>
                    <div className="flex items-center gap-2 mt-1 text-xs text-muted-foreground flex-wrap">
                      {item.authors && <span>{item.authors}</span>}
                      {item.journal && <><span>·</span><span>{item.journal}</span></>}
                      {item.year && <><span>·</span><span>{item.year}</span></>}
                    </div>
                  </div>
                  <div className="flex gap-1 shrink-0">
                    <Button variant="ghost" size="icon" className="h-8 w-8"><ExternalLink className="h-3.5 w-3.5" /></Button>
                    <Button variant="ghost" size="icon" className="h-8 w-8"><Download className="h-3.5 w-3.5" /></Button>
                    <Button variant="ghost" size="icon" className="h-8 w-8 hover:text-destructive"
                      onClick={() => removeFromReadingList(item.id)}>
                      <Trash2 className="h-3.5 w-3.5" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="bg-card rounded-xl border border-border p-12 text-center">
              <BookOpen className="h-10 w-10 mx-auto text-muted-foreground/40 mb-3" />
              <p className="text-muted-foreground">This reading list is empty.</p>
              <p className="text-xs text-muted-foreground mt-1">Add papers from your library or research results.</p>
            </div>
          )}
        </div>
      </DashboardLayout>
    );
  }

  // === MAIN LIBRARY VIEW ===
  return (
    <DashboardLayout>
      <div className="max-w-5xl mx-auto space-y-6">
        {/* Breadcrumb */}
        <div className="flex items-center gap-1 text-xs text-muted-foreground">
          <Link to="/dashboard" className="hover:text-foreground transition-colors">Dashboard</Link>
          <ChevronRight className="h-3 w-3" />
          <span className="text-foreground font-medium">Library</span>
        </div>

        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
          <div>
            <h1 className="text-2xl font-bold text-foreground font-serif">My Library</h1>
            <p className="text-sm text-muted-foreground mt-1">Your personal academic research library.</p>
          </div>
          <div className="relative max-w-xs w-full">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input placeholder="Search your library…" value={search} onChange={(e) => setSearch(e.target.value)} className="pl-9" />
          </div>
        </div>

        {/* Tabs */}
        <div className="flex gap-2 flex-wrap">
          {tabs.map(tab => (
            <button key={tab.key} onClick={() => setActiveTab(tab.key)}
              className={`flex items-center gap-1.5 px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                activeTab === tab.key
                  ? "bg-accent text-accent-foreground"
                  : "bg-card text-foreground border border-border hover:bg-secondary"
              }`}>
              <tab.icon className="h-3.5 w-3.5" />
              {tab.label}
            </button>
          ))}
        </div>

        {loading ? (
          <div className="space-y-4">
            {[1, 2, 3].map(i => <div key={i} className="h-24 bg-card rounded-xl border border-border animate-pulse" />)}
          </div>
        ) : !hasActivity && activeTab === "overview" ? (
          /* Empty state */
          <div className="bg-card rounded-xl border border-border p-16 text-center">
            <BookOpen className="h-14 w-14 mx-auto text-muted-foreground/30 mb-4" />
            <h2 className="text-lg font-bold text-foreground mb-2">Your research library is empty</h2>
            <p className="text-sm text-muted-foreground max-w-md mx-auto mb-6">
              Start building your library by saving articles, purchasing papers, or creating reading lists.
            </p>
            <div className="flex gap-3 justify-center flex-wrap">
              <Link to="/dashboard/intelligence">
                <Button variant="afrika" size="sm" className="gap-1.5">
                  <Search className="h-3.5 w-3.5" /> Explore Research Intelligence
                </Button>
              </Link>
              <Link to="/dashboard/intelligence?tab=journals">
                <Button variant="afrikaOutline" size="sm" className="gap-1.5">
                  <BookOpen className="h-3.5 w-3.5" /> Browse Journals
                </Button>
              </Link>
              <Button variant="outline" size="sm" className="gap-1.5" onClick={() => {
                setListForm({ name: "", description: "" });
                setCreateListDialog(true);
              }}>
                <Plus className="h-3.5 w-3.5" /> Create Reading List
              </Button>
            </div>
          </div>
        ) : (
          <>
            {/* OVERVIEW TAB */}
            {activeTab === "overview" && (
              <div className="space-y-6">
                {/* Summary cards */}
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                  {[
                    { label: "Purchased Papers", count: purchased.length, icon: FileText, color: "text-accent" },
                    { label: "Saved Articles", count: saved.length, icon: Bookmark, color: "text-primary" },
                    { label: "Downloads", count: downloads.length, icon: Download, color: "text-afrika-green" },
                    { label: "Reading Lists", count: readingLists.length, icon: List, color: "text-accent" },
                  ].map(card => (
                    <div key={card.label} className="bg-card rounded-xl border border-border p-5">
                      <div className="flex items-center justify-between mb-2">
                        <card.icon className={`h-5 w-5 ${card.color}`} />
                      </div>
                      <p className="text-2xl font-bold text-foreground">{card.count}</p>
                      <p className="text-xs text-muted-foreground mt-0.5">{card.label}</p>
                    </div>
                  ))}
                </div>

                {/* Recently Accessed */}
                <div>
                  <h2 className="text-base font-bold text-foreground mb-3">Recently Accessed</h2>
                  {[...purchased.slice(0, 2), ...saved.slice(0, 2)].length > 0 ? (
                    <div className="space-y-3">
                      {[...purchased.slice(0, 2).map(p => ({ title: p.title, journal: p.journal, type: "purchased" as const })),
                        ...saved.slice(0, 2).map(s => ({ title: s.title, journal: s.journal, type: "saved" as const })),
                      ].map((item, i) => (
                        <div key={i} className="bg-card rounded-xl border border-border p-4 flex items-center justify-between gap-4">
                          <div className="flex-1 min-w-0">
                            <h3 className="text-sm font-semibold text-foreground truncate">{item.title}</h3>
                            {item.journal && <p className="text-xs text-muted-foreground mt-0.5">{item.journal}</p>}
                          </div>
                          <div className="flex gap-1 shrink-0">
                            <Button variant="ghost" size="sm" className="text-xs gap-1"><ExternalLink className="h-3 w-3" /> Read</Button>
                            <Button variant="ghost" size="sm" className="text-xs gap-1"><Download className="h-3 w-3" /> PDF</Button>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-sm text-muted-foreground italic">No recent activity.</p>
                  )}
                </div>
              </div>
            )}

            {/* PURCHASED PAPERS TAB */}
            {activeTab === "purchased" && (
              <div className="space-y-3">
                {purchased.filter(p => filterBySearch(p.title)).length > 0 ? (
                  purchased.filter(p => filterBySearch(p.title)).map(paper => (
                    <div key={paper.id} className="bg-card rounded-xl border border-border p-5 flex items-start justify-between gap-4">
                      <div className="flex-1 min-w-0">
                        <h3 className="text-sm font-semibold text-foreground">{paper.title}</h3>
                        <div className="flex items-center gap-2 mt-1 text-xs text-muted-foreground flex-wrap">
                          {paper.authors && <span>{paper.authors}</span>}
                          {paper.journal && <><span>·</span><span>{paper.journal}</span></>}
                          {paper.year && <><span>·</span><span>{paper.year}</span></>}
                        </div>
                        <Badge variant="outline" className="mt-2 text-[10px] bg-afrika-green/10 text-afrika-green border-afrika-green/30 capitalize">
                          {paper.access_status}
                        </Badge>
                      </div>
                      <div className="flex gap-1 shrink-0">
                        <Button variant="ghost" size="sm" className="text-xs gap-1"><ExternalLink className="h-3 w-3" /> Read</Button>
                        <Button variant="ghost" size="sm" className="text-xs gap-1"><Download className="h-3 w-3" /> PDF</Button>
                        <Button variant="ghost" size="sm" className="text-xs gap-1"><BookMarked className="h-3 w-3" /> Save</Button>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="bg-card rounded-xl border border-border p-12 text-center">
                    <FileText className="h-10 w-10 mx-auto text-muted-foreground/40 mb-3" />
                    <p className="text-muted-foreground">No purchased papers yet.</p>
                    <p className="text-xs text-muted-foreground mt-1">Papers you purchase will appear here.</p>
                  </div>
                )}
              </div>
            )}

            {/* SAVED ARTICLES TAB */}
            {activeTab === "saved" && (
              <div className="space-y-3">
                {saved.filter(s => filterBySearch(s.title)).length > 0 ? (
                  saved.filter(s => filterBySearch(s.title)).map(article => (
                    <div key={article.id} className="bg-card rounded-xl border border-border p-5 flex items-start justify-between gap-4">
                      <div className="flex-1 min-w-0">
                        <h3 className="text-sm font-semibold text-foreground">{article.title}</h3>
                        <div className="flex items-center gap-2 mt-1 text-xs text-muted-foreground flex-wrap">
                          {article.authors && <span>{article.authors}</span>}
                          {article.journal && <><span>·</span><span>{article.journal}</span></>}
                          {article.year && <><span>·</span><span>{article.year}</span></>}
                        </div>
                      </div>
                      <div className="flex gap-1 shrink-0">
                        <Button variant="ghost" size="sm" className="text-xs gap-1"><ExternalLink className="h-3 w-3" /> Read</Button>
                        <Button variant="ghost" size="sm" className="text-xs gap-1 hover:text-destructive"
                          onClick={() => removeSavedArticle(article.id)}>
                          <Trash2 className="h-3 w-3" /> Remove
                        </Button>
                        <Button variant="ghost" size="sm" className="text-xs gap-1"><BookMarked className="h-3 w-3" /> Add to List</Button>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="bg-card rounded-xl border border-border p-12 text-center">
                    <Bookmark className="h-10 w-10 mx-auto text-muted-foreground/40 mb-3" />
                    <p className="text-muted-foreground">You have not saved any articles yet.</p>
                    <Link to="/dashboard/intelligence">
                      <Button variant="afrika" size="sm" className="mt-3 gap-1.5"><Search className="h-3.5 w-3.5" /> Explore Research</Button>
                    </Link>
                  </div>
                )}
              </div>
            )}

            {/* DOWNLOAD HISTORY TAB */}
            {activeTab === "downloads" && (
              <div>
                {downloads.filter(d => filterBySearch(d.title)).length > 0 ? (
                  <div className="bg-card rounded-xl border border-border overflow-hidden">
                    <div className="grid grid-cols-[1fr_auto_auto_auto] gap-4 p-4 bg-secondary/50 border-b border-border text-xs font-semibold text-muted-foreground">
                      <span>Paper Title</span>
                      <span>Journal</span>
                      <span>Date</span>
                      <span>Type</span>
                    </div>
                    {downloads.filter(d => filterBySearch(d.title)).map(dl => (
                      <div key={dl.id} className="grid grid-cols-[1fr_auto_auto_auto] gap-4 p-4 border-b border-border last:border-0 items-center">
                        <div>
                          <p className="text-sm font-medium text-foreground truncate">{dl.title}</p>
                        </div>
                        <span className="text-xs text-muted-foreground">{dl.journal || "—"}</span>
                        <span className="text-xs text-muted-foreground">{format(new Date(dl.downloaded_at), "dd MMM yyyy")}</span>
                        <Badge variant="outline" className="text-[10px]">{dl.file_type}</Badge>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="bg-card rounded-xl border border-border p-12 text-center">
                    <Download className="h-10 w-10 mx-auto text-muted-foreground/40 mb-3" />
                    <p className="text-muted-foreground">No downloads yet.</p>
                    <Link to="/dashboard/intelligence">
                      <Button variant="afrika" size="sm" className="mt-3 gap-1.5"><BookOpen className="h-3.5 w-3.5" /> Browse Research Library</Button>
                    </Link>
                  </div>
                )}
              </div>
            )}

            {/* READING LISTS TAB */}
            {activeTab === "lists" && (
              <div className="space-y-4">
                <div className="flex justify-end">
                  <Button variant="afrika" size="sm" className="gap-1.5" onClick={() => {
                    setListForm({ name: "", description: "" });
                    setCreateListDialog(true);
                  }}>
                    <Plus className="h-3.5 w-3.5" /> Create Reading List
                  </Button>
                </div>

                {readingLists.length > 0 ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {readingLists.map(list => (
                      <div key={list.id} className="bg-card rounded-xl border border-border p-5 flex flex-col">
                        <div className="flex items-start justify-between mb-2">
                          <div>
                            <h3 className="text-sm font-bold text-foreground">{list.name}</h3>
                            {list.description && (
                              <p className="text-xs text-muted-foreground mt-0.5">{list.description}</p>
                            )}
                          </div>
                          <FolderOpen className="h-5 w-5 text-accent shrink-0" />
                        </div>
                        <div className="flex items-center gap-3 text-xs text-muted-foreground mt-auto pt-3">
                          <span>{list.item_count || 0} papers</span>
                          <span>·</span>
                          <span>Updated {format(new Date(list.updated_at), "dd MMM yyyy")}</span>
                        </div>
                        <div className="flex gap-2 mt-3">
                          <Button variant="outline" size="sm" className="text-xs flex-1"
                            onClick={() => setSearchParams({ tab: "lists", list: list.id })}>
                            View List
                          </Button>
                          <Button variant="ghost" size="sm" className="text-xs gap-1" onClick={() => {
                            setListForm({ name: list.name, description: list.description || "" });
                            setSelectedList(list);
                            setEditListDialog(true);
                          }}>
                            <Pencil className="h-3 w-3" />
                          </Button>
                          <Button variant="ghost" size="sm" className="text-xs gap-1 hover:text-destructive"
                            onClick={() => deleteReadingList(list.id)}>
                            <Trash2 className="h-3 w-3" />
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="bg-card rounded-xl border border-border p-12 text-center">
                    <List className="h-10 w-10 mx-auto text-muted-foreground/40 mb-3" />
                    <p className="text-muted-foreground">No reading lists yet.</p>
                    <p className="text-xs text-muted-foreground mt-1">Create your first reading list to organize your research.</p>
                  </div>
                )}
              </div>
            )}
          </>
        )}
      </div>

      {/* Create Reading List Dialog */}
      <Dialog open={createListDialog} onOpenChange={setCreateListDialog}>
        <DialogContent className="max-w-sm">
          <DialogHeader><DialogTitle>Create Reading List</DialogTitle></DialogHeader>
          <div className="space-y-3">
            <div><Label>List Name</Label><Input className="mt-1" placeholder="e.g. Public Health Research" value={listForm.name} onChange={e => setListForm(f => ({ ...f, name: e.target.value }))} /></div>
            <div><Label>Description (optional)</Label><Input className="mt-1" value={listForm.description} onChange={e => setListForm(f => ({ ...f, description: e.target.value }))} /></div>
          </div>
          <DialogFooter>
            <Button variant="outline" size="sm" onClick={() => setCreateListDialog(false)}>Cancel</Button>
            <Button variant="afrika" size="sm" disabled={!listForm.name.trim() || saving} onClick={async () => {
              setSaving(true);
              await createReadingList(listForm.name.trim(), listForm.description.trim());
              setSaving(false);
              setCreateListDialog(false);
            }}>{saving ? "Creating..." : "Create"}</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Edit Reading List Dialog */}
      <Dialog open={editListDialog} onOpenChange={setEditListDialog}>
        <DialogContent className="max-w-sm">
          <DialogHeader><DialogTitle>Edit Reading List</DialogTitle></DialogHeader>
          <div className="space-y-3">
            <div><Label>List Name</Label><Input className="mt-1" value={listForm.name} onChange={e => setListForm(f => ({ ...f, name: e.target.value }))} /></div>
            <div><Label>Description</Label><Input className="mt-1" value={listForm.description} onChange={e => setListForm(f => ({ ...f, description: e.target.value }))} /></div>
          </div>
          <DialogFooter>
            <Button variant="outline" size="sm" onClick={() => setEditListDialog(false)}>Cancel</Button>
            <Button variant="afrika" size="sm" disabled={!listForm.name.trim() || saving} onClick={async () => {
              if (!selectedList) return;
              setSaving(true);
              await updateReadingList(selectedList.id, listForm.name.trim(), listForm.description.trim());
              setSaving(false);
              setEditListDialog(false);
            }}>{saving ? "Saving..." : "Save"}</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </DashboardLayout>
  );
};

export default LibraryPage;
