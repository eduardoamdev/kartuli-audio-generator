export type ActivityButtonVariant = "blue" | "purple" | "teal";

export type ActivityButton = {
  id: string;
  href: string;
  variant: ActivityButtonVariant;
  icon: string;
  eyebrow: string;
  title: string;
  description: string;
};

export type ActivityButtons = ActivityButton[];

export const activityButtons: ActivityButtons = [
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
