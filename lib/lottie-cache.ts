// Lottie animation cache for instant loading
class LottieCache {
  private cache = new Map<string, any>();
  private loadingPromises = new Map<string, Promise<any>>();

  async preloadAnimation(path: string): Promise<any> {
    // If already cached, return immediately
    if (this.cache.has(path)) {
      return this.cache.get(path);
    }

    // If already loading, wait for that promise
    if (this.loadingPromises.has(path)) {
      return this.loadingPromises.get(path);
    }

    // Start loading
    const loadPromise = this.loadAnimation(path);
    this.loadingPromises.set(path, loadPromise);

    try {
      const data = await loadPromise;
      this.cache.set(path, data);
      this.loadingPromises.delete(path);
      return data;
    } catch (error) {
      this.loadingPromises.delete(path);
      throw error;
    }
  }

  private async loadAnimation(path: string): Promise<any> {
    const response = await fetch(path);
    if (!response.ok) {
      throw new Error(`Failed to load animation: ${response.statusText}`);
    }
    return response.json();
  }

  getCachedAnimation(path: string): any | null {
    return this.cache.get(path) || null;
  }

  isLoaded(path: string): boolean {
    return this.cache.has(path);
  }

  clearCache(): void {
    this.cache.clear();
    this.loadingPromises.clear();
  }
}

// Global instance
export const lottieCache = new LottieCache();

// Preload default animation on module load
const DEFAULT_ANIMATION_PATH = "/assets/lottie/Animation - 1751255045745.json";
lottieCache.preloadAnimation(DEFAULT_ANIMATION_PATH).catch(console.error); 