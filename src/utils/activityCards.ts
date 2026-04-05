export type ActivityCardVariant = "blue" | "purple" | "teal";

export type ActivityCard = {
  id: string;
  href: string;
  variant: ActivityCardVariant;
  icon: string;
  eyebrow: string;
  title: string;
  description: string;
};

export type ActivityCards = ActivityCard[];

export const activityCards: ActivityCards = [
  {
    id: "audio-generator",
    href: "/audio-generator",
    variant: "purple",
    icon: "🤖",
    eyebrow: "Create your own audios",
    title: "Audio Generator",
    description:
      "Craft custom audios with AI for any topic, level, or scenario you choose.",
  },
  {
    id: "grammar-library",
    href: "/grammar-library/selector",
    variant: "teal",
    icon: "📚",
    eyebrow: "Review grammar and vocabulary",
    title: "Grammar Library",
    description:
      "Comprehensive grammar explanations and examples, organized by topic and level.",
  },
];
