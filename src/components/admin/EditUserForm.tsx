/**
 * EditUserForm Component
 * Edit form for user entity
 */

"use client";

import { BaseForm } from "@/components/admin/BaseForm";
import { insertUserSchema } from "@/schemas/userSchema";

export interface EditUserFormProps {
  id: number | string;
}

export function EditUserForm({ id }: EditUserFormProps) {
  return (
    <BaseForm
      defaultValues={{ name: null, email: "", role: "user", image: null }}
      fields={[
        { name: "name", label: "Name", type: "text", placeholder: "Enter user name" },
        { name: "email", label: "Email", type: "email", placeholder: "Enter email address" },
        { name: "password", label: "Password", type: "password", placeholder: "Enter password" },
        {
          name: "role",
          label: "Role",
          type: "select",
          options: [
            { label: "User", value: "user" },
            { label: "Admin", value: "admin" },
            { label: "Moderator", value: "moderator" },
          ],
        },
        { name: "image", label: "Image URL", type: "text", placeholder: "Enter image URL" },
      ]}
      onSubmit={async (data) => {
        // Add submission logic
        console.log("Submitting:", data);
      }}
      schema={insertUserSchema}
    />
  );
}

export default EditUserForm;
