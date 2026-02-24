"use client";

import { useFormContext } from "react-hook-form";

import { FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";

export interface EmailFieldProps {
  autoComplete?: string;
  disabled?: boolean;
  label?: string;
  name?: string;
  placeholder?: string;
}

export function EmailField({
  name = "email",
  label = "Email",
  placeholder = "nameexample.com",
  disabled = false,
  autoComplete = "email",
}: EmailFieldProps) {
  const { control } = useFormContext();

  return (
    <FormField
      control={control}
      name={name}
      render={({ field }) => (
        <FormItem>
          <FormLabel>{label}</FormLabel>
          <FormControl>
            <Input
              autoComplete={autoComplete}
              disabled={disabled}
              placeholder={placeholder}
              type="email"
              {...field}
            />
          </FormControl>
          <FormMessage />
        </FormItem>
      )}
    />
  );
}
