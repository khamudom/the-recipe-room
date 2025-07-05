"use client";

import styles from "./loading-skeleton.module.css";

interface LoadingSkeletonProps {
  count?: number;
  type?: "recipe" | "category";
}

export function LoadingSkeleton({
  count = 3,
  type = "recipe",
}: LoadingSkeletonProps) {
  const skeletons = Array.from({ length: count }, (_, index) => (
    <div key={index} className={styles.skeleton}>
      {type === "recipe" ? (
        <>
          <div className={styles.imageSkeleton}></div>
          <div className={styles.contentSkeleton}>
            <div className={styles.titleSkeleton}></div>
            <div className={styles.descriptionSkeleton}></div>
            <div className={styles.metaSkeleton}>
              <div className={styles.metaItemSkeleton}></div>
              <div className={styles.metaItemSkeleton}></div>
            </div>
          </div>
        </>
      ) : (
        <div className={styles.categorySkeleton}></div>
      )}
    </div>
  ));

  return <div className={styles.skeletonGrid}>{skeletons}</div>;
}
