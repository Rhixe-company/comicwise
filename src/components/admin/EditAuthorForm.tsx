/**
 * EditAuthorForm Component
 * Edit form for author entity
 */

"use client";

import { BaseForm } from "@/components/admin/BaseForm";
import { insertAuthorSchema } from "@/lib/validations/authorSchema";

export interface EditAuthorFormProps {
  id: number | string;
}

export function EditAuthorForm({ id }: EditAuthorFormProps) {
  return (
    <BaseForm
      defaultValues={{ name: "", bio: undefined, image: undefined }}
      fields={[
        { name: "name", label: "Name", type: "text", placeholder: "Enter author name" },
        { name: "bio", label: "Bio", type: "textarea", placeholder: "Enter author bio" },
        { name: "image", label: "Image URL", type: "text", placeholder: "Enter image URL" },
      ]}
      onSubmit={async (data) => {
        // Add submission logic
        console.log("Submitting:", data);
      }}
      schema={insertAuthorSchema}
    />
  );
}

export default EditAuthorForm;
