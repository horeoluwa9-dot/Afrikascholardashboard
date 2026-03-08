import { useState } from "react";
import { Link } from "react-router-dom";
import DashboardLayout from "@/components/dashboard/DashboardLayout";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Search, User, Building2, BookOpen, MapPin, MessageCircle, Eye, Handshake } from "lucide-react";
import { useInstitutional } from "@/hooks/useInstitutional";

interface ProfileResult {
  user_id: string;
  display_name: string | null;
  institution: string | null;
  discipline: string | null;
  country: string | null;
  academic_title: string | null;
  bio: string | null;
  position: string | null;
}

const LecturerSearchPage = () => {
  const { searchLecturers } = useInstitutional();
  const [filters, setFilters] = useState({ field: "", institution: "", country: "" });
  const [results, setResults] = useState<ProfileResult[]>([]);
  const [searched, setSearched] = useState(false);
  const [searching, setSearching] = useState(false);

  const handleSearch = async () => {
    setSearching(true);
    try {
      const data = await searchLecturers(filters);
      setResults(data as ProfileResult[]);
      setSearched(true);
    } finally {
      setSearching(false);
    }
  };

  return (
    <DashboardLayout>
      <div className="max-w-5xl mx-auto space-y-6">
        <div>
          <h1 className="text-2xl font-bold text-foreground font-serif">Lecturer & Researcher Directory</h1>
          <p className="text-sm text-muted-foreground mt-1">Search academics within the Afrika Scholar network.</p>
        </div>

        {/* Filters */}
        <Card className="border-border">
          <CardContent className="py-5 px-5">
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div>
                <Label className="text-xs">Research Field</Label>
                <Input className="mt-1" placeholder="e.g. Energy Policy" value={filters.field}
                  onChange={e => setFilters(f => ({...f, field: e.target.value}))} />
              </div>
              <div>
                <Label className="text-xs">Institution</Label>
                <Input className="mt-1" placeholder="e.g. University of Ghana" value={filters.institution}
                  onChange={e => setFilters(f => ({...f, institution: e.target.value}))} />
              </div>
              <div>
                <Label className="text-xs">Country</Label>
                <Input className="mt-1" placeholder="e.g. Ghana" value={filters.country}
                  onChange={e => setFilters(f => ({...f, country: e.target.value}))} />
              </div>
            </div>
            <Button variant="afrika" className="mt-4 gap-2" onClick={handleSearch} disabled={searching}>
              <Search className="h-4 w-4" />{searching ? "Searching..." : "Search Directory"}
            </Button>
          </CardContent>
        </Card>

        {/* Results */}
        {searched && results.length === 0 && (
          <Card className="border-border">
            <CardContent className="py-12 text-center">
              <Search className="h-10 w-10 text-muted-foreground/40 mx-auto mb-3" />
              <p className="text-sm text-muted-foreground">No researchers found matching your criteria.</p>
            </CardContent>
          </Card>
        )}

        {results.length > 0 && (
          <div className="space-y-4">
            {results.map(r => {
              const initials = (r.display_name || "?").split(" ").map(n => n[0]).join("").toUpperCase().slice(0, 2);
              return (
                <Card key={r.user_id} className="border-border">
                  <CardContent className="py-5 px-5">
                    <div className="flex items-start gap-4">
                      <div className="h-12 w-12 rounded-full bg-primary flex items-center justify-center text-primary-foreground font-bold shrink-0">
                        {initials}
                      </div>
                      <div className="flex-1 min-w-0">
                        <h3 className="font-semibold text-foreground">{r.display_name || "Unknown"}</h3>
                        {r.academic_title && <Badge variant="secondary" className="text-[10px] mt-0.5">{r.academic_title}</Badge>}
                        <div className="flex items-center gap-4 mt-2 text-xs text-muted-foreground flex-wrap">
                          {r.institution && <span className="flex items-center gap-1"><Building2 className="h-3 w-3" />{r.institution}</span>}
                          {r.discipline && <span className="flex items-center gap-1"><BookOpen className="h-3 w-3" />{r.discipline}</span>}
                          {r.country && <span className="flex items-center gap-1"><MapPin className="h-3 w-3" />{r.country}</span>}
                        </div>
                        {r.bio && <p className="text-sm text-muted-foreground mt-2 line-clamp-2">{r.bio}</p>}
                      </div>
                      <div className="flex flex-col gap-2 shrink-0">
                        <Link to={`/dashboard/researcher?id=${r.user_id}`}>
                          <Button variant="outline" size="sm" className="gap-1 text-xs w-full"><Eye className="h-3 w-3" />View Profile</Button>
                        </Link>
                        <Button variant="afrikaOutline" size="sm" className="gap-1 text-xs"><Handshake className="h-3 w-3" />Request Advisory</Button>
                        <Link to="/dashboard/messages">
                          <Button variant="ghost" size="sm" className="gap-1 text-xs w-full"><MessageCircle className="h-3 w-3" />Message</Button>
                        </Link>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        )}
      </div>
    </DashboardLayout>
  );
};

export default LecturerSearchPage;
