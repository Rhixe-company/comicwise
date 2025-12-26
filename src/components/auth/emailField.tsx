"use client";

import { useFormContext } from "react-hook-form";
import { FormControl, FormField, FormItem, FormLabel, FormMessage } from "ui/form";
import { Input } from "ui/input";

export interface EmailFieldProps {
  name?: string;
  label?: string;
  placeholder?: string;
  disabled?: boolean;
  autoComplete?: string;
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
              type="email"
              placeholder={placeholder}
              autoComplete={autoComplete}
              disabled={disabled}
              {...field}
            />
          </FormControl>
          <FormMessage />
        </FormItem>
      )}
    />
  );
}
