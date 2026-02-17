import {
  useCallback,
  useEffect,
  useRef,
  useState,
  type ComponentProps,
  type CSSProperties,
  type FormEvent,
} from 'react'

import { cn } from '@/lib/utils'

interface InputProps extends ComponentProps<'input'> {
  autoSize?: boolean
  maxWidth?: number | string
  minWidth?: number | string
}

function Input({
  className,
  type,
  autoSize,
  maxWidth = '100%',
  minWidth = '2rem',
  style,
  ...props
}: InputProps) {
  const [width, setWidth] = useState<number | undefined>(undefined)
  const sizerRef = useRef<HTMLSpanElement>(null)
  const inputRef = useRef<HTMLInputElement>(null)

  const syncWidth = useCallback(() => {
    if (!autoSize || !sizerRef.current || !inputRef.current) return
    const sizer = sizerRef.current
    const input = inputRef.current

    // Read computed styles from the actual input element so sizing is exact,
    // regardless of what classes (e.g. md:text-sm) are applied to it
    const computed = window.getComputedStyle(input)
    sizer.style.fontSize = computed.fontSize
    sizer.style.fontFamily = computed.fontFamily
    sizer.style.fontWeight = computed.fontWeight
    sizer.style.letterSpacing = computed.letterSpacing
    sizer.style.paddingInlineStart = computed.paddingInlineStart
    sizer.style.paddingInlineEnd = computed.paddingInlineEnd

    const text = input.value || input.placeholder || ''
    sizer.textContent = text || '\u200b'
    setWidth(sizer.offsetWidth + 4)
  }, [autoSize])

  useEffect(() => {
    if (autoSize) syncWidth()
  }, [props.value, props.defaultValue, autoSize, syncWidth])

  const handleInput = (e: FormEvent<HTMLInputElement>) => {
    syncWidth()
    props.onInput?.(e)
  }

  const computedStyle: CSSProperties = autoSize
    ? {
        width: width !== undefined ? width : undefined,
        maxWidth,
        minWidth,
        ...style,
      }
    : { ...style }

  return (
    <>
      {autoSize && (
        <span
          ref={sizerRef}
          aria-hidden
          style={{
            position: 'absolute',
            visibility: 'hidden',
            whiteSpace: 'pre',
          }}
        />
      )}
      <input
        ref={inputRef}
        type={type}
        data-slot="input"
        onInput={handleInput}
        style={computedStyle}
        className={cn(
          'bg-secondary file:text-foreground placeholder:text-muted-foreground selection:bg-primary selection:text-primary-foreground dark:bg-input/30 border-primary h-9 min-w-0 rounded-md border px-3 py-1 text-base shadow-xs transition-[color,box-shadow,width] outline-none file:inline-flex file:h-7 file:border-0 file:bg-transparent file:text-sm file:font-medium disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50 md:text-sm',
          !autoSize && 'w-full',
          'focus-visible:ring-ring focus-visible:ring-[3px]',
          'aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive',
          className,
        )}
        {...props}
      />
    </>
  )
}

export { Input }
export type { InputProps }
