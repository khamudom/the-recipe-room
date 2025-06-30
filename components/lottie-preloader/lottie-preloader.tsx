"use client";

import { useEffect } from "react";
import { lottieCache } from "@/lib/lottie-cache";

const DEFAULT_ANIMATION_PATH = "/assets/lottie/Animation - 1751255045745.json";

export function LottiePreloader() {
  useEffect(() => {
    // Preload the default animation as soon as the component mounts
    lottieCache.preloadAnimation(DEFAULT_ANIMATION_PATH).catch(console.error);
  }, []);

  // This component doesn't render anything
  return null;
} 