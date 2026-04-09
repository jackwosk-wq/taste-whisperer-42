import { createContext, useContext, useState, useEffect, type ReactNode } from "react";
import type { City } from "@/data/restaurants";

export interface TasterraUser {
  name: string;
  email: string;
  authMethod: "google" | "apple" | "email";
}

export interface OnboardingData {
  cuisines: string[];
  city: City;
  age: number;
  favoriteRestaurants: RestaurantDetails[];
}

export interface RestaurantDetails {
  placeId: string;
  name: string;
  cuisine: string;
  priceLevel: string;
  photoUrl: string | null;
  address: string;
}

interface AuthContextType {
  user: TasterraUser | null;
  onboarding: OnboardingData | null;
  isLoading: boolean;
  signIn: (user: TasterraUser) => void;
  signOut: () => void;
  completeOnboarding: (data: OnboardingData) => void;
}

const AuthContext = createContext<AuthContextType | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<TasterraUser | null>(null);
  const [onboarding, setOnboarding] = useState<OnboardingData | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const storedUser = localStorage.getItem("tasterra_user");
    const storedOnboarding = localStorage.getItem("tasterra_onboarding");
    if (storedUser) setUser(JSON.parse(storedUser));
    if (storedOnboarding) setOnboarding(JSON.parse(storedOnboarding));
    setIsLoading(false);
  }, []);

  const signIn = (userData: TasterraUser) => {
    setUser(userData);
    localStorage.setItem("tasterra_user", JSON.stringify(userData));
  };

  const signOut = () => {
    setUser(null);
    setOnboarding(null);
    localStorage.removeItem("tasterra_user");
    localStorage.removeItem("tasterra_onboarding");
  };

  const completeOnboarding = (data: OnboardingData) => {
    setOnboarding(data);
    localStorage.setItem("tasterra_onboarding", JSON.stringify(data));
  };

  return (
    <AuthContext.Provider value={{ user, onboarding, isLoading, signIn, signOut, completeOnboarding }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
}
