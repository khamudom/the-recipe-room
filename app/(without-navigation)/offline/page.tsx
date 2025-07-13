"use client";

import React from "react";
import styles from "./offline.module.css";

export default function OfflinePage() {
  return (
    <div className={styles.offlineContainer}>
      <div className={styles.offlineContent}>
        <div className={styles.iconContainer}>
          <svg
            className={styles.offlineIcon}
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
          >
            <path d="M1 1l22 22M16.72 11.06A10.94 10.94 0 0 1 19 12.55M5 12.55a10.94 10.94 0 0 1 5.17-2.39M10.71 5.05A16 16 0 0 1 22.58 9M1.42 9a15.91 15.91 0 0 1 4.7-2.88M8.53 16.11a6 6 0 0 1 6.95 0M12 20h.01" />
          </svg>
        </div>

        <h1 className={styles.title}>You&apos;re Offline</h1>

        <p className={styles.description}>
          It looks like you&apos;ve lost your internet connection. Don&apos;t
          worry - you can still access your saved recipes!
        </p>

        <div className={styles.features}>
          <div className={styles.feature}>
            <span className={styles.featureIcon}>📖</span>
            <span>View saved recipes</span>
          </div>
          <div className={styles.feature}>
            <span className={styles.featureIcon}>🔍</span>
            <span>Search your collection</span>
          </div>
          <div className={styles.feature}>
            <span className={styles.featureIcon}>⭐</span>
            <span>Access favorites</span>
          </div>
        </div>

        <button
          className={styles.retryButton}
          onClick={() => window.location.reload()}
        >
          Try Again
        </button>

        <p className={styles.hint}>
          Check your internet connection and try again
        </p>
      </div>
    </div>
  );
}
