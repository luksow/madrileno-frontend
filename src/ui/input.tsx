import type { ComponentProps } from 'react'
import { cn } from '@/lib/utils'
import { useFieldContext } from '@/ui/field'

export function Input({
  className,
  id,
  'aria-invalid': ariaInvalid,
  'aria-describedby': describedBy,
  ...props
}: ComponentProps<'input'>) {
  // Inside a <Field>, inherit its id + aria wiring; explicit props still win.
  const field = useFieldContext()
  return (
    <input
      id={id ?? field?.id}
      aria-invalid={ariaInvalid ?? (field?.invalid ? true : undefined)}
      aria-describedby={describedBy ?? (field?.invalid ? field.errorId : undefined)}
      className={cn(
        'flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm',
        'placeholder:text-muted-foreground',
        'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background',
        'aria-[invalid=true]:border-destructive aria-[invalid=true]:ring-destructive',
        'disabled:cursor-not-allowed disabled:opacity-50',
        className,
      )}
      {...props}
    />
  )
}
