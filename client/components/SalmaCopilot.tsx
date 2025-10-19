import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { MessageCircle } from "lucide-react";
import { useState } from "react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface Message {
  id: string;
  role: "user" | "assistant";
  content: string;
  timestamp: Date;
}

interface ConversationOption {
  label: string;
  value: string;
  nextStep?: string;
}

type ConversationStep = 
  | "greeting"
  | "main_menu"
  | "trip_help"
  | "trip_details"
  | "rewards_help"
  | "rewards_details"
  | "hubs_help"
  | "hubs_details"
  | "technical_help"
  | "technical_details";

interface StepConfig {
  message: string;
  options: ConversationOption[];
}

interface SalmaCopilotProps {
  isFloating?: boolean;
}

const conversationFlow: Record<ConversationStep, StepConfig> = {
  greeting: {
    message: "Hi! I'm Salma, your AI Copilot. How can I help you today?",
    options: [
      { label: "🚗 Book a Trip", value: "trip" },
      { label: "⭐ Earn Rewards", value: "rewards" },
      { label: "🅿️ Smart Hubs", value: "hubs" },
      { label: "❓ Technical Help", value: "technical" },
    ],
  },
  main_menu: {
    message: "What would you like to explore?",
    options: [
      { label: "🚗 Book a Trip", value: "trip" },
      { label: "⭐ Earn Rewards", value: "rewards" },
      { label: "🅿️ Smart Hubs", value: "hubs" },
      { label: "❓ Technical Help", value: "technical" },
    ],
  },
  trip_help: {
    message: "What would you like to know about booking trips?",
    options: [
      { label: "How to book a carpool trip", value: "trip_carpool" },
      { label: "How to search for available trips", value: "trip_search" },
      { label: "Trip cancellation policy", value: "trip_cancel" },
      { label: "← Back to Main Menu", value: "main" },
    ],
  },
  trip_details: {
    message: "Here's how to book a carpool trip:\n\n1. Go to Passenger tab\n2. Browse Available Trips\n3. Click 'Book Seat(s)'\n4. Select number of seats (1-3)\n5. Confirm booking\n\nYour wallet will be deducted and you'll earn reward points!",
    options: [
      { label: "Tell me more about rewards", value: "rewards" },
      { label: "How to find trips?", value: "trip_search" },
      { label: "← Back to Main Menu", value: "main" },
    ],
  },
  rewards_help: {
    message: "What would you like to know about rewards?",
    options: [
      { label: "How many points can I earn?", value: "rewards_points" },
      { label: "How to redeem points", value: "rewards_redeem" },
      { label: "Tier system explained", value: "rewards_tiers" },
      { label: "← Back to Main Menu", value: "main" },
    ],
  },
  rewards_details: {
    message: "Great question! Here's how you earn points:\n\n💎 Carpool Bonus: 80 points\n(When trip has 3+ passengers)\n\n💎 Park & Ride: 40 points\n(Each Smart Hub booking)\n\nHigher tiers unlock exclusive benefits!",
    options: [
      { label: "What are the tiers?", value: "rewards_tiers" },
      { label: "How to redeem points", value: "rewards_redeem" },
      { label: "← Back to Main Menu", value: "main" },
    ],
  },
  rewards_redeem: {
    message: "Excellent! You can redeem your points for amazing discounts:\n\n🚗 Salik Toll Discount\n150 points → 50 AED off\n\n🅿️ RTA Parking Discount\n120 points → 30 AED off\n\nGet instant voucher codes to use on their apps!",
    options: [
      { label: "More about rewards", value: "rewards_points" },
      { label: "← Back to Main Menu", value: "main" },
    ],
  },
  hubs_help: {
    message: "What would you like to know about Smart Hubs?",
    options: [
      { label: "What are Smart Hubs?", value: "hubs_what" },
      { label: "How to book parking", value: "hubs_booking" },
      { label: "Available hubs nearby", value: "hubs_nearby" },
      { label: "← Back to Main Menu", value: "main" },
    ],
  },
  hubs_details: {
    message: "Smart Hubs are Park & Ride locations where you can:\n\n🅿️ Park your vehicle securely\n💳 Pay using reward points\n📱 Access metro/bus connections\n🎁 Earn bonus points for transit usage\n\nVisit the 'Hubs' tab to see available locations!",
    options: [
      { label: "Book parking now", value: "hubs_booking" },
      { label: "Find hubs near me", value: "hubs_nearby" },
      { label: "← Back to Main Menu", value: "main" },
    ],
  },
  technical_help: {
    message: "What issue can I help you with?",
    options: [
      { label: "Wallet/Payment issues", value: "tech_wallet" },
      { label: "Booking problems", value: "tech_booking" },
      { label: "Account issues", value: "tech_account" },
      { label: "← Back to Main Menu", value: "main" },
    ],
  },
  technical_details: {
    message: "For technical support:\n\n📧 Email: support@commutex.ae\n📱 Chat: Available 24/7\n🎯 Response time: Within 2 hours\n\nOur support team is ready to help!",
    options: [
      { label: "Contact support", value: "tech_contact" },
      { label: "← Back to Main Menu", value: "main" },
    ],
  },
};

const responseMap: Record<string, ConversationStep> = {
  trip: "trip_help",
  trip_carpool: "trip_details",
  trip_search: "trip_details",
  trip_cancel: "trip_details",
  rewards: "rewards_help",
  rewards_points: "rewards_details",
  rewards_redeem: "rewards_redeem",
  rewards_tiers: "rewards_details",
  hubs: "hubs_help",
  hubs_what: "hubs_details",
  hubs_booking: "hubs_details",
  hubs_nearby: "hubs_details",
  technical: "technical_help",
  tech_wallet: "technical_details",
  tech_booking: "technical_details",
  tech_account: "technical_details",
  tech_contact: "technical_details",
  main: "main_menu",
};

export function SalmaCopilot({ isFloating = false }: SalmaCopilotProps) {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "1",
      role: "assistant",
      content: conversationFlow.greeting.message,
      timestamp: new Date(),
    },
  ]);
  const [currentStep, setCurrentStep] = useState<ConversationStep>("greeting");
  const [selectedOption, setSelectedOption] = useState<string>("");

  const handleOptionSelect = (optionValue: string) => {
    const currentConfig = conversationFlow[currentStep];
    const selectedOpt = currentConfig.options.find((o) => o.value === optionValue);

    if (!selectedOpt) return;

    // Add user message
    const userMessage: Message = {
      id: Math.random().toString(),
      role: "user",
      content: selectedOpt.label.replace(/^[🚗⭐🅿️❓📧📱🎯]/g, "").trim(),
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMessage]);

    // Get next step
    const nextStep = (responseMap[optionValue] || "main_menu") as ConversationStep;
    setCurrentStep(nextStep);

    // Add assistant response
    setTimeout(() => {
      const nextConfig = conversationFlow[nextStep];
      const assistantMessage: Message = {
        id: Math.random().toString(),
        role: "assistant",
        content: nextConfig.message,
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, assistantMessage]);
      setSelectedOption("");
    }, 300);
  };

  const currentConfig = conversationFlow[currentStep];

  const cardClasses = isFloating
    ? "h-full flex flex-col bg-card border-0"
    : "h-full flex flex-col";

  return (
    <Card className={cardClasses}>
      {!isFloating && (
        <CardHeader>
          <div className="flex items-center gap-2">
            <MessageCircle className="h-5 w-5 text-primary" />
            <div>
              <CardTitle>Salma AI Copilot</CardTitle>
            </div>
          </div>
        </CardHeader>
      )}
      {isFloating && (
        <div className="px-4 py-3 border-b border-border bg-card">
          <div className="flex items-center gap-2">
            <MessageCircle className="h-4 w-4 text-primary" />
            <h2 className="font-semibold text-foreground text-sm">Salma</h2>
          </div>
        </div>
      )}
      <CardContent className="flex-1 flex flex-col overflow-hidden p-4">
        {/* Messages */}
        <div className="flex-1 overflow-y-auto space-y-4 mb-4 pr-2">
          {messages.map((message) => (
            <div
              key={message.id}
              className={`flex ${
                message.role === "user" ? "justify-end" : "justify-start"
              }`}
            >
              <div
                className={`max-w-xs rounded-lg px-4 py-3 text-sm whitespace-pre-wrap ${
                  message.role === "user"
                    ? "bg-primary text-primary-foreground"
                    : "bg-blue-50 dark:bg-blue-950/30 text-foreground border border-blue-200 dark:border-blue-800"
                }`}
              >
                {message.content}
              </div>
            </div>
          ))}
        </div>

        {/* Options Dropdown */}
        <div className="space-y-3">
          <Select value={selectedOption} onValueChange={handleOptionSelect}>
            <SelectTrigger className="w-full bg-background border-primary/20">
              <SelectValue placeholder="Choose an option..." />
            </SelectTrigger>
            <SelectContent>
              {currentConfig.options.map((option) => (
                <SelectItem key={option.value} value={option.value}>
                  {option.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          {/* Quick Action Buttons */}
          <div className="grid grid-cols-2 gap-2">
            {currentConfig.options.slice(0, 2).map((option) => (
              <Button
                key={option.value}
                variant="outline"
                size="sm"
                onClick={() => handleOptionSelect(option.value)}
                className="text-xs h-9 whitespace-normal leading-tight"
              >
                {option.label}
              </Button>
            ))}
          </div>
          {currentConfig.options.length > 2 && (
            <div className="grid grid-cols-2 gap-2">
              {currentConfig.options.slice(2).map((option) => (
                <Button
                  key={option.value}
                  variant="outline"
                  size="sm"
                  onClick={() => handleOptionSelect(option.value)}
                  className="text-xs h-9 whitespace-normal leading-tight"
                >
                  {option.label}
                </Button>
              ))}
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
