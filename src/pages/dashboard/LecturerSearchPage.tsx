import { useState } from "react";
import { Link } from "react-router-dom";
import DashboardLayout from "@/components/dashboard/DashboardLayout";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from "@/components/ui/select";
import {
  Search, Building2, BookOpen, MapPin, MessageCircle, Eye, Handshake,
  SlidersHorizontal, GraduationCap,
} from "lucide-react";
import { useInstitutional } from "@/hooks/useInstitutional";

interface LecturerProfile {
  user_id: string;
  display_name: string;
  institution: string;
  discipline: string;
  country: string;
  academic_title: string;
  bio: string;
  position: string;
  experience: string;
}

const sampleLecturers: LecturerProfile[] = [
  {
    user_id: "s1",
    display_name: "Dr. Kofi Mensah",
    institution: "University of Ghana",
    discipline: "Energy Policy Research",
    country: "Ghana",
    academic_title: "Senior Lecturer",
    bio: "Specialist in renewable energy policy with focus on sustainable development frameworks for West African nations.",
    position: "Department of Energy Studies",
    experience: "12 years research experience",
  },
  {
    user_id: "s2",
    display_name: "Prof. Amina Osei",
    institution: "University of Cape Town",
    discipline: "Public Health",
    country: "South Africa",
    academic_title: "Professor",
    bio: "Leading researcher in public health systems and epidemiology across Sub-Saharan Africa with focus on disease surveillance.",
    position: "School of Public Health",
    experience: "18 years research experience",
  },
  {
    user_id: "s3",
    display_name: "Dr. Fatima Al-Hassan",
    institution: "Mohammed V University",
    discipline: "Agricultural Economics",
    country: "Morocco",
    academic_title: "Associate Professor",
    bio: "Research focus on climate-smart agriculture, food security policy, and smallholder farming economics in North Africa.",
    position: "Faculty of Agricultural Sciences",
    experience: "9 years research experience",
  },
  {
    user_id: "s4",
    display_name: "Dr. Emmanuel Nkrumah",
    institution: "University of Nairobi",
    discipline: "Computer Science",
    country: "Kenya",
    academic_title: "Lecturer",
    bio: "AI and machine learning researcher focused on applications in healthcare and education across African contexts.",
    position: "Department of Computing",
    experience: "7 years research experience",
  },
  {
    user_id: "s5",
    display_name: "Prof. Ngozi Adeyemi",
    institution: "University of Ibadan",
    discipline: "Constitutional Law",
    country: "Nigeria",
    academic_title: "Professor",
    bio: "Expert in African governance, constitutional reform, and institutional development across post-colonial states.",
    position: "Faculty of Law",
    experience: "22 years research experience",
  },
];

const countries = ["All", "Ghana", "South Africa", "Kenya", "Nigeria", "Morocco", "Ethiopia"];
const fields = ["All", "Energy Policy", "Public Health", "Agricultural Economics", "Computer Science", "Law", "Education"];
const ranks = ["All", "Lecturer", "Senior Lecturer", "Associate Professor", "Professor"];

const LecturerSearchPage = () => {
  const { searchLecturers } = useInstitutional();
  const [searchTerm, setSearchTerm] = useState("");
  const [country, setCountry] = useState("All");
  const [field, setField] = useState("All");
  const [rank, setRank] = useState("All");
  const [showFilters, setShowFilters] = useState(false);
  const [dbResults, setDbResults] = useState<any[] | null>(null);
  const [searching, setSearching] = useState(false);

  const handleSearch = async () => {
    setSearching(true);
    try {
      const data = await searchLecturers({
        field: field !== "All" ? field : searchTerm || undefined,
        institution: undefined,
        country: country !== "All" ? country : undefined,
      });
      setDbResults(data);
    } finally {
      setSearching(false);
    }
  };

  // Use DB results if we have them and they're non-empty; otherwise show sample
  const useSample = dbResults === null || dbResults.length === 0;
  const displayLecturers = useSample
    ? sampleLecturers.filter(l => {
        const matchSearch = !searchTerm || l.display_name.toLowerCase().includes(searchTerm.toLowerCase()) || l.discipline.toLowerCase().includes(searchTerm.toLowerCase());
        const matchCountry = country === "All" || l.country === country;
        const matchField = field === "All" || l.discipline.toLowerCase().includes(field.toLowerCase());
        const matchRank = rank === "All" || l.academic_title.toLowerCase().includes(rank.toLowerCase());
        return matchSearch && matchCountry && matchField && matchRank;
      })
    : dbResults.map((r: any) => ({
        user_id: r.user_id,
        display_name: r.display_name || "Unknown",
        institution: r.institution || "—",
        discipline: r.discipline || "—",
        country: r.country || "—",
        academic_title: r.academic_title || "Researcher",
        bio: r.bio || "",
        position: r.position || "",
        experience: "",
      }));

  return (
    <DashboardLayout>
      <div className="max-w-5xl mx-auto space-y-6">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Lecturer Directory</h1>
          <p className="text-sm text-muted-foreground mt-1">
            Find researchers and lecturers across the Afrika Scholar network.
          </p>
        </div>

        {/* Search */}
        <div className="space-y-4">
          <div className="flex items-center gap-3">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search by expertise, institution, or research field..."
                value={searchTerm}
                onChange={e => setSearchTerm(e.target.value)}
                className="pl-10"
                onKeyDown={e => e.key === "Enter" && handleSearch()}
              />
            </div>
            <Button variant="afrika" className="gap-2" onClick={handleSearch} disabled={searching}>
              <Search className="h-4 w-4" />{searching ? "Searching..." : "Search"}
            </Button>
            <Button variant="outline" onClick={() => setShowFilters(!showFilters)} className="gap-2">
              <SlidersHorizontal className="h-4 w-4" /> Filters
            </Button>
          </div>

          {showFilters && (
            <Card className="border-border">
              <CardContent className="py-4 px-5">
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div>
                    <Label className="text-xs">Research Field</Label>
                    <Select value={field} onValueChange={setField}>
                      <SelectTrigger className="mt-1.5"><SelectValue /></SelectTrigger>
                      <SelectContent>
                        {fields.map(f => <SelectItem key={f} value={f}>{f}</SelectItem>)}
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label className="text-xs">Country</Label>
                    <Select value={country} onValueChange={setCountry}>
                      <SelectTrigger className="mt-1.5"><SelectValue /></SelectTrigger>
                      <SelectContent>
                        {countries.map(c => <SelectItem key={c} value={c}>{c}</SelectItem>)}
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label className="text-xs">Academic Rank</Label>
                    <Select value={rank} onValueChange={setRank}>
                      <SelectTrigger className="mt-1.5"><SelectValue /></SelectTrigger>
                      <SelectContent>
                        {ranks.map(r => <SelectItem key={r} value={r}>{r}</SelectItem>)}
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}
        </div>

        {/* Results count */}
        <p className="text-sm text-muted-foreground">
          Showing <span className="font-semibold text-foreground">{displayLecturers.length}</span> researcher{displayLecturers.length !== 1 ? "s" : ""}
        </p>

        {/* Lecturer Cards */}
        <div className="space-y-4">
          {displayLecturers.map(l => {
            const initials = l.display_name.split(" ").map((n: string) => n[0]).join("").toUpperCase().slice(0, 2);
            return (
              <Card key={l.user_id} className="border-border hover:shadow-sm transition-shadow">
                <CardContent className="py-5 px-5">
                  <div className="flex items-start gap-4">
                    <div className="h-12 w-12 rounded-full bg-primary flex items-center justify-center text-primary-foreground font-bold text-sm shrink-0">
                      {initials}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 flex-wrap">
                        <h3 className="font-semibold text-foreground">{l.display_name}</h3>
                        <Badge variant="secondary" className="text-[10px]">{l.academic_title}</Badge>
                      </div>
                      <div className="flex items-center gap-4 mt-1.5 text-xs text-muted-foreground flex-wrap">
                        <span className="flex items-center gap-1"><Building2 className="h-3 w-3" />{l.institution}</span>
                        <span className="flex items-center gap-1"><BookOpen className="h-3 w-3" />{l.discipline}</span>
                        <span className="flex items-center gap-1"><MapPin className="h-3 w-3" />{l.country}</span>
                      </div>
                      {l.experience && (
                        <p className="text-xs text-muted-foreground mt-1 flex items-center gap-1">
                          <GraduationCap className="h-3 w-3" />{l.experience}
                        </p>
                      )}
                      {l.bio && <p className="text-sm text-muted-foreground mt-2 line-clamp-2">{l.bio}</p>}
                    </div>
                    <div className="flex flex-col gap-2 shrink-0">
                      <Link to={l.user_id.startsWith("s") ? "#" : `/dashboard/researcher?id=${l.user_id}`}>
                        <Button variant="outline" size="sm" className="gap-1 text-xs w-full">
                          <Eye className="h-3 w-3" /> View Profile
                        </Button>
                      </Link>
                      <Button variant="afrikaOutline" size="sm" className="gap-1 text-xs">
                        <Handshake className="h-3 w-3" /> Request Advisory
                      </Button>
                      <Link to="/dashboard/messages">
                        <Button variant="ghost" size="sm" className="gap-1 text-xs w-full">
                          <MessageCircle className="h-3 w-3" /> Message
                        </Button>
                      </Link>
                    </div>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>

        {displayLecturers.length === 0 && (
          <Card className="border-border">
            <CardContent className="py-16 text-center">
              <Search className="h-12 w-12 text-muted-foreground/30 mx-auto mb-3" />
              <p className="text-sm text-muted-foreground">No researchers found matching your criteria.</p>
            </CardContent>
          </Card>
        )}
      </div>
    </DashboardLayout>
  );
};

export default LecturerSearchPage;
