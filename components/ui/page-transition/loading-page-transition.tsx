"use client";

import { ReactNode, useEffect, useState } from "react";
import { LoadingSpinner } from "@/components/ui/loading-spinner/loading-spinner";
import { usePageTransition } from "@/hooks/use-page-transition";
import styles from "./loading-page-transition.module.css";

interface LoadingPageTransitionProps {
  children: ReactNode;
  isLoading: boolean;
  error?: Error | null;
  fallback?: ReactNode;
  transitionType?: "slide" | "fade" | "slideFromLeft";
}

export function LoadingPageTransition({
  children,
  isLoading,
  error,
  fallback,
  transitionType = "slide",
}: LoadingPageTransitionProps) {
  const [showContent, setShowContent] = useState(false);
  usePageTransition({
    transitionType,
  });

  // Handle loading state transitions
  useEffect(() => {
    if (!isLoading && !error) {
      // Content is ready, show it with animation
      // Small delay to ensure smooth transition
      const timer = setTimeout(() => {
        setShowContent(true);
      }, 100);
      return () => clearTimeout(timer);
    } else {
      // Reset states when loading starts again
      setShowContent(false);
    }
  }, [isLoading, error]);

  // Show loading spinner
  if (isLoading) {
    return (
      <div className={styles.loadingContainer}>
        <LoadingSpinner />
      </div>
    );
  }

  // Show error state
  if (error) {
    return (
      <div className={styles.errorContainer}>
        {fallback || (
          <div className={styles.errorContent}>
            <p>Something went wrong. Please try again.</p>
            <p className={styles.errorMessage}>{error.message}</p>
          </div>
        )}
      </div>
    );
  }

  // Show content with animation
  return (
    <div
      className={`${styles.contentContainer} ${
        showContent ? styles.contentVisible : ""
      }`}
    >
      <div className={styles.content}>{children}</div>
    </div>
  );
}
