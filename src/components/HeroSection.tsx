import { useState } from "react";
import { ArrowRight } from "lucide-react";
import { cities, type City } from "@/data/restaurants";

interface HeroSectionProps {
  selectedCity: City;
  onCityChange: (city: City) => void;
}

export default function HeroSection({ selectedCity, onCityChange }: HeroSectionProps) {
  return (
    <section className="relative py-16 md:py-24 overflow-hidden">
      {/* Background glow */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full bg-primary/5 blur-3xl" />
      </div>

      <div className="container relative text-center space-y-6">
        <h1 className="text-4xl md:text-6xl lg:text-7xl font-heading font-bold tracking-tight text-foreground animate-fade-in-up">
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

        <div className="animate-fade-in-up" style={{ animationDelay: "300ms" }}>
          <a href="#discover" className="inline-flex items-center gap-2 text-sm font-medium text-primary hover:underline">
            Start discovering <ArrowRight className="h-4 w-4" />
          </a>
        </div>
      </div>
    </section>
  );
}
