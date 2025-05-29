import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import Dashboard from "./pages/Dashboard";
import DocumentsPage from "./pages/DocumentsPage";
import DocumentUploadPage from "./pages/DocumentUploadPage";
import DocumentViewPage from "./pages/DocumentViewPage";
import CompliancesPage from "./pages/CompliancesPage";
import NotFound from "./pages/NotFound";
import About from "./pages/About";
import Mission from "./pages/Mission";
import Contact from "./pages/Contact";
import Terms from "./pages/Terms";
import Privacy from "./pages/Privacy";
import { useEffect } from "react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { AuthProvider } from "@/contexts/AuthContext";
import ProfessionalProtectedRoute from "./components/ProfessionalProtectedRoute";
import ProfessionalOnboarding from "./pages/ProfessionalOnboarding";
import ProfessionalDashboard from "./pages/ProfessionalDashboard";
import ClientDetailsPage from "./pages/ClientDetailsPage";
import ClientDocumentsPage from "./pages/ClientDocumentsPage";
import Auth from "./pages/Auth";
import GetStarted from "./pages/GetStarted";

const App = () => {
  // Initialize dark mode based on user preference
  useEffect(() => {
    const storedTheme = localStorage.getItem('theme');
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    
    if (storedTheme === 'dark' || (!storedTheme && prefersDark)) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, []);

  const queryClient = new QueryClient();

  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <TooltipProvider>
          <Toaster />
          <Sonner />
          <BrowserRouter>
            <Routes>
              <Route path="/" element={<Index />} />
              <Route path="/auth" element={<Auth />} />
              <Route path="/get-started" element={<GetStarted />} />
              <Route path="/dashboard" element={<Dashboard />} />
              <Route path="/documents" element={<DocumentsPage />} />
              <Route path="/documents/upload" element={<DocumentUploadPage />} />
              <Route path="/documents/:id" element={<DocumentViewPage />} />
              <Route path="/compliances" element={<CompliancesPage />} />
              <Route path="/about" element={<About />} />
              <Route path="/mission" element={<Mission />} />
              <Route path="/contact" element={<Contact />} />
              <Route path="/terms" element={<Terms />} />
              <Route path="/privacy" element={<Privacy />} />
              
              {/* Professional routes */}
              <Route path="/professional/onboarding" element={
                <ProfessionalProtectedRoute requiresOnboarding={false}>
                  <ProfessionalOnboarding />
                </ProfessionalProtectedRoute>
              } />
              <Route path="/professional/dashboard" element={
                <ProfessionalProtectedRoute requiresOnboarding={true}>
                  <ProfessionalDashboard />
                </ProfessionalProtectedRoute>
              } />
              <Route path="/professional/clients/:clientId" element={
                <ProfessionalProtectedRoute requiresOnboarding={true}>
                  <ClientDetailsPage />
                </ProfessionalProtectedRoute>
              } />
              <Route path="/professional/clients/:clientId/documents" element={
                <ProfessionalProtectedRoute requiresOnboarding={true}>
                  <ClientDocumentsPage />
                </ProfessionalProtectedRoute>
              } />
              
              {/* Fallback for not found routes */}
              <Route path="*" element={<NotFound />} />
            </Routes>
          </BrowserRouter>
        </TooltipProvider>
      </AuthProvider>
    </QueryClientProvider>
  );
};

export default App;
