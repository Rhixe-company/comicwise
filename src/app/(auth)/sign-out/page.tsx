"use client";

import { Card, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Loader2 } from "lucide-react";
import { signOut } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function SignOutPage() {
  const router = useRouter();

  useEffect(() => {
    const handleSignOut = async () => {
      try {
        await signOut({ callbackUrl: "/sign-in", redirect: true });
      } catch (error) {
        console.error("Sign out error:", error);
        router.push("/sign-in");
      }
    };

    handleSignOut();
  }, [router]);

  return (
    <Card>
      <CardHeader className="text-center">
        <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
        <CardTitle>Signing Out</CardTitle>
        <CardDescription>Please wait while we sign you out...</CardDescription>
      </CardHeader>
    </Card>
  );
}
