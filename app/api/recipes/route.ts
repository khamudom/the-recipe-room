import { NextRequest, NextResponse } from "next/server";
import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";
import { database } from "@/lib/database";
import { ERROR_MESSAGES } from "@/lib/constants";
import type { Recipe } from "@/types/recipe";

export async function GET(request: NextRequest) {
  try {
    const cookieStore = await cookies();
    const supabase = createServerClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
      {
        cookies: {
          getAll() {
            return cookieStore.getAll();
          },
          setAll(cookiesToSet) {
            try {
              cookiesToSet.forEach(({ name, value, options }) =>
                cookieStore.set(name, value, options)
              );
            } catch {}
          },
        },
      }
    );
    const { searchParams } = new URL(request.url);
    const query = searchParams.get("q");
    const category = searchParams.get("category");
    const featured = searchParams.get("featured");

    let recipes: Recipe[];

    if (query) {
      recipes = await database.searchRecipes(supabase, query);
    } else if (category) {
      recipes = await database.getRecipesByCategory(supabase, category);
    } else if (featured === "true") {
      recipes = await database.getFeaturedRecipes(supabase);
    } else {
      recipes = await database.getRecipes(supabase);
    }

    return NextResponse.json(recipes);
  } catch (error) {
    console.error("Error in GET /api/recipes:", error);
    return NextResponse.json(
      { error: ERROR_MESSAGES.LOAD_RECIPES },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const cookieStore = await cookies();
    const supabase = createServerClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
      {
        cookies: {
          getAll() {
            return cookieStore.getAll();
          },
          setAll(cookiesToSet) {
            try {
              cookiesToSet.forEach(({ name, value, options }) =>
                cookieStore.set(name, value, options)
              );
            } catch {}
          },
        },
      }
    );

    // Get current user
    const {
      data: { user },
      error: userError,
    } = await supabase.auth.getUser();

    if (userError || !user) {
      return NextResponse.json(
        { error: "Authentication required" },
        { status: 401 }
      );
    }

    const recipeData = await request.json();

    // Basic validation
    if (
      !recipeData.title ||
      !recipeData.ingredients ||
      !recipeData.instructions
    ) {
      return NextResponse.json(
        { error: "Missing required recipe fields" },
        { status: 400 }
      );
    }

    const newRecipe = await database.createRecipe(supabase, recipeData);
    return NextResponse.json(newRecipe, { status: 201 });
  } catch (error) {
    console.error("Error in POST /api/recipes:", error);
    return NextResponse.json(
      { error: ERROR_MESSAGES.CREATE_RECIPE },
      { status: 500 }
    );
  }
}
