import DashboardLayout from "@/components/dashboard/DashboardLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Users2, CreditCard, Plus, ArrowUpRight } from "lucide-react";

const SEAT_DATA = {
  totalSeats: 25,
  usedSeats: 18,
  departments: [
    { name: "Energy Policy & Sustainability", seats: 5, used: 4 },
    { name: "Computer Science", seats: 6, used: 5 },
    { name: "Public Health", seats: 5, used: 3 },
    { name: "Agricultural Science", seats: 4, used: 3 },
    { name: "Political Science", seats: 5, used: 3 },
  ],
};

export default function SeatManagementPage() {
  const pct = Math.round((SEAT_DATA.usedSeats / SEAT_DATA.totalSeats) * 100);

  return (
    <DashboardLayout>
      <div className="max-w-6xl mx-auto space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-foreground">Seat Management</h1>
            <p className="text-sm text-muted-foreground mt-1">Manage institutional license seats and allocations.</p>
          </div>
          <Button className="gap-2"><Plus className="h-4 w-4" /> Purchase Seats</Button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <Card className="border-border">
            <CardContent className="pt-5 pb-4 px-5">
              <p className="text-xs text-muted-foreground">Total Seats</p>
              <p className="text-2xl font-bold text-foreground mt-1">{SEAT_DATA.totalSeats}</p>
            </CardContent>
          </Card>
          <Card className="border-border">
            <CardContent className="pt-5 pb-4 px-5">
              <p className="text-xs text-muted-foreground">Assigned</p>
              <p className="text-2xl font-bold text-foreground mt-1">{SEAT_DATA.usedSeats}</p>
            </CardContent>
          </Card>
          <Card className="border-border">
            <CardContent className="pt-5 pb-4 px-5">
              <p className="text-xs text-muted-foreground">Available</p>
              <p className="text-2xl font-bold text-accent mt-1">{SEAT_DATA.totalSeats - SEAT_DATA.usedSeats}</p>
            </CardContent>
          </Card>
        </div>

        <Card className="border-border">
          <CardHeader>
            <CardTitle className="text-base">Overall Usage</CardTitle>
          </CardHeader>
          <CardContent>
            <Progress value={pct} className="h-3" />
            <p className="text-xs text-muted-foreground mt-2">{pct}% of seats allocated ({SEAT_DATA.usedSeats}/{SEAT_DATA.totalSeats})</p>
          </CardContent>
        </Card>

        <div>
          <h2 className="text-lg font-bold text-foreground mb-4">Department Allocation</h2>
          <div className="space-y-3">
            {SEAT_DATA.departments.map(d => (
              <Card key={d.name} className="border-border">
                <CardContent className="pt-4 pb-3 px-5 flex items-center justify-between">
                  <div className="flex-1 min-w-0 mr-4">
                    <p className="text-sm font-medium text-foreground">{d.name}</p>
                    <div className="flex items-center gap-3 mt-1.5">
                      <Progress value={Math.round((d.used / d.seats) * 100)} className="h-2 flex-1" />
                      <span className="text-xs text-muted-foreground whitespace-nowrap">{d.used}/{d.seats}</span>
                    </div>
                  </div>
                  <Button variant="ghost" size="sm" className="text-xs">Manage</Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
