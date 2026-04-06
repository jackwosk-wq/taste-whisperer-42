export interface Restaurant {
  id: string;
  name: string;
  cuisine: string;
  priceRange: string;
  rating: number;
  reviewCount: number;
  description: string;
  neighborhood: string;
  city: string;
  lat: number;
  lng: number;
  photo: string;
  tags: string[];
  isHiddenGem: boolean;
}

export const restaurants: Restaurant[] = [
  {
    id: "1",
    name: "Semma",
    cuisine: "South Indian",
    priceRange: "$$$$",
    rating: 4.8,
    reviewCount: 1243,
    description: "A revelatory South Indian kitchen in the Village that treats gunpowder spice like gospel. The dosas here are transcendent — crispy, tangy, unapologetically bold.",
    neighborhood: "West Village",
    city: "NYC",
    lat: 40.7308,
    lng: -74.0020,
    photo: "https://images.unsplash.com/photo-1631452180519-c014fe946bc7?w=800&q=80",
    tags: ["Hidden Gem 💎", "Romantic 🕯️"],
    isHiddenGem: true,
  },
  {
    id: "2",
    name: "Superiority Burger",
    cuisine: "Vegetarian",
    priceRange: "$",
    rating: 4.6,
    reviewCount: 2187,
    description: "A tiny counter joint that turned the entire city vegetarian, one smashed patty at a time. The gelato is an afterthought that will haunt your dreams.",
    neighborhood: "East Village",
    city: "NYC",
    lat: 40.7267,
    lng: -73.9845,
    photo: "https://images.unsplash.com/photo-1550547660-d9450f859349?w=800&q=80",
    tags: ["Hidden Gem 💎", "Late Night 🌙"],
    isHiddenGem: true,
  },
  {
    id: "3",
    name: "Don Angie",
    cuisine: "Italian-American",
    priceRange: "$$$",
    rating: 4.7,
    reviewCount: 3451,
    description: "Red sauce reimagined with swagger. The pinwheel lasagna is a modern classic, and the mozzarella-stuffed garlic bread is what dreams taste like.",
    neighborhood: "West Village",
    city: "NYC",
    lat: 40.7335,
    lng: -74.0048,
    photo: "https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=800&q=80",
    tags: ["Group Dinner 🎉", "Romantic 🕯️"],
    isHiddenGem: false,
  },
  {
    id: "4",
    name: "Tail Up Goat",
    cuisine: "Caribbean-Inspired",
    priceRange: "$$$",
    rating: 4.7,
    reviewCount: 1876,
    description: "Caribbean soul meets fine-dining finesse in Adams Morgan. The bread service alone is worth the trip — sourdough with cultured butter that sings.",
    neighborhood: "Adams Morgan",
    city: "DC",
    lat: 38.9216,
    lng: -77.0450,
    photo: "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=800&q=80",
    tags: ["Hidden Gem 💎", "Traveler Pick ✈️"],
    isHiddenGem: true,
  },
  {
    id: "5",
    name: "Elle",
    cuisine: "French",
    priceRange: "$$",
    rating: 4.5,
    reviewCount: 987,
    description: "An intimate French bistro that feels like a Parisian love letter. Candlelit corners, natural wines, and a duck confit that melts into your soul.",
    neighborhood: "Logan Circle",
    city: "DC",
    lat: 38.9102,
    lng: -77.0314,
    photo: "https://images.unsplash.com/photo-1559339352-11d035aa65de?w=800&q=80",
    tags: ["Romantic 🕯️"],
    isHiddenGem: false,
  },
  {
    id: "6",
    name: "Bestia",
    cuisine: "Italian",
    priceRange: "$$$",
    rating: 4.6,
    reviewCount: 4521,
    description: "Industrial-chic and relentlessly delicious. The bone marrow pasta will rearrange your priorities, and the charred octopus is a masterwork.",
    neighborhood: "Arts District",
    city: "Los Angeles",
    lat: 34.0367,
    lng: -118.2335,
    photo: "https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=800&q=80",
    tags: ["Group Dinner 🎉", "Late Night 🌙"],
    isHiddenGem: false,
  },
  {
    id: "7",
    name: "Alinea",
    cuisine: "New American",
    priceRange: "$$$$",
    rating: 4.9,
    reviewCount: 2341,
    description: "Chicago's temple of molecular gastronomy. Every course is theater — edible balloons, tableside dessert paintings, and flavors from another dimension.",
    neighborhood: "Lincoln Park",
    city: "Chicago",
    lat: 41.9137,
    lng: -87.6485,
    photo: "https://images.unsplash.com/photo-1600891964092-4316c288032e?w=800&q=80",
    tags: ["Traveler Pick ✈️", "Romantic 🕯️"],
    isHiddenGem: false,
  },
  {
    id: "8",
    name: "Mandolin Aegean Bistro",
    cuisine: "Mediterranean",
    priceRange: "$$",
    rating: 4.5,
    reviewCount: 1654,
    description: "A sun-drenched courtyard in the Design District that transports you to a Greek island. The grilled halloumi and lamb chops are summer on a plate.",
    neighborhood: "Design District",
    city: "Miami",
    lat: 25.8133,
    lng: -80.1929,
    photo: "https://images.unsplash.com/photo-1578474846511-04ba529f0b88?w=800&q=80",
    tags: ["Hidden Gem 💎", "Group Dinner 🎉"],
    isHiddenGem: true,
  },
];

export const cities = ["NYC", "Los Angeles", "DC", "Chicago", "Miami"] as const;
export type City = typeof cities[number];

export function getRestaurantsByCity(city: City): Restaurant[] {
  return restaurants.filter(r => r.city === city);
}
