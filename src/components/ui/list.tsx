import * as React from 'react';
import { cn } from '@/lib/utils';
import type { ComponentPropsWithoutRef } from 'react';

// A re-usable list container
export const List = ({
  className,
  ...props
}: ComponentPropsWithoutRef<'ul'>) => (
  <ul className={cn('flex flex-col', className)} {...props} />
);

// A re-usable list item
export const ListItem = ({
  className,
  ...props
}: ComponentPropsWithoutRef<'li'>) => (
  <li
    className={cn(
      'group/list-item relative flex items-center gap-2 p-2',
      className
    )}
    {...props}
  />
);

// A re-usable list item action
export const ListItemAction = ({
  className,
  ...props
}: ComponentPropsWithoutRef<'div'>) => (
  <div
    className={cn(
      'hidden group-hover/list-item:flex group-focus-within/list-item:flex',
      className
    )}
    {...props}
  />
);
