/**
 * EditUserForm Component
 * Edit form for user entity
 */

"use client";

import { BaseForm } from "@/components/admin/BaseForm";
import { userSchema } from "@/database/schema";

interface EditUserFormProps {
  id: string | number;
}

export function EditUserForm({ id }: EditUserFormProps) {
  return (
    <BaseForm
      schema={userSchema}
      entityName="user"
      entityId={id}
      fields={[]} // Add fields configuration
      onSubmit={async (data) => {
        // Add submission logic
        console.log("Submitting:", data);
      }}
    />
  );
}

export default EditUserForm;
