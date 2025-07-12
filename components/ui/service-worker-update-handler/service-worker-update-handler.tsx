"use client";

import { useEffect, useState } from "react";
import styles from "./service-worker-update-handler.module.css";

export function ServiceWorkerUpdateHandler() {
  const [updateAvailable, setUpdateAvailable] = useState(false);
  const [isUpdating, setIsUpdating] = useState(false);

  useEffect(() => {
    if (typeof window === "undefined" || !("serviceWorker" in navigator)) {
      return;
    }

    // Listen for service worker updates
    const handleUpdateFound = () => {
      setUpdateAvailable(true);
    };

    // Listen for service worker controller change (update applied)
    const handleControllerChange = () => {
      setUpdateAvailable(false);
      setIsUpdating(false);
    };

    // Listen for messages from service worker
    const handleMessage = (event: MessageEvent) => {
      if (event.data && event.data.type === "SW_UPDATED") {
        setUpdateAvailable(false);
        setIsUpdating(false);
      }
    };

    // Check if there's already a waiting service worker
    if (navigator.serviceWorker.controller) {
      navigator.serviceWorker.ready.then((registration) => {
        if (registration.waiting) {
          setUpdateAvailable(true);
        }
      });
    }

    // Listen for new service worker installations
    navigator.serviceWorker.addEventListener("updatefound", handleUpdateFound);
    navigator.serviceWorker.addEventListener(
      "controllerchange",
      handleControllerChange
    );
    navigator.serviceWorker.addEventListener("message", handleMessage);

    return () => {
      navigator.serviceWorker.removeEventListener(
        "updatefound",
        handleUpdateFound
      );
      navigator.serviceWorker.removeEventListener(
        "controllerchange",
        handleControllerChange
      );
      navigator.serviceWorker.removeEventListener("message", handleMessage);
    };
  }, []);

  const handleUpdate = () => {
    if (typeof window === "undefined" || !("serviceWorker" in navigator)) {
      return;
    }

    setIsUpdating(true);

    // Send message to waiting service worker to skip waiting
    navigator.serviceWorker.ready.then((registration) => {
      if (registration.waiting) {
        registration.waiting.postMessage({ type: "SKIP_WAITING" });
      }
    });

    // Reload the page after a short delay to apply the update
    setTimeout(() => {
      window.location.reload();
    }, 1000);
  };

  const handleDismiss = () => {
    setUpdateAvailable(false);
  };

  if (!updateAvailable) {
    return null;
  }

  return (
    <div className={styles.updateNotification}>
      <div className={styles.updateContent}>
        <div className={styles.updateIcon}>
          <svg
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M21 2l-2 2m-7.61 7.61a5.5 5.5 0 1 1-7.778 7.778 5.5 5.5 0 0 1 7.777-7.777zm0 0L15.5 7.5m0 0 3 3L22 7l-3-3m-3.5 3.5L19 4" />
          </svg>
        </div>
        <div className={styles.updateText}>
          <h3>New Update Available</h3>
          <p>A new version of The Recipe Room is ready to install</p>
        </div>
        <div className={styles.updateActions}>
          <button
            onClick={handleUpdate}
            disabled={isUpdating}
            className={styles.updateButton}
          >
            {isUpdating ? "Updating..." : "Update Now"}
          </button>
          <button onClick={handleDismiss} className={styles.dismissButton}>
            Later
          </button>
        </div>
      </div>
    </div>
  );
}
