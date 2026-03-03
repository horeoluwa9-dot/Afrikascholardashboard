import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { CheckCircle2, ArrowRight } from "lucide-react";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";

const plans = [
  {
    name: "Individual Basic",
    price: "₦10,000",
    period: "/ month",
    yearly: "₦60,000 yearly (Save ₦60,000)",
    totalCredits: "Total Monthly Credits: 20",
    creditBreakdown: ["5 Paper", "5 Dataset", "10 Analysis"],
    features: [
      "Limited Intelligence",
      "Limited Journal Recommender",
      "Word Export",
      "Library",
      "Community",
    ],
    cta: "Start 3-Day Pro Trial",
    ctaLink: "/auth/signup?plan=basic",
    variant: "afrikaOutline" as const,
    popular: false,
    border: "border-border",
  },
  {
    name: "Individual Pro",
    price: "₦25,000",
    period: "/ month",
    yearly: "₦250,000 yearly (Save ₦50,000)",
    totalCredits: "Total Monthly Credits: 85+",
    creditBreakdown: ["25+ Paper", "25 Dataset", "35 Analysis"],
    features: [
      "Full Intelligence Hub",
      "Full Journal Recommender",
      "Conference Alerts",
      "Stakeholder Mapping",
      "Research Gap Signals",
      "Research App Builder",
      "Unlimited Word Export",
    ],
    cta: "Start 3-Day Pro Trial",
    ctaLink: "/auth/signup?plan=pro",
    variant: "afrika" as const,
    popular: true,
    border: "border-afrika-orange border-2",
  },
  {
    name: "Enterprise",
    price: "₦500,000 –",
    priceSecond: "₦1,000,000",
    period: "/ month",
    yearly: "Custom pricing",
    totalCredits: "Total Monthly Credits: Unlimited",
    creditBreakdown: ["Unlimited Paper", "Unlimited Dataset", "Unlimited Analysis"],
    features: [
      "Seat Management",
      "Usage Analytics",
      "Publication Tracking",
      "Journal Heat Mapping",
      "Funding Signals",
      "Shared Dataset Vault",
      "Guardrails",
      "Accreditation Reports",
      "Branding",
      "Priority Support",
    ],
    cta: "Request Enterprise Access",
    ctaLink: "/publeesh/institutional-demo",
    variant: "afrikaBlue" as const,
    popular: false,
    border: "border-border",
  },
];

const creditPacks = [
  { name: "+5 Paper Credits", price: "₦7,500" },
  { name: "+10 Dataset Credits", price: "₦5,000" },
  { name: "+5 Analysis Credits", price: "₦6,000" },
];

const PricingPage = () => {
  return (
    <div className="min-h-screen">
      <Navbar />

      {/* Header */}
      <section className="afrika-gradient-bg py-16 text-center">
        <h1 className="text-3xl md:text-4xl font-bold text-primary-foreground heading-serif">Publeesh Pricing</h1>
        <p className="mt-3 text-sm text-primary-foreground/70 max-w-md mx-auto">
          Choose the plan that fits your research needs. Start with a 3-day Pro trial.
        </p>
      </section>

      {/* Plans */}
      <section className="py-16 bg-background">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-3 gap-6 max-w-5xl mx-auto">
            {plans.map((plan) => (
              <div key={plan.name} className={`bg-card rounded-2xl p-7 ${plan.border} relative card-hover`}>
                {plan.popular && (
                  <span className="absolute -top-3 left-1/2 -translate-x-1/2 px-4 py-1 rounded-full bg-afrika-orange text-accent-foreground text-xs font-bold">
                    MOST POPULAR
                  </span>
                )}
                <h3 className="font-bold text-lg text-primary">{plan.name}</h3>
                <div className="mt-3">
                  <span className="text-2xl font-bold text-afrika-orange">{plan.price}</span>
                  {plan.priceSecond && (
                    <>
                      <br />
                      <span className="text-2xl font-bold text-afrika-orange">{plan.priceSecond}</span>
                    </>
                  )}
                  <span className="text-sm text-muted-foreground ml-1">{plan.period}</span>
                </div>
                <p className="text-xs text-muted-foreground mt-1">{plan.yearly}</p>

                <div className="mt-4 p-3 bg-secondary rounded-lg">
                  <p className="text-sm font-bold text-primary">{plan.totalCredits}</p>
                  <ul className="mt-2 space-y-1">
                    {plan.creditBreakdown.map((c) => (
                      <li key={c} className="text-xs text-muted-foreground">• {c}</li>
                    ))}
                  </ul>
                </div>

                <ul className="mt-5 space-y-2">
                  {plan.features.map((f) => (
                    <li key={f} className="flex items-center gap-2 text-sm">
                      <CheckCircle2 className="h-4 w-4 text-afrika-orange shrink-0" />
                      {f}
                    </li>
                  ))}
                </ul>

                <Link to={plan.ctaLink} className="mt-6 block">
                  <Button variant={plan.variant} className="w-full">
                    {plan.cta} <ArrowRight className="h-3 w-3" />
                  </Button>
                </Link>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Credit Packs */}
      <section className="py-16 section-alt">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-2xl font-bold text-primary">Credit Packs (Add-Ons)</h2>
          <div className="mt-8 grid grid-cols-3 gap-4 max-w-lg mx-auto">
            {creditPacks.map((pack) => (
              <div key={pack.name} className="bg-card rounded-xl p-5 border border-border card-hover text-center">
                <p className="text-sm font-semibold text-primary">{pack.name}</p>
                <p className="text-lg font-bold text-afrika-orange mt-2">{pack.price}</p>
                <Link to="/auth/login" className="mt-3 block">
                  <Button variant="afrikaOutline" size="sm" className="w-full text-xs">Purchase</Button>
                </Link>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-16 bg-background text-center">
        <h2 className="text-3xl font-bold text-primary">Ready to Elevate Your Research?</h2>
        <p className="mt-3 text-muted-foreground">Start your 3-day Pro trial today — no credit card required.</p>
        <div className="mt-6 flex justify-center gap-4">
          <Link to="/auth/signup?intent=trial">
            <Button variant="afrika" size="xl">Compare Plans <ArrowRight className="h-4 w-4" /></Button>
          </Link>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default PricingPage;
