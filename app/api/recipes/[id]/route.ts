import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/auth-helpers";

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const supabase = await createClient();
    const { data, error } = await supabase
      .from("recipes")
      .select("*")
      .eq("id", params.id)
      .single();

    if (error) {
      // It's not an error if no rows are found, it's an empty result
      if (error.code === "PGRST116") {
        return NextResponse.json(
          { error: "Recipe not found" },
          { status: 404 }
        );
      }
      throw error;
    }

    if (!data) {
      return NextResponse.json({ error: "Recipe not found" }, { status: 404 });
    }

    const recipe = {
      ...data,
      userId: data.user_id,
      prepTime: data.prep_time,
      cookTime: data.cook_time,
      createdAt: data.created_at,
      updatedAt: data.updated_at,
    };

    return NextResponse.json(recipe);
  } catch (error) {
    console.error(`Error fetching recipe ${params.id}:`, error);
    return NextResponse.json(
      { error: "Failed to fetch recipe" },
      { status: 500 }
    );
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
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

    // Check if recipe exists and belongs to user
    const { data: existingRecipe, error: fetchError } = await supabase
      .from("recipes")
      .select("user_id")
      .eq("id", params.id)
      .single();

    if (fetchError || !existingRecipe) {
      return NextResponse.json({ error: "Recipe not found" }, { status: 404 });
    }

    if (existingRecipe.user_id !== user.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
    }

    const { prepTime, cookTime, ...updates } = await request.json();
    const dbUpdates: { [key: string]: any } = { ...updates };
    if (prepTime !== undefined) dbUpdates.prep_time = prepTime;
    if (cookTime !== undefined) dbUpdates.cook_time = cookTime;

    const { data, error } = await supabase
      .from("recipes")
      .update(dbUpdates)
      .eq("id", params.id)
      .select()
      .single();

    if (error) {
      console.error("Supabase error:", error);
      throw error;
    }

    const updatedRecipe = {
      ...data,
      userId: data.user_id,
      prepTime: data.prep_time,
      cookTime: data.cook_time,
      createdAt: data.created_at,
      updatedAt: data.updated_at,
    };

    return NextResponse.json(updatedRecipe);
  } catch (error) {
    console.error(`Error updating recipe ${params.id}:`, error);
    return NextResponse.json(
      { error: "Failed to update recipe" },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
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

    // Check if recipe exists and belongs to user
    const { data: existingRecipe, error: fetchError } = await supabase
      .from("recipes")
      .select("user_id")
      .eq("id", params.id)
      .single();

    if (fetchError || !existingRecipe) {
      return NextResponse.json({ error: "Recipe not found" }, { status: 404 });
    }

    if (existingRecipe.user_id !== user.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
    }

    const { error } = await supabase
      .from("recipes")
      .delete()
      .eq("id", params.id);

    if (error) {
      console.error("Supabase error:", error);
      throw error;
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error(`Error deleting recipe ${params.id}:`, error);
    return NextResponse.json(
      { error: "Failed to delete recipe" },
      { status: 500 }
    );
  }
}
