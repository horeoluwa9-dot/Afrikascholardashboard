import DashboardLayout from "@/components/dashboard/DashboardLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { FileText, TrendingUp, BookOpen, Award, Search, ExternalLink } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

const STATS = [
  { label: "Total Publications", value: 142, icon: FileText, bg: "bg-accent/10", color: "text-accent" },
  { label: "This Year", value: 28, icon: TrendingUp, bg: "bg-afrika-green/10", color: "text-afrika-green" },
  { label: "Journals Published In", value: 17, icon: BookOpen, bg: "bg-primary/10", color: "text-primary" },
  { label: "Citation Index", value: "4.2", icon: Award, bg: "bg-afrika-orange-light", color: "text-afrika-orange" },
];

const RECENT = [
  { title: "Renewable Energy Transitions in West Africa", authors: "Dr. Ama Mensah, Prof. Asante", journal: "African Energy Review", year: 2026, status: "published" },
  { title: "Machine Learning for Crop Yield Prediction", authors: "Dr. Ngozi Okafor", journal: "J. Agricultural Innovation", year: 2026, status: "published" },
  { title: "Public Health Policy Frameworks Post-COVID", authors: "Dr. Fatima Bello", journal: "Pan-African Health Journal", year: 2025, status: "published" },
  { title: "Climate Adaptation Governance Models", authors: "Dr. Tunde Adeyemi", journal: "African Policy Studies", year: 2025, status: "in_review" },
  { title: "AI Ethics in African Higher Education", authors: "Prof. Kwame Asante", journal: "J. Education Technology", year: 2025, status: "published" },
];

export default function ResearchOutputPage() {
  const [search, setSearch] = useState("");
  const filtered = RECENT.filter(r =>
    r.title.toLowerCase().includes(search.toLowerCase()) ||
    r.authors.toLowerCase().includes(search.toLowerCase()) ||
    r.journal.toLowerCase().includes(search.toLowerCase())
  );

  const handleViewPaper = (title: string) => {
    toast.info(`Opening "${title}"...`);
  };

  return (
    <DashboardLayout>
      <div className="max-w-6xl mx-auto space-y-6">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Research Output</h1>
          <p className="text-sm text-muted-foreground mt-1">Track institutional research publications and impact metrics.</p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {STATS.map(s => (
            <Card key={s.label} className="border-border">
              <CardContent className="pt-5 pb-4 px-5 flex items-center justify-between">
                <div>
                  <p className="text-xs text-muted-foreground">{s.label}</p>
                  <p className="text-2xl font-bold text-foreground mt-1">{s.value}</p>
                </div>
                <div className={`h-10 w-10 rounded-lg ${s.bg} flex items-center justify-center`}>
                  <s.icon className={`h-5 w-5 ${s.color}`} />
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input placeholder="Search publications by title, author, or journal..." className="pl-10" value={search} onChange={e => setSearch(e.target.value)} />
        </div>

        <div>
          <h2 className="text-lg font-bold text-foreground mb-4">Recent Publications</h2>
          <Card className="border-border">
            <CardContent className="p-0 divide-y divide-border">
              {filtered.length === 0 && (
                <p className="text-sm text-muted-foreground px-5 py-6 text-center">No publications match your search.</p>
              )}
              {filtered.map((r, i) => (
                <div key={i} className="px-5 py-4 hover:bg-secondary/20 transition-colors flex items-start justify-between gap-4">
                  <div className="min-w-0 flex-1">
                    <p className="text-sm font-medium text-foreground">{r.title}</p>
                    <p className="text-xs text-muted-foreground mt-1">{r.authors}</p>
                    <div className="flex items-center gap-2 mt-2">
                      <Badge variant="secondary" className="text-[10px]">{r.journal}</Badge>
                      <span className="text-xs text-muted-foreground">{r.year}</span>
                      <Badge variant={r.status === "published" ? "default" : "outline"} className="text-[10px] ml-auto">
                        {r.status === "published" ? "Published" : "In Review"}
                      </Badge>
                    </div>
                  </div>
                  <Button variant="ghost" size="sm" className="shrink-0 gap-1.5 text-xs mt-1" onClick={() => handleViewPaper(r.title)}>
                    <ExternalLink className="h-3.5 w-3.5" /> View
                  </Button>
                </div>
              ))}
            </CardContent>
          </Card>
        </div>
      </div>
    </DashboardLayout>
  );
}
