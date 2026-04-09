import { useState, useRef, useCallback } from "react";

export interface RestaurantSuggestion {
  placeId: string;
  name: string;
  address: string;
}

export interface RestaurantDetails {
  placeId: string;
  name: string;
  cuisine: string;
  priceLevel: string;
  photoUrl: string | null;
  address: string;
}

// Maps Google Places API (New) primaryType → display label
const PRIMARY_TYPE_MAP: Record<string, string> = {
  italian_restaurant: "Italian",
  japanese_restaurant: "Japanese",
  chinese_restaurant: "Chinese",
  mexican_restaurant: "Mexican",
  french_restaurant: "French",
  indian_restaurant: "Indian",
  thai_restaurant: "Thai",
  american_restaurant: "American",
  mediterranean_restaurant: "Mediterranean",
  korean_restaurant: "Korean",
  vietnamese_restaurant: "Vietnamese",
  seafood_restaurant: "Seafood",
  steak_house: "Steakhouse",
  steakhouse: "Steakhouse",
  sushi_restaurant: "Sushi",
  pizza_restaurant: "Pizza",
  hamburger_restaurant: "Burgers",
  ramen_restaurant: "Ramen",
  barbecue_restaurant: "BBQ",
  greek_restaurant: "Greek",
  spanish_restaurant: "Spanish",
  middle_eastern_restaurant: "Middle Eastern",
  caribbean_restaurant: "Caribbean",
  ethiopian_restaurant: "Ethiopian",
  peruvian_restaurant: "Peruvian",
  brazilian_restaurant: "Brazilian",
  vegetarian_restaurant: "Vegetarian",
  vegan_restaurant: "Vegan",
  afghan_restaurant: "Afghan",
  turkish_restaurant: "Turkish",
  lebanese_restaurant: "Lebanese",
  moroccan_restaurant: "Moroccan",
  israeli_restaurant: "Israeli",
  taiwanese_restaurant: "Taiwanese",
  cantonese_restaurant: "Cantonese",
  filipino_restaurant: "Filipino",
  malaysian_restaurant: "Malaysian",
  indonesian_restaurant: "Indonesian",
  afghani_restaurant: "Afghan",
  pakistani_restaurant: "Pakistani",
  sri_lankan_restaurant: "Sri Lankan",
  burmese_restaurant: "Burmese",
  cambodian_restaurant: "Cambodian",
  latin_american_restaurant: "Latin American",
  cuban_restaurant: "Cuban",
  puerto_rican_restaurant: "Puerto Rican",
  southern_us_restaurant: "Southern",
  cajun_restaurant: "Cajun",
  soul_food_restaurant: "Soul Food",
  polish_restaurant: "Polish",
  german_restaurant: "German",
  russian_restaurant: "Russian",
  scandinavian_restaurant: "Scandinavian",
  australian_restaurant: "Australian",
  new_american_restaurant: "New American",
  contemporary_american_restaurant: "Contemporary American",
  fine_dining_restaurant: "Fine Dining",
  fusion_restaurant: "Fusion",
  taco_restaurant: "Tacos",
  salad_shop: "Salads",
  poke_restaurant: "Poke",
  bubble_tea_shop: "Bubble Tea",
  ice_cream_shop: "Ice Cream",
  donut_shop: "Donuts",
  deli: "Deli",
  sandwich_shop: "Sandwiches",
  fast_food_restaurant: "Fast Food",
  breakfast_restaurant: "Breakfast",
  brunch_restaurant: "Brunch",
  diner: "American Diner",
  cafe: "Café",
  coffee_shop: "Café",
  bakery: "Bakery",
  wine_bar: "Wine Bar",
  gastropub: "Gastropub",
  bar: "Bar & Grill",
  pub: "Pub",
  night_club: "Bar & Grill",
  restaurant: "",
};

// Places API (New) price level enum → display string
const PRICE_MAP: Record<string, string> = {
  PRICE_LEVEL_FREE: "$",
  PRICE_LEVEL_INEXPENSIVE: "$",
  PRICE_LEVEL_MODERATE: "$$",
  PRICE_LEVEL_EXPENSIVE: "$$$",
  PRICE_LEVEL_VERY_EXPENSIVE: "$$$$",
};

const KEY = import.meta.env.VITE_GOOGLE_PLACES_API_KEY || "";
const YELP_KEY = import.meta.env.VITE_YELP_API_KEY || "";

// Keyword patterns in restaurant names → cuisine label
const NAME_CUISINE_PATTERNS: [RegExp, string][] = [
  [/osteria|trattoria|ristorante|pizzeria/i, "Italian"],
  [/sushi|ramen|izakaya|yakitori|omakase/i, "Japanese"],
  [/taqueria|cantina|taco/i, "Mexican"],
  [/brasserie|bistro(?!\s+66)/i, "French"],
  [/steakhouse|steak\s*house|chop\s*house/i, "Steakhouse"],
  [/\bbarbecue\b|\bbbq\b|\bsmokehouse\b/i, "BBQ"],
  [/\bpho\b|\bbanh\s*mi\b/i, "Vietnamese"],
  [/\bdim\s*sum\b|\byum\s*cha\b/i, "Chinese"],
  [/\btapas\b/i, "Spanish"],
  [/\bmeze\b|\bhummus\b/i, "Middle Eastern"],
  [/\bethiopian\b|\beritem?rean\b/i, "Ethiopian"],
  [/\bperuvian\b/i, "Peruvian"],
  [/\bbrazilian\b|\bchurrasco\b/i, "Brazilian"],
  [/\bgreek\b|\btaverna\b/i, "Greek"],
  [/\bafghan\b/i, "Afghan"],
  [/\bseafood\b|\boyster\b|\bcrabhouse\b/i, "Seafood"],
  [/\bwine\s*bar\b/i, "Wine Bar"],
  [/\bgrill\b|\bgrille\b|\bchophouse\b/i, "American"],
  [/\bthai\b/i, "Thai"],
  [/\bindian\b|\bcurry\b|\btandoor\b/i, "Indian"],
  [/\bkorean\b|\bbbq\s*korean\b/i, "Korean"],
  [/\bchinese\b/i, "Chinese"],
  [/\bfrench\b/i, "French"],
  [/\bmediterranean\b/i, "Mediterranean"],
  [/\bdeli(?:catessen)?\b/i, "Deli"],
  [/\boccidental\b/i, "American Steakhouse"],
];

function cuisineFromName(name: string): string {
  for (const [pattern, label] of NAME_CUISINE_PATTERNS) {
    if (pattern.test(name)) return label;
  }
  return "";
}

// Yelp Business Search — fallback for missing price and/or generic cuisine
async function yelpData(name: string, address: string): Promise<{ price: string; cuisine: string }> {
  try {
    const params = new URLSearchParams({
      term: name,
      location: address || "United States",
      limit: "1",
    });
    const res = await fetch(`/yelp-proxy/businesses/search?${params}`, {
      headers: { Authorization: `Bearer ${YELP_KEY}` },
    });
    if (!res.ok) return { price: "", cuisine: "" };
    const data = await res.json();
    const biz = data.businesses?.[0];
    return {
      price: biz?.price ?? "",
      cuisine: biz?.categories?.[0]?.title ?? "",
    };
  } catch {
    return { price: "", cuisine: "" };
  }
}

// Legacy autocomplete via GET (no CORS issues, proven working)
async function legacyAutocomplete(input: string, city: string) {
  const params = new URLSearchParams({
    input: `${input} ${city}`,
    types: "establishment",
    key: KEY,
  });
  const res = await fetch(`/places-proxy/autocomplete/json?${params}`);
  if (!res.ok) throw new Error(`Autocomplete error: ${res.status}`);
  return res.json();
}

// Places API (New) details via GET (gives primaryType + priceLevel)
async function newPlacesGet(placeId: string, fieldMask: string) {
  const res = await fetch(`/places-new/places/${placeId}?key=${KEY}`, {
    headers: { "X-Goog-FieldMask": fieldMask },
  });
  if (!res.ok) throw new Error(`Places API (New) error: ${res.status}`);
  return res.json();
}

export function usePlacesSearch(city: string) {
  const [suggestions, setSuggestions] = useState<RestaurantSuggestion[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const debounceRef = useRef<ReturnType<typeof setTimeout>>();

  const search = useCallback(
    (input: string) => {
      clearTimeout(debounceRef.current);
      if (input.length < 2) {
        setSuggestions([]);
        return;
      }
      debounceRef.current = setTimeout(async () => {
        setIsSearching(true);
        try {
          const data = await legacyAutocomplete(input, city);
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          const raw: any[] = data.predictions ?? [];
          setSuggestions(
            raw
              .filter((p) => p.place_id)
              .slice(0, 5)
              .map((p) => ({
                placeId: p.place_id,
                name: p.structured_formatting?.main_text ?? p.description ?? "",
                address: p.structured_formatting?.secondary_text ?? "",
              }))
          );
        } catch (err) {
          console.error("Autocomplete error:", err);
          setSuggestions([]);
        } finally {
          setIsSearching(false);
        }
      }, 300);
    },
    [city]
  );

  const getDetails = useCallback(
    async (placeId: string): Promise<RestaurantDetails> => {
      const fields = "displayName,primaryType,priceLevel,photos,formattedAddress";
      const place = await newPlacesGet(placeId, fields);

      const displayName: string = place.displayName?.text ?? "";
      const googleCuisine = PRIMARY_TYPE_MAP[place.primaryType ?? ""] ?? "";
      const googlePrice = PRICE_MAP[place.priceLevel ?? ""] ?? "";
      const needsYelp = !googlePrice || !googleCuisine;

      let yelpCuisine = "";
      let yelpPrice = "";
      if (needsYelp) {
        const yelp = await yelpData(displayName, place.formattedAddress ?? "");
        yelpCuisine = yelp.cuisine;
        yelpPrice = yelp.price;
      }

      // Priority: Google primaryType → Yelp category → restaurant name keywords → "Restaurant"
      const cuisine = googleCuisine || yelpCuisine || cuisineFromName(displayName) || "Restaurant";
      const priceLevel = googlePrice || yelpPrice;

      // Photo: photos[0].name looks like "places/ChIJ.../photos/AXCi2Q..."
      // The proxy rewrites /places-new → /v1, so we just append the name as-is
      const photoName: string | undefined = place.photos?.[0]?.name;
      const photoUrl = photoName
        ? `/places-new/${photoName}/media?maxHeightPx=400&maxWidthPx=400&key=${KEY}&skipHttpRedirect=true`
        : null;

      // The media endpoint returns { photoUri: "..." } when skipHttpRedirect=true
      let resolvedPhoto: string | null = null;
      if (photoUrl) {
        try {
          const pr = await fetch(photoUrl);
          const pd = await pr.json();
          resolvedPhoto = pd.photoUri ?? null;
        } catch {
          resolvedPhoto = null;
        }
      }

      return {
        placeId,
        name: place.displayName?.text ?? "",
        cuisine,
        priceLevel,
        photoUrl: resolvedPhoto,
        address: place.formattedAddress ?? "",
      };
    },
    []
  );

  return { search, suggestions, setSuggestions, isSearching, isApiReady: true, getDetails };
}
