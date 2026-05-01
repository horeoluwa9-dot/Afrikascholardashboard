import { Link } from "react-router-dom";
import DashboardLayout from "@/components/dashboard/DashboardLayout";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { BookOpen, Eye, Download, Wallet, ExternalLink } from "lucide-react";
import { usePublishing } from "@/hooks/usePublishing";

const DEMO_PUBLISHED = [
  {
    id: "p1",
    title: "Climate Policy Innovation in West Africa",
    journal: "African Policy Research Review",
    published_at: "2026-02-28",
    views: 1240,
    downloads: 312,
    earnings: 45000,
  },
  {
    id: "p2",
    title: "Digital Financial Inclusion and Economic Growth in East Africa",
    journal: "East African Economic Review",
    published_at: "2026-01-15",
    views: 860,
    downloads: 198,
    earnings: 28000,
  },
];

const PublishedPapers = () => {
  const { submissions } = usePublishing();
  const published = submissions.filter((s) => s.status === "published");
  const items = published.length > 0
    ? published.map((s) => ({
        id: s.id,
        title: s.title,
        journal: s.journal_name,
        published_at: s.updated_at,
        views: 0,
        downloads: 0,
        earnings: 0,
      }))
    : DEMO_PUBLISHED;

  return (
    <DashboardLayout>
      <div className="max-w-6xl mx-auto space-y-6">
        <div>
          <h1 className="text-2xl font-bold text-foreground font-serif">Published Papers</h1>
          <p className="text-sm text-muted-foreground mt-1">Your accepted and published works.</p>
        </div>

        {items.length === 0 ? (
          <Card>
            <CardContent className="py-16 text-center">
              <BookOpen className="h-12 w-12 text-muted-foreground/40 mx-auto mb-4" />
              <h3 className="text-lg font-semibold">No published papers yet</h3>
              <p className="text-sm text-muted-foreground mt-2">Once your manuscripts are accepted, they will appear here.</p>
              <Link to="/dashboard/publishing/submit">
                <Button variant="afrika" className="mt-6">Submit a Manuscript</Button>
              </Link>
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-3">
            {items.map((p) => (
              <Card key={p.id} className="border-border">
                <CardContent className="py-4 px-5 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <div className="min-w-0">
                    <p className="font-medium text-foreground truncate">{p.title}</p>
                    <div className="flex flex-wrap items-center gap-2 mt-1">
                      <span className="text-xs text-muted-foreground">{p.journal}</span>
                      <Badge variant="secondary" className="text-[10px]">Published</Badge>
                      <span className="text-xs text-muted-foreground">
                        {new Date(p.published_at).toLocaleDateString()}
                      </span>
                    </div>
                  </div>
                  <div className="flex items-center gap-4 text-xs text-muted-foreground shrink-0">
                    <span className="flex items-center gap-1"><Eye className="h-3.5 w-3.5" />{p.views}</span>
                    <span className="flex items-center gap-1"><Download className="h-3.5 w-3.5" />{p.downloads}</span>
                    <span className="flex items-center gap-1 text-foreground font-medium"><Wallet className="h-3.5 w-3.5" />₦{p.earnings.toLocaleString()}</span>
                    <Link to={`/dashboard/publishing/submissions/${p.id}`}>
                      <Button variant="ghost" size="sm" className="gap-1"><ExternalLink className="h-3.5 w-3.5" />View</Button>
                    </Link>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </DashboardLayout>
  );
};

export default PublishedPapers;