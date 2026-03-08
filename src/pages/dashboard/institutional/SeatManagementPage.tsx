import DashboardLayout from "@/components/dashboard/DashboardLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Progress } from "@/components/ui/progress";
import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter,
} from "@/components/ui/dialog";
import { Plus, Minus } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

interface Dept { name: string; seats: number; used: number; }

const INITIAL_DEPTS: Dept[] = [
  { name: "Energy Policy & Sustainability", seats: 5, used: 4 },
  { name: "Computer Science", seats: 6, used: 5 },
  { name: "Public Health", seats: 5, used: 3 },
  { name: "Agricultural Science", seats: 4, used: 3 },
  { name: "Political Science", seats: 5, used: 3 },
];

export default function SeatManagementPage() {
  const [departments, setDepartments] = useState<Dept[]>(INITIAL_DEPTS);
  const [showPurchase, setShowPurchase] = useState(false);
  const [purchaseQty, setPurchaseQty] = useState(5);
  const [manageDept, setManageDept] = useState<number | null>(null);
  const [deptSeatsInput, setDeptSeatsInput] = useState(0);

  const totalSeats = departments.reduce((s, d) => s + d.seats, 0);
  const usedSeats = departments.reduce((s, d) => s + d.used, 0);
  const pct = totalSeats > 0 ? Math.round((usedSeats / totalSeats) * 100) : 0;

  const handlePurchase = () => {
    if (purchaseQty < 1) { toast.error("Enter a valid quantity"); return; }
    // Distribute equally to first dept for demo; real logic would differ
    setDepartments(prev => {
      const copy = [...prev];
      copy[0] = { ...copy[0], seats: copy[0].seats + purchaseQty };
      return copy;
    });
    setShowPurchase(false);
    toast.success(`${purchaseQty} seats purchased and added to your plan`);
    setPurchaseQty(5);
  };

  const openManage = (idx: number) => {
    setManageDept(idx);
    setDeptSeatsInput(departments[idx].seats);
  };

  const handleUpdateSeats = () => {
    if (manageDept === null) return;
    const dept = departments[manageDept];
    if (deptSeatsInput < dept.used) {
      toast.error(`Cannot set seats below currently used (${dept.used})`);
      return;
    }
    setDepartments(prev => prev.map((d, i) => i === manageDept ? { ...d, seats: deptSeatsInput } : d));
    toast.success(`${dept.name} updated to ${deptSeatsInput} seats`);
    setManageDept(null);
  };

  return (
    <DashboardLayout>
      <div className="max-w-6xl mx-auto space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-foreground">Seat Management</h1>
            <p className="text-sm text-muted-foreground mt-1">Manage institutional license seats and allocations.</p>
          </div>
          <Button className="gap-2" onClick={() => setShowPurchase(true)}><Plus className="h-4 w-4" /> Purchase Seats</Button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <Card className="border-border">
            <CardContent className="pt-5 pb-4 px-5">
              <p className="text-xs text-muted-foreground">Total Seats</p>
              <p className="text-2xl font-bold text-foreground mt-1">{totalSeats}</p>
            </CardContent>
          </Card>
          <Card className="border-border">
            <CardContent className="pt-5 pb-4 px-5">
              <p className="text-xs text-muted-foreground">Assigned</p>
              <p className="text-2xl font-bold text-foreground mt-1">{usedSeats}</p>
            </CardContent>
          </Card>
          <Card className="border-border">
            <CardContent className="pt-5 pb-4 px-5">
              <p className="text-xs text-muted-foreground">Available</p>
              <p className="text-2xl font-bold text-accent mt-1">{totalSeats - usedSeats}</p>
            </CardContent>
          </Card>
        </div>

        <Card className="border-border">
          <CardHeader><CardTitle className="text-base">Overall Usage</CardTitle></CardHeader>
          <CardContent>
            <Progress value={pct} className="h-3" />
            <p className="text-xs text-muted-foreground mt-2">{pct}% of seats allocated ({usedSeats}/{totalSeats})</p>
          </CardContent>
        </Card>

        <div>
          <h2 className="text-lg font-bold text-foreground mb-4">Department Allocation</h2>
          <div className="space-y-3">
            {departments.map((d, idx) => (
              <Card key={d.name} className="border-border">
                <CardContent className="pt-4 pb-3 px-5 flex items-center justify-between">
                  <div className="flex-1 min-w-0 mr-4">
                    <p className="text-sm font-medium text-foreground">{d.name}</p>
                    <div className="flex items-center gap-3 mt-1.5">
                      <Progress value={Math.round((d.used / d.seats) * 100)} className="h-2 flex-1" />
                      <span className="text-xs text-muted-foreground whitespace-nowrap">{d.used}/{d.seats}</span>
                    </div>
                  </div>
                  <Button variant="ghost" size="sm" className="text-xs" onClick={() => openManage(idx)}>Manage</Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </div>

      {/* Purchase Seats Dialog */}
      <Dialog open={showPurchase} onOpenChange={setShowPurchase}>
        <DialogContent>
          <DialogHeader><DialogTitle>Purchase Additional Seats</DialogTitle></DialogHeader>
          <div className="space-y-4 py-2">
            <p className="text-sm text-muted-foreground">Add more seats to your institutional plan. Each seat allows one faculty member to access the platform.</p>
            <div className="space-y-2">
              <Label>Number of Seats</Label>
              <div className="flex items-center gap-3">
                <Button variant="outline" size="icon" className="h-9 w-9" onClick={() => setPurchaseQty(q => Math.max(1, q - 1))}><Minus className="h-4 w-4" /></Button>
                <Input type="number" min={1} className="w-20 text-center" value={purchaseQty} onChange={e => setPurchaseQty(Math.max(1, parseInt(e.target.value) || 1))} />
                <Button variant="outline" size="icon" className="h-9 w-9" onClick={() => setPurchaseQty(q => q + 1)}><Plus className="h-4 w-4" /></Button>
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowPurchase(false)}>Cancel</Button>
            <Button onClick={handlePurchase}>Purchase {purchaseQty} Seats</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Manage Department Dialog */}
      <Dialog open={manageDept !== null} onOpenChange={(open) => { if (!open) setManageDept(null); }}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Manage — {manageDept !== null ? departments[manageDept].name : ""}</DialogTitle>
          </DialogHeader>
          {manageDept !== null && (
            <div className="space-y-4 py-2">
              <p className="text-sm text-muted-foreground">
                Currently using <span className="font-semibold text-foreground">{departments[manageDept].used}</span> of <span className="font-semibold text-foreground">{departments[manageDept].seats}</span> seats.
              </p>
              <div className="space-y-2">
                <Label>Allocated Seats</Label>
                <div className="flex items-center gap-3">
                  <Button variant="outline" size="icon" className="h-9 w-9" onClick={() => setDeptSeatsInput(s => Math.max(departments[manageDept!].used, s - 1))}><Minus className="h-4 w-4" /></Button>
                  <Input type="number" className="w-20 text-center" value={deptSeatsInput} onChange={e => setDeptSeatsInput(Math.max(0, parseInt(e.target.value) || 0))} />
                  <Button variant="outline" size="icon" className="h-9 w-9" onClick={() => setDeptSeatsInput(s => s + 1)}><Plus className="h-4 w-4" /></Button>
                </div>
              </div>
            </div>
          )}
          <DialogFooter>
            <Button variant="outline" onClick={() => setManageDept(null)}>Cancel</Button>
            <Button onClick={handleUpdateSeats}>Update Allocation</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </DashboardLayout>
  );
}
