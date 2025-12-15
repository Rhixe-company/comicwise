"use client";

import { Card, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Loader2 } from "lucide-react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function NewUserPage() {
  const router = useRouter();
  const { data: session, status } = useSession();

  useEffect(() => {
    if (status === "loading") return;

    if (status === "unauthenticated") {
      router.push("/register");
      return;
    }

    if (session?.user) {
      // Redirect new users to onboarding or home
      router.push("/");
    }
  }, [session, status, router]);

  return (
    <Card>
      <CardHeader className="text-center">
        <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
        <CardTitle>Setting Up Your Account</CardTitle>
        <CardDescription>Please wait while we set up your account...</CardDescription>
      </CardHeader>
    </Card>
  );
}
