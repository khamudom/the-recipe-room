import styles from "./button.module.css";

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  children: React.ReactNode;
  href?: string;
  className?: string;
  variant?: "default" | "primary" | "outline" | "link" | "gold";
  size?: "small" | "medium" | "large";
  iconOnly?: boolean;
  shape?: "square" | "round" | "circle";
  status?: "success" | "danger" | "warning" | "info";
  align?: "left" | "center" | "right";
}

export function Button({
  children,
  onClick,
  href,
  type = "button",
  className,
  variant = "default",
  size = "medium",
  iconOnly = false,
  shape = "round",
  status,
  align = "center",
  ...props
}: ButtonProps) {
  const buttonClasses = [
    styles.button,
    variant === "primary" && styles.primary,
    variant === "outline" && styles.outline,
    variant === "link" && styles.link,
    variant === "gold" && styles.gold,
    size === "small" && styles.small,
    size === "large" && styles.large,
    iconOnly && styles.iconOnly,
    shape === "square" && styles.square,
    shape === "circle" && styles.circle,
    status === "success" && styles.success,
    status === "danger" && styles.danger,
    status === "warning" && styles.warning,
    status === "info" && styles.info,
    align === "left" && styles.alignLeft,
    align === "right" && styles.alignRight,
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
