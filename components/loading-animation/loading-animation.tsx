"use client";

import styles from "./loading-animation.module.css";

interface LoadingAnimationProps {
  size?: "small" | "medium" | "large";
  text?: string;
  centered?: boolean;
}

export function LoadingAnimation({
  size = "medium",
  text = "",
  centered = true,
}: LoadingAnimationProps) {
  return (
    <div className={`${styles.container} ${centered ? styles.centered : ""}`}>
      <div className={`${styles.videoContainer} ${styles[size]}`}>
        <video autoPlay loop muted playsInline className={styles.video}>
          <source src="/lottie-stirbowl.webm" type="video/webm" />
          {/* Fallback for browsers that don't support webm */}
          <div className={styles.fallback}>
            <div className={styles.spinner}></div>
          </div>
        </video>
      </div>
      {text && <p className={styles.text}>{text}</p>}
    </div>
  );
}
