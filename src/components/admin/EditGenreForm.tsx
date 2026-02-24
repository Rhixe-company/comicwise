/**
 * EditGenreForm Component
 * Edit form for genre entity
 */

"use client";

import { BaseForm } from "@/components/admin/BaseForm";
import { insertGenreSchema } from "@/lib/validations/genreSchema";

export interface EditGenreFormProps {
  id: number | string;
}

export function EditGenreForm({ id }: EditGenreFormProps) {
  return (
    <BaseForm
      defaultValues={{ name: "", description: undefined }}
      fields={[
        { name: "name", label: "Name", type: "text", placeholder: "Enter genre name" },
        {
          name: "description",
          label: "Description",
          type: "textarea",
          placeholder: "Enter genre description",
        },
      ]}
      onSubmit={async (data) => {
        // Add submission logic
        console.log("Submitting:", data);
      }}
      schema={insertGenreSchema}
    />
  );
}

export default EditGenreForm;
