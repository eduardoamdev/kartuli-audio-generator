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
