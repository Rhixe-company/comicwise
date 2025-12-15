"use client";

// ═══════════════════════════════════════════════════
// RESEND VERIFICATION PAGE (Next.js 16 + React 19)
// ═══════════════════════════════════════════════════

import { Alert, AlertDescription } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { resendVerificationEmailAction } from "@/lib/actions/auth/index";
import type { ResendVerificationEmailInput } from "@/lib/validations/schemas";
import { resendVerificationEmailSchema } from "@/lib/validations/schemas";
import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2, Mail } from "lucide-react";
import Link from "next/link";
import { useState, useTransition } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";

export default function ResendVerificationPage() {
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);
  const [isSubmitted, setIsSubmitted] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<ResendVerificationEmailInput>({
    resolver: zodResolver(resendVerificationEmailSchema),
    defaultValues: {
      email: "",
    },
  });

  const onSubmit = async (data: ResendVerificationEmailInput) => {
    setError(null);

    startTransition(async () => {
      try {
        const result = await resendVerificationEmailAction(data);

        if (!result.success) {
          setError(result.error || "Failed to send verification email");
          toast.error(result.error || "Failed to send verification email");
        } else {
          setIsSubmitted(true);
          toast.success("Verification email sent!");
        }
      } catch (err) {
        console.error("Resend verification error:", err);
        setError("An unexpected error occurred. Please try again.");
        toast.error("Failed to send verification email");
      }
    });
  };

  const isLoading = isSubmitting || isPending;

  if (isSubmitted) {
    return (
      <Card className="w-full max-w-md">
        <CardHeader className="space-y-1 text-center">
          <div
            className={`
              mx-auto mb-2 flex h-12 w-12 items-center justify-center
              rounded-full bg-primary/10
            `}
          >
            <Mail className="h-6 w-6 text-primary" />
          </div>
          <CardTitle className="text-2xl font-bold">Email Sent!</CardTitle>
          <CardDescription>
            We&apos;ve sent you a new verification link. Please check your email and click the link
            to verify your account.
          </CardDescription>
        </CardHeader>
        <CardFooter className="flex-col space-y-2">
          <Link href="/sign-in" className="w-full">
            <Button className="w-full">Back to Sign In</Button>
          </Link>
          <p className="text-center text-sm text-muted-foreground">
            Still didn&apos;t receive it?{" "}
            <button
              onClick={() => setIsSubmitted(false)}
              className={`
              text-primary
              hover:underline
            `}
            >
              Try again
            </button>
          </p>
        </CardFooter>
      </Card>
    );
  }

  return (
    <Card className="w-full max-w-md">
      <CardHeader className="space-y-1">
        <CardTitle className="text-2xl font-bold">Resend Verification Email</CardTitle>
        <CardDescription>
          Enter your email address and we&apos;ll send you a new verification link
        </CardDescription>
      </CardHeader>
      <form onSubmit={handleSubmit(onSubmit)}>
        <CardContent className="space-y-4">
          {error && (
            <Alert variant="destructive">
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              placeholder="name@example.com"
              autoComplete="email"
              disabled={isLoading}
              {...register("email")}
            />
            {errors.email && <p className="text-sm text-destructive">{errors.email.message}</p>}
          </div>
        </CardContent>
        <CardFooter className="flex-col space-y-4">
          <Button type="submit" className="w-full" disabled={isLoading}>
            {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            Send Verification Email
          </Button>

          <p className="text-center text-sm text-muted-foreground">
            Already verified?{" "}
            <Link
              href="/sign-in"
              className={`
              text-primary
              hover:underline
            `}
            >
              Sign in
            </Link>
          </p>
        </CardFooter>
      </form>
    </Card>
  );
}
