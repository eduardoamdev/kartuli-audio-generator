import Link from "next/link";
import { ReactNode, ButtonHTMLAttributes } from "react";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "blue" | "purple" | "teal" | "outline" | "gradient";
  fullWidth?: boolean;
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
  fullWidth = true,
  href,
  icon,
  eyebrow,
  description,
  className = "",
  children,
  style,
  ...props
}: ButtonProps) {
  const variantClasses = {
    blue: "btn-blue",
    purple: "btn-purple",
    teal: "btn-teal",
    outline:
      "border border-[rgba(255,79,162,0.48)] text-[#ffb6df] hover:bg-[rgba(255,79,162,0.16)]",
    gradient:
      "bg-gradient-to-r from-[#c026d3] to-[#ff4fa2] hover:brightness-110 active:scale-[0.98] shadow-xl shadow-[rgba(98,6,48,0.4)]",
  };

  const baseClasses = "btn-base";
  const widthClasses = fullWidth ? "w-full" : "w-auto shrink-0";
  const combinedClasses = `${baseClasses} ${widthClasses} ${variantClasses[variant] || ""} ${className}`;
  const combinedStyle = {
    width: fullWidth ? undefined : "fit-content",
    flexShrink: fullWidth ? undefined : 0,
    ...style,
  };
  const content = (
    <>
      {icon && <span className="btn-icon">{icon}</span>}
      <span className="btn-copy">
        {eyebrow && <span className="btn-eyebrow">{eyebrow}</span>}
        <span className="btn-label">{children}</span>
        {description && <span className="btn-description">{description}</span>}
      </span>
    </>
  );

  if (href) {
    return (
      <Link href={href} className={combinedClasses} style={combinedStyle}>
        {content}
      </Link>
    );
  }

  return (
    <button className={combinedClasses} style={combinedStyle} {...props}>
      {content}
    </button>
  );
}
