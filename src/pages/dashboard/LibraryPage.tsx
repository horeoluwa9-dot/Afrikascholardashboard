import { useState, useEffect } from "react";
import { Link, useSearchParams } from "react-router-dom";
import DashboardLayout from "@/components/dashboard/DashboardLayout";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter,
} from "@/components/ui/dialog";
import {
  BookOpen, Download, Search, FileText, List, FolderOpen,
  Plus, Trash2, Pencil, ExternalLink, ChevronRight,
  BookMarked, ArrowLeft, Bookmark, Eye, X, CreditCard,
  CheckCircle2, RefreshCw, Globe, TrendingUp, Newspaper,
} from "lucide-react";
import { useLibrary, type ReadingListItem, type PurchasedPaper, type SavedArticle } from "@/hooks/useLibrary";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { format } from "date-fns";

const tabs = [
  { key: "overview", label: "Overview", icon: BookOpen },
  { key: "purchased", label: "Purchased Papers", icon: FileText },
  { key: "saved", label: "Saved Articles", icon: Bookmark },
  { key: "downloads", label: "Download History", icon: Download },
  { key: "lists", label: "Reading Lists", icon: List },
  { key: "subscriptions", label: "Journal Subscriptions", icon: Newspaper },
];

const fmtNaira = (n: number) =>
  new Intl.NumberFormat("en-NG", { style: "currency", currency: "NGN", maximumFractionDigits: 0 }).format(n);

// ─── Demo journal catalogue ───────────────────────────────────────────────────
const BROWSE_JOURNALS = [
  { id: "j1", name: "African Journal of Public Health", field: "Public Health", impact: "IF 2.4", price: 8000, publisher: "African Health Sciences", description: "Peer-reviewed research on public health across Africa." },
  { id: "j2", name: "Journal of African Business Studies", field: "Business & Economics", impact: "IF 1.9", price: 12000, publisher: "Pan-African Business Press", description: "Advancing business knowledge for African markets." },
  { id: "j3", name: "African Environmental Research", field: "Environmental Science", impact: "IF 3.1", price: 10000, publisher: "Afrika Scholar Publishing", description: "Climate, ecology and environmental policy research." },
  { id: "j4", name: "African Journal of Technology & Innovation", field: "Technology", impact: "IF 2.7", price: 15000, publisher: "West African Tech Consortium", description: "Research in emerging technologies and innovation." },
  { id: "j5", name: "Journal of African Agricultural Sciences", field: "Agriculture", impact: "IF 2.2", price: 7000, publisher: "CGIAR Africa", description: "Food security and sustainable agriculture across the continent." },
  { id: "j6", name: "African Journal of Legal Studies", field: "Law", impact: "IF 1.6", price: 9000, publisher: "African Law Society", description: "Comparative law, governance and human rights in Africa." },
];

// ─── Demo active subscriptions (seeded when user has subscribed) ──────────────
const DEMO_SUBS = [
  { id: "sub-1", journal_name: "African Journal of Public Policy", publisher: "African Development Policy Center", plan_type: "annual", price_amount: 10000, expires_at: "2026-07-15T00:00:00Z", status: "active", journal_id: "j1" },
];

// ---- Shared paper type for actions ----
interface PaperInfo {
  title: string;
  authors?: string | null;
  journal?: string | null;
  year?: number | null;
  source_url?: string | null;
  pdf_url?: string | null;
}

const LibraryPage = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const activeTab = searchParams.get("tab") || "overview";
  const listId = searchParams.get("list");
  const setActiveTab = (tab: string) => setSearchParams({ tab });

  const { user } = useAuth();
  const { toast } = useToast();
  const [search, setSearch] = useState("");
  const {
    purchased, saved, downloads, readingLists, loading, hasActivity,
    saveArticle, removeSavedArticle, createReadingList, deleteReadingList, updateReadingList,
    getListItems, addToReadingList, removeFromReadingList, refetch,
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

  // Read modal
  const [readPaper, setReadPaper] = useState<PaperInfo | null>(null);

  // Add to list picker
  const [addToListPaper, setAddToListPaper] = useState<PaperInfo | null>(null);

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

  // ---- Action handlers ----
  const handleRead = (paper: PaperInfo) => {
    setReadPaper(paper);
  };

  const handleDownloadPdf = async (paper: PaperInfo) => {
    if (!user) return;
    // Record in download_history
    await supabase.from("download_history").insert({
      user_id: user.id,
      title: paper.title,
      journal: paper.journal || null,
      file_type: "PDF",
    } as any);
    // If there's a real PDF URL, open it
    if (paper.pdf_url) {
      window.open(paper.pdf_url, "_blank");
    } else {
      // Generate a placeholder text file download
      const content = `${paper.title}\n\n${paper.authors ? "Authors: " + paper.authors : ""}\n${paper.journal ? "Journal: " + paper.journal : ""}\n${paper.year ? "Year: " + paper.year : ""}\n\n[Full PDF content would appear here in production.]`;
      const blob = new Blob([content], { type: "application/pdf" });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `${paper.title.replace(/[^a-zA-Z0-9 ]/g, "").slice(0, 50)}.pdf`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    }
    toast({ title: "Download started", description: `${paper.title}` });
    refetch();
  };

  const handleSaveArticle = async (paper: PaperInfo) => {
    // Check if already saved
    const alreadySaved = saved.some(s => s.title === paper.title);
    if (alreadySaved) {
      toast({ title: "Already saved", description: "This article is already in your saved collection." });
      return;
    }
    await saveArticle({
      title: paper.title,
      authors: paper.authors || null,
      journal: paper.journal || null,
      year: paper.year || null,
      source_url: paper.source_url || paper.pdf_url || null,
    });
  };

  const handleAddToList = (paper: PaperInfo) => {
    if (readingLists.length === 0) {
      toast({ title: "No reading lists", description: "Create a reading list first." });
      setListForm({ name: "", description: "" });
      setCreateListDialog(true);
      return;
    }
    setAddToListPaper(paper);
  };

  const handlePickList = async (listId: string) => {
    if (!addToListPaper) return;
    await addToReadingList(listId, {
      title: addToListPaper.title,
      authors: addToListPaper.authors || undefined,
      journal: addToListPaper.journal || undefined,
      year: addToListPaper.year || undefined,
    });
    setAddToListPaper(null);
  };

  // ---- Reusable action buttons ----
  const ActionButtons = ({ paper, showSave = true, showAddToList = true, extra }: {
    paper: PaperInfo;
    showSave?: boolean;
    showAddToList?: boolean;
    extra?: React.ReactNode;
  }) => (
    <div className="flex gap-1 shrink-0 flex-wrap">
      <Button variant="ghost" size="sm" className="text-xs gap-1" onClick={() => handleRead(paper)}>
        <Eye className="h-3 w-3" /> Read
      </Button>
      <Button variant="ghost" size="sm" className="text-xs gap-1" onClick={() => handleDownloadPdf(paper)}>
        <Download className="h-3 w-3" /> PDF
      </Button>
      {showSave && (
        <Button variant="ghost" size="sm" className="text-xs gap-1" onClick={() => handleSaveArticle(paper)}>
          <BookMarked className="h-3 w-3" /> Save
        </Button>
      )}
      {showAddToList && (
        <Button variant="ghost" size="sm" className="text-xs gap-1" onClick={() => handleAddToList(paper)}>
          <List className="h-3 w-3" /> Add to List
        </Button>
      )}
      {extra}
    </div>
  );

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
                  <ActionButtons
                    paper={{ title: item.title, authors: item.authors, journal: item.journal, year: item.year }}
                    showSave={true}
                    showAddToList={false}
                    extra={
                      <Button variant="ghost" size="sm" className="text-xs gap-1 hover:text-destructive"
                        onClick={() => removeFromReadingList(item.id)}>
                        <Trash2 className="h-3 w-3" /> Remove
                      </Button>
                    }
                  />
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

        {/* Shared dialogs rendered inside list detail too */}
        <ReadModal paper={readPaper} onClose={() => setReadPaper(null)} onDownload={handleDownloadPdf} onSave={handleSaveArticle} onAddToList={handleAddToList} />
        <AddToListDialog paper={addToListPaper} lists={readingLists} onPick={handlePickList} onClose={() => setAddToListPaper(null)} />
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

                <div>
                  <h2 className="text-base font-bold text-foreground mb-3">Recently Accessed</h2>
                  {[...purchased.slice(0, 2), ...saved.slice(0, 2)].length > 0 ? (
                    <div className="space-y-3">
                      {[...purchased.slice(0, 2).map(p => ({ title: p.title, authors: p.authors, journal: p.journal, year: p.year, pdf_url: p.pdf_url, source_url: null as string | null })),
                        ...saved.slice(0, 2).map(s => ({ title: s.title, authors: s.authors, journal: s.journal, year: s.year, pdf_url: null as string | null, source_url: s.source_url })),
                      ].map((item, i) => (
                        <div key={i} className="bg-card rounded-xl border border-border p-4 flex items-center justify-between gap-4">
                          <div className="flex-1 min-w-0">
                            <h3 className="text-sm font-semibold text-foreground truncate">{item.title}</h3>
                            {item.journal && <p className="text-xs text-muted-foreground mt-0.5">{item.journal}</p>}
                          </div>
                          <ActionButtons paper={item} />
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
                      <ActionButtons paper={{ title: paper.title, authors: paper.authors, journal: paper.journal, year: paper.year, pdf_url: paper.pdf_url }} />
                    </div>
                  ))
                ) : (
                  <div className="bg-card rounded-xl border border-border p-12 text-center">
                    <FileText className="h-10 w-10 mx-auto text-muted-foreground/40 mb-3" />
                    <p className="text-muted-foreground">No purchased papers yet.</p>
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
                      <ActionButtons
                        paper={{ title: article.title, authors: article.authors, journal: article.journal, year: article.year, source_url: article.source_url }}
                        showSave={false}
                        extra={
                          <Button variant="ghost" size="sm" className="text-xs gap-1 hover:text-destructive"
                            onClick={() => removeSavedArticle(article.id)}>
                            <Trash2 className="h-3 w-3" /> Remove
                          </Button>
                        }
                      />
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
                    <div className="grid grid-cols-[1fr_auto_auto_auto_auto] gap-4 p-4 bg-secondary/50 border-b border-border text-xs font-semibold text-muted-foreground">
                      <span>Paper Title</span>
                      <span>Journal</span>
                      <span>Date</span>
                      <span>Type</span>
                      <span>Actions</span>
                    </div>
                    {downloads.filter(d => filterBySearch(d.title)).map(dl => (
                      <div key={dl.id} className="grid grid-cols-[1fr_auto_auto_auto_auto] gap-4 p-4 border-b border-border last:border-0 items-center">
                        <div>
                          <p className="text-sm font-medium text-foreground truncate">{dl.title}</p>
                        </div>
                        <span className="text-xs text-muted-foreground">{dl.journal || "—"}</span>
                        <span className="text-xs text-muted-foreground">{format(new Date(dl.downloaded_at), "dd MMM yyyy")}</span>
                        <Badge variant="outline" className="text-[10px]">{dl.file_type}</Badge>
                        <div className="flex gap-1">
                          <Button variant="ghost" size="sm" className="text-xs gap-1 h-7"
                            onClick={() => handleRead({ title: dl.title, journal: dl.journal })}>
                            <Eye className="h-3 w-3" />
                          </Button>
                          <Button variant="ghost" size="sm" className="text-xs gap-1 h-7"
                            onClick={() => handleDownloadPdf({ title: dl.title, journal: dl.journal })}>
                            <Download className="h-3 w-3" />
                          </Button>
                          <Button variant="ghost" size="sm" className="text-xs gap-1 h-7"
                            onClick={() => handleSaveArticle({ title: dl.title, journal: dl.journal })}>
                            <BookMarked className="h-3 w-3" />
                          </Button>
                        </div>
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

      {/* Read Paper Modal */}
      <ReadModal paper={readPaper} onClose={() => setReadPaper(null)} onDownload={handleDownloadPdf} onSave={handleSaveArticle} onAddToList={handleAddToList} />

      {/* Add to List Picker Dialog */}
      <AddToListDialog paper={addToListPaper} lists={readingLists} onPick={handlePickList} onClose={() => setAddToListPaper(null)} />
    </DashboardLayout>
  );
};

// ---- Read Modal Component ----
function ReadModal({ paper, onClose, onDownload, onSave, onAddToList }: {
  paper: PaperInfo | null;
  onClose: () => void;
  onDownload: (p: PaperInfo) => void;
  onSave: (p: PaperInfo) => void;
  onAddToList: (p: PaperInfo) => void;
}) {
  if (!paper) return null;
  return (
    <Dialog open={!!paper} onOpenChange={() => onClose()}>
      <DialogContent className="max-w-2xl max-h-[85vh] flex flex-col">
        <DialogHeader>
          <DialogTitle className="text-lg font-serif leading-tight pr-6">{paper.title}</DialogTitle>
        </DialogHeader>
        <ScrollArea className="flex-1 -mx-6 px-6">
          <div className="space-y-4 pb-4">
            {/* Meta info */}
            <div className="flex items-center gap-3 text-sm text-muted-foreground flex-wrap">
              {paper.authors && <span className="font-medium text-foreground">{paper.authors}</span>}
              {paper.journal && (
                <Badge variant="outline" className="text-[10px]">{paper.journal}</Badge>
              )}
              {paper.year && <span>{paper.year}</span>}
            </div>

            {/* Abstract / content placeholder */}
            <div className="bg-secondary/30 rounded-lg p-6 border border-border">
              <h3 className="text-sm font-semibold text-foreground mb-3">Abstract</h3>
              <p className="text-sm text-muted-foreground leading-relaxed">
                This paper presents a comprehensive analysis of {paper.title?.toLowerCase()}. 
                The study examines key findings from multiple research perspectives across the African continent, 
                providing insights that contribute to the broader understanding of this field. 
                The methodology employs both quantitative and qualitative approaches to ensure robust conclusions.
              </p>
              <p className="text-sm text-muted-foreground leading-relaxed mt-3">
                Key findings suggest significant implications for policy makers, researchers, and practitioners 
                working in related domains. The paper recommends further investigation into emerging trends and 
                cross-disciplinary collaboration to advance knowledge in this area.
              </p>
            </div>

            {/* Keywords */}
            <div>
              <h3 className="text-xs font-semibold text-muted-foreground mb-2">Keywords</h3>
              <div className="flex gap-1.5 flex-wrap">
                {["African Research", "Policy", "Analysis", "Innovation"].map(kw => (
                  <Badge key={kw} variant="secondary" className="text-[10px]">{kw}</Badge>
                ))}
              </div>
            </div>
          </div>
        </ScrollArea>

        <div className="flex gap-2 pt-3 border-t border-border flex-wrap">
          <Button variant="afrika" size="sm" className="gap-1.5" onClick={() => onDownload(paper)}>
            <Download className="h-3.5 w-3.5" /> Download PDF
          </Button>
          <Button variant="outline" size="sm" className="gap-1.5" onClick={() => onSave(paper)}>
            <BookMarked className="h-3.5 w-3.5" /> Save Article
          </Button>
          <Button variant="outline" size="sm" className="gap-1.5" onClick={() => onAddToList(paper)}>
            <List className="h-3.5 w-3.5" /> Add to List
          </Button>
          {(paper.source_url || paper.pdf_url) && (
            <Button variant="ghost" size="sm" className="gap-1.5 ml-auto"
              onClick={() => window.open(paper.source_url || paper.pdf_url!, "_blank")}>
              <ExternalLink className="h-3.5 w-3.5" /> Open Source
            </Button>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}

// ---- Add to List Picker Dialog ----
function AddToListDialog({ paper, lists, onPick, onClose }: {
  paper: PaperInfo | null;
  lists: { id: string; name: string; description: string | null; item_count?: number }[];
  onPick: (listId: string) => void;
  onClose: () => void;
}) {
  if (!paper) return null;
  return (
    <Dialog open={!!paper} onOpenChange={() => onClose()}>
      <DialogContent className="max-w-sm">
        <DialogHeader>
          <DialogTitle>Add to Reading List</DialogTitle>
        </DialogHeader>
        <p className="text-xs text-muted-foreground mb-3 truncate">{paper.title}</p>
        <div className="space-y-2">
          {lists.map(list => (
            <button
              key={list.id}
              onClick={() => onPick(list.id)}
              className="w-full text-left bg-secondary/50 hover:bg-secondary rounded-lg p-3 border border-border transition-colors"
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-foreground">{list.name}</p>
                  <p className="text-[10px] text-muted-foreground">{list.item_count || 0} papers</p>
                </div>
                <FolderOpen className="h-4 w-4 text-accent" />
              </div>
            </button>
          ))}
        </div>
        <DialogFooter>
          <Button variant="outline" size="sm" onClick={onClose}>Cancel</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

// Needed for AddToListDialog's FolderOpen icon
interface PaperInfo {
  title: string;
  authors?: string | null;
  journal?: string | null;
  year?: number | null;
  source_url?: string | null;
  pdf_url?: string | null;
}

export default LibraryPage;
