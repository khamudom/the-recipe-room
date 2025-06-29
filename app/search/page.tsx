import { Suspense } from "react";
import { SearchResultsClient } from "./search-results-client";
import { LoadingSkeleton } from "@/components/loading-skeleton/loading-skeleton";

export default function SearchPage() {
  return (
    <Suspense fallback={<LoadingSkeleton count={6} />}>
      <SearchResultsClient />
    </Suspense>
  );
}
