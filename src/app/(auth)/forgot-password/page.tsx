"use client";

// ═══════════════════════════════════════════════════
// FORGOT PASSWORD PAGE (Next.js 16 + React 19)
// ═══════════════════════════════════════════════════

import { CheckCircle2 } from "lucide-react";
import Link from "next/link";
import { useState, useTransition } from "react";
import { toast } from "sonner";

import { AuthForm, EmailField } from "@/components/auth";
import { Button } from "@/components/ui/button";
import { Card, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { forgotPassword } from "@/lib/actions/auth";
import { forgotPasswordSchema } from "@/lib/validations";

import type { ForgotPasswordInput } from "@/lib/validations";

export default function ForgotPasswordPage() {
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState<null | string>(null);
  const [isSubmitted, setIsSubmitted] = useState(false);

  const onSubmit = async (data: ForgotPasswordInput) => {
    setError(null);

    startTransition(async () => {
      try {
        const result = await forgotPassword(data);

        if (!result.success) {
          setError(result.error || "Failed to send reset link");
          toast.error(result.error || "Failed to send reset link");
        } else {
          setIsSubmitted(true);
          toast.success("Password reset link sent!");
        }
      } catch (error_) {
        console.error("Forgot password error:", error_);
        setError("An unexpected error occurred. Please try again.");
        toast.error("Failed to send reset link");
      }
    });
  };

  if (isSubmitted) {
    return (
      <Card className="w-full max-w-md">
        <CardHeader className="space-y-1 text-center">
          <div
            className={`
              mx-auto mb-2 flex size-12 items-center justify-center rounded-full
              bg-green-100
            `}
          >
            <CheckCircle2 className="size-6 text-green-600" />
          </div>
          <CardTitle className="text-2xl font-bold">Check your email</CardTitle>
          <CardDescription>
            We&apos;ve sent you a password reset link. Please check your email and follow the
            instructions.
          </CardDescription>
        </CardHeader>
        <CardFooter className="flex-col space-y-2">
          <Link className="w-full" href="/sign-in">
            <Button className="w-full">Back to Sign In</Button>
          </Link>
          <Button className="w-full" onClick={() => setIsSubmitted(false)} variant="ghost">
            Send another link
          </Button>
        </CardFooter>
      </Card>
    );
  }

  return (
    <AuthForm
      defaultValues={{ email: "" }}
      description="Enter your email address and we'll send you a link to reset your password"
      error={error}
      footer={
        <p className="text-muted-foreground text-center text-sm">
          Remember your password?{" "}
          <Link
            className={`
              text-primary
              hover:underline
            `}
            href="/sign-in"
          >
            Sign in
          </Link>
        </p>
      }
      isLoading={isPending}
      onSubmit={onSubmit}
      schema={forgotPasswordSchema}
      submitLabel="Send Reset Link"
      title="Forgot Password"
    >
      <EmailField disabled={isPending} />
    </AuthForm>
  );
}
