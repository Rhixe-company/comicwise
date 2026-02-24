"use client";

/**
 * OPTIMIZED ADMIN USER MANAGEMENT COMPONENT
 * Full CRUD functionality with Zod validation and enhanced UX
 */

import { Loader2, Pencil, Plus, Trash2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { createUserSchema, updateUserSchema } from "@/lib/validations";

import type { CreateUserInput, UpdateUserInput } from "@/lib/validations";
import type { User } from "@/types/database";

// ═══════════════════════════════════════════════════
// TYPE DEFINITIONS
// ═══════════════════════════════════════════════════

interface AdminUsersProps {
  createUserAction(data: CreateUserInput): Promise<{ error?: string; success: boolean }>;
  deleteUserAction(id: string): Promise<{ error?: string; success: boolean }>;
  updateUserAction(
    id: string,
    data: UpdateUserInput
  ): Promise<{ error?: string; success: boolean }>;
  users: User[];
}

// ═══════════════════════════════════════════════════
// MAIN COMPONENT
// ═══════════════════════════════════════════════════

export function AdminUsers({
  users,
  createUserAction,
  updateUserAction,
  deleteUserAction,
}: AdminUsersProps) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  // Dialog states
  const [createOpen, setCreateOpen] = useState(false);
  const [editOpen, setEditOpen] = useState(false);
  const [deleteOpen, setDeleteOpen] = useState(false);

  // Form states
  const [selectedUser, setSelectedUser] = useState<null | User>(null);
  const [formData, setFormData] = useState<CreateUserInput>({
    name: "",
    email: "",
    password: "",
    role: "user",
  });
  const [errors, setErrors] = useState<Record<string, string>>({});

  // ═══════════════════════════════════════════════════
  // HANDLERS
  // ═══════════════════════════════════════════════════

  const handleCreate = () => {
    setFormData({ name: "", email: "", password: "", role: "user" });
    setErrors({});
    setCreateOpen(true);
  };

  const handleEdit = (user: User) => {
    setSelectedUser(user);
    setFormData({
      name: user.name || "",
      email: user.email,
      password: "", // Empty password means no change
      role: user.role || "user",
    });
    setErrors({});
    setEditOpen(true);
  };

  const handleDelete = (user: User) => {
    setSelectedUser(user);
    setDeleteOpen(true);
  };

  const handleSubmitCreate = async () => {
    startTransition(async () => {
      try {
        // Validate
        const validated = createUserSchema.parse(formData);

        // Create user
        const result = await createUserAction(validated);

        if (result.success) {
          toast.success("User created successfully");
          setCreateOpen(false);
          router.refresh();
        } else {
          toast.error(result.error || "Failed to create user");
        }
      } catch (error) {
        if (error instanceof Error) {
          toast.error(error.message);
        }
      }
    });
  };

  const handleSubmitEdit = async () => {
    if (!selectedUser) return;

    startTransition(async () => {
      try {
        // Validate
        const validated = updateUserSchema.parse(formData);

        // Update user
        const result = await updateUserAction(selectedUser.id, validated);

        if (result.success) {
          toast.success("User updated successfully");
          setEditOpen(false);
          router.refresh();
        } else {
          toast.error(result.error || "Failed to update user");
        }
      } catch (error) {
        if (error instanceof Error) {
          toast.error(error.message);
        }
      }
    });
  };

  const handleConfirmDelete = async () => {
    if (!selectedUser) return;

    startTransition(async () => {
      try {
        const result = await deleteUserAction(selectedUser.id);

        if (result.success) {
          toast.success("User deleted successfully");
          setDeleteOpen(false);
          router.refresh();
        } else {
          toast.error(result.error || "Failed to delete user");
        }
      } catch (error) {
        if (error instanceof Error) {
          toast.error(error.message);
        }
      }
    });
  };

  // ═══════════════════════════════════════════════════
  // RENDER
  // ═══════════════════════════════════════════════════

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">User Management</h2>
          <p className="text-muted-foreground text-sm">Manage system users and their permissions</p>
        </div>
        <Button onClick={handleCreate}>
          <Plus className="mr-2 size-4" />
          Create User
        </Button>
      </div>

      {/* Users Table */}
      <div className="rounded-md border">
        <table className="w-full">
          <thead>
            <tr className="bg-muted/50 border-b">
              <th className="p-4 text-left font-medium">Name</th>
              <th className="p-4 text-left font-medium">Email</th>
              <th className="p-4 text-left font-medium">Role</th>
              <th className="p-4 text-left font-medium">Verified</th>
              <th className="p-4 text-right font-medium">Actions</th>
            </tr>
          </thead>
          <tbody>
            {users.map((user) => (
              <tr className="border-b" key={user.id}>
                <td className="p-4">{user.name}</td>
                <td className="p-4">{user.email}</td>
                <td className="p-4">
                  <span className="bg-primary/10 rounded-full px-2 py-1 text-xs">{user.role}</span>
                </td>
                <td className="p-4">{user.emailVerified ? "✓" : "✗"}</td>
                <td className="p-4">
                  <div className="flex justify-end gap-2">
                    <Button onClick={() => handleEdit(user)} size="sm" variant="ghost">
                      <Pencil className="size-4" />
                    </Button>
                    <Button onClick={() => handleDelete(user)} size="sm" variant="ghost">
                      <Trash2 className="text-destructive size-4" />
                    </Button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Create Dialog */}
      <Dialog onOpenChange={setCreateOpen} open={createOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Create User</DialogTitle>
            <DialogDescription>Add a new user to the system</DialogDescription>
          </DialogHeader>

          <div className="space-y-4">
            <div>
              <Label htmlFor="name">Name</Label>
              <Input
                disabled={isPending}
                id="name"
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                value={formData.name}
              />
            </div>

            <div>
              <Label htmlFor="email">Email</Label>
              <Input
                disabled={isPending}
                id="email"
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                type="email"
                value={formData.email}
              />
            </div>

            <div>
              <Label htmlFor="password">Password</Label>
              <Input
                disabled={isPending}
                id="password"
                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                type="password"
                value={formData.password || ""}
              />
            </div>

            <div>
              <Label htmlFor="role">Role</Label>
              <Select
                disabled={isPending}
                onValueChange={(value: "admin" | "moderator" | "user") =>
                  setFormData({ ...formData, role: value })
                }
                value={formData.role}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="user">User</SelectItem>
                  <SelectItem value="moderator">Moderator</SelectItem>
                  <SelectItem value="admin">Admin</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <DialogFooter>
            <Button disabled={isPending} onClick={() => setCreateOpen(false)} variant="outline">
              Cancel
            </Button>
            <Button disabled={isPending} onClick={handleSubmitCreate}>
              {isPending && <Loader2 className="mr-2 size-4 animate-spin" />}
              Create
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Edit Dialog */}
      <Dialog onOpenChange={setEditOpen} open={editOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit User</DialogTitle>
            <DialogDescription>Update user information</DialogDescription>
          </DialogHeader>

          <div className="space-y-4">
            <div>
              <Label htmlFor="edit-name">Name</Label>
              <Input
                disabled={isPending}
                id="edit-name"
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                value={formData.name}
              />
            </div>

            <div>
              <Label htmlFor="edit-email">Email</Label>
              <Input
                disabled={isPending}
                id="edit-email"
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                type="email"
                value={formData.email}
              />
            </div>

            <div>
              <Label htmlFor="edit-role">Role</Label>
              <Select
                disabled={isPending}
                onValueChange={(value: "admin" | "moderator" | "user") =>
                  setFormData({ ...formData, role: value })
                }
                value={formData.role}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="user">User</SelectItem>
                  <SelectItem value="moderator">Moderator</SelectItem>
                  <SelectItem value="admin">Admin</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <DialogFooter>
            <Button disabled={isPending} onClick={() => setEditOpen(false)} variant="outline">
              Cancel
            </Button>
            <Button disabled={isPending} onClick={handleSubmitEdit}>
              {isPending && <Loader2 className="mr-2 size-4 animate-spin" />}
              Update
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <Dialog onOpenChange={setDeleteOpen} open={deleteOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete User</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete {selectedUser?.name}? This action cannot be undone.
            </DialogDescription>
          </DialogHeader>

          <DialogFooter>
            <Button disabled={isPending} onClick={() => setDeleteOpen(false)} variant="outline">
              Cancel
            </Button>
            <Button disabled={isPending} onClick={handleConfirmDelete} variant="destructive">
              {isPending && <Loader2 className="mr-2 size-4 animate-spin" />}
              Delete
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
