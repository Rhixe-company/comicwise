"use client";

import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { updateProfileActionOptimized } from "@/lib/actions/authOptimized";

import type { User } from "next-auth";

interface ProfileEditFormProps {
  user: User;
}

export function ProfileEditForm({ user }: ProfileEditFormProps) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [formData, setFormData] = useState({
    name: user.name || "",
    image: user.image || "",
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    startTransition(async () => {
      const result = await updateProfileActionOptimized(user.id!, formData);

      if (result.success) {
        toast.success(result.message || "Profile updated successfully");
        router.push("/profile");
        router.refresh();
      } else {
        toast.error(result.error || "Failed to update profile");
      }
    });
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Edit Profile</CardTitle>
        <CardDescription>Update your profile information</CardDescription>
      </CardHeader>
      <CardContent>
        <form className="space-y-6" onSubmit={handleSubmit}>
          <div className="space-y-2">
            <Label htmlFor="name">Name</Label>
            <Input
              disabled={isPending}
              id="name"
              maxLength={50}
              minLength={2}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              required
              type="text"
              value={formData.name}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="image">Profile Image URL</Label>
            <Input
              disabled={isPending}
              id="image"
              onChange={(e) => setFormData({ ...formData, image: e.target.value })}
              placeholder="https://example.com/avatar.jpg"
              type="url"
              value={formData.image}
            />
          </div>

          <div className="flex gap-4">
            <Button disabled={isPending} type="submit">
              {isPending ? "Saving..." : "Save Changes"}
            </Button>
            <Button
              disabled={isPending}
              onClick={() => router.push("/profile")}
              type="button"
              variant="outline"
            >
              Cancel
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}
