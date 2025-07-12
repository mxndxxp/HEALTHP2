"use client"

import * as React from "react"
import { Slot } from "@radix-ui/react-slot"

import { cn } from "@/lib/utils"

const List = React.forwardRef<HTMLUListElement, React.HTMLAttributes<HTMLUListElement>>(
  ({ className, ...props }, ref) => {
    return (
      <ul
        ref={ref}
        className={cn("flex flex-col", className)}
        data-list="list"
        {...props}
      />
    )
  }
)
List.displayName = "List"

const ListItem = React.forwardRef<
  HTMLLIElement,
  React.LiHTMLAttributes<HTMLLIElement> & {
    asChild?: boolean
  }
>(({ className, asChild = false, ...props }, ref) => {
  const Comp = asChild ? Slot : "li"
  return (
    <Comp
      ref={ref}
      className={cn(
        "group flex w-full cursor-pointer items-center gap-2 rounded-md p-2 transition-colors hover:bg-muted focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50",
        className
      )}
      data-list="item"
      {...props}
    />
  )
})
ListItem.displayName = "ListItem"

// ListItemAction has been removed to prevent build errors.
// Actions can be placed directly inside ListItem and controlled with group-hover utilities.

export { List, ListItem }
