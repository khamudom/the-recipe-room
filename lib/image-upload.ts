export interface ImageUploadResult {
  url: string;
  path: string;
  error?: string;
}

export async function uploadImageToSupabase(
  file: File
): Promise<ImageUploadResult> {
  try {
    const formData = new FormData();
    formData.append("file", file);

    const response = await fetch("/api/upload-image", {
      method: "POST",
      body: formData,
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(
        errorData.error || `HTTP error! status: ${response.status}`
      );
    }

    const data = await response.json();
    return {
      url: data.url,
      path: data.path,
    };
  } catch (error) {
    console.error("Error in uploadImageToSupabase:", error);
    return {
      url: "",
      path: "",
      error: error instanceof Error ? error.message : "Unknown error occurred",
    };
  }
}

export async function deleteImageFromSupabase(
  filePath: string
): Promise<{ error?: string }> {
  try {
    const response = await fetch("/api/upload-image", {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ path: filePath }),
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(
        errorData.error || `HTTP error! status: ${response.status}`
      );
    }

    return {};
  } catch (error) {
    console.error("Error in deleteImageFromSupabase:", error);
    return {
      error: error instanceof Error ? error.message : "Unknown error occurred",
    };
  }
}

export function isBase64Image(imageUrl: string): boolean {
  return imageUrl.startsWith("data:image/");
}

export function extractFilePathFromUrl(url: string): string | null {
  try {
    const urlObj = new URL(url);
    const pathParts = urlObj.pathname.split("/");
    const storageIndex = pathParts.findIndex((part) => part === "storage");

    if (storageIndex !== -1 && pathParts.length > storageIndex + 4) {
      // Extract the path after /storage/v1/object/public/bucket-name/
      return pathParts.slice(storageIndex + 5).join("/");
    }

    return null;
  } catch {
    return null;
  }
}
