"use client";

import * as React from "react";
import { Input } from "@/src/components/ui/input";
import { cn } from "@/src/lib/utils";

const NUMBERS_ONLY_REGEX = /[^0-9]/g;
const NUMBERS_AND_DECIMAL_REGEX = /[^0-9.]/g;

interface InputNumberProps
  extends Omit<React.ComponentProps<typeof Input>, "type"> {
  allowDecimals?: boolean;
  onValueChange?: (value: string) => void;
  min?: number;
  max?: number;
}

function InputNumber(
  {
    className,
    allowDecimals = false,
    onValueChange,
    onChange,
    value,
    defaultValue,
    min,
    max,
    ...props
  }: InputNumberProps,
  ref: React.Ref<HTMLInputElement>,
) {
  const regex = allowDecimals ? NUMBERS_AND_DECIMAL_REGEX : NUMBERS_ONLY_REGEX;

  const isControlled = value !== undefined;

  const enforceMinMax = (filtered: string) => {
    let num = allowDecimals ? parseFloat(filtered) : parseInt(filtered, 10);
    if (filtered === "" || isNaN(num)) return filtered;
    if (typeof min === "number" && num < min) num = min;
    if (typeof max === "number" && num > max) num = max;
    // Reformat to string, preserving decimal if allowed
    return allowDecimals ? String(num) : String(Math.floor(num));
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const raw = e.target.value;
    let filtered = raw.replace(regex, "");

    if (allowDecimals) {
      const parts = filtered.split(".");
      if (parts.length > 2) {
        filtered = `${parts[0]}.${parts.slice(1).join("")}`;
      }
      // Don't allow lone "."
      if (filtered.startsWith(".")) filtered = "0" + filtered;
    }

    // Enforce min/max
    filtered = enforceMinMax(filtered);

    e.target.value = filtered;
    onValueChange?.(filtered);
    onChange?.(e);
  };

  return (
    <Input
      ref={ref}
      type="text"
      inputMode="numeric"
      pattern={allowDecimals ? "[0-9.]*" : "[0-9]*"}
      autoComplete="off"
      {...(isControlled ? { value: value ?? "" } : { defaultValue: defaultValue ?? "" })}
      onChange={handleChange}
      className={cn(className)}
      {...props}
    />
  );
}

const InputNumberWithRef = React.forwardRef(InputNumber);
InputNumberWithRef.displayName = "InputNumber";

export { InputNumberWithRef as InputNumber };
