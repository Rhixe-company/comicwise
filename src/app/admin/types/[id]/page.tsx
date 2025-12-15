import { Suspense } from "react";
import EditTypeForm from "src/app/admin/types/[id]/EditTypeForm";

export default function Page({ params }: { params: { id: string } }) {
  return (
    <Suspense fallback={<div className="text-muted-foreground">Loading editor...</div>}>
      {/* Render the client-side edit form inside a suspense boundary */}
      <EditTypeForm params={params} />
    </Suspense>
  );
}
