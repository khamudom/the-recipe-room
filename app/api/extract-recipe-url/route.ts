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

// Initialize OpenAI client
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export async function POST(request: NextRequest) {
  try {
    const { url } = await request.json();

    if (!url) {
      return NextResponse.json(
        { error: "URL is required" },
        { status: 400 }
      );
    }

    if (!process.env.OPENAI_API_KEY) {
      return NextResponse.json(
        { error: "OpenAI API key is not configured" },
        { status: 500 }
      );
    }

    // Validate URL format
    try {
      new URL(url);
    } catch {
      return NextResponse.json(
        { error: "Invalid URL format" },
        { status: 400 }
      );
    }

    console.log("Starting recipe extraction from URL:", url);

    // First, fetch the webpage content
    let webpageContent = "";
    try {
      const response = await fetch(url, {
        headers: {
          'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36'
        }
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      webpageContent = await response.text();
    } catch (fetchError) {
      console.error("Error fetching webpage:", fetchError);
      return NextResponse.json(
        { error: "Failed to fetch webpage content. Please check the URL and try again." },
        { status: 400 }
      );
    }

    // Extract recipe content using AI
    const response = await openai.chat.completions.create({
      model: "gpt-4o",
      messages: [
        {
          role: "system",
          content: `You are an expert recipe extractor. Your task is to extract recipe information from webpage content and return it in a specific JSON format. Be precise and thorough in your analysis.`
        },
        {
          role: "user",
          content: `Please analyze this webpage content and extract all available recipe information. Return ONLY a valid JSON object with this exact structure:

{
  "title": "Recipe title",
  "description": "Brief description of the recipe",
  "ingredients": ["ingredient 1", "ingredient 2", ...],
  "instructions": ["step 1", "step 2", ...],
  "prepTime": "prep time in minutes or descriptive text",
  "cookTime": "cook time in minutes or descriptive text", 
  "servings": "number of servings",
  "category": "one of: Appetizer, Main Course, Side Dish, Dessert, Beverage, Breakfast, Snack"
}

Guidelines:
- Extract ingredients as individual strings in an array
- Extract instructions as numbered steps in an array
- For time fields, use descriptive text like "30 minutes" or "1 hour"
- For servings, use a string that represents the number
- Choose the most appropriate category from the list above
- If any information is not clearly visible, make a reasonable estimate
- Focus on recipe-specific content and ignore navigation, ads, and other non-recipe content
- Return ONLY the JSON object, no additional text or explanations

Webpage content:
${webpageContent.substring(0, 8000)}` // Limit content to avoid token limits
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
      if (cleanedContent.startsWith('```json')) {
        cleanedContent = cleanedContent.replace(/^```json\s*/, '').replace(/\s*```$/, '');
      } else if (cleanedContent.startsWith('```')) {
        cleanedContent = cleanedContent.replace(/^```\s*/, '').replace(/\s*```$/, '');
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

    // Validate the extracted data
    const requiredFields = ["title", "ingredients", "instructions"];
    const missingFields = requiredFields.filter(
      (field) => !recipeData[field as keyof RecipeAnalysis]
    );

    if (missingFields.length > 0) {
      return NextResponse.json(
        { error: `Missing required fields: ${missingFields.join(", ")}` },
        { status: 422 }
      );
    }

    // Ensure arrays are properly formatted
    if (!Array.isArray(recipeData.ingredients)) {
      recipeData.ingredients = [recipeData.ingredients as string].filter(
        Boolean
      );
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
      servings: recipeData.servings || "4",
      category: recipeData.category || "Main Course",
    };

    console.log("Successfully extracted recipe:", analysis.title);

    return NextResponse.json({
      recipe: analysis,
      confidence: 0.9,
      processingTime: response.usage?.total_tokens || 0,
      sourceUrl: url,
    });
  } catch (error) {
    console.error("Error extracting recipe from URL:", error);

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
      { error: "Failed to extract recipe from URL. Please try again." },
      { status: 500 }
    );
  }
} 