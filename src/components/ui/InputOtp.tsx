"use client";

import { OTPInput, OTPInputContext } from "input-otp";
import { MinusIcon } from "lucide-react";
import * as React from "react";

import { cn } from "utils";

const InputOTP = React.forwardRef<
  React.ElementRef<typeof OTPInput>,
  React.ComponentPropsWithoutRef<typeof OTPInput> & { containerClassName?: string }
>(({ className, containerClassName, ...properties }, reference) => {
  return (
    <OTPInput
      ref={reference}
      data-slot="input-otp"
      containerClassName={cn(
        `
          flex items-center gap-2
          has-[:disabled]:opacity-50
        `,
        containerClassName
      )}
      className={cn("disabled:cursor-not-allowed", className)}
      {...properties}
    />
  );
});
InputOTP.displayName = "InputOTP";

/**
 *
 * param root0
 * param root0.className
 */
function InputOTPGroup({ className, ...properties }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="input-otp-group"
      className={cn("flex items-center", className)}
      {...properties}
    />
  );
}

/**
 *
 * param root0
 * param root0.index
 * param root0.className
 */
function InputOTPSlot({
  index,
  className,
  ...properties
}: React.ComponentProps<"div"> & {
  index: number;
}) {
  const inputOTPContext = React.useContext(OTPInputContext);
  const { char, hasFakeCaret, isActive } = inputOTPContext?.slots[index] ?? {};

  return (
    <div
      data-slot="input-otp-slot"
      data-active={isActive}
      className={cn(
        `
          relative flex h-9 w-9 items-center justify-center border-y border-r
          border-input text-sm shadow-xs transition-all outline-none
          first:rounded-l-md first:border-l
          last:rounded-r-md
          aria-invalid:border-destructive
          data-[active=true]:z-10 data-[active=true]:border-ring
          data-[active=true]:ring-[3px] data-[active=true]:ring-ring/50
          data-[active=true]:aria-invalid:border-destructive
          data-[active=true]:aria-invalid:ring-destructive/20
          dark:bg-input/30
          dark:data-[active=true]:aria-invalid:ring-destructive/40
        `,
        className
      )}
      {...properties}
    >
      {char}
      {hasFakeCaret && (
        <div
          className={`
          pointer-events-none absolute inset-0 flex items-center justify-center
        `}
        >
          <div
            className={`
            animate-caret-blink h-4 w-px bg-foreground duration-1000
          `}
          />
        </div>
      )}
    </div>
  );
}

/**
 *
 * param root0
 */
function InputOTPSeparator({ ...properties }: React.ComponentProps<"div">) {
  return (
    <div data-slot="input-otp-separator" role="separator" {...properties}>
      <MinusIcon />
    </div>
  );
}

export { InputOTP, InputOTPGroup, InputOTPSeparator, InputOTPSlot };
