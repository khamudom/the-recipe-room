"use client";

import { useState, useEffect } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Mousewheel, FreeMode } from "swiper/modules";
import { RecipeCard } from "../recipe/recipe-card/recipe-card";
import { LoadingSkeleton } from "../../ui/loading-skeleton/loading-skeleton";
import type { Recipe } from "@/types/recipe";
import styles from "./featured-recipes.module.css";

// Import Swiper styles
import "swiper/css";
import "swiper/css/mousewheel";
import "swiper/css/free-mode";

// Custom hook to detect mobile view
function useIsMobile() {
  const [isMobile, setIsMobile] = useState(false);
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
    const checkIsMobile = () => {
      setIsMobile(window.innerWidth <= 767);
    };

    checkIsMobile();

    window.addEventListener("resize", checkIsMobile);

    return () => window.removeEventListener("resize", checkIsMobile);
  }, []);

  // Return false during SSR to prevent hydration mismatch
  return isClient ? isMobile : false;
}

interface FeaturedRecipesProps {
  recipes: Recipe[];
  isLoading: boolean;
  onRecipeClick: (recipe: Recipe) => void;
  maxRecipes?: number;
}

export function FeaturedRecipes({
  recipes,
  isLoading,
  onRecipeClick,
  maxRecipes,
}: FeaturedRecipesProps) {
  const isMobile = useIsMobile();

  // Use 6 for mobile, 3 for desktop, or the provided maxRecipes
  // Default to 3 during SSR to prevent hydration mismatch
  const effectiveMaxRecipes = maxRecipes ?? (isMobile ? 6 : 3);

  // Filter and sort featured recipes by featuredOrder
  const featuredRecipes = recipes
    .filter((recipe) => recipe.featured)
    .sort((a, b) => {
      // Sort by featuredOrder first, then by createdAt as fallback
      const orderA = a.featuredOrder ?? Number.MAX_SAFE_INTEGER;
      const orderB = b.featuredOrder ?? Number.MAX_SAFE_INTEGER;

      if (orderA !== orderB) {
        return orderA - orderB;
      }

      // Fallback to createdAt for recipes without featuredOrder
      return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
    })
    .slice(0, effectiveMaxRecipes);

  const renderRecipeCards = () => {
    return featuredRecipes.map((recipe) => (
      <RecipeCard
        key={recipe.id}
        recipe={recipe}
        onClick={() => onRecipeClick(recipe)}
      />
    ));
  };

  return (
    <section className={styles.featuredSection}>
      <h2 className={`${styles.sectionTitle} section-header`}>Featured</h2>
      <div className={styles.decorativeLine}></div>
      {isLoading ? (
        <LoadingSkeleton count={isMobile ? 2 : 3} type="recipe" />
      ) : featuredRecipes.length > 0 ? (
        <>
          {/* Desktop Grid Layout */}
          <div className={styles.recipeGrid}>{renderRecipeCards()}</div>

          {/* Mobile Carousel Layout with Swiper */}
          <div className={styles.recipeCarousel}>
            <Swiper
              modules={[Mousewheel, FreeMode]}
              spaceBetween={24}
              slidesPerView="auto"
              freeMode={{
                enabled: true,
                sticky: true,
                momentumBounce: false,
                momentumRatio: 0.4,
                momentumVelocityRatio: 0.4,
                minimumVelocity: 0.02,
              }}
              mousewheel={{
                forceToAxis: true,
                sensitivity: 1,
              }}
              grabCursor={true}
              resistance={true}
              resistanceRatio={0.85}
              touchStartPreventDefault={false}
              touchMoveStopPropagation={false}
              preventClicks={true}
              preventClicksPropagation={true}
              threshold={10}
              shortSwipes={true}
              longSwipes={true}
              longSwipesRatio={0.5}
              longSwipesMs={300}
              followFinger={true}
              className={styles.swiperContainer}
            >
              {featuredRecipes.map((recipe) => (
                <SwiperSlide
                  key={recipe.id}
                  className={styles.recipeCarouselItem}
                >
                  <RecipeCard
                    recipe={recipe}
                    onClick={() => onRecipeClick(recipe)}
                  />
                </SwiperSlide>
              ))}
            </Swiper>
          </div>
        </>
      ) : (
        <div style={{ minHeight: "64px" }}></div>
      )}
    </section>
  );
}
