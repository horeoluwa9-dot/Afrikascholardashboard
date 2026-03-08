import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider } from "@/contexts/AuthContext";
import { ModuleUnlocksProvider } from "@/contexts/ModuleUnlocksContext";
import { SubscriptionProvider } from "@/contexts/SubscriptionContext";
import ProtectedRoute from "@/components/ProtectedRoute";
import PubleeshLanding from "./pages/PubleeshLanding";
import PricingPage from "./pages/PricingPage";
import Login from "./pages/auth/Login";
import Signup from "./pages/auth/Signup";
import ForgotPassword from "./pages/auth/ForgotPassword";
import ResetPassword from "./pages/auth/ResetPassword";
import VerifyEmail from "./pages/auth/VerifyEmail";
import Onboarding from "./pages/auth/Onboarding";
import Dashboard from "./pages/Dashboard";
import GeneratePaper from "./pages/dashboard/GeneratePaper";
import PaperSetupWizard from "./pages/dashboard/ai-paper-generator/PaperSetupWizard";
import PaperWorkspace from "./pages/dashboard/ai-paper-generator/PaperWorkspace";
import SavedPapers from "./pages/dashboard/ai-paper-generator/SavedPapers";
import PublishingOverview from "./pages/dashboard/PublishingOverview";
import EditorialWorkflow from "./pages/dashboard/EditorialWorkflow";
import JournalManagement from "./pages/dashboard/JournalManagement";
import PeerReviewsPage from "./pages/dashboard/PeerReviewsPage";
import ReviewWorkspacePage from "./pages/dashboard/ReviewWorkspacePage";
import MyPapers from "./pages/dashboard/MyPapers";
import ProTip from "./pages/dashboard/ProTip";
import DatasetExplorer from "./pages/dashboard/DatasetExplorer";
import DatasetAnalyzer from "./pages/dashboard/DatasetAnalyzer";
import CommunityPage from "./pages/dashboard/CommunityPage";
import IntelligenceHub from "./pages/dashboard/IntelligenceHub";
import TrackSubmissions from "./pages/dashboard/TrackSubmissions";
import SubmitManuscript from "./pages/dashboard/SubmitManuscript";
import InstrumentStudio from "./pages/dashboard/InstrumentStudio";
import MyInstruments from "./pages/dashboard/MyInstruments";
import AISlideBuilder from "./pages/dashboard/AISlideBuilder";
import SettingsPage from "./pages/dashboard/SettingsPage";
import BillingPage from "./pages/dashboard/BillingPage";
import MessagesPage from "./pages/dashboard/MessagesPage";
import LibraryPage from "./pages/dashboard/LibraryPage";
import NetworkPage from "./pages/dashboard/NetworkPage";
import InstitutionRequestsPage from "./pages/dashboard/InstitutionRequestsPage";
import ProfilePage from "./pages/dashboard/ProfilePage";
import AdminDashboard from "./pages/dashboard/AdminDashboard";
import ResearcherProfilePage from "./pages/dashboard/ResearcherProfilePage";
import SubscriptionPage from "./pages/dashboard/SubscriptionPage";
import PaymentSuccessPage from "./pages/dashboard/PaymentSuccessPage";
import NotificationsPage from "./pages/dashboard/NotificationsPage";
import InstitutionalOverview from "./pages/dashboard/InstitutionalOverview";
import TalentRequestsPage from "./pages/dashboard/TalentRequestsPage";
import LecturerSearchPage from "./pages/dashboard/LecturerSearchPage";
import ProjectCollaborationsPage from "./pages/dashboard/ProjectCollaborationsPage";
import MyEngagementsPage from "./pages/dashboard/MyEngagementsPage";
import FacultyUsersPage from "./pages/dashboard/institutional/FacultyUsersPage";
import SeatManagementPage from "./pages/dashboard/institutional/SeatManagementPage";
import ResearchOutputPage from "./pages/dashboard/institutional/ResearchOutputPage";
import UsageAnalyticsPage from "./pages/dashboard/institutional/UsageAnalyticsPage";
import InstitutionalReportsPage from "./pages/dashboard/institutional/InstitutionalReportsPage";
import AdvisoryRequestsPage from "./pages/dashboard/AdvisoryRequestsPage";
import AdvisoryOverviewPage from "./pages/dashboard/advisory/AdvisoryOverviewPage";
import TranscriptRequestsPage from "./pages/dashboard/advisory/TranscriptRequestsPage";
import DegreeAdvisoryPage from "./pages/dashboard/advisory/DegreeAdvisoryPage";
import StudyInAfricaPage from "./pages/dashboard/advisory/StudyInAfricaPage";
import AcademicPathwaysPage from "./pages/dashboard/advisory/AcademicPathwaysPage";
import MyCasesPage from "./pages/dashboard/advisory/MyCasesPage";
import DocumentUploadsPage from "./pages/dashboard/advisory/DocumentUploadsPage";
import Features from "./pages/Features";
import InstitutionalDemo from "./pages/InstitutionalDemo";
import CompliancePage from "./pages/CompliancePage";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const P = ({ children }: { children: React.ReactNode }) => (
  <ProtectedRoute>{children}</ProtectedRoute>
);

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <AuthProvider>
          <ModuleUnlocksProvider>
          <SubscriptionProvider>
          <Routes>
            <Route path="/" element={<Navigate to="/publeesh" replace />} />
            <Route path="/publeesh" element={<PubleeshLanding />} />
            <Route path="/publeesh/pricing" element={<PricingPage />} />
            <Route path="/publeesh/features" element={<Features />} />
            <Route path="/publeesh/institutional-demo" element={<InstitutionalDemo />} />
            <Route path="/publeesh/subscription" element={<P><SubscriptionPage /></P>} />
            <Route path="/publeesh/payment-success" element={<P><PaymentSuccessPage /></P>} />

            <Route path="/auth/login" element={<Login />} />
            <Route path="/auth/signup" element={<Signup />} />
            <Route path="/auth/forgot-password" element={<ForgotPassword />} />
            <Route path="/auth/reset-password" element={<ResetPassword />} />
            <Route path="/auth/verify-email" element={<VerifyEmail />} />
            <Route path="/auth/onboarding" element={<Onboarding />} />

            {/* Dashboard - All authenticated users */}
            <Route path="/dashboard" element={<P><Dashboard /></P>} />
            <Route path="/dashboard/generate-paper" element={<P><GeneratePaper /></P>} />
            <Route path="/dashboard/my-papers" element={<P><MyPapers /></P>} />
            <Route path="/dashboard/ai-papers" element={<P><SavedPapers /></P>} />
            <Route path="/dashboard/ai-papers/new" element={<P><PaperSetupWizard /></P>} />
            <Route path="/dashboard/ai-papers/workspace/:id" element={<P><PaperWorkspace /></P>} />
            <Route path="/dashboard/pro-tip" element={<P><ProTip /></P>} />
            <Route path="/dashboard/data/explorer" element={<P><DatasetExplorer /></P>} />
            <Route path="/dashboard/data/analyzer" element={<P><DatasetAnalyzer /></P>} />
            <Route path="/dashboard/intelligence" element={<P><IntelligenceHub /></P>} />
            <Route path="/dashboard/publishing" element={<P><PublishingOverview /></P>} />
            <Route path="/dashboard/publishing/submit" element={<P><SubmitManuscript /></P>} />
            <Route path="/dashboard/publishing/submissions" element={<P><TrackSubmissions /></P>} />
            <Route path="/dashboard/publishing/track" element={<P><TrackSubmissions /></P>} />
            <Route path="/dashboard/publishing/workflow" element={<P><EditorialWorkflow /></P>} />
            <Route path="/dashboard/publishing/journals" element={<P><JournalManagement /></P>} />
            <Route path="/dashboard/publishing/reviews" element={<P><PeerReviewsPage /></P>} />
            <Route path="/dashboard/publishing/reviews/workspace/:id" element={<P><ReviewWorkspacePage /></P>} />
            <Route path="/dashboard/instrument-studio" element={<P><InstrumentStudio /></P>} />
            <Route path="/dashboard/instrument-studio/my" element={<P><MyInstruments /></P>} />
            <Route path="/dashboard/instrument-studio/slides" element={<P><AISlideBuilder /></P>} />
            <Route path="/dashboard/community" element={<P><CommunityPage /></P>} />
            <Route path="/dashboard/billing" element={<P><BillingPage /></P>} />
            <Route path="/dashboard/settings" element={<P><SettingsPage /></P>} />
            <Route path="/dashboard/messages" element={<P><MessagesPage /></P>} />
            <Route path="/dashboard/library" element={<P><LibraryPage /></P>} />
            <Route path="/dashboard/network" element={<P><NetworkPage /></P>} />
            <Route path="/dashboard/profile" element={<P><ProfilePage /></P>} />
            <Route path="/dashboard/researcher" element={<P><ResearcherProfilePage /></P>} />

            {/* Institution / Admin routes */}
            <Route path="/dashboard/institution-requests" element={<P><InstitutionRequestsPage /></P>} />
            <Route path="/dashboard/institutional" element={<P><InstitutionalOverview /></P>} />
            <Route path="/dashboard/institutional/talent-requests" element={<P><TalentRequestsPage /></P>} />
            <Route path="/dashboard/institutional/lecturers" element={<P><LecturerSearchPage /></P>} />
            <Route path="/dashboard/institutional/collaborations" element={<P><ProjectCollaborationsPage /></P>} />
            <Route path="/dashboard/institutional/engagements" element={<P><MyEngagementsPage /></P>} />
            <Route path="/dashboard/institutional/admin/faculty" element={<P><FacultyUsersPage /></P>} />
            <Route path="/dashboard/institutional/admin/seats" element={<P><SeatManagementPage /></P>} />
            <Route path="/dashboard/institutional/admin/research-output" element={<P><ResearchOutputPage /></P>} />
            <Route path="/dashboard/institutional/admin/analytics" element={<P><UsageAnalyticsPage /></P>} />
            <Route path="/dashboard/institutional/admin/reports" element={<P><InstitutionalReportsPage /></P>} />

            {/* Advisory Client Dashboard */}
            <Route path="/dashboard/advisory" element={<P><AdvisoryOverviewPage /></P>} />
            <Route path="/dashboard/advisory/transcripts" element={<P><TranscriptRequestsPage /></P>} />
            <Route path="/dashboard/advisory/degree" element={<P><DegreeAdvisoryPage /></P>} />
            <Route path="/dashboard/advisory/study-africa" element={<P><StudyInAfricaPage /></P>} />
            <Route path="/dashboard/advisory/pathways" element={<P><AcademicPathwaysPage /></P>} />
            <Route path="/dashboard/advisory/cases" element={<P><MyCasesPage /></P>} />
            <Route path="/dashboard/advisory/documents" element={<P><DocumentUploadsPage /></P>} />
            <Route path="/dashboard/admin" element={<ProtectedRoute allowedRoles={["institutional_admin"]}><AdminDashboard /></ProtectedRoute>} />

            {/* Legacy redirects */}
            <Route path="/dashboard/publeesh" element={<Navigate to="/dashboard" replace />} />
            <Route path="/dashboard/publishing" element={<Navigate to="/dashboard/publishing/submit" replace />} />
            <Route path="/dashboard/datasets" element={<Navigate to="/dashboard/data/explorer" replace />} />
            <Route path="/dashboard/analyzer" element={<Navigate to="/dashboard/data/analyzer" replace />} />
            <Route path="/dashboard/intelligence/journals" element={<Navigate to="/dashboard/intelligence?tab=journals" replace />} />
            <Route path="/dashboard/intelligence/conferences" element={<Navigate to="/dashboard/intelligence?tab=conferences" replace />} />
            <Route path="/dashboard/intelligence/stakeholders" element={<Navigate to="/dashboard/intelligence?tab=stakeholders" replace />} />
            <Route path="/dashboard/intelligence/gaps" element={<Navigate to="/dashboard/intelligence?tab=gaps" replace />} />
            <Route path="/dashboard/notifications" element={<P><NotificationsPage /></P>} />

            <Route path="/compliance/responsible-ai" element={<CompliancePage />} />

            <Route path="/about" element={<PubleeshLanding />} />
            <Route path="/publications" element={<PubleeshLanding />} />
            <Route path="/network" element={<PubleeshLanding />} />
            <Route path="/institution" element={<PubleeshLanding />} />
            <Route path="/advisory" element={<PubleeshLanding />} />
            <Route path="/publishing" element={<PubleeshLanding />} />
            <Route path="/publishing/submit" element={<PubleeshLanding />} />

            <Route path="*" element={<NotFound />} />
          </Routes>
          </SubscriptionProvider>
          </ModuleUnlocksProvider>
        </AuthProvider>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
