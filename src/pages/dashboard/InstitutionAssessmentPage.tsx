import { useState } from "react";
import { Link } from "react-router-dom";
import DashboardLayout from "@/components/dashboard/DashboardLayout";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from "@/components/ui/select";
import {
  Building2, MapPin, BookOpen, Users2, TrendingUp, GraduationCap,
  Search, ArrowRight, BarChart3, SlidersHorizontal,
} from "lucide-react";

interface Institution {
  id: string;
  name: string;
  location: string;
  country: string;
  programs: string[];
  researchOutput: number;
  facultyStrength: number;
  studentPrograms: number;
  ranking?: number;
}

const sampleInstitutions: Institution[] = [
  {
    id: "uog",
    name: "University of Ghana",
    location: "Accra, Ghana",
    country: "Ghana",
    programs: ["Public Health", "Economics", "Political Science"],
    researchOutput: 1240,
    facultyStrength: 860,
    studentPrograms: 94,
    ranking: 7,
  },
  {
    id: "uct",
    name: "University of Cape Town",
    location: "Cape Town, South Africa",
    country: "South Africa",
    programs: ["Engineering", "Medicine", "Law", "Computer Science"],
    researchOutput: 3200,
    facultyStrength: 1450,
    studentPrograms: 120,
    ranking: 1,
  },
  {
    id: "uon",
    name: "University of Nairobi",
    location: "Nairobi, Kenya",
    country: "Kenya",
    programs: ["Agriculture", "Business", "Education"],
    researchOutput: 980,
    facultyStrength: 720,
    studentPrograms: 78,
    ranking: 12,
  },
  {
    id: "uil",
    name: "University of Ibadan",
    location: "Ibadan, Nigeria",
    country: "Nigeria",
    programs: ["Medicine", "Arts", "Social Sciences", "Technology"],
    researchOutput: 1580,
    facultyStrength: 1100,
    studentPrograms: 105,
    ranking: 5,
  },
  {
    id: "amu",
    name: "Addis Ababa University",
    location: "Addis Ababa, Ethiopia",
    country: "Ethiopia",
    programs: ["Natural Sciences", "Social Sciences", "Health Sciences"],
    researchOutput: 870,
    facultyStrength: 650,
    studentPrograms: 68,
    ranking: 15,
  },
  {
    id: "um5",
    name: "Mohammed V University",
    location: "Rabat, Morocco",
    country: "Morocco",
    programs: ["Engineering", "Humanities", "Law"],
    researchOutput: 1050,
    facultyStrength: 780,
    studentPrograms: 82,
    ranking: 10,
  },
];

const countries = ["All", "Ghana", "South Africa", "Kenya", "Nigeria", "Ethiopia", "Morocco"];
const fields = ["All", "Public Health", "Engineering", "Medicine", "Agriculture", "Computer Science", "Law", "Economics"];
const programTypes = ["All", "Undergraduate", "Postgraduate", "Doctoral", "Diploma"];

export default function InstitutionAssessmentPage() {
  const [search, setSearch] = useState("");
  const [country, setCountry] = useState("All");
  const [field, setField] = useState("All");
  const [programType, setProgramType] = useState("All");
  const [showFilters, setShowFilters] = useState(false);

  const filtered = sampleInstitutions.filter((inst) => {
    const matchesSearch =
      !search ||
      inst.name.toLowerCase().includes(search.toLowerCase()) ||
      inst.programs.some((p) => p.toLowerCase().includes(search.toLowerCase()));
    const matchesCountry = country === "All" || inst.country === country;
    const matchesField =
      field === "All" || inst.programs.some((p) => p.toLowerCase().includes(field.toLowerCase()));
    return matchesSearch && matchesCountry && matchesField;
  });

  return (
    <DashboardLayout>
      <div className="max-w-6xl mx-auto space-y-8">
        {/* Header */}
        <div>
          <h1 className="text-2xl font-bold text-foreground">Explore &amp; Assess Institutions</h1>
          <p className="text-sm text-muted-foreground mt-1">
            Compare universities, academic programs, and research environments across Africa.
          </p>
        </div>

        {/* Search + Filters */}
        <div className="space-y-4">
          <div className="flex items-center gap-3">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search universities or programs..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="pl-10"
              />
            </div>
            <Button
              variant="outline"
              size="default"
              onClick={() => setShowFilters(!showFilters)}
              className="gap-2"
            >
              <SlidersHorizontal className="h-4 w-4" />
              Filters
            </Button>
          </div>

          {showFilters && (
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 p-4 bg-card rounded-xl border border-border">
              <div>
                <label className="text-xs font-medium text-muted-foreground mb-1.5 block">Country</label>
                <Select value={country} onValueChange={setCountry}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    {countries.map((c) => (
                      <SelectItem key={c} value={c}>{c}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div>
                <label className="text-xs font-medium text-muted-foreground mb-1.5 block">Research Field</label>
                <Select value={field} onValueChange={setField}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    {fields.map((f) => (
                      <SelectItem key={f} value={f}>{f}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div>
                <label className="text-xs font-medium text-muted-foreground mb-1.5 block">Program Type</label>
                <Select value={programType} onValueChange={setProgramType}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    {programTypes.map((p) => (
                      <SelectItem key={p} value={p}>{p}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
          )}
        </div>

        {/* Results count */}
        <p className="text-sm text-muted-foreground">
          Showing <span className="font-semibold text-foreground">{filtered.length}</span> institution{filtered.length !== 1 ? "s" : ""}
        </p>

        {/* Institution Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {filtered.map((inst) => (
            <div
              key={inst.id}
              className="bg-card rounded-xl border border-border p-5 hover:shadow-md transition-shadow space-y-4"
            >
              {/* Header */}
              <div className="flex items-start gap-3">
                <div className="h-11 w-11 rounded-lg bg-secondary flex items-center justify-center shrink-0">
                  <Building2 className="h-5 w-5 text-accent" />
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="text-base font-bold text-foreground truncate">{inst.name}</h3>
                  <p className="text-xs text-muted-foreground flex items-center gap-1 mt-0.5">
                    <MapPin className="h-3 w-3" /> {inst.location}
                  </p>
                </div>
                {inst.ranking && (
                  <Badge variant="secondary" className="text-[10px] shrink-0">
                    Rank #{inst.ranking}
                  </Badge>
                )}
              </div>

              {/* Programs */}
              <div>
                <p className="text-xs font-medium text-muted-foreground mb-1.5">Programs</p>
                <div className="flex flex-wrap gap-1.5">
                  {inst.programs.map((p) => (
                    <Badge key={p} variant="outline" className="text-[10px] font-normal">
                      {p}
                    </Badge>
                  ))}
                </div>
              </div>

              {/* Metrics */}
              <div className="grid grid-cols-3 gap-3">
                <div className="text-center p-2 bg-secondary/50 rounded-lg">
                  <TrendingUp className="h-3.5 w-3.5 text-accent mx-auto mb-1" />
                  <p className="text-sm font-bold text-foreground">{inst.researchOutput.toLocaleString()}</p>
                  <p className="text-[10px] text-muted-foreground">Research Output</p>
                </div>
                <div className="text-center p-2 bg-secondary/50 rounded-lg">
                  <Users2 className="h-3.5 w-3.5 text-accent mx-auto mb-1" />
                  <p className="text-sm font-bold text-foreground">{inst.facultyStrength.toLocaleString()}</p>
                  <p className="text-[10px] text-muted-foreground">Faculty Strength</p>
                </div>
                <div className="text-center p-2 bg-secondary/50 rounded-lg">
                  <GraduationCap className="h-3.5 w-3.5 text-accent mx-auto mb-1" />
                  <p className="text-sm font-bold text-foreground">{inst.studentPrograms}</p>
                  <p className="text-[10px] text-muted-foreground">Student Programs</p>
                </div>
              </div>

              {/* Actions */}
              <div className="flex gap-2 pt-1">
                <Link to={`/dashboard/institutions/${inst.id}`} className="flex-1">
                  <Button variant="afrika" size="sm" className="w-full gap-1.5 text-xs">
                    View Institution <ArrowRight className="h-3 w-3" />
                  </Button>
                </Link>
                <Button variant="afrikaOutline" size="sm" className="flex-1 text-xs">
                  Compare
                </Button>
              </div>
            </div>
          ))}
        </div>

        {filtered.length === 0 && (
          <div className="text-center py-16">
            <Building2 className="h-12 w-12 text-muted-foreground/30 mx-auto mb-3" />
            <p className="text-sm text-muted-foreground">No institutions match your search.</p>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}
