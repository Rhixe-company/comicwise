import { Suspense } from "react";
import EditChapterForm from "src/app/admin/chapters/[id]/EditChapterForm";

export default function EditChapterPage({ params }: { params: { id: string } }) {
  return (
    <div className="mx-auto max-w-2xl space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Edit Chapter</h1>
        <p className="text-muted-foreground">Update the chapter information</p>
      </div>

      <Suspense fallback={<div className="text-muted-foreground">Loading chapter editor...</div>}>
        <EditChapterForm params={params} />
      </Suspense>
    </div>
  );
}
