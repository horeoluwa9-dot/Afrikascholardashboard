import { useState } from "react";
import { Link } from "react-router-dom";
import DashboardLayout from "@/components/dashboard/DashboardLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  ChevronRight,
  User,
  BookOpen,
  Bell,
  Shield,
  Save,
  Plus,
  X,
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";

const SettingsPage = () => {
  const { toast } = useToast();
  const [name, setName] = useState("Defi Oyedele");
  const [email] = useState("defi@example.com");
  const [keywords, setKeywords] = useState(["AI", "Machine Learning", "Deep Learning", "Cybersecurity"]);
  const [newKeyword, setNewKeyword] = useState("");
  const [primaryField, setPrimaryField] = useState("Computer Science");
  const [secondaryField, setSecondaryField] = useState("Artificial Intelligence");

  const [notifPublishing, setNotifPublishing] = useState(true);
  const [notifIntelligence, setNotifIntelligence] = useState(true);
  const [notifCommunity, setNotifCommunity] = useState(true);
  const [notifCredits, setNotifCredits] = useState(true);

  const addKeyword = () => {
    if (newKeyword.trim() && keywords.length < 10) {
      setKeywords([...keywords, newKeyword.trim()]);
      setNewKeyword("");
    }
  };

  const removeKeyword = (k: string) => setKeywords(keywords.filter((x) => x !== k));

  const handleSave = () => {
    toast({ title: "Settings saved", description: "Your profile has been updated. Intelligence Hub will refresh." });
  };

  return (
    <DashboardLayout>
      <div className="max-w-3xl mx-auto space-y-6">
        <div className="flex items-center gap-1 text-xs text-muted-foreground">
          <Link to="/dashboard" className="hover:text-foreground">Dashboard</Link>
          <ChevronRight className="h-3 w-3" />
          <span className="text-foreground font-medium">Settings</span>
        </div>

        <h1 className="text-2xl font-bold text-foreground">Settings</h1>

        <Tabs defaultValue="profile">
          <TabsList className="bg-secondary w-full justify-start">
            <TabsTrigger value="profile" className="gap-1"><User className="h-3 w-3" /> Profile</TabsTrigger>
            <TabsTrigger value="research" className="gap-1"><BookOpen className="h-3 w-3" /> Research Profile</TabsTrigger>
            <TabsTrigger value="notifications" className="gap-1"><Bell className="h-3 w-3" /> Notifications</TabsTrigger>
            <TabsTrigger value="security" className="gap-1"><Shield className="h-3 w-3" /> Security</TabsTrigger>
          </TabsList>

          {/* Profile */}
          <TabsContent value="profile" className="space-y-5 mt-4">
            <div className="bg-card rounded-xl border border-border p-6 space-y-4">
              <div className="space-y-2">
                <Label>Full Name</Label>
                <Input value={name} onChange={(e) => setName(e.target.value)} />
              </div>
              <div className="space-y-2">
                <Label>Email</Label>
                <Input value={email} disabled className="bg-secondary" />
                <p className="text-[10px] text-muted-foreground">Contact support to change your email address.</p>
              </div>
              <div className="space-y-2">
                <Label>Country</Label>
                <Input defaultValue="Nigeria" />
              </div>
              <div className="space-y-2">
                <Label>Institution (optional)</Label>
                <Input defaultValue="University of Lagos" />
              </div>
              <Button variant="afrika" size="sm" className="gap-1" onClick={handleSave}>
                <Save className="h-3 w-3" /> Save Changes
              </Button>
            </div>
          </TabsContent>

          {/* Research Profile */}
          <TabsContent value="research" className="space-y-5 mt-4">
            <div className="bg-card rounded-xl border border-border p-6 space-y-4">
              <p className="text-xs text-muted-foreground">Your research profile directly affects Intelligence Hub recommendations.</p>

              <div className="space-y-2">
                <Label>Research Keywords (max 10)</Label>
                <div className="flex flex-wrap gap-1.5 mb-2">
                  {keywords.map((k) => (
                    <Badge key={k} variant="secondary" className="text-xs gap-1">
                      {k} <button onClick={() => removeKeyword(k)}><X className="h-2.5 w-2.5" /></button>
                    </Badge>
                  ))}
                </div>
                <div className="flex gap-2">
                  <Input
                    value={newKeyword}
                    onChange={(e) => setNewKeyword(e.target.value)}
                    placeholder="Add keyword..."
                    onKeyDown={(e) => e.key === "Enter" && addKeyword()}
                  />
                  <Button variant="outline" size="sm" onClick={addKeyword} disabled={keywords.length >= 10}>
                    <Plus className="h-3 w-3" />
                  </Button>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Primary Field</Label>
                  <Select value={primaryField} onValueChange={setPrimaryField}>
                    <SelectTrigger><SelectValue /></SelectTrigger>
                    <SelectContent>
                      {["Computer Science", "Economics", "Public Health", "Engineering", "Law", "Political Science", "Education"].map((f) => (
                        <SelectItem key={f} value={f}>{f}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label>Secondary Field</Label>
                  <Select value={secondaryField} onValueChange={setSecondaryField}>
                    <SelectTrigger><SelectValue /></SelectTrigger>
                    <SelectContent>
                      {["Artificial Intelligence", "Data Science", "Neuroscience", "Environmental Science", "Sociology", "Psychology"].map((f) => (
                        <SelectItem key={f} value={f}>{f}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="space-y-2">
                <Label>Target Journals (optional)</Label>
                <Input placeholder="e.g. Journal of the ACM, IEEE Trans. on AI" />
              </div>

              <Button variant="afrika" size="sm" className="gap-1" onClick={handleSave}>
                <Save className="h-3 w-3" /> Save Research Profile
              </Button>
            </div>
          </TabsContent>

          {/* Notifications */}
          <TabsContent value="notifications" className="space-y-5 mt-4">
            <div className="bg-card rounded-xl border border-border p-6 space-y-4">
              {[
                { label: "Publishing updates", desc: "Submission status changes, review decisions", value: notifPublishing, set: setNotifPublishing },
                { label: "Intelligence alerts", desc: "New journal matches, conference deadlines", value: notifIntelligence, set: setNotifIntelligence },
                { label: "Community activity", desc: "Likes, comments, new followers", value: notifCommunity, set: setNotifCommunity },
                { label: "Credit usage", desc: "Low credit warnings, renewal reminders", value: notifCredits, set: setNotifCredits },
              ].map((n) => (
                <div key={n.label} className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-foreground">{n.label}</p>
                    <p className="text-xs text-muted-foreground">{n.desc}</p>
                  </div>
                  <Switch checked={n.value} onCheckedChange={n.set} />
                </div>
              ))}
              <Button variant="afrika" size="sm" className="gap-1" onClick={handleSave}>
                <Save className="h-3 w-3" /> Save Preferences
              </Button>
            </div>
          </TabsContent>

          {/* Security */}
          <TabsContent value="security" className="space-y-5 mt-4">
            <div className="bg-card rounded-xl border border-border p-6 space-y-4">
              <div className="space-y-2">
                <Label>Current Password</Label>
                <Input type="password" />
              </div>
              <div className="space-y-2">
                <Label>New Password</Label>
                <Input type="password" />
              </div>
              <div className="space-y-2">
                <Label>Confirm New Password</Label>
                <Input type="password" />
              </div>
              <Button variant="afrika" size="sm" className="gap-1">
                <Shield className="h-3 w-3" /> Update Password
              </Button>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </DashboardLayout>
  );
};

export default SettingsPage;
