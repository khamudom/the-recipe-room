// Lottie animation data types
export interface LottieAsset {
  id: string;
  w?: number;
  h?: number;
  u?: string;
  p?: string;
  e?: number;
  layers?: LottieLayer[];
  [key: string]: unknown;
}

export interface LottieLayer {
  ddd?: number;
  ind: number;
  ty: number;
  nm: string;
  sr: number;
  ks: Record<string, unknown>;
  ao: number;
  sw: number;
  sh: number;
  sc: string;
  pf: string;
  t: number;
  [key: string]: unknown;
}

export interface LottieAnimationData {
  v: string;
  fr: number;
  ip: number;
  op: number;
  w: number;
  h: number;
  nm: string;
  ddd: number;
  assets: LottieAsset[];
  layers: LottieLayer[];
  [key: string]: unknown; // Allow additional properties that might be in Lottie files
}

// Lottie animation cache for instant loading
class LottieCache {
  private cache = new Map<string, LottieAnimationData>();
  private loadingPromises = new Map<string, Promise<LottieAnimationData>>();

  async preloadAnimation(path: string): Promise<LottieAnimationData> {
    // If already cached, return immediately
    if (this.cache.has(path)) {
      return this.cache.get(path)!;
    }

    // If already loading, wait for that promise
    if (this.loadingPromises.has(path)) {
      return this.loadingPromises.get(path)!;
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

  private async loadAnimation(path: string): Promise<LottieAnimationData> {
    const response = await fetch(path);
    if (!response.ok) {
      throw new Error(`Failed to load animation: ${response.statusText}`);
    }
    return response.json();
  }

  getCachedAnimation(path: string): LottieAnimationData | null {
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