import React, { forwardRef, useState, useEffect } from "react";
import Image from "next/image";
import styles from "./ai-chef-button.module.css";

type Props = { onClick: () => void };

export const AIChefButton = forwardRef<HTMLButtonElement, Props>(
  ({ onClick }, ref) => {
    const [showTooltip, setShowTooltip] = useState(false);
    const [isMobile, setIsMobile] = useState(false);

    useEffect(() => {
      const checkMobile = () => {
        setIsMobile(
          window.matchMedia("(hover: none) and (pointer: coarse)").matches
        );
      };

      checkMobile();
      window.addEventListener("resize", checkMobile);
      return () => window.removeEventListener("resize", checkMobile);
    }, []);

    const handleKeyDown = (e: React.KeyboardEvent) => {
      if (e.key === "Enter" || e.key === " ") {
        e.preventDefault();
        onClick();
      }
    };

    const handleTouchStart = () => {
      if (isMobile) {
        setShowTooltip(true);
        setTimeout(() => setShowTooltip(false), 2000);
      }
    };

    return (
      <button
        ref={ref}
        onClick={onClick}
        onKeyDown={handleKeyDown}
        onTouchStart={handleTouchStart}
        className={`${styles.chefButton} ${
          showTooltip ? styles.tooltipVisible : ""
        }`}
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
