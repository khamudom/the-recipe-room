"use client";

import { CATEGORIES, CATEGORY_ICONS } from "@/lib/constants";
import {
  HandPlatter,
  Sun,
  Sandwich,
  CookingPot,
  Salad,
  CakeSlice,
  Cookie,
  Wine,
} from "lucide-react";
import styles from "./categories-section.module.css";

// Icon mapping object
const iconComponents = {
  HandPlatter,
  Sun,
  Sandwich,
  CookingPot,
  Salad,
  CakeSlice,
  Cookie,
  Wine,
};

interface CategoriesSectionProps {
  title?: string;
}

export function CategoriesSection({
  title = "Recipe Categories",
}: CategoriesSectionProps) {
  return (
    <section className={styles.categoriesSection}>
      <h2 className={`${styles.sectionTitle} section-header`}>{title}</h2>
      <div className={styles.decorativeLine}></div>
      <div className={styles.categoriesGrid}>
        {CATEGORIES.map((category) => {
          const IconComponent =
            iconComponents[
              CATEGORY_ICONS[category] as keyof typeof iconComponents
            ];
          return (
            <a
              key={category}
              href={`/category/${encodeURIComponent(category)}`}
              className={`${styles.categoryCard} category-card`}
            >
              <IconComponent className={styles.categoryIcon} />
              <span>{category}</span>
            </a>
          );
        })}
      </div>
    </section>
  );
}
