import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Menu, X, ChevronDown } from "lucide-react";

const navLinks = [
  { label: "About", href: "/about" },
  { label: "Publications", href: "/publications" },
  { label: "Network", href: "/network" },
  { label: "Institution", href: "/institution" },
  { label: "Advisory", href: "/advisory" },
  {
    label: "Publishing",
    href: "/publishing",
    children: [
      { label: "Submit Manuscript", href: "/publishing/submit" },
      { label: "Browse Publications", href: "/publications" },
    ],
  },
];

const Navbar = () => {
  const [mobileOpen, setMobileOpen] = useState(false);
  const location = useLocation();
  const isPubleesh = location.pathname.startsWith("/publeesh");

  return (
    <nav className="sticky top-0 z-50 bg-primary-foreground shadow-sm border-b border-border">
      <div className="container mx-auto flex h-16 items-center justify-between px-4 lg:px-8">
        {/* Logo */}
        <Link to="/" className="flex items-center">
          <img src={afrikaLogo} alt="Afrika Scholar" className="h-8" />
        </Link>

        {/* Desktop Nav */}
        <div className="hidden lg:flex items-center gap-1">
          {navLinks.map((link) => (
            <div key={link.label} className="relative group">
              <Link
                to={link.href}
                className={`px-3 py-2 text-sm font-medium transition-colors rounded-md hover:bg-secondary ${
                  location.pathname === link.href ? "text-afrika-orange" : "text-foreground"
                }`}
              >
                {link.label}
                {link.children && <ChevronDown className="inline ml-1 h-3 w-3" />}
              </Link>
              {link.children && (
                <div className="absolute top-full left-0 mt-1 w-48 rounded-lg bg-card shadow-lg border border-border opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all z-50">
                  {link.children.map((child) => (
                    <Link
                      key={child.label}
                      to={child.href}
                      className="block px-4 py-2.5 text-sm hover:bg-secondary transition-colors first:rounded-t-lg last:rounded-b-lg"
                    >
                      {child.label}
                    </Link>
                  ))}
                </div>
              )}
            </div>
          ))}
          <Link
            to="/publeesh"
            className={`px-3 py-2 text-sm font-medium transition-colors rounded-md ${
              isPubleesh
                ? "text-afrika-orange font-bold bg-afrika-orange-light"
                : "text-foreground hover:bg-secondary"
            }`}
          >
            Publeesh
          </Link>
        </div>

        {/* Desktop Actions */}
        <div className="hidden lg:flex items-center gap-3">
          <Link to="/publeesh/pricing">
            <Button variant="ghost" size="sm">Publish Paper</Button>
          </Link>
          <Link to="/auth/login">
            <Button variant="outline" size="sm">Login</Button>
          </Link>
          <Link to="/auth/signup?intent=publeesh">
            <Button variant="afrika" size="sm">Get Started</Button>
          </Link>
        </div>

        {/* Mobile Toggle */}
        <button
          className="lg:hidden p-2"
          onClick={() => setMobileOpen(!mobileOpen)}
          aria-label="Toggle menu"
        >
          {mobileOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
        </button>
      </div>

      {/* Mobile Menu */}
      {mobileOpen && (
        <div className="lg:hidden border-t border-border bg-card">
          <div className="px-4 py-4 space-y-2">
            {navLinks.map((link) => (
              <Link
                key={link.label}
                to={link.href}
                className="block px-3 py-2.5 text-sm font-medium rounded-md hover:bg-secondary"
                onClick={() => setMobileOpen(false)}
              >
                {link.label}
              </Link>
            ))}
            <Link
              to="/publeesh"
              className={`block px-3 py-2.5 text-sm font-medium rounded-md ${
                isPubleesh ? "text-afrika-orange bg-afrika-orange-light" : "hover:bg-secondary"
              }`}
              onClick={() => setMobileOpen(false)}
            >
              Publeesh
            </Link>
            <div className="pt-3 space-y-2 border-t border-border">
              <Link to="/auth/login" onClick={() => setMobileOpen(false)}>
                <Button variant="outline" className="w-full">Login</Button>
              </Link>
              <Link to="/auth/signup?intent=publeesh" onClick={() => setMobileOpen(false)}>
                <Button variant="afrika" className="w-full">Get Started</Button>
              </Link>
            </div>
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
