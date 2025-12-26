/**
 * EditChapterForm Component
 * Edit form for chapter entity
 */

"use client";

import { BaseForm } from "@/components/admin/BaseForm";
import { chapterSchema } from "@/database/schema";

interface EditChapterFormProps {
  id: string | number;
}

export function EditChapterForm({ id }: EditChapterFormProps) {
  return (
    <BaseForm
      schema={chapterSchema}
      entityName="chapter"
      entityId={id}
      fields={[]} // Add fields configuration
      onSubmit={async (data) => {
        // Add submission logic
        console.log("Submitting:", data);
      }}
    />
  );
}

export default EditChapterForm;
