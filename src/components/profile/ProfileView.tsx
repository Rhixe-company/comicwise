"use client";

import { Calendar, Mail, Shield, User as UserIcon } from "lucide-react";
import Link from "next/link";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

import type { User } from "next-auth";

interface ProfileViewProps {
  user: User & { createdAt?: Date; role?: string };
}

export function ProfileView({ user }: ProfileViewProps) {
  const initials =
    user.name
      ?.split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase() || "U";

  return (
    <div className="container mx-auto max-w-4xl px-4 py-8">
      <div className="mb-8 flex items-center justify-between">
        <h1 className="text-3xl font-bold">My Profile</h1>
        <Link href="/profile/edit">
          <Button>Edit Profile</Button>
        </Link>
      </div>

      <div className="grid gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Profile Information</CardTitle>
            <CardDescription>Your account details</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col items-center space-y-6 sm:flex-row sm:items-start sm:space-y-0 sm:space-x-6">
              <Avatar className="size-32">
                <AvatarImage alt={user.name || "User"} src={user.image || undefined} />
                <AvatarFallback className="text-3xl">{initials}</AvatarFallback>
              </Avatar>

              <div className="flex-1 space-y-4">
                <div className="flex items-center gap-3">
                  <UserIcon className="text-muted-foreground size-5" />
                  <div>
                    <p className="text-muted-foreground text-sm">Name</p>
                    <p className="font-medium">{user.name || "Not set"}</p>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <Mail className="text-muted-foreground size-5" />
                  <div>
                    <p className="text-muted-foreground text-sm">Email</p>
                    <p className="font-medium">{user.email}</p>
                  </div>
                </div>

                {user.role && (
                  <div className="flex items-center gap-3">
                    <Shield className="text-muted-foreground size-5" />
                    <div>
                      <p className="text-muted-foreground text-sm">Role</p>
                      <p className="font-medium capitalize">{user.role}</p>
                    </div>
                  </div>
                )}

                {user.createdAt && (
                  <div className="flex items-center gap-3">
                    <Calendar className="text-muted-foreground size-5" />
                    <div>
                      <p className="text-muted-foreground text-sm">Member Since</p>
                      <p className="font-medium">
                        {new Date(user.createdAt).toLocaleDateString("en-US", {
                          year: "numeric",
                          month: "long",
                          day: "numeric",
                        })}
                      </p>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Quick Actions</CardTitle>
            <CardDescription>Manage your account settings</CardDescription>
          </CardHeader>
          <CardContent className="grid gap-4 sm:grid-cols-2">
            <Link href="/profile/edit">
              <Button className="w-full" variant="outline">
                Edit Profile
              </Button>
            </Link>
            <Link href="/profile/change-password">
              <Button className="w-full" variant="outline">
                Change Password
              </Button>
            </Link>
            <Link href="/bookmarks">
              <Button className="w-full" variant="outline">
                My Bookmarks
              </Button>
            </Link>
            <Link href="/profile/settings">
              <Button className="w-full" variant="outline">
                Settings
              </Button>
            </Link>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
