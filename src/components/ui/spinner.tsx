import { Loader2Icon } from "lucide-react"

import { cn } from "@/src/lib/utils"

function Spinner({ className, ...props }: React.ComponentProps<"svg">) {
  return (
    <Loader2Icon
      role="status"
      aria-label="Loading"
      className={cn("size-4 animate-spin text-secondary", className)}
      {...props}
    />
  )
}

export { Spinner }
