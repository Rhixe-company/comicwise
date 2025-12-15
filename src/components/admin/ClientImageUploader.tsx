"use client";

import { ImageUpload } from "@/components/admin/ImageUpload";
import React from "react";

type ClientImageUploaderProps = React.ComponentProps<typeof ImageUpload> & {
  targetInputId?: string;
};

export default function ClientImageUploader(props: ClientImageUploaderProps) {
  // `targetInputId` is kept for backward compatibility with older admin forms,
  // but the current `ImageUpload` handles file selection itself via ref.
  const { targetInputId: _targetInputId, ...rest } = props;
  return <ImageUpload {...(rest as React.ComponentProps<typeof ImageUpload>)} />;
}
