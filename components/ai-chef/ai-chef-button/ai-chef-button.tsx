import React, { forwardRef } from "react";
import styles from "./ai-chef-button.module.css";

type Props = { onClick: () => void };

export const AIChefButton = forwardRef<HTMLButtonElement, Props>(
  ({ onClick }, ref) => {
    const handleKeyDown = (e: React.KeyboardEvent) => {
      if (e.key === "Enter" || e.key === " ") {
        e.preventDefault();
        onClick();
      }
    };

    return (
      <button
        ref={ref}
        onClick={onClick}
        onKeyDown={handleKeyDown}
        className={styles.chefButton}
        aria-label="Chat with AI Chef - Get cooking advice and recipe help"
        title="Chat with AI Chef"
        tabIndex={0}
        role="button"
      >
        <span aria-hidden="true">👨‍🍳</span>
        <span className="sr-only">Chat with AI Chef</span>
      </button>
    );
  }
);
