import { useState } from "react";
import ChatPanel from "@/components/ChatPanel";
import RestaurantCard from "@/components/RestaurantCard";
import HeroSection from "@/components/HeroSection";
import MapView from "@/components/MapView";
import { restaurants, getRestaurantsByCity, type City } from "@/data/restaurants";

interface DiscoverPageProps {
  selectedCity: City;
  onCityChange: (city: City) => void;
}

export default function DiscoverPage({ selectedCity, onCityChange }: DiscoverPageProps) {
  const [highlightedIds, setHighlightedIds] = useState<string[]>([]);

  const cityRestaurants = getRestaurantsByCity(selectedCity);
  const displayRestaurants = highlightedIds.length > 0
    ? restaurants.filter(r => highlightedIds.includes(r.id))
    : cityRestaurants.length > 0
      ? cityRestaurants
      : restaurants.slice(0, 4);

  return (
    <div>
      <HeroSection selectedCity={selectedCity} onCityChange={onCityChange} />

      <section id="discover" className="container pb-16 space-y-8">
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">
          {/* Chat Panel */}
          <div className="lg:col-span-2">
            <ChatPanel onRestaurantResults={setHighlightedIds} />
          </div>

          {/* Restaurant Results */}
          <div className="lg:col-span-3 space-y-6">
            <div>
              <h2 className="text-2xl font-heading font-bold text-foreground">
                {highlightedIds.length > 0 ? "Tasterra Picks" : `Top Spots in ${selectedCity}`}
              </h2>
              <p className="text-sm text-muted-foreground mt-1">
                {highlightedIds.length > 0
                  ? "Based on your conversation"
                  : "Curated by our AI food brain"}
              </p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {displayRestaurants.map((r, i) => (
                <RestaurantCard key={r.id} restaurant={r} index={i} />
              ))}
            </div>
          </div>
        </div>

        {/* Map View */}
        <MapView restaurants={displayRestaurants} />
      </section>
    </div>
  );
}
