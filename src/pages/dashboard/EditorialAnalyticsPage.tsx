import { Link } from "react-router-dom";
import DashboardLayout from "@/components/dashboard/DashboardLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { ChevronRight, Clock, TrendingUp, CheckCircle, FileText } from "lucide-react";
import { BarChart, Bar, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from "recharts";

const submissionData = [
  { month: "Oct", count: 28 }, { month: "Nov", count: 35 }, { month: "Dec", count: 22 },
  { month: "Jan", count: 41 }, { month: "Feb", count: 38 }, { month: "Mar", count: 47 },
];

const reviewTimeData = [
  { month: "Oct", days: 24 }, { month: "Nov", days: 22 }, { month: "Dec", days: 26 },
  { month: "Jan", days: 20 }, { month: "Feb", days: 19 }, { month: "Mar", days: 21 },
];

const decisionData = [
  { name: "Accepted", value: 42, color: "hsl(142, 76%, 36%)" },
  { name: "Minor Revision", value: 28, color: "hsl(217, 91%, 60%)" },
  { name: "Major Revision", value: 18, color: "hsl(38, 92%, 50%)" },
  { name: "Rejected", value: 23, color: "hsl(0, 84%, 60%)" },
];

const journalPerformance = [
  { name: "African Journal of Public Health", submissions: 45, accepted: 18, avgReview: "19 days", rate: "40%" },
  { name: "Journal of African Energy Studies", submissions: 32, accepted: 14, avgReview: "22 days", rate: "44%" },
  { name: "African Policy Research Review", submissions: 28, accepted: 10, avgReview: "24 days", rate: "36%" },
  { name: "East African Economic Review", submissions: 23, accepted: 11, avgReview: "18 days", rate: "48%" },
];

const EditorialAnalyticsPage = () => (
  <DashboardLayout>
    <div className="max-w-full mx-auto space-y-6 px-2 sm:px-4">
      <div className="flex items-center gap-1 text-xs text-muted-foreground">
        <Link to="/dashboard" className="hover:text-foreground">Dashboard</Link>
        <ChevronRight className="h-3 w-3" />
        <Link to="/dashboard/publishing" className="hover:text-foreground">Publishing</Link>
        <ChevronRight className="h-3 w-3" />
        <span className="text-foreground font-medium">Editorial Analytics</span>
      </div>

      <div>
        <h1 className="text-2xl font-bold text-foreground font-serif">Editorial Analytics</h1>
        <p className="text-sm text-muted-foreground mt-1">Monitor journal workflow performance and editorial metrics.</p>
      </div>

      {/* Metric Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          { label: "Total Submissions", value: "128", icon: FileText, color: "text-primary bg-primary/10" },
          { label: "Acceptance Rate", value: "42%", icon: CheckCircle, color: "text-emerald-600 bg-emerald-500/10" },
          { label: "Avg. Review Time", value: "21 days", icon: Clock, color: "text-amber-600 bg-amber-500/10" },
          { label: "Active Reviewers", value: "34", icon: TrendingUp, color: "text-blue-600 bg-blue-500/10" },
        ].map((c, i) => (
          <Card key={i} className="border-border">
            <CardContent className="p-4">
              <div className={`h-8 w-8 rounded-lg flex items-center justify-center mb-3 ${c.color.split(" ")[1]}`}>
                <c.icon className={`h-4 w-4 ${c.color.split(" ")[0]}`} />
              </div>
              <p className="text-2xl font-bold text-foreground">{c.value}</p>
              <p className="text-xs text-muted-foreground mt-0.5">{c.label}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <Card className="border-border">
          <CardHeader className="pb-2"><CardTitle className="text-sm font-semibold">Submission Growth</CardTitle></CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={240}>
              <LineChart data={submissionData}>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                <XAxis dataKey="month" tick={{ fontSize: 12 }} stroke="hsl(var(--muted-foreground))" />
                <YAxis tick={{ fontSize: 12 }} stroke="hsl(var(--muted-foreground))" />
                <Tooltip />
                <Line type="monotone" dataKey="count" stroke="hsl(var(--primary))" strokeWidth={2} dot={{ r: 4 }} />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card className="border-border">
          <CardHeader className="pb-2"><CardTitle className="text-sm font-semibold">Average Review Time</CardTitle></CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={240}>
              <BarChart data={reviewTimeData}>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                <XAxis dataKey="month" tick={{ fontSize: 12 }} stroke="hsl(var(--muted-foreground))" />
                <YAxis tick={{ fontSize: 12 }} stroke="hsl(var(--muted-foreground))" unit=" d" />
                <Tooltip />
                <Bar dataKey="days" fill="hsl(var(--accent))" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* Decision Breakdown */}
      <Card className="border-border">
        <CardHeader className="pb-2"><CardTitle className="text-sm font-semibold">Decision Breakdown</CardTitle></CardHeader>
        <CardContent>
          <div className="flex items-center gap-8 flex-wrap">
            <ResponsiveContainer width={200} height={200}>
              <PieChart>
                <Pie data={decisionData} dataKey="value" cx="50%" cy="50%" innerRadius={50} outerRadius={80} paddingAngle={3}>
                  {decisionData.map((entry, i) => <Cell key={i} fill={entry.color} />)}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
            <div className="space-y-2">
              {decisionData.map((d, i) => (
                <div key={i} className="flex items-center gap-2 text-sm">
                  <div className="h-3 w-3 rounded-sm" style={{ backgroundColor: d.color }} />
                  <span className="text-foreground font-medium">{d.name}</span>
                  <span className="text-muted-foreground">({d.value})</span>
                </div>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Journal Performance */}
      <Card className="border-border">
        <CardHeader className="pb-3"><CardTitle className="text-base font-semibold">Journal Performance</CardTitle></CardHeader>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="pl-6">Journal</TableHead>
                <TableHead>Submissions</TableHead>
                <TableHead>Accepted</TableHead>
                <TableHead>Avg. Review</TableHead>
                <TableHead>Acceptance Rate</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {journalPerformance.map((j, i) => (
                <TableRow key={i}>
                  <TableCell className="pl-6 text-sm font-medium text-foreground">{j.name}</TableCell>
                  <TableCell className="text-sm text-muted-foreground">{j.submissions}</TableCell>
                  <TableCell className="text-sm text-muted-foreground">{j.accepted}</TableCell>
                  <TableCell className="text-sm text-muted-foreground">{j.avgReview}</TableCell>
                  <TableCell className="text-sm font-medium text-foreground">{j.rate}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  </DashboardLayout>
);

export default EditorialAnalyticsPage;
