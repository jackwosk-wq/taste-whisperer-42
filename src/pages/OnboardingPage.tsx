import { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowRight, Check, X, Search, Loader2 } from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import { usePlacesSearch, type RestaurantDetails } from "@/hooks/usePlacesSearch";
import { cities, type City } from "@/data/restaurants";
import { Button } from "@/components/ui/button";

const CUISINE_OPTIONS = [
  "Italian", "Japanese", "Mexican", "Indian", "Chinese",
  "French", "Thai", "Mediterranean", "American", "Korean",
  "Vietnamese", "Spanish", "Middle Eastern", "Greek", "Peruvian",
  "Ethiopian", "Caribbean", "Brazilian", "Seafood", "Vegetarian",
];

const CITY_SEARCH_MAP: Record<City, string> = {
  NYC: "New York City",
  "Los Angeles": "Los Angeles",
  DC: "Washington DC",
  Chicago: "Chicago",
  Miami: "Miami",
};

// ─── Step 4 is its own component so the Places hook only loads when needed ───
function RestaurantSearchStep({
  selectedCity,
  selectedRestaurants,
  onAdd,
  onRemove,
  onBack,
  onFinish,
}: {
  selectedCity: City;
  selectedRestaurants: RestaurantDetails[];
  onAdd: (r: RestaurantDetails) => void;
  onRemove: (placeId: string) => void;
  onBack: () => void;
  onFinish: () => void;
}) {
  const [restaurantSearch, setRestaurantSearch] = useState("");
  const [showDropdown, setShowDropdown] = useState(false);
  const [loadingDetails, setLoadingDetails] = useState<string | null>(null);
  const searchRef = useRef<HTMLDivElement>(null);

  const { search, suggestions, setSuggestions, isSearching, isApiReady, getDetails } =
    usePlacesSearch(CITY_SEARCH_MAP[selectedCity]);

  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (searchRef.current && !searchRef.current.contains(e.target as Node)) {
        setShowDropdown(false);
      }
    }
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, []);

  const handleInput = (value: string) => {
    setRestaurantSearch(value);
    setShowDropdown(true);
    search(value);
  };

  const handleSelect = async (placeId: string, name: string) => {
    if (selectedRestaurants.find((r) => r.placeId === placeId)) {
      setShowDropdown(false);
      setRestaurantSearch("");
      return;
    }
    setLoadingDetails(placeId);
    setShowDropdown(false);
    setRestaurantSearch("");
    setSuggestions([]);
    try {
      const details = await getDetails(placeId);
      onAdd(details);
    } catch {
      onAdd({ placeId, name, cuisine: "Restaurant", priceLevel: "", photoUrl: null, address: "" });
    }
    setLoadingDetails(null);
  };

  return (
    <>
      <div className="space-y-1">
        <h2 className="text-2xl font-heading font-bold text-foreground">
          Favorite spots in {selectedCity}? 🌟
        </h2>
        <p className="text-sm text-muted-foreground">
          Name a few places you love — Tasterra learns your taste from where you already go.
        </p>
      </div>

      {/* Search box */}
      <div className="relative" ref={searchRef}>
        <div className="flex items-center gap-2 rounded-xl border border-input bg-background px-4 py-2.5 focus-within:ring-2 focus-within:ring-ring">
          {isSearching ? (
            <Loader2 className="h-4 w-4 text-muted-foreground animate-spin flex-shrink-0" />
          ) : (
            <Search className="h-4 w-4 text-muted-foreground flex-shrink-0" />
          )}
          <input
            value={restaurantSearch}
            onChange={(e) => handleInput(e.target.value)}
            onFocus={() => restaurantSearch.length >= 2 && setShowDropdown(true)}
            placeholder={
              isApiReady
                ? `Search any restaurant in ${selectedCity}…`
                : "Loading restaurant search…"
            }
            disabled={!isApiReady}
            className="flex-1 bg-transparent text-sm placeholder:text-muted-foreground focus:outline-none"
          />
        </div>

        {/* Dropdown */}
        {showDropdown && suggestions.length > 0 && (
          <div className="absolute top-full left-0 right-0 mt-1 bg-card border border-border rounded-xl shadow-lg z-50 overflow-hidden">
            {suggestions.map((s) => (
              <button
                key={s.placeId}
                onClick={() => handleSelect(s.placeId, s.name)}
                disabled={!!loadingDetails}
                className="w-full flex items-center gap-3 px-4 py-3 hover:bg-muted transition-colors text-left border-b border-border last:border-0"
              >
                <div className="w-10 h-10 rounded-lg bg-muted flex items-center justify-center flex-shrink-0 text-lg">
                  🍽️
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-foreground truncate">{s.name}</p>
                  <p className="text-xs text-muted-foreground truncate">{s.address}</p>
                </div>
                {loadingDetails === s.placeId && (
                  <Loader2 className="h-4 w-4 animate-spin text-muted-foreground flex-shrink-0" />
                )}
              </button>
            ))}
          </div>
        )}
      </div>

      {loadingDetails && (
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <Loader2 className="h-4 w-4 animate-spin" />
          Adding restaurant…
        </div>
      )}

      {/* Selected restaurants grid */}
      {selectedRestaurants.length > 0 && (
        <div className="grid grid-cols-2 gap-3">
          {selectedRestaurants.map((r) => (
            <div
              key={r.placeId}
              className="relative flex flex-col rounded-xl border border-border bg-background overflow-hidden group"
            >
              <div className="w-full h-24 bg-muted overflow-hidden">
                {r.photoUrl ? (
                  <img src={r.photoUrl} alt={r.name} className="w-full h-full object-cover" />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-3xl">🍽️</div>
                )}
              </div>
              <div className="p-2.5">
                <p className="text-sm font-semibold text-foreground leading-tight truncate">{r.name}</p>
                <p className="text-xs text-muted-foreground mt-0.5">
                  {r.cuisine}{r.priceLevel ? ` · ${r.priceLevel}` : ""}
                </p>
              </div>
              <button
                onClick={() => onRemove(r.placeId)}
                className="absolute top-1.5 right-1.5 w-6 h-6 rounded-full bg-black/50 text-white flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity hover:bg-black/70"
              >
                <X className="h-3 w-3" />
              </button>
            </div>
          ))}
        </div>
      )}

      <div className="flex gap-3">
        <Button variant="outline" className="flex-1" onClick={onBack}>
          Back
        </Button>
        <Button
          className="flex-1 gradient-primary text-primary-foreground font-semibold"
          onClick={onFinish}
        >
          Start discovering ✨
        </Button>
      </div>
    </>
  );
}

// ─── Main onboarding component ────────────────────────────────────────────────
export default function OnboardingPage() {
  const { user, completeOnboarding } = useAuth();
  const navigate = useNavigate();
  const [step, setStep] = useState(1);

  const [selectedCuisines, setSelectedCuisines] = useState<string[]>([]);
  const [customCuisine, setCustomCuisine] = useState("");
  const [selectedCity, setSelectedCity] = useState<City>("NYC");
  const [age, setAge] = useState("");
  const [selectedRestaurants, setSelectedRestaurants] = useState<RestaurantDetails[]>([]);

  const toggleCuisine = (cuisine: string) =>
    setSelectedCuisines((prev) =>
      prev.includes(cuisine) ? prev.filter((c) => c !== cuisine) : [...prev, cuisine]
    );

  const addCustomCuisine = () => {
    const val = customCuisine.trim();
    if (val && !selectedCuisines.includes(val)) {
      setSelectedCuisines((prev) => [...prev, val]);
      setCustomCuisine("");
    }
  };

  const handleFinish = () => {
    completeOnboarding({
      cuisines: selectedCuisines,
      city: selectedCity,
      age: parseInt(age),
      favoriteRestaurants: selectedRestaurants,
    });
    navigate("/discover");
  };

  const firstName = user?.name?.split(" ")[0] || "there";

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <div className="w-full max-w-lg">

        <div className="text-center mb-8">
          <span className="text-3xl font-heading font-bold gradient-text">Tasterra</span>
        </div>

        {/* Progress bar */}
        <div className="flex gap-2 mb-8">
          {[1, 2, 3, 4].map((i) => (
            <div
              key={i}
              className={`h-1.5 flex-1 rounded-full transition-all duration-500 ${
                i <= step ? "gradient-primary" : "bg-muted"
              }`}
            />
          ))}
        </div>

        <div className="bg-card border border-border rounded-2xl p-7 shadow-lg space-y-6">

          {/* ── STEP 1: Cuisines ── */}
          {step === 1 && (
            <>
              <div className="space-y-1">
                <h2 className="text-2xl font-heading font-bold text-foreground">
                  Hey {firstName}! What cuisines do you love? 🍜
                </h2>
                <p className="text-sm text-muted-foreground">
                  Select everything that sounds good — the more you pick, the better your recs.
                </p>
              </div>

              <div className="flex flex-wrap gap-2">
                {CUISINE_OPTIONS.map((cuisine) => (
                  <button
                    key={cuisine}
                    onClick={() => toggleCuisine(cuisine)}
                    className={`flex items-center gap-1.5 px-3.5 py-2 rounded-full text-sm font-medium border transition-all ${
                      selectedCuisines.includes(cuisine)
                        ? "gradient-primary text-primary-foreground border-transparent shadow-sm"
                        : "bg-background border-border text-muted-foreground hover:border-primary/40 hover:text-foreground"
                    }`}
                  >
                    {selectedCuisines.includes(cuisine) && <Check className="h-3 w-3" />}
                    {cuisine}
                  </button>
                ))}
              </div>

              <div className="flex gap-2">
                <input
                  value={customCuisine}
                  onChange={(e) => setCustomCuisine(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && addCustomCuisine()}
                  placeholder="Add another cuisine…"
                  className="flex-1 rounded-xl border border-input bg-background px-4 py-2.5 text-sm placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring"
                />
                <button
                  onClick={addCustomCuisine}
                  disabled={!customCuisine.trim()}
                  className="gradient-primary text-primary-foreground rounded-xl px-4 py-2.5 disabled:opacity-40 transition-opacity text-sm font-medium"
                >
                  Add
                </button>
              </div>

              <Button
                className="w-full gradient-primary text-primary-foreground font-semibold"
                disabled={selectedCuisines.length === 0}
                onClick={() => setStep(2)}
              >
                Continue <ArrowRight className="h-4 w-4 ml-1" />
              </Button>
            </>
          )}

          {/* ── STEP 2: City ── */}
          {step === 2 && (
            <>
              <div className="space-y-1">
                <h2 className="text-2xl font-heading font-bold text-foreground">
                  Where are you based? 📍
                </h2>
                <p className="text-sm text-muted-foreground">
                  We'll prioritize recommendations in your city. More cities coming soon.
                </p>
              </div>

              <div className="flex flex-col gap-3">
                {cities.map((city) => (
                  <button
                    key={city}
                    onClick={() => setSelectedCity(city)}
                    className={`flex items-center justify-between px-5 py-4 rounded-xl border text-sm font-medium transition-all ${
                      selectedCity === city
                        ? "gradient-primary text-primary-foreground border-transparent shadow-md"
                        : "bg-background border-border text-foreground hover:border-primary/40"
                    }`}
                  >
                    <span>{city}</span>
                    {selectedCity === city && <Check className="h-4 w-4" />}
                  </button>
                ))}
              </div>

              <div className="flex gap-3">
                <Button variant="outline" className="flex-1" onClick={() => setStep(1)}>Back</Button>
                <Button
                  className="flex-1 gradient-primary text-primary-foreground font-semibold"
                  onClick={() => setStep(3)}
                >
                  Continue <ArrowRight className="h-4 w-4 ml-1" />
                </Button>
              </div>
            </>
          )}

          {/* ── STEP 3: Age ── */}
          {step === 3 && (
            <>
              <div className="space-y-1">
                <h2 className="text-2xl font-heading font-bold text-foreground">
                  How old are you? 🎂
                </h2>
                <p className="text-sm text-muted-foreground">
                  Different restaurants appeal to different ages. This helps us tune your recommendations.
                </p>
              </div>

              <input
                type="number"
                value={age}
                onChange={(e) => setAge(e.target.value)}
                placeholder="Enter your age"
                min={13}
                max={120}
                className="w-full rounded-xl border border-input bg-background px-4 py-3 text-lg placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring"
              />

              <div className="flex gap-3">
                <Button variant="outline" className="flex-1" onClick={() => setStep(2)}>Back</Button>
                <Button
                  className="flex-1 gradient-primary text-primary-foreground font-semibold"
                  disabled={!age || parseInt(age) < 13 || parseInt(age) > 120}
                  onClick={() => setStep(4)}
                >
                  Continue <ArrowRight className="h-4 w-4 ml-1" />
                </Button>
              </div>
            </>
          )}

          {/* ── STEP 4: Restaurants — isolated so Places hook only loads here ── */}
          {step === 4 && (
            <RestaurantSearchStep
              selectedCity={selectedCity}
              selectedRestaurants={selectedRestaurants}
              onAdd={(r) => setSelectedRestaurants((prev) => [...prev, r])}
              onRemove={(id) => setSelectedRestaurants((prev) => prev.filter((r) => r.placeId !== id))}
              onBack={() => setStep(3)}
              onFinish={handleFinish}
            />
          )}
        </div>

        <p className="text-center text-xs text-muted-foreground mt-4">
          Step {step} of 4
        </p>
      </div>
    </div>
  );
}
