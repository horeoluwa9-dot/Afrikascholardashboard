import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { BookOpen, Globe, Users, ArrowRight } from "lucide-react";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";

const modules = [
  {
    icon: BookOpen,
    title: "Publeesh",
    desc: "AI-powered research intelligence — structured drafting, datasets, and analysis tools.",
    link: "/dashboard/publeesh",
    color: "bg-afrika-orange",
  },
  {
    icon: Globe,
    title: "Publishing",
    desc: "Submit manuscripts, track submissions, and manage your publication pipeline.",
    link: "/dashboard/publishing",
    color: "bg-afrika-blue",
  },
  {
    icon: Users,
    title: "Network",
    desc: "Connect with researchers, institutions, and collaborators across Africa.",
    link: "/dashboard/network",
    color: "bg-afrika-green",
  },
];

const Dashboard = () => {
  return (
    <div className="min-h-screen bg-secondary">
      <Navbar />
      <div className="container mx-auto px-4 py-12">
        <div className="mb-10">
          <h1 className="text-2xl font-bold text-primary">Welcome back 👋</h1>
          <p className="text-sm text-muted-foreground mt-1">Select a module to get started.</p>
        </div>

        <div className="grid md:grid-cols-3 gap-6">
          {modules.map((m) => (
            <Link key={m.title} to={m.link} className="group">
              <div className="bg-card rounded-2xl p-7 border border-border card-hover h-full">
                <div className={`h-12 w-12 rounded-xl ${m.color} flex items-center justify-center mb-4`}>
                  <m.icon className="h-6 w-6 text-accent-foreground" />
                </div>
                <h3 className="text-lg font-bold text-primary">{m.title}</h3>
                <p className="text-sm text-muted-foreground mt-2">{m.desc}</p>
                <div className="mt-4 flex items-center gap-1 text-sm font-semibold text-afrika-orange group-hover:gap-2 transition-all">
                  Open <ArrowRight className="h-4 w-4" />
                </div>
              </div>
            </Link>
          ))}
        </div>

        {/* Credit Balance */}
        <div className="mt-10 bg-card rounded-2xl p-7 border border-border max-w-lg">
          <h3 className="font-bold text-primary mb-4">Credit Balance</h3>
          <div className="grid grid-cols-3 gap-4">
            {[
              { label: "Paper", used: 3, total: 25 },
              { label: "Dataset", used: 5, total: 25 },
              { label: "Analysis", used: 12, total: 35 },
            ].map((c) => (
              <div key={c.label} className="text-center">
                <p className="text-xs text-muted-foreground">{c.label}</p>
                <p className="text-lg font-bold text-primary">{c.total - c.used}</p>
                <div className="h-1.5 bg-secondary rounded-full mt-1">
                  <div className="h-full bg-afrika-orange rounded-full" style={{ width: `${(c.used / c.total) * 100}%` }} />
                </div>
                <p className="text-[10px] text-muted-foreground mt-1">{c.used}/{c.total} used</p>
              </div>
            ))}
          </div>
          <Link to="/publeesh/pricing" className="mt-4 block">
            <Button variant="afrikaOutline" size="sm">Upgrade Plan</Button>
          </Link>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default Dashboard;
