"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2 } from "lucide-react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";

import type { Path } from "react-hook-form";
import type { z } from "zod";

export type FieldType =
  | "date"
  | "email"
  | "file"
  | "number"
  | "password"
  | "select"
  | "switch"
  | "text"
  | "textarea";

export interface FormFieldConfig<T extends z.ZodTypeAny> {
  description?: string;
  disabled?: boolean;
  label: string;
  name: keyof z.infer<T>;
  options?: { label: string; value: string }[];
  placeholder?: string;
  required?: boolean;
  type: FieldType;
}

interface BaseFormProps<T extends z.ZodTypeAny> {
  className?: string;
  defaultValues: Partial<z.infer<T>>;
  fields: FormFieldConfig<T>[];
  isLoading?: boolean;
  onSubmit(values: z.infer<T>): Promise<void>;
  schema: T;
  submitLabel?: string;
}

export function BaseForm<T extends z.ZodType<any, any, any>>({
  schema,
  fields,
  defaultValues,
  onSubmit,
  submitLabel = "Submit",
  isLoading = false,
  className = "",
}: Readonly<BaseFormProps<T>>) {
  type FormValues = z.infer<T>;

  const form = useForm<FormValues>({
    resolver: zodResolver(schema) as any,
    defaultValues: defaultValues as FormValues,
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

  const renderField = (field: FormFieldConfig<T>, formInstance: typeof form) => {
    const fieldName = String(field.name) as Path<FormValues>;

    switch (field.type) {
      case "textarea":
        return (
          <FormField
            control={formInstance.control as any}
            key={String(fieldName)}
            name={fieldName}
            render={({ field: formField }) => (
              <FormItem>
                <FormLabel>{field.label}</FormLabel>
                <FormControl>
                  <Textarea
                    disabled={field.disabled}
                    placeholder={field.placeholder}
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
            control={formInstance.control as any}
            key={String(fieldName)}
            name={fieldName}
            render={({ field: formField }) => (
              <FormItem>
                <FormLabel>{field.label}</FormLabel>
                <Select
                  defaultValue={String(formField.value ?? "")}
                  disabled={field.disabled}
                  onValueChange={formField.onChange}
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
            control={formInstance.control as any}
            key={String(fieldName)}
            name={fieldName}
            render={({ field: formField }) => (
              <FormItem
                className={`
                  flex flex-row items-center justify-between rounded-lg border
                  p-4
                `}
              >
                <div className="space-y-0.5">
                  <FormLabel className="text-base">{field.label}</FormLabel>
                  {field.description && <FormDescription>{field.description}</FormDescription>}
                </div>
                <FormControl>
                  <Switch
                    checked={Boolean(formField.value)}
                    disabled={field.disabled}
                    onCheckedChange={formField.onChange}
                  />
                </FormControl>
              </FormItem>
            )}
          />
        );

      case "number":
        return (
          <FormField
            control={formInstance.control as any}
            key={String(fieldName)}
            name={fieldName}
            render={({ field: formField }) => (
              <FormItem>
                <FormLabel>{field.label}</FormLabel>
                <FormControl>
                  <Input
                    disabled={field.disabled}
                    placeholder={field.placeholder}
                    type="number"
                    {...formField}
                    onChange={(e) => formField.onChange(Number.parseFloat(e.target.value) || 0)}
                    value={formField.value as number}
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
            control={formInstance.control as any}
            key={String(fieldName)}
            name={fieldName}
            render={({ field: formField }) => (
              <FormItem>
                <FormLabel>{field.label}</FormLabel>
                <FormControl>
                  <Input
                    disabled={field.disabled}
                    placeholder={field.placeholder}
                    type={field.type}
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
        className={`
          space-y-6
          ${className}
        `}
        onSubmit={form.handleSubmit(handleSubmit)}
      >
        {fields.map((field) => renderField(field, form))}
        <Button disabled={isLoading} type="submit">
          {isLoading && <Loader2 className="mr-2 size-4 animate-spin" />}
          {submitLabel}
        </Button>
      </form>
    </Form>
  );
}
