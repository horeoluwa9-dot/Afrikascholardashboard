import { useState } from "react";
import { Link } from "react-router-dom";
import DashboardLayout from "@/components/dashboard/DashboardLayout";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from "@/components/ui/select";
import {
  ChevronRight, Search, Users, GraduationCap, MapPin, Globe,
  MessageCircle,
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface Researcher {
  id: number;
  name: string;
  username: string;
  institution: string;
  country: string;
  researchField: string;
  interests: string[];
}

const researchers: Researcher[] = [
  { id: 1, name: "Dimayo", username: "@dimayo", institution: "University of Lagos", country: "Nigeria", researchField: "Business Administration", interests: ["Restaurant Business", "Economic Growth", "SME Development"] },
  { id: 2, name: "Hassan B.", username: "@hassanb07", institution: "Ahmadu Bello University", country: "Nigeria", researchField: "Agricultural Economics", interests: ["Agricultural Credit", "Productivity Analysis", "Panel Data"] },
  { id: 3, name: "Hassan B. (II)", username: "@hassanb17", institution: "University of Ibadan", country: "Nigeria", researchField: "Agricultural Sciences", interests: ["Credit Mechanisms", "Sub-Saharan Agriculture", "Food Security"] },
  { id: 4, name: "Fresource", username: "@fresource2021", institution: "University of Nigeria, Nsukka", country: "Nigeria", researchField: "Library & Information Science", interests: ["Digital Resources", "Medical Libraries", "Performance Evaluation"] },
  { id: 5, name: "Dr. Ama Mensah", username: "Dr. Ama Mensah", institution: "University of Ghana", country: "Ghana", researchField: "Energy Policy & Sustainability", interests: ["Renewable Energy", "Climate Policy", "West Africa"] },
  { id: 6, name: "Dr. Tunde Adeyemi", username: "Dr. Tunde Adeyemi", institution: "University of Lagos", country: "Nigeria", researchField: "Climate Policy & Environmental Science", interests: ["Climate Adaptation", "Environmental Policy", "West Africa"] },
  { id: 7, name: "Dr. Fatima Bello", username: "Dr. Fatima Bello", institution: "Ahmadu Bello University", country: "Nigeria", researchField: "Public Health & Epidemiology", interests: ["Disease Surveillance", "Epidemiological Modeling", "Health Systems"] },
];

const uniqueFields = [...new Set(researchers.map((r) => r.researchField))];
const uniqueInstitutions = [...new Set(researchers.map((r) => r.institution))];
const uniqueCountries = [...new Set(researchers.map((r) => r.country))];

const CommunityResearchersPage = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [fieldFilter, setFieldFilter] = useState("all");
  const [institutionFilter, setInstitutionFilter] = useState("all");
  const [countryFilter, setCountryFilter] = useState("all");
  const { toast } = useToast();

  const filtered = researchers.filter((r) => {
    const matchesSearch = !searchQuery ||
      r.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      r.username.toLowerCase().includes(searchQuery.toLowerCase()) ||
      r.interests.some((i) => i.toLowerCase().includes(searchQuery.toLowerCase()));
    const matchesField = fieldFilter === "all" || r.researchField === fieldFilter;
    const matchesInstitution = institutionFilter === "all" || r.institution === institutionFilter;
    const matchesCountry = countryFilter === "all" || r.country === countryFilter;
    return matchesSearch && matchesField && matchesInstitution && matchesCountry;
  });

  return (
    <DashboardLayout>
      <div className="max-w-5xl mx-auto space-y-6">
        <div className="flex items-center gap-1 text-xs text-muted-foreground">
          <Link to="/dashboard" className="hover:text-foreground">Dashboard</Link>
          <ChevronRight className="h-3 w-3" />
          <Link to="/dashboard/community" className="hover:text-foreground">Community</Link>
          <ChevronRight className="h-3 w-3" />
          <span className="text-foreground font-medium">Researchers</span>
        </div>

        <div>
          <h1 className="text-2xl font-bold text-foreground">Researchers</h1>
          <p className="text-sm text-muted-foreground mt-1">Discover and connect with researchers in the community.</p>
        </div>

        {/* Filters */}
        <div className="flex flex-col sm:flex-row gap-3">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} placeholder="Search by name, username, or keyword..." className="pl-9" />
          </div>
          <Select value={fieldFilter} onValueChange={setFieldFilter}>
            <SelectTrigger className="w-full sm:w-48">
              <SelectValue placeholder="Research Field" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Fields</SelectItem>
              {uniqueFields.map((f) => <SelectItem key={f} value={f}>{f}</SelectItem>)}
            </SelectContent>
          </Select>
          <Select value={institutionFilter} onValueChange={setInstitutionFilter}>
            <SelectTrigger className="w-full sm:w-48">
              <SelectValue placeholder="Institution" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Institutions</SelectItem>
              {uniqueInstitutions.map((i) => <SelectItem key={i} value={i}>{i}</SelectItem>)}
            </SelectContent>
          </Select>
          <Select value={countryFilter} onValueChange={setCountryFilter}>
            <SelectTrigger className="w-full sm:w-36">
              <SelectValue placeholder="Country" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Countries</SelectItem>
              {uniqueCountries.map((c) => <SelectItem key={c} value={c}>{c}</SelectItem>)}
            </SelectContent>
          </Select>
        </div>

        {/* Results */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {filtered.length === 0 ? (
            <div className="col-span-full bg-card rounded-xl border border-border p-12 text-center">
              <Users className="h-10 w-10 mx-auto text-muted-foreground/30" />
              <p className="text-sm font-semibold text-foreground mt-3">No researchers found</p>
              <p className="text-xs text-muted-foreground mt-1">Try adjusting your filters.</p>
            </div>
          ) : (
            filtered.map((r) => (
              <div key={r.id} className="bg-card rounded-xl border border-border p-5 hover:shadow-sm transition-shadow">
                <div className="flex items-start gap-3">
                  <Link
                    to={`/dashboard/researcher?user=${encodeURIComponent(r.username)}`}
                    className="h-11 w-11 rounded-full bg-accent flex items-center justify-center text-accent-foreground text-sm font-bold shrink-0 hover:ring-2 hover:ring-accent/50 transition-all"
                  >
                    {r.name[0].toUpperCase()}
                  </Link>
                  <div className="flex-1 min-w-0">
                    <Link to={`/dashboard/researcher?user=${encodeURIComponent(r.username)}`} className="text-sm font-bold text-foreground hover:text-accent transition-colors">
                      {r.name}
                    </Link>
                    <p className="text-[10px] text-muted-foreground">{r.username}</p>
                    <div className="flex items-center gap-3 mt-1.5 text-[10px] text-muted-foreground">
                      <span className="flex items-center gap-1"><GraduationCap className="h-3 w-3" /> {r.institution}</span>
                      <span className="flex items-center gap-1"><MapPin className="h-3 w-3" /> {r.country}</span>
                    </div>
                    <div className="flex flex-wrap gap-1 mt-2">
                      {r.interests.map((interest) => (
                        <Badge key={interest} variant="outline" className="text-[10px] bg-secondary text-foreground">{interest}</Badge>
                      ))}
                    </div>
                    <div className="flex gap-2 mt-3">
                      <Button variant="afrikaOutline" size="sm" className="text-xs gap-1 h-7">
                        <Users className="h-3 w-3" /> Connect
                      </Button>
                      <Link to={`/dashboard/researcher?user=${encodeURIComponent(r.username)}`}>
                        <Button variant="ghost" size="sm" className="text-xs h-7">View Profile</Button>
                      </Link>
                    </div>
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

export default CommunityResearchersPage;