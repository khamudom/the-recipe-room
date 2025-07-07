import React, { forwardRef, useState, useEffect } from "react";
import Image from "next/image";
import styles from "./ai-chef-button.module.css";

interface Props { onClick: () => void };

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
        className={`${styles.chefButton} `}
        aria-label="Chat with AI Chef - Get cooking advice and recipe help"
        title="Chat with AI Chef"
        tabIndex={0}
        role="button"
      >
        <div className={styles.chatIndicator} aria-hidden="true">
          💬
        </div>
        <span aria-hidden="true">
          <Image
            src="/assets/lechef.png"
            alt="AI Chef"
            width={28}
            height={28}
          />
        </span>
        <span className="sr-only">Chat with AI Chef</span>
      </button>
    );
  }
);

AIChefButton.displayName = "AIChefButton";
