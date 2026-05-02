import { useState } from "react";
import { Link } from "react-router-dom";
import DashboardLayout from "@/components/dashboard/DashboardLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { BookOpen, Eye, Download, Wallet, ExternalLink, TrendingUp } from "lucide-react";
import { usePublishing } from "@/hooks/usePublishing";
import { toast } from "sonner";

const DEMO_PUBLISHED = [
  {
    id: "p1",
    title: "Climate Policy Innovation in West Africa",
    journal: "African Policy Research Review",
    published_at: "2026-02-28",
    views: 1240,
    downloads: 312,
    earnings: 45000,
    is_paid: true,
    price: 1500,
  },
  {
    id: "p2",
    title: "Digital Financial Inclusion and Economic Growth in East Africa",
    journal: "East African Economic Review",
    published_at: "2026-01-15",
    views: 860,
    downloads: 198,
    earnings: 28000,
    is_paid: false,
    price: 0,
  },
];

const fmtNaira = (n: number) =>
  new Intl.NumberFormat("en-NG", { style: "currency", currency: "NGN", maximumFractionDigits: 0 }).format(n);

const PublishedPapers = () => {
  const { submissions, updateSubmission } = usePublishing();
  const published = submissions.filter((s) => s.status === "published");
  const realItems = published.length > 0;
  const items = realItems
    ? published.map((s) => ({
        id: s.id,
        title: s.title,
        journal: s.journal_name,
        published_at: s.updated_at,
        views: s.view_count ?? 0,
        downloads: s.download_count ?? 0,
        earnings: Number(s.total_earnings ?? 0),
        is_paid: !!s.is_paid,
        price: Number(s.price_amount ?? 0),
      }))
    : DEMO_PUBLISHED;

  const totalEarnings = items.reduce((sum, p) => sum + (p.earnings || 0), 0);
  const totalViews = items.reduce((sum, p) => sum + (p.views || 0), 0);
  const totalDownloads = items.reduce((sum, p) => sum + (p.downloads || 0), 0);

  const [priceDraft, setPriceDraft] = useState<Record<string, string>>({});

  const handleTogglePaid = async (id: string, next: boolean) => {
    if (!realItems) {
      toast.info("Demo paper — publish a real paper to enable monetisation.");
      return;
    }
    await updateSubmission.mutateAsync({ id, is_paid: next, price_amount: next ? (Number(priceDraft[id]) || 1000) : 0 } as any);
  };

  const handleSavePrice = async (id: string) => {
    if (!realItems) return;
    const value = Number(priceDraft[id]);
    if (!value || value < 0) { toast.error("Enter a valid price"); return; }
    await updateSubmission.mutateAsync({ id, price_amount: value, is_paid: true } as any);
    toast.success("Price updated");
  };

  return (
    <DashboardLayout>
      <div className="max-w-6xl mx-auto space-y-6">
        <div>
          <h1 className="text-2xl font-bold text-foreground font-serif">Published Papers</h1>
          <p className="text-sm text-muted-foreground mt-1">Your accepted and published works — manage access and pricing.</p>
        </div>

        {/* Earnings & analytics summary */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <Card><CardContent className="pt-5 pb-4 px-5">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs text-muted-foreground">Total earnings</p>
                <p className="text-2xl font-bold text-foreground mt-1">{fmtNaira(totalEarnings)}</p>
              </div>
              <Wallet className="h-5 w-5 text-afrika-green" />
            </div>
          </CardContent></Card>
          <Card><CardContent className="pt-5 pb-4 px-5">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs text-muted-foreground">Total views</p>
                <p className="text-2xl font-bold text-foreground mt-1">{totalViews.toLocaleString()}</p>
              </div>
              <Eye className="h-5 w-5 text-primary" />
            </div>
          </CardContent></Card>
          <Card><CardContent className="pt-5 pb-4 px-5">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs text-muted-foreground">Total downloads</p>
                <p className="text-2xl font-bold text-foreground mt-1">{totalDownloads.toLocaleString()}</p>
              </div>
              <Download className="h-5 w-5 text-accent" />
            </div>
          </CardContent></Card>
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
                <CardContent className="py-4 px-5 space-y-3">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                    <div className="min-w-0">
                      <p className="font-medium text-foreground truncate">{p.title}</p>
                      <div className="flex flex-wrap items-center gap-2 mt-1">
                        <span className="text-xs text-muted-foreground">{p.journal}</span>
                        <Badge variant="secondary" className="text-[10px]">Published</Badge>
                        <Badge variant={p.is_paid ? "default" : "outline"} className="text-[10px]">
                          {p.is_paid ? `Paid · ${fmtNaira(p.price)}` : "Free"}
                        </Badge>
                        <span className="text-xs text-muted-foreground">
                          {new Date(p.published_at).toLocaleDateString()}
                        </span>
                      </div>
                    </div>
                    <div className="flex items-center gap-4 text-xs text-muted-foreground shrink-0">
                      <span className="flex items-center gap-1"><Eye className="h-3.5 w-3.5" />{p.views}</span>
                      <span className="flex items-center gap-1"><Download className="h-3.5 w-3.5" />{p.downloads}</span>
                      <span className="flex items-center gap-1 text-foreground font-medium"><Wallet className="h-3.5 w-3.5" />{fmtNaira(p.earnings)}</span>
                      <Link to={`/dashboard/publishing/submissions/${p.id}`}>
                        <Button variant="ghost" size="sm" className="gap-1"><ExternalLink className="h-3.5 w-3.5" />View</Button>
                      </Link>
                    </div>
                  </div>

                  {/* Monetisation controls */}
                  <div className="border-t border-border pt-3 flex flex-col sm:flex-row sm:items-center gap-3">
                    <div className="flex items-center gap-2">
                      <Switch
                        id={`paid-${p.id}`}
                        checked={p.is_paid}
                        onCheckedChange={(v) => handleTogglePaid(p.id, v)}
                      />
                      <Label htmlFor={`paid-${p.id}`} className="text-xs">
                        {p.is_paid ? "Paid article" : "Free article"}
                      </Label>
                    </div>
                    {p.is_paid && (
                      <div className="flex items-center gap-2">
                        <Label className="text-xs text-muted-foreground">Price (₦)</Label>
                        <Input
                          type="number"
                          min={0}
                          className="h-8 w-28"
                          defaultValue={p.price}
                          value={priceDraft[p.id] ?? String(p.price)}
                          onChange={(e) => setPriceDraft((prev) => ({ ...prev, [p.id]: e.target.value }))}
                        />
                        <Button size="sm" variant="afrikaOutline" onClick={() => handleSavePrice(p.id)}>Save</Button>
                      </div>
                    )}
                    <span className="text-[11px] text-muted-foreground sm:ml-auto flex items-center gap-1">
                      <TrendingUp className="h-3 w-3" />
                      Earnings update as readers purchase access.
                    </span>
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