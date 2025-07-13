import styles from "./button.module.css";

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  children: React.ReactNode;
  href?: string;
  className?: string;
  variant?: "default" | "primary" | "outline" | "link" | "gold";
  iconOnly?: boolean;
}

export function Button({
  children,
  onClick,
  href,
  type = "button",
  className,
  variant = "default",
  iconOnly = false,
  ...props
}: ButtonProps) {
  const buttonClasses = [
    styles.button,
    variant === "primary" && styles.primary,
    variant === "outline" && styles.outline,
    variant === "link" && styles.link,
    variant === "gold" && styles.gold,
    iconOnly && styles.iconOnly,
    className,
  ]
    .filter(Boolean)
    .join(" ");

  if (href) {
    return (
      <a href={href} className={buttonClasses}>
        {children}
      </a>
    );
  }

  return (
    <button type={type} className={buttonClasses} onClick={onClick} {...props}>
      {children}
    </button>
  );
}
