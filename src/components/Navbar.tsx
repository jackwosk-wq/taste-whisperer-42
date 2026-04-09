import { useState, useRef, useEffect } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { MapPin, Moon, Sun, Heart, Compass, Menu, X, LogOut, ChevronDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cities, type City } from "@/data/restaurants";
import { useAuth } from "@/context/AuthContext";
import { motion, AnimatePresence } from "framer-motion";

interface NavbarProps {
  selectedCity: City;
  onCityChange: (city: City) => void;
}

export default function Navbar({ selectedCity, onCityChange }: NavbarProps) {
  const [dark, setDark] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [cityDropdownOpen, setCityDropdownOpen] = useState(false);
  const cityDropdownRef = useRef<HTMLDivElement>(null);
  const location = useLocation();
  const navigate = useNavigate();
  const { user, signOut } = useAuth();

  const handleSignOut = () => {
    signOut();
    navigate("/auth");
  };

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (cityDropdownRef.current && !cityDropdownRef.current.contains(e.target as Node)) {
        setCityDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const toggleDark = () => {
    setDark(!dark);
    document.documentElement.classList.toggle("dark");
  };

  const navLinks = [
    { to: "/discover", label: "Discover", icon: Compass },
    { to: "/traveler", label: "Traveler Mode", icon: MapPin },
    { to: "/saved", label: "Saved", icon: Heart },
  ];

  return (
    <nav className="sticky top-0 z-50 border-b border-border bg-background/80 backdrop-blur-xl">
      <div className="container flex h-16 items-center justify-between">
        <div className="flex items-center gap-6">
          <Link to="/" className="flex items-center gap-2">
            <span className="text-2xl font-heading font-bold gradient-text">Tasterra</span>
          </Link>
          <div className="hidden md:flex items-center gap-1">
            {navLinks.map(({ to, label }) => (
              <Link
                key={to}
                to={to}
                className={`px-3 py-2 text-sm font-medium rounded-lg transition-colors ${
                  location.pathname === to
                    ? "bg-primary/10 text-primary"
                    : "text-muted-foreground hover:text-foreground hover:bg-muted"
                }`}
              >
                {label}
              </Link>
            ))}
          </div>
        </div>

        <div className="flex items-center gap-3">
          {/* City selector */}
          <div className="hidden sm:block relative group">
            <button className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-muted text-sm font-medium text-foreground transition-colors hover:bg-muted/80">
              <MapPin className="h-3.5 w-3.5 text-primary" />
              {selectedCity}
            </button>
            <div className="absolute top-full right-0 mt-1 min-w-[140px] rounded-lg border border-border bg-popover shadow-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 py-1 z-50">
              {cities.filter(city => city !== selectedCity).map(city => (
                <button
                  key={city}
                  onClick={() => onCityChange(city)}
                  className="w-full text-left px-4 py-2 text-sm text-muted-foreground hover:text-foreground hover:bg-muted transition-colors"
                >
                  {city}
                </button>
              ))}
            </div>
          </div>

          <button onClick={toggleDark} className="p-2 rounded-lg text-muted-foreground hover:text-foreground hover:bg-muted transition-colors">
            {dark ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
          </button>

          {user ? (
            <div className="flex items-center gap-2">
              <div className="hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-full bg-muted text-sm font-medium text-foreground">
                <div className="w-6 h-6 rounded-full gradient-primary flex items-center justify-center text-primary-foreground text-xs font-bold">
                  {user.name.charAt(0).toUpperCase()}
                </div>
                {user.name.split(" ")[0]}
              </div>
              <button onClick={handleSignOut} className="p-2 rounded-lg text-muted-foreground hover:text-foreground hover:bg-muted transition-colors" title="Sign out">
                <LogOut className="h-4 w-4" />
              </button>
            </div>
          ) : (
            <Link to="/auth">
              <Button size="sm" className="gradient-primary text-primary-foreground font-semibold shadow-md hover:shadow-lg transition-shadow">
                Get Early Access
              </Button>
            </Link>
          )}

          <button className="md:hidden p-2" onClick={() => setMenuOpen(!menuOpen)}>
            {menuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      {menuOpen && (
        <div className="md:hidden border-t border-border bg-background p-4 space-y-2">
          {navLinks.map(({ to, label, icon: Icon }) => (
            <Link
              key={to}
              to={to}
              onClick={() => setMenuOpen(false)}
              className={`flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-colors ${
                location.pathname === to
                  ? "bg-primary/10 text-primary"
                  : "text-muted-foreground hover:bg-muted"
              }`}
            >
              <Icon className="h-4 w-4" />
              {label}
            </Link>
          ))}
          <div className="flex flex-wrap gap-2 pt-2 px-4">
            {cities.map(city => (
              <button
                key={city}
                onClick={() => { onCityChange(city); setMenuOpen(false); }}
                className={`px-3 py-1 text-xs font-medium rounded-full transition-all ${
                  selectedCity === city
                    ? "bg-primary text-primary-foreground"
                    : "bg-muted text-muted-foreground"
                }`}
              >
                {city}
              </button>
            ))}
          </div>
        </div>
      )}
    </nav>
  );
}
