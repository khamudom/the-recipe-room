import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/auth-helpers";

export async function GET(request: NextRequest) {
  try {
    const supabase = await createClient();
    const { searchParams } = new URL(request.url);
    const query = searchParams.get("q");
    const category = searchParams.get("category");
    const featured = searchParams.get("featured");

    let supabaseQuery = supabase
      .from("recipes")
      .select("*")
      .order("created_at", { ascending: false });

    if (query) {
      supabaseQuery = supabaseQuery.or(
        `title.ilike.%${query}%,description.ilike.%${query}%`
      );
    }

    if (category) {
      supabaseQuery = supabaseQuery.eq("category", category);
    }

    if (featured === "true") {
      supabaseQuery = supabaseQuery.eq("featured", true);
    }

    const { data, error } = await supabaseQuery;

    if (error) {
      console.error("Supabase error:", error);
      throw error;
    }

    const recipes = (data || []).map((r) => ({
      ...r,
      userId: r.user_id,
      prepTime: r.prep_time,
      cookTime: r.cook_time,
      createdAt: r.created_at,
      updatedAt: r.updated_at,
    }));

    return NextResponse.json(recipes);
  } catch (error) {
    console.error("Error in GET /api/recipes:", error);
    return NextResponse.json(
      { error: "Failed to fetch recipes" },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const supabase = await createClient();

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

    const { prepTime, cookTime, ...recipe } = await request.json();
    const { data, error } = await supabase
      .from("recipes")
      .insert([
        {
          ...recipe,
          user_id: user.id,
          prep_time: prepTime,
          cook_time: cookTime,
          featured: false, // User-created recipes are not featured by default
        },
      ])
      .select()
      .single();

    if (error) {
      console.error("Supabase error:", error);
      throw error;
    }

    const newRecipe = {
      ...data,
      userId: data.user_id,
      prepTime: data.prep_time,
      cookTime: data.cook_time,
      createdAt: data.created_at,
      updatedAt: data.updated_at,
    };

    return NextResponse.json(newRecipe, { status: 201 });
  } catch (error) {
    console.error("Error in POST /api/recipes:", error);
    return NextResponse.json(
      { error: "Failed to create recipe" },
      { status: 500 }
    );
  }
}
