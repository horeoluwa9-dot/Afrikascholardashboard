import DashboardLayout from "@/components/dashboard/DashboardLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { Link } from "react-router-dom";
import { User, GraduationCap, Link2, CreditCard, Plus } from "lucide-react";

const tabs = ["Academic Profile", "Credentials", "Research Interests", "Linked Accounts", "Subscription"];

const ProfilePage = () => {
  const { profile, role, user } = useAuth();
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState("Academic Profile");
  const [displayName, setDisplayName] = useState(profile?.display_name || "");
  const [institution, setInstitution] = useState(profile?.institution || "");
  const [bio, setBio] = useState(profile?.bio || "");
  const [discipline, setDiscipline] = useState(profile?.discipline || "");
  const [saving, setSaving] = useState(false);

  const handleSave = async () => {
    if (!user) return;
    setSaving(true);
    const { error } = await supabase.from("profiles").update({
      display_name: displayName,
      institution,
      bio,
      discipline,
    }).eq("user_id", user.id);
    setSaving(false);
    if (error) toast({ title: "Error saving", description: error.message, variant: "destructive" });
    else toast({ title: "Profile updated" });
  };

  const roleLabelMap: Record<string, string> = {
    researcher: "Researcher",
    student: "Student",
    reviewer: "Reviewer",
    institutional_admin: "Institution Representative",
  };

  return (
    <DashboardLayout>
      <div className="max-w-4xl mx-auto space-y-6">
        <div className="flex items-center gap-4">
          <div className="h-16 w-16 rounded-full bg-primary flex items-center justify-center text-primary-foreground text-2xl font-bold">
            {(displayName || "U").charAt(0).toUpperCase()}
          </div>
          <div>
            <h1 className="text-2xl font-bold text-foreground">{displayName || "Your Profile"}</h1>
            <div className="flex items-center gap-2 mt-1">
              <Badge variant="outline" className="text-xs border-accent text-accent capitalize">{role ? roleLabelMap[role] : "Free"}</Badge>
              {institution && <span className="text-xs text-muted-foreground">{institution}</span>}
            </div>
          </div>
        </div>

        <div className="flex gap-2 flex-wrap">
          {tabs.map((tab) => (
            <button key={tab} onClick={() => setActiveTab(tab)}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${activeTab === tab ? "bg-accent text-accent-foreground" : "bg-card text-foreground border border-border hover:bg-secondary"}`}>
              {tab}
            </button>
          ))}
        </div>

        {activeTab === "Academic Profile" && (
          <div className="bg-card rounded-xl border border-border p-6 space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label>Display Name</Label>
                <Input value={displayName} onChange={(e) => setDisplayName(e.target.value)} className="mt-1" />
              </div>
              <div>
                <Label>Institution</Label>
                <Input value={institution} onChange={(e) => setInstitution(e.target.value)} className="mt-1" />
              </div>
            </div>
            <div>
              <Label>Discipline</Label>
              <Input value={discipline} onChange={(e) => setDiscipline(e.target.value)} className="mt-1" placeholder="e.g. Computer Science, Public Health" />
            </div>
            <div>
              <Label>Bio</Label>
              <Textarea value={bio} onChange={(e) => setBio(e.target.value)} className="mt-1" rows={4} placeholder="Tell others about your research interests..." />
            </div>
            <Button variant="afrika" onClick={handleSave} disabled={saving}>
              {saving ? "Saving..." : "Save Profile"}
            </Button>
          </div>
        )}

        {activeTab === "Credentials" && (
          <div className="bg-card rounded-xl border border-border p-6 space-y-4">
            <h3 className="font-semibold text-foreground">Academic Credentials</h3>
            <p className="text-sm text-muted-foreground">Add your qualifications, certifications, and academic history.</p>
            <div className="border border-dashed border-border rounded-lg p-8 text-center">
              <GraduationCap className="h-8 w-8 text-muted-foreground mx-auto mb-2" />
              <p className="text-sm text-muted-foreground">No credentials added yet.</p>
              <Button variant="outline" size="sm" className="mt-3"><Plus className="h-3 w-3 mr-1" /> Add Credential</Button>
            </div>
          </div>
        )}

        {activeTab === "Research Interests" && (
          <div className="bg-card rounded-xl border border-border p-6 space-y-4">
            <h3 className="font-semibold text-foreground">Research Interests</h3>
            <p className="text-sm text-muted-foreground">These help match you with relevant journals, conferences, and collaborators.</p>
            <div className="flex flex-wrap gap-2">
              {(discipline || "AI,Public Health,Data Science").split(",").map((d) => (
                <Badge key={d.trim()} variant="secondary">{d.trim()}</Badge>
              ))}
            </div>
            <Button variant="outline" size="sm"><Plus className="h-3 w-3 mr-1" /> Add Interest</Button>
          </div>
        )}

        {activeTab === "Linked Accounts" && (
          <div className="bg-card rounded-xl border border-border p-6 space-y-4">
            <h3 className="font-semibold text-foreground">Linked Accounts</h3>
            <div className="space-y-3">
              <div className="flex items-center justify-between p-3 border border-border rounded-lg">
                <div className="flex items-center gap-2">
                  <Link2 className="h-4 w-4 text-muted-foreground" />
                  <span className="text-sm">Google</span>
                </div>
                <Badge variant="outline" className="text-xs">Connected</Badge>
              </div>
              <div className="flex items-center justify-between p-3 border border-border rounded-lg">
                <div className="flex items-center gap-2">
                  <Link2 className="h-4 w-4 text-muted-foreground" />
                  <span className="text-sm">ORCID</span>
                </div>
                <Button size="sm" variant="outline">Connect</Button>
              </div>
            </div>
          </div>
        )}

        {activeTab === "Subscription" && (
          <div className="bg-card rounded-xl border border-border p-6 space-y-4">
            <h3 className="font-semibold text-foreground">Subscription</h3>
            <p className="text-sm text-muted-foreground">Manage your subscription and billing.</p>
            <Link to="/dashboard/billing"><Button variant="afrika" size="sm">View Billing & Credits</Button></Link>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
};

export default ProfilePage;
