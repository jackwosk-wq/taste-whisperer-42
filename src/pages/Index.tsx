import { ArrowRight, Sparkles, MapPin, Heart, Quote } from "lucide-react";
import { Link } from "react-router-dom";
import { cities, type City } from "@/data/restaurants";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import ScrollReveal from "@/components/ScrollReveal";

interface IndexProps {
  selectedCity: City;
  onCityChange: (city: City) => void;
}

const testimonials = [
  {
    quote: "Tasterra found me a hidden ramen spot in the East Village I never would've discovered on my own. It's like having a friend who's eaten everywhere.",
    name: "Maya R.",
    city: "NYC",
    initials: "MR",
    color: "bg-primary/20 text-primary",
  },
  {
    quote: "I used Traveler Mode for my Chicago trip and every single meal was a hit. No more wasting a dinner on a tourist trap.",
    name: "James K.",
    city: "DC",
    initials: "JK",
    color: "bg-accent/20 text-accent",
  },
  {
    quote: "The vibe matching is unreal. I said 'cozy date night' and it nailed it on the first try.",
    name: "Sofia L.",
    city: "LA",
    initials: "SL",
    color: "bg-primary/15 text-primary",
  },
];

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
            {[
              { icon: Sparkles, title: "AI Chat Discovery", desc: "Tell us your vibe — we'll find the perfect spot. No scrolling through lists." },
              { icon: MapPin, title: "Traveler Mode", desc: "Plan your whole trip, one meal at a time. Day-by-day dining itineraries." },
              { icon: Heart, title: "Hidden Gems", desc: "Surface the spots locals love but tourists miss. Curated, never algorithmic." },
            ].map((feature, i) => (
              <ScrollReveal key={feature.title} delay={i * 150}>
                <div className="text-center space-y-3">
                  <div className="inline-flex items-center justify-center w-12 h-12 rounded-xl bg-primary/10 text-primary">
                    <feature.icon className="h-6 w-6" />
                  </div>
                  <h3 className="font-heading font-semibold text-foreground text-lg">{feature.title}</h3>
                  <p className="text-sm text-muted-foreground">{feature.desc}</p>
                </div>
              </ScrollReveal>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-16 md:py-24">
        <div className="container max-w-5xl">
          <ScrollReveal>
            <h2 className="font-heading text-3xl md:text-4xl font-bold text-foreground text-center mb-12">
              What food lovers are saying
            </h2>
          </ScrollReveal>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {testimonials.map((t, i) => (
              <ScrollReveal key={t.name} delay={i * 150}>
                <div className="rounded-xl border border-border bg-card p-6 space-y-4 h-full flex flex-col">
                  <Quote className="h-5 w-5 text-primary/40" />
                  <p className="text-foreground font-heading text-base italic leading-relaxed flex-1">
                    "{t.quote}"
                  </p>
                  <div className="flex items-center gap-3 pt-2">
                    <Avatar className="h-9 w-9">
                      <AvatarFallback className={t.color}>{t.initials}</AvatarFallback>
                    </Avatar>
                    <div>
                      <p className="text-sm font-medium text-foreground">{t.name}</p>
                      <p className="text-xs text-muted-foreground">{t.city}</p>
                    </div>
                  </div>
                </div>
              </ScrollReveal>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
