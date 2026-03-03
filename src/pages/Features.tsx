import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";

const Features = () => (
  <div className="min-h-screen">
    <Navbar />
    <section className="afrika-gradient-bg py-16 text-center">
      <h1 className="text-3xl font-bold text-primary-foreground">Publeesh Features</h1>
      <p className="text-sm text-primary-foreground/70 mt-2">Explore the full suite of research intelligence tools.</p>
    </section>
    <section className="py-20 container mx-auto px-4 text-center">
      <p className="text-muted-foreground">Detailed feature pages coming soon.</p>
    </section>
    <Footer />
  </div>
);

export default Features;
