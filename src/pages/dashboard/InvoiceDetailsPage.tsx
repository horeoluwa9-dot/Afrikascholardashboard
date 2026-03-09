import { useParams, Link, useNavigate } from "react-router-dom";
import DashboardLayout from "@/components/dashboard/DashboardLayout";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import {
  ArrowLeft, Download, CheckCircle2, Clock, Building2,
  CalendarDays, CreditCard, FileText, Wallet, Printer,
} from "lucide-react";
import { PAYMENTS } from "./EarningsPage";

const fmt = (n: number) =>
  new Intl.NumberFormat("en-NG", { style: "currency", currency: "NGN", maximumFractionDigits: 0 }).format(n);

const InvoiceDetailsPage = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const payment = PAYMENTS.find((p) => p.id === id);

  if (!payment) {
    return (
      <DashboardLayout>
        <div className="max-w-3xl mx-auto space-y-5">
          <Button variant="ghost" size="sm" onClick={() => navigate("/dashboard/earnings")} className="gap-2">
            <ArrowLeft className="h-4 w-4" /> Back to Earnings
          </Button>
          <div className="bg-card rounded-xl border border-border p-16 text-center">
            <FileText className="h-10 w-10 mx-auto text-muted-foreground/40 mb-4" />
            <h2 className="text-lg font-bold text-foreground mb-2">Invoice Not Found</h2>
            <p className="text-sm text-muted-foreground">This invoice does not exist or has been removed.</p>
          </div>
        </div>
      </DashboardLayout>
    );
  }

  const isPaid = payment.status === "Paid";
  const tax = Math.round(payment.amount * 0.075);
  const gross = payment.amount + tax;

  const handleDownload = () => {
    // In production this would call a backend function to generate a PDF.
    // For now, trigger the browser print dialog as a reasonable fallback.
    window.print();
  };

  return (
    <DashboardLayout>
      <div className="max-w-3xl mx-auto space-y-5">
        {/* Back + actions */}
        <div className="flex items-center justify-between">
          <Button variant="ghost" size="sm" onClick={() => navigate("/dashboard/earnings")} className="gap-2">
            <ArrowLeft className="h-4 w-4" /> Back to Earnings
          </Button>
          <div className="flex gap-2">
            <Button variant="outline" size="sm" className="gap-2" onClick={() => window.print()}>
              <Printer className="h-4 w-4" />
              Print
            </Button>
            <Button variant="afrika" size="sm" className="gap-2" onClick={handleDownload}>
              <Download className="h-4 w-4" />
              Download Invoice (PDF)
            </Button>
          </div>
        </div>

        {/* Invoice card */}
        <div className="bg-card rounded-xl border border-border overflow-hidden print:shadow-none" id="invoice-document">

          {/* Invoice header */}
          <div className="bg-primary text-primary-foreground p-7">
            <div className="flex items-start justify-between">
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <Wallet className="h-5 w-5 text-accent" />
                  <span className="text-accent font-bold text-lg">Afrika Scholar</span>
                </div>
                <p className="text-primary-foreground/70 text-sm">Academic Network Earnings</p>
              </div>
              <div className="text-right">
                <p className="text-primary-foreground/60 text-xs uppercase tracking-widest mb-1">Invoice</p>
                <p className="font-mono font-bold text-lg">#{payment.id.toUpperCase()}</p>
                {isPaid ? (
                  <Badge className="bg-accent/20 text-accent-foreground border-accent/30 mt-2">
                    <CheckCircle2 className="h-3 w-3 mr-1" /> Paid
                  </Badge>
                ) : (
                  <Badge className="bg-muted text-muted-foreground border-border mt-2">
                    <Clock className="h-3 w-3 mr-1" /> Pending
                  </Badge>
                )}
              </div>
            </div>
          </div>

          <div className="p-7 space-y-6">
            {/* Project + Institution */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <div className="space-y-1">
                <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Project</p>
                <div className="flex items-start gap-2 mt-2">
                  <FileText className="h-4 w-4 text-accent shrink-0 mt-0.5" />
                  <p className="text-sm font-semibold text-foreground">{payment.project}</p>
                </div>
              </div>
              <div className="space-y-1">
                <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Institution / Client</p>
                <div className="flex items-start gap-2 mt-2">
                  <Building2 className="h-4 w-4 text-accent shrink-0 mt-0.5" />
                  <p className="text-sm font-semibold text-foreground">{payment.institution}</p>
                </div>
              </div>
              <div className="space-y-1">
                <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Payment Method</p>
                <div className="flex items-center gap-2 mt-2">
                  <CreditCard className="h-4 w-4 text-accent" />
                  <p className="text-sm font-semibold text-foreground">{payment.method}</p>
                </div>
              </div>
              <div className="space-y-1">
                <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Payment Date</p>
                <div className="flex items-center gap-2 mt-2">
                  <CalendarDays className="h-4 w-4 text-accent" />
                  <p className="text-sm font-semibold text-foreground">{payment.date}</p>
                </div>
              </div>
            </div>

            <Separator />

            {/* Financial breakdown */}
            <div>
              <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-4">Payment Breakdown</p>
              <div className="bg-secondary/50 rounded-lg overflow-hidden">
                <div className="flex items-center justify-between px-5 py-3 border-b border-border">
                  <span className="text-sm text-muted-foreground">Gross Engagement Fee</span>
                  <span className="text-sm font-medium text-foreground">{fmt(gross)}</span>
                </div>
                <div className="flex items-center justify-between px-5 py-3 border-b border-border">
                  <span className="text-sm text-muted-foreground">Platform Fee (7.5%)</span>
                  <span className="text-sm font-medium text-destructive">− {fmt(tax)}</span>
                </div>
                <div className="flex items-center justify-between px-5 py-4 bg-primary/5">
                  <span className="text-base font-bold text-foreground">Net Amount Paid</span>
                  <span className="text-xl font-bold text-accent">{fmt(payment.amount)}</span>
                </div>
              </div>
            </div>

            <Separator />

            {/* Footer note */}
            <div className="text-center space-y-1">
              <p className="text-xs text-muted-foreground">
                This invoice was generated by <span className="font-semibold text-foreground">Afrika Scholar</span> for academic engagement services.
              </p>
              <p className="text-xs text-muted-foreground">
                For payment enquiries contact{" "}
                <a href="mailto:payments@afrikascholars.com" className="text-accent hover:underline">
                  payments@afrikascholars.com
                </a>
              </p>
            </div>
          </div>
        </div>

        {/* Bottom actions */}
        <div className="flex items-center justify-between pt-1">
          <Link to="/dashboard/earnings">
            <Button variant="ghost" size="sm" className="gap-2 text-muted-foreground">
              <ArrowLeft className="h-4 w-4" /> View All Earnings
            </Button>
          </Link>
          <Button variant="afrika" size="sm" className="gap-2" onClick={handleDownload}>
            <Download className="h-4 w-4" />
            Download Invoice (PDF)
          </Button>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default InvoiceDetailsPage;
