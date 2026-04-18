"use client";

import * as React from "react";
import { cn } from "@/src/lib/utils";
import { Input } from "@/src/components/ui/input";

export interface AutocompleteOption<
  TValue extends string | number = string | number,
> {
  label: string;
  value: TValue;
}

/**
 * Groups options under a heading (e.g. services by business sector).
 * Use either `groups` or flat `options`, not both as the primary source.
 */
export interface AutocompleteOptionGroup<
  TValue extends string | number = string | number,
> {
  /** Stable id for React keys (e.g. sector id or slug) */
  id: string;
  /** Group heading shown above its options */
  label: string;
  options: AutocompleteOption<TValue>[];
}

export type AutocompleteCommitPayload<
  TValue extends string | number = string | number,
> = {
  /** Shown text (from option or free typing) */
  label: string;
  /** Option id when chosen from the list; `null` for free-text commit */
  value: TValue | null;
};

export interface AutocompleteProps<
  TValue extends string | number = string | number,
> extends Omit<React.ComponentProps<typeof Input>, "onChange" | "value"> {
  /** Flat list; used when `groups` is omitted or empty. */
  options?: AutocompleteOption<TValue>[];
  /**
   * Grouped list; when non-empty, drives the dropdown (sector headings + options).
   */
  groups?: AutocompleteOptionGroup<TValue>[];
  /** Option values to hide (e.g. already selected ids) */
  exclude?: TValue[];
  value: string;
  onValueChange: (value: string) => void;
  onCommit: (payload: AutocompleteCommitPayload<TValue>) => void;
  emptyMessage?: string;
}

function filterOption<TValue extends string | number>(
  opt: AutocompleteOption<TValue>,
  q: string,
  excludeSet: Set<string>,
): boolean {
  return (
    !excludeSet.has(String(opt.value)) &&
    (q === "" || opt.label.toLowerCase().includes(q))
  );
}

export function Autocomplete<
  TValue extends string | number = string | number,
>({
  options = [],
  groups,
  exclude = [],
  value,
  onValueChange,
  onCommit,
  emptyMessage = "Sin coincidencias",
  className,
  disabled,
  placeholder,
  ...inputProps
}: AutocompleteProps<TValue>): React.ReactElement {
  const [open, setOpen] = React.useState(false);
  const [highlighted, setHighlighted] = React.useState(0);
  const containerRef = React.useRef<HTMLDivElement>(null);
  const inputRef = React.useRef<HTMLInputElement>(null);

  const excludeSet = React.useMemo(
    () => new Set(exclude.map((v) => String(v))),
    [exclude],
  );

  const useGrouped = Boolean(groups && groups.length > 0);

  const filteredGroups = React.useMemo(() => {
    if (!useGrouped || !groups) return null;
    const q = value.trim().toLowerCase();
    return groups
      .map((g) => ({
        ...g,
        options: g.options.filter((opt) => filterOption(opt, q, excludeSet)),
      }))
      .filter((g) => g.options.length > 0);
  }, [useGrouped, groups, excludeSet, value]);

  const filteredFlat = React.useMemo(() => {
    const q = value.trim().toLowerCase();
    return options.filter((opt) => filterOption(opt, q, excludeSet));
  }, [options, excludeSet, value]);

  const flatSelectable = React.useMemo(() => {
    if (filteredGroups) {
      return filteredGroups.flatMap((g) => g.options);
    }
    return filteredFlat;
  }, [filteredGroups, filteredFlat]);

  React.useEffect(() => {
    const onDoc = (e: MouseEvent) => {
      if (!containerRef.current?.contains(e.target as Node)) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", onDoc);
    return () => document.removeEventListener("mousedown", onDoc);
  }, []);

  React.useEffect(() => {
    setHighlighted(0);
  }, [value, open, flatSelectable.length, useGrouped]);

  const commitOption = (opt: AutocompleteOption<TValue>) => {
    onCommit({ label: opt.label, value: opt.value });
    onValueChange("");
    setOpen(false);
    inputRef.current?.blur();
  };

  const commitCustomLabel = (label: string) => {
    const v = label.trim();
    if (!v) return;
    onCommit({ label: v, value: null });
    onValueChange("");
    setOpen(false);
    inputRef.current?.blur();
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (!open && e.key === "ArrowDown") {
      setOpen(true);
    }
    if (e.key === "Enter") {
      e.preventDefault();
      if (flatSelectable.length > 0) {
        const opt = flatSelectable[highlighted] ?? flatSelectable[0];
        commitOption(opt);
      } else if (value.trim()) {
        commitCustomLabel(value);
      }
      return;
    }
    if (!open) return;

    if (e.key === "ArrowDown") {
      e.preventDefault();
      setHighlighted((i) =>
        Math.min(i + 1, Math.max(flatSelectable.length - 1, 0)),
      );
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setHighlighted((i) => Math.max(i - 1, 0));
    } else if (e.key === "Escape") {
      setOpen(false);
    }
  };

  const listEmpty = flatSelectable.length === 0;

  return (
    <div ref={containerRef} className={cn("relative w-full min-w-48", className)}>
      <Input
        ref={inputRef}
        type="text"
        role="combobox"
        aria-expanded={open}
        aria-autocomplete="list"
        disabled={disabled}
        placeholder={placeholder}
        value={value}
        onChange={(e) => {
          onValueChange(e.target.value);
          setOpen(true);
        }}
        onFocus={() => setOpen(true)}
        onKeyDown={handleKeyDown}
        {...inputProps}
      />
      {open && (
        <ul
          role="listbox"
          className="absolute z-50 mt-1 max-h-48 w-full overflow-auto rounded-md border bg-popover text-popover-foreground shadow-md"
        >
          {listEmpty ? (
            <li className="px-3 py-2 text-sm text-muted-foreground">
              {emptyMessage}
            </li>
          ) : filteredGroups ? (
            <>
              {(() => {
                let flatIndex = 0;
                return filteredGroups.map((group) => (
                  <React.Fragment key={group.id}>
                    <li
                      role="presentation"
                      className="pointer-events-none border-b border-border/60 bg-muted/40 px-3 py-1.5 text-[11px] font-semibold uppercase tracking-wide text-muted-foreground first:border-t-0"
                    >
                      {group.label}
                    </li>
                    {group.options.map((opt) => {
                      const i = flatIndex;
                      flatIndex += 1;
                      return (
                        <li
                          key={`${group.id}-${String(opt.value)}`}
                          role="option"
                          aria-selected={i === highlighted}
                          className={cn(
                            "cursor-pointer px-3 py-2 text-sm",
                            i === highlighted &&
                              "bg-accent text-accent-foreground",
                          )}
                          onMouseEnter={() => setHighlighted(i)}
                          onMouseDown={(e) => e.preventDefault()}
                          onClick={() => commitOption(opt)}
                        >
                          {opt.label}
                        </li>
                      );
                    })}
                  </React.Fragment>
                ));
              })()}
            </>
          ) : (
            filteredFlat.map((opt, i) => (
              <li
                key={`${String(opt.value)}-${opt.label}`}
                role="option"
                aria-selected={i === highlighted}
                className={cn(
                  "cursor-pointer px-3 py-2 text-sm",
                  i === highlighted && "bg-accent text-accent-foreground",
                )}
                onMouseEnter={() => setHighlighted(i)}
                onMouseDown={(e) => e.preventDefault()}
                onClick={() => commitOption(opt)}
              >
                {opt.label}
              </li>
            ))
          )}
        </ul>
      )}
    </div>
  );
}
