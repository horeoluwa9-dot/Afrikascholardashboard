import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
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
import DatasetExplorer from "./pages/dashboard/DatasetExplorer";
import DatasetAnalyzer from "./pages/dashboard/DatasetAnalyzer";
import CommunityPage from "./pages/dashboard/CommunityPage";
import IntelligenceHub from "./pages/dashboard/IntelligenceHub";
import TrackSubmissions from "./pages/dashboard/TrackSubmissions";
import InstrumentStudio from "./pages/dashboard/InstrumentStudio";
import SettingsPage from "./pages/dashboard/SettingsPage";
import BillingPage from "./pages/dashboard/BillingPage";
import PlaceholderPage from "./pages/dashboard/PlaceholderPage";
import Features from "./pages/Features";
import InstitutionalDemo from "./pages/InstitutionalDemo";
import CompliancePage from "./pages/CompliancePage";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Navigate to="/publeesh" replace />} />
          <Route path="/publeesh" element={<PubleeshLanding />} />
          <Route path="/publeesh/pricing" element={<PricingPage />} />
          <Route path="/publeesh/features" element={<Features />} />
          <Route path="/publeesh/institutional-demo" element={<InstitutionalDemo />} />

          <Route path="/auth/login" element={<Login />} />
          <Route path="/auth/signup" element={<Signup />} />
          <Route path="/auth/forgot-password" element={<ForgotPassword />} />
          <Route path="/auth/reset-password" element={<ResetPassword />} />
          <Route path="/auth/verify-email" element={<VerifyEmail />} />
          <Route path="/auth/onboarding" element={<Onboarding />} />

          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/dashboard/generate-paper" element={<GeneratePaper />} />
          <Route path="/dashboard/my-papers" element={<PlaceholderPage title="My Papers" breadcrumbs={["My Research", "My Papers"]} description="View and manage all your generated research papers." />} />
          <Route path="/dashboard/data/explorer" element={<DatasetExplorer />} />
          <Route path="/dashboard/data/analyzer" element={<DatasetAnalyzer />} />
          <Route path="/dashboard/intelligence" element={<IntelligenceHub />} />
          <Route path="/dashboard/intelligence/journals" element={<IntelligenceHub />} />
          <Route path="/dashboard/intelligence/conferences" element={<IntelligenceHub />} />
          <Route path="/dashboard/intelligence/stakeholders" element={<IntelligenceHub />} />
          <Route path="/dashboard/intelligence/gaps" element={<IntelligenceHub />} />
          <Route path="/dashboard/publishing/submit" element={<PlaceholderPage title="Submit Manuscript" breadcrumbs={["Publishing", "Submit Manuscript"]} description="Submit your research manuscript for publication." />} />
          <Route path="/dashboard/publishing/track" element={<TrackSubmissions />} />
          <Route path="/dashboard/instrument-studio" element={<InstrumentStudio />} />
          <Route path="/dashboard/community" element={<CommunityPage />} />
          <Route path="/dashboard/billing" element={<BillingPage />} />
          <Route path="/dashboard/settings" element={<SettingsPage />} />

          {/* Legacy redirects */}
          <Route path="/dashboard/publeesh" element={<Navigate to="/dashboard" replace />} />
          <Route path="/dashboard/publishing" element={<Navigate to="/dashboard/publishing/submit" replace />} />
          <Route path="/dashboard/network" element={<Navigate to="/dashboard/community" replace />} />
          <Route path="/dashboard/datasets" element={<Navigate to="/dashboard/data/explorer" replace />} />
          <Route path="/dashboard/analyzer" element={<Navigate to="/dashboard/data/analyzer" replace />} />

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
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
