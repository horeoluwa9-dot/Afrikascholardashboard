import { useState } from "react";
import { Link } from "react-router-dom";
import DashboardLayout from "@/components/dashboard/DashboardLayout";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger,
} from "@/components/ui/dialog";
import {
  ChevronRight, CreditCard, Plus, Trash2, ShieldCheck,
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";

const mockMethods = [
  { id: "1", type: "Visa", last4: "4821", expiry: "09/28", isDefault: true },
  { id: "2", type: "Mastercard", last4: "1337", expiry: "03/27", isDefault: false },
];

const PaymentMethodsPage = () => {
  const { toast } = useToast();
  const [methods, setMethods] = useState(mockMethods);

  const handleSetDefault = (id: string) => {
    setMethods(methods.map((m) => ({ ...m, isDefault: m.id === id })));
    toast({ title: "Default updated", description: "Your default payment method has been changed." });
  };

  const handleRemove = (id: string) => {
    setMethods(methods.filter((m) => m.id !== id));
    toast({ title: "Removed", description: "Payment method has been removed." });
  };

  return (
    <DashboardLayout>
      <div className="max-w-3xl mx-auto space-y-8">
        <div className="flex items-center gap-1 text-xs text-muted-foreground">
          <Link to="/dashboard" className="hover:text-foreground">Dashboard</Link>
          <ChevronRight className="h-3 w-3" />
          <Link to="/dashboard/billing" className="hover:text-foreground">Billing & Credits</Link>
          <ChevronRight className="h-3 w-3" />
          <span className="text-foreground font-medium">Payment Methods</span>
        </div>

        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-foreground">Payment Methods</h1>
            <p className="text-sm text-muted-foreground mt-1">Manage your payment methods for subscriptions and credit purchases.</p>
          </div>
          <Dialog>
            <DialogTrigger asChild>
              <Button variant="afrika" size="sm" className="gap-1"><Plus className="h-3 w-3" /> Add Method</Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Add Payment Method</DialogTitle>
              </DialogHeader>
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label>Card Number</Label>
                  <Input placeholder="1234 5678 9012 3456" />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>Expiry</Label>
                    <Input placeholder="MM/YY" />
                  </div>
                  <div className="space-y-2">
                    <Label>CVV</Label>
                    <Input placeholder="123" type="password" />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label>Cardholder Name</Label>
                  <Input placeholder="Full name on card" />
                </div>
                <Button variant="afrika" className="w-full" onClick={() => toast({ title: "Card added", description: "Your new payment method has been saved." })}>
                  Save Card
                </Button>
                <div className="flex items-center gap-2 justify-center">
                  <ShieldCheck className="h-3.5 w-3.5 text-muted-foreground" />
                  <p className="text-[10px] text-muted-foreground">Your payment information is encrypted and secure.</p>
                </div>
              </div>
            </DialogContent>
          </Dialog>
        </div>

        <div className="space-y-4">
          {methods.map((m) => (
            <div key={m.id} className="bg-card rounded-xl border border-border p-5 flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="h-10 w-14 bg-secondary rounded-lg flex items-center justify-center">
                  <CreditCard className="h-5 w-5 text-muted-foreground" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <p className="text-sm font-medium text-foreground">{m.type} •••• {m.last4}</p>
                    {m.isDefault && <Badge className="bg-accent text-accent-foreground text-[10px]">Default</Badge>}
                  </div>
                  <p className="text-xs text-muted-foreground">Expires {m.expiry}</p>
                </div>
              </div>
              <div className="flex gap-2">
                {!m.isDefault && (
                  <Button variant="afrikaOutline" size="sm" className="text-xs" onClick={() => handleSetDefault(m.id)}>
                    Set Default
                  </Button>
                )}
                <Button variant="ghost" size="sm" className="text-destructive hover:text-destructive" onClick={() => handleRemove(m.id)}>
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            </div>
          ))}
        </div>

        {methods.length === 0 && (
          <div className="bg-card rounded-xl border border-border p-12 text-center">
            <CreditCard className="h-10 w-10 mx-auto text-muted-foreground mb-3" />
            <p className="text-sm font-medium text-foreground">No payment methods</p>
            <p className="text-xs text-muted-foreground mt-1">Add a payment method to purchase credits and manage your subscription.</p>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
};

export default PaymentMethodsPage;
