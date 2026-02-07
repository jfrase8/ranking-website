import * as React from 'react'
import { Slot } from '@radix-ui/react-slot'
import { cva, type VariantProps } from 'class-variance-authority'

import { cn } from '@/lib/utils'
import { Spinner } from './spinner'

const buttonVariants = cva(
  'cursor-pointer inline-flex items-center justify-center gap-2 text-xl font-medium font-goldman whitespace-nowrap rounded-md transition-all disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none shrink-0 [&_svg]:shrink-0 outline-none focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px] aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive',
  {
    variants: {
      variant: {
        default: 'bg-primary text-primary-foreground hover:bg-primary/90 border',
        destructive:
          'bg-destructive text-white hover:bg-destructive/90 focus-visible:ring-destructive/20 dark:focus-visible:ring-destructive/40 dark:bg-destructive/60',
        outline:
          'border-primary border-2 text-primary shadow-xs hover:bg-accent hover:text-accent-foreground dark:border-input dark:hover:bg-input/50',
        secondary:
          'bg-secondary text-secondary-foreground hover:bg-primary hover:text-primary-foreground border',
        ghostPrimary:
          'text-primary-foreground hover:bg-accent hover:text-accent-foreground dark:hover:bg-accent/50',
        ghostSecondary:
          'text-primary hover:bg-accent hover:text-accent-foreground dark:hover:bg-accent/50',
        link: 'text-primary underline-offset-4 hover:underline',
      },
      size: {
        default: 'text-lg rounded-md px-4 py-2',
        sm: 'text-md rounded-md p-2',
        md: 'text-lg rounded-md p-4',
        lg: 'text-xl rounded-md p-6',
      },
      fitParent: {
        true: 'size-full rounded-none',
      },
      color: {
        destructive: true,
        darkened: true,
        gray: true,
      },
    },
    compoundVariants: [
      {
        variant: 'outline',
        color: 'destructive',
        className: 'text-destructive border-destructive hover:bg-destructive hover:text-white',
      },
      {
        variant: 'outline',
        color: 'darkened',
        className: 'text-primary-dark border-primary-dark hover:bg-primary-dark hover:text-white',
      },
      {
        variant: 'outline',
        color: 'gray',
        className:
          'text-muted-foreground border-muted-foreground hover:bg-muted-foreground hover:text-white',
      },
    ],
    defaultVariants: {
      variant: 'default',
      size: 'default',
    },
  },
)

function Button({
  className,
  variant,
  size,
  color,
  isLoading,
  fitParent,
  asChild = false,
  children,
  ...props
}: React.ComponentProps<'button'> &
  VariantProps<typeof buttonVariants> & {
    asChild?: boolean
    fitParent?: boolean
    isLoading?: boolean
  }) {
  const Comp = asChild ? Slot : 'button'

  return (
    <Comp
      data-slot="button"
      className={cn(buttonVariants({ variant, size, color, fitParent, className }))}
      {...props}
    >
      {isLoading ? <Spinner /> : children}
    </Comp>
  )
}

export { Button, buttonVariants }
