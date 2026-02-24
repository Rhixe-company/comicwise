"use client";

import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";
import { toast } from "sonner";

import { updatePasswordActionOptimized } from "@/actions/authOptimized";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

interface ChangePasswordFormProps {
  userId: string;
}

export function ChangePasswordForm({ userId }: ChangePasswordFormProps) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [formData, setFormData] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (formData.newPassword !== formData.confirmPassword) {
      toast.error("Passwords do not match");
      return;
    }

    startTransition(async () => {
      const result = await updatePasswordActionOptimized(userId, {
        currentPassword: formData.currentPassword,
        newPassword: formData.newPassword,
        confirmPassword: formData.confirmPassword,
      });

      if (result.success) {
        toast.success(result.message || "Password updated successfully");
        setFormData({ currentPassword: "", newPassword: "", confirmPassword: "" });
        router.push("/profile");
      } else {
        toast.error(result.error || "Failed to update password");
      }
    });
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Change Password</CardTitle>
        <CardDescription>Update your account password</CardDescription>
      </CardHeader>
      <CardContent>
        <form className="space-y-6" onSubmit={handleSubmit}>
          <div className="space-y-2">
            <Label htmlFor="currentPassword">Current Password</Label>
            <Input
              disabled={isPending}
              id="currentPassword"
              minLength={8}
              onChange={(e) => setFormData({ ...formData, currentPassword: e.target.value })}
              required
              type="password"
              value={formData.currentPassword}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="newPassword">New Password</Label>
            <Input
              disabled={isPending}
              id="newPassword"
              minLength={8}
              onChange={(e) => setFormData({ ...formData, newPassword: e.target.value })}
              required
              type="password"
              value={formData.newPassword}
            />
            <p className="text-muted-foreground text-xs">
              Must contain at least one uppercase letter, one lowercase letter, and one number
            </p>
          </div>

          <div className="space-y-2">
            <Label htmlFor="confirmPassword">Confirm New Password</Label>
            <Input
              disabled={isPending}
              id="confirmPassword"
              minLength={8}
              onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
              required
              type="password"
              value={formData.confirmPassword}
            />
          </div>

          <div className="flex gap-4">
            <Button disabled={isPending} type="submit">
              {isPending ? "Updating..." : "Update Password"}
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
