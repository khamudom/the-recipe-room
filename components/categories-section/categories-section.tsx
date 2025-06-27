"use client";

import { CATEGORIES } from "@/lib/constants";
import styles from "./categories-section.module.css";

interface CategoriesSectionProps {
  title?: string;
}

export function CategoriesSection({
  title = "Recipe Categories",
}: CategoriesSectionProps) {
  return (
    <section className={styles.categoriesSection}>
      <h2 className={styles.sectionTitle}>{title}</h2>
      <div className={styles.categoriesGrid}>
        {CATEGORIES.map((category) => (
          <a
            key={category}
            href={`/category/${encodeURIComponent(category)}`}
            className={styles.categoryCard}
          >
            {category}
          </a>
        ))}
      </div>
    </section>
  );
}
