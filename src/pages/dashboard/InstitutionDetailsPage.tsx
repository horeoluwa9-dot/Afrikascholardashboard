import { useParams, Link } from "react-router-dom";
import DashboardLayout from "@/components/dashboard/DashboardLayout";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Building2, MapPin, ArrowLeft, TrendingUp, Users2, GraduationCap,
  BookOpen, ClipboardList, Globe, Mail,
} from "lucide-react";

const institutionData: Record<string, any> = {
  uog: {
    name: "University of Ghana",
    location: "Accra, Ghana",
    ranking: 7,
    overview: "The University of Ghana is the oldest and largest of the thirteen Ghanaian national public universities. Founded in 1948, it has grown into a comprehensive university with a strong emphasis on research and academic excellence across multiple disciplines.",
    programs: [
      { name: "Public Health", level: "MSc / PhD", department: "School of Public Health" },
      { name: "Economics", level: "BA / MA / PhD", department: "Department of Economics" },
      { name: "Political Science", level: "BA / MPhil", department: "Department of Political Science" },
      { name: "Computer Science", level: "BSc / MSc", department: "Department of Computer Science" },
      { name: "Law", level: "LLB / LLM", department: "School of Law" },
    ],
    researchOutput: 1240,
    facultyStrength: 860,
    studentPrograms: 94,
    researchAreas: ["Tropical Medicine", "African Studies", "Agricultural Economics", "Data Science", "Governance"],
    faculty: [
      { name: "Prof. Nana Aba Mensah", department: "Public Health", specialization: "Epidemiology" },
      { name: "Dr. Kwame Asante", department: "Economics", specialization: "Development Economics" },
      { name: "Prof. Akua Sarpong", department: "Political Science", specialization: "African Politics" },
    ],
    admissions: {
      deadline: "March 31, 2026",
      requirements: "Bachelor's degree with minimum GPA 3.0, English proficiency, research statement, two academic references.",
      internationalStudents: true,
      scholarships: ["Ghana Government Scholarship", "UG Merit Award", "African Union Scholarship"],
    },
  },
  uct: {
    name: "University of Cape Town",
    location: "Cape Town, South Africa",
    ranking: 1,
    overview: "The University of Cape Town is the oldest university in South Africa and is consistently ranked as the top university on the African continent. It is renowned for its research output and diverse academic programs.",
    programs: [
      { name: "Engineering", level: "BSc / MSc / PhD", department: "Faculty of Engineering" },
      { name: "Medicine", level: "MBChB / MMed", department: "Faculty of Health Sciences" },
      { name: "Law", level: "LLB / LLM / PhD", department: "Faculty of Law" },
      { name: "Computer Science", level: "BSc / MSc / PhD", department: "Department of Computer Science" },
    ],
    researchOutput: 3200,
    facultyStrength: 1450,
    studentPrograms: 120,
    researchAreas: ["Climate Science", "HIV/AIDS Research", "Machine Learning", "Constitutional Law", "Marine Biology"],
    faculty: [
      { name: "Prof. Thandi Nkosi", department: "Engineering", specialization: "Renewable Energy" },
      { name: "Dr. James van der Merwe", department: "Medicine", specialization: "Infectious Disease" },
    ],
    admissions: {
      deadline: "June 30, 2026",
      requirements: "National Senior Certificate or equivalent, English proficiency, faculty-specific requirements.",
      internationalStudents: true,
      scholarships: ["UCT International Scholarship", "Mandela Rhodes Scholarship", "South African Government Bursary"],
    },
  },
};

// Fallback for institutions not fully detailed
const fallback = {
  overview: "Detailed information about this institution is being compiled. Check back soon for comprehensive data.",
  programs: [],
  researchAreas: [],
  faculty: [],
  admissions: { deadline: "TBA", requirements: "Contact institution for details.", internationalStudents: true, scholarships: [] },
};

export default function InstitutionDetailsPage() {
  const { id } = useParams<{ id: string }>();
  const data = institutionData[id || ""] || null;
  const inst = data || fallback;
  const name = data?.name || "Institution";

  return (
    <DashboardLayout>
      <div className="max-w-5xl mx-auto space-y-8">
        {/* Back link */}
        <Link to="/dashboard/institutions" className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors">
          <ArrowLeft className="h-4 w-4" /> Back to Institutions
        </Link>

        {/* Header */}
        <div className="flex items-start gap-4">
          <div className="h-14 w-14 rounded-xl bg-secondary flex items-center justify-center shrink-0">
            <Building2 className="h-7 w-7 text-accent" />
          </div>
          <div className="flex-1">
            <div className="flex items-center gap-3 flex-wrap">
              <h1 className="text-2xl font-bold text-foreground">{name}</h1>
              {data?.ranking && (
                <Badge variant="secondary">Rank #{data.ranking}</Badge>
              )}
            </div>
            {data?.location && (
              <p className="text-sm text-muted-foreground flex items-center gap-1 mt-1">
                <MapPin className="h-3.5 w-3.5" /> {data.location}
              </p>
            )}
          </div>
          <div className="flex gap-2 shrink-0">
            <Button variant="afrika" size="sm" className="gap-1.5">
              <ClipboardList className="h-3.5 w-3.5" /> Apply for Program
            </Button>
            <Button variant="afrikaOutline" size="sm" className="gap-1.5">
              <Mail className="h-3.5 w-3.5" /> Request Advisory
            </Button>
          </div>
        </div>

        {/* Metrics */}
        {data && (
          <div className="grid grid-cols-3 gap-4">
            {[
              { icon: TrendingUp, value: data.researchOutput.toLocaleString(), label: "Research Output" },
              { icon: Users2, value: data.facultyStrength.toLocaleString(), label: "Faculty Strength" },
              { icon: GraduationCap, value: data.studentPrograms, label: "Student Programs" },
            ].map((m) => (
              <div key={m.label} className="bg-card rounded-xl border border-border p-4 text-center">
                <m.icon className="h-5 w-5 text-accent mx-auto mb-2" />
                <p className="text-xl font-bold text-foreground">{m.value}</p>
                <p className="text-xs text-muted-foreground">{m.label}</p>
              </div>
            ))}
          </div>
        )}

        {/* Tabs */}
        <Tabs defaultValue="overview" className="space-y-6">
          <TabsList className="bg-secondary">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="programs">Programs</TabsTrigger>
            <TabsTrigger value="research">Research Output</TabsTrigger>
            <TabsTrigger value="faculty">Faculty</TabsTrigger>
            <TabsTrigger value="admissions">Admissions</TabsTrigger>
          </TabsList>

          <TabsContent value="overview">
            <div className="bg-card rounded-xl border border-border p-6 space-y-4">
              <h2 className="text-lg font-bold text-foreground">About {name}</h2>
              <p className="text-sm text-muted-foreground leading-relaxed">{inst.overview}</p>
              {inst.researchAreas?.length > 0 && (
                <div>
                  <p className="text-xs font-medium text-muted-foreground mb-2">Key Research Areas</p>
                  <div className="flex flex-wrap gap-2">
                    {inst.researchAreas.map((area: string) => (
                      <Badge key={area} variant="outline" className="text-xs">{area}</Badge>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </TabsContent>

          <TabsContent value="programs">
            <div className="bg-card rounded-xl border border-border divide-y divide-border">
              {inst.programs.length > 0 ? inst.programs.map((prog: any, i: number) => (
                <div key={i} className="p-4 flex items-center justify-between">
                  <div>
                    <p className="text-sm font-semibold text-foreground">{prog.name}</p>
                    <p className="text-xs text-muted-foreground">{prog.department}</p>
                  </div>
                  <Badge variant="secondary" className="text-[10px]">{prog.level}</Badge>
                </div>
              )) : (
                <div className="p-8 text-center">
                  <BookOpen className="h-8 w-8 text-muted-foreground/30 mx-auto mb-2" />
                  <p className="text-sm text-muted-foreground">Program data is being compiled.</p>
                </div>
              )}
            </div>
          </TabsContent>

          <TabsContent value="research">
            <div className="bg-card rounded-xl border border-border p-6 space-y-4">
              <h2 className="text-lg font-bold text-foreground">Research Output</h2>
              <p className="text-sm text-muted-foreground">
                {name} has produced <span className="font-semibold text-foreground">{data?.researchOutput?.toLocaleString() || "N/A"}</span> research publications across multiple disciplines.
              </p>
              {inst.researchAreas?.length > 0 && (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mt-4">
                  {inst.researchAreas.map((area: string) => (
                    <div key={area} className="flex items-center gap-2 p-3 bg-secondary/50 rounded-lg">
                      <Globe className="h-4 w-4 text-accent shrink-0" />
                      <span className="text-sm text-foreground">{area}</span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </TabsContent>

          <TabsContent value="faculty">
            <div className="bg-card rounded-xl border border-border divide-y divide-border">
              {inst.faculty.length > 0 ? inst.faculty.map((f: any, i: number) => (
                <div key={i} className="p-4 flex items-center justify-between">
                  <div>
                    <p className="text-sm font-semibold text-foreground">{f.name}</p>
                    <p className="text-xs text-muted-foreground">{f.department} · {f.specialization}</p>
                  </div>
                  <Button variant="ghost" size="sm" className="text-xs">View Profile</Button>
                </div>
              )) : (
                <div className="p-8 text-center">
                  <Users2 className="h-8 w-8 text-muted-foreground/30 mx-auto mb-2" />
                  <p className="text-sm text-muted-foreground">Faculty data is being compiled.</p>
                </div>
              )}
            </div>
          </TabsContent>

          <TabsContent value="admissions">
            <div className="bg-card rounded-xl border border-border p-6 space-y-4">
              <h2 className="text-lg font-bold text-foreground">Admissions</h2>
              <div className="space-y-3">
                <div>
                  <p className="text-xs font-medium text-muted-foreground">Application Deadline</p>
                  <p className="text-sm text-foreground">{inst.admissions.deadline}</p>
                </div>
                <div>
                  <p className="text-xs font-medium text-muted-foreground">Requirements</p>
                  <p className="text-sm text-foreground leading-relaxed">{inst.admissions.requirements}</p>
                </div>
                {inst.admissions.scholarships?.length > 0 && (
                  <div>
                    <p className="text-xs font-medium text-muted-foreground mb-1.5">Available Scholarships</p>
                    <div className="flex flex-wrap gap-2">
                      {inst.admissions.scholarships.map((s: string) => (
                        <Badge key={s} variant="outline" className="text-xs">{s}</Badge>
                      ))}
                    </div>
                  </div>
                )}
              </div>
              <div className="flex gap-2 pt-2">
                <Button variant="afrika" size="sm" className="gap-1.5">
                  <ClipboardList className="h-3.5 w-3.5" /> Apply for Program
                </Button>
                <Button variant="afrikaOutline" size="sm" className="gap-1.5">
                  <Mail className="h-3.5 w-3.5" /> Request Advisory
                </Button>
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </DashboardLayout>
  );
}
