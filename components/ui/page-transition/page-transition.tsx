"use client";

import { ReactNode, useEffect, useState } from "react";
import { usePageTransition } from "@/hooks/use-page-transition";
import styles from "./page-transition.module.css";

interface PageTransitionProps {
  children: ReactNode;
  transitionType?: "slide" | "fade" | "slideFromLeft";
}

export function PageTransition({
  children,
  transitionType = "slide",
}: PageTransitionProps) {
  const [isClient, setIsClient] = useState(false);
  const { isTransitioning, transitionType: currentTransitionType } =
    usePageTransition({
      transitionType,
    });

  // Ensure component only runs on client side
  useEffect(() => {
    setIsClient(true);
  }, []);

  const getTransitionClassName = () => {
    if (!isClient || !isTransitioning) return styles.pageContainer;

    const baseClass = styles.pageContainer;
    const transitionClassMap = {
      slide: styles.transitioning,
      slideFromLeft: styles.slideFromLeft,
      fade: styles.fadeTransition,
    };

    const activeTransitionType = currentTransitionType || transitionType;
    return `${baseClass} ${
      transitionClassMap[activeTransitionType] || transitionClassMap.slide
    }`;
  };

  return (
    <div className={getTransitionClassName()}>
      <div className={styles.pageContent}>{children}</div>
    </div>
  );
}
