import * as React from "react";

import { cn } from "@/src/lib/utils";

interface TextareaProps extends React.ComponentProps<"textarea"> {
  showCharCount?: boolean;
}

const Textarea = React.forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({ className, showCharCount = false, maxLength, ...props }, ref) => {
    const [value, setValue] = React.useState(props.value ?? props.defaultValue ?? "");

    React.useEffect(() => {
      if (typeof props.value !== "undefined") {
        setValue(props.value);
      }
    }, [props.value]);

    const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
      if (typeof props.onChange === "function") {
        props.onChange(e);
      }
      if (typeof props.value === "undefined") {
        setValue(e.target.value);
      }
    };

    const charCount = typeof value === "string" ? value.length : 0;

    // If the char count is shown, add extra padding at the bottom of the textarea
    const textareaPaddingBottom = showCharCount ? "pb-7" : "";

    return (
      <div className="relative w-full">
        <textarea
          data-slot="textarea"
          className={cn(
            "border-input placeholder:text-muted-foreground focus-visible:border-ring focus-visible:ring-ring/50 aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive dark:bg-input/30 flex field-sizing-content min-h-16 w-full rounded-md border bg-transparent px-3 py-2 text-base shadow-xs transition-[color,box-shadow] outline-none focus-visible:ring-[3px] disabled:cursor-not-allowed disabled:opacity-50 md:text-sm",
            textareaPaddingBottom,
            className,
          )}
          ref={ref}
          maxLength={maxLength}
          {...props}
          onChange={handleChange}
        />
        {showCharCount && (
          <div className="absolute right-3 bottom-2 text-xs text-muted-foreground select-none pointer-events-none bg-background px-1">
            {charCount}
            {typeof maxLength === "number" ? `/${maxLength}` : null}
          </div>
        )}
      </div>
    );
  }
);

Textarea.displayName = "Textarea";

export { Textarea };
