/**
 * EditArtistForm Component
 * Edit form for artist entity
 */

"use client";

import { BaseForm } from "@/components/admin/BaseForm";
import { insertArtistSchema } from "@/schemas/artistSchema";

export interface EditArtistFormProps {
  id: number | string;
}

export function EditArtistForm({ id }: EditArtistFormProps) {
  return (
    <BaseForm
      defaultValues={{ name: "", bio: undefined, image: undefined }}
      fields={[
        { name: "name", label: "Name", type: "text", placeholder: "Enter artist name" },
        { name: "bio", label: "Bio", type: "textarea", placeholder: "Enter artist bio" },
        { name: "image", label: "Image URL", type: "text", placeholder: "Enter image URL" },
      ]}
      onSubmit={async (data) => {
        // Add submission logic
        console.log("Submitting:", data);
      }}
      schema={insertArtistSchema}
    />
  );
}

export default EditArtistForm;
