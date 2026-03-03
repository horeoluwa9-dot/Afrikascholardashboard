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
import DashboardPubleesh from "./pages/dashboard/DashboardPubleesh";
import DashboardPublishing from "./pages/dashboard/DashboardPublishing";
import DashboardNetwork from "./pages/dashboard/DashboardNetwork";
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
          <Route path="/dashboard/publeesh" element={<DashboardPubleesh />} />
          <Route path="/dashboard/publishing" element={<DashboardPublishing />} />
          <Route path="/dashboard/network" element={<DashboardNetwork />} />

          <Route path="/compliance/responsible-ai" element={<CompliancePage />} />

          {/* Placeholder routes for nav links */}
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
