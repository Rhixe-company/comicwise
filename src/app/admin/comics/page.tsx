import { DataTable } from "@/components/admin/DataTable";
import { Button } from "@/components/ui/button";
import { artist, author, comic, database, type } from "@/database";
import { eq } from "drizzle-orm";
import { Plus } from "lucide-react";
import Link from "next/link";
import { Suspense } from "react";

async function ComicsTable() {
  const comics = await database
    .select({
      id: comic.id,
      title: comic.title,
      description: comic.description,
      coverImage: comic.coverImage,
      status: comic.status,
      rating: comic.rating,
      views: comic.views,
      authorName: author.name,
      artistName: artist.name,
      typeName: type.name,
      createdAt: comic.createdAt,
    })
    .from(comic)
    .leftJoin(author, eq(comic.authorId, author.id))
    .leftJoin(artist, eq(comic.artistId, artist.id))
    .leftJoin(type, eq(comic.typeId, type.id));

  const columns = [
    {
      accessorKey: "id",
      header: "ID",
    },
    {
      accessorKey: "title",
      header: "Title",
    },
    {
      accessorKey: "authorName",
      header: "Author",
    },
    {
      accessorKey: "typeName",
      header: "Type",
    },
    {
      accessorKey: "status",
      header: "Status",
    },
    {
      accessorKey: "rating",
      header: "Rating",
    },
    {
      accessorKey: "views",
      header: "Views",
    },
  ];

  return <DataTable columns={columns} data={comics} />;
}

function ComicsHeader() {
  return (
    <div className="flex items-center justify-between">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Comics Management</h1>
        <p className="text-muted-foreground">Manage all comics in the platform</p>
      </div>
      <Link href="/admin/comics/new">
        <Button>
          <Plus className="mr-2 h-4 w-4" />
          Add Comic
        </Button>
      </Link>
    </div>
  );
}

export default function AdminComicsPage() {
  return (
    <div className="space-y-6">
      <ComicsHeader />

      <Suspense fallback={<div>Loading comics...</div>}>
        <ComicsTable />
      </Suspense>
    </div>
  );
}
