/**
 * EditTypeForm Component
 * Edit form for type entity
 */

"use client";

import { BaseForm } from "@/components/admin/BaseForm";
import { typeSchema } from "@/database/schema";

interface EditTypeFormProps {
  id: string | number;
}

export function EditTypeForm({ id }: EditTypeFormProps) {
  return (
    <BaseForm
      schema={typeSchema}
      entityName="type"
      entityId={id}
      fields={[]} // Add fields configuration
      onSubmit={async (data) => {
        // Add submission logic
        console.log("Submitting:", data);
      }}
    />
  );
}

export default EditTypeForm;
