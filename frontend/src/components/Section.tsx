import { cva } from 'class-variance-authority'

const sectionVariants = cva('flex flex-col gap-4 m-4 pb-4 rounded-2xl shadow-xl overflow-hidden', {
  variants: {
    variant: {
      primary: 'bg-indigo-500 border-2 border-indigo-300',
      secondary: 'bg-indigo-400 border-2 border-indigo-200',
    },
  },
})
const headerVariants = cva('p-4 shadow-xl text-center', {
  variants: {
    variant: {
      primary: 'bg-indigo-500/20 shadow-xl',
      secondary: 'bg-indigo-400 shadow-xl',
    },
  },
})
type SectionProps = {
  header: React.ReactNode
  variant?: 'primary' | 'secondary'
  className?: string
  children: React.ReactNode
}
export function Section({ header, variant = 'primary', className, children }: SectionProps) {
  return (
    <div className={sectionVariants({ variant, className })}>
      <div className={headerVariants({ variant })}>{header}</div>
      <div className="flex flex-col px-4 gap-4 min-h-0 flex-1">{children}</div>
    </div>
  )
}
