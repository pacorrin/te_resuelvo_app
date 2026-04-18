"use client";

import * as React from "react";
import {
  CheckIcon,
  ChevronDownIcon,
  ChevronUpIcon,
  SearchIcon,
} from "lucide-react";
import { Select as SelectPrimitive } from "radix-ui";

import { cn } from "@/src/lib/utils";

function getTextFromNode(node: React.ReactNode): string {
  if (node == null || typeof node === "boolean") return "";
  if (typeof node === "string" || typeof node === "number") return String(node);
  if (Array.isArray(node)) return node.map(getTextFromNode).join(" ");
  if (React.isValidElement(node)) {
    const p = node.props as { children?: React.ReactNode };
    if (p.children != null) return getTextFromNode(p.children);
  }
  return "";
}

function Select({
  ...props
}: React.ComponentProps<typeof SelectPrimitive.Root>) {
  return <SelectPrimitive.Root data-slot="select" {...props} />;
}

function SelectGroup({
  ...props
}: React.ComponentProps<typeof SelectPrimitive.Group>) {
  return <SelectPrimitive.Group data-slot="select-group" {...props} />;
}

function SelectValue({
  ...props
}: React.ComponentProps<typeof SelectPrimitive.Value>) {
  return <SelectPrimitive.Value data-slot="select-value" {...props} />;
}

function SelectTrigger({
  className,
  size = "default",
  children,
  ...props
}: React.ComponentProps<typeof SelectPrimitive.Trigger> & {
  size?: "sm" | "default";
}) {
  return (
    <SelectPrimitive.Trigger
      data-slot="select-trigger"
      data-size={size}
      className={cn(
        "border-input data-[placeholder]:text-muted-foreground [&_svg:not([class*='text-'])]:text-muted-foreground focus-visible:border-ring focus-visible:ring-ring/50 aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive dark:bg-input/30 dark:hover:bg-input/50 flex w-fit items-center justify-between gap-2 rounded-md border bg-transparent px-3 py-2 text-sm whitespace-nowrap shadow-xs transition-[color,box-shadow] outline-none focus-visible:ring-[3px] disabled:cursor-not-allowed disabled:opacity-50 data-[size=default]:h-9 data-[size=sm]:h-8 *:data-[slot=select-value]:line-clamp-1 *:data-[slot=select-value]:flex *:data-[slot=select-value]:items-center *:data-[slot=select-value]:gap-2 [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4",
        className,
      )}
      {...props}
    >
      {children}
      <SelectPrimitive.Icon asChild>
        <ChevronDownIcon className="size-4 opacity-50" />
      </SelectPrimitive.Icon>
    </SelectPrimitive.Trigger>
  );
}

function SelectLabel({
  className,
  ...props
}: React.ComponentProps<typeof SelectPrimitive.Label>) {
  return (
    <SelectPrimitive.Label
      data-slot="select-label"
      className={cn("text-muted-foreground px-2 py-1.5 text-xs", className)}
      {...props}
    />
  );
}

function SelectItem({
  className,
  children,
  ...props
}: React.ComponentProps<typeof SelectPrimitive.Item>) {
  return (
    <SelectPrimitive.Item
      data-slot="select-item"
      className={cn(
        "focus:bg-accent focus:text-accent-foreground [&_svg:not([class*='text-'])]:text-muted-foreground relative flex w-full cursor-default items-center gap-2 rounded-sm py-1.5 pr-8 pl-2 text-sm outline-hidden select-none data-[disabled]:pointer-events-none data-[disabled]:opacity-50 [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4 *:[span]:last:flex *:[span]:last:items-center *:[span]:last:gap-2",
        className,
      )}
      {...props}
    >
      <span
        data-slot="select-item-indicator"
        className="absolute right-2 flex size-3.5 items-center justify-center"
      >
        <SelectPrimitive.ItemIndicator>
          <CheckIcon className="size-4" />
        </SelectPrimitive.ItemIndicator>
      </span>
      <SelectPrimitive.ItemText>{children}</SelectPrimitive.ItemText>
    </SelectPrimitive.Item>
  );
}

function filterSelectChildren(
  children: React.ReactNode,
  query: string,
  SelectGroupImpl: typeof SelectGroup,
  SelectLabelImpl: typeof SelectLabel,
  SelectItemImpl: typeof SelectItem,
): React.ReactNode {
  const q = query.trim().toLowerCase();
  if (!q) return children;

  const list = React.Children.toArray(children);
  const out: React.ReactNode[] = [];

  for (const child of list) {
    if (!React.isValidElement(child)) continue;

    if (child.type === SelectGroupImpl) {
      const gc = React.Children.toArray(
        (child.props as { children?: React.ReactNode }).children,
      );
      const labelEl = gc.find(
        (c) => React.isValidElement(c) && c.type === SelectLabelImpl,
      ) as React.ReactElement | undefined;
      const labelText = labelEl
        ? getTextFromNode(
            (labelEl.props as { children?: React.ReactNode }).children,
          )
        : "";
      const labelMatches = labelText.toLowerCase().includes(q);
      const items = gc.filter(
        (c) => React.isValidElement(c) && c.type === SelectItemImpl,
      ) as React.ReactElement[];
      const kept = items.filter((item) => {
        const ip = item.props as { children?: React.ReactNode; value?: string };
        const itemText = getTextFromNode(ip.children);
        const valueStr = String(ip.value ?? "").toLowerCase();
        return (
          labelMatches ||
          itemText.toLowerCase().includes(q) ||
          valueStr.includes(q)
        );
      });
      if (kept.length > 0) {
        out.push(
          React.cloneElement(child, { key: child.key }, [
            ...(labelEl ? [labelEl] : []),
            ...kept,
          ]),
        );
      }
    } else if (child.type === SelectItemImpl) {
      const itemText = getTextFromNode(
        (child.props as { children?: React.ReactNode }).children,
      );
      const valueStr = String(
        (child.props as { value: string }).value ?? "",
      ).toLowerCase();
      if (itemText.toLowerCase().includes(q) || valueStr.includes(q)) {
        out.push(child);
      }
    } else {
      out.push(child);
    }
  }

  return <>{out}</>;
}

function countSelectItems(
  node: React.ReactNode,
  SelectItemImpl: typeof SelectItem,
): number {
  let n = 0;
  const walk = (el: React.ReactNode) => {
    React.Children.forEach(el, (c) => {
      if (!React.isValidElement(c)) return;
      if (c.type === SelectItemImpl) n += 1;
      else {
        const p = c.props as { children?: React.ReactNode };
        if (p.children != null) walk(p.children);
      }
    });
  };
  walk(node);
  return n;
}

type RadixSelectContentProps = React.ComponentPropsWithoutRef<
  typeof SelectPrimitive.Content
>;

export type SelectContentProps = RadixSelectContentProps & {
  searchable?: boolean;
  searchPlaceholder?: string;
};

/** Radix typings omit searchable layout and some focus props; runtime matches. */
// eslint-disable-next-line @typescript-eslint/no-explicit-any -- Radix Select.Content overloads omit our props
const RadixSelectContent = SelectPrimitive.Content as any;

function SelectContent({
  className,
  children,
  position = "item-aligned",
  align = "center",
  searchable = false,
  searchPlaceholder = "Buscar…",
  ...props
}: SelectContentProps) {
  /** Radix Select v2 Content does not consume onOpenAutoFocus (it lands on the listbox div → React 19 warning). */
  const rest = props as RadixSelectContentProps & {
    onCloseAutoFocus?: (e: Event) => void;
    onOpenAutoFocus?: (e: Event) => void;
  };
  const { onCloseAutoFocus, onOpenAutoFocus: _omitOpenAutoFocus, ...radixRest } =
    rest;
  const [searchQuery, setSearchQuery] = React.useState("");
  const searchInputRef = React.useRef<HTMLInputElement>(null);

  React.useLayoutEffect(() => {
    if (!searchable) return;
    const id = window.requestAnimationFrame(() => {
      window.requestAnimationFrame(() => searchInputRef.current?.focus());
    });
    return () => window.cancelAnimationFrame(id);
  }, [searchable]);

  const filteredChildren = React.useMemo(
    () =>
      searchable && searchQuery.trim()
        ? filterSelectChildren(
            children,
            searchQuery,
            SelectGroup,
            SelectLabel,
            SelectItem,
          )
        : children,
    [children, searchQuery, searchable],
  );

  const visibleCount = React.useMemo(
    () => countSelectItems(filteredChildren, SelectItem),
    [filteredChildren],
  );

  const showEmpty =
    searchable && searchQuery.trim().length > 0 && visibleCount === 0;

  const viewportInner = showEmpty ? (
    <div className="text-muted-foreground py-6 text-center text-sm">
      Sin coincidencias
    </div>
  ) : (
    filteredChildren
  );

  return (
    <SelectPrimitive.Portal>
      <RadixSelectContent
        {...(radixRest as RadixSelectContentProps)}
        data-slot="select-content"
        className={cn(
          "bg-popover text-popover-foreground data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2 relative z-50 min-w-[8rem] origin-(--radix-select-content-transform-origin) rounded-md border shadow-md",
          searchable
            ? "flex max-h-[min(24rem,var(--radix-select-content-available-height))] flex-col overflow-hidden p-0"
            : "max-h-(--radix-select-content-available-height) overflow-x-hidden overflow-y-auto",
          position === "popper" &&
            "data-[side=bottom]:translate-y-1 data-[side=left]:-translate-x-1 data-[side=right]:translate-x-1 data-[side=top]:-translate-y-1",
          className,
        )}
        position={position}
        align={align}
        onCloseAutoFocus={(e: Event) => {
          if (searchable) setSearchQuery("");
          onCloseAutoFocus?.(e);
        }}
      >
        <SelectScrollUpButton />
        {searchable ? (
          <div className="border-border bg-popover sticky top-0 z-10 border-b px-2 py-2">
            <div className="relative">
              <SearchIcon className="text-muted-foreground pointer-events-none absolute top-1/2 left-2 size-4 -translate-y-1/2" />
              <input
                ref={searchInputRef}
                type="search"
                role="searchbox"
                placeholder={searchPlaceholder}
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onKeyDown={(e) => e.stopPropagation()}
                className="border-input bg-background placeholder:text-muted-foreground h-9 w-full rounded-md border pr-3 pl-8 text-sm shadow-xs outline-none focus-visible:ring-[2px] focus-visible:ring-ring"
                aria-label={searchPlaceholder}
              />
            </div>
          </div>
        ) : null}
        <SelectPrimitive.Viewport
          className={cn(
            "p-1",
            !searchable &&
              position === "popper" &&
              "h-[var(--radix-select-trigger-height)] w-full min-w-[var(--radix-select-trigger-width)] scroll-my-1",
            searchable &&
              "max-h-[min(18rem,calc(var(--radix-select-content-available-height)-3.25rem))] flex-1 overflow-y-auto overflow-x-hidden",
            searchable &&
              position === "popper" &&
              "min-h-0 w-full min-w-[var(--radix-select-trigger-width)]",
          )}
        >
          {viewportInner}
        </SelectPrimitive.Viewport>
        <SelectScrollDownButton />
      </RadixSelectContent>
    </SelectPrimitive.Portal>
  );
}

function SelectSeparator({
  className,
  ...props
}: React.ComponentProps<typeof SelectPrimitive.Separator>) {
  return (
    <SelectPrimitive.Separator
      data-slot="select-separator"
      className={cn("bg-border pointer-events-none -mx-1 my-1 h-px", className)}
      {...props}
    />
  );
}

function SelectScrollUpButton({
  className,
  ...props
}: React.ComponentProps<typeof SelectPrimitive.ScrollUpButton>) {
  return (
    <SelectPrimitive.ScrollUpButton
      data-slot="select-scroll-up-button"
      className={cn(
        "flex cursor-default items-center justify-center py-1",
        className,
      )}
      {...props}
    >
      <ChevronUpIcon className="size-4" />
    </SelectPrimitive.ScrollUpButton>
  );
}

function SelectScrollDownButton({
  className,
  ...props
}: React.ComponentProps<typeof SelectPrimitive.ScrollDownButton>) {
  return (
    <SelectPrimitive.ScrollDownButton
      data-slot="select-scroll-down-button"
      className={cn(
        "flex cursor-default items-center justify-center py-1",
        className,
      )}
      {...props}
    >
      <ChevronDownIcon className="size-4" />
    </SelectPrimitive.ScrollDownButton>
  );
}

export {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectScrollDownButton,
  SelectScrollUpButton,
  SelectSeparator,
  SelectTrigger,
  SelectValue,
};
