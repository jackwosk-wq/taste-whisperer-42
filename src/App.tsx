import { useState } from "react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import Navbar from "@/components/Navbar";
import Index from "@/pages/Index";
import DiscoverPage from "@/pages/Discover";
import TravelerMode from "@/pages/TravelerMode";
import SavedPage from "@/pages/SavedPage";
import AuthPage from "@/pages/AuthPage";
import NotFound from "@/pages/NotFound";
import type { City } from "@/data/restaurants";

const queryClient = new QueryClient();

const App = () => {
  const [selectedCity, setSelectedCity] = useState<City>("NYC");

  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Navbar selectedCity={selectedCity} onCityChange={setSelectedCity} />
          <Routes>
            <Route path="/" element={<Index selectedCity={selectedCity} onCityChange={setSelectedCity} />} />
            <Route path="/discover" element={<DiscoverPage selectedCity={selectedCity} onCityChange={setSelectedCity} />} />
            <Route path="/traveler" element={<TravelerMode />} />
            <Route path="/saved" element={<SavedPage />} />
            <Route path="/auth" element={<AuthPage />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </QueryClientProvider>
  );
};

export default App;
