import { useEffect, useState, useRef } from "react";
import { usePathname, useRouter } from "next/navigation";

export type TransitionType = "slide" | "fade" | "slideFromLeft";

interface UsePageTransitionOptions {
  onTransitionStart?: () => void;
  onTransitionEnd?: () => void;
  transitionType?: TransitionType;
}

export function usePageTransition(options: UsePageTransitionOptions = {}) {
  const pathname = usePathname();
  const router = useRouter();
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [transitionType, setTransitionType] = useState<TransitionType>("slide");
  const [isClient, setIsClient] = useState(false);
  const [isBackButton, setIsBackButton] = useState(false);
  const previousPathRef = useRef(pathname);
  const navigationHistoryRef = useRef<string[]>([]);
  const {
    onTransitionStart,
    onTransitionEnd,
    transitionType: defaultType = "slide",
  } = options;

  // Ensure hook only runs on client side
  useEffect(() => {
    setIsClient(true);
  }, []);

  // Listen for browser back/forward button usage
  useEffect(() => {
    if (!isClient) return;

    const handlePopState = () => {
      setIsBackButton(true);
      // Reset the flag after a short delay
      setTimeout(() => setIsBackButton(false), 100);
    };

    window.addEventListener("popstate", handlePopState);

    return () => {
      window.removeEventListener("popstate", handlePopState);
    };
  }, [isClient]);

  // Track navigation history for better back button detection
  useEffect(() => {
    if (!isClient) return;

    // Add current path to history
    navigationHistoryRef.current.push(pathname);

    // Keep only last 10 entries to prevent memory issues
    if (navigationHistoryRef.current.length > 10) {
      navigationHistoryRef.current = navigationHistoryRef.current.slice(-10);
    }
  }, [pathname, isClient]);

  useEffect(() => {
    if (!isClient) return;

    if (pathname !== previousPathRef.current) {
      // If back button was pressed, force slide from left
      const isBackNavigation =
        isBackButton ||
        isBackNavigationTo(
          pathname,
          previousPathRef.current,
          navigationHistoryRef.current
        );
      const newTransitionType = isBackNavigation
        ? "slideFromLeft"
        : defaultType;

      setTransitionType(newTransitionType);
      setIsTransitioning(true);
      onTransitionStart?.();

      const timer = setTimeout(() => {
        setIsTransitioning(false);
        onTransitionEnd?.();
        previousPathRef.current = pathname;
      }, 300);

      return () => clearTimeout(timer);
    }
  }, [
    pathname,
    defaultType,
    onTransitionStart,
    onTransitionEnd,
    isClient,
    isBackButton,
  ]);

  const navigateWithTransition = (href: string, type?: TransitionType) => {
    if (!isClient) {
      router.push(href);
      return;
    }

    setTransitionType(type || defaultType);
    setIsTransitioning(true);
    onTransitionStart?.();

    setTimeout(() => {
      router.push(href);
    }, 150);
  };

  return {
    isTransitioning: isClient ? isTransitioning : false,
    transitionType,
    navigateWithTransition,
  };
}

// Enhanced helper function to determine if navigation is going back
function isBackNavigationTo(
  newPath: string,
  oldPath: string,
  history: string[]
): boolean {
  // Check if the new path exists earlier in the navigation history
  const currentIndex = history.indexOf(newPath);
  const previousIndex = history.indexOf(oldPath);

  // If the new path appears earlier in history than the old path, it's likely back navigation
  if (
    currentIndex !== -1 &&
    previousIndex !== -1 &&
    currentIndex < previousIndex
  ) {
    return true;
  }

  const newPathSegments = newPath.split("/").filter(Boolean);
  const oldPathSegments = oldPath.split("/").filter(Boolean);

  // If new path has fewer segments, it's likely back navigation
  if (newPathSegments.length < oldPathSegments.length) {
    return true;
  }

  // If we're going from a detail page to a list page, it's likely back navigation
  if (oldPath.includes("/recipe/") && newPath === "/") {
    return true;
  }

  if (oldPath.includes("/category/") && newPath === "/") {
    return true;
  }

  if (oldPath.includes("/add") && newPath === "/") {
    return true;
  }

  if (oldPath.includes("/search") && newPath === "/") {
    return true;
  }

  if (oldPath.includes("/auth/") && newPath === "/") {
    return true;
  }

  // Check for browser back button usage by looking at the navigation type
  // This is a heuristic based on common navigation patterns
  if (typeof window !== "undefined" && window.history && window.history.state) {
    // If we're going to a path that was recently visited, it might be back navigation
    const recentPaths = history.slice(-3); // Last 3 paths
    if (recentPaths.includes(newPath) && !recentPaths.includes(oldPath)) {
      return true;
    }
  }

  return false;
}
