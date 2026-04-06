export interface ChatMessage {
  id: string;
  role: "user" | "assistant";
  content: string;
  restaurantIds?: string[];
}

export const mockConversations: Record<string, ChatMessage[]> = {
  romantic: [
    {
      id: "r1",
      role: "assistant",
      content: "Ooh, a romantic night out? I've got you. 🕯️\n\nFor NYC, **Don Angie** in the West Village is *the* move — their pinwheel lasagna is basically edible love. Dim lighting, incredible pasta, and the kind of place that makes you both put your phones away.\n\nIf you're in DC, **Elle** in Logan Circle is a candlelit French dream. Think natural wines, duck confit, and a vibe that says \"we've been in love for years\" even if it's a first date.",
      restaurantIds: ["3", "5"],
    },
  ],
  hiddenGem: [
    {
      id: "h1",
      role: "assistant",
      content: "Hidden gems? That's literally my favorite topic. 💎\n\n**Semma** in the West Village is criminally underrated — South Indian cooking at this level usually requires a plane ticket. Their gunpowder dosa will make you question every Indian restaurant you've been to.\n\nAnd if you're in Adams Morgan in DC, **Tail Up Goat** is the kind of place locals gatekeep. Caribbean-inspired, incredible bread service, and a warmth that feels like a dinner party at a friend's house.",
      restaurantIds: ["1", "4"],
    },
  ],
  lateNight: [
    {
      id: "l1",
      role: "assistant",
      content: "Late night cravings? Say less. 🌙\n\n**Superiority Burger** in the East Village stays open late and the veggie burger is unreal — this tiny spot turned half of NYC vegetarian. Grab the gelato too, trust me.\n\nIn LA, **Bestia** in the Arts District keeps the kitchen running late. Bone marrow pasta at midnight hits different. The space is huge and buzzy, perfect for a late-night group outing.",
      restaurantIds: ["2", "6"],
    },
  ],
  groupDinner: [
    {
      id: "g1",
      role: "assistant",
      content: "Group dinner mode activated! 🎉\n\n**Don Angie** is built for this — order the mozzarella-stuffed garlic bread for the table and watch friendships deepen in real time. The pinwheel lasagna is a must-share.\n\nIn Miami, **Mandolin Aegean Bistro** has a gorgeous courtyard that fits big groups perfectly. The grilled halloumi is a crowd-pleaser, and the Mediterranean spread makes everyone happy.",
      restaurantIds: ["3", "8"],
    },
  ],
  traveler: [
    {
      id: "t1",
      role: "assistant",
      content: "Traveler mode! ✈️ Where are you headed? I can build your entire dining itinerary — breakfast, lunch, dinner, and that late-night spot you'll tell everyone about when you get home.\n\nJust tell me the city, how many days, and any dietary vibes (adventurous eater? vegetarian? allergic to bad food? same).",
      restaurantIds: [],
    },
  ],
};

export const welcomeMessage: ChatMessage = {
  id: "welcome",
  role: "assistant",
  content: "Hey! I'm your Tasterra guide — think of me as that friend who's eaten everywhere and remembers every dish. 🍽️\n\nTell me what you're in the mood for. A romantic spot? A hidden gem your foodie friends don't know about? Late-night eats? Or maybe you're planning a trip and want the full dining itinerary.\n\nWhat sounds good?",
};
