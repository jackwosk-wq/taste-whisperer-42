import { MapPin } from "lucide-react";
import type { Restaurant } from "@/data/restaurants";

interface MapViewProps {
  restaurants: Restaurant[];
}

export default function MapView({ restaurants }: MapViewProps) {
  if (restaurants.length === 0) return null;

  return (
    <div className="rounded-xl overflow-hidden border border-border bg-card">
      <div className="px-4 py-3 border-b border-border">
        <h3 className="font-heading font-bold text-foreground">Map View</h3>
        <p className="text-xs text-muted-foreground">{restaurants.length} spots found</p>
      </div>
      {/* Stylized map placeholder with pins */}
      <div className="relative h-64 bg-muted overflow-hidden">
        <div className="absolute inset-0 opacity-30"
          style={{
            backgroundImage: `url("https://images.unsplash.com/photo-1524661135-423995f22d0b?w=1200&q=40")`,
            backgroundSize: "cover",
            backgroundPosition: "center",
            filter: "grayscale(0.5) sepia(0.3)",
          }}
        />
        <div className="absolute inset-0 bg-gradient-to-b from-transparent to-card/60" />
        {restaurants.map((r, i) => (
          <div
            key={r.id}
            className="absolute flex flex-col items-center group cursor-pointer"
            style={{
              left: `${15 + (i * 18) % 70}%`,
              top: `${20 + (i * 23) % 50}%`,
            }}
          >
            <div className="gradient-primary rounded-full p-1.5 shadow-lg group-hover:scale-110 transition-transform">
              <MapPin className="h-4 w-4 text-primary-foreground" />
            </div>
            <span className="mt-1 text-[10px] font-semibold bg-card/90 px-2 py-0.5 rounded-full shadow-sm text-foreground whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity">
              {r.name}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
