import { useState } from "react";
import { Plane, RefreshCw, Users, Calendar, Utensils } from "lucide-react";
import { Button } from "@/components/ui/button";
import RestaurantCard from "@/components/RestaurantCard";
import { restaurants, cities, type City } from "@/data/restaurants";

interface MealSlot {
  meal: string;
  restaurant: typeof restaurants[0];
}

interface DayPlan {
  day: number;
  meals: MealSlot[];
}

export default function TravelerMode() {
  const [city, setCity] = useState<City>("NYC");
  const [days, setDays] = useState(3);
  const [generated, setGenerated] = useState(false);
  const [itinerary, setItinerary] = useState<DayPlan[]>([]);

  const generateItinerary = () => {
    const pool = restaurants.length > 0 ? restaurants : [];
    const plans: DayPlan[] = [];
    for (let d = 1; d <= days; d++) {
      plans.push({
        day: d,
        meals: [
          { meal: "Breakfast", restaurant: pool[(d * 3) % pool.length] },
          { meal: "Lunch", restaurant: pool[(d * 3 + 1) % pool.length] },
          { meal: "Dinner", restaurant: pool[(d * 3 + 2) % pool.length] },
        ],
      });
    }
    setItinerary(plans);
    setGenerated(true);
  };

  const regenerateMeal = (dayIndex: number, mealIndex: number) => {
    setItinerary(prev => {
      const copy = [...prev];
      const randomR = restaurants[Math.floor(Math.random() * restaurants.length)];
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
    <div className="container py-12 space-y-8">
      <div className="text-center space-y-4">
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-primary/10 text-primary text-sm font-semibold">
          <Plane className="h-4 w-4" /> Traveler Mode
        </div>
        <h1 className="text-4xl md:text-5xl font-heading font-bold text-foreground">
          Plan your whole trip,<br />
          <span className="gradient-text">one meal at a time.</span>
        </h1>
        <p className="text-muted-foreground max-w-xl mx-auto">
          Tell us where you're going and we'll build your perfect dining itinerary — breakfast, lunch, and dinner, every day.
        </p>
      </div>

      {/* Form */}
      <div className="max-w-2xl mx-auto bg-card border border-border rounded-xl p-6 space-y-4">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div>
            <label className="text-sm font-medium text-foreground mb-1.5 block">City</label>
            <select
              value={city}
              onChange={e => setCity(e.target.value as City)}
              className="w-full rounded-lg border border-input bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-ring"
            >
              {cities.map(c => <option key={c} value={c}>{c}</option>)}
            </select>
          </div>
          <div>
            <label className="text-sm font-medium text-foreground mb-1.5 block">Days</label>
            <select
              value={days}
              onChange={e => setDays(Number(e.target.value))}
              className="w-full rounded-lg border border-input bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-ring"
            >
              {[1, 2, 3, 4, 5, 7].map(d => <option key={d} value={d}>{d} {d === 1 ? "day" : "days"}</option>)}
            </select>
          </div>
          <div>
            <label className="text-sm font-medium text-foreground mb-1.5 block">Guests</label>
            <select className="w-full rounded-lg border border-input bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-ring">
              {[1, 2, 3, 4, 5, 6].map(g => <option key={g} value={g}>{g} {g === 1 ? "person" : "people"}</option>)}
            </select>
          </div>
        </div>
        <Button onClick={generateItinerary} className="w-full gradient-primary text-primary-foreground font-semibold">
          <Utensils className="h-4 w-4 mr-2" />
          Build My Itinerary
        </Button>
      </div>

      {/* Itinerary */}
      {generated && (
        <div className="max-w-4xl mx-auto space-y-8">
          {itinerary.map((day, di) => (
            <div key={day.day} className="space-y-4">
              <h2 className="text-xl font-heading font-bold text-foreground flex items-center gap-2">
                <Calendar className="h-5 w-5 text-primary" />
                Day {day.day}
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {day.meals.map((slot, mi) => (
                  <div key={slot.meal} className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-semibold text-muted-foreground uppercase tracking-wide">{slot.meal}</span>
                      <button
                        onClick={() => regenerateMeal(di, mi)}
                        className="p-1 rounded-md text-muted-foreground hover:text-primary hover:bg-primary/10 transition-colors"
                      >
                        <RefreshCw className="h-3.5 w-3.5" />
                      </button>
                    </div>
                    <RestaurantCard restaurant={slot.restaurant} />
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
