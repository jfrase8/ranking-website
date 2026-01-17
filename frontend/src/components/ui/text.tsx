import { cva, type VariantProps } from 'class-variance-authority'

import { cn } from '@/lib/utils'

const textVariants = cva('leading-none', {
  variants: {
    variant: {
      default: 'text-base font-medium text-primary dark:text-primary-foreground',
      secondary: 'text-base font-medium text-secondary dark:text-primary-foreground',
      headerPrimary:
        'text-2xl font-semibold text-primary dark:text-primary-foreground font-goldman',
      headerSecondary:
        'text-2xl font-semibold text-secondary dark:text-secondary-foreground font-goldman',
      subText: 'text-sm font-medium text-muted-foreground dark:text-muted-foreground',
      error: 'text-sm text-destructive dark:text-destructive-foreground',
    },
  },
  defaultVariants: {
    variant: 'default',
  },
})

type TextProps = {
  className?: string
  children: React.ReactNode
} & VariantProps<typeof textVariants>
function Text({ className, children, variant, ...props }: TextProps) {
  return (
    <span data-slot="text" className={cn(textVariants({ variant, className }))} {...props}>
      {children}
    </span>
  )
}

export { Text, textVariants }
