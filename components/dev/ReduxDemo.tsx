"use client";

import { useAppSelector, useAppDispatch } from "@/lib/store/store-hooks";
import {
  setTheme,
  toggleTheme,
  setLoading,
  openAboutModal,
  closeAboutModal,
} from "@/lib/store/slices/uiSlice";
import { Button } from "@/components/ui/button/button";
import { Card } from "@/components/ui/card/card";
import { Sun, Moon, Loader2, Info } from "lucide-react";
import styles from "./redux-demo.module.css";

export function ReduxDemo() {
  const theme = useAppSelector((state) => state.ui.theme);
  const isLoading = useAppSelector((state) => state.ui.isLoading);
  const loadingMessage = useAppSelector((state) => state.ui.loadingMessage);
  const isAboutModalOpen = useAppSelector((state) => state.ui.isAboutModalOpen);

  const dispatch = useAppDispatch();

  const handleThemeToggle = () => {
    dispatch(toggleTheme());
  };

  const handleSetLightTheme = () => {
    dispatch(setTheme("light"));
  };

  const handleSetDarkTheme = () => {
    dispatch(setTheme("dark"));
  };

  const handleLoadingDemo = () => {
    dispatch(setLoading({ isLoading: true, message: "Loading demo data..." }));

    // Simulate async operation
    setTimeout(() => {
      dispatch(setLoading({ isLoading: false }));
    }, 2000);
  };

  const handleOpenAboutModal = () => {
    dispatch(openAboutModal());
  };

  const handleCloseAboutModal = () => {
    dispatch(closeAboutModal());
  };

  return (
    <div className={styles.container}>
      <Card className={styles.card}>
        <h3 className={styles.title}>Redux Demo</h3>
        <p className={styles.description}>
          This component demonstrates Redux state management. The state is
          shared across the entire app.
        </p>

        <div className={styles.section}>
          <h4>Theme Management</h4>
          <div className={styles.themeControls}>
            <Button onClick={handleThemeToggle} variant="outline" size="small">
              {theme === "light" ? <Moon size={16} /> : <Sun size={16} />}
              Toggle Theme
            </Button>
            <Button
              onClick={handleSetLightTheme}
              variant="outline"
              size="small"
              disabled={theme === "light"}
            >
              <Sun size={16} />
              Light
            </Button>
            <Button
              onClick={handleSetDarkTheme}
              variant="outline"
              size="small"
              disabled={theme === "dark"}
            >
              <Moon size={16} />
              Dark
            </Button>
          </div>
          <p className={styles.currentState}>
            Current theme: <strong>{theme}</strong>
          </p>
        </div>

        <div className={styles.section}>
          <h4>Loading State</h4>
          <Button onClick={handleLoadingDemo} disabled={isLoading} size="small">
            {isLoading ? (
              <>
                <Loader2 size={16} className={styles.spinning} />
                Loading...
              </>
            ) : (
              "Start Loading Demo"
            )}
          </Button>
          {isLoading && (
            <p className={styles.loadingMessage}>{loadingMessage}</p>
          )}
        </div>

        <div className={styles.section}>
          <h4>Modal State</h4>
          <Button onClick={handleOpenAboutModal} variant="outline" size="small">
            <Info size={16} />
            Open About Modal
          </Button>
          <p className={styles.currentState}>
            About modal is:{" "}
            <strong>{isAboutModalOpen ? "Open" : "Closed"}</strong>
          </p>
        </div>

        <div className={styles.section}>
          <h4>Redux DevTools</h4>
          <p className={styles.description}>
            Open your browser&apos;s Redux DevTools extension to see state
            changes in real-time!
          </p>
          <p className={styles.tip}>
            💡 Tip: Install the Redux DevTools browser extension to inspect
            state changes
          </p>
        </div>
      </Card>

      {/* Simple modal to demonstrate modal state */}
      {isAboutModalOpen && (
        <div className={styles.modalOverlay} onClick={handleCloseAboutModal}>
          <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
            <h3>About Modal (Redux Controlled)</h3>
            <p>This modal&apos;s open/close state is managed by Redux!</p>
            <Button onClick={handleCloseAboutModal} size="small">
              Close
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
