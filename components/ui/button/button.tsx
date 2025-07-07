import styles from "./button.module.css";

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  children: React.ReactNode;
  href?: string;
  className?: string;
}

export function Button({
  children,
  onClick,
  href,
  type = "button",
  className,
  ...props
}: ButtonProps) {
  if (href) {
    return (
      <a href={href} className={`${styles.button} ${className}`}>
        {children}
      </a>
    );
  }

  return (
    <button
      type={type}
      className={`${styles.button} ${className}`}
      onClick={onClick}
      {...props}
    >
      {children}
    </button>
  );
}
