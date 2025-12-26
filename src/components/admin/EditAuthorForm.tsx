/**
 * EditAuthorForm Component
 * Edit form for author entity
 */

"use client";

import { BaseForm } from "@/components/admin/BaseForm";
import { authorSchema } from "@/database/schema";

interface EditAuthorFormProps {
  id: string | number;
}

export function EditAuthorForm({ id }: EditAuthorFormProps) {
  return (
    <BaseForm
      schema={authorSchema}
      entityName="author"
      entityId={id}
      fields={[]} // Add fields configuration
      onSubmit={async (data) => {
        // Add submission logic
        console.log("Submitting:", data);
      }}
    />
  );
}

export default EditAuthorForm;
