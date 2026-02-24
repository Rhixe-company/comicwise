"use client";

import { useFormContext } from "react-hook-form";

import { FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { PasswordInput } from "@/components/ui/PasswordInput";

export interface PasswordFieldProps {
  autoComplete?: string;
  disabled?: boolean;
  helperText?: string;
  label?: string;
  name?: string;
}

export function PasswordField({
  name = "password",
  label = "Password",
  disabled = false,
  autoComplete = "current-password",
  helperText,
}: PasswordFieldProps) {
  const { control } = useFormContext();

  return (
    <FormField
      control={control}
      name={name}
      render={({ field }) => (
        <FormItem>
          <FormLabel>{label}</FormLabel>
          <FormControl>
            <PasswordInput autoComplete={autoComplete} disabled={disabled} {...field} />
          </FormControl>
          <FormMessage />
          {helperText && <p className="text-muted-foreground text-xs">{helperText}</p>}
        </FormItem>
      )}
    />
  );
}
