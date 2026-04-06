import { ArrowRight, Sparkles, MapPin, Heart } from "lucide-react";
import { Link } from "react-router-dom";
import { cities, type City } from "@/data/restaurants";
import { Button } from "@/components/ui/button";

interface IndexProps {
  selectedCity: City;
  onCityChange: (city: City) => void;
}

export default function Index({ selectedCity, onCityChange }: IndexProps) {
  return (
    <div className="min-h-[calc(100vh-4rem)] flex flex-col">
      {/* Hero */}
      <section className="relative flex-1 flex items-center justify-center py-20 md:py-32 overflow-hidden">
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] rounded-full bg-primary/5 blur-3xl" />
          <div className="absolute top-1/4 right-1/4 w-[400px] h-[400px] rounded-full bg-accent/5 blur-3xl" />
        </div>

        <div className="container relative text-center space-y-8">
          <h1 className="text-5xl md:text-7xl lg:text-8xl font-heading font-bold tracking-tight text-foreground animate-fade-in-up">
            Find spots that<br />
            <span className="gradient-text">actually get you.</span>
          </h1>
          <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto font-body animate-fade-in-up" style={{ animationDelay: "100ms" }}>
            AI-powered restaurant discovery that knows your vibe. Like asking a food-obsessed friend who's eaten everywhere.
          </p>

          {/* City pills */}
          <div className="flex flex-wrap justify-center gap-2 pt-4 animate-fade-in-up" style={{ animationDelay: "200ms" }}>
            {cities.map(city => (
              <button
                key={city}
                onClick={() => onCityChange(city)}
                className={`px-5 py-2 rounded-full text-sm font-medium transition-all ${
                  selectedCity === city
                    ? "gradient-primary text-primary-foreground shadow-lg shadow-primary/20"
                    : "bg-card border border-border text-muted-foreground hover:text-foreground hover:border-primary/30"
                }`}
              >
                {city}
              </button>
            ))}
          </div>

          <div className="animate-fade-in-up pt-4" style={{ animationDelay: "300ms" }}>
            <Link to="/discover">
              <Button size="lg" className="gradient-primary text-primary-foreground font-semibold shadow-lg hover:shadow-xl transition-shadow text-base px-8">
                Start discovering <ArrowRight className="h-5 w-5 ml-1" />
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="border-t border-border bg-muted/30 py-16 md:py-24">
        <div className="container">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-4xl mx-auto">
            <div className="text-center space-y-3">
              <div className="inline-flex items-center justify-center w-12 h-12 rounded-xl bg-primary/10 text-primary">
                <Sparkles className="h-6 w-6" />
              </div>
              <h3 className="font-heading font-semibold text-foreground text-lg">AI Chat Discovery</h3>
              <p className="text-sm text-muted-foreground">Tell us your vibe — we'll find the perfect spot. No scrolling through lists.</p>
            </div>
            <div className="text-center space-y-3">
              <div className="inline-flex items-center justify-center w-12 h-12 rounded-xl bg-primary/10 text-primary">
                <MapPin className="h-6 w-6" />
              </div>
              <h3 className="font-heading font-semibold text-foreground text-lg">Traveler Mode</h3>
              <p className="text-sm text-muted-foreground">Plan your whole trip, one meal at a time. Day-by-day dining itineraries.</p>
            </div>
            <div className="text-center space-y-3">
              <div className="inline-flex items-center justify-center w-12 h-12 rounded-xl bg-primary/10 text-primary">
                <Heart className="h-6 w-6" />
              </div>
              <h3 className="font-heading font-semibold text-foreground text-lg">Hidden Gems</h3>
              <p className="text-sm text-muted-foreground">Surface the spots locals love but tourists miss. Curated, never algorithmic.</p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
