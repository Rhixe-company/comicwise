"use client";

import { Alert, AlertDescription } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { PasswordInput } from "@/components/ui/password-input";
import type { SignUpInput } from "@/lib/validations/schemas";
import { signUpSchema } from "@/lib/validations/schemas";
import { zodResolver } from "@hookform/resolvers/zod";
import Link from "next/link";
import { useState, useTransition } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";

export default function SignUpPage() {
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    watch,
  } = useForm<SignUpInput>({
    resolver: zodResolver(signUpSchema),
    defaultValues: {
      email: "",
      password: "",
      confirmPassword: "",
    },
  });

  const onSubmit = async (_data: SignUpInput) => {
    setError(null);
    setSuccess(false);
    startTransition(async () => {
      try {
        // TODO: Call server action to create account
        // await signUpAction(_data)
        setSuccess(true);
        toast.success("Account created! Check your email for verification.");
      } catch (err: any) {
        setError(err.message || "Registration failed. Please try again.");
        toast.error("Registration failed");
      }
    });
  };

  const password = watch("password");

  return (
    <div className="mx-auto mt-16 max-w-md rounded border p-6 shadow">
      <h1 className="mb-4 text-2xl font-bold">Sign Up</h1>
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        {error && (
          <Alert variant="destructive">
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}
        {success && (
          <Alert variant="success">
            <AlertDescription>
              Registration successful! Please check your email to verify your account.
            </AlertDescription>
          </Alert>
        )}
        <div>
          <Label htmlFor="email">Email</Label>
          <Input
            id="email"
            type="email"
            {...register("email")}
            required
            className="w-full rounded border px-3 py-2"
            autoComplete="email"
            disabled={isPending || isSubmitting}
          />
          {errors.email && <p className="text-sm text-destructive">{errors.email.message}</p>}
        </div>
        <div>
          <Label htmlFor="password">Password</Label>
          <PasswordInput
            id="password"
            {...register("password")}
            required
            className="w-full rounded border px-3 py-2"
            autoComplete="new-password"
            disabled={isPending || isSubmitting}
          />
          {errors.password && <p className="text-sm text-destructive">{errors.password.message}</p>}
        </div>
        <div>
          <Label htmlFor="confirmPassword">Confirm Password</Label>
          <PasswordInput
            id="confirmPassword"
            {...register("confirmPassword", {
              validate: (value) => value === password || "Passwords do not match",
            })}
            required
            className="w-full rounded border px-3 py-2"
            autoComplete="new-password"
            disabled={isPending || isSubmitting}
          />
          {errors.confirmPassword && (
            <p className="text-sm text-destructive">{errors.confirmPassword.message}</p>
          )}
        </div>
        <Button
          type="submit"
          className={`
            w-full rounded bg-blue-600 py-2 text-white
            disabled:opacity-50
          `}
          disabled={isPending || isSubmitting}
        >
          {isPending || isSubmitting ? "Registering..." : "Sign Up"}
        </Button>
      </form>
      <div className="mt-4 text-center">
        <Link href="/sign-in" className="text-blue-600 underline">
          Already have an account? Sign in
        </Link>
      </div>
    </div>
  );
}
