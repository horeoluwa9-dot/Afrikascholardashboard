import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ArrowRight } from "lucide-react";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";

const InstitutionalDemo = () => (
  <div className="min-h-screen">
    <Navbar />
    <section className="afrika-gradient-bg py-16 text-center">
      <h1 className="text-3xl font-bold text-primary-foreground">Request Institutional Demo</h1>
      <p className="text-sm text-primary-foreground/70 mt-2">See how Publeesh can empower your institution's research.</p>
    </section>
    <section className="py-16 container mx-auto px-4 max-w-lg">
      <form className="bg-card rounded-2xl p-8 border border-border space-y-4" onSubmit={(e) => e.preventDefault()}>
        <div>
          <Label>Institution Name</Label>
          <Input placeholder="University of..." className="mt-1" />
        </div>
        <div>
          <Label>Contact Name</Label>
          <Input placeholder="Your name" className="mt-1" />
        </div>
        <div>
          <Label>Email</Label>
          <Input type="email" placeholder="you@institution.edu" className="mt-1" />
        </div>
        <div>
          <Label>Number of Seats Needed</Label>
          <Input type="number" placeholder="e.g. 50" className="mt-1" />
        </div>
        <Button variant="afrika" className="w-full">Submit Request <ArrowRight className="h-4 w-4" /></Button>
      </form>
    </section>
    <Footer />
  </div>
);

export default InstitutionalDemo;
