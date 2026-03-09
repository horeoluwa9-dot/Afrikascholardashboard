import { Link } from "react-router-dom";
import DashboardLayout from "@/components/dashboard/DashboardLayout";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  ChevronRight, Receipt, Download, Eye,
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";

const allInvoices = [
  { id: "INV-2026-034", date: "Feb 28, 2026", amount: "₦25,000", status: "Paid", description: "Monthly Subscription — Individual Pro" },
  { id: "INV-2026-029", date: "Jan 31, 2026", amount: "₦25,000", status: "Paid", description: "Monthly Subscription — Individual Pro" },
  { id: "INV-2026-015", date: "Dec 31, 2025", amount: "₦7,500", status: "Paid", description: "Credit Pack — +5 Paper Credits" },
  { id: "INV-2025-098", date: "Nov 30, 2025", amount: "₦25,000", status: "Paid", description: "Monthly Subscription — Individual Pro" },
  { id: "INV-2025-082", date: "Oct 31, 2025", amount: "₦5,000", status: "Paid", description: "Credit Pack — +10 Dataset Credits" },
  { id: "INV-2025-070", date: "Sep 30, 2025", amount: "₦25,000", status: "Paid", description: "Monthly Subscription — Individual Pro" },
];

const BillingInvoicesPage = () => {
  const { toast } = useToast();

  return (
    <DashboardLayout>
      <div className="max-w-5xl mx-auto space-y-8">
        <div className="flex items-center gap-1 text-xs text-muted-foreground">
          <Link to="/dashboard" className="hover:text-foreground">Dashboard</Link>
          <ChevronRight className="h-3 w-3" />
          <Link to="/dashboard/billing" className="hover:text-foreground">Billing & Credits</Link>
          <ChevronRight className="h-3 w-3" />
          <span className="text-foreground font-medium">Invoices</span>
        </div>

        <div>
          <h1 className="text-2xl font-bold text-foreground">Invoices</h1>
          <p className="text-sm text-muted-foreground mt-1">View and download your billing documents.</p>
        </div>

        {/* Summary */}
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
          <div className="bg-card rounded-xl border border-border p-5 text-center">
            <p className="text-2xl font-bold text-foreground">{allInvoices.length}</p>
            <p className="text-[10px] text-muted-foreground">Total Invoices</p>
          </div>
          <div className="bg-card rounded-xl border border-border p-5 text-center">
            <p className="text-2xl font-bold text-accent">₦137,500</p>
            <p className="text-[10px] text-muted-foreground">Total Paid</p>
          </div>
          <div className="bg-card rounded-xl border border-border p-5 text-center">
            <p className="text-2xl font-bold text-afrika-green">0</p>
            <p className="text-[10px] text-muted-foreground">Outstanding</p>
          </div>
        </div>

        {/* Invoice Table */}
        <div className="bg-card rounded-xl border border-border overflow-hidden">
          <div className="hidden md:grid grid-cols-6 gap-2 px-5 py-3 bg-secondary text-xs font-semibold text-muted-foreground border-b border-border">
            <div>Invoice ID</div><div>Date</div><div>Description</div><div>Amount</div><div>Status</div><div>Actions</div>
          </div>
          {allInvoices.map((inv) => (
            <div key={inv.id} className="grid grid-cols-2 md:grid-cols-6 gap-2 px-5 py-4 border-b border-border text-sm items-center">
              <span className="text-xs font-mono text-foreground">{inv.id}</span>
              <span className="text-xs text-muted-foreground">{inv.date}</span>
              <span className="text-xs text-foreground md:col-span-1">{inv.description}</span>
              <span className="text-xs font-medium text-foreground">{inv.amount}</span>
              <Badge variant="secondary" className="text-[10px] w-fit">{inv.status}</Badge>
              <div className="flex gap-2">
                <Link to={`/dashboard/billing/invoices/${inv.id}`}>
                  <Button variant="ghost" size="sm" className="text-[10px] h-7 gap-1">
                    <Eye className="h-3 w-3" /> View
                  </Button>
                </Link>
                <Button
                  variant="ghost"
                  size="sm"
                  className="text-[10px] h-7 gap-1"
                  onClick={() => toast({ title: "Download started", description: `${inv.id}.pdf` })}
                >
                  <Download className="h-3 w-3" /> PDF
                </Button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </DashboardLayout>
  );
};

export default BillingInvoicesPage;
