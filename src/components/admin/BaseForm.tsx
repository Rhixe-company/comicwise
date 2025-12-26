/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2 } from "lucide-react";
import type { DefaultValues, Path, UseFormReturn } from "react-hook-form";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { Button } from "ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "ui/form";
import { Input } from "ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "ui/select";
import { Switch } from "ui/switch";
import { Textarea } from "ui/textarea";

import type { z } from "zod";

export type FieldType =
  | "text"
  | "email"
  | "password"
  | "number"
  | "textarea"
  | "select"
  | "switch"
  | "date"
  | "file";

export interface FormFieldConfig<T extends z.ZodTypeAny> {
  name: keyof z.infer<T>;
  label: string;
  type: FieldType;
  placeholder?: string;
  description?: string;
  options?: { label: string; value: string }[];
  disabled?: boolean;
  required?: boolean;
}

interface BaseFormProps<T extends z.ZodTypeAny> {
  schema: T;
  fields: FormFieldConfig<T>[];
  defaultValues: Partial<z.infer<T>>;
  onSubmit(values: z.infer<T>): Promise<void>;
  submitLabel?: string;
  isLoading?: boolean;
  className?: string;
}

export function BaseForm<T extends z.ZodTypeAny>({
  schema,
  fields,
  defaultValues,
  onSubmit,
  submitLabel = "Submit",
  isLoading = false,
  className = "",
}: BaseFormProps<T>) {
  type FormValues = z.infer<T>;

  // @ts-expect-error - zodResolver type compatibility issue with react-hook-form generics
  const form = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: defaultValues as DefaultValues<FormValues>,
  });

  const handleSubmit = async (values: FormValues) => {
    try {
      await onSubmit(values);
      toast.success("Submitted successfully");
    } catch (error) {
      console.error("Form submission error:", error);
      toast.error(error instanceof Error ? error.message : "Failed to submit");
    }
  };

  const renderField = (field: FormFieldConfig<T>, formInstance: UseFormReturn<FormValues>) => {
    const fieldName = String(field.name) as Path<FormValues>;

    switch (field.type) {
      case "textarea":
        return (
          <FormField
            key={String(fieldName)}
            control={formInstance.control}
            name={fieldName}
            render={({ field: formField }) => (
              <FormItem>
                <FormLabel>{field.label}</FormLabel>
                <FormControl>
                  <Textarea
                    placeholder={field.placeholder}
                    disabled={field.disabled}
                    {...formField}
                  />
                </FormControl>
                {field.description && <FormDescription>{field.description}</FormDescription>}
                <FormMessage />
              </FormItem>
            )}
          />
        );

      case "date":
        return (
          <FormField
            key={String(fieldName)}
            control={formInstance.control}
            name={fieldName}
            render={({ field: formField }) => (
              <FormItem>
                <FormLabel>{field.label}</FormLabel>
                <Select
                  onValueChange={formField.onChange}
                  defaultValue={String(formField.value ?? "")}
                  disabled={field.disabled}
                >
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder={field.placeholder} />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {field.options?.map((option) => (
                      <SelectItem key={option.value} value={option.value}>
                        {option.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {field.description && <FormDescription>{field.description}</FormDescription>}
                <FormMessage />
              </FormItem>
            )}
          />
        );

      case "switch":
        return (
          <FormField
            key={String(fieldName)}
            control={formInstance.control}
            name={fieldName}
            render={({ field: formField }) => (
              <FormItem
                className={`
                flex flex-row items-center justify-between rounded-lg border p-4
              `}
              >
                <div className="space-y-0.5">
                  <FormLabel className="text-base">{field.label}</FormLabel>
                  {field.description && <FormDescription>{field.description}</FormDescription>}
                </div>
                <FormControl>
                  <Switch
                    checked={Boolean(formField.value)}
                    onCheckedChange={formField.onChange}
                    disabled={field.disabled}
                  />
                </FormControl>
              </FormItem>
            )}
          />
        );

      case "number":
        return (
          <FormField
            key={String(fieldName)}
            control={formInstance.control}
            name={fieldName}
            render={({ field: formField }) => (
              <FormItem>
                <FormLabel>{field.label}</FormLabel>
                <FormControl>
                  <Input
                    type="number"
                    placeholder={field.placeholder}
                    disabled={field.disabled}
                    {...formField}
                    value={formField.value as number}
                    onChange={(e) => formField.onChange(parseFloat(e.target.value) || 0)}
                  />
                </FormControl>
                {field.description && <FormDescription>{field.description}</FormDescription>}
                <FormMessage />
              </FormItem>
            )}
          />
        );

      default:
        return (
          <FormField
            key={String(fieldName)}
            control={formInstance.control}
            name={fieldName}
            render={({ field: formField }) => (
              <FormItem>
                <FormLabel>{field.label}</FormLabel>
                <FormControl>
                  <Input
                    type={field.type}
                    placeholder={field.placeholder}
                    disabled={field.disabled}
                    {...formField}
                    value={formField.value as string}
                  />
                </FormControl>
                {field.description && <FormDescription>{field.description}</FormDescription>}
                <FormMessage />
              </FormItem>
            )}
          />
        );
    }
  };

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(handleSubmit)}
        className={`
        space-y-6
        ${className}
      `}
      >
        {fields.map((field) => renderField(field, form))}
        <Button type="submit" disabled={isLoading}>
          {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
          {submitLabel}
        </Button>
      </form>
    </Form>
  );
}
