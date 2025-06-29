import { Suspense } from "react";
import { SearchResultsClient } from "./search-results-client";
import { LoadingSkeleton } from "@/components/loading-skeleton/loading-skeleton";

interface SearchPageProps {
  searchParams: Promise<{ q?: string }>;
}

export default async function SearchPage({ searchParams }: SearchPageProps) {
  const params = await searchParams;
  const query = params.q || "";

  return (
    <Suspense fallback={<LoadingSkeleton count={6} />}>
      <SearchResultsClient initialQuery={query} />
    </Suspense>
  );
}
