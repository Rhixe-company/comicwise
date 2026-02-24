"use client";

// ═══════════════════════════════════════════════════
// RESEND VERIFICATION PAGE (Next.js 16 + React 19)
// ═══════════════════════════════════════════════════

import { Mail } from "lucide-react";
import Link from "next/link";
import { useState, useTransition } from "react";
import { toast } from "sonner";

import { resendVerificationEmail } from "@/actions/auth";
import { AuthForm, EmailField } from "@/components/auth";
import { Button } from "@/components/ui/button";
import { Card, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { resendVerificationEmailSchema } from "@/lib/validations";

import type { ResendVerificationEmailInput } from "@/lib/validations";

export default function ResendVerificationPage() {
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState<null | string>(null);
  const [isSubmitted, setIsSubmitted] = useState(false);

  const onSubmit = async (data: ResendVerificationEmailInput) => {
    setError(null);

    startTransition(async () => {
      try {
        const result = await resendVerificationEmail(data);

        if (!result.success) {
          setError(result.error || "Failed to send verification email");
          toast.error(result.error || "Failed to send verification email");
        } else {
          setIsSubmitted(true);
          toast.success("Verification email sent!");
        }
      } catch (error_) {
        console.error("Resend verification error:", error_);
        setError("An unexpected error occurred. Please try again.");
        toast.error("Failed to send verification email");
      }
    });
  };

  if (isSubmitted) {
    return (
      <Card className="w-full max-w-md">
        <CardHeader className="space-y-1 text-center">
          <div
            className={`
              bg-primary/10 mx-auto mb-2 flex size-12 items-center justify-center
              rounded-full
            `}
          >
            <Mail className="text-primary size-6" />
          </div>
          <CardTitle className="text-2xl font-bold">Email Sent!</CardTitle>
          <CardDescription>
            We&apos;ve sent you a new verification link. Please check your email and click the link
            to verify your account.
          </CardDescription>
        </CardHeader>
        <CardFooter className="flex-col space-y-2">
          <Link className="w-full" href="/sign-in">
            <Button className="w-full">Back to Sign In</Button>
          </Link>
          <p className="text-muted-foreground text-center text-sm">
            Still didn&apos;t receive it?{" "}
            <button
              className={`
                text-primary
                hover:underline
              `}
              onClick={() => setIsSubmitted(false)}
            >
              Try again
            </button>
          </p>
        </CardFooter>
      </Card>
    );
  }

  return (
    <AuthForm
      defaultValues={{ email: "" }}
      description="Enter your email address and we'll send you a new verification link"
      error={error}
      footer={
        <p className="text-muted-foreground text-center text-sm">
          Already verified?{" "}
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
      schema={resendVerificationEmailSchema}
      submitLabel="Send Verification Email"
      title="Resend Verification Email"
    >
      <EmailField disabled={isPending} />
    </AuthForm>
  );
}
