import { Heart, ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";

export default function SavedPage() {
  return (
    <div className="container py-16">
      <div className="text-center space-y-3 mb-12">
        <h1 className="text-4xl font-heading font-bold text-foreground">Your Saved Spots</h1>
        <p className="text-muted-foreground">Restaurants you've bookmarked for later</p>
      </div>

      {/* Empty state */}
      <div className="max-w-md mx-auto text-center space-y-6 py-16">
        <div className="mx-auto w-20 h-20 rounded-full bg-muted flex items-center justify-center">
          <Heart className="h-8 w-8 text-muted-foreground" />
        </div>
        <div className="space-y-2">
          <h2 className="text-xl font-heading font-bold text-foreground">Your saves are waiting to be filled.</h2>
          <p className="text-muted-foreground text-sm">
            Start discovering restaurants and tap the heart icon to save your favorites here.
          </p>
        </div>
        <Link to="/">
          <Button className="gradient-primary text-primary-foreground font-semibold">
            Start Discovering <ArrowRight className="h-4 w-4 ml-2" />
          </Button>
        </Link>
      </div>
    </div>
  );
}
