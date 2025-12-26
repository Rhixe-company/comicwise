/**
 * EditGenreForm Component
 * Edit form for genre entity
 */

"use client";

import { BaseForm } from "@/components/admin/BaseForm";
import { genreSchema } from "@/database/schema";

interface EditGenreFormProps {
  id: string | number;
}

export function EditGenreForm({ id }: EditGenreFormProps) {
  return (
    <BaseForm
      schema={genreSchema}
      entityName="genre"
      entityId={id}
      fields={[]} // Add fields configuration
      onSubmit={async (data) => {
        // Add submission logic
        console.log("Submitting:", data);
      }}
    />
  );
}

export default EditGenreForm;
