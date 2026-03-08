import DashboardLayout from "@/components/dashboard/DashboardLayout";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { BookOpen, Download, Share2, ExternalLink, Search } from "lucide-react";
import { useState } from "react";
import { Input } from "@/components/ui/input";

const tabs = ["Saved Papers", "Purchased Articles", "Downloads", "Citation Exports"];

const savedPapers = [
  { id: 1, title: "Machine Learning in African Agriculture: A Systematic Review", source: "African Journal of Computing", date: "2026-02-15" },
  { id: 2, title: "Digital Financial Inclusion Across East Africa", source: "Journal of African Economics", date: "2026-01-20" },
  { id: 3, title: "Climate Resilience Strategies for Sub-Saharan Africa", source: "Environmental Research Letters", date: "2025-12-10" },
];

const LibraryPage = () => {
  const [activeTab, setActiveTab] = useState("Saved Papers");
  const [search, setSearch] = useState("");

  return (
    <DashboardLayout>
      <div className="max-w-5xl mx-auto space-y-6">
        <div>
          <h1 className="text-2xl font-bold text-foreground">My Library</h1>
          <p className="text-sm text-muted-foreground mt-1">Access your saved papers, purchases, downloads, and citation exports.</p>
        </div>

        <div className="relative max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input placeholder="Search library..." value={search} onChange={(e) => setSearch(e.target.value)} className="pl-9" />
        </div>

        <div className="flex gap-2 flex-wrap">
          {tabs.map((tab) => (
            <button key={tab} onClick={() => setActiveTab(tab)}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${activeTab === tab ? "bg-accent text-accent-foreground" : "bg-card text-foreground border border-border hover:bg-secondary"}`}>
              {tab}
            </button>
          ))}
        </div>

        {activeTab === "Saved Papers" && (
          <div className="space-y-3">
            {savedPapers.length === 0 ? (
              <div className="bg-card rounded-xl border border-border p-12 text-center">
                <BookOpen className="h-10 w-10 text-muted-foreground mx-auto mb-3" />
                <p className="text-muted-foreground">No saved papers yet.</p>
                <Link to="/dashboard/intelligence?tab=journals"><Button variant="afrika" size="sm" className="mt-3">Explore Journals</Button></Link>
              </div>
            ) : (
              savedPapers.filter(p => p.title.toLowerCase().includes(search.toLowerCase())).map((paper) => (
                <div key={paper.id} className="bg-card rounded-xl border border-border p-5 flex items-center justify-between">
                  <div>
                    <h3 className="text-sm font-semibold text-foreground">{paper.title}</h3>
                    <p className="text-xs text-muted-foreground mt-1">{paper.source} · {paper.date}</p>
                  </div>
                  <div className="flex gap-2">
                    <Button variant="ghost" size="icon"><ExternalLink className="h-4 w-4" /></Button>
                    <Button variant="ghost" size="icon"><Download className="h-4 w-4" /></Button>
                    <Button variant="ghost" size="icon"><Share2 className="h-4 w-4" /></Button>
                  </div>
                </div>
              ))
            )}
          </div>
        )}

        {activeTab === "Purchased Articles" && (
          <div className="bg-card rounded-xl border border-border p-12 text-center">
            <p className="text-muted-foreground">No purchased articles yet.</p>
            <p className="text-xs text-muted-foreground mt-1">Articles you purchase will appear here.</p>
          </div>
        )}

        {activeTab === "Downloads" && (
          <div className="bg-card rounded-xl border border-border p-12 text-center">
            <p className="text-muted-foreground">No downloads yet.</p>
            <p className="text-xs text-muted-foreground mt-1">Exported papers and datasets will appear here.</p>
          </div>
        )}

        {activeTab === "Citation Exports" && (
          <div className="bg-card rounded-xl border border-border p-12 text-center">
            <p className="text-muted-foreground">No citation exports yet.</p>
            <p className="text-xs text-muted-foreground mt-1">Generate citations from your papers to export them.</p>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
};

export default LibraryPage;
