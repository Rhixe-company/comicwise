import { auth } from "auth";
import { ComicForm } from "components/admin/ComicForm";
import { useConfirmDialog } from "components/admin/ConfirmDialog";
import { getComicById } from "database/queries/adminComics";
import { Trash2 } from "lucide-react";
import { notFound, redirect } from "next/navigation";
import { Suspense } from "react";
import { Button } from "ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "ui/card";
import { deleteComicAction, updateComicAction } from "/app/actions/admin/comics";

import type { Metadata } from "next";

interface ComicDetailPageProps {
  params: Promise<{ id: string }>;
}

export async function generateMetadata({ params }: ComicDetailPageProps): Promise<Metadata> {
  const { id } = await params;
  const comic = await getComicById(parseInt(id));

  if (!comic) {
    return { title: "Comic Not Found" };
  }

  return {
    title: `Edit ${comic.title} | Admin`,
    description: `Edit comic details for ${comic.title}`,
  };
}

async function ComicEditForm({ id }: { id: number }) {
  const session = await auth();

  if (session?.user?.role !== "admin") {
    redirect("/");
  }

  const comic = await getComicById(id);

  if (!comic) {
    notFound();
  }

  return (
    <div className="space-y-6">
      <ComicForm
        initialData={{
          title: comic.title,
          description: comic.description,
          slug: comic.slug,
          coverImage: comic.coverImage,
          status: comic.status,
          publicationDate: comic.publicationDate,
          authorId: comic.authorId?.toString(),
          artistId: comic.artistId?.toString(),
          typeId: comic.typeId?.toString(),
        }}
        onSubmit={async (data) => {
          "use server";
          return updateComicAction(id, data);
        }}
        submitLabel="Update Comic"
      />

      {/* Delete Section */}
      <Card className="border-destructive/50">
        <CardHeader>
          <CardTitle className="text-destructive">Danger Zone</CardTitle>
          <CardDescription>Irreversible actions</CardDescription>
        </CardHeader>
        <CardContent>
          <DeleteComicButton comicId={id} />
        </CardContent>
      </Card>
    </div>
  );
}

function DeleteComicButton({ comicId }: { comicId: number }) {
  // ts-ignore - useConfirmDialog hook
  const { confirm, ConfirmDialog } = useConfirmDialog();

  return (
    <>
      <ConfirmDialog />
      <Button
        variant="destructive"
        onClick={() =>
          confirm({
            title: "Delete Comic",
            description:
              "Are you sure you want to delete this comic? This will also delete all associated chapters and cannot be undone.",
            confirmText: "Delete",
            cancelText: "Cancel",
            variant: "destructive",
            onConfirm: async () => {
              const result = await deleteComicAction(comicId);
              if (result.success) {
                redirect("/admin/comics");
              }
            },
          })
        }
      >
        <Trash2 className="mr-2 h-4 w-4" />
        Delete Comic
      </Button>
    </>
  );
}

export default async function ComicDetailPage({ params }: ComicDetailPageProps) {
  const { id } = await params;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Edit Comic</h1>
        <p className="text-muted-foreground">Update comic information</p>
      </div>

      <Suspense fallback={<div>Loading comic...</div>}>
        <ComicEditForm id={parseInt(id)} />
      </Suspense>
    </div>
  );
}
