import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Shield, ArrowLeft } from "lucide-react";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";

const CompliancePage = () => (
  <div className="min-h-screen">
    <Navbar />
    <section className="afrika-gradient-bg py-16 text-center">
      <h1 className="text-3xl font-bold text-primary-foreground">Academic Integrity & Responsible AI Policy</h1>
    </section>
    <section className="py-16 container mx-auto px-4 max-w-3xl">
      <div className="bg-card rounded-2xl p-8 border border-border prose prose-sm max-w-none">
        <div className="flex items-center gap-3 mb-6">
          <Shield className="h-8 w-8 text-afrika-orange" />
          <h2 className="text-xl font-bold text-primary m-0">Responsible AI Usage</h2>
        </div>
        <p className="text-muted-foreground">
          Afrika Scholar promotes the responsible use of AI in academic research. Publeesh is designed as a research-support system
          that enhances scholarship without replacing independent thinking, peer review, or institutional supervision.
        </p>
        <h3 className="text-primary mt-6">Our Commitments</h3>
        <ul className="text-sm text-foreground space-y-2">
          <li>AI tools assist structuring, not writing, of academic content</li>
          <li>Users retain full responsibility for their research output</li>
          <li>Integrity reminders are built into the workflow</li>
          <li>AI disclosure support is provided for submissions</li>
          <li>Compliance with global academic integrity standards</li>
        </ul>
        <h3 className="text-primary mt-6">User Responsibilities</h3>
        <ul className="text-sm text-foreground space-y-2">
          <li>Follow your institution's academic integrity policies</li>
          <li>Disclose AI-assisted portions of research as required</li>
          <li>Do not use Publeesh to bypass supervision or peer review</li>
          <li>Ensure all submitted work meets ethical research standards</li>
        </ul>
      </div>
      <Link to="/publeesh" className="flex items-center gap-1 text-sm text-muted-foreground mt-6 hover:text-foreground">
        <ArrowLeft className="h-4 w-4" /> Back to Publeesh
      </Link>
    </section>
    <Footer />
  </div>
);

export default CompliancePage;
