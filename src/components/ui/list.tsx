import * as React from 'react';
import { cn } from '@/lib/utils';
import type { ComponentPropsWithoutRef } from 'react';

const List = ({
  className,
  ...props
}: ComponentPropsWithoutRef<'ul'>) => (
  <ul className={cn('space-y-1', className)} {...props} />
);

const ListItem = ({
  className,
  ...props
}: ComponentPropsWithoutRef<'li'>) => (
  <li
    className={cn(
      'group/list-item flex items-center justify-between rounded-md p-2 hover:bg-muted',
      className
    )}
    {...props}
  />
);

const ListItemAction = ({
  className,
  ...props
}: ComponentPropsWithoutRef<'div'>) => (
  <div
    className={cn(
      'hidden group-hover/list-item:block group-focus-within/list-item:block',
      className
    )}
    {...props}
  />
);

export { List, ListItem, ListItemAction };
