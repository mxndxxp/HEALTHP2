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

const ListItemAction = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement> & { asChild?: boolean }
>(({ className, asChild = false, ...props }, ref) => {
  const Comp = asChild ? Slot : "div"
  return (
    <Comp
      ref={ref}
      className={cn("ml-auto opacity-0 group-hover:opacity-100 group-focus-within:opacity-100", className)}
      data-list-item-action
      {...props}
    />
  )
})
ListItemAction.displayName = "ListItemAction"

export { List, ListItem, ListItemAction }
