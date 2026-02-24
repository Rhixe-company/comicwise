"use client";

// ═══════════════════════════════════════════════════
// SIGN UP PAGE (Next.js 16 + React 19)
// ═══════════════════════════════════════════════════

import { signIn } from "next-auth/react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";
import { toast } from "sonner";

import { registerUser } from "@/actions/auth";
import { AuthForm, EmailField, NameField, PasswordField } from "@/components/auth";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { signUpSchema } from "@/lib/validations";

import type { SignUpInput } from "@/lib/validations";

const SignUp = () => {
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState<null | string>(null);
  const router = useRouter();

  const onSubmit = async (data: SignUpInput) => {
    setError(null);

    startTransition(async () => {
      try {
        const result = await registerUser(data);

        if (result?.success) {
          toast.success("Account created! Please check your email to verify your account.");
          router.push("/verify-request");
        } else {
          setError(result.error || "Failed to create account");
          toast.error(result.error || "Failed to create account");
        }
      } catch (error_) {
        console.error("Sign up error:", error_);
        setError("An unexpected error occurred. Please try again.");
        toast.error("Failed to create account");
      }
    });
  };

  const handleGoogleSignIn = () => {
    startTransition(async () => {
      try {
        await signIn("google", { callbackUrl: "/" });
      } catch {
        toast.error("Failed to sign in with Google");
      }
    });
  };

  return (
    <AuthForm
      defaultValues={{ name: "", email: "", password: "", confirmPassword: "" }}
      description="Create your account to get started"
      error={error}
      footer={
        <>
          <p className="text-muted-foreground text-center">
            Already have an account?{" "}
            <Link
              className={`
                text-card-foreground
                hover:underline
              `}
              href="/sign-in"
            >
              Sign in instead
            </Link>
          </p>
          <div className="flex items-center gap-4">
            <Separator className="flex-1" />
            <p>or</p>
            <Separator className="flex-1" />
          </div>
          <Button
            className="w-full"
            disabled={isPending}
            onClick={handleGoogleSignIn}
            type="button"
            variant="ghost"
          >
            Sign in with Google
          </Button>
        </>
      }
      isLoading={isPending}
      onSubmit={onSubmit}
      schema={signUpSchema}
      submitLabel="Sign Up"
      title="Sign Up to ComicWise"
    >
      <NameField disabled={isPending} />
      <EmailField disabled={isPending} />
      <PasswordField
        autoComplete="new-password"
        disabled={isPending}
        helperText="Must contain uppercase, lowercase, and number"
        label="Password"
        name="password"
      />
      <PasswordField
        autoComplete="new-password"
        disabled={isPending}
        label="Confirm Password"
        name="confirmPassword"
      />
    </AuthForm>
  );
};

export default SignUp;
