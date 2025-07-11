import { NextRequest, NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";

export async function GET(request: NextRequest) {
  try {
    // Get category counts using a more efficient query
    const { data, error } = await supabase
      .from("recipes")
      .select("category")
      .order("category");

    if (error) {
      console.error("Error fetching category counts:", error);
      return NextResponse.json(
        { error: "Failed to fetch category counts" },
        { status: 500 }
      );
    }

    // Count recipes per category
    const categoryCounts = data.reduce((acc, recipe) => {
      acc[recipe.category] = (acc[recipe.category] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    return NextResponse.json(categoryCounts);
  } catch (error) {
    console.error("Unexpected error in category counts API:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
