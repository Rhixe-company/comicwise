import { Suspense } from "react";
import EditUserForm from "src/app/admin/users/[id]/EditUserForm";

export default function Page({ params }: { params: { id: string } }) {
  return (
    <Suspense fallback={<div className="text-muted-foreground">Loading editor...</div>}>
      {/* Render the client-side edit form inside a suspense boundary */}
      <EditUserForm params={params} />
    </Suspense>
  );
}
