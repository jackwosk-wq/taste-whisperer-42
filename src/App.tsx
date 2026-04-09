import { useState } from "react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Route, Routes, Navigate, useLocation } from "react-router-dom";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { AuthProvider, useAuth } from "@/context/AuthContext";
import Navbar from "@/components/Navbar";
import Index from "@/pages/Index";
import DiscoverPage from "@/pages/Discover";
import TravelerMode from "@/pages/TravelerMode";
import SavedPage from "@/pages/SavedPage";
import AuthPage from "@/pages/AuthPage";
import OnboardingPage from "@/pages/OnboardingPage";
import NotFound from "@/pages/NotFound";
import type { City } from "@/data/restaurants";

const queryClient = new QueryClient();

// Redirects unauthenticated users to /auth
function RequireAuth({ children }: { children: React.ReactNode }) {
  const { user, onboarding, isLoading } = useAuth();
  if (isLoading) return null;
  if (!user) return <Navigate to="/auth" replace />;
  if (!onboarding) return <Navigate to="/onboarding" replace />;
  return <>{children}</>;
}

// Redirects already-authed users away from auth/onboarding pages
function RedirectIfAuthed({ children }: { children: React.ReactNode }) {
  const { user, onboarding, isLoading } = useAuth();
  if (isLoading) return null;
  if (user && onboarding) return <Navigate to="/discover" replace />;
  if (user && !onboarding) return <Navigate to="/onboarding" replace />;
  return <>{children}</>;
}

function AppRoutes() {
  const [selectedCity, setSelectedCity] = useState<City>("NYC");
  const { user, onboarding } = useAuth();

  const { pathname } = useLocation();
  const showNav = !!user && !!onboarding && pathname !== "/onboarding" && pathname !== "/auth";

  return (
    <>
      {showNav && <Navbar selectedCity={selectedCity} onCityChange={setSelectedCity} />}
      <Routes>
        {/* Public */}
        <Route path="/auth" element={<RedirectIfAuthed><AuthPage /></RedirectIfAuthed>} />
        <Route path="/onboarding" element={<OnboardingPage />} />

        {/* Protected */}
        <Route path="/" element={<RequireAuth><Index selectedCity={selectedCity} onCityChange={setSelectedCity} /></RequireAuth>} />
        <Route path="/discover" element={<RequireAuth><DiscoverPage selectedCity={selectedCity} onCityChange={setSelectedCity} /></RequireAuth>} />
        <Route path="/traveler" element={<RequireAuth><TravelerMode /></RequireAuth>} />
        <Route path="/saved" element={<RequireAuth><SavedPage /></RequireAuth>} />

        <Route path="*" element={<NotFound />} />
      </Routes>
    </>
  );
}

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <AuthProvider>
        <BrowserRouter>
          <AppRoutes />
        </BrowserRouter>
      </AuthProvider>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
