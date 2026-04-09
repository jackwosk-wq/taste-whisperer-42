import { useState } from "react";
import { Plane, RefreshCw, Calendar, Utensils, MapPin, Sparkles, ChevronRight, Coffee, Sun, Moon } from "lucide-react";
import { Button } from "@/components/ui/button";
import RestaurantCard from "@/components/RestaurantCard";
import { restaurants, getRestaurantsByCity, cities, type City } from "@/data/restaurants";
import { motion, AnimatePresence } from "framer-motion";

interface MealSlot {
  meal: string;
  icon: React.ReactNode;
  restaurant: typeof restaurants[0];
}

interface DayPlan {
  day: number;
  meals: MealSlot[];
}

const cityImages: Record<City, string> = {
  NYC: "https://images.unsplash.com/photo-1496442226666-8d4d0e62e6e9?w=1200&q=80",
  "Los Angeles": "https://images.unsplash.com/photo-1534190760961-74e8c1c5c3da?w=1200&q=80",
  DC: "https://images.unsplash.com/photo-1501466044931-62695aada8e9?w=1200&q=80",
  Chicago: "https://images.unsplash.com/photo-1494522855154-9297ac14b55f?w=1200&q=80",
  Miami: "https://images.unsplash.com/photo-1533106497176-45ae19e68ba2?w=1200&q=80",
};

const mealIcons = {
  Breakfast: <Coffee className="h-4 w-4" />,
  Lunch: <Sun className="h-4 w-4" />,
  Dinner: <Moon className="h-4 w-4" />,
};

export default function TravelerMode() {
  const [city, setCity] = useState<City>("NYC");
  const [days, setDays] = useState(3);
  const [generated, setGenerated] = useState(false);
  const [itinerary, setItinerary] = useState<DayPlan[]>([]);

  const generateItinerary = () => {
    const cityPool = getRestaurantsByCity(city);
    const pool = cityPool.length > 0 ? cityPool : restaurants;
    const plans: DayPlan[] = [];
    for (let d = 1; d <= days; d++) {
      plans.push({
        day: d,
        meals: [
          { meal: "Breakfast", icon: mealIcons.Breakfast, restaurant: pool[(d * 3) % pool.length] },
          { meal: "Lunch", icon: mealIcons.Lunch, restaurant: pool[(d * 3 + 1) % pool.length] },
          { meal: "Dinner", icon: mealIcons.Dinner, restaurant: pool[(d * 3 + 2) % pool.length] },
        ],
      });
    }
    setItinerary(plans);
    setGenerated(true);
  };

  const regenerateMeal = (dayIndex: number, mealIndex: number) => {
    setItinerary(prev => {
      const copy = [...prev];
      const cityPool = getRestaurantsByCity(city);
      const pool = cityPool.length > 0 ? cityPool : restaurants;
      const randomR = pool[Math.floor(Math.random() * pool.length)];
      copy[dayIndex] = {
        ...copy[dayIndex],
        meals: copy[dayIndex].meals.map((m, i) =>
          i === mealIndex ? { ...m, restaurant: randomR } : m
        ),
      };
      return copy;
    });
  };

  return (
    <div className="min-h-screen">
      {/* Hero Section with City Image */}
      <div className="relative h-[50vh] min-h-[400px] overflow-hidden">
        <AnimatePresence mode="wait">
          <motion.div
            key={city}
            initial={{ opacity: 0, scale: 1.1 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 1.05 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="absolute inset-0"
          >
            <img
              src={cityImages[city]}
              alt={city}
              className="w-full h-full object-cover"
            />
          </motion.div>
        </AnimatePresence>
        <div className="absolute inset-0 bg-gradient-to-b from-background/30 via-background/50 to-background" />
        
        <div className="absolute inset-0 flex flex-col items-center justify-center text-center px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-primary/90 text-primary-foreground text-sm font-semibold mb-4 backdrop-blur-sm shadow-lg"
          >
            <Plane className="h-4 w-4" /> Traveler Mode
          </motion.div>
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.35 }}
            className="text-4xl md:text-6xl font-heading font-bold text-foreground drop-shadow-sm"
          >
            Plan your whole trip,<br />
            <span className="gradient-text">one meal at a time.</span>
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="text-muted-foreground max-w-xl mx-auto mt-4 text-base md:text-lg"
          >
            Tell us where you're going and we'll build your perfect dining itinerary — breakfast, lunch, and dinner, every day.
          </motion.p>
        </div>
      </div>

      {/* Form - overlapping hero */}
      <div className="container relative -mt-12 z-10 pb-16">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className="max-w-2xl mx-auto bg-card/95 backdrop-blur-md border border-border rounded-2xl p-6 md:p-8 shadow-xl space-y-5"
        >
          {/* City Selector - Visual Tiles */}
          <div>
            <label className="text-sm font-semibold text-foreground mb-3 block flex items-center gap-1.5">
              <MapPin className="h-3.5 w-3.5 text-primary" /> Where are you headed?
            </label>
            <div className="grid grid-cols-5 gap-2">
              {cities.map(c => (
                <button
                  key={c}
                  onClick={() => setCity(c)}
                  className={`relative rounded-xl overflow-hidden h-20 transition-all duration-300 group ${
                    city === c
                      ? "ring-2 ring-primary ring-offset-2 ring-offset-card shadow-lg scale-[1.02]"
                      : "opacity-70 hover:opacity-100 hover:scale-[1.01]"
                  }`}
                >
                  <img
                    src={cityImages[c]}
                    alt={c}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-foreground/70 to-transparent" />
                  <span className="absolute bottom-1.5 left-0 right-0 text-center text-xs font-bold text-primary-foreground drop-shadow-md">
                    {c}
                  </span>
                </button>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-sm font-semibold text-foreground mb-1.5 block flex items-center gap-1.5">
                <Calendar className="h-3.5 w-3.5 text-primary" /> Duration
              </label>
              <select
                value={days}
                onChange={e => setDays(Number(e.target.value))}
                className="w-full rounded-xl border border-input bg-background px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-ring font-medium"
              >
                {[1, 2, 3, 4, 5, 7].map(d => (
                  <option key={d} value={d}>{d} {d === 1 ? "day" : "days"}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="text-sm font-semibold text-foreground mb-1.5 block flex items-center gap-1.5">
                <Sparkles className="h-3.5 w-3.5 text-primary" /> Guests
              </label>
              <select className="w-full rounded-xl border border-input bg-background px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-ring font-medium">
                {[1, 2, 3, 4, 5, 6].map(g => (
                  <option key={g} value={g}>{g} {g === 1 ? "guest" : "guests"}</option>
                ))}
              </select>
            </div>
          </div>

          <Button
            onClick={generateItinerary}
            className="w-full gradient-primary text-primary-foreground font-semibold h-12 text-base rounded-xl shadow-md hover:shadow-lg transition-shadow"
          >
            <Utensils className="h-5 w-5 mr-2" />
            Build My Itinerary
            <ChevronRight className="h-4 w-4 ml-1" />
          </Button>
        </motion.div>

        {/* Itinerary Results */}
        <AnimatePresence>
          {generated && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5 }}
              className="max-w-4xl mx-auto mt-12 space-y-10"
            >
              {/* Itinerary Header */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-center space-y-2"
              >
                <h2 className="text-2xl md:text-3xl font-heading font-bold text-foreground">
                  Your <span className="gradient-text">{city}</span> food journey
                </h2>
                <p className="text-muted-foreground text-sm">
                  {days} {days === 1 ? "day" : "days"} · {days * 3} meals curated for you
                </p>
              </motion.div>

              {itinerary.map((day, di) => (
                <motion.div
                  key={day.day}
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: di * 0.15 }}
                  className="space-y-4"
                >
                  {/* Day Header with decorative line */}
                  <div className="flex items-center gap-3">
                    <div className="gradient-primary rounded-full h-10 w-10 flex items-center justify-center text-primary-foreground font-bold text-sm shadow-md">
                      {day.day}
                    </div>
                    <h3 className="text-xl font-heading font-bold text-foreground">
                      Day {day.day}
                    </h3>
                    <div className="flex-1 h-px bg-border" />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    {day.meals.map((slot, mi) => (
                      <motion.div
                        key={slot.meal}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: di * 0.15 + mi * 0.1 }}
                        className="space-y-2"
                      >
                        <div className="flex items-center justify-between">
                          <span className="text-xs font-bold text-muted-foreground uppercase tracking-widest flex items-center gap-1.5">
                            {slot.icon}
                            {slot.meal}
                          </span>
                          <button
                            onClick={() => regenerateMeal(di, mi)}
                            className="p-1.5 rounded-lg text-muted-foreground hover:text-primary hover:bg-primary/10 transition-colors"
                            title="Shuffle this meal"
                          >
                            <RefreshCw className="h-3.5 w-3.5" />
                          </button>
                        </div>
                        <RestaurantCard restaurant={slot.restaurant} />
                      </motion.div>
                    ))}
                  </div>
                </motion.div>
              ))}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
