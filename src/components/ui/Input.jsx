/** Text input */
import { useId } from 'react'
import { cn } from '../../utils/helpers'

export default function Input({
  label,
  error,
  hint,
  className,
  inputClassName,
  prefix,
  readOnly,
  id,
  ...props
}) {
  const generatedId = useId()
  const inputId = id || props.name || generatedId

  return (
    <div className={cn('flex flex-col gap-1.5', className)}>
      {label ? (
        <label
          htmlFor={inputId}
          className="text-[13px] font-medium text-[#154F7A]"
        >
          {label}
        </label>
      ) : null}
      <div className="relative">
        {prefix ? (
          <span className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-sm text-ink">
            {prefix}
          </span>
        ) : null}
        <input
          id={inputId}
          readOnly={readOnly}
          aria-invalid={error ? true : undefined}
          aria-describedby={error || hint ? `${inputId}-message` : undefined}
          className={cn(
            'h-11 w-full rounded-xl border border-[#c5d4e3] bg-white px-3 text-sm text-ink placeholder:text-muted/70 transition-shadow',
            'focus:border-[#2b7de9] focus:outline-none focus:ring-2 focus:ring-[#2b7de9]/20',
            prefix && 'pl-8',
            readOnly &&
              'cursor-default border-[#c5d4e3] bg-[#f0f7ff] text-ink focus:border-[#c5d4e3] focus:ring-0',
            error && 'border-red-400 focus:ring-red-200',
            inputClassName,
          )}
          {...props}
        />
      </div>
      {error || hint ? (
        <p
          id={`${inputId}-message`}
          className={error ? 'text-xs text-red-600' : 'text-xs text-muted'}
        >
          {error || hint}
        </p>
      ) : null}
    </div>
  )
}
