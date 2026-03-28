import Link from "next/link";
import { ReactNode, ButtonHTMLAttributes } from "react";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "blue" | "purple" | "teal" | "outline" | "gradient";
  href?: string;
  icon?: ReactNode;
  eyebrow?: string;
  description?: string;
  className?: string;
}

/**
 * A standard interactive button or link component.
 *
 * @param {ButtonProps} props - Properties including variant, href, and children.
 * @returns {JSX.Element} A stylized <button> or <Link> element.
 */
export default function Button({
  variant = "blue",
  href,
  icon,
  eyebrow,
  description,
  className = "",
  children,
  ...props
}: ButtonProps) {
  const variantClasses = {
    blue: "btn-blue",
    purple: "btn-purple",
    teal: "btn-teal",
    outline: "border border-[#1e3a8a]/50 text-[#60a5fa] hover:bg-[#1e3a8a]/10",
    gradient:
      "bg-gradient-to-r from-[#1e3a8a] to-[#581c87] hover:brightness-110 active:scale-[0.98] shadow-xl shadow-blue-950/40",
  };

  const baseClasses = "btn-base";
  const combinedClasses = `${baseClasses} ${variantClasses[variant] || ""} ${className}`;
  const content = (
    <>
      {icon && <span className="btn-icon">{icon}</span>}
      <span className="btn-copy">
        {eyebrow && <span className="btn-eyebrow">{eyebrow}</span>}
        <span className="btn-label">{children}</span>
        {description && <span className="btn-description">{description}</span>}
      </span>
      <span className="btn-arrow" aria-hidden="true">
        -&gt;
      </span>
    </>
  );

  if (href) {
    return (
      <Link href={href} className={combinedClasses}>
        {content}
      </Link>
    );
  }

  return (
    <button className={combinedClasses} {...props}>
      {content}
    </button>
  );
}
