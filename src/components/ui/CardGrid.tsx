import { HTMLAttributes, ReactNode } from "react";

type CardGridProps = {
  children: ReactNode;
  className?: string;
} & HTMLAttributes<HTMLDivElement>;

export default function CardGrid({
  children,
  className = "",
  ...props
}: CardGridProps) {
  const combinedClasses =
    `grid gap-4 md:grid-cols-2 xl:grid-cols-3 ${className}`.trim();

  return (
    <div className={combinedClasses} {...props}>
      {children}
    </div>
  );
}
