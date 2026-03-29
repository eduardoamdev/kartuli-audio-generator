import type { ActivityCards } from "@/types/cards";

export const activityCards: ActivityCards = [
  {
    id: "audio-library",
    href: "/",
    variant: "blue",
    icon: "🔊",
    eyebrow: "Improve your listening",
    title: "Audio Library",
    description:
      "Daily life conversations, read aloud by native speakers and organized by topic and level.",
  },
  {
    id: "audio-generator",
    href: "/",
    variant: "purple",
    icon: "🤖",
    eyebrow: "Create your own audios",
    title: "Audio Generator",
    description:
      "Craft custom audios with AI for any topic, level, or scenario you choose.",
  },
  {
    id: "grammar-library",
    href: "/grammar-library/grammar-selector",
    variant: "teal",
    icon: "📚",
    eyebrow: "Review grammar and vocabulary",
    title: "Grammar Library",
    description:
      "Comprehensive grammar explanations and examples, organized by topic and level.",
  },
];
