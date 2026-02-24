"use client";

import { Mail } from "lucide-react";
import Link from "next/link";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

export default function VerifyRequestPage() {
  return (
    <Card>
      <CardHeader className="text-center">
        <div
          className={`
            bg-primary/10 mx-auto mb-4 flex size-16 items-center justify-center
            rounded-full
          `}
        >
          <Mail className="text-primary size-8" />
        </div>
        <CardTitle>Check your email</CardTitle>
        <CardDescription>
          We&apos;ve sent you a verification link. Please check your email and click the link to
          verify your account.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="border-border bg-muted/50 rounded-lg border p-4">
          <h3 className="mb-2 font-semibold">What&apos;s next?</h3>
          <ul
            className={`
              text-muted-foreground list-inside list-disc space-y-1 text-sm
            `}
          >
            <li>Check your inbox (and spam folder)</li>
            <li>Click the verification link</li>
            <li>Sign in to your account</li>
          </ul>
        </div>
      </CardContent>
      <CardFooter className="flex-col space-y-2">
        <Link className="w-full" href="/sign-in">
          <Button className="w-full">Back to Sign In</Button>
        </Link>
        <p className="text-muted-foreground text-center text-sm">
          Didn&apos;t receive the email?{" "}
          <Link
            className={`
              text-primary
              hover:underline
            `}
            href="/resend-verification"
          >
            Resend
          </Link>
        </p>
      </CardFooter>
    </Card>
  );
}
