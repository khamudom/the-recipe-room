import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/auth-helpers";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  try {
    const { slug } = await params;
    const supabase = await createClient();

    const { data, error } = await supabase
      .from("recipes")
      .select("*")
      .eq("slug", slug)
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
    console.error(
      `Error fetching recipe by slug ${(await params).slug}:`,
      error
    );
    return NextResponse.json(
      { error: "Failed to fetch recipe" },
      { status: 500 }
    );
  }
}
