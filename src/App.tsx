import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { initializeSampleData, initializeUsers, initializeSchedule } from "./lib/localStorage";
import Index from "./pages/Index";
import BrowseBooks from "./pages/BrowseBooks";
import Dashboard from "./pages/Dashboard";
import DonationForm from "./pages/DonationForm";
import VolunteerLogin from "./pages/VolunteerLogin";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

// Initialize data on app load
initializeSampleData();
initializeUsers();
initializeSchedule();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/browse" element={<BrowseBooks />} />
          <Route path="/volunteer-login" element={<VolunteerLogin />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/donation" element={<DonationForm />} />
          {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
