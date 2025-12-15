"use client";

// ═══════════════════════════════════════════════════
// FORGOT PASSWORD PAGE (Next.js 16 + React 19)
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
import { forgotPasswordAction } from "@/lib/actions/auth/index";
import type { ForgotPasswordInput } from "@/lib/validations/schemas";
import { forgotPasswordSchema } from "@/lib/validations/schemas";
import { zodResolver } from "@hookform/resolvers/zod";
import { CheckCircle2, Loader2 } from "lucide-react";
import Link from "next/link";
import { useState, useTransition } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";

export default function ForgotPasswordPage() {
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);
  const [isSubmitted, setIsSubmitted] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<ForgotPasswordInput>({
    resolver: zodResolver(forgotPasswordSchema),
    defaultValues: {
      email: "",
    },
  });

  const onSubmit = async (data: ForgotPasswordInput) => {
    setError(null);

    startTransition(async () => {
      try {
        const result = await forgotPasswordAction(data);

        if (!result.success) {
          setError(result.error || "Failed to send reset link");
          toast.error(result.error || "Failed to send reset link");
        } else {
          setIsSubmitted(true);
          toast.success("Password reset link sent!");
        }
      } catch (err) {
        console.error("Forgot password error:", err);
        setError("An unexpected error occurred. Please try again.");
        toast.error("Failed to send reset link");
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
              rounded-full bg-green-100
            `}
          >
            <CheckCircle2 className="h-6 w-6 text-green-600" />
          </div>
          <CardTitle className="text-2xl font-bold">Check your email</CardTitle>
          <CardDescription>
            We&apos;ve sent you a password reset link. Please check your email and follow the
            instructions.
          </CardDescription>
        </CardHeader>
        <CardFooter className="flex-col space-y-2">
          <Link href="/sign-in" className="w-full">
            <Button className="w-full">Back to Sign In</Button>
          </Link>
          <Button variant="ghost" className="w-full" onClick={() => setIsSubmitted(false)}>
            Send another link
          </Button>
        </CardFooter>
      </Card>
    );
  }

  return (
    <Card className="w-full max-w-md">
      <CardHeader className="space-y-1">
        <CardTitle className="text-2xl font-bold">Forgot Password</CardTitle>
        <CardDescription>
          Enter your email address and we&apos;ll send you a link to reset your password
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
            Send Reset Link
          </Button>

          <p className="text-center text-sm text-muted-foreground">
            Remember your password?{" "}
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
