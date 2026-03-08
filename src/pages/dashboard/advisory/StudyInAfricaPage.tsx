import { useState } from "react";
import { Link } from "react-router-dom";
import DashboardLayout from "@/components/dashboard/DashboardLayout";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Globe, Search, MapPin, Clock, GraduationCap, Handshake, Eye } from "lucide-react";

interface Program {
  id: string;
  name: string;
  institution: string;
  country: string;
  duration: string;
  level: string;
  field: string;
  description: string;
}

const samplePrograms: Program[] = [
  { id: "p1", name: "Master's in Public Health", institution: "University of Cape Town", country: "South Africa", duration: "2 Years", level: "Master's", field: "Public Health", description: "A comprehensive program covering epidemiology, health policy, and global health challenges facing the African continent." },
  { id: "p2", name: "PhD in Computer Science", institution: "University of Lagos", country: "Nigeria", duration: "4 Years", level: "PhD", field: "Computer Science", description: "Research-focused doctoral program with specializations in AI, data science, and software engineering." },
  { id: "p3", name: "Master's in Data Science", institution: "University of Nairobi", country: "Kenya", duration: "2 Years", level: "Master's", field: "Data Science", description: "Applied data science program with emphasis on machine learning and African development contexts." },
  { id: "p4", name: "BSc Agricultural Science", institution: "Makerere University", country: "Uganda", duration: "4 Years", level: "Bachelor's", field: "Agriculture", description: "Undergraduate program focused on sustainable agriculture, food security, and agricultural innovation." },
  { id: "p5", name: "Master's in Economics", institution: "University of Ghana", country: "Ghana", duration: "2 Years", level: "Master's", field: "Economics", description: "Applied economics program with specializations in development economics and African trade policy." },
  { id: "p6", name: "PhD in Environmental Science", institution: "Mohammed V University", country: "Morocco", duration: "3 Years", level: "PhD", field: "Environmental Science", description: "Research program focused on climate adaptation, renewable energy, and environmental policy in Africa." },
];

const countries = ["All Countries", "South Africa", "Nigeria", "Kenya", "Uganda", "Ghana", "Morocco"];
const levels = ["All Levels", "Bachelor's", "Master's", "PhD"];

const StudyInAfricaPage = () => {
  const [search, setSearch] = useState("");
  const [country, setCountry] = useState("All Countries");
  const [level, setLevel] = useState("All Levels");
  const [viewProgram, setViewProgram] = useState<Program | null>(null);

  const filtered = samplePrograms.filter(p => {
    if (search && !p.name.toLowerCase().includes(search.toLowerCase()) && !p.institution.toLowerCase().includes(search.toLowerCase())) return false;
    if (country !== "All Countries" && p.country !== country) return false;
    if (level !== "All Levels" && p.level !== level) return false;
    return true;
  });

  return (
    <DashboardLayout>
      <div className="max-w-6xl mx-auto space-y-8">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Study in Africa</h1>
          <p className="text-sm text-muted-foreground mt-1">Discover degree programs across African universities.</p>
        </div>

        {/* Search & Filters */}
        <div className="flex flex-col sm:flex-row gap-3">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input placeholder="Search universities or programs..." className="pl-9" value={search} onChange={e => setSearch(e.target.value)} />
          </div>
          <Select value={country} onValueChange={setCountry}>
            <SelectTrigger className="w-full sm:w-48"><SelectValue /></SelectTrigger>
            <SelectContent>
              {countries.map(c => <SelectItem key={c} value={c}>{c}</SelectItem>)}
            </SelectContent>
          </Select>
          <Select value={level} onValueChange={setLevel}>
            <SelectTrigger className="w-full sm:w-40"><SelectValue /></SelectTrigger>
            <SelectContent>
              {levels.map(l => <SelectItem key={l} value={l}>{l}</SelectItem>)}
            </SelectContent>
          </Select>
        </div>

        {/* Program Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filtered.map(p => (
            <Card key={p.id} className="border-border hover:shadow-md transition-shadow">
              <CardContent className="pt-5 pb-4 px-5">
                <div className="flex items-start justify-between mb-3">
                  <Badge variant="secondary" className="text-[10px]">{p.level}</Badge>
                  <Badge variant="outline" className="text-[10px] gap-1">
                    <MapPin className="h-2.5 w-2.5" /> {p.country}
                  </Badge>
                </div>
                <h3 className="text-sm font-bold text-foreground mb-1">{p.name}</h3>
                <p className="text-xs text-muted-foreground mb-1">{p.institution}</p>
                <div className="flex items-center gap-1 text-xs text-muted-foreground mb-4">
                  <Clock className="h-3 w-3" /> {p.duration}
                </div>
                <div className="flex gap-2">
                  <Button variant="afrikaOutline" size="sm" className="text-xs gap-1 flex-1" onClick={() => setViewProgram(p)}>
                    <Eye className="h-3 w-3" /> View
                  </Button>
                  <Button variant="afrika" size="sm" className="text-xs gap-1 flex-1">
                    <Handshake className="h-3 w-3" /> Request Advisory
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {filtered.length === 0 && (
          <div className="text-center py-12">
            <Globe className="h-10 w-10 text-muted-foreground/30 mx-auto mb-3" />
            <p className="text-sm text-muted-foreground">No programs match your search criteria.</p>
          </div>
        )}
      </div>

      {/* Program Detail Dialog */}
      <Dialog open={!!viewProgram} onOpenChange={(open) => !open && setViewProgram(null)}>
        <DialogContent className="max-w-md">
          <DialogHeader><DialogTitle>{viewProgram?.name}</DialogTitle></DialogHeader>
          {viewProgram && (
            <div className="space-y-3 text-sm">
              <div className="grid grid-cols-2 gap-3">
                <div><p className="text-muted-foreground text-xs">Institution</p><p className="font-medium">{viewProgram.institution}</p></div>
                <div><p className="text-muted-foreground text-xs">Country</p><p className="font-medium">{viewProgram.country}</p></div>
                <div><p className="text-muted-foreground text-xs">Duration</p><p className="font-medium">{viewProgram.duration}</p></div>
                <div><p className="text-muted-foreground text-xs">Level</p><Badge variant="secondary" className="text-[10px]">{viewProgram.level}</Badge></div>
              </div>
              <div>
                <p className="text-muted-foreground text-xs mb-1">About this Program</p>
                <p className="text-foreground">{viewProgram.description}</p>
              </div>
              <div className="flex gap-2 pt-2">
                <Button variant="afrika" size="sm" className="flex-1 gap-1"><GraduationCap className="h-3 w-3" /> Apply</Button>
                <Button variant="afrikaOutline" size="sm" className="flex-1 gap-1"><Handshake className="h-3 w-3" /> Request Advisory</Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </DashboardLayout>
  );
};

export default StudyInAfricaPage;
