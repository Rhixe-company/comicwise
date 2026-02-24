"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useImageUpload } from "@/hooks/useImageUpload";

const artistSchema = z
  .object({
    name: z.string().min(1, "Name is required").max(200),
    bio: z.string().optional(),
    profileImage: z.string().url("Must be a valid URL").optional().or(z.literal("")),
  })
  .strict();

type ArtistFormValues = z.infer<typeof artistSchema>;

export default function NewArtistPage() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const { fileInputRef, isUploading, handleFileSelect } = useImageUpload({
    uploadType: "avatar",
    onChange: (url: string) => {
      form.setValue("profileImage", url);
    },
    onUploadComplete: () => {
      toast.success("Image uploaded successfully");
    },
  });

  const form = useForm<ArtistFormValues>({
    resolver: zodResolver(artistSchema),
    defaultValues: {
      name: "",
      bio: "",
      profileImage: "",
    },
  });

  const profileImage = form.watch("profileImage");

  // image upload handled by useImageUpload hook above

  async function onSubmit(data: ArtistFormValues) {
    setIsLoading(true);

    try {
      const response = await fetch("/api/artists", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || "Failed to create artist");
      }

      toast.success("Artist created successfully");
      router.push("/admin/artists");
      router.refresh();
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Failed to create artist");
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <div className="mx-auto max-w-2xl space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Create Artist</h1>
        <p className="text-muted-foreground">Add a new artist to the system</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Artist Information</CardTitle>
          <CardDescription>Enter the details for the new artist</CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form className="space-y-6" onSubmit={form.handleSubmit(onSubmit)}>
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Name *</FormLabel>
                    <FormControl>
                      <Input placeholder="Artist's full name" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="bio"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Biography</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="Brief biography of the artist..."
                        rows={5}
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="profileImage"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Profile Image</FormLabel>
                    <FormControl>
                      <div className="space-y-4">
                        <Input placeholder="https://example.com/image.jpg" type="url" {...field} />
                        <div className="flex items-center gap-4">
                          <span className="text-muted-foreground text-sm">or</span>
                          <Button
                            disabled={isUploading}
                            onClick={() => fileInputRef.current?.click()}
                            type="button"
                            variant="outline"
                          >
                            {isUploading ? "Uploading..." : "Upload Image"}
                          </Button>
                          <label className="sr-only" htmlFor="profile-upload">
                            Upload artist profile image
                          </label>
                          <input
                            accept="image/*"
                            aria-label="Upload artist profile image"
                            className="sr-only"
                            id="profile-upload"
                            onChange={handleFileSelect}
                            ref={fileInputRef}
                            title="Upload artist profile image"
                            type="file"
                          />
                        </div>
                        {profileImage && (
                          <div
                            className={`
                              relative size-32 overflow-hidden rounded-lg border
                            `}
                          >
                            <Image
                              alt="Profile preview"
                              className="object-cover"
                              fill
                              src={profileImage}
                            />
                          </div>
                        )}
                      </div>
                    </FormControl>
                    <FormDescription>
                      Upload or provide URL for artist&apos;s profile image
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="flex justify-end gap-4">
                <Button
                  disabled={isLoading}
                  onClick={() => router.back()}
                  type="button"
                  variant="outline"
                >
                  Cancel
                </Button>
                <Button disabled={isLoading || isUploading} type="submit">
                  {isLoading ? "Creating..." : "Create Artist"}
                </Button>
              </div>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  );
}
