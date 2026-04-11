import { HTMLAttributes, ReactNode } from "react";

type ButtonGridProps = {
  children: ReactNode;
  className?: string;
} & HTMLAttributes<HTMLDivElement>;

export default function ButtonGrid({
  children,
  className = "",
  ...props
}: ButtonGridProps) {
  const combinedClasses =
    `grid gap-4 md:grid-cols-2 xl:grid-cols-3 ${className}`.trim();

  return (
    <div className={combinedClasses} {...props}>
      {children}
    </div>
  );
}
