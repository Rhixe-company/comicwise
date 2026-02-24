"use client";

import { useState } from "react";

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/AlertDialog";

// Hook for easier use

interface ConfirmDialogProps {
  cancelText?: string;
  confirmText?: string;
  description?: string;
  onConfirm(): void;
  onOpenChange(open: boolean): void;
  open: boolean;
  title?: string;
  variant?: "default" | "destructive";
}

export function ConfirmDialog({
  open,
  onOpenChange,
  title = "Are you sure?",
  description = "This action cannot be undone.",
  confirmText = "Continue",
  cancelText = "Cancel",
  onConfirm,
  variant = "default",
}: ConfirmDialogProps) {
  return (
    <AlertDialog onOpenChange={onOpenChange} open={open}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>{title}</AlertDialogTitle>
          <AlertDialogDescription>{description}</AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>{cancelText}</AlertDialogCancel>
          <AlertDialogAction
            className={
              variant === "destructive"
                ? "bg-destructive text-destructive-foreground hover:bg-destructive/90"
                : ""
            }
            onClick={onConfirm}
          >
            {confirmText}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}

export function useConfirmDialog() {
  const [isOpen, setIsOpen] = useState(false);
  const [config, setConfig] = useState<{
    cancelText?: string;
    confirmText?: string;
    description?: string;
    onConfirm(): void;
    title?: string;
    variant?: "default" | "destructive";
  }>({
    onConfirm: () => {},
  });

  const confirm = (options: {
    cancelText?: string;
    confirmText?: string;
    description?: string;
    onConfirm(): void;
    title?: string;
    variant?: "default" | "destructive";
  }) => {
    setConfig(options);
    setIsOpen(true);
  };

  const ConfirmDialogComponent = () => (
    <ConfirmDialog
      cancelText={config.cancelText}
      confirmText={config.confirmText}
      description={config.description}
      onConfirm={() => {
        config.onConfirm();
        setIsOpen(false);
      }}
      onOpenChange={setIsOpen}
      open={isOpen}
      title={config.title}
      variant={config.variant}
    />
  );

  return { confirm, ConfirmDialog: ConfirmDialogComponent };
}
