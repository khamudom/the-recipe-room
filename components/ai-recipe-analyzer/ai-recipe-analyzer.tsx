"use client";

import { useState, useRef } from "react";
import {
  Upload,
  ImageIcon,
  Loader2,
  Sparkles,
  X,
  AlertCircle,
} from "lucide-react";
import Image from "next/image";
import styles from "./ai-recipe-analyzer.module.css";

interface RecipeAnalysis {
  title: string;
  description: string;
  ingredients: string[];
  instructions: string[];
  prepTime: string;
  cookTime: string;
  servings: number;
  category: string;
}

interface AIRecipeAnalyzerProps {
  onAnalysisComplete: (recipe: RecipeAnalysis) => void;
  onCancel: () => void;
}

export function AIRecipeAnalyzer({
  onAnalysisComplete,
  onCancel,
}: AIRecipeAnalyzerProps) {
  const [imageData, setImageData] = useState<string>("");
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [error, setError] = useState<string>("");
  const [analysisProgress, setAnalysisProgress] = useState<string>("");
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      // Validate file type
      if (!file.type.startsWith("image/")) {
        setError("Please select a valid image file");
        return;
      }

      // Validate file size (max 20MB for OpenAI)
      if (file.size > 20 * 1024 * 1024) {
        setError("Image file size must be less than 20MB");
        return;
      }

      setError("");
      setAnalysisProgress("");
      const reader = new FileReader();
      reader.onload = (event) => {
        const result = event.target?.result as string;
        setImageData(result);
      };
      reader.readAsDataURL(file);
    }
  };

  const removeImage = () => {
    setImageData("");
    setError("");
    setAnalysisProgress("");
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const analyzeRecipe = async () => {
    if (!imageData) {
      setError("Please upload an image first");
      return;
    }

    setIsAnalyzing(true);
    setError("");
    setAnalysisProgress("Uploading image...");

    let progressInterval: NodeJS.Timeout | null = null;

    try {
      // Simulate progress updates
      const progressUpdates = [
        "Uploading image...",
        "Analyzing recipe content...",
        "Extracting ingredients...",
        "Processing instructions...",
        "Finalizing recipe data...",
      ];

      let progressIndex = 0;
      progressInterval = setInterval(() => {
        if (progressIndex < progressUpdates.length - 1) {
          progressIndex++;
          setAnalysisProgress(progressUpdates[progressIndex]);
        }
      }, 1000);

      const response = await fetch("/api/analyze-recipe", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ imageData }),
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
        throw new Error("No recipe data received from AI analysis");
      }

      setAnalysisProgress("Analysis complete!");

      // Small delay to show completion message
      setTimeout(() => {
        onAnalysisComplete(data.recipe);
      }, 500);
    } catch (err) {
      if (progressInterval) {
        clearInterval(progressInterval);
      }
      const errorMessage =
        err instanceof Error ? err.message : "Failed to analyze recipe";
      setError(errorMessage);
      console.error("Error analyzing recipe:", err);
    } finally {
      setIsAnalyzing(false);
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
          <Sparkles className={styles.sparklesIcon} />
          AI Recipe Analyzer
        </h1>
        <div className={styles.spacer}></div>
      </div>

      <div className={styles.content}>
        <div className={styles.description}>
          <p>
            Upload a photo of a recipe (from a cookbook, handwritten note, or
            any recipe image) and our AI will automatically extract the recipe
            details for you.
          </p>
        </div>

        <div className={styles.uploadSection}>
          <div className={styles.imagePreview}>
            {imageData ? (
              <div className={styles.imageContainer}>
                <Image
                  src={imageData}
                  alt="Recipe image"
                  fill
                  className={styles.previewImage}
                  sizes="(max-width: 768px) 100vw, 400px"
                />
                <button
                  type="button"
                  onClick={removeImage}
                  className={styles.removeButton}
                >
                  <X className={styles.buttonIcon} />
                </button>
              </div>
            ) : (
              <div className={styles.uploadPlaceholder}>
                <ImageIcon className={styles.uploadIcon} />
                <p>Upload a recipe image</p>
                <span>Supports JPG, PNG, GIF up to 20MB</span>
              </div>
            )}
          </div>

          <div className={styles.uploadControls}>
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              onChange={handleImageUpload}
              className={styles.hiddenInput}
            />
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              className={styles.uploadButton}
              disabled={isAnalyzing}
            >
              <Upload className={styles.buttonIcon} />
              {imageData ? "Change Image" : "Choose Image"}
            </button>
          </div>

          {error && (
            <div className={styles.error}>
              <AlertCircle className={styles.errorIcon} />
              {error}
            </div>
          )}
        </div>

        <div className={styles.analyzeSection}>
          <button
            onClick={analyzeRecipe}
            disabled={!imageData || isAnalyzing}
            className={styles.analyzeButton}
          >
            {isAnalyzing ? (
              <>
                <Loader2
                  className={`${styles.buttonIcon} ${styles.spinning}`}
                />
                Analyzing Recipe...
              </>
            ) : (
              <>
                <Sparkles className={styles.buttonIcon} />
                Analyze Recipe
              </>
            )}
          </button>

          {isAnalyzing && (
            <div className={styles.analyzingInfo}>
              <p>{analysisProgress}</p>
              <p>This may take 10-30 seconds depending on image complexity.</p>
            </div>
          )}
        </div>

        <div className={styles.tips}>
          <h3>Tips for best results:</h3>
          <ul>
            <li>Ensure the recipe text is clearly visible and well-lit</li>
            <li>Try to capture the entire recipe in one image</li>
            <li>Handwritten recipes work best when written clearly</li>
            <li>Printed recipes from books or websites work great</li>
            <li>Make sure ingredients and instructions are readable</li>
            <li>Include the recipe title if possible</li>
          </ul>
        </div>

        <div className={styles.pricing}>
          <h3>AI Analysis Cost:</h3>
          <p>
            Each analysis uses OpenAI's GPT-4 Vision API and costs approximately
            $0.01-0.03 per image.
          </p>
        </div>
      </div>
    </div>
  );
}
