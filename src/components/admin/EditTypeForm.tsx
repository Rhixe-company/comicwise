/**
 * EditTypeForm Component
 * Edit form for type entity
 */

"use client";

import { BaseForm } from "@/components/admin/BaseForm";
import { insertTypeSchema } from "@/schemas/typeSchema";

export interface EditTypeFormProps {
  id: number | string;
}

export function EditTypeForm({ id }: EditTypeFormProps) {
  return (
    <BaseForm
      defaultValues={{ name: "", description: undefined }}
      fields={[
        { name: "name", label: "Name", type: "text", placeholder: "Enter type name" },
        {
          name: "description",
          label: "Description",
          type: "textarea",
          placeholder: "Enter type description",
        },
      ]}
      onSubmit={async (data) => {
        // Add submission logic
        console.log("Submitting:", data);
      }}
      schema={insertTypeSchema}
    />
  );
}

export default EditTypeForm;
