import { Star, Heart, MapPin } from "lucide-react";
import { useState } from "react";
import type { Restaurant } from "@/data/restaurants";

interface RestaurantCardProps {
  restaurant: Restaurant;
  index?: number;
}

export default function RestaurantCard({ restaurant, index = 0 }: RestaurantCardProps) {
  const [saved, setSaved] = useState(false);

  return (
    <div
      className="group rounded-xl overflow-hidden bg-card border border-border shadow-sm hover:shadow-lg transition-all duration-300 animate-fade-in-up"
      style={{ animationDelay: `${index * 100}ms` }}
    >
      {/* Photo */}
      <div className="relative h-48 overflow-hidden">
        <img
          src={restaurant.photo}
          alt={restaurant.name}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
        />
        <button
          onClick={() => setSaved(!saved)}
          className="absolute top-3 right-3 p-2 rounded-full bg-background/80 backdrop-blur-sm hover:bg-background transition-colors"
        >
          <Heart className={`h-4 w-4 transition-colors ${saved ? "fill-primary text-primary" : "text-foreground"}`} />
        </button>
        {restaurant.isHiddenGem && (
          <span className="absolute top-3 left-3 px-2 py-1 rounded-full bg-accent/90 text-accent-foreground text-xs font-semibold backdrop-blur-sm">
            💎 Hidden Gem
          </span>
        )}
      </div>

      {/* Content */}
      <div className="p-4 space-y-3">
        <div>
          <h3 className="text-lg font-heading font-bold text-foreground">{restaurant.name}</h3>
          <div className="flex items-center gap-2 mt-1">
            <div className="flex items-center gap-1">
              <Star className="h-3.5 w-3.5 fill-accent text-accent" />
              <span className="text-sm font-semibold text-foreground">{restaurant.rating}</span>
              <span className="text-xs text-muted-foreground">({restaurant.reviewCount.toLocaleString()})</span>
            </div>
            <span className="text-muted-foreground">·</span>
            <span className="text-sm text-muted-foreground">{restaurant.cuisine}</span>
            <span className="text-muted-foreground">·</span>
            <span className="text-sm font-medium text-foreground">{restaurant.priceRange}</span>
          </div>
        </div>

        <p className="text-sm text-muted-foreground leading-relaxed line-clamp-2">
          {restaurant.description}
        </p>

        {/* Tags */}
        <div className="flex flex-wrap gap-1.5">
          {restaurant.tags.map(tag => (
            <span key={tag} className="px-2 py-0.5 rounded-full bg-muted text-muted-foreground text-xs font-medium">
              {tag}
            </span>
          ))}
        </div>

        {/* Location */}
        <div className="flex items-center justify-between pt-1">
          <div className="flex items-center gap-1 text-muted-foreground">
            <MapPin className="h-3 w-3" />
            <span className="text-xs">{restaurant.neighborhood}, {restaurant.city}</span>
          </div>
          <button className="text-xs font-semibold text-primary hover:underline">
            View Details →
          </button>
        </div>
      </div>
    </div>
  );
}
