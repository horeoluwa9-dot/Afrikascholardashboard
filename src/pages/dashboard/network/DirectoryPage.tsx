import { useState } from "react";
import DashboardLayout from "@/components/dashboard/DashboardLayout";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from "@/components/ui/select";
import {
  Sheet, SheetContent, SheetHeader, SheetTitle,
} from "@/components/ui/sheet";
import {
  Search, MapPin, Building2, GraduationCap, FileText, Send, Eye, ListFilter,
} from "lucide-react";
import { toast } from "sonner";

interface Academic {
  id: string;
  name: string;
  title: string;
  institution: string;
  country: string;
  field: string;
  expertise: string[];
  publications: number;
  bio: string;
  avatarUrl: string | null;
}

const DEMO_ACADEMICS: Academic[] = [
  {
    id: "1", name: "Dr. Kofi Mensah", title: "Associate Professor", institution: "University of Ghana",
    country: "Ghana", field: "Health Policy", expertise: ["Public Health", "Epidemiology", "Policy Analysis"],
    publications: 15, bio: "Leading researcher in public health policy with focus on Sub-Saharan African health systems.",
    avatarUrl: null,
  },
  {
    id: "2", name: "Dr. Amina Bello", title: "Senior Lecturer", institution: "University of Lagos",
    country: "Nigeria", field: "Public Health", expertise: ["Epidemiological Modeling", "Data Analysis", "Health Systems"],
    publications: 12, bio: "Specialist in public health policy with 12 years of research experience across West Africa.",
    avatarUrl: null,
  },
  {
    id: "3", name: "Prof. Kwame Asante", title: "Professor", institution: "University of Cape Town",
    country: "South Africa", field: "Agricultural Economics", expertise: ["Climate Adaptation", "Food Security", "Rural Development"],
    publications: 28, bio: "Leading researcher in agricultural economics and climate adaptation strategies.",
    avatarUrl: null,
  },
  {
    id: "4", name: "Dr. Fatou Diallo", title: "Research Fellow", institution: "Université Cheikh Anta Diop",
    country: "Senegal", field: "Renewable Energy", expertise: ["Solar Photovoltaics", "Energy Policy", "Sustainable Development"],
    publications: 9, bio: "Expert in renewable energy systems with focus on solar technology in Sub-Saharan Africa.",
    avatarUrl: null,
  },
  {
    id: "5", name: "Dr. Ibrahim Sadiq", title: "Lecturer", institution: "University of Nairobi",
    country: "Kenya", field: "Environmental Science", expertise: ["Climate Change", "Biodiversity", "Water Resources"],
    publications: 11, bio: "Environmental scientist focused on climate change impacts in East Africa.",
    avatarUrl: null,
  },
  {
    id: "6", name: "Dr. Grace Nwoye", title: "Postdoctoral Fellow", institution: "Makerere University",
    country: "Uganda", field: "Data Science", expertise: ["Machine Learning", "NLP", "AI for Development"],
    publications: 7, bio: "AI researcher specializing in natural language processing for African languages.",
    avatarUrl: null,
  },
];

const COUNTRIES = ["Ghana", "Nigeria", "South Africa", "Senegal", "Kenya", "Uganda"];
const FIELDS = ["Health Policy", "Public Health", "Agricultural Economics", "Renewable Energy", "Environmental Science", "Data Science"];

const DirectoryPage = () => {
  const [search, setSearch] = useState("");
  const [countryFilter, setCountryFilter] = useState("all");
  const [fieldFilter, setFieldFilter] = useState("all");
  const [selected, setSelected] = useState<Academic | null>(null);

  const filtered = DEMO_ACADEMICS.filter((a) => {
    const matchSearch = !search || a.name.toLowerCase().includes(search.toLowerCase()) || a.institution.toLowerCase().includes(search.toLowerCase());
    const matchCountry = countryFilter === "all" || a.country === countryFilter;
    const matchField = fieldFilter === "all" || a.field === fieldFilter;
    return matchSearch && matchCountry && matchField;
  });

  const handleInvite = (name: string) => {
    toast.success(`Invitation sent to ${name}`);
  };

  return (
    <DashboardLayout>
      <div className="max-w-6xl mx-auto space-y-6">
        {/* Header */}
        <div>
          <h1 className="text-2xl font-bold text-foreground font-serif">Academic Directory</h1>
          <p className="text-sm text-muted-foreground mt-1">
            Browse researchers and academic experts across the network.
          </p>
        </div>

        {/* Filters */}
        <div className="flex flex-col sm:flex-row gap-3">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input placeholder="Search by name or institution..." value={search} onChange={(e) => setSearch(e.target.value)} className="pl-9" />
          </div>
          <Select value={fieldFilter} onValueChange={setFieldFilter}>
            <SelectTrigger className="w-full sm:w-[180px]">
              <ListFilter className="h-4 w-4 mr-2" />
              <SelectValue placeholder="Field" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Fields</SelectItem>
              {FIELDS.map((f) => (
                <SelectItem key={f} value={f}>{f}</SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Select value={countryFilter} onValueChange={setCountryFilter}>
            <SelectTrigger className="w-full sm:w-[160px]">
              <MapPin className="h-4 w-4 mr-2" />
              <SelectValue placeholder="Country" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Countries</SelectItem>
              {COUNTRIES.map((c) => (
                <SelectItem key={c} value={c}>{c}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Directory Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filtered.map((academic) => (
            <Card key={academic.id} className="border-border hover:shadow-md transition-shadow">
              <CardContent className="pt-5 pb-4 px-5">
                <div className="flex items-start gap-4">
                  <Avatar className="h-12 w-12">
                    <AvatarImage src={academic.avatarUrl || undefined} />
                    <AvatarFallback className="bg-primary/10 text-primary font-semibold">
                      {academic.name.split(" ").map((n) => n[0]).join("")}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-semibold text-foreground">{academic.name}</p>
                    <p className="text-xs text-muted-foreground">{academic.title}</p>
                  </div>
                </div>

                <div className="mt-4 space-y-2">
                  <div className="flex items-center gap-2 text-xs text-muted-foreground">
                    <Building2 className="h-3.5 w-3.5 shrink-0" />
                    <span className="truncate">{academic.institution}</span>
                  </div>
                  <div className="flex items-center gap-2 text-xs text-muted-foreground">
                    <MapPin className="h-3.5 w-3.5 shrink-0" />
                    <span>{academic.country}</span>
                  </div>
                  <div className="flex items-center gap-2 text-xs text-muted-foreground">
                    <GraduationCap className="h-3.5 w-3.5 shrink-0" />
                    <span>{academic.field}</span>
                  </div>
                  <div className="flex items-center gap-2 text-xs text-muted-foreground">
                    <FileText className="h-3.5 w-3.5 shrink-0" />
                    <span>{academic.publications} publications</span>
                  </div>
                </div>

                <div className="flex flex-wrap gap-1 mt-3">
                  {academic.expertise.slice(0, 2).map((e) => (
                    <Badge key={e} variant="secondary" className="text-[10px]">{e}</Badge>
                  ))}
                  {academic.expertise.length > 2 && (
                    <Badge variant="outline" className="text-[10px]">+{academic.expertise.length - 2}</Badge>
                  )}
                </div>

                <div className="flex gap-2 mt-4 pt-3 border-t border-border">
                  <Button size="sm" variant="outline" className="flex-1 text-xs h-8" onClick={() => setSelected(academic)}>
                    <Eye className="h-3 w-3 mr-1" /> Profile
                  </Button>
                  <Button size="sm" className="flex-1 text-xs h-8 bg-accent hover:bg-accent/90 text-accent-foreground" onClick={() => handleInvite(academic.name)}>
                    <Send className="h-3 w-3 mr-1" /> Invite
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {filtered.length === 0 && (
          <Card className="border-border">
            <CardContent className="py-12 text-center">
              <Search className="h-10 w-10 text-muted-foreground/40 mx-auto mb-3" />
              <p className="font-semibold text-foreground">No academics found</p>
              <p className="text-sm text-muted-foreground mt-1">Try adjusting your search or filters</p>
            </CardContent>
          </Card>
        )}
      </div>

      {/* Academic Profile Sheet */}
      <Sheet open={!!selected} onOpenChange={() => setSelected(null)}>
        <SheetContent className="sm:max-w-lg overflow-y-auto">
          {selected && (
            <>
              <SheetHeader>
                <div className="flex items-center gap-4">
                  <Avatar className="h-14 w-14">
                    <AvatarImage src={selected.avatarUrl || undefined} />
                    <AvatarFallback className="bg-primary/10 text-primary font-semibold text-lg">
                      {selected.name.split(" ").map((n) => n[0]).join("")}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <SheetTitle className="text-lg">{selected.name}</SheetTitle>
                    <p className="text-sm text-muted-foreground">{selected.title}</p>
                  </div>
                </div>
              </SheetHeader>
              <div className="mt-6 space-y-6">
                <section>
                  <h3 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2">About</h3>
                  <p className="text-sm text-foreground">{selected.bio}</p>
                </section>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-xs text-muted-foreground">Institution</p>
                    <p className="text-sm font-medium text-foreground">{selected.institution}</p>
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground">Country</p>
                    <p className="text-sm font-medium text-foreground">{selected.country}</p>
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground">Field</p>
                    <p className="text-sm font-medium text-foreground">{selected.field}</p>
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground">Publications</p>
                    <p className="text-sm font-medium text-foreground">{selected.publications}</p>
                  </div>
                </div>
                <section>
                  <h3 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2">Expertise</h3>
                  <div className="flex flex-wrap gap-1.5">
                    {selected.expertise.map((e) => (
                      <Badge key={e} variant="secondary" className="text-xs">{e}</Badge>
                    ))}
                  </div>
                </section>
                <Button className="w-full bg-accent hover:bg-accent/90 text-accent-foreground" onClick={() => {
                  handleInvite(selected.name);
                  setSelected(null);
                }}>
                  <Send className="h-4 w-4 mr-2" /> Invite to Opportunity
                </Button>
              </div>
            </>
          )}
        </SheetContent>
      </Sheet>
    </DashboardLayout>
  );
};

export default DirectoryPage;
