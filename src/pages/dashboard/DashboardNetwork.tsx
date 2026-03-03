import { Link } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";

const DashboardNetwork = () => (
  <div className="min-h-screen bg-secondary">
    <Navbar />
    <div className="container mx-auto px-4 py-12">
      <Link to="/dashboard" className="flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground mb-6">
        <ArrowLeft className="h-4 w-4" /> Back to Dashboard
      </Link>
      <h1 className="text-2xl font-bold text-primary">Network</h1>
      <p className="text-sm text-muted-foreground mt-1">Connect with researchers across Africa.</p>
      <div className="mt-8 bg-card rounded-2xl p-12 border border-border text-center">
        <p className="text-muted-foreground">Networking features coming soon.</p>
      </div>
    </div>
    <Footer />
  </div>
);

export default DashboardNetwork;
