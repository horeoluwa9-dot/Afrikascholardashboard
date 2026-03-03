import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import {
  FileText, BookOpen, Quote, Globe, BarChart3, Shield,
  Database, TrendingUp, Users, GraduationCap, Building2,
  Lightbulb, CheckCircle2, XCircle, ArrowRight, ChevronDown,
  Layers, PenTool, Search, Download, FlaskConical, Brain, 
  Microscope, FileCheck, Target, Workflow
} from "lucide-react";
import { Button } from "@/components/ui/button";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

const fadeIn = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5 } },
};

const stagger = {
  visible: { transition: { staggerChildren: 0.1 } },
};

// ─── HERO ───
const HeroSection = () => (
  <section className="afrika-gradient-bg relative overflow-hidden py-20 lg:py-28">
    <div className="container mx-auto px-4 lg:px-8">
      <div className="grid lg:grid-cols-2 gap-12 items-center">
        <motion.div initial="hidden" animate="visible" variants={stagger}>
          <motion.span variants={fadeIn} className="trust-badge mb-4 inline-block">PUBLEESH</motion.span>
          <motion.h1 variants={fadeIn} className="text-3xl md:text-4xl lg:text-5xl font-bold text-primary-foreground leading-tight">
            AI-Powered Research Intelligence
            <br />
            <span className="text-afrika-orange">by Afrika Scholar</span>
          </motion.h1>
          <motion.p variants={fadeIn} className="mt-5 text-sm md:text-base text-primary-foreground/75 leading-relaxed max-w-xl">
            Publeesh is Afrika Scholar's AI-powered research intelligence platform — built to support scholars, researchers, students, and institutions with structured research workflows, global dataset access, and responsible AI-assisted drafting tools.
          </motion.p>
          <motion.div variants={fadeIn} className="mt-8 flex flex-wrap gap-3">
            <Link to="/auth/signup?intent=trial">
              <Button variant="afrika" size="xl">
                Start Publeesh <ArrowRight className="h-4 w-4" />
              </Button>
            </Link>
            <Link to="/publeesh/pricing">
              <Button variant="afrikaOutline" size="xl" className="border-primary-foreground text-primary-foreground hover:bg-primary-foreground hover:text-primary">
                View Pricing
              </Button>
            </Link>
          </motion.div>
          <motion.p variants={fadeIn} className="mt-4 text-xs text-primary-foreground/50">
            Designed for serious academic work — not automated substitution.
          </motion.p>
        </motion.div>

        {/* Floating Icons */}
        <div className="hidden lg:block relative h-80">
          <div className="floating-icon top-4 left-8 animate-float"><FileText className="h-6 w-6 text-afrika-orange" /></div>
          <div className="floating-icon top-12 right-12 animate-float-delayed"><Database className="h-6 w-6 text-afrika-blue" /></div>
          <div className="floating-icon top-40 left-20 animate-float-delayed"><BarChart3 className="h-6 w-6 text-afrika-green" /></div>
          <div className="floating-icon bottom-8 right-8 animate-float"><Globe className="h-6 w-6 text-afrika-orange" /></div>
          <div className="floating-icon bottom-20 left-4 animate-float"><BookOpen className="h-6 w-6 text-afrika-blue" /></div>
          <div className="floating-icon top-2 left-1/2 animate-float-delayed"><Brain className="h-6 w-6 text-afrika-green" /></div>
        </div>
      </div>
    </div>
  </section>
);

// ─── WHAT IS PUBLEESH ───
const featureIcons = [
  { icon: PenTool, label: "Structured Drafting Assistance", anchor: "drafting" },
  { icon: BookOpen, label: "Literature Review Organization", anchor: "literature" },
  { icon: Quote, label: "Citation Guidance & Formatting", anchor: "citation" },
  { icon: Globe, label: "Global Institutional Dataset Access", anchor: "datasets" },
  { icon: BarChart3, label: "Comparative Research Intelligence", anchor: "comparative" },
  { icon: Shield, label: "Research Integrity & Responsible AI", anchor: "integrity" },
];

const WhatIsSection = () => (
  <section className="py-20 bg-background">
    <div className="container mx-auto px-4 text-center">
      <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={stagger}>
        <motion.h2 variants={fadeIn} className="text-3xl md:text-4xl font-bold text-primary">
          What is Publeesh?
        </motion.h2>
        <motion.p variants={fadeIn} className="mt-4 text-muted-foreground max-w-2xl mx-auto text-sm md:text-base">
          A structured research enablement system integrated within Afrika Scholar — built to support serious academic workflows, not replace independent scholarship.
        </motion.p>
        <motion.div variants={fadeIn} className="mt-12 grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
          {featureIcons.map((f) => (
            <Link
              key={f.anchor}
              to={`/publeesh/features#${f.anchor}`}
              className="group flex flex-col items-center gap-3 p-5 rounded-xl border border-border hover:border-afrika-orange transition-all card-hover bg-card"
            >
              <div className="h-12 w-12 rounded-full bg-afrika-orange-light flex items-center justify-center group-hover:bg-afrika-orange transition-colors">
                <f.icon className="h-5 w-5 text-afrika-orange group-hover:text-accent-foreground transition-colors" />
              </div>
              <span className="text-xs font-medium text-center leading-tight">{f.label}</span>
            </Link>
          ))}
        </motion.div>
      </motion.div>
    </div>
  </section>
);

// ─── FEATURE DETAIL BLOCKS ───
const FeatureDetailSection = () => (
  <section className="py-20 section-alt">
    <div className="container mx-auto px-4">
      <div className="grid md:grid-cols-3 gap-6">
        {/* A */}
        <div className="bg-card rounded-2xl p-7 border border-border card-hover">
          <span className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">Research Drafting</span>
          <h3 className="text-lg font-bold text-primary mt-2">Structured Research Drafting Support</h3>
          <p className="text-sm text-muted-foreground mt-2">Write smarter, think clearly, structure better, and refine faster.</p>
          <ul className="mt-4 space-y-2 text-sm text-foreground">
            {["Structured outlines", "Thesis & dissertation frameworks", "Literature review structures", "Methodology templates", "Research question refinement", "Hypothesis structuring", "Section planning assistance"].map((item) => (
              <li key={item} className="flex items-start gap-2"><CheckCircle2 className="h-4 w-4 text-afrika-orange shrink-0 mt-0.5" />{item}</li>
            ))}
          </ul>
          <Link to="/auth/signup?tool=drafting" className="mt-6 block">
            <Button variant="afrika" size="sm" className="w-full">Try Drafting <ArrowRight className="h-3 w-3" /></Button>
          </Link>
        </div>

        {/* B */}
        <div className="bg-card rounded-2xl p-7 border border-border card-hover">
          <span className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">Literature & Referencing</span>
          <h3 className="text-lg font-bold text-primary mt-2">Literature & Referencing Enhancement</h3>
          <p className="text-sm text-muted-foreground mt-2">Strengthen academic credibility with properly structured referencing.</p>
          <ul className="mt-4 space-y-2 text-sm text-foreground">
            {["Citation formatting (APA/MLA/Chicago/Harvard)", "Bibliography builder", "Reference organization", "Source comparison", "DOI parsing", "Reference error-checking tools", "Source comparison insights"].map((item) => (
              <li key={item} className="flex items-start gap-2"><CheckCircle2 className="h-4 w-4 text-afrika-orange shrink-0 mt-0.5" />{item}</li>
            ))}
          </ul>
          <Link to="/auth/signup?tool=citations" className="mt-6 block">
            <Button variant="afrika" size="sm" className="w-full">Try Citation Tools <ArrowRight className="h-3 w-3" /></Button>
          </Link>
        </div>

        {/* C */}
        <div className="bg-card rounded-2xl p-7 border border-border card-hover">
          <span className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">Global Intelligence</span>
          <h3 className="text-lg font-bold text-primary mt-2">Global Research Data Access</h3>
          <p className="text-sm text-muted-foreground mt-2">Access datasets from leading global institutions.</p>
          <div className="mt-3 flex flex-wrap gap-2">
            {["WHO", "World Bank", "IMF", "UNESCO", "OECD", "FAO"].map((org) => (
              <span key={org} className="px-2.5 py-1 rounded-full text-xs font-semibold bg-secondary text-secondary-foreground">{org}</span>
            ))}
          </div>
          <p className="mt-3 text-xs font-semibold text-muted-foreground uppercase tracking-wide">Comparative Data Access:</p>
          <ul className="mt-2 space-y-2 text-sm text-foreground">
            {["Country filtering", "Indicator selection", "Time-range filtering", "Structured retrieval", "Public health & climate change", "Infrastructure & agriculture", "Development indicators"].map((item) => (
              <li key={item} className="flex items-start gap-2"><CheckCircle2 className="h-4 w-4 text-afrika-orange shrink-0 mt-0.5" />{item}</li>
            ))}
          </ul>
          <Link to="/auth/signup?tool=datasets" className="mt-6 block">
            <Button variant="afrika" size="sm" className="w-full">Explore Datasets <ArrowRight className="h-3 w-3" /></Button>
          </Link>
        </div>
      </div>

      <div className="mt-10 text-center">
        <p className="text-sm text-muted-foreground mb-4">
          Publeesh transforms the research process — from a writing assistant into a global research intelligence platform.
        </p>
        <Link to="/publeesh/features">
          <Button variant="afrika" size="lg">Explore Research Intelligence <ArrowRight className="h-4 w-4" /></Button>
        </Link>
      </div>
    </div>
  </section>
);

// ─── FITS INTO AFRIKA SCHOLAR ───
const FitsIntoSection = () => (
  <section className="py-20 bg-background">
    <div className="container mx-auto px-4">
      <div className="text-center mb-12">
        <span className="text-xs font-bold uppercase tracking-widest text-afrika-orange">How Publeesh Fits Into Afrika Scholar</span>
        <h2 className="text-2xl md:text-3xl font-bold text-primary mt-3">
          Pan-African Academic Publishing, Research &<br className="hidden md:block" /> University Enablement Infrastructure
        </h2>
        <p className="mt-3 text-sm text-muted-foreground max-w-xl mx-auto">
          with AI-Powered Research Intelligence. Publishing remains the primary pillar — Publeesh strengthens it.
        </p>
      </div>

      <div className="grid md:grid-cols-2 gap-6 max-w-4xl mx-auto">
        <div className="bg-card rounded-2xl p-7 border border-border card-hover">
          <div className="flex items-center gap-2 mb-4">
            <div className="h-8 w-8 rounded-full bg-afrika-orange-light flex items-center justify-center">
              <CheckCircle2 className="h-4 w-4 text-afrika-orange" />
            </div>
            <h3 className="font-bold text-primary">Publeesh Strengthens Publishing</h3>
          </div>
          <p className="text-xs text-muted-foreground mb-4">It enhances scholarship — it does not replace it.</p>
          <ul className="space-y-2 text-sm">
            {[
              "Improving manuscript quality before submission",
              "Supporting clearer structuring and argumentation",
              "Producing data-backed research sections",
              "Increasing peer-review readiness",
              "Lifting composition and cross-country scholarship",
            ].map((item) => (
              <li key={item} className="flex items-start gap-2"><CheckCircle2 className="h-4 w-4 text-afrika-orange shrink-0 mt-0.5" />{item}</li>
            ))}
          </ul>
        </div>

        <div className="bg-card rounded-2xl p-7 border border-border card-hover">
          <div className="flex items-center gap-2 mb-4">
            <div className="h-8 w-8 rounded-full bg-afrika-orange-light flex items-center justify-center">
              <Users className="h-4 w-4 text-afrika-orange" />
            </div>
            <h3 className="font-bold text-primary">Who Publeesh Is For</h3>
          </div>
          <p className="text-xs text-muted-foreground mb-4">Designed for every stage of academic research.</p>
          <ul className="space-y-2.5 text-sm">
            {[
              { bold: "Students", text: "preparing research papers, dissertations, and theses" },
              { bold: "Academics", text: "developing manuscripts for publication" },
              { bold: "Researchers", text: "conducting comparative policy and data studies" },
              { bold: "Institutions", text: "seeking research productivity tools" },
              { bold: "Professionals", text: "standardizing practice-to-data, confident research output" },
            ].map((item) => (
              <li key={item.bold} className="flex items-start gap-2">
                <div className="h-1.5 w-1.5 rounded-full bg-afrika-orange mt-2 shrink-0" />
                <span><strong>{item.bold}:</strong> {item.text}</span>
              </li>
            ))}
          </ul>
          <Link to="/publeesh/features" className="mt-6 block">
            <Button variant="afrikaOutline" size="sm">Explore Research Intelligence <ArrowRight className="h-3 w-3" /></Button>
          </Link>
        </div>
      </div>
    </div>
  </section>
);

// ─── INTEGRITY ───
const IntegritySection = () => (
  <section className="py-16 section-alt">
    <div className="container mx-auto px-4 max-w-4xl">
      <div className="bg-card rounded-2xl p-8 border border-border shadow-sm">
        <div className="flex items-center gap-3 mb-4">
          <div className="h-10 w-10 rounded-full bg-afrika-orange-light flex items-center justify-center">
            <Shield className="h-5 w-5 text-afrika-orange" />
          </div>
          <h3 className="text-xl font-bold text-primary">Academic Integrity & Responsible Use</h3>
        </div>
        <p className="text-sm text-muted-foreground mb-6">
          Publeesh is designed as a research-support system. Users are responsible for ensuring compliance with university academic integrity
          policies, journal submission standards, and ethical research guidelines.
        </p>
        <div className="grid md:grid-cols-2 gap-8">
          <div>
            <h4 className="font-semibold text-sm mb-3 text-primary">Publeesh does not:</h4>
            <ul className="space-y-2 text-sm">
              {["Replace independent scholarship", "Guarantee publication", "Substitute peer review", "Bypass institutional supervision"].map((item) => (
                <li key={item} className="flex items-center gap-2"><XCircle className="h-4 w-4 text-destructive shrink-0" />{item}</li>
              ))}
            </ul>
          </div>
          <div>
            <h4 className="font-semibold text-sm mb-3 text-primary">Users must comply with:</h4>
            <ul className="space-y-2 text-sm">
              {["University academic integrity policies", "Journal submission standards", "Ethical research guidelines", "Proper AI disclosure rules"].map((item) => (
                <li key={item} className="flex items-center gap-2"><CheckCircle2 className="h-4 w-4 text-afrika-green shrink-0" />{item}</li>
              ))}
            </ul>
          </div>
        </div>
        <Link to="/compliance/responsible-ai" className="mt-6 inline-block">
          <Button variant="outline" size="sm">
            Read Full Academic Integrity Policy <ArrowRight className="h-3 w-3" />
          </Button>
        </Link>
      </div>
    </div>
  </section>
);

// ─── STATS ───
const stats = [
  { value: "50+", label: "Active Research Tools" },
  { value: "2,000+", label: "Published Articles" },
  { value: "500+", label: "Academic Partners" },
  { value: "35+", label: "Active Countries" },
];

const StatsStrip = () => (
  <section className="afrika-gradient-bg py-14">
    <div className="container mx-auto px-4">
      <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
        {stats.map((s) => (
          <motion.div key={s.label} initial={{ opacity: 0, scale: 0.8 }} whileInView={{ opacity: 1, scale: 1 }} viewport={{ once: true }}>
            <div className="text-3xl md:text-4xl font-bold text-afrika-orange">{s.value}</div>
            <div className="text-sm text-primary-foreground/70 mt-1">{s.label}</div>
          </motion.div>
        ))}
      </div>
    </div>
  </section>
);

// ─── HOW IT WORKS ───
const steps = [
  "Create or log in to your Afrika Scholar account",
  "Activate subscription or trial",
  "Start a Research Project Workspace",
  "Generate structured drafts & retrieve global datasets",
  "Export structured documents for refinement and submission",
];

const HowItWorksSection = () => (
  <section className="py-20 afrika-gradient-bg-light">
    <div className="container mx-auto px-4">
      <div className="text-center mb-12">
        <h2 className="text-3xl font-bold text-primary-foreground">How It Works</h2>
      </div>

      {/* Timeline */}
      <div className="flex flex-wrap justify-center gap-4 mb-16 max-w-4xl mx-auto">
        {steps.map((step, i) => (
          <div key={i} className="flex items-start gap-3 w-full md:w-auto md:flex-col md:items-center md:text-center md:max-w-[160px]">
            <div className="h-8 w-8 rounded-full bg-afrika-orange flex items-center justify-center text-accent-foreground text-sm font-bold shrink-0">
              {i + 1}
            </div>
            <p className="text-xs text-primary-foreground/80 leading-relaxed">{step}</p>
          </div>
        ))}
      </div>

      {/* Feature cards */}
      <div className="grid md:grid-cols-2 gap-6 max-w-4xl mx-auto">
        <div className="bg-card rounded-2xl p-7 border border-border">
          <h3 className="font-bold text-primary mb-4">Publeesh Dashboard Features</h3>
          <p className="text-xs text-muted-foreground mb-4">Designed for structured workflows, not shortcuts.</p>
          <ul className="space-y-2 text-sm">
            {["Project Workspace Management", "Structured Outline Generator", "Literature Review Assistant", "Citation Formatter", "Global Dataset Explorer", "Comparative Analysis Builder", "Export (Word/PDF)", "Integrity Reminders"].map((item) => (
              <li key={item} className="flex items-center gap-2"><CheckCircle2 className="h-3.5 w-3.5 text-afrika-orange" />{item}</li>
            ))}
          </ul>
        </div>
        <div className="bg-card rounded-2xl p-7 border border-border">
          <h3 className="font-bold text-primary mb-4">Subscription Access</h3>
          <p className="text-xs text-muted-foreground mb-4">Research Intelligence access is available through subscription plans.</p>
          <ul className="space-y-2 text-sm">
            {["Drafting & Structuring tools", "Global Dataset Access", "Automated Comparative Intelligence", "Institutional Licensing Options"].map((item) => (
              <li key={item} className="flex items-center gap-2"><CheckCircle2 className="h-3.5 w-3.5 text-afrika-green" />{item}</li>
            ))}
          </ul>
          <Link to="/publeesh/pricing" className="mt-6 block">
            <Button variant="afrika" className="w-full">View Subscription Plans <ArrowRight className="h-3 w-3" /></Button>
          </Link>
        </div>
      </div>
    </div>
  </section>
);

// ─── CREDITS ───
const creditTypes = [
  { name: "Paper Generation", credit: "1 Paper Credit", desc: "Generates structured outlines, sections, and drafting templates.", color: "bg-afrika-orange", icon: FileText },
  { name: "Dataset Generation", credit: "1 Dataset Credit", desc: "Retrieves structured datasets by source, country, and indicator.", color: "bg-afrika-blue", icon: Database },
  { name: "Dataset Analysis", credit: "1 Analysis Credit", desc: "Creates charts, comparisons, and analytical summaries.", color: "bg-afrika-green", icon: BarChart3 },
];

const CreditsSection = () => (
  <section className="py-20 bg-background">
    <div className="container mx-auto px-4 text-center">
      <h2 className="text-3xl font-bold text-primary">How Credits Work</h2>
      <p className="mt-3 text-sm text-muted-foreground max-w-lg mx-auto">
        Each action in Publeesh consumes a specific credit type from your monthly allocation.
      </p>
      <div className="mt-10 grid md:grid-cols-3 gap-6 max-w-3xl mx-auto">
        {creditTypes.map((c) => (
          <div key={c.name} className="bg-card rounded-2xl p-6 border border-border card-hover text-center">
            <div className={`h-12 w-12 rounded-full ${c.color} mx-auto flex items-center justify-center`}>
              <c.icon className="h-5 w-5 text-accent-foreground" />
            </div>
            <h4 className="font-bold mt-4 text-primary">{c.name}</h4>
            <p className="text-sm text-afrika-orange font-semibold mt-1">{c.credit}</p>
            <p className="text-xs text-muted-foreground mt-2">{c.desc}</p>
            <div className={`mt-4 h-1 rounded-full ${c.color}`} />
          </div>
        ))}
      </div>
      <p className="mt-6 text-xs text-muted-foreground">
        Credits reset monthly based on your plan. Additional credits can be purchased.
      </p>
      <div className="mt-6 flex justify-center gap-3">
        <Link to="/publeesh/pricing">
          <Button variant="afrikaOutline" size="lg">Compare Plans <ArrowRight className="h-4 w-4" /></Button>
        </Link>
        <Link to="/auth/signup?intent=trial">
          <Button variant="link" className="text-afrika-orange">Start Free Trial <ArrowRight className="h-4 w-4" /></Button>
        </Link>
      </div>
    </div>
  </section>
);

// ─── PRICING PREVIEW ───
const PricingPreviewSection = () => (
  <section className="py-20 section-alt">
    <div className="container mx-auto px-4 text-center">
      <h2 className="text-3xl font-bold text-primary">Simple Plans for Individuals & Institutions</h2>
      <div className="mt-10 grid md:grid-cols-3 gap-6 max-w-4xl mx-auto">
        <div className="bg-card rounded-2xl p-7 border border-border card-hover text-left">
          <h3 className="font-bold text-lg text-primary">Starter</h3>
          <p className="text-sm text-muted-foreground mt-2">Drafting access & limited datasets.</p>
          <Link to="/auth/signup?intent=trial" className="mt-6 block">
            <Button variant="afrikaOutline" size="sm" className="w-full">Start Trial <ArrowRight className="h-3 w-3" /></Button>
          </Link>
        </div>
        <div className="bg-card rounded-2xl p-7 border-2 border-afrika-orange card-hover text-left relative">
          <span className="absolute -top-3 left-1/2 -translate-x-1/2 px-3 py-0.5 rounded-full bg-afrika-orange text-accent-foreground text-xs font-bold">POPULAR</span>
          <h3 className="font-bold text-lg text-primary">Researcher</h3>
          <p className="text-sm text-muted-foreground mt-2">Full drafting, dataset access & analysis tools.</p>
          <Link to="/publeesh/pricing" className="mt-6 block">
            <Button variant="afrika" size="sm" className="w-full">Choose Plan <ArrowRight className="h-3 w-3" /></Button>
          </Link>
        </div>
        <div className="bg-card rounded-2xl p-7 border border-border card-hover text-left">
          <h3 className="font-bold text-lg text-primary">Institutional</h3>
          <p className="text-sm text-muted-foreground mt-2">Pooled credits, admin dashboard & multiple seats.</p>
          <Link to="/publeesh/institutional-demo" className="mt-6 block">
            <Button variant="afrikaOutline" size="sm" className="w-full">Request Demo <ArrowRight className="h-3 w-3" /></Button>
          </Link>
        </div>
      </div>
      <Link to="/publeesh/pricing" className="mt-6 inline-block text-sm text-afrika-orange font-semibold hover:underline">
        See full pricing →
      </Link>
    </div>
  </section>
);

// ─── TESTIMONIALS ───
const testimonials = [
  { name: "Dr. Amina Okafor", role: "Senior Lecturer, University of Lagos", text: "Publeesh helped me structure my comparative policy analysis across 12 African nations. The dataset retrieval alone saved weeks of manual work." },
  { name: "Kwame Mensah", role: "PhD Candidate, University of Ghana", text: "The structured drafting tools transformed how I approach my dissertation chapters. It doesn't write for me — it helps me think more clearly." },
  { name: "Prof. Fatima El-Amin", role: "Research Director, Khartoum Institute", text: "Our department adopted Publeesh for all postgraduate researchers. The integrity guardrails give us confidence in responsible AI use." },
];

const TestimonialsSection = () => (
  <section className="py-20 bg-background">
    <div className="container mx-auto px-4">
      <div className="grid md:grid-cols-2 gap-12 items-start max-w-5xl mx-auto">
        <div>
          <h2 className="text-3xl font-bold text-primary">Trusted for Serious Academic Work</h2>
          <ul className="mt-6 space-y-3">
            {[
              "Responsible AI aligned with academic standards",
              "Structured workflows — not shortcuts",
              "Designed for research rigor",
              "Built for Africa, useful globally",
            ].map((item) => (
              <li key={item} className="flex items-center gap-2 text-sm"><CheckCircle2 className="h-4 w-4 text-afrika-orange" />{item}</li>
            ))}
          </ul>
          <Link to="/publeesh/features" className="mt-6 inline-block">
            <Button variant="afrika">Explore Research Intelligence <ArrowRight className="h-4 w-4" /></Button>
          </Link>
        </div>
        <div className="space-y-4">
          {testimonials.map((t) => (
            <div key={t.name} className="bg-card rounded-xl p-5 border border-border card-hover">
              <p className="text-sm text-foreground italic">"{t.text}"</p>
              <div className="mt-3">
                <p className="text-sm font-semibold text-primary">{t.name}</p>
                <p className="text-xs text-muted-foreground">{t.role}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  </section>
);

// ─── FAQ ───
const faqItems = [
  { q: "Is Publeesh a replacement for writing?", a: "No. Publeesh is a research support tool that helps structure, organize, and enhance your academic work. It does not write papers for you or replace independent scholarship." },
  { q: "Does it guarantee publication?", a: "No. Publeesh improves research quality and structure, but publication decisions rest with journal editors, peer reviewers, and institutional standards." },
  { q: "How are credits calculated?", a: "Credits are allocated monthly based on your plan. Each paper generation uses 1 Paper Credit, each dataset retrieval uses 1 Dataset Credit, and each analysis uses 1 Analysis Credit." },
  { q: "What datasets are supported?", a: "Publeesh provides access to structured datasets from WHO, World Bank, IMF, UNESCO, OECD, FAO, and other global institutions, with country-level filtering and time-range selection." },
  { q: "Can institutions buy licenses?", a: "Yes. Institutional licensing includes pooled credits, admin dashboards, usage analytics, and multi-seat access. Contact us for custom pricing." },
  { q: "What happens when credits run out?", a: "You can purchase additional credit packs or upgrade your plan. Core features remain accessible, but generation and retrieval tools require credits." },
  { q: "Is AI disclosure required?", a: "Yes. Users should follow their institution's AI disclosure policies. Publeesh provides transparency tools to help document AI-assisted portions of research." },
  { q: "Can it be used for dissertations?", a: "Absolutely. Publeesh is designed to support thesis and dissertation workflows including literature reviews, methodology structuring, and citation management." },
  { q: "How do exports work?", a: "Completed drafts, outlines, and analyses can be exported in Word (.docx) or PDF format, ready for submission or further editing." },
  { q: "How does Publeesh support integrity?", a: "Through structured workflows, integrity reminders, responsible AI guardrails, and clear distinction between AI-assisted structuring and independent scholarship." },
];

const FAQSection = () => (
  <section className="py-20 section-alt">
    <div className="container mx-auto px-4 max-w-3xl">
      <h2 className="text-3xl font-bold text-primary text-center mb-10">Frequently Asked Questions</h2>
      <Accordion type="single" collapsible className="space-y-2">
        {faqItems.map((item, i) => (
          <AccordionItem key={i} value={`faq-${i}`} className="bg-card rounded-xl border border-border px-5">
            <AccordionTrigger className="text-sm font-semibold text-primary hover:text-afrika-orange">{item.q}</AccordionTrigger>
            <AccordionContent className="text-sm text-muted-foreground">{item.a}</AccordionContent>
          </AccordionItem>
        ))}
      </Accordion>
      <div className="mt-8 text-center">
        <Link to="/publeesh/pricing">
          <Button variant="afrikaOutline" size="lg">View Pricing <ArrowRight className="h-4 w-4" /></Button>
        </Link>
      </div>
    </div>
  </section>
);

// ─── FINAL CTA ───
const FinalCTASection = () => (
  <section className="afrika-gradient-bg py-16">
    <div className="container mx-auto px-4 text-center">
      <h2 className="text-3xl md:text-4xl font-bold text-primary-foreground">Ready to Elevate Your Research?</h2>
      <p className="mt-4 text-primary-foreground/70">Start your 3-day Pro trial today — no credit card required.</p>
      <div className="mt-8 flex flex-wrap justify-center gap-4">
        <Link to="/auth/signup?intent=trial">
          <Button variant="afrika" size="xl">Start Free Trial <ArrowRight className="h-4 w-4" /></Button>
        </Link>
        <Link to="/publeesh/institutional-demo">
          <Button variant="afrikaWhite" size="xl">Request Institutional Demo</Button>
        </Link>
      </div>
    </div>
  </section>
);

// ─── WHY PUBLEESH MATTERS ───
const WhyPubleeshMatters = () => (
  <section className="py-20 afrika-gradient-bg">
    <div className="container mx-auto px-4">
      <div className="text-center mb-10">
        <h2 className="text-3xl font-bold text-primary-foreground">Why Publeesh Matters</h2>
        <p className="mt-2 text-primary-foreground/70 text-sm">Without compromising academic integrity.</p>
      </div>
      <div className="grid md:grid-cols-2 gap-6 max-w-4xl mx-auto">
        <div className="bg-primary-foreground/10 backdrop-blur rounded-2xl p-7 border border-primary-foreground/10">
          <h3 className="font-bold text-primary-foreground mb-4">Afrika Scholar Offers You</h3>
          <ul className="space-y-2 text-sm text-primary-foreground/80">
            {[
              "Unified access for structured research tools",
              "Ethically responsible AI-assisted workflows",
              "Recognized research enablement platform",
              "Pan-African scholarships, and dissemination",
            ].map((item) => (
              <li key={item} className="flex items-start gap-2"><CheckCircle2 className="h-4 w-4 text-primary-foreground/60 shrink-0 mt-0.5" />{item}</li>
            ))}
          </ul>
        </div>
        <div className="bg-afrika-orange rounded-2xl p-7">
          <h3 className="font-bold text-accent-foreground mb-4">Publeesh Empowers Scholars To</h3>
          <ul className="space-y-2 text-sm text-accent-foreground/90">
            {[
              "Work smarter with AI-supported (not automated) workflows",
              "Structure better through guided drafting and outlining",
              "Cite responsibly with multi-format referencing tools",
              "Compare globally using institutional datasets",
              "Publish confidently with integrity and structure, not shortcuts",
            ].map((item) => (
              <li key={item} className="flex items-start gap-2"><CheckCircle2 className="h-4 w-4 text-accent-foreground/80 shrink-0 mt-0.5" />{item}</li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  </section>
);

// ─── FUTURE OF RESEARCH ───
const futureCards = [
  { icon: Layers, title: "Institutional Research Dashboards", desc: "University-level dashboards for tracking research output, productivity, and publication pipelines." },
  { icon: Users, title: "Cross-Institutional Collaboration", desc: "Tools enabling structured academic partnerships and co-authoring coordination across institutions." },
  { icon: TrendingUp, title: "Research Trend Analytics", desc: "Real-time analytics surfacing emerging research areas, citation trends, and knowledge gaps across Africa." },
  { icon: Target, title: "Impact Tracking Tools", desc: "Measure research visibility, citations, and scholarly reach across global academic platforms." },
  { icon: Brain, title: "AI-Assisted Peer Review Support", desc: "AI-led and structured assistance to improve review quality — not to replace reviewers." },
  { icon: Microscope, title: "Research Supervision Assist", desc: "Modules supporting academic supervisors and postgraduate students through structured research workflows." },
];

const FutureSection = () => (
  <section className="py-20 afrika-gradient-bg-light">
    <div className="container mx-auto px-4">
      <div className="text-center mb-12">
        <span className="text-xs font-bold uppercase tracking-widest text-primary-foreground/60">What's Coming</span>
        <h2 className="text-3xl font-bold text-primary-foreground mt-3">The Future of Research Intelligence in Africa</h2>
        <p className="mt-3 text-sm text-primary-foreground/70 max-w-xl mx-auto">
          As Afrika Scholar expands its publishing infrastructure and institutional partnerships, Publeesh will evolve.
        </p>
      </div>
      <div className="grid md:grid-cols-3 gap-5 max-w-5xl mx-auto">
        {futureCards.map((c) => (
          <div key={c.title} className="bg-card rounded-xl p-6 card-hover">
            <div className="h-10 w-10 rounded-lg bg-afrika-orange-light flex items-center justify-center mb-3">
              <c.icon className="h-5 w-5 text-afrika-orange" />
            </div>
            <h4 className="font-bold text-sm text-primary">{c.title}</h4>
            <p className="text-xs text-muted-foreground mt-2 leading-relaxed">{c.desc}</p>
          </div>
        ))}
      </div>
      <div className="flex flex-wrap justify-center gap-3 mt-10">
        {["Built responsibly", "Built institutionally", "Built for long-term scholarly infrastructure"].map((tag) => (
          <span key={tag} className="px-4 py-2 rounded-full border border-primary-foreground/20 text-xs text-primary-foreground/70 font-medium">{tag}</span>
        ))}
      </div>
    </div>
  </section>
);

// ─── MAIN PAGE ───
const PubleeshLanding = () => {
  return (
    <div className="min-h-screen">
      <Navbar />
      <HeroSection />
      <WhatIsSection />
      <FeatureDetailSection />
      <FitsIntoSection />
      <IntegritySection />
      <StatsStrip />
      <HowItWorksSection />
      <CreditsSection />
      <WhyPubleeshMatters />
      <FutureSection />
      <PricingPreviewSection />
      <TestimonialsSection />
      <FAQSection />
      <FinalCTASection />
      <Footer />
    </div>
  );
};

export default PubleeshLanding;
