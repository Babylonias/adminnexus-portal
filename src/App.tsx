import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { Dashboard } from "@/pages/Dashboard";
import { Universities } from "@/pages/Universities";
import { Amphitheaters } from "@/pages/Amphitheaters";
import { UniversityClassrooms } from "@/pages/UniversityClassrooms";
import { Notifications } from "@/pages/Notifications";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={
            <DashboardLayout>
              <Dashboard />
            </DashboardLayout>
          } />
          <Route path="/universities" element={
            <DashboardLayout>
              <Universities />
            </DashboardLayout>
          } />
          <Route path="/amphitheaters" element={
            <DashboardLayout>
              <Amphitheaters />
            </DashboardLayout>
          } />
          <Route path="/universities/:universityId/classrooms" element={
            <DashboardLayout>
              <UniversityClassrooms />
            </DashboardLayout>
          } />
          <Route path="/notifications" element={
            <DashboardLayout>
              <Notifications />
            </DashboardLayout>
          } />
          <Route path="/settings" element={
            <DashboardLayout>
              <div className="text-center py-12">
                <h1 className="text-2xl font-bold mb-4">Paramètres</h1>
                <p className="text-muted-foreground">Page en cours de développement</p>
              </div>
            </DashboardLayout>
          } />
          {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
