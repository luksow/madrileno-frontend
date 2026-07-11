import * as LabelPrimitive from '@radix-ui/react-label'
import { createContext, use, useId, type ReactNode } from 'react'
import { cn } from '@/lib/utils'

// The a11y wiring lives here, once: a control inside a Field inherits an id the label points at,
// plus aria-invalid and aria-describedby → the error message, announced to screen readers.
export interface FieldContextValue {
  id: string
  errorId: string
  invalid: boolean
}
const FieldContext = createContext<FieldContextValue | null>(null)

/** Read the enclosing Field's a11y ids. Returns null outside a <Field> so controls stay reusable. */
export function useFieldContext(): FieldContextValue | null {
  return use(FieldContext)
}

export function Field({
  label,
  error,
  children,
  className,
}: {
  label: ReactNode
  error?: string
  children: ReactNode
  className?: string
}) {
  const id = useId()
  const value: FieldContextValue = { id, errorId: `${id}-error`, invalid: error !== undefined }
  return (
    <FieldContext value={value}>
      <div className={cn('flex flex-col gap-1.5', className)}>
        <LabelPrimitive.Root htmlFor={id} className="text-sm font-medium text-foreground">
          {label}
        </LabelPrimitive.Root>
        {children}
        {error !== undefined && (
          <p id={value.errorId} className="text-sm text-destructive">
            {error}
          </p>
        )}
      </div>
    </FieldContext>
  )
}
