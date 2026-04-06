import { useState, useRef, useEffect } from "react";
import { Send } from "lucide-react";
import { welcomeMessage, mockConversations, type ChatMessage } from "@/data/chatResponses";

interface ChatPanelProps {
  onRestaurantResults?: (ids: string[]) => void;
}

const vibeChips = [
  { label: "Romantic 🕯️", key: "romantic" },
  { label: "Hidden Gem 💎", key: "hiddenGem" },
  { label: "Late Night 🌙", key: "lateNight" },
  { label: "Group Dinner 🎉", key: "groupDinner" },
  { label: "Traveler Mode ✈️", key: "traveler" },
];

export default function ChatPanel({ onRestaurantResults }: ChatPanelProps) {
  const [messages, setMessages] = useState<ChatMessage[]>([welcomeMessage]);
  const [input, setInput] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isTyping]);

  const handleSend = (text: string, vibeKey?: string) => {
    const userMsg: ChatMessage = { id: Date.now().toString(), role: "user", content: text };
    setMessages(prev => [...prev, userMsg]);
    setInput("");
    setIsTyping(true);

    setTimeout(() => {
      const key = vibeKey || detectVibe(text);
      const responses = mockConversations[key] || mockConversations.romantic;
      const aiMsg = responses[0];
      setMessages(prev => [...prev, aiMsg]);
      setIsTyping(false);
      if (aiMsg.restaurantIds?.length) {
        onRestaurantResults?.(aiMsg.restaurantIds);
      }
    }, 1500);
  };

  const detectVibe = (text: string): string => {
    const lower = text.toLowerCase();
    if (lower.includes("romantic") || lower.includes("date")) return "romantic";
    if (lower.includes("hidden") || lower.includes("gem") || lower.includes("underrated")) return "hiddenGem";
    if (lower.includes("late") || lower.includes("night") || lower.includes("midnight")) return "lateNight";
    if (lower.includes("group") || lower.includes("friends") || lower.includes("party")) return "groupDinner";
    if (lower.includes("travel") || lower.includes("trip") || lower.includes("itinerary")) return "traveler";
    return "romantic";
  };

  return (
    <div className="flex flex-col h-[600px] rounded-xl border border-border bg-tasterra-chat-bg overflow-hidden">
      {/* Header */}
      <div className="px-4 py-3 border-b border-border bg-card">
        <h3 className="font-heading font-bold text-foreground">Chat with Tasterra</h3>
        <p className="text-xs text-muted-foreground">Your food-obsessed friend, always on</p>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.map(msg => (
          <div key={msg.id} className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}>
            <div
              className={`max-w-[85%] rounded-2xl px-4 py-3 text-sm leading-relaxed ${
                msg.role === "user"
                  ? "gradient-primary text-primary-foreground rounded-br-md"
                  : "bg-tasterra-chat-ai text-foreground rounded-bl-md"
              }`}
            >
              {msg.content.split("\n").map((line, i) => (
                <p key={i} className={i > 0 ? "mt-2" : ""}>
                  {line.split(/(\*\*[^*]+\*\*)/).map((part, j) =>
                    part.startsWith("**") && part.endsWith("**") ? (
                      <strong key={j} className="font-semibold">{part.slice(2, -2)}</strong>
                    ) : part.startsWith("*") && part.endsWith("*") ? (
                      <em key={j}>{part.slice(1, -1)}</em>
                    ) : (
                      <span key={j}>{part}</span>
                    )
                  )}
                </p>
              ))}
            </div>
          </div>
        ))}
        {isTyping && (
          <div className="flex justify-start">
            <div className="bg-tasterra-chat-ai rounded-2xl rounded-bl-md px-4 py-3 flex gap-1.5">
              <span className="typing-dot w-2 h-2 rounded-full bg-muted-foreground" />
              <span className="typing-dot w-2 h-2 rounded-full bg-muted-foreground" />
              <span className="typing-dot w-2 h-2 rounded-full bg-muted-foreground" />
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Vibe chips */}
      <div className="px-4 py-2 border-t border-border flex gap-2 overflow-x-auto">
        {vibeChips.map(chip => (
          <button
            key={chip.key}
            onClick={() => handleSend(`Show me ${chip.label.replace(/[^\w\s]/g, "").trim()} spots`, chip.key)}
            className="flex-shrink-0 px-3 py-1.5 rounded-full text-xs font-medium bg-muted text-muted-foreground hover:bg-primary/10 hover:text-primary transition-colors"
          >
            {chip.label}
          </button>
        ))}
      </div>

      {/* Input */}
      <div className="p-3 border-t border-border bg-card">
        <form
          onSubmit={e => { e.preventDefault(); if (input.trim()) handleSend(input.trim()); }}
          className="flex gap-2"
        >
          <input
            value={input}
            onChange={e => setInput(e.target.value)}
            placeholder="What are you craving?"
            className="flex-1 rounded-xl border border-input bg-background px-4 py-2.5 text-sm placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring"
          />
          <button
            type="submit"
            disabled={!input.trim()}
            className="gradient-primary text-primary-foreground rounded-xl p-2.5 disabled:opacity-50 hover:shadow-md transition-shadow"
          >
            <Send className="h-4 w-4" />
          </button>
        </form>
      </div>
    </div>
  );
}
