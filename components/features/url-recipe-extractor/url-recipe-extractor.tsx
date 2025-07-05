"use client";

import { useState } from "react";
import {
  Loader2,
  Sparkles,
  X,
  AlertCircle,
  Globe,
} from "lucide-react";
import styles from "./url-recipe-extractor.module.css";
import type { AIRecipeAnalysisResult } from "@/types/recipe";

interface URLRecipeExtractorProps {
  onExtractionComplete: (recipe: AIRecipeAnalysisResult) => void;
  onCancel: () => void;
}

export function URLRecipeExtractor({
  onExtractionComplete,
  onCancel,
}: URLRecipeExtractorProps) {
  const [url, setUrl] = useState<string>("");
  const [isExtracting, setIsExtracting] = useState(false);
  const [error, setError] = useState<string>("");
  const [extractionProgress, setExtractionProgress] = useState<string>("");

  const extractRecipe = async () => {
    if (!url.trim()) {
      setError("Please enter a valid URL");
      return;
    }

    // Basic URL validation
    try {
      new URL(url);
    } catch {
      setError("Please enter a valid URL format (e.g., https://example.com/recipe)");
      return;
    }

    setIsExtracting(true);
    setError("");
    setExtractionProgress("Fetching webpage...");

    let progressInterval: NodeJS.Timeout | null = null;

    try {
      // Simulate progress updates
      const progressUpdates = [
        "Fetching webpage...",
        "Analyzing recipe content...",
        "Extracting ingredients...",
        "Processing instructions...",
        "Finalizing recipe data...",
      ];

      let progressIndex = 0;
      progressInterval = setInterval(() => {
        if (progressIndex < progressUpdates.length - 1) {
          progressIndex++;
          setExtractionProgress(progressUpdates[progressIndex]);
        }
      }, 1000);

      const response = await fetch("/api/extract-recipe-url", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ url: url.trim() }),
      });

      if (progressInterval) {
        clearInterval(progressInterval);
      }

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(
          errorData.error || `HTTP error! status: ${response.status}`
        );
      }

      const data = await response.json();

      if (!data.recipe) {
        throw new Error("No recipe data received from extraction");
      }

      setExtractionProgress("Extraction complete!");

      // Small delay to show completion message
      setTimeout(() => {
        onExtractionComplete(data.recipe);
      }, 500);
    } catch (err) {
      if (progressInterval) {
        clearInterval(progressInterval);
      }
      const errorMessage =
        err instanceof Error ? err.message : "Failed to extract recipe";
      setError(errorMessage);
      console.error("Error extracting recipe:", err);
    } finally {
      setIsExtracting(false);
    }
  };

  const handleUrlChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setUrl(e.target.value);
    if (error) setError("");
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !isExtracting) {
      extractRecipe();
    }
  };

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <button onClick={onCancel} className={styles.cancelButton}>
          <X className={styles.buttonIcon} />
          Cancel
        </button>
        <h1 className={styles.title}>
          <Globe className={styles.globeIcon} />
          URL Recipe Extractor
        </h1>
        <div className={styles.spacer}></div>
      </div>

      <div className={styles.content}>
        <div className={styles.description}>
          <p>
            Enter a URL to a recipe webpage and our AI will automatically extract
            all the recipe details for you. Works with most recipe websites!
          </p>
        </div>

        <div className={styles.urlSection}>
          <div className={styles.urlInputGroup}>
            <label htmlFor="recipe-url" className={styles.label}>
              Recipe URL
            </label>
            <div className={styles.urlInputContainer}>
              <Globe className={styles.urlIcon} />
              <input
                id="recipe-url"
                type="url"
                value={url}
                onChange={handleUrlChange}
                onKeyPress={handleKeyPress}
                placeholder="https://example.com/recipe-page"
                className={styles.urlInput}
                disabled={isExtracting}
              />
            </div>
          </div>

          <div className={styles.warning}>
            <AlertCircle className={styles.warningIcon} />
            <span>
              Some recipe websites block automated access for legal and technical reasons. If extraction fails, try a different URL or use the copy-paste option below. Please respect website terms of service.
            </span>
          </div>

          {error && (
            <div className={styles.error}>
              <AlertCircle className={styles.errorIcon} />
              {error}
            </div>
          )}
        </div>

        <div className={styles.extractSection}>
          <button
            onClick={extractRecipe}
            disabled={!url.trim() || isExtracting}
            className={styles.extractButton}
          >
            {isExtracting ? (
              <>
                <Loader2
                  className={`${styles.buttonIcon} ${styles.spinning}`}
                />
                Extracting Recipe...
              </>
            ) : (
              <>
                <Sparkles className={styles.buttonIcon} />
                Extract Recipe
              </>
            )}
          </button>

          {isExtracting && (
            <div className={styles.extractingInfo}>
              <p>{extractionProgress}</p>
              <p>This may take 10-30 seconds depending on the webpage.</p>
            </div>
          )}
        </div>

        <div className={styles.tips}>
          <h3>Tips for best results:</h3>
          <ul>
            <li>Use URLs from popular recipe websites (AllRecipes, Food Network, etc.)</li>
            <li>Make sure the URL points directly to a recipe page</li>
            <li>Most recipe blogs and cooking websites work well</li>
            <li>Ensure the webpage is publicly accessible</li>
            <li>Some websites may block automated access (see warning above)</li>
            <li>For best results, use URLs that contain clear recipe information</li>
            <li><b>Respect website terms of service and copyright.</b></li>
          </ul>
        </div>

        <div className={styles.supportedSites}>
          <h3>Supported Recipe Websites:</h3>
          <div className={styles.siteList}>
            <span>AllRecipes</span>
            <span>Food Network</span>
            <span>Epicurious</span>
            <span>Bon Appétit</span>
            <span>Serious Eats</span>
            <span>King Arthur Baking</span>
            <span>Most recipe blogs</span>
            <span>And many more!</span>
          </div>
        </div>

        <div className={styles.pricing}>
          <h3>AI Extraction Cost:</h3>
          <p>
            Each extraction uses OpenAI&apos;s GPT-4 API and costs
            approximately $0.01-0.03 per URL.
          </p>
        </div>
      </div>
    </div>
  );
} 