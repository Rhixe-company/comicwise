"use client";

import { useControllableState } from "@radix-ui/react-use-controllable-state";
import { ChevronsUpDownIcon, PlusIcon } from "lucide-react";
import { createContext, useContext, useEffect, useRef, useState } from "react";

import { Button } from "@/components/ui/button";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator,
} from "@/components/ui/command";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";

import { cn } from "utils";

import type { ComponentProps, ReactNode } from "react";

interface ComboboxData {
  label: string;
  value: string;
}

interface ComboboxContextType {
  data: ComboboxData[];
  inputValue: string;
  onOpenChange(open: boolean): void;
  onValueChange(value: string): void;
  open: boolean;
  setInputValue(value: string): void;
  setWidth(width: number): void;
  type: string;
  value: string;
  width: number;
}

const ComboboxContext = createContext<ComboboxContextType>({
  data: [],
  type: "item",
  value: "",
  onValueChange: () => {},
  open: false,
  onOpenChange: () => {},
  width: 200,
  setWidth: () => {},
  inputValue: "",
  setInputValue: () => {},
});

export type ComboboxProps = ComponentProps<typeof Popover> & {
  data: ComboboxData[];
  defaultValue?: string;
  onOpenChange?(open: boolean): void;
  onValueChange?(value: string): void;
  open?: boolean;
  type: string;
  value?: string;
};

export const Combobox = ({
  data,
  type,
  defaultValue,
  value: controlledValue,
  onValueChange: controlledOnValueChange,
  defaultOpen = false,
  open: controlledOpen,
  onOpenChange: controlledOnOpenChange,
  ...props
}: ComboboxProps) => {
  const [value, onValueChange] = useControllableState({
    defaultProp: defaultValue ?? "",
    prop: controlledValue,
    onChange: controlledOnValueChange,
  });
  const [open, onOpenChange] = useControllableState({
    defaultProp: defaultOpen,
    prop: controlledOpen,
    onChange: controlledOnOpenChange,
  });
  const [width, setWidth] = useState(200);
  const [inputValue, setInputValue] = useState("");

  return (
    <ComboboxContext.Provider
      value={{
        type,
        value,
        onValueChange,
        open,
        onOpenChange,
        data,
        width,
        setWidth,
        inputValue,
        setInputValue,
      }}
    >
      <Popover {...(props as Record<string, unknown>)} onOpenChange={onOpenChange} open={open} />
    </ComboboxContext.Provider>
  );
};

export type ComboboxTriggerProps = ComponentProps<typeof Button>;

export const ComboboxTrigger = ({ children, ...props }: ComboboxTriggerProps) => {
  const { value, data, type, setWidth } = useContext(ComboboxContext);
  const ref = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    // Create a ResizeObserver to detect width changes
    const resizeObserver = new ResizeObserver((entries) => {
      for (const entry of entries) {
        const newWidth = (entry.target as HTMLElement).offsetWidth;
        if (newWidth) {
          setWidth?.(newWidth);
        }
      }
    });

    if (ref.current) {
      resizeObserver.observe(ref.current);
    }

    // Clean up the observer when component unmounts
    return () => {
      resizeObserver.disconnect();
    };
  }, [setWidth]);

  return (
    <PopoverTrigger asChild>
      <Button variant="outline" {...(props as Record<string, unknown>)} ref={ref}>
        {children ?? (
          <span className="flex w-full items-center justify-between gap-2">
            {value ? data.find((item) => item.value === value)?.label : `Select ${type}...`}
            <ChevronsUpDownIcon className="text-muted-foreground shrink-0" size={16} />
          </span>
        )}
      </Button>
    </PopoverTrigger>
  );
};

export type ComboboxContentProps = ComponentProps<typeof Command> & {
  popoverOptions?: ComponentProps<typeof PopoverContent>;
};

export const ComboboxContent = ({ className, popoverOptions, ...props }: ComboboxContentProps) => {
  const { width } = useContext(ComboboxContext);

  return (
    <PopoverContent className={cn("p-0", className)} style={{ width }} {...popoverOptions}>
      <Command {...(props as Record<string, unknown>)} />
    </PopoverContent>
  );
};

export type ComboboxInputProps = ComponentProps<typeof CommandInput> & {
  defaultValue?: string;
  onValueChange?(value: string): void;
  value?: string;
};

export const ComboboxInput = ({
  value: controlledValue,
  defaultValue,
  onValueChange: controlledOnValueChange,
  ...props
}: ComboboxInputProps) => {
  const { type, inputValue, setInputValue } = useContext(ComboboxContext);

  const [value, onValueChange] = useControllableState({
    defaultProp: defaultValue ?? inputValue,
    prop: controlledValue,
    onChange: (newValue) => {
      // Sync with context state
      setInputValue(newValue);
      // Call external onChange if provided
      controlledOnValueChange?.(newValue);
    },
  });

  return (
    <CommandInput
      onValueChange={onValueChange}
      placeholder={`Search ${type}...`}
      value={value}
      {...(props as Record<string, unknown>)}
    />
  );
};

export type ComboboxListProps = ComponentProps<typeof CommandList>;

export const ComboboxList = (props: ComboboxListProps) => (
  <CommandList {...(props as Record<string, unknown>)} />
);

export type ComboboxEmptyProps = ComponentProps<typeof CommandEmpty>;

export const ComboboxEmpty = ({ children, ...props }: ComboboxEmptyProps) => {
  const { type } = useContext(ComboboxContext);

  return (
    <CommandEmpty {...(props as Record<string, unknown>)}>
      {children ?? `No ${type} found.`}
    </CommandEmpty>
  );
};

export type ComboboxGroupProps = ComponentProps<typeof CommandGroup>;

export const ComboboxGroup = (props: ComboboxGroupProps) => (
  <CommandGroup {...(props as Record<string, unknown>)} />
);

export type ComboboxItemProps = ComponentProps<typeof CommandItem>;

export const ComboboxItem = (props: ComboboxItemProps) => {
  const { onValueChange, onOpenChange } = useContext(ComboboxContext);

  return (
    <CommandItem
      onSelect={(currentValue) => {
        onValueChange(currentValue);
        onOpenChange(false);
      }}
      {...(props as Record<string, unknown>)}
    />
  );
};

export type ComboboxSeparatorProps = ComponentProps<typeof CommandSeparator>;

export const ComboboxSeparator = (props: ComboboxSeparatorProps) => (
  <CommandSeparator {...(props as Record<string, unknown>)} />
);

export interface ComboboxCreateNewProps {
  children?(inputValue: string): ReactNode;
  className?: string;
  onCreateNew(value: string): void;
}

export const ComboboxCreateNew = ({ onCreateNew, children, className }: ComboboxCreateNewProps) => {
  const { inputValue, type, onValueChange, onOpenChange } = useContext(ComboboxContext);

  if (!inputValue.trim()) {
    return null;
  }

  const handleCreateNew = () => {
    onCreateNew(inputValue.trim());
    onValueChange(inputValue.trim());
    onOpenChange(false);
  };

  return (
    <button
      className={cn(
        `
          aria-selected:bg-accent aria-selected:text-accent-foreground relative flex w-full cursor-pointer items-center gap-2
          rounded-sm px-2 py-1.5 text-sm
          outline-none select-none
          data-disabled:pointer-events-none data-disabled:opacity-50
        `,
        className
      )}
      onClick={handleCreateNew}
      type="button"
    >
      {children ? (
        children(inputValue)
      ) : (
        <>
          <PlusIcon className="text-muted-foreground size-4" />
          <span>
            Create new {type}: "{inputValue}"
          </span>
        </>
      )}
    </button>
  );
};
