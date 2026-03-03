import { Link } from "react-router-dom";
import { Mail, Phone, MapPin, Facebook, Twitter, Linkedin, Youtube } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useState } from "react";

const Footer = () => {
  const [email, setEmail] = useState("");

  return (
    <>
      {/* Newsletter */}
      <section className="bg-primary py-10 px-4">
        <div className="container mx-auto flex flex-col md:flex-row items-center justify-between gap-6">
          <div>
            <h3 className="text-xl font-bold text-primary-foreground">Stay Updated</h3>
            <p className="text-sm text-primary-foreground/70 mt-1">
              Get the latest research, publications, and opportunities delivered to your inbox.
            </p>
          </div>
          <form className="flex gap-2 w-full md:w-auto" onSubmit={(e) => e.preventDefault()}>
            <input
              type="email"
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="h-10 px-4 rounded-lg bg-primary-foreground/10 border border-primary-foreground/20 text-primary-foreground placeholder:text-primary-foreground/50 text-sm flex-1 md:w-64 focus:outline-none focus:ring-2 focus:ring-afrika-orange"
            />
            <Button variant="afrika" size="default">Subscribe</Button>
          </form>
        </div>
      </section>

      {/* Footer */}
      <footer className="afrika-gradient-bg text-primary-foreground">
        <div className="container mx-auto px-4 py-12">
          <div className="grid grid-cols-2 md:grid-cols-5 gap-8">
            {/* Brand */}
            <div className="col-span-2 md:col-span-1">
              <Link to="/" className="text-xl font-bold">
                <span className="text-afrika-orange">Afrika</span>
                <span className="text-primary-foreground">scholar</span>
              </Link>
              <p className="text-xs text-primary-foreground/60 mt-3 leading-relaxed">
                Pan-African Academic Publishing, Research & University Enablement Infrastructure — bridging knowledge gaps across the continent.
              </p>
              <div className="mt-4 space-y-2 text-xs text-primary-foreground/60">
                <div className="flex items-center gap-2">
                  <Mail className="h-3 w-3" />
                  <span>info@afrikascholars.org</span>
                </div>
                <div className="flex items-center gap-2">
                  <Phone className="h-3 w-3" />
                  <span>+234 XXX XXX XXXX</span>
                </div>
              </div>
              <div className="flex gap-3 mt-4">
                <Facebook className="h-4 w-4 text-primary-foreground/50 hover:text-primary-foreground cursor-pointer transition-colors" />
                <Twitter className="h-4 w-4 text-primary-foreground/50 hover:text-primary-foreground cursor-pointer transition-colors" />
                <Linkedin className="h-4 w-4 text-primary-foreground/50 hover:text-primary-foreground cursor-pointer transition-colors" />
                <Youtube className="h-4 w-4 text-primary-foreground/50 hover:text-primary-foreground cursor-pointer transition-colors" />
              </div>
            </div>

            {/* Platform */}
            <div>
              <h4 className="font-semibold text-sm mb-3">Platform</h4>
              <ul className="space-y-2 text-xs text-primary-foreground/60">
                <li><Link to="/about" className="hover:text-primary-foreground transition-colors">About Us</Link></li>
                <li><Link to="/publeesh" className="hover:text-primary-foreground transition-colors">Blog</Link></li>
                <li><Link to="/publeesh" className="hover:text-primary-foreground transition-colors">Publeesh</Link></li>
                <li><Link to="/compliance/responsible-ai" className="hover:text-primary-foreground transition-colors">Compliance</Link></li>
              </ul>
            </div>

            {/* Publications */}
            <div>
              <h4 className="font-semibold text-sm mb-3">Publications</h4>
              <ul className="space-y-2 text-xs text-primary-foreground/60">
                <li><Link to="/publications" className="hover:text-primary-foreground transition-colors">Browse Publications</Link></li>
                <li><Link to="/publishing/submit" className="hover:text-primary-foreground transition-colors">Submit Manuscript</Link></li>
                <li><Link to="/publications" className="hover:text-primary-foreground transition-colors">Start a Journal</Link></li>
                <li><Link to="/publications" className="hover:text-primary-foreground transition-colors">Call for Papers</Link></li>
              </ul>
            </div>

            {/* Advisory */}
            <div>
              <h4 className="font-semibold text-sm mb-3">Advisory</h4>
              <ul className="space-y-2 text-xs text-primary-foreground/60">
                <li><Link to="/advisory" className="hover:text-primary-foreground transition-colors">Transcriptal Advisory</Link></li>
                <li><Link to="/advisory" className="hover:text-primary-foreground transition-colors">Degree Programs</Link></li>
                <li><Link to="/advisory" className="hover:text-primary-foreground transition-colors">Study in Africa</Link></li>
              </ul>
            </div>

            {/* Quick Links */}
            <div>
              <h4 className="font-semibold text-sm mb-3">Quick Links</h4>
              <ul className="space-y-2 text-xs text-primary-foreground/60">
                <li><Link to="/network" className="hover:text-primary-foreground transition-colors">Join Network</Link></li>
                <li><Link to="/institution" className="hover:text-primary-foreground transition-colors">For Institutions</Link></li>
                <li><Link to="/publeesh" className="hover:text-primary-foreground transition-colors">Publeesh</Link></li>
              </ul>
            </div>
          </div>

          <div className="mt-10 pt-6 border-t border-primary-foreground/10 flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="text-xs text-primary-foreground/40">
              © 2026 Afrika Scholar. All rights reserved.
            </p>
            <div className="flex gap-4 text-xs text-primary-foreground/40">
              <Link to="/privacy" className="hover:text-primary-foreground transition-colors">Privacy Policy</Link>
              <Link to="/terms" className="hover:text-primary-foreground transition-colors">Terms of Service</Link>
            </div>
          </div>
        </div>
      </footer>
    </>
  );
};

export default Footer;
