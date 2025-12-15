import ComicForm from "@/app/admin/comics/comic-form";
import { auth } from "auth";
import { redirect } from "next/navigation";
import { Suspense } from "react";

import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Create Comic | Admin",
  description: "Add a new comic to the platform",
};

async function ProtectedComicForm() {
  const session = await auth();

  if (session?.user?.role !== "admin") {
    redirect("/");
  }

  return <ComicForm />;
}

export default function NewComicPage() {
  return (
    <div className="container max-w-4xl space-y-6 py-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Create New Comic</h1>
        <p className="text-muted-foreground">Add a new comic to the platform</p>
      </div>

      <Suspense fallback={<div>Checking permissions...</div>}>
        <ProtectedComicForm />
      </Suspense>
    </div>
  );
}
