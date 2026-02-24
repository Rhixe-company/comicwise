import { Suspense } from "react";

import { ComicsListContent } from "@/components/admin/ComicsListContent";
import { getComicsWithPagination, searchComics } from "@/database/queries/adminComics";

interface ComicsPageProps {
  searchParams: Promise<{ cursor?: string; q?: string; }>;
}

async function ComicsListPageContent({ q, cursor }: { cursor?: string; q?: string; }) {
  let data;

  if (q) {
    const searchResults = await searchComics(q);
    data = {
      data: searchResults,
      hasNextPage: false,
      nextCursor: null,
    };
  } else {
    data = await getComicsWithPagination();
  }

  return (
    <ComicsListContent
      hasNextPage={data.hasNextPage}
      initialComics={data.data as any}
      nextCursor={data.nextCursor}
    />
  );
}

export default async function ComicsPage({ searchParams }: ComicsPageProps) {
  const params = await searchParams;
  return (
    <Suspense fallback={<div>Loading comics...</div>}>
      <ComicsListPageContent cursor={params.cursor} q={params.q} />
    </Suspense>
  );
}
