import { useState } from "react";
import { motion } from "framer-motion";
import { GodRays } from "@paper-design/shaders-react";
import { useAuth } from "@/context/AuthContext";
import { PromptInputBox } from "@/components/ui/ai-prompt-box";
import type { City } from "@/data/restaurants";

interface DiscoverPageProps {
  selectedCity: City;
  onCityChange: (city: City) => void;
}

export default function DiscoverPage({ selectedCity }: DiscoverPageProps) {
  const { user } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  const firstName = user?.name ? user.name.split(" ")[0].charAt(0).toUpperCase() + user.name.split(" ")[0].slice(1) : "there";

  const handleSend = (message: string) => {
    if (!message.trim()) return;
    setIsLoading(true);
    // TODO: connect to GPT-4o
    setTimeout(() => setIsLoading(false), 1500);
  };

  return (
    <div className="relative min-h-screen bg-background flex flex-col items-center justify-center px-4 overflow-hidden text-sm">

      {/* God Rays — warm amber tones, very subtle */}
      <div className="absolute inset-0 pointer-events-none">
        <GodRays
          colorBack="#00000000"
          colors={["#C2622A30", "#C49A2A25", "#8B3A0F20", "#F7F3EE15"]}
          colorBloom="#C2622A"
          offsetX={0.8}
          offsetY={-0.9}
          intensity={0.35}
          spotty={0.4}
          midSize={12}
          midIntensity={0}
          density={0.32}
          bloom={0.25}
          speed={0.4}
          scale={1.5}
          style={{ height: "100%", width: "100%", position: "absolute", top: 0, left: 0 }}
        />
      </div>

      {/* Content */}
      <div className="relative z-10 w-full max-w-2xl flex flex-col items-center gap-8">

        {/* Greeting — fades in first */}
        <motion.div
          className="text-center space-y-3"
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, ease: "easeOut" }}
        >
          <h1 className="text-4xl sm:text-5xl font-heading font-bold gradient-text text-center">
            Hey {firstName}!
          </h1>
          <p className="text-muted-foreground text-base sm:text-lg font-serif">
            Where are you eating tonight? Ask me anything.
          </p>
        </motion.div>

        {/* Prompt box — fades in second, slightly delayed */}
        <motion.div
          className="w-full"
          initial={{ opacity: 0, y: 28 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, ease: "easeOut", delay: 0.18 }}
        >
          <PromptInputBox
            onSend={handleSend}
            isLoading={isLoading}
            placeholder={`Find me a great spot in ${selectedCity}…`}
            className="w-full"
          />
        </motion.div>

        {/* Footer hint — fades in last */}
        <motion.p
          className="text-xs text-muted-foreground/40"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8, ease: "easeOut", delay: 0.4 }}
        >
          Powered by Tasterra AI
        </motion.p>
      </div>
    </div>
  );
}
