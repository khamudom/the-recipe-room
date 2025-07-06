import { NextRequest, NextResponse } from "next/server";
import OpenAI from "openai";

interface RecipeAnalysis {
  title: string;
  description: string;
  ingredients: string[];
  instructions: string[];
  prepTime: string;
  cookTime: string;
  servings: string;
  category: string;
}

interface MultiImageAnalysisRequest {
  imageData: string | string[];
}

// Initialize OpenAI client
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export async function POST(request: NextRequest) {
  try {
    const { imageData } = (await request.json()) as MultiImageAnalysisRequest;

    if (!imageData) {
      return NextResponse.json(
        { error: "Image data is required" },
        { status: 400 }
      );
    }

    if (!process.env.OPENAI_API_KEY) {
      return NextResponse.json(
        { error: "OpenAI API key is not configured" },
        { status: 500 }
      );
    }

    // Convert single image to array for consistent processing
    const images = Array.isArray(imageData) ? imageData : [imageData];

    // Validate all images
    for (const image of images) {
      if (!image.startsWith("data:image/")) {
        return NextResponse.json(
          { error: "Invalid image format. Please upload valid images." },
          { status: 400 }
        );
      }
    }

    console.log(`Starting AI recipe analysis for ${images.length} image(s)...`);

    // If multiple images, analyze them sequentially and combine results
    if (images.length > 1) {
      return await analyzeMultipleImages(images);
    } else {
      return await analyzeSingleImage(images[0]);
    }
  } catch (error) {
    console.error("Error analyzing recipe image:", error);

    // Handle specific OpenAI errors
    if (error instanceof Error) {
      if (error.message.includes("API key")) {
        return NextResponse.json(
          { error: "Invalid OpenAI API key. Please check your configuration." },
          { status: 401 }
        );
      }

      if (error.message.includes("rate limit")) {
        return NextResponse.json(
          { error: "Rate limit exceeded. Please try again in a moment." },
          { status: 429 }
        );
      }

      if (error.message.includes("quota")) {
        return NextResponse.json(
          { error: "OpenAI quota exceeded. Please check your account." },
          { status: 402 }
        );
      }
    }

    return NextResponse.json(
      { error: "Failed to analyze recipe image. Please try again." },
      { status: 500 }
    );
  }
}

async function analyzeSingleImage(imageData: string): Promise<NextResponse> {
  // Call OpenAI GPT-4o Vision API
  const response = await openai.chat.completions.create({
    model: "gpt-4o",
    messages: [
      {
        role: "system",
        content: `You are an expert recipe analyzer. Your task is to extract recipe information from images and return it in a specific JSON format. Be precise and thorough in your analysis.`,
      },
      {
        role: "user",
        content: [
          {
            type: "text",
            text: `Please analyze this recipe image and extract all available recipe information. Return ONLY a valid JSON object with this exact structure:

{
  "title": "Recipe title",
  "description": "Brief description of the recipe",
  "ingredients": ["ingredient 1", "ingredient 2", ...],
  "instructions": ["step 1", "step 2", ...],
  "prepTime": "prep time in minutes or descriptive text",
  "cookTime": "cook time in minutes or descriptive text", 
  "servings": number,
  "category": "one of: Appetizer, Breakfast, Lunch, Dinner, Side Dish, Dessert, Snack, Beverage"
}

Guidelines:
- Extract ingredients as individual strings in an array
- Extract instructions as numbered steps in an array
- For time fields, use descriptive text like "30 minutes" or "1 hour"
- For servings, use a string that is a number
- Choose the most appropriate category from the list above
- If any information is not clearly visible, make a reasonable estimate
- Return ONLY the JSON object, no additional text or explanations`,
          },
          {
            type: "image_url",
            image_url: {
              url: imageData,
            },
          },
        ],
      },
    ],
    max_tokens: 2000,
    temperature: 0.1,
  });

  const content = response.choices[0]?.message?.content;

  if (!content) {
    throw new Error("No response from OpenAI API");
  }

  console.log("Raw AI response:", content);

  // Extract JSON from the response
  let recipeData: RecipeAnalysis;

  try {
    // Clean the content to remove markdown formatting
    let cleanedContent = content.trim();

    // Remove markdown code blocks if present
    if (cleanedContent.startsWith("```json")) {
      cleanedContent = cleanedContent
        .replace(/^```json\s*/, "")
        .replace(/\s*```$/, "");
    } else if (cleanedContent.startsWith("```")) {
      cleanedContent = cleanedContent
        .replace(/^```\s*/, "")
        .replace(/\s*```$/, "");
    }

    // Try to parse the cleaned response as JSON
    recipeData = JSON.parse(cleanedContent);
  } catch (parseError) {
    console.error("Failed to parse AI response as JSON:", parseError);
    // If direct parsing fails, try to extract JSON from the response
    const jsonMatch = content.match(/\{[\s\S]*\}/);
    if (jsonMatch) {
      try {
        recipeData = JSON.parse(jsonMatch[0]);
      } catch (secondParseError) {
        console.error(
          "Failed to parse extracted JSON from AI response:",
          secondParseError
        );
        console.error("Failed to parse AI response as JSON:", content);
        return NextResponse.json(
          { error: "Failed to parse recipe data from AI response" },
          { status: 500 }
        );
      }
    } else {
      console.error("No JSON found in AI response:", content);
      return NextResponse.json(
        { error: "AI response did not contain valid recipe data" },
        { status: 500 }
      );
    }
  }

  // Validate and process the extracted data
  return processRecipeData(recipeData, response.usage?.total_tokens || 0);
}

async function analyzeMultipleImages(images: string[]): Promise<NextResponse> {
  const results: RecipeAnalysis[] = [];
  let totalTokens = 0;

  // Analyze each image individually
  for (let i = 0; i < images.length; i++) {
    console.log(`Analyzing image ${i + 1} of ${images.length}...`);

    try {
      const response = await openai.chat.completions.create({
        model: "gpt-4o",
        messages: [
          {
            role: "system",
            content: `You are an expert recipe analyzer. Your task is to extract recipe information from images and return it in a specific JSON format. This is image ${
              i + 1
            } of ${
              images.length
            } - analyze it independently and extract any recipe information you can find.`,
          },
          {
            role: "user",
            content: [
              {
                type: "text",
                text: `Please analyze this recipe image (image ${i + 1} of ${
                  images.length
                }) and extract all available recipe information. Return ONLY a valid JSON object with this exact structure:

{
  "title": "Recipe title or partial title",
  "description": "Brief description of the recipe",
  "ingredients": ["ingredient 1", "ingredient 2", ...],
  "instructions": ["step 1", "step 2", ...],
  "prepTime": "prep time in minutes or descriptive text",
  "cookTime": "cook time in minutes or descriptive text", 
  "servings": number,
  "category": "one of: Appetizer, Breakfast, Lunch, Dinner, Side Dish, Dessert, Snack, Beverage"
}

Guidelines:
- Extract ingredients as individual strings in an array
- Extract instructions as numbered steps in an array
- For time fields, use descriptive text like "30 minutes" or "1 hour"
- For servings, use a string that is a number
- Choose the most appropriate category from the list above
- If any information is not clearly visible, make a reasonable estimate
- Return ONLY the JSON object, no additional text or explanations
- If this image doesn't contain recipe information, return empty arrays for ingredients and instructions`,
              },
              {
                type: "image_url",
                image_url: {
                  url: images[i],
                },
              },
            ],
          },
        ],
        max_tokens: 2000,
        temperature: 0.1,
      });

      const content = response.choices[0]?.message?.content;
      totalTokens += response.usage?.total_tokens || 0;

      if (content) {
        try {
          let cleanedContent = content.trim();

          if (cleanedContent.startsWith("```json")) {
            cleanedContent = cleanedContent
              .replace(/^```json\s*/, "")
              .replace(/\s*```$/, "");
          } else if (cleanedContent.startsWith("```")) {
            cleanedContent = cleanedContent
              .replace(/^```\s*/, "")
              .replace(/\s*```$/, "");
          }

          const recipeData = JSON.parse(cleanedContent);
          results.push(recipeData);
        } catch (parseError) {
          console.error(
            `Failed to parse response for image ${i + 1}:`,
            parseError
          );
          // Continue with other images even if one fails
        }
      }
    } catch (error) {
      console.error(`Error analyzing image ${i + 1}:`, error);
      // Continue with other images even if one fails
    }
  }

  // Combine results from all images
  const combinedRecipe = combineRecipeResults(results);

  return processRecipeData(combinedRecipe, totalTokens);
}

function combineRecipeResults(results: RecipeAnalysis[]): RecipeAnalysis {
  console.log("Combining results from", results.length, "images");
  console.log("Sample result:", JSON.stringify(results[0], null, 2));

  if (results.length === 0) {
    throw new Error("No valid recipe data found in any image");
  }

  if (results.length === 1) {
    return results[0];
  }

  // Combine multiple results intelligently
  const combined: RecipeAnalysis = {
    title: "",
    description: "",
    ingredients: [],
    instructions: [],
    prepTime: "",
    cookTime: "",
    servings: "",
    category: "",
  };

  // Find the best title (non-empty, most complete)
  const titles = results
    .map((r) => r.title)
    .filter((t) => t && String(t).trim());
  combined.title = titles.length > 0 ? titles[0] : "Untitled Recipe";

  // Combine descriptions
  const descriptions = results
    .map((r) => r.description)
    .filter((d) => d && String(d).trim());
  combined.description = descriptions.join(" ");

  // Combine ingredients (remove duplicates)
  const allIngredients = results.flatMap((r) => r.ingredients || []);
  const uniqueIngredients = Array.from(
    new Set(allIngredients.map((i) => i.trim().toLowerCase()))
  )
    .map((ingredient) => {
      // Find the original case from the first occurrence
      return (
        allIngredients.find((i) => i.trim().toLowerCase() === ingredient) ||
        ingredient
      );
    })
    .filter((i) => i.trim());

  combined.ingredients = uniqueIngredients;

  // Combine instructions (maintain order and remove duplicates)
  const allInstructions = results.flatMap((r) => r.instructions || []);
  const uniqueInstructions = allInstructions
    .filter((instruction, index, arr) => {
      const normalized = instruction.trim().toLowerCase();
      return (
        arr.findIndex((i) => i.trim().toLowerCase() === normalized) === index
      );
    })
    .filter((i) => i.trim());

  combined.instructions = uniqueInstructions;

  // Use the first non-empty value for each time field
  combined.prepTime =
    results.find((r) => r.prepTime && String(r.prepTime || "").trim())
      ?.prepTime || "";
  combined.cookTime =
    results.find((r) => r.cookTime && String(r.cookTime || "").trim())
      ?.cookTime || "";

  // Handle servings more carefully since it might be a number
  const servingsResult = results.find((r) => {
    if (!r.servings) return false;
    const servingsStr = String(r.servings);
    return (
      servingsStr.trim() !== "" &&
      servingsStr !== "null" &&
      servingsStr !== "undefined"
    );
  });
  combined.servings = servingsResult ? String(servingsResult.servings) : "4";

  // Use the most common category, or the first non-empty one
  const categories = results
    .map((r) => r.category)
    .filter((c) => c && String(c).trim());
  if (categories.length > 0) {
    const categoryCounts = categories.reduce((acc, cat) => {
      acc[cat] = (acc[cat] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    const mostCommon = Object.entries(categoryCounts).sort(
      ([, a], [, b]) => b - a
    )[0][0];
    combined.category = mostCommon;
  } else {
    combined.category = "Dinner";
  }

  return combined;
}

function processRecipeData(
  recipeData: RecipeAnalysis,
  totalTokens: number
): NextResponse {
  // Validate the extracted data
  const requiredFields = ["title", "ingredients", "instructions"];
  const missingFields = requiredFields.filter((field) => {
    const value = recipeData[field as keyof RecipeAnalysis];
    if (field === "ingredients" || field === "instructions") {
      return !Array.isArray(value) || value.length === 0;
    }
    return !value || String(value).trim() === "";
  });

  if (missingFields.length > 0) {
    return NextResponse.json(
      { error: `Missing required fields: ${missingFields.join(", ")}` },
      { status: 422 }
    );
  }

  // Ensure arrays are properly formatted
  if (!Array.isArray(recipeData.ingredients)) {
    recipeData.ingredients = [recipeData.ingredients as string].filter(Boolean);
  }

  if (!Array.isArray(recipeData.instructions)) {
    recipeData.instructions = [recipeData.instructions as string].filter(
      Boolean
    );
  }

  // Set defaults for missing optional fields
  const analysis: RecipeAnalysis = {
    title: recipeData.title || "Untitled Recipe",
    description: recipeData.description || "",
    ingredients: recipeData.ingredients || [],
    instructions: recipeData.instructions || [],
    prepTime: recipeData.prepTime || "",
    cookTime: recipeData.cookTime || "",
    servings: String(recipeData.servings || "4"),
    category: recipeData.category || "Dinner",
  };

  console.log("Successfully analyzed recipe:", analysis.title);

  return NextResponse.json({
    recipe: analysis,
    confidence: 0.9,
    processingTime: totalTokens,
  });
}
