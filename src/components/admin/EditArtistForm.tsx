/**
 * EditArtistForm Component
 * Edit form for artist entity
 */

"use client";

import { BaseForm } from "@/components/admin/BaseForm";
import { artistSchema } from "@/database/schema";

interface EditArtistFormProps {
  id: string | number;
}

export function EditArtistForm({ id }: EditArtistFormProps) {
  return (
    <BaseForm
      schema={artistSchema}
      entityName="artist"
      entityId={id}
      fields={[]} // Add fields configuration
      onSubmit={async (data) => {
        // Add submission logic
        console.log("Submitting:", data);
      }}
    />
  );
}

export default EditArtistForm;
