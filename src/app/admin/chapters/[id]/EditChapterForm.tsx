import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { deleteChapter, updateChapter } from "@/dto/chaptersDto";

export default async function EditChapterForm({ params }: { params: { id: string } }) {
  const id = Number(params.id);

  // Fetch chapter and comics on the server
  const [chapterRes, comicsRes] = await Promise.all([
    fetch(`${process.env["NEXT_PUBLIC_APP_URL"] ?? ""}/api/chapters/${id}`, { cache: "no-store" }),
    fetch(`${process.env["NEXT_PUBLIC_APP_URL"] ?? ""}/api/comics?limit=1000`, {
      cache: "no-store",
    }),
  ]);

  if (!chapterRes.ok || !comicsRes.ok) {
    redirect("/admin/chapters");
  }

  const chapter = await chapterRes.json();
  const comicsData = await comicsRes.json();
  const comics = comicsData.comics || [];

  async function handleUpdate(formData: FormData) {
    const payload = {
      comicId: Number(formData.get("comicId")),
      chapterNumber: Number(formData.get("chapterNumber")),
      title: String(formData.get("title") ?? "").trim(),
      content: formData.get("content") ? String(formData.get("content")) : undefined,
      releaseDate: formData.get("releaseDate")
        ? new Date(String(formData.get("releaseDate")))
        : undefined,
    };

    const result = await updateChapter(id, payload);
    if (result.success) {
      revalidatePath("/admin/chapters");
      revalidatePath(`/comics/${payload.comicId}`);
      redirect("/admin/chapters");
    }

    throw new Error(result.error || "Failed to update chapter");
  }

  async function handleDelete() {
    const result = await deleteChapter(id);
    if (result.success) {
      revalidatePath("/admin/chapters");
      redirect("/admin/chapters");
    }
    throw new Error(result.error || "Failed to delete chapter");
  }

  return (
    <div className="mx-auto max-w-2xl space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Chapter Information</CardTitle>
          <CardDescription>Modify the details for this chapter</CardDescription>
        </CardHeader>
        <CardContent>
          <form action={handleUpdate} className="space-y-6" method="post">
            <div>
              <label className="sr-only" htmlFor="comicId">
                Comic
              </label>
              <select
                className="w-full rounded-sm border px-3 py-2"
                defaultValue={String(chapter.comicId)}
                id="comicId"
                name="comicId"
              >
                <option value="">Select a comic</option>
                {comics.map((c: { id: number; title: string }) => (
                  <option key={c.id} value={String(c.id)}>
                    {c.title}
                  </option>
                ))}
              </select>
            </div>

            <div
              className={`
                grid gap-6
                md:grid-cols-2
              `}
            >
              <div>
                <label className="sr-only" htmlFor="chapterNumber">
                  Chapter Number
                </label>
                <Input
                  defaultValue={String(chapter.chapterNumber)}
                  id="chapterNumber"
                  min="0"
                  name="chapterNumber"
                  step="0.1"
                  type="number"
                />
              </div>

              <div>
                <label className="sr-only" htmlFor="releaseDate">
                  Release Date
                </label>
                <Input
                  defaultValue={
                    chapter.releaseDate
                      ? new Date(chapter.releaseDate).toISOString().split("T")[0]
                      : ""
                  }
                  id="releaseDate"
                  name="releaseDate"
                  type="date"
                />
              </div>
            </div>

            <div>
              <label className="sr-only" htmlFor="title">
                Title
              </label>
              <Input
                defaultValue={chapter.title ?? ""}
                id="title"
                name="title"
                placeholder="Chapter title"
              />
            </div>

            <div>
              <label className="sr-only" htmlFor="content">
                Content
              </label>
              <Textarea
                defaultValue={chapter.content ?? ""}
                id="content"
                name="content"
                placeholder="Chapter summary or description..."
                rows={4}
              />
            </div>

            <div className="flex justify-between">
              <form action={async () => handleDelete()} method="post">
                <Button type="submit" variant="destructive">
                  Delete Chapter
                </Button>
              </form>
              <div className="flex gap-4">
                <Button onClick={() => window.history.back()} type="button" variant="outline">
                  Cancel
                </Button>
                <Button type="submit">Save Changes</Button>
              </div>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
