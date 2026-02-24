"use client";

import { useFormContext } from "react-hook-form";

import { FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";

export interface NameFieldProps {
  autoComplete?: string;
  disabled?: boolean;
  label?: string;
  name?: string;
  placeholder?: string;
}

export function NameField({
  name = "name",
  label = "Name",
  placeholder = "Enter your name",
  disabled = false,
  autoComplete = "name",
}: NameFieldProps) {
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
              type="text"
              {...field}
            />
          </FormControl>
          <FormMessage />
        </FormItem>
      )}
    />
  );
}
