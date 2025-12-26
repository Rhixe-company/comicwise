"use client";

import { zodResolver } from "hookform/resolvers/zod";
import { Loader2 } from "lucide-react";
import type { ReactNode } from "react";
import { useState } from "react";
import type { DefaultValues, FieldValues, UseFormReturn } from "react-hook-form";
import { useForm } from "react-hook-form";
import { Form } from "@/components/ui/form";
import type { ZodType } from "zod";

import { Alert, AlertDescription } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";

export interface AuthFormProperties<T extends FieldValues> {
  title: string;
  description: string;
  schema: ZodType<T>;
  defaultValues: DefaultValues<T>;
  onSubmit(data: T, form: UseFormReturn<T>): Promise<void> | void;
  children: ReactNode;
  footer?: ReactNode;
  error?: string | null;
  isLoading?: boolean;
  submitLabel?: string;
  className?: string;
}

/**
 *
 * param root0
 * param root0.title
 * param root0.description
 * param root0.schema
 * param root0.defaultValues
 * param root0.onSubmit
 * param root0.children
 * param root0.footer
 * param root0.error
 * param root0.isLoading
 * param root0.submitLabel
 * param root0.className
 */
export function AuthForm<T extends FieldValues>({
  title,
  description,
  schema,
  defaultValues,
  onSubmit,
  children,
  footer,
  error: externalError,
  isLoading = false,
  submitLabel = "Submit",
  className,
}: AuthFormProperties<T>) {
  const [internalError, setInternalError] = useState<string | null>(null);
  // ts-expect-error - zodResolver type compatibility issue with react-hook-form
  const form = useForm<T>({
    resolver: zodResolver(schema),
    defaultValues,
  });

  const handleSubmit = async (data: T) => {
    // ts-expect-error - Type compatibility with generic form
    await onSubmit(data, form);
  };

  const isFormLoading = isLoading || form.formState.isSubmitting;
  const displayError = externalError || internalError;

  return (
    <Card className={className ?? "w-full max-w-md"}>
      <CardHeader className="space-y-1">
        <CardTitle className="text-2xl font-bold">{title}</CardTitle>
        <CardDescription>{description}</CardDescription>
      </CardHeader>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(handleSubmit)}>
          <CardContent className="space-y-4">
            {displayError && (
              <Alert variant="destructive">
                <AlertDescription>{displayError}</AlertDescription>
              </Alert>
            )}
            {children}
          </CardContent>
          <CardFooter className="flex-col space-y-4">
            <Button type="submit" className="w-full" disabled={isFormLoading}>
              {isFormLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              {submitLabel}
            </Button>
            {footer}
          </CardFooter>
        </form>
      </Form>
    </Card>
  );
}
